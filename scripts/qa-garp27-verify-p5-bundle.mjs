#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [bundleArg, candidateArg, expectedShaRaw] = process.argv.slice(2);
if (!bundleArg || !candidateArg || !expectedShaRaw) {
  console.error('usage: qa-garp27-verify-p5-bundle.mjs BUNDLE_ROOT CANDIDATE_ROOT EXPECTED_SOURCE_SHA');
  process.exit(2);
}

const bundle = path.resolve(bundleArg);
const candidate = path.resolve(candidateArg);
const expectedSha = expectedShaRaw.toLowerCase();
const checks = [];
const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
const rel = (base, file) => path.relative(base, file).replaceAll('\\', '/');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const isFile = file => { try { return fs.lstatSync(file).isFile(); } catch { return false; } };
const isDir = file => { try { return fs.lstatSync(file).isDirectory(); } catch { return false; } };
const check = (id, pass, detail = undefined) => checks.push({ id, pass: Boolean(pass), ...(detail === undefined ? {} : { detail }) });

function walkRegular(root) {
  const files = [];
  const irregular = [];
  if (!isDir(root)) return { files, irregular: [{ path: '.', type: 'missing-directory' }] };
  const visit = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      const full = path.join(dir, entry.name);
      const r = rel(root, full);
      const st = fs.lstatSync(full);
      if (st.isSymbolicLink()) irregular.push({ path: r, type: 'symlink' });
      else if (st.isDirectory()) visit(full);
      else if (st.isFile()) files.push(full);
      else irregular.push({ path: r, type: 'irregular-entry' });
    }
  };
  visit(root);
  return { files, irregular };
}

function artifactDigest(dir) {
  const { files, irregular } = walkRegular(dir);
  if (irregular.length) return { digest: null, files: [], irregular };
  const rows = files.map(file => {
    const content = fs.readFileSync(file);
    return { path: rel(dir, file), sha256: sha256(content), size: content.length };
  });
  return {
    digest: sha256(Buffer.from(rows.map(f => `${f.sha256}  ${f.path}\n`).join(''))),
    files: rows,
    irregular
  };
}

let pkg;
try {
  pkg = readJson(path.join(candidate, 'package.json'));
} catch (error) {
  const result = { classification: 'GARP27_TRUSTED_P5_BUNDLE', status: 'HARNESS_ERROR', error: error.message };
  console.error(JSON.stringify(result, null, 2));
  process.exit(2);
}

check('source-sha:format', /^[0-9a-f]{40}$/.test(expectedSha), expectedShaRaw);
const bundleScan = walkRegular(bundle);
check('bundle:no-symlinks-or-irregular', bundleScan.irregular.length === 0, bundleScan.irregular);

const evidencePath = path.join(bundle, 'qa-results/release-current/current-release-evidence.json');
const architecturePath = path.join(bundle, 'qa-results/garp27/architecture-result.json');
const assurancePath = path.join(bundle, 'qa-results/garp27/assurance-result.json');
const referencePath = path.join(bundle, 'qa-results/garp27/reference-result.json');
const mutationPath = path.join(bundle, 'qa-results/garp27/mutation-result.json');
const trustedSelftestPath = path.join(bundle, 'qa-results/garp27/trusted-admission-selftest.json');
const runtimeDir = path.join(bundle, 'dist-pages');
for (const [id, file] of [
  ['bundle:release-evidence', evidencePath],
  ['bundle:architecture-evidence', architecturePath],
  ['bundle:assurance-evidence', assurancePath],
  ['bundle:reference-evidence', referencePath],
  ['bundle:mutation-evidence', mutationPath],
  ['bundle:trusted-selftest-evidence', trustedSelftestPath]
]) check(id, isFile(file), isFile(file) ? rel(bundle, file) : 'missing');
check('bundle:runtime-artifact', isDir(runtimeDir), isDir(runtimeDir) ? 'dist-pages' : 'missing');

let evidence = null;
let architecture = null;
let assurance = null;
let reference = null;
let mutation = null;
let trustedSelftest = null;
try { if (isFile(evidencePath)) evidence = readJson(evidencePath); } catch (e) { check('bundle:release-evidence-json', false, e.message); }
try { if (isFile(architecturePath)) architecture = readJson(architecturePath); } catch (e) { check('bundle:architecture-evidence-json', false, e.message); }
try { if (isFile(assurancePath)) assurance = readJson(assurancePath); } catch (e) { check('bundle:assurance-evidence-json', false, e.message); }
try { if (isFile(referencePath)) reference = readJson(referencePath); } catch (e) { check('bundle:reference-evidence-json', false, e.message); }
try { if (isFile(mutationPath)) mutation = readJson(mutationPath); } catch (e) { check('bundle:mutation-evidence-json', false, e.message); }
try { if (isFile(trustedSelftestPath)) trustedSelftest = readJson(trustedSelftestPath); } catch (e) { check('bundle:trusted-selftest-evidence-json', false, e.message); }

if (evidence) {
  check('release-evidence:schema', evidence.schema === 'ghrab-current-release-evidence-v1', evidence.schema);
  check('release-evidence:identity', evidence.appId === 'ai-akademie' && evidence.version === pkg.version, { appId: evidence.appId, version: evidence.version, candidateVersion: pkg.version });
  check('release-evidence:source-sha', String(evidence.sourceCommit || '').toLowerCase() === expectedSha, { observed: evidence.sourceCommit, expected: expectedSha });
  check('release-evidence:artifact-root', evidence.artifact?.root === 'dist-pages', evidence.artifact?.root);

  if (isDir(runtimeDir)) {
    const actual = artifactDigest(runtimeDir);
    check('runtime-artifact:no-irregular', actual.irregular.length === 0, actual.irregular);
    check('runtime-artifact:digest', Boolean(actual.digest) && actual.digest === evidence.artifact?.sha256, { observed: actual.digest, expected: evidence.artifact?.sha256 });
    check('runtime-artifact:file-count', actual.files.length === evidence.artifact?.fileCount, { observed: actual.files.length, expected: evidence.artifact?.fileCount });
  }

  const expectedSbomRel = `security/sbom/ai-akademie-${pkg.version}.cdx.json`;
  const sbomPath = path.join(bundle, expectedSbomRel);
  check('sbom:path', evidence.sbom?.path === expectedSbomRel, { observed: evidence.sbom?.path, expected: expectedSbomRel });
  check('sbom:present', isFile(sbomPath), isFile(sbomPath) ? expectedSbomRel : 'missing');
  if (isFile(sbomPath)) {
    const observed = sha256(fs.readFileSync(sbomPath));
    check('sbom:digest', observed === evidence.sbom?.sha256, { observed, expected: evidence.sbom?.sha256 });
  }
}

check('p5-evidence:reference-pass', reference?.status === 'PASS', reference?.status ?? null);
check('p5-evidence:architecture-pass', architecture?.status === 'PASS', architecture?.status ?? null);
check('p5-evidence:mutations-pass', mutation?.status === 'PASS', mutation?.status ?? null);
check('p5-evidence:trusted-selftest-pass', trustedSelftest?.status === 'PASS', trustedSelftest?.status ?? null);
check('p5-evidence:assurance-pass', assurance?.status === 'PASS', assurance?.status ?? null);
check('p5-evidence:assurance-source-bound', assurance?.sourceIdentity?.bound === true && String(assurance?.sourceIdentity?.value || '').toLowerCase() === expectedSha, assurance?.sourceIdentity ?? null);
check('p5-evidence:no-live-overclaim', assurance?.liveStatus === 'NOT_TESTED' && assurance?.serverLiveClaim === false, { liveStatus: assurance?.liveStatus, serverLiveClaim: assurance?.serverLiveClaim });

const failed = checks.filter(x => !x.pass);
const result = {
  classification: 'GARP27_TRUSTED_P5_BUNDLE',
  status: failed.length ? 'FAIL' : 'PASS',
  appId: 'ai-akademie',
  appVersion: pkg.version,
  expectedSourceSha: expectedSha,
  artifactSha256: evidence?.artifact?.sha256 ?? null,
  p5CandidateDigestSha256: architecture?.binding?.candidateDigestSha256 ?? null,
  checks,
  failed: failed.map(x => x.id)
};
console.log(JSON.stringify(result, null, 2));
process.exit(failed.length ? 1 : 0);
