#!/usr/bin/env node
// GARP 2.5.1 GHRAB - release gate, R12 assurance binding + builder policy.
// Fail-closed orchestration. AUTO-PATCH trust policy lives in canonical A-tooling,
// while the signed release manifest cryptographically binds the app to its required gate profile.
import { spawnSync } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const opt = k => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : null; };
const profile = opt('profile') || 'school';
const deployArg = opt('deploy');

const REQUIRED = {
  school: ['deploy', 'manifest', 'signature', 'trust-root', 'registry', 'artifact', 'provenance', 'source-package', 'evidence-dir', 'evidence-manifest', 'project-root', 'sbom'],
  prep: ['deploy', 'manifest', 'signature', 'trust-root'],
  'auto-patch-prep': ['deploy', 'manifest', 'signature', 'trust-root', 'registry', 'artifact', 'provenance', 'source-package', 'evidence-dir', 'evidence-manifest', 'project-root', 'vendored-config', 'sbom']
};
if (!REQUIRED[profile]) {
  console.error(JSON.stringify({ status: 'FAIL', errors: [`unknown-profile:${profile}`] }, null, 2));
  process.exit(2);
}

const steps = [];
const skippedSteps = [];
const missing = [];
for (const k of REQUIRED[profile]) {
  const v = opt(k);
  if (!v) { missing.push(k); continue; }
  try { await access(v); } catch { missing.push(`${k}:${v}:unreadable`); }
}
if (missing.length) failEarly('required-input-missing', { missing });

let releaseManifest;
try { releaseManifest = JSON.parse(await readFile(opt('manifest'), 'utf8')); }
catch (e) { failEarly('release-manifest-invalid', { detail: String(e) }); }
const appId = String(releaseManifest?.appId || '');
if (!appId) failEarly('release-manifest-appId-missing');

// R10/N65: canonical control-plane authorization is consulted for EVERY profile,
// not only when the caller remembers to request auto-patch-prep. This prevents
// a profile downgrade from turning the R9 protection off.
const indexPath = path.join(here, '..', 'POLICY-PINS', 'auto-patch-policy-index.json');
let policyIndex = null;
try { policyIndex = JSON.parse(await readFile(indexPath, 'utf8')); }
catch (e) { failEarly('auto-patch-control-plane-index-unavailable', { indexPath, detail: String(e) }); }
if (policyIndex?.schema !== 'ghrab-auto-patch-control-plane-v1' || !policyIndex.apps || typeof policyIndex.apps !== 'object') {
  failEarly('auto-patch-control-plane-index-invalid', { indexPath });
}
const hasEntry = Object.prototype.hasOwnProperty.call(policyIndex.apps, appId);
const indexEntry = hasEntry ? policyIndex.apps[appId] : null;
const canonicalRequiredProfile = indexEntry && typeof indexEntry === 'object' ? String(indexEntry.requiredGateProfile || '') : '';
const signedRequiredProfile = String(releaseManifest?.requiredGateProfile || '');
if (indexEntry && canonicalRequiredProfile) {
  if (signedRequiredProfile !== canonicalRequiredProfile) {
    failEarly('auto-patch-artifact-profile-binding-missing-or-mismatch', {
      appId, canonicalRequiredProfile, signedRequiredProfile: signedRequiredProfile || null, indexPath
    });
  }
  if (profile !== canonicalRequiredProfile) {
    failEarly('auto-patch-required-profile-mismatch', {
      appId, requiredGateProfile: canonicalRequiredProfile, requestedProfile: profile, source: 'canonical-A-tooling+signed-release-manifest'
    });
  }
} else if (signedRequiredProfile && profile !== signedRequiredProfile) {
  failEarly('release-required-profile-mismatch', { appId, requiredGateProfile: signedRequiredProfile, requestedProfile: profile });
}

const deployRoot = path.resolve(deployArg);
const explicitSw = opt('sw');
const detectedSw = path.join(deployRoot, 'sw.js');
let swPath = null;
if (explicitSw) {
  try { await access(explicitSw); swPath = path.resolve(explicitSw); }
  catch { failEarly('service-worker-unreadable', { sw: explicitSw }); }
} else if (existsSync(detectedSw)) swPath = detectedSw;

let controlPlane = null;
let canonicalSwPolicy = null;
let requiredEvidencePolicy = null;
let criticalList = null;
if (swPath) {
  const candidates = [opt('critical-list'), path.join(path.dirname(deployRoot), 'security', 'security-critical-assets.json')].filter(Boolean);
  for (const c of candidates) { try { await access(c); criticalList = path.resolve(c); break; } catch {} }
  if (!criticalList) failEarly('critical-asset-list-missing', { sw: swPath, searched: candidates.length ? candidates : ['--critical-list', '<project-root>/security/security-critical-assets.json'] });
}

const schoolBuilderPolicyPath = path.join(here, '..', 'POLICY-PINS', 'school-builder-policy.json');
let schoolBuilderPolicy = null;
if (profile === 'school') {
  try { schoolBuilderPolicy = JSON.parse(await readFile(schoolBuilderPolicyPath, 'utf8')); }
  catch (e) { failEarly('school-builder-policy-unavailable', { schoolBuilderPolicyPath, detail: String(e) }); }
  if (schoolBuilderPolicy?.schema !== 'ghrab-school-builder-policy-v1' || schoolBuilderPolicy?.mode !== 'deny-unless-listed' || !Array.isArray(schoolBuilderPolicy?.allowedBuilders)) {
    failEarly('school-builder-policy-invalid', { schoolBuilderPolicyPath });
  }
}

if (profile === 'auto-patch-prep') {
  if (!indexEntry || typeof indexEntry !== 'object') failEarly('auto-patch-app-not-authorized-by-control-plane', { appId, indexPath });
  canonicalSwPolicy = path.join(path.dirname(indexPath), String(indexEntry.swPolicy || ''));
  requiredEvidencePolicy = path.join(path.dirname(indexPath), String(indexEntry.requiredEvidencePolicy || ''));
  for (const [name, file] of [['canonical-sw-policy', canonicalSwPolicy], ['required-evidence-policy', requiredEvidencePolicy]]) {
    try { await access(file); } catch { failEarly('auto-patch-control-plane-file-missing', { name, file }); }
  }
  let canonicalPolicy;
  try { canonicalPolicy = JSON.parse(await readFile(canonicalSwPolicy, 'utf8')); }
  catch (e) { failEarly('auto-patch-canonical-sw-policy-invalid', { canonicalSwPolicy, detail: String(e) }); }
  if (canonicalPolicy?.appId !== appId || String(canonicalPolicy?.requiredGateProfile || '') !== canonicalRequiredProfile) {
    failEarly('auto-patch-canonical-policy-profile-binding-invalid', { appId, canonicalRequiredProfile, canonicalPolicyProfile: canonicalPolicy?.requiredGateProfile || null });
  }
  controlPlane = { appId, indexPath, canonicalSwPolicy, requiredEvidencePolicy, requiredGateProfile: canonicalRequiredProfile, source: 'canonical-A-tooling+signed-artifact-binding' };
}

run('deployment-leaks', 'scan-deployment-leaks.mjs', [deployArg]);
run('release-integrity', 'verify-release-integrity.mjs', [deployArg, opt('manifest')]);
run('release-signature', 'verify-release-signature.mjs', [opt('manifest'), opt('signature'), opt('trust-root')]);
if (opt('registry')) run('release-registry', 'verify-release-registry.mjs', [opt('manifest'), opt('registry')]);
else skippedSteps.push({ step: 'release-registry', reason: 'registry-not-provided' });
if (opt('artifact') && opt('provenance'))
  run('build-provenance', 'verify-build-provenance.mjs', [
    opt('artifact'), opt('provenance'), '--release-manifest', opt('manifest'),
    ...(opt('source-package') ? ['--source-package', opt('source-package')] : []),
    ...(profile === 'school' ? ['--builder-policy', schoolBuilderPolicyPath] : []),
    ...(['prep', 'auto-patch-prep'].includes(profile) ? ['--allow-local-builder'] : [])
  ]);
else skippedSteps.push({ step: 'build-provenance', reason: 'artifact-or-provenance-not-provided' });
if (opt('evidence-dir') && opt('evidence-manifest'))
  run('evidence-manifest', 'verify-evidence-manifest.mjs', [
    opt('evidence-dir'), opt('evidence-manifest'),
    ...(opt('project-root') ? ['--project-root', opt('project-root')] : []),
    ...(requiredEvidencePolicy ? ['--required-policy', requiredEvidencePolicy, '--release-manifest', opt('manifest')] : [])
  ]);
else skippedSteps.push({ step: 'evidence-manifest', reason: 'evidence-inputs-not-provided' });

const projectRoot = opt('project-root') ? path.resolve(opt('project-root')) : null;
let aiFingerprint = opt('ai-fingerprint'); let aiInventory = opt('ai-inventory');
if (projectRoot) {
  const defaultFingerprint = path.join(projectRoot, 'security', 'evidence', 'ai-assurance-fingerprint.json');
  const defaultInventory = path.join(projectRoot, 'security', 'ai-boundary-files.json');
  if (!aiFingerprint && existsSync(defaultFingerprint)) aiFingerprint = defaultFingerprint;
  if (!aiInventory && existsSync(defaultInventory)) aiInventory = defaultInventory;
}
if (aiFingerprint || aiInventory) {
  if (!projectRoot || !aiFingerprint || !aiInventory) failEarly('ai-assurance-inputs-incomplete', { projectRoot, aiFingerprint, aiInventory });
  run('ai-assurance-fingerprint', 'verify-ai-assurance-fingerprint.mjs', [aiFingerprint, aiInventory, projectRoot]);
} else skippedSteps.push({ step: 'ai-assurance-fingerprint', reason: 'no-ai-assurance-inputs-detected' });

const assuranceScript = path.join(here, 'verify-assurance-links.mjs');
const assuranceRequired = profile === 'school' || profile === 'auto-patch-prep';
const assuranceInputs = [opt('provenance'), opt('evidence-manifest'), opt('sbom')];
const assuranceAny = assuranceInputs.some(Boolean);
if (assuranceRequired || assuranceAny) {
  if (!existsSync(assuranceScript)) failEarly('assurance-links-verifier-missing', { assuranceScript });
  if (assuranceInputs.some(v => !v)) failEarly('assurance-links-inputs-incomplete', { provenance:opt('provenance'), evidenceManifest:opt('evidence-manifest'), sbom:opt('sbom') });
  run('assurance-links', 'verify-assurance-links.mjs', [
    '--manifest', opt('manifest'), '--provenance', opt('provenance'),
    '--evidence-manifest', opt('evidence-manifest'), '--sbom', opt('sbom'),
    ...(opt('deployment-package') ? ['--deployment-package', opt('deployment-package')] : [])
  ]);
} else skippedSteps.push({ step: 'assurance-links', reason: 'prep-no-assurance-inputs-provided' });
if (swPath) run('sw-security-freeze', 'check-sw-security-freeze.mjs', [swPath, deployArg, criticalList, ...(canonicalSwPolicy ? ['--canonical-policy', canonicalSwPolicy, '--require-freeze-policy'] : [])]);
else skippedSteps.push({ step: 'sw-security-freeze', reason: 'service-worker-not-present' });
if (opt('vendored-config')) run('vendored-consistency', 'check-vendored-consistency.mjs', [opt('vendored-config')]);
else skippedSteps.push({ step: 'vendored-consistency', reason: 'vendored-config-not-provided' });

const failed = steps.filter(s => s.status !== 'PASS');
const verdict = {
  gate: 'GARP-2.5.1-RELEASE-GATE-R12', profile, status: failed.length ? 'RED' : 'GREEN',
  serviceWorker: swPath, criticalAssetList: criticalList, stepsRun: steps.length, steps, skippedSteps,
  autoPatchControlPlane: controlPlane,
  artifactProfileBinding: { appId, signedRequiredGateProfile: signedRequiredProfile || null, canonicalRequiredGateProfile: canonicalRequiredProfile || null },
  schoolBuilderPolicy: profile === 'school' ? { path: schoolBuilderPolicyPath, revision: schoolBuilderPolicy?.revision || null, allowedBuilders: schoolBuilderPolicy?.allowedBuilders?.length || 0 } : null,
  note: profile === 'prep'
    ? 'PREP may explicitly use local-untrusted-builder. If assurance inputs are supplied, R12 binds them to the signed release manifest. PREP GREEN is not school-server LIVE GREEN.'
    : profile === 'auto-patch-prep'
      ? 'AUTO-PATCH-PREP R12: control-plane requirements and signed assurance links are fail-closed. PREP GREEN is not LIVE GREEN.'
      : 'School profile R12: project-root, SBOM and signed assurance links are mandatory; builder identity/workflow must match the canonical deny-unless-listed policy. Unknown builders fail closed.'
};
console[failed.length ? 'error' : 'log'](JSON.stringify(verdict, null, 2));
process.exit(failed.length ? 1 : 0);

function run(name, script, args) {
  const r = spawnSync(process.execPath, [path.join(here, script), ...args], { encoding: 'utf8' });
  const text = (r.status === 0 ? r.stdout : (r.stderr || r.stdout)).trim();
  const reportedAmber = /"status"\s*:\s*"AMBER"/.test(text);
  steps.push({ step: name, script, status: r.status === 0 ? 'PASS' : (reportedAmber ? 'AMBER' : 'FAIL'), exitCode: r.status, detail: text.slice(0, 1600) });
}
function failEarly(reason, extra = {}) {
  console.error(JSON.stringify({ gate: 'GARP-2.5.1-RELEASE-GATE-R12', status: 'RED', profile, errors: [reason], ...extra }, null, 2));
  process.exit(1);
}
