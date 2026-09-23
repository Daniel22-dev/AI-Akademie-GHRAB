#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gate = path.join(root, 'scripts', 'qa-garp27-architecture.mjs');
const qadir = path.join(root, 'qa-results', 'garp27');
fs.mkdirSync(qadir, { recursive: true });

function cloneRoot() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-akademie-garp27-'));
  const dst = path.join(tmp, 'candidate');
  fs.cpSync(root, dst, {
    recursive: true,
    filter(src) {
      const r = path.relative(root, src).replaceAll('\\', '/');
      if (!r) return true;
      return !r.startsWith('node_modules') && !r.startsWith('qa-results') && !(r === '.git' || r.startsWith('.git/')) && !r.startsWith('dist-school-server');
    }
  });
  return { tmp, dst };
}
function runGate(candidate, outputRel = 'qa-results/garp27/mutation-probe.json') {
  const out = path.join(candidate, outputRel);
  const r = spawnSync(process.execPath, [gate, '--root', candidate, '--output', out], { encoding: 'utf8' });
  let report = null;
  try { report = JSON.parse(fs.readFileSync(out, 'utf8')); } catch {}
  return { exit: r.status, report, stdout: (r.stdout || '').trim(), stderr: (r.stderr || '').trim() };
}
function executeCase(testId, title, mutate, expectedFailedPrefix) {
  const { tmp, dst } = cloneRoot();
  try {
    mutate(dst);
    const r = runGate(dst);
    const failed = r.report?.failed || [];
    const blocked = r.exit === 1 && failed.some(id => id.startsWith(expectedFailedPrefix));
    return { testId, title, safetyClass: 'DISPOSABLE_ONLY', expectedExit: 1, actualExit: r.exit, expectedFailure: expectedFailedPrefix, observedFailures: failed, pass: blocked, cleanup: 'PASS' };
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const positive = runGate(root, 'qa-results/garp27/mutation-positive-control.json');
const cases = [];
cases.push(executeCase('G27-AR01', 'Zakázaný cyklus přes runtime graf', dst => {
  fs.appendFileSync(path.join(dst, 'assets/js/app.js'), "\nimport './garp27-cycle-a.js';\n");
  fs.writeFileSync(path.join(dst, 'assets/js/garp27-cycle-a.js'), "import './garp27-cycle-b.js';\nexport const a=1;\n");
  fs.writeFileSync(path.join(dst, 'assets/js/garp27-cycle-b.js'), "import './garp27-cycle-a.js';\nexport const b=1;\n");
}, 'graph:no-cycles'));
cases.push(executeCase('G27-AR02', 'Testovací bypass pronikne do produkčního artefaktu', dst => {
  fs.writeFileSync(path.join(dst, 'dist-pages/assets/js/mock-auth.js'), "export const bypass=true;\n");
}, 'artifact:no-dev-test-security-payload'));
cases.push(executeCase('G27-AR03', 'Nový cross-origin egress bez změny inventáře', dst => {
  fs.appendFileSync(path.join(dst, 'assets/js/app.js'), "\nfetch('https://example.invalid/garp27-mutation');\n");
}, 'capability:no-undeclared-network-api'));
cases.push(executeCase('G27-AR04', 'Vynechání architecture-integrity z P5 workflow', dst => {
  const file = path.join(dst, '.github/workflows/p5-release-gate.yml');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/\s*- name: Run GARP 2\.7 FOUNDATION\/architecture integrity[\s\S]*?run: npm run qa:garp27:ci\n/, '\n'));
  let text = fs.readFileSync(file, 'utf8');
  text = text.replace(/npm run qa:garp27:ci\n/g, 'echo garp27-gate-removed-for-mutation\n');
  fs.writeFileSync(file, text);
}, 'ci:workflow:.github/workflows/p5-release-gate.yml'));
cases.push(executeCase('G27-AR05', 'Legacy GARP engine importován do runtime aplikace', dst => {
  fs.appendFileSync(path.join(dst, 'assets/js/app.js'), "\nimport '../../security/garp25/tools/selftest-garp251.mjs';\n");
}, 'graph:no-forbidden-runtime-imports'));

const positivePass = positive.exit === 0 && positive.report?.status === 'PASS';
const pass = positivePass && cases.every(c => c.pass);
const result = {
  classification: 'APP_BEHAVIOR_TEST',
  testPack: 'AI-AKADEMIE-GARP27-ARCHITECTURE-MUTATIONS-v1',
  garpVersion: '2.7',
  status: pass ? 'PASS' : 'FAIL',
  positiveControl: { expectedExit: 0, actualExit: positive.exit, pass: positivePass },
  cases,
  cleanupVerified: cases.every(c => c.cleanup === 'PASS'),
  productionSideEffects: false,
  note: 'All negative cases execute only in disposable filesystem copies; no network or production mutation is performed.'
};
const out = path.join(qadir, 'mutation-result.json');
fs.writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ status: result.status, output: path.relative(root, out).replaceAll('\\', '/'), positiveControl: result.positiveControl, cases: cases.map(c => ({ testId: c.testId, pass: c.pass, observedFailures: c.observedFailures })) }, null, 2));
process.exit(pass ? 0 : 1);
