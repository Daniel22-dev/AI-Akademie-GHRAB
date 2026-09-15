#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const opt = name => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : null; };
const valueFlags = new Set(['--release-manifest','--source-package','--builder-policy']);
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) { if (valueFlags.has(args[i])) i++; continue; }
  positional.push(args[i]);
}
const [artifact, provPath] = positional;
const releaseManifestPath = opt('release-manifest');
const sourcePackagePath = opt('source-package');
const builderPolicyPath = opt('builder-policy');
if (!artifact || !provPath) {
  console.error('Usage: node verify-build-provenance.mjs <artifact-file> <provenance.json> [--release-manifest <release-integrity.json>] [--source-package <build-input.zip>] [--builder-policy <canonical-policy.json>] [--allow-local-builder]');
  process.exit(2);
}
const errors = [];
const warnings = [];
let p; try { p = JSON.parse(await readFile(provPath, 'utf8')); } catch { fail(['provenance-unreadable']); }
const sha = createHash('sha256').update(await readFile(artifact)).digest('hex');
let releaseManifest = null;
if (releaseManifestPath) {
  try { releaseManifest = JSON.parse(await readFile(releaseManifestPath, 'utf8')); }
  catch { errors.push('release-manifest-unreadable'); }
}
let sourcePackageSha256 = null;
if (sourcePackagePath) {
  try { sourcePackageSha256 = createHash('sha256').update(await readFile(sourcePackagePath)).digest('hex'); }
  catch { errors.push('source-package-unreadable'); }
}
if (p?.schema !== 'ghrab-build-provenance-v1') errors.push('schema');
if (p?.subject?.sha256 !== sha) errors.push('subject.sha256');
if (!p?.source?.revision && !p?.source?.sourcePackageSha256) errors.push('source-identity-missing');
if (!p?.builder?.id) errors.push('builder.id');
else if (p.builder.id === 'local-untrusted-builder') {
  if (flags.has('--allow-local-builder') && !builderPolicyPath) warnings.push('builder=local-untrusted-builder (PREP only, never school release)');
  else errors.push('builder-untrusted:local-untrusted-builder');
}
if (!p?.invocation?.finishedAt) errors.push('invocation.finishedAt');
if (p?.assurance?.claimedSlsaLevel) errors.push('claimedSlsaLevel-self-asserted');
if (sourcePackagePath) {
  if (!sourcePackageSha256) errors.push('source-package-sha256-missing');
  if (p?.source?.sourcePackageSha256 !== sourcePackageSha256) errors.push('source.sourcePackageSha256 != actual-source-package');
}
if (releaseManifest) {
  if (releaseManifest?.schema !== 'ghrab-release-integrity-v2') errors.push('release-manifest-schema');
  if (!releaseManifest?.sourcePackageSha256) errors.push('release-manifest-sourcePackageSha256-missing');
  if (!releaseManifest?.artifactDigest) errors.push('release-manifest-artifactDigest-missing');
  if (p?.source?.sourcePackageSha256 !== releaseManifest?.sourcePackageSha256) errors.push('provenance-source != release-manifest-source');
  if (p?.releaseIntegrity?.artifactDigest !== releaseManifest?.artifactDigest) errors.push('provenance-artifactDigest != release-manifest-artifactDigest');
  if (sourcePackageSha256 && releaseManifest?.sourcePackageSha256 !== sourcePackageSha256) errors.push('release-manifest-source != actual-source-package');
}
if (builderPolicyPath) {
  let policy = null;
  try { policy = JSON.parse(await readFile(builderPolicyPath, 'utf8')); }
  catch { errors.push('builder-policy-unreadable'); }
  if (policy) {
    if (policy.schema !== 'ghrab-school-builder-policy-v1') errors.push('builder-policy-schema');
    if (policy.mode !== 'deny-unless-listed') errors.push('builder-policy-mode');
    if (!Array.isArray(policy.allowedBuilders)) errors.push('builder-policy-allowedBuilders');
    else {
      const id = String(p?.builder?.id || '');
      const workflow = p?.builder?.workflow == null ? null : String(p.builder.workflow);
      const entrypoint = p?.builder?.entrypoint == null ? null : String(p.builder.entrypoint);
      const match = policy.allowedBuilders.find(row => {
        if (!row || String(row.id || '') !== id) return false;
        if (row.workflow != null) {
          const allowed = Array.isArray(row.workflow) ? row.workflow.map(String) : [String(row.workflow)];
          if (!workflow || !allowed.includes(workflow)) return false;
        }
        if (row.entrypoint != null) {
          const allowed = Array.isArray(row.entrypoint) ? row.entrypoint.map(String) : [String(row.entrypoint)];
          if (!entrypoint || !allowed.includes(entrypoint)) return false;
        }
        return true;
      });
      if (!match) errors.push('builder-policy-no-match');
    }
  }
}
if (process.env.GHRAB_EXPECT_SOURCE_COMMIT && p?.source?.revision !== process.env.GHRAB_EXPECT_SOURCE_COMMIT) errors.push('source.revision != GHRAB_EXPECT_SOURCE_COMMIT');
if (process.env.GHRAB_EXPECT_BUILDER_ID && p?.builder?.id !== process.env.GHRAB_EXPECT_BUILDER_ID) errors.push('builder.id != GHRAB_EXPECT_BUILDER_ID');
if (process.env.GHRAB_EXPECT_ARTIFACT_DIGEST && p?.releaseIntegrity?.artifactDigest !== process.env.GHRAB_EXPECT_ARTIFACT_DIGEST) errors.push('releaseIntegrity.artifactDigest != GHRAB_EXPECT_ARTIFACT_DIGEST');
if (errors.length) fail(errors);
console.log(JSON.stringify({ status:'PASS', subjectSha256:sha, builderId:p.builder.id, builderWorkflow:p.builder.workflow ?? null, sourceRevision:p.source.revision ?? null, builderPolicy:builderPolicyPath || null, warnings }, null, 2));
function fail(errs) { console.error(JSON.stringify({ status:'FAIL', errors:errs }, null, 2)); process.exit(1); }
