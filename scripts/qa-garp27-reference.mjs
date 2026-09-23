#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qadir = path.join(root, 'qa-results', 'garp27');
fs.mkdirSync(qadir, { recursive: true });
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const rel = file => path.relative(root, file).replaceAll('\\', '/');

const pinPath = path.join(root, 'security', 'garp27', 'UPSTREAM-PIN.json');
const pin = readJson(pinPath);
const checks = [];
for (const item of pin.files || []) {
  const file = path.join(root, item.path);
  const exists = fs.existsSync(file);
  const actual = exists ? sha256(file) : null;
  checks.push({ id: `upstream:${item.path}`, pass: exists && actual === item.sha256, expectedSha256: item.sha256, actualSha256: actual });
}
const pinPass = checks.every(item => item.pass);

function runNode(id, script, args = [], expected = 0) {
  const r = spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: 'utf8' });
  let parsed = null;
  try { parsed = JSON.parse((r.stdout || '').trim()); } catch {}
  return {
    id,
    expectedExit: expected,
    actualExit: r.status,
    pass: r.status === expected,
    output: parsed,
    stdout: parsed ? undefined : (r.stdout || '').trim(),
    stderr: (r.stderr || '').trim()
  };
}

const refTools = path.join(root, 'security', 'garp27', 'reference', 'TOOLS');
const core = path.join(root, 'security', 'garp27', 'reference', 'CONTRACTS', 'garp27-core.json');
const policy = path.join(root, 'security', 'garp27', 'garp27-policy.json');
const profile = path.join(root, 'security', 'garp27', 'application-migration-profile.json');
const live = path.join(root, 'security', 'garp27', 'live-status.deferred.json');
const runs = [
  runNode('reference-contract-selftest', path.join(refTools, 'contract-selftest.mjs'), [], 0),
  runNode('application-policy-validation', path.join(refTools, 'validate-policy.mjs'), [policy, '--core', core], 0),
  runNode('deferred-live-must-be-not-tested', path.join(refTools, 'validate-live-status.mjs'), [live, '--profile', profile], 3)
];
const pass = pinPass && runs.every(item => item.pass);
const result = {
  classification: 'GARP27_REFERENCE_ADAPTER_TEST',
  status: pass ? 'PASS' : 'FAIL',
  garpVersion: '2.7',
  consolidationRevision: pin.consolidationRevision,
  upstreamSourcePackageSha256: pin.sourcePackageSha256,
  upstreamFilesChecked: checks.length,
  upstreamFilesPassed: checks.filter(item => item.pass).length,
  checks,
  runs,
  appBehaviorTest: false,
  liveTest: false,
  note: 'Reference contract integrity and semantics only; this is not a LIVE security claim.'
};
const out = path.join(qadir, 'reference-result.json');
fs.writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ status: result.status, output: rel(out), upstream: `${result.upstreamFilesPassed}/${result.upstreamFilesChecked}`, contractSelftest: runs[0].output?.status || runs[0].actualExit, policy: runs[1].output?.status || runs[1].actualExit, deferredLiveExit: runs[2].actualExit }, null, 2));
process.exit(pass ? 0 : 1);
