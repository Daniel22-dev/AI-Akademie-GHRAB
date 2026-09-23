#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const trustedTool = path.join(root, 'scripts', 'qa-garp27-trusted-admission.mjs');
const bundleTool = path.join(root, 'scripts', 'qa-garp27-verify-p5-bundle.mjs');
const architectureTool = path.join(root, 'scripts', 'qa-garp27-architecture.mjs');
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const qadir = path.join(root, 'qa-results', 'garp27');
fs.mkdirSync(qadir, { recursive: true });

function cloneRoot() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-akademie-garp27-trusted-'));
  const dst = path.join(tmp, 'candidate');
  fs.cpSync(root, dst, {
    recursive: true,
    filter(src) {
      const r = path.relative(root, src).replaceAll('\\', '/');
      if (!r) return true;
      return !r.startsWith('node_modules') && !r.startsWith('qa-results') && !(r === '.git' || r.startsWith('.git/')) && !r.startsWith('dist-school-server');
    }
  });
  const p5Arch = path.join(dst, 'qa-results', 'garp27', 'architecture-result.json');
  fs.mkdirSync(path.dirname(p5Arch), { recursive: true });
  const prep = spawnSync(process.execPath, [architectureTool, '--root', dst, '--output', p5Arch], { cwd: root, encoding: 'utf8' });
  if (prep.status !== 0) throw new Error(`failed to prepare P5 architecture evidence: ${prep.stderr || prep.stdout}`);
  return { tmp, dst };
}
function run(candidate) {
  const r = spawnSync(process.execPath, [trustedTool, candidate, root], { cwd: root, encoding: 'utf8' });
  let output = null;
  try { output = JSON.parse((r.stdout || '').trim()); } catch {}
  return { exit: r.status, output, stderr: (r.stderr || '').trim() };
}
function one(id, expectedExit, mutate, expectedFailure = null) {
  const { tmp, dst } = cloneRoot();
  try {
    mutate?.(dst);
    const r = run(dst);
    const failures = r.output?.failed || [];
    const pass = r.exit === expectedExit && (!expectedFailure || failures.some(x => x.startsWith(expectedFailure)));
    return { id, expectedExit, actualExit: r.exit, expectedFailure, observedFailures: failures, pass, cleanup: 'PASS' };
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}
function walkFiles(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name,'en'))) {
    const abs = path.join(dir, e.name), rel = path.posix.join(base, e.name);
    if (e.isDirectory()) out.push(...walkFiles(abs, rel));
    else if (e.isFile()) out.push({ path: rel, sha256: sha256(fs.readFileSync(abs)), size: fs.statSync(abs).size });
  }
  return out;
}
function makeSyntheticBundle(candidate, expectedSha) {
  const bundle = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-akademie-garp27-bundle-'));
  fs.cpSync(path.join(candidate, 'dist-pages'), path.join(bundle, 'dist-pages'), { recursive: true });
  const files = walkFiles(path.join(bundle, 'dist-pages'));
  const artifactSha = sha256(Buffer.from(files.map(f=>`${f.sha256}  ${f.path}\n`).join('')));
  const pkg = JSON.parse(fs.readFileSync(path.join(candidate, 'package.json'), 'utf8'));
  const sbomRel = `security/sbom/ai-akademie-${pkg.version}.cdx.json`;
  const sbomPath = path.join(bundle, sbomRel);
  fs.mkdirSync(path.dirname(sbomPath), { recursive: true });
  fs.writeFileSync(sbomPath, JSON.stringify({ bomFormat:'CycloneDX', specVersion:'1.6', version:1, metadata:{ component:{ name:'ai-akademie', version:pkg.version } } }, null, 2) + '\n');
  const evidence = {
    schema:'ghrab-current-release-evidence-v1', appId:'ai-akademie', version:pkg.version, sourceCommit:expectedSha,
    artifact:{ root:'dist-pages', sha256:artifactSha, fileCount:files.length },
    sbom:{ path:sbomRel, sha256:sha256(fs.readFileSync(sbomPath)) }
  };
  const releasePath = path.join(bundle, 'qa-results/release-current/current-release-evidence.json');
  fs.mkdirSync(path.dirname(releasePath), { recursive: true });
  fs.writeFileSync(releasePath, JSON.stringify(evidence, null, 2) + '\n');
  const garp = path.join(bundle, 'qa-results/garp27');
  fs.mkdirSync(garp, { recursive: true });
  fs.writeFileSync(path.join(garp, 'reference-result.json'), JSON.stringify({status:'PASS'})+'\n');
  fs.writeFileSync(path.join(garp, 'architecture-result.json'), JSON.stringify({status:'PASS',binding:{candidateDigestSha256:'synthetic'}})+'\n');
  fs.writeFileSync(path.join(garp, 'mutation-result.json'), JSON.stringify({status:'PASS'})+'\n');
  fs.writeFileSync(path.join(garp, 'trusted-admission-selftest.json'), JSON.stringify({status:'PASS'})+'\n');
  fs.writeFileSync(path.join(garp, 'assurance-result.json'), JSON.stringify({status:'PASS',sourceIdentity:{bound:true,value:expectedSha},liveStatus:'NOT_TESTED',serverLiveClaim:false})+'\n');
  return bundle;
}
function runBundle(bundle, candidate, expectedSha) {
  const r = spawnSync(process.execPath, [bundleTool, bundle, candidate, expectedSha], { cwd: root, encoding:'utf8' });
  let output = null;
  try { output = JSON.parse((r.stdout || '').trim()); } catch {}
  return { exit:r.status, output, stderr:(r.stderr || '').trim() };
}
function bundleCase(id, mutate, expectedExit, expectedFailure) {
  const { tmp, dst } = cloneRoot();
  const expectedSha = '1234567890abcdef1234567890abcdef12345678';
  let bundle;
  try {
    bundle = makeSyntheticBundle(dst, expectedSha);
    mutate?.(bundle, dst, expectedSha);
    const r = runBundle(bundle, dst, expectedSha);
    const failures = r.output?.failed || [];
    return { id, expectedExit, actualExit:r.exit, expectedFailure, observedFailures:failures, pass:r.exit===expectedExit && (!expectedFailure || failures.some(x=>x.startsWith(expectedFailure))), cleanup:'PASS' };
  } finally {
    if (bundle) fs.rmSync(bundle, { recursive:true, force:true });
    fs.rmSync(tmp, { recursive:true, force:true });
  }
}

const cases = [
  one('TRUST-01-positive-identical-candidate', 0, null),
  one('TRUST-02-reject-policy-scope-weakening', 1, dst => {
    const p = path.join(dst, 'security/garp27/architecture-policy.json');
    const x = JSON.parse(fs.readFileSync(p, 'utf8'));
    x.runtimeSourceRoots = ['assets/js'];
    fs.writeFileSync(p, JSON.stringify(x, null, 2) + '\n');
  }, 'trusted-policy-shape:security/garp27/architecture-policy.json'),
  one('TRUST-03-reject-gate-self-modification', 1, dst => {
    fs.appendFileSync(path.join(dst, 'scripts/qa-garp27-architecture.mjs'), '\n// mutation: weakened gate\n');
  }, 'trusted-bytes:scripts/qa-garp27-architecture.mjs'),
  one('TRUST-04-reject-npm-gate-redefinition', 1, dst => {
    const p = path.join(dst, 'package.json');
    const x = JSON.parse(fs.readFileSync(p, 'utf8'));
    x.scripts['qa:garp27:ci'] = 'echo bypass';
    fs.writeFileSync(p, JSON.stringify(x, null, 2) + '\n');
  }, 'trusted-package-script:qa:garp27:ci'),
  one('TRUST-05-reject-safe-promotion-change', 1, dst => {
    fs.appendFileSync(path.join(dst, '.github/workflows/safe-promotion.yml'), '\n# mutation: weaken future promotion\n');
  }, 'trusted-bytes:.github/workflows/safe-promotion.yml'),
  one('TRUST-06-reject-legacy-garp25-change', 1, dst => {
    fs.appendFileSync(path.join(dst, 'security/garp25/tools/selftest-garp251.mjs'), '\n// mutation: legacy control-plane drift\n');
  }, 'trusted-bytes:security/garp25/tools/selftest-garp251.mjs'),
  bundleCase('BUNDLE-01-positive-bound-artifact', null, 0, null),
  bundleCase('BUNDLE-02-reject-runtime-tamper', bundle => {
    fs.appendFileSync(path.join(bundle, 'dist-pages/index.html'), '\n<!-- tampered after P5 -->\n');
  }, 1, 'runtime-artifact:digest'),
  bundleCase('BUNDLE-03-reject-source-sha-mismatch', bundle => {
    const p = path.join(bundle, 'qa-results/release-current/current-release-evidence.json');
    const x = JSON.parse(fs.readFileSync(p, 'utf8'));
    x.sourceCommit = 'ffffffffffffffffffffffffffffffffffffffff';
    fs.writeFileSync(p, JSON.stringify(x, null, 2) + '\n');
  }, 1, 'release-evidence:source-sha')
];
const pass = cases.every(c => c.pass);
const result = {
  classification: 'CONTRACT_TEST',
  testPack: 'AI-AKADEMIE-GARP27-TRUSTED-ADMISSION-SELFTEST-v2',
  status: pass ? 'PASS' : 'FAIL',
  cases,
  repositoryEnforcementVerified: false,
  note: 'This proves trusted-admission anti-self-modification and P5 bundle binding in disposable local copies. Activation as a required GitHub check and actual workflow_run behavior must still be verified on GitHub after bootstrap.'
};
const out = path.join(qadir, 'trusted-admission-selftest.json');
fs.writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ status: result.status, output: path.relative(root, out).replaceAll('\\','/'), cases: cases.map(c => ({ id:c.id, pass:c.pass, observedFailures:c.observedFailures })) }, null, 2));
process.exit(pass ? 0 : 1);
