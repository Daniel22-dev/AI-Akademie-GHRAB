#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('usage: qa-garp27-trusted-admission.mjs CANDIDATE_ROOT TRUSTED_ROOT');
  process.exit(2);
}
const candidate = path.resolve(args[0]);
const trusted = path.resolve(args[1]);
const currentScript = fileURLToPath(import.meta.url);
const checks = [];
const failCheck = (id, detail) => checks.push({ id, pass: false, detail });
const passCheck = (id, detail) => checks.push({ id, pass: true, ...(detail ? { detail } : {}) });
const read = p => fs.readFileSync(p);
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const existsRegular = p => {
  try { return fs.lstatSync(p).isFile(); } catch { return false; }
};
const sameBytes = (rel) => {
  const a = path.join(candidate, rel), b = path.join(trusted, rel);
  if (!existsRegular(a) || !existsRegular(b)) { failCheck(`trusted-bytes:${rel}`, 'missing or non-regular file'); return; }
  Buffer.compare(read(a), read(b)) === 0 ? passCheck(`trusted-bytes:${rel}`) : failCheck(`trusted-bytes:${rel}`, 'candidate changed trust-critical file');
};
const clone = x => JSON.parse(JSON.stringify(x));
function normalizedJson(rel) {
  const c = clone(readJson(path.join(candidate, rel)));
  const t = clone(readJson(path.join(trusted, rel)));
  for (const x of [c, t]) {
    delete x.appVersion;
    if (x.releaseIdentity) { delete x.releaseIdentity.appVersion; delete x.releaseIdentity.sourceCommit; }
  }
  const cs = JSON.stringify(c), ts = JSON.stringify(t);
  cs === ts ? passCheck(`trusted-policy-shape:${rel}`) : failCheck(`trusted-policy-shape:${rel}`, 'candidate changed trust semantics; use separate governed policy update');
}
function listRelativeFiles(base, relDir) {
  const root = path.join(base, relDir); const out = [];
  if (!fs.existsSync(root)) return out;
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name,'en'))) {
      const full = path.join(dir,e.name);
      if (e.isSymbolicLink()) { out.push({ rel:path.relative(base,full).replaceAll('\\','/'), symlink:true }); continue; }
      if (e.isDirectory()) walk(full); else if (e.isFile()) out.push({ rel:path.relative(base,full).replaceAll('\\','/'), symlink:false });
    }
  };
  walk(root); return out;
}

for (const rel of [
  '.github/workflows/garp27-trusted-admission.yml',
  '.github/workflows/p5-release-gate.yml',
  '.github/workflows/safe-promotion.yml',
  '.github/workflows/deploy.yml',
  'scripts/qa-garp27-reference.mjs',
  'scripts/qa-garp27-architecture.mjs',
  'scripts/qa-garp27-mutations.mjs',
  'scripts/qa-garp27-assurance.mjs',
  'scripts/qa-garp27-trusted-admission.mjs',
  'scripts/qa-garp27-trusted-selftest.mjs',
  'scripts/qa-garp27-verify-p5-bundle.mjs',
  'scripts/qa-garp25-pinned-inputs.mjs',
  'scripts/qa-safe-promotion.mjs',
  'scripts/qa-security-secrets.mjs',
  'scripts/create-current-release-evidence.mjs',
  'scripts/generate-cyclonedx-sbom.mjs',
  'security/security-critical-assets.json',
  'security/sw-security-freeze-policy.json',
  'security/vendored-consistency.json',
  'security/garp27/UPSTREAM-PIN.json'
]) sameBytes(rel);
for (const rel of [
  'security/garp27/garp27-policy.json',
  'security/garp27/application-migration-profile.json',
  'security/garp27/capability-inventory.json',
  'security/garp27/architecture-policy.json'
]) normalizedJson(rel);

const candLegacy = listRelativeFiles(candidate, 'security/garp25');
const trustLegacy = listRelativeFiles(trusted, 'security/garp25');
const candLegacyNames = candLegacy.map(x=>x.rel), trustLegacyNames = trustLegacy.map(x=>x.rel);
if (candLegacy.some(x=>x.symlink)) failCheck('trusted-legacy-garp25:no-symlinks', candLegacy.filter(x=>x.symlink).map(x=>x.rel)); else passCheck('trusted-legacy-garp25:no-symlinks');
if (JSON.stringify(candLegacyNames) !== JSON.stringify(trustLegacyNames)) failCheck('trusted-legacy-garp25:file-set', { candidate:candLegacyNames, trusted:trustLegacyNames });
else {
  passCheck('trusted-legacy-garp25:file-set');
  for (const rel of trustLegacyNames) sameBytes(rel);
}

const candRef = listRelativeFiles(candidate, 'security/garp27/reference');
const trustRef = listRelativeFiles(trusted, 'security/garp27/reference');
const candNames = candRef.map(x=>x.rel), trustNames = trustRef.map(x=>x.rel);
if (candRef.some(x=>x.symlink)) failCheck('trusted-reference:no-symlinks', candRef.filter(x=>x.symlink).map(x=>x.rel)); else passCheck('trusted-reference:no-symlinks');
if (JSON.stringify(candNames) !== JSON.stringify(trustNames)) failCheck('trusted-reference:file-set', { candidate:candNames, trusted:trustNames });
else {
  passCheck('trusted-reference:file-set');
  for (const rel of trustNames) sameBytes(rel);
}

const cpkg = readJson(path.join(candidate,'package.json'));
const tpkg = readJson(path.join(trusted,'package.json'));
for (const key of ['qa:garp27:reference','qa:garp27:architecture','qa:garp27:mutations','qa:garp27:trusted-selftest','qa:garp27:assurance','qa:garp27:ci','qa:garp27:local']) {
  cpkg.scripts?.[key] === tpkg.scripts?.[key] ? passCheck(`trusted-package-script:${key}`) : failCheck(`trusted-package-script:${key}`, {candidate:cpkg.scripts?.[key],trusted:tpkg.scripts?.[key]});
}

for (const key of ['dependencies','devDependencies','optionalDependencies','peerDependencies','engines']) {
  const c = JSON.stringify(cpkg[key] || {}), t = JSON.stringify(tpkg[key] || {});
  c === t ? passCheck(`trusted-package-supply-chain:${key}`) : failCheck(`trusted-package-supply-chain:${key}`, { candidate:cpkg[key] || {}, trusted:tpkg[key] || {} });
}
const clock = clone(readJson(path.join(candidate, 'package-lock.json')));
const tlock = clone(readJson(path.join(trusted, 'package-lock.json')));
for (const x of [clock, tlock]) {
  delete x.version;
  if (x.packages?.['']) delete x.packages[''].version;
}
JSON.stringify(clock) === JSON.stringify(tlock)
  ? passCheck('trusted-package-lock:dependency-graph')
  : failCheck('trusted-package-lock:dependency-graph', 'candidate changed the locked dependency graph; use a governed supply-chain update');

const preFailed = checks.filter(x=>!x.pass);
let architecture = null;
if (!preFailed.length) {
  const trustedGate = path.join(trusted, 'scripts', 'qa-garp27-architecture.mjs');
  const out = path.join(candidate, 'qa-results', 'garp27', 'trusted-admission-architecture.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const r = spawnSync(process.execPath, [trustedGate, '--root', candidate, '--output', out], { cwd: trusted, encoding: 'utf8' });
  try { architecture = JSON.parse(fs.readFileSync(out,'utf8')); } catch {}
  r.status === 0 && architecture?.status === 'PASS'
    ? passCheck('trusted-architecture-gate', { candidateVersion: architecture.appVersion, candidateDigestSha256: architecture.binding?.candidateDigestSha256 })
    : failCheck('trusted-architecture-gate', { exit:r.status, stdout:(r.stdout||'').trim(), stderr:(r.stderr||'').trim(), failed:architecture?.failed || [] });
  const p5ArchitecturePath = path.join(candidate, 'qa-results', 'garp27', 'architecture-result.json');
  if (architecture?.status === 'PASS' && existsRegular(p5ArchitecturePath)) {
    try {
      const p5Architecture = readJson(p5ArchitecturePath);
      p5Architecture?.binding?.candidateDigestSha256 === architecture?.binding?.candidateDigestSha256
        ? passCheck('trusted-binding:p5-candidate-digest', architecture.binding.candidateDigestSha256)
        : failCheck('trusted-binding:p5-candidate-digest', { p5:p5Architecture?.binding?.candidateDigestSha256, trusted:architecture?.binding?.candidateDigestSha256 });
    } catch (error) {
      failCheck('trusted-binding:p5-candidate-digest', `invalid P5 architecture evidence: ${error.message}`);
    }
  } else {
    failCheck('trusted-binding:p5-candidate-digest', 'P5 architecture evidence missing or trusted architecture gate did not pass');
  }
}
const failed = checks.filter(x=>!x.pass);
const result = {
  classification:'GARP27_TRUSTED_ADMISSION',
  status: failed.length ? 'FAIL' : 'PASS',
  executionModel:'trusted control-plane from protected main; candidate source and verified P5 runtime artifact inspected as data only',
  candidateRoot:path.basename(candidate),
  trustedRoot:path.basename(trusted),
  checks,
  failed:failed.map(x=>x.id),
  note:'Changes to trust-critical GARP 2.7/GARP 2.5 release-control machinery, dependency graph or admission workflows require a separately governed bootstrap/policy update; they cannot self-approve in an ordinary application PR.'
};
console.log(JSON.stringify(result,null,2));
process.exit(failed.length?1:0);
