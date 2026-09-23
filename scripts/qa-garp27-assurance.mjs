#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qadir = path.join(root, 'qa-results', 'garp27');
fs.mkdirSync(qadir, { recursive: true });
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const validSha = /^[a-f0-9]{40}$/i;
const pkg = readJson(path.join(root, 'package.json'));

function sourceCommit() {
  for (const value of [process.env.GHRAB_SOURCE_COMMIT, process.env.GITHUB_SHA]) if (validSha.test(String(value || ''))) return { value: String(value), bound: true, source: 'environment' };
  const r = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
  const v = (r.stdout || '').trim();
  if (r.status === 0 && validSha.test(v)) return { value: v, bound: true, source: 'git' };
  return { value: '0'.repeat(40), bound: false, source: 'unbound-local-worktree' };
}
function ensurePass(file, label) {
  if (!fs.existsSync(file)) throw new Error(`missing evidence: ${label} (${rel(file)})`);
  const x = readJson(file);
  if (x.status !== 'PASS') throw new Error(`evidence is not PASS: ${label} (${x.status})`);
  return x;
}

try {
  const referenceFile = path.join(qadir, 'reference-result.json');
  const architectureFile = path.join(qadir, 'architecture-result.json');
  const mutationFile = path.join(qadir, 'mutation-result.json');
  const trustedSelftestFile = path.join(qadir, 'trusted-admission-selftest.json');
  const releaseFile = path.join(root, 'qa-results', 'release-current', 'current-release-evidence.json');
  const sbomFile = path.join(root, 'security', 'sbom', `ai-akademie-${pkg.version}.cdx.json`);
  const policyFile = path.join(root, 'security', 'garp27', 'garp27-policy.json');
  const baseProfileFile = path.join(root, 'security', 'garp27', 'application-migration-profile.json');
  const liveFile = path.join(root, 'security', 'garp27', 'live-status.deferred.json');
  const validator = path.join(root, 'security', 'garp27', 'reference', 'TOOLS', 'validate-assurance.mjs');
  const liveValidator = path.join(root, 'security', 'garp27', 'reference', 'TOOLS', 'validate-live-status.mjs');

  const reference = ensurePass(referenceFile, 'GARP 2.7 reference adapter');
  const architecture = ensurePass(architectureFile, 'architecture integrity');
  const mutations = ensurePass(mutationFile, 'architecture mutation pack');
  const trustedSelftest = ensurePass(trustedSelftestFile, 'trusted admission selftest');
  if (!fs.existsSync(releaseFile)) throw new Error(`missing release evidence: ${rel(releaseFile)}`);
  const release = readJson(releaseFile);
  if (release.version !== pkg.version) throw new Error(`release evidence version mismatch: ${release.version} != ${pkg.version}`);
  if (!fs.existsSync(sbomFile)) throw new Error(`missing current SBOM: ${rel(sbomFile)}`);
  if (!fs.existsSync(policyFile)) throw new Error(`missing GARP 2.7 policy: ${rel(policyFile)}`);

  const commit = sourceCommit();
  const observedAt = new Date().toISOString();
  const evidence = {
    policy: sha256(policyFile),
    reference: sha256(referenceFile),
    architecture: sha256(architectureFile),
    mutations: sha256(mutationFile),
    trustedAdmissionSelftest: sha256(trustedSelftestFile),
    release: sha256(releaseFile),
    sbom: sha256(sbomFile)
  };
  const baseProfile = readJson(baseProfileFile);
  const generatedProfile = {
    ...baseProfile,
    appVersion: pkg.version,
    releaseIdentity: { appId: 'ai-akademie', appVersion: pkg.version, sourceCommit: commit.value },
    trustedEvidence: {
      'garp27-policy': evidence.policy,
      'garp27-reference': evidence.reference,
      'garp27-architecture': evidence.architecture,
      'garp27-mutations': evidence.mutations,
      'garp27-trusted-admission-selftest': evidence.trustedAdmissionSelftest,
      'release-evidence': evidence.release,
      'current-sbom': evidence.sbom
    }
  };
  const profileOut = path.join(qadir, 'trusted-profile.generated.json');
  fs.writeFileSync(profileOut, JSON.stringify(generatedProfile, null, 2) + '\n');

  const ref = id => ({ id, sha256: generatedProfile.trustedEvidence[id] });
  const component = (componentId, refs) => ({ componentId, presence: 'PRESENT', health: 'HEALTHY', effectiveness: 'PASS', evidenceFreshness: 'FRESH', observedAt, evidenceRefs: refs.map(ref) });
  const status = {
    schema: 'garp27-assurance-status-v1',
    garpVersion: '2.7',
    environment: process.env.GITHUB_ACTIONS === 'true' ? 'github-ci' : 'local-ci',
    releaseIdentity: generatedProfile.releaseIdentity,
    overall: 'DERIVE',
    components: [
      component('AG-01-policy', ['garp27-policy', 'garp27-reference']),
      component('AG-02-identity', ['garp27-architecture']),
      component('AG-03-request-api-ai', ['garp27-architecture']),
      component('AG-04-egress', ['garp27-architecture']),
      component('AG-05-files', ['garp27-architecture']),
      component('AG-06-data-lifecycle', ['garp27-architecture']),
      component('AG-07-release', ['release-evidence', 'current-sbom', 'garp27-mutations', 'garp27-trusted-admission-selftest']),
      component('AG-08-architecture', ['garp27-architecture', 'garp27-mutations', 'garp27-trusted-admission-selftest']),
      component('AG-09-inventory', ['garp27-architecture'])
    ]
  };
  const statusOut = path.join(qadir, 'assurance-status.json');
  fs.writeFileSync(statusOut, JSON.stringify(status, null, 2) + '\n');

  const assuranceRun = spawnSync(process.execPath, [validator, statusOut, '--profile', profileOut, '--now', observedAt], { cwd: root, encoding: 'utf8' });
  let assuranceOutput = null;
  try { assuranceOutput = JSON.parse((assuranceRun.stdout || '').trim()); } catch {}
  const liveRun = spawnSync(process.execPath, [liveValidator, liveFile, '--profile', profileOut], { cwd: root, encoding: 'utf8' });
  let liveOutput = null;
  try { liveOutput = JSON.parse((liveRun.stdout || '').trim()); } catch {}
  const derivedOk = assuranceRun.status === 0 && assuranceOutput?.derivedOverall === 'FOUNDATION_PASS_LIVE_NOT_TESTED';
  const liveOk = liveRun.status === 3 && liveOutput?.status === 'NOT_TESTED';
  const architectureGovernance = architecture.architectureCases?.['G27-AR04'] || 'UNKNOWN';
  const statusLabel = derivedOk && liveOk
    ? (architectureGovernance === 'PASS' ? 'FOUNDATION_PASS_LIVE_NOT_TESTED' : 'FOUNDATION_PASS_WITH_GOVERNANCE_GAP_LIVE_NOT_TESTED')
    : 'FAIL';
  const result = {
    classification: 'GARP27_ASSURANCE_ADMISSION',
    status: derivedOk && liveOk ? 'PASS' : 'FAIL',
    assuranceStatus: statusLabel,
    referenceDerivedOverall: assuranceOutput?.derivedOverall || null,
    liveStatus: liveOutput?.status || null,
    sourceIdentity: commit,
    releaseIdentity: generatedProfile.releaseIdentity,
    evidence,
    architectureGovernance,
    independentPolicyAuthority: false,
    trustedAdmissionDesignSelftest: trustedSelftest.status,
    limitation: 'Trusted admission design and anti-self-modification cases pass locally, but full G27-AR04 closure still requires the trusted workflow to be active from protected main and configured as a required GitHub check after bootstrap.',
    serverPhase: baseProfile.serverApproval,
    serverLiveClaim: false,
    validator: { exit: assuranceRun.status, output: assuranceOutput, stderr: (assuranceRun.stderr || '').trim() },
    liveValidator: { exit: liveRun.status, output: liveOutput, stderr: (liveRun.stderr || '').trim() }
  };
  const out = path.join(qadir, 'assurance-result.json');
  fs.writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ status: result.status, assuranceStatus: result.assuranceStatus, output: rel(out), sourceBoundToGitCommit: commit.bound, sourceIdentity: commit.source, referenceDerivedOverall: result.referenceDerivedOverall, liveStatus: result.liveStatus, architectureGovernance }, null, 2));
  process.exit(result.status === 'PASS' ? 0 : 1);
} catch (error) {
  const result = { classification: 'GARP27_ASSURANCE_ADMISSION', status: 'HARNESS_ERROR', message: error.message };
  const out = path.join(qadir, 'assurance-result.json');
  fs.writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
  console.error(JSON.stringify(result, null, 2));
  process.exit(2);
}
