#!/usr/bin/env node
// GARP 2.5.1 GHRAB - selftest
// Rozsiruje selftest 2.5 o negativni kontroly, ktere v nem chybely: determinismus
// artifactDigest, vazba keyId na trust root, revokovany klic, anti-rollback,
// neznamy release, prisna provenance, .env rodina, secret ve velkem souboru,
// vendorovany drift, zmrazeni brany v SW a fail-closed chovani release gate.
import { createHash, generateKeyPairSync } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, readFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const errors = [];
const passed = [];
const run = (s, a) => spawnSync(process.execPath, [path.join(here, s), ...a], { encoding: 'utf8', env: { ...process.env, GHRAB_GARP_SELFTEST: '1' } });
const expect = (name, cond) => { if (cond) passed.push(name); else errors.push(name); };

const controlPlaneDir = path.join(here, '..', 'POLICY-PINS');
const controlPlaneIndexPath = path.join(controlPlaneDir, 'auto-patch-policy-index.json');
let temporaryControlPlaneIndex = false;
try { await readFile(controlPlaneIndexPath, 'utf8'); }
catch {
  await mkdir(controlPlaneDir, { recursive: true });
  await writeFile(controlPlaneIndexPath, JSON.stringify({
    schema: 'ghrab-auto-patch-control-plane-v1', revision: 'SELFTEST',
    apps: { differentiator: { requiredGateProfile: 'auto-patch-prep', autoPatchOnly: true } }
  }, null, 2) + '\n');
  temporaryControlPlaneIndex = true;
}

const t = await mkdtemp(path.join(tmpdir(), 'garp251-'));
try {
  // --- fixture: deployment, ktery drive rozbijel poradi (adresar 'a' vedle souboru 'a.js')
  const deploy = path.join(t, 'dist');
  await mkdir(path.join(deploy, 'a'), { recursive: true });
  await writeFile(path.join(deploy, 'index.html'), '<h1>synthetic</h1>\n');
  await writeFile(path.join(deploy, 'a.js'), 'console.log("a")\n');
  await writeFile(path.join(deploy, 'a', 'z.js'), 'console.log("z")\n');
  await writeFile(path.join(deploy, 'ch.js'), 'console.log("ch")\n');
  await writeFile(path.join(deploy, 'h.js'), 'console.log("h")\n');

  let r = run('create-release-integrity.mjs', [deploy, 'synthetic-app', '1.2.0', 'ghrab-key-2026-A', path.join(t, 'ri.json')]);
  expect('create-ri', r.status === 0);
  const digest1 = JSON.parse(r.stdout || '{}').artifactDigest;

  // NC-1 determinismus: druhy beh musi dat stejny digest
  r = run('create-release-integrity.mjs', [deploy, 'synthetic-app', '1.2.0', 'ghrab-key-2026-A', path.join(t, 'ri2.json')]);
  expect('digest-deterministic', JSON.parse(r.stdout || '{}').artifactDigest === digest1);

  await copyFile(path.join(t, 'ri.json'), path.join(deploy, 'release-integrity.json'));
  r = run('verify-release-integrity.mjs', [deploy, path.join(deploy, 'release-integrity.json')]);
  expect('verify-ri-clean-with-dir-file-collision', r.status === 0);

  // NC-2 byte tamper
  await writeFile(path.join(deploy, 'a.js'), 'console.log("tampered")\n');
  r = run('verify-release-integrity.mjs', [deploy, path.join(deploy, 'release-integrity.json')]);
  expect('NC-ri-byte-tamper-fails', r.status !== 0);
  await writeFile(path.join(deploy, 'a.js'), 'console.log("a")\n');

  // NC-3 pridany soubor
  await writeFile(path.join(deploy, 'extra.js'), 'x\n');
  r = run('verify-release-integrity.mjs', [deploy, path.join(deploy, 'release-integrity.json')]);
  expect('NC-ri-extra-file-fails', r.status !== 0);
  await rm(path.join(deploy, 'extra.js'));

  // NC-4 legacy v1 manifest musi byt odmitnut
  const legacy = JSON.parse(await readFile(path.join(t, 'ri.json'), 'utf8'));
  legacy.schema = 'ghrab-release-integrity-v1';
  await writeFile(path.join(t, 'legacy.json'), JSON.stringify(legacy));
  r = run('verify-release-integrity.mjs', [deploy, path.join(t, 'legacy.json')]);
  expect('NC-legacy-v1-rejected', r.status !== 0);

  // --- podpis a trust root
  const A = generateKeyPairSync('ed25519'), B = generateKeyPairSync('ed25519');
  const pem = k => k.export({ type: 'spki', format: 'pem' });
  await writeFile(path.join(t, 'A.priv'), A.privateKey.export({ type: 'pkcs8', format: 'pem' }));
  await writeFile(path.join(t, 'B.priv'), B.privateKey.export({ type: 'pkcs8', format: 'pem' }));
  const trust = {
    schema: 'ghrab-trust-root-v1',
    keys: [
      { keyId: 'ghrab-key-2026-A', algorithm: 'Ed25519', status: 'active', publicKeyPem: pem(A.publicKey) },
      { keyId: 'ghrab-key-2025-OLD', algorithm: 'Ed25519', status: 'revoked', publicKeyPem: pem(B.publicKey) }
    ]
  };
  await writeFile(path.join(t, 'trust-root.json'), JSON.stringify(trust, null, 2));

  r = run('sign-release-integrity.mjs', [path.join(deploy, 'release-integrity.json'), path.join(t, 'A.priv'), path.join(deploy, 'release-integrity.sig')]);
  expect('sign', r.status === 0);
  r = run('verify-release-signature.mjs', [path.join(deploy, 'release-integrity.json'), path.join(deploy, 'release-integrity.sig'), path.join(t, 'trust-root.json')]);
  expect('verify-signature-clean', r.status === 0);

  // NC-5 podpis cizim klicem pri deklarovanem keyId A
  r = run('sign-release-integrity.mjs', [path.join(deploy, 'release-integrity.json'), path.join(t, 'B.priv'), path.join(t, 'wrong.sig')]);
  r = run('verify-release-signature.mjs', [path.join(deploy, 'release-integrity.json'), path.join(t, 'wrong.sig'), path.join(t, 'trust-root.json')]);
  expect('NC-wrong-key-for-declared-keyId-denied', r.status !== 0);

  // NC-6 revokovany klic
  const revoked = JSON.parse(await readFile(path.join(t, 'ri.json'), 'utf8'));
  revoked.signature.keyId = 'ghrab-key-2025-OLD';
  await writeFile(path.join(t, 'revoked.json'), JSON.stringify(revoked, null, 2) + '\n');
  run('sign-release-integrity.mjs', [path.join(t, 'revoked.json'), path.join(t, 'B.priv'), path.join(t, 'revoked.sig')]);
  r = run('verify-release-signature.mjs', [path.join(t, 'revoked.json'), path.join(t, 'revoked.sig'), path.join(t, 'trust-root.json')]);
  expect('NC-revoked-key-denied', r.status !== 0);

  // NC-7 neznamy keyId
  const unknown = JSON.parse(await readFile(path.join(t, 'ri.json'), 'utf8'));
  unknown.signature.keyId = 'attacker-key';
  await writeFile(path.join(t, 'unknown.json'), JSON.stringify(unknown, null, 2) + '\n');
  run('sign-release-integrity.mjs', [path.join(t, 'unknown.json'), path.join(t, 'B.priv'), path.join(t, 'unknown.sig')]);
  r = run('verify-release-signature.mjs', [path.join(t, 'unknown.json'), path.join(t, 'unknown.sig'), path.join(t, 'trust-root.json')]);
  expect('NC-unknown-keyId-denied', r.status !== 0);

  // --- registry / anti-rollback
  const registry = {
    schema: 'ghrab-release-registry-v1', updatedAt: new Date().toISOString(),
    apps: [{ appId: 'synthetic-app', approvedVersion: '1.2.0', artifactDigest: digest1, keyId: 'ghrab-key-2026-A', approvedAt: new Date().toISOString(), status: 'approved', history: [{ version: '1.1.0' }] }]
  };
  await writeFile(path.join(t, 'registry.json'), JSON.stringify(registry, null, 2));
  r = run('verify-release-registry.mjs', [path.join(deploy, 'release-integrity.json'), path.join(t, 'registry.json')]);
  expect('registry-clean', r.status === 0);

  // NC-8 validne podepsany starsi release
  const old = { ...registry, apps: [{ ...registry.apps[0], approvedVersion: '1.3.0', history: [{ version: '1.2.0' }] }] };
  await writeFile(path.join(t, 'registry-newer.json'), JSON.stringify(old, null, 2));
  r = run('verify-release-registry.mjs', [path.join(deploy, 'release-integrity.json'), path.join(t, 'registry-newer.json')]);
  expect('NC-signed-rollback-denied', r.status !== 0);

  // NC-9 neznama aplikace
  const foreign = { ...registry, apps: [{ ...registry.apps[0], appId: 'jina-app' }] };
  await writeFile(path.join(t, 'registry-foreign.json'), JSON.stringify(foreign, null, 2));
  r = run('verify-release-registry.mjs', [path.join(deploy, 'release-integrity.json'), path.join(t, 'registry-foreign.json')]);
  expect('NC-unknown-release-denied', r.status !== 0);

  // --- provenance
  const artifact = path.join(t, 'build.zip');
  await writeFile(artifact, 'synthetic-artifact');
  run('create-build-provenance.mjs', [artifact, path.join(t, 'prov-local.json')]);
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-local.json')]);
  expect('NC-untrusted-local-builder-rejected', r.status !== 0);
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-local.json'), '--allow-local-builder']);
  expect('NC-local-builder-without-source-identity-still-rejected', r.status !== 0);

  const localWithSource = JSON.parse(await readFile(path.join(t, 'prov-local.json'), 'utf8'));
  localWithSource.source.revision = 'b'.repeat(40);
  await writeFile(path.join(t, 'prov-local2.json'), JSON.stringify(localWithSource, null, 2));
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-local2.json')]);
  expect('NC-school-profile-rejects-local-builder', r.status !== 0);
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-local2.json'), '--allow-local-builder']);
  expect('prep-allows-local-builder-explicitly', r.status === 0);

  const good = JSON.parse(await readFile(path.join(t, 'prov-local.json'), 'utf8'));
  good.source.revision = 'a'.repeat(40);
  good.builder.id = 'github-actions://Daniel22-dev/ai-studio-ghrab';
  await writeFile(path.join(t, 'prov.json'), JSON.stringify(good, null, 2));
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov.json')]);
  expect('provenance-clean', r.status === 0);

  // R12 builder allowlist: SCHOOL trust is deny-unless-listed and can pin workflow/entrypoint.
  const builderPolicy = path.join(t, 'builder-policy.json');
  good.builder.workflow = 'refs/workflows/release.yml@refs/heads/main';
  good.builder.entrypoint = 'npm run build:school-server';
  await writeFile(path.join(t, 'prov-policy.json'), JSON.stringify(good, null, 2));
  await writeFile(builderPolicy, JSON.stringify({
    schema:'ghrab-school-builder-policy-v1', mode:'deny-unless-listed', revision:'SELFTEST',
    allowedBuilders:[{id:good.builder.id, workflow:good.builder.workflow, entrypoint:good.builder.entrypoint}]
  }, null, 2));
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-policy.json'), '--builder-policy', builderPolicy]);
  expect('r12-builder-policy-exact-match-clean', r.status === 0);
  const arbitraryBuilder = JSON.parse(await readFile(path.join(t, 'prov-policy.json'), 'utf8'));
  arbitraryBuilder.builder.id = 'synthetic-trusted-school-builder';
  await writeFile(path.join(t, 'prov-policy-bad-id.json'), JSON.stringify(arbitraryBuilder, null, 2));
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-policy-bad-id.json'), '--builder-policy', builderPolicy]);
  expect('NC-r12-arbitrary-builder-id-rejected', r.status !== 0);
  const badWorkflow = JSON.parse(await readFile(path.join(t, 'prov-policy.json'), 'utf8'));
  badWorkflow.builder.workflow = 'refs/workflows/evil.yml@refs/heads/main';
  await writeFile(path.join(t, 'prov-policy-bad-workflow.json'), JSON.stringify(badWorkflow, null, 2));
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-policy-bad-workflow.json'), '--builder-policy', builderPolicy]);
  expect('NC-r12-builder-workflow-mismatch-rejected', r.status !== 0);

  // R11 provenance binding: actual source package + signed release manifest must agree with provenance.
  const sourcePkg = path.join(t, 'build-input-source.zip');
  await writeFile(sourcePkg, 'synthetic-build-input-source');
  const sourcePkgSha = createHash('sha256').update(await readFile(sourcePkg)).digest('hex');
  const boundProv = JSON.parse(await readFile(path.join(t, 'prov.json'), 'utf8'));
  boundProv.source.revision = null;
  boundProv.source.sourcePackageSha256 = sourcePkgSha;
  boundProv.releaseIntegrity.artifactDigest = 'c'.repeat(64);
  await writeFile(path.join(t, 'prov-bound.json'), JSON.stringify(boundProv, null, 2));
  const boundManifest = { schema:'ghrab-release-integrity-v2', sourcePackageSha256:sourcePkgSha, artifactDigest:'c'.repeat(64) };
  await writeFile(path.join(t, 'manifest-bound.json'), JSON.stringify(boundManifest, null, 2));
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-bound.json'), '--release-manifest', path.join(t, 'manifest-bound.json'), '--source-package', sourcePkg]);
  expect('r11-provenance-source-and-artifact-binding-clean', r.status === 0);
  const badSourceProv = { ...boundProv, source:{...boundProv.source, sourcePackageSha256:'0'.repeat(64)} };
  await writeFile(path.join(t, 'prov-bad-source.json'), JSON.stringify(badSourceProv, null, 2));
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-bad-source.json'), '--release-manifest', path.join(t, 'manifest-bound.json'), '--source-package', sourcePkg]);
  expect('NC-r11-wrong-but-present-source-hash-rejected', r.status !== 0);
  const badDigestProv = { ...boundProv, releaseIntegrity:{artifactDigest:'f'.repeat(64)} };
  await writeFile(path.join(t, 'prov-bad-digest.json'), JSON.stringify(badDigestProv, null, 2));
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-bad-digest.json'), '--release-manifest', path.join(t, 'manifest-bound.json'), '--source-package', sourcePkg]);
  expect('NC-r11-wrong-artifactDigest-rejected', r.status !== 0);
  const badManifestSource = { ...boundManifest, sourcePackageSha256:'0'.repeat(64) };
  await writeFile(path.join(t, 'manifest-bad-source.json'), JSON.stringify(badManifestSource, null, 2));
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov-bound.json'), '--release-manifest', path.join(t, 'manifest-bad-source.json'), '--source-package', sourcePkg]);
  expect('NC-r11-signed-manifest-source-mismatch-rejected', r.status !== 0);
  await writeFile(artifact, 'tampered-artifact');
  r = run('verify-build-provenance.mjs', [artifact, path.join(t, 'prov.json')]);
  expect('NC-provenance-artifact-tamper-fails', r.status !== 0);
  await writeFile(artifact, 'synthetic-artifact');

  // --- leak scanner
  const leak = path.join(t, 'leak'); await mkdir(leak);
  await writeFile(path.join(leak, 'index.html'), 'ok');
  r = run('scan-deployment-leaks.mjs', [leak]);
  expect('leak-clean', r.status === 0);
  await writeFile(path.join(leak, '.env.production'), 'SESSION_SECRET=7f3a9c1e5b2d8046af11c3e7b9d05a62\n');
  r = run('scan-deployment-leaks.mjs', [leak]);
  expect('NC-env-production-detected', r.status !== 0);
  await rm(path.join(leak, '.env.production'));
  await writeFile(path.join(leak, 'bundle.js'), '// b\n' + 'a'.repeat(2_100_000) + '\nconst K="AIzaSyFAKEFAKEFAKEFAKEFAKEFAKEFAKE00";\n');
  r = run('scan-deployment-leaks.mjs', [leak]);
  expect('NC-secret-in-large-bundle-detected', r.status !== 0);
  await rm(path.join(leak, 'bundle.js'));
  await writeFile(path.join(leak, 'app.js.map'), '{}');
  r = run('scan-deployment-leaks.mjs', [leak]);
  expect('NC-sourcemap-detected', r.status !== 0);
  await rm(path.join(leak, 'app.js.map'));
  await writeFile(path.join(leak, 'jwk.json'), JSON.stringify({ kty: 'EC', crv: 'P-256', x: 'A'.repeat(43), y: 'B'.repeat(43), d: 'C'.repeat(43) }));
  r = run('scan-deployment-leaks.mjs', [leak]);
  expect('NC-jwk-private-key-detected', r.status !== 0);
  await rm(path.join(leak, 'jwk.json'));
  await writeFile(path.join(leak, 'encrypted.txt'), '-----BEGIN ' + 'ENCRYPTED PRIVATE KEY-----\n' + 'A'.repeat(64) + '\n-----END ' + 'ENCRYPTED PRIVATE KEY-----\n');
  r = run('scan-deployment-leaks.mjs', [leak]);
  expect('NC-encrypted-private-key-detected', r.status !== 0);
  await rm(path.join(leak, 'encrypted.txt'));
  await writeFile(path.join(leak, 'pgp.txt'), '-----BEGIN ' + 'PGP PRIVATE KEY ' + 'BLOCK-----\n' + 'A'.repeat(64) + '\n-----END ' + 'PGP PRIVATE KEY ' + 'BLOCK-----\n');
  r = run('scan-deployment-leaks.mjs', [leak]);
  expect('NC-pgp-private-key-detected', r.status !== 0);
  await rm(path.join(leak, 'pgp.txt'));

  // --- evidence
  const ev = path.join(t, 'evidence'); await mkdir(ev);
  await writeFile(path.join(ev, 'result.txt'), 'PASS synthetic\n');
  run('create-evidence-manifest.mjs', [ev, path.join(t, 'evidence.json')]);
  r = run('verify-evidence-manifest.mjs', [ev, path.join(t, 'evidence.json')]);
  expect('evidence-clean', r.status === 0);
  await writeFile(path.join(ev, 'result.txt'), 'TAMPER\n');
  r = run('verify-evidence-manifest.mjs', [ev, path.join(t, 'evidence.json')]);
  expect('NC-evidence-tamper-fails', r.status !== 0);
  await writeFile(path.join(ev, 'result.txt'), 'PASS synthetic\n');

  // N10 hardening: evidence manifest v2 must bind selected authoritative policy files outside evidence-dir.
  const policyFile = path.join(t, 'security-critical-assets.json');
  await writeFile(policyFile, '["app-guard.js"]\n');

  run('create-evidence-manifest.mjs', [ev, path.join(t, 'evidence-v2.json'), '--project-root', t, '--extra', 'security-critical-assets.json']);
  // R9/N58: a canonical required-evidence policy must constrain manifest scope.
  const requiredEvidencePolicy = path.join(t, 'required-evidence.json');
  await writeFile(requiredEvidencePolicy, JSON.stringify({schema:'ghrab-required-evidence-policy-v1',appId:null,minimumExternalFiles:1,requiredExternalFiles:['security-critical-assets.json'],requiredExternalGlobs:[]}, null, 2));
  r = run('verify-evidence-manifest.mjs', [ev, path.join(t, 'evidence-v2.json'), '--project-root', t, '--required-policy', requiredEvidencePolicy]);
  expect('r9-required-evidence-policy-clean', r.status === 0);
  const weakManifest = JSON.parse(await readFile(path.join(t, 'evidence-v2.json'),'utf8')); weakManifest.externalFiles=[]; await writeFile(path.join(t,'evidence-weak.json'),JSON.stringify(weakManifest,null,2));
  r = run('verify-evidence-manifest.mjs', [ev, path.join(t, 'evidence-weak.json'), '--project-root', t, '--required-policy', requiredEvidencePolicy]);
  expect('NC-r9-required-evidence-cannot-be-omitted', r.status !== 0 && (r.stderr.includes('required-external-missing') || r.stdout.includes('required-external-missing')));

  // R10/N66: a glob-named decoy SBOM cannot satisfy evidence; its hash must match the signed release manifest anchor.
  await mkdir(path.join(t,'security','sbom'), {recursive:true});
  const realSbom=path.join(t,'security','sbom','synthetic.cdx.json');
  const decoySbom=path.join(t,'security','sbom','decoy.cdx.json');
  await writeFile(realSbom, '{"bomFormat":"CycloneDX","specVersion":"1.6"}\n');
  await writeFile(decoySbom, '{}\n');
  const realSbomSha=createHash('sha256').update(await readFile(realSbom)).digest('hex');
  const anchorRelease=path.join(t,'release-anchor.json');
  await writeFile(anchorRelease,JSON.stringify({appId:null,sbomSha256:realSbomSha},null,2));
  const anchoredPolicy=path.join(t,'required-evidence-anchor.json');
  await writeFile(anchoredPolicy,JSON.stringify({schema:'ghrab-required-evidence-policy-v1',appId:null,minimumExternalFiles:2,requiredExternalFiles:['security-critical-assets.json'],requiredExternalGlobs:[],requiredReleaseAnchors:[{glob:'security/sbom/*.cdx.json',releaseManifestField:'sbomSha256',minimumMatches:1}]},null,2));
  run('create-evidence-manifest.mjs',[ev,path.join(t,'evidence-anchor-good.json'),'--project-root',t,'--extra','security-critical-assets.json','--extra','security/sbom/synthetic.cdx.json']);
  r=run('verify-evidence-manifest.mjs',[ev,path.join(t,'evidence-anchor-good.json'),'--project-root',t,'--required-policy',anchoredPolicy,'--release-manifest',anchorRelease]);
  expect('r10-release-anchored-evidence-clean',r.status===0);
  run('create-evidence-manifest.mjs',[ev,path.join(t,'evidence-anchor-decoy.json'),'--project-root',t,'--extra','security-critical-assets.json','--extra','security/sbom/decoy.cdx.json']);
  r=run('verify-evidence-manifest.mjs',[ev,path.join(t,'evidence-anchor-decoy.json'),'--project-root',t,'--required-policy',anchoredPolicy,'--release-manifest',anchorRelease]);
  expect('NC-r10-sbom-decoy-cannot-satisfy-release-anchor',r.status!==0&&(r.stderr.includes('required-release-anchor-missing-or-mismatch')||r.stdout.includes('required-release-anchor-missing-or-mismatch')));
  r = run('verify-evidence-manifest.mjs', [ev, path.join(t, 'evidence-v2.json'), '--project-root', t]);
  expect('evidence-v2-external-policy-clean', r.status === 0);
  await writeFile(policyFile, '["tampered.js"]\n');
  r = run('verify-evidence-manifest.mjs', [ev, path.join(t, 'evidence-v2.json'), '--project-root', t]);
  expect('NC-evidence-v2-external-policy-tamper-fails', r.status !== 0);
  await writeFile(policyFile, '["app-guard.js"]\n');

  // --- vendorovana konzistence
  const eco = path.join(t, 'eco');
  await mkdir(path.join(eco, 'studio', 'src'), { recursive: true });
  await mkdir(path.join(eco, 'ks', 'src', 'vendor'), { recursive: true });
  await mkdir(path.join(eco, 'sortio', 'src', 'vendor'), { recursive: true });
  await writeFile(path.join(eco, 'studio', 'src', 'platform.js'), 'export const V="1.1.0"\n');
  await writeFile(path.join(eco, 'ks', 'src', 'vendor', 'platform.js'), 'export const V="1.1.0"\n');
  await writeFile(path.join(eco, 'sortio', 'src', 'vendor', 'platform.js'), 'export const V="1.0.9"\n');
  const cfg = {
    schema: 'ghrab-vendored-consistency-v1', canonicalRoot: 'studio',
    components: [{ id: 'platform', canonical: 'src/platform.js', severity: 'CRITICAL' }],
    consumers: [
      { appId: 'ks', root: 'ks', copies: { platform: ['src/vendor/platform.js'] } },
      { appId: 'sortio', root: 'sortio', copies: { platform: ['src/vendor/platform.js'] } }
    ]
  };
  await writeFile(path.join(eco, 'cfg.json'), JSON.stringify(cfg, null, 2));
  r = run('check-vendored-consistency.mjs', [path.join(eco, 'cfg.json')]);
  expect('NC-vendored-drift-detected', r.status !== 0 && r.stderr.includes('DRIFT'));
  await writeFile(path.join(eco, 'sortio', 'src', 'vendor', 'platform.js'), 'export const V="1.1.0"\n');
  r = run('check-vendored-consistency.mjs', [path.join(eco, 'cfg.json')]);
  expect('vendored-consistent-after-fix', r.status === 0);

  // --- service worker freeze
  const swDir = path.join(t, 'swapp'); await mkdir(path.join(swDir, 'access'), { recursive: true });
  await writeFile(path.join(swDir, 'access', 'app-guard.js'), '// guard\n');
  await writeFile(path.join(swDir, 'access', 'revoked-access.json'), '[]\n');
  await writeFile(path.join(swDir, 'index.html'), 'ok');
  const badSw = `const PRECACHE=['/index.html','/app-guard.js','/revoked-access.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open('x').then(cache=>cache.addAll(PRECACHE))));
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request)))});`;
  await writeFile(path.join(t, 'sw-bad.js'), badSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-bad.js'), swDir]);
  expect('NC-sw-freezes-guard-detected', r.status !== 0);

  // GH-02 hotfix regression: variable name must not hide an array-driven cache.add path.
  const blindSpotSw = `const RANDOM_CACHE_LIST=['/index.html','/app-guard.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open('x').then(cache=>Promise.all(RANDOM_CACHE_LIST.map(asset=>cache.add(asset))))));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.pathname.includes('app-guard')){e.respondWith(fetch(e.request,{cache:'no-store'}));return;}e.respondWith(fetch(e.request));});`;
  await writeFile(path.join(t, 'sw-blindspot.js'), blindSpotSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-blindspot.js'), swDir]);
  expect('NC-sw-arbitrary-array-name-cannot-hide-critical-precache', r.status !== 0 && (r.stderr.includes('CRITICAL') || r.stdout.includes('CRITICAL')));
  const goodSw = `const PRECACHE=['/index.html'];
async function networkOnlyNoStore(request){return fetch(request,{cache:'no-store'})}
function isSecurityCriticalRequest(url,scopePath){const raw=url.pathname.slice(scopePath.length);let relative;try{relative=decodeURIComponent(raw)}catch{return true}relative=relative.replace(/\\\\/g,'/');const parts=[];for(const segment of relative.split('/')){if(!segment||segment==='.')continue;if(segment==='..'){if(!parts.length)return true;parts.pop();continue}parts.push(segment)}relative=parts.join('/');return relative==='access/app-guard.js'||relative==='access/access-control.js'||relative==='ghrab/ghrab-platform.js'||relative==='access/deployment-config.js'||relative==='access/revoked-access.json'||relative==='runtime-config.js'||relative==='config/deployment.json'||relative==='config/deployment.school-server.json'||relative==='release-integrity.json'||relative==='release-integrity.sig'||relative==='integrity-status.json'}
async function cacheFirst(request){const cache=await caches.open('x');const cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(response&&response.ok)await cache.put(request,response.clone());return response}
self.addEventListener('fetch',e=>{const request=e.request;const u=new URL(request.url);const scopePath=new URL('./',self.location.href).pathname;if(isSecurityCriticalRequest(u,scopePath)){e.respondWith(networkOnlyNoStore(request));return;}e.respondWith(cacheFirst(request))});`;
  await writeFile(path.join(t, 'sw-good.js'), goodSw);
  const goodCriticalListPath = path.join(t, 'critical-good.json');
  await writeFile(goodCriticalListPath, JSON.stringify(['app-guard','access-control','ghrab/ghrab-platform.js','access/deployment-config.js','revoked-access.json','runtime-config.js','config/deployment.json','config/deployment.school-server.json','release-integrity.json','release-integrity.sig','integrity-status'], null, 2));
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-good.js'), swDir, goodCriticalListPath]);
  expect('sw-network-first-for-guard-passes', r.status === 0);
  let goodSwReport = {}; try { goodSwReport = JSON.parse(r.stdout || '{}'); } catch {}
  expect('sw-pass-emits-positive-behavioral-evidence', goodSwReport.behavioralGuard?.status === 'PASS' && goodSwReport.fetchRouteBehavior?.status === 'PASS' && goodSwReport.fetchRouteBehavior?.checkedAuthoritative >= 2);
  const serverOnlyCritical = path.join(t, 'critical-server-only.json');
  await writeFile(serverOnlyCritical, JSON.stringify(['access-control'], null, 2));
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-good.js'), swDir, serverOnlyCritical]);
  expect('NC-sw-server-only-authority-is-behaviorally-tested', r.status !== 0 && (r.stderr.includes('access-control') || r.stdout.includes('access-control')));

  // N7 hardening: alternate Cache API write paths must never be silent PASS.
  const criticalListPath = path.join(t, 'critical-list.json');
  await writeFile(criticalListPath, JSON.stringify(['app-guard.js'], null, 2));
  const swVariants = [
    ['property-array-addAll', `self.EXTRA_ASSETS=['/app-guard.js'];\nself.addEventListener('install',e=>e.waitUntil(caches.open('x').then(cache=>cache.addAll(self.EXTRA_ASSETS))));`],
    ['cache-put-literal', `self.addEventListener('install',e=>e.waitUntil(caches.open('x').then(cache=>cache.put('/app-guard.js',new Response('x')))));`],
    ['cache-add-new-request', `self.addEventListener('install',e=>e.waitUntil(caches.open('x').then(cache=>cache.add(new Request('/app-guard.js')))));`],
    ['concat-addAll', `const BASE=['/index.html'];const X=BASE.concat(['/app-guard.js']);\nself.addEventListener('install',e=>e.waitUntil(caches.open('x').then(cache=>cache.addAll(X))));`],
    ['split-addAll', `const X='/index.html,/app-guard.js'.split(',');\nself.addEventListener('install',e=>e.waitUntil(caches.open('x').then(cache=>cache.addAll(X))));`],
    ['object-values-forof-add', `const MAP={a:'/index.html',b:'/app-guard.js'};\nself.addEventListener('install',e=>e.waitUntil((async()=>{const cache=await caches.open('x');for(const asset of Object.values(MAP)){await cache.add(asset)}})()));`]
  ];
  for (const [id, code] of swVariants) {
    const f = path.join(t, `sw-${id}.js`); await writeFile(f, code);
    r = run('check-sw-security-freeze.mjs', [f, swDir, criticalListPath]);
    expect(`NC-sw-${id}-not-silent-pass`, r.status !== 0);
  }
  const unresolvedSw = `let dynamicPath;self.addEventListener('install',e=>e.waitUntil(caches.open('x').then(cache=>cache.add(dynamicPath))));`;
  await writeFile(path.join(t, 'sw-unresolved.js'), unresolvedSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-unresolved.js'), swDir, criticalListPath]);
  expect('NC-sw-unresolved-cache-write-amber-or-fail', r.status !== 0 && (r.stderr.includes('AMBER') || r.stdout.includes('AMBER') || r.stderr.includes('FAIL') || r.stdout.includes('FAIL')));

  // N8 hardening: comments/text proximity cannot create a network-only exemption.
  await writeFile(path.join(swDir, 'data-manifest.json'), '{}\n');
  const dataCritical = path.join(t, 'critical-data.json');
  await writeFile(dataCritical, JSON.stringify(['data-manifest.json'], null, 2));
  const commentBypassSw = `const CORE=['/index.html'];\nself.addEventListener('install',e=>e.waitUntil(caches.open('x').then(cache=>cache.addAll(CORE))));\nasync function networkFirst(request){ // data-manifest.json network later\n const cache=await caches.open('x');try{return await fetch(request)}catch(e){return cache.match(request)}}\nasync function cacheFirst(request){const cache=await caches.open('x');const c=await cache.match(request);if(c)return c;const rr=await fetch(request);if(rr.ok)await cache.put(request,rr.clone());return rr}\nself.addEventListener('fetch',e=>e.respondWith(cacheFirst(e.request)));`;
  await writeFile(path.join(t, 'sw-comment-bypass.js'), commentBypassSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-comment-bypass.js'), swDir, dataCritical]);
  expect('NC-sw-comment-cannot-create-exemption', r.status !== 0);

  // N6 2026-09-09 hardening: literals that look equivalent after normalization must not mask a false runtime predicate.
  const behavioralBypassSw = `async function networkOnlyNoStore(request){return fetch(request,{cache:'no-store'})}
function isSecurityCriticalRequest(url,scopePath){const relative=url.pathname.slice(scopePath.length);return relative==='./app-guard.js'}
async function cacheFirst(request){const cache=await caches.open('x');const cached=await cache.match(request);if(cached)return cached;const response=await fetch(request);if(response&&response.ok)await cache.put(request,response.clone());return response}
self.addEventListener('fetch',event=>{const request=event.request;const url=new URL(request.url);const scopePath=new URL('./',self.location.href).pathname;if(isSecurityCriticalRequest(url,scopePath)){event.respondWith(networkOnlyNoStore(request));return;}event.respondWith(cacheFirst(request));});`;
  await writeFile(path.join(t, 'sw-behavioral-guard-bypass.js'), behavioralBypassSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-behavioral-guard-bypass.js'), swDir, criticalListPath]);
  expect('NC-sw-behavioral-guard-false-negative-detected', r.status !== 0 && (r.stderr.includes('behavioral') || r.stdout.includes('behavioral')));

  // N14 2026-09-09 hardening: the whole fetch route must be fail-closed, not just the predicate.
  const negatedGuardSw = goodSw.replace('if(isSecurityCriticalRequest(u,scopePath)){','if(!isSecurityCriticalRequest(u,scopePath)){');
  await writeFile(path.join(t, 'sw-guard-negated.js'), negatedGuardSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-guard-negated.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-negated-critical-guard-detected', r.status !== 0 && (r.stderr.includes('fetch handler') || r.stdout.includes('fetch handler')));
  const noRespondGuardSw = goodSw.replace('e.respondWith(networkOnlyNoStore(request));return;','networkOnlyNoStore(request);');
  await writeFile(path.join(t, 'sw-guard-no-respond.js'), noRespondGuardSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-guard-no-respond.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-critical-route-without-respond-return-detected', r.status !== 0 && (r.stderr.includes('fetch handler') || r.stdout.includes('fetch handler')));
  // N20/N21/N22 hardening: close the pre-guard routing-property class and verify the trusted sink itself.
  const preGuardVariants = [
    ['destination-respond', `if(e.request.destination==='script'){e.respondWith(networkFirst(e.request));return;}`],
    ['mode-return', `if(e.request.mode!=='same-origin')return;`],
    ['event-client-respond', `if(e.clientId){e.respondWith(networkFirst(e.request));return;}`],
    ['url-search', `if(u.search){e.respondWith(networkFirst(e.request));return;}`],
    ['referrer-respond', `if(e.request.referrer){e.respondWith(networkFirst(e.request));return;}`]
  ];
  for (const [id, pre] of preGuardVariants) {
    const mutated = goodSw.replace('if(isSecurityCriticalRequest(u,scopePath)){', `${pre}if(isSecurityCriticalRequest(u,scopePath)){`);
    const f = path.join(t, `sw-pre-guard-${id}.js`); await writeFile(f, mutated);
    r = run('check-sw-security-freeze.mjs', [f, swDir, goodCriticalListPath]);
    expect(`NC-sw-pre-guard-${id}-detected`, r.status !== 0 && (r.stderr.includes('preGuardReads') || r.stdout.includes('preGuardReads') || r.stderr.includes('fetch handler') || r.stdout.includes('fetch handler')));
  }
  const sinkNoStoreSw = goodSw.replace("return fetch(request,{cache:'no-store'})", 'return fetch(request)');
  await writeFile(path.join(t, 'sw-sink-no-no-store.js'), sinkNoStoreSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-sink-no-no-store.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-network-only-sink-must-use-no-store', r.status !== 0 && (r.stderr.includes('networkOnlyNoStore') || r.stdout.includes('networkOnlyNoStore')));
  const sinkCacheWriteSw = goodSw.replace(
    "async function networkOnlyNoStore(request){return fetch(request,{cache:'no-store'})}",
    "async function networkOnlyNoStore(request){const c=await caches.open('x');const r=await fetch(request,{cache:'no-store'});await c.put(request,r);return r}"
  );
  await writeFile(path.join(t, 'sw-sink-cache-write.js'), sinkCacheWriteSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-sink-cache-write.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-network-only-sink-cache-write-is-critical', r.status !== 0 && (r.stderr.includes('CRITICAL') || r.stdout.includes('CRITICAL')));

  // Round-4 class closure: even ignored pre-guard side effects and multiple handlers must fail closed.
  const preGuardNetworkFirstSw = goodSw.replace('if(isSecurityCriticalRequest(u,scopePath)){', 'networkFirst(e.request);if(isSecurityCriticalRequest(u,scopePath)){');
  await writeFile(path.join(t, 'sw-pre-guard-networkfirst-side-effect.js'), preGuardNetworkFirstSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-pre-guard-networkfirst-side-effect.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-pre-guard-networkfirst-side-effect-detected', r.status !== 0 && (r.stderr.includes('preGuardEffects') || r.stdout.includes('preGuardEffects')));
  const preGuardFetchSw = goodSw.replace('if(isSecurityCriticalRequest(u,scopePath)){', 'fetch(e.request);if(isSecurityCriticalRequest(u,scopePath)){');
  await writeFile(path.join(t, 'sw-pre-guard-direct-fetch-side-effect.js'), preGuardFetchSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-pre-guard-direct-fetch-side-effect.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-pre-guard-direct-fetch-side-effect-detected', r.status !== 0 && (r.stderr.includes('preGuardEffects') || r.stdout.includes('preGuardEffects')));
  const multipleFetchHandlersSw = goodSw + `
self.addEventListener('fetch',e=>{networkFirst(e.request);});
`;
  await writeFile(path.join(t, 'sw-multiple-fetch-handlers.js'), multipleFetchHandlersSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-multiple-fetch-handlers.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-multiple-fetch-handlers-detected', r.status !== 0 && (r.stderr.includes('fetch-handler-registration-ambiguous') || r.stdout.includes('fetch-handler-registration-ambiguous')));
  const asyncDeferredSideEffectSw = goodSw.replace('if(isSecurityCriticalRequest(u,scopePath)){', 'Promise.resolve().then(()=>networkFirst(e.request));if(isSecurityCriticalRequest(u,scopePath)){');
  await writeFile(path.join(t, 'sw-pre-guard-async-deferred-side-effect.js'), asyncDeferredSideEffectSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-pre-guard-async-deferred-side-effect.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-pre-guard-async-deferred-side-effect-detected', r.status !== 0 && (r.stderr.includes('not-safe-for-bounded-eval') || r.stdout.includes('not-safe-for-bounded-eval')));
  const postGuardSideEffectSw = goodSw.replace('if(isSecurityCriticalRequest(u,scopePath)){e.respondWith(networkOnlyNoStore(request));return;}', 'if(isSecurityCriticalRequest(u,scopePath)){networkFirst(request);e.respondWith(networkOnlyNoStore(request));return;}');
  await writeFile(path.join(t, 'sw-critical-branch-extra-route-effect.js'), postGuardSideEffectSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-critical-branch-extra-route-effect.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-critical-branch-extra-route-effect-detected', r.status !== 0 && (r.stderr.includes('routeEffects') || r.stdout.includes('routeEffects') || r.stderr.includes('fetch handler') || r.stdout.includes('fetch handler')));
  const postGuardAsyncSourceSw = goodSw.replace('if(isSecurityCriticalRequest(u,scopePath)){e.respondWith(networkOnlyNoStore(request));return;}', 'if(isSecurityCriticalRequest(u,scopePath)){e.preloadResponse.then(()=>networkFirst(request));e.respondWith(networkOnlyNoStore(request));return;}');
  await writeFile(path.join(t, 'sw-critical-branch-async-source.js'), postGuardAsyncSourceSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-critical-branch-async-source.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-critical-branch-async-source-detected', r.status !== 0 && (r.stderr.includes('postGuardReads') || r.stdout.includes('postGuardReads') || r.stderr.includes('not-safe-for-bounded-eval') || r.stdout.includes('not-safe-for-bounded-eval')));

  // Round-5 class closure: shadowing, deferred registration, Request reflection and sink branch variants.
  const shadowGuardSw = goodSw + `
function isSecurityCriticalRequest(){return false;}
`;
  await writeFile(path.join(t, 'sw-shadow-critical-guard.js'), shadowGuardSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-shadow-critical-guard.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-shadowed-critical-guard-detected', r.status !== 0 && (r.stderr.includes('identity') || r.stdout.includes('identity')));

  const shadowSinkSw = goodSw + `
async function networkOnlyNoStore(request){const c=await caches.open('x');const rr=await fetch(request,{cache:'no-store'});await c.put(request,rr);return rr;}
`;
  await writeFile(path.join(t, 'sw-shadow-network-only-sink.js'), shadowSinkSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-shadow-network-only-sink.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-shadowed-network-only-sink-detected', r.status !== 0 && (r.stderr.includes('identity') || r.stdout.includes('identity')));

  const deferredFetchSw = goodSw + `
self.addEventListener('message',()=>{self.addEventListener('fetch',e=>e.respondWith(cacheFirst(e.request)));});
`;
  await writeFile(path.join(t, 'sw-deferred-fetch-registration.js'), deferredFetchSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-deferred-fetch-registration.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-deferred-fetch-registration-detected', r.status !== 0 && (r.stderr.includes('deferredFetchRegistrations') || r.stdout.includes('deferredFetchRegistrations') || r.stderr.includes('fetch-handler-registration-ambiguous') || r.stdout.includes('fetch-handler-registration-ambiguous')));

  const sinkConditionalSw = goodSw.replace("return fetch(request,{cache:'no-store'})", "return fetch(request,{cache:request.destination==='script'?'default':'no-store'})");
  await writeFile(path.join(t, 'sw-sink-request-dependent.js'), sinkConditionalSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-sink-request-dependent.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-sink-request-dependent-branch-detected', r.status !== 0 && (r.stderr.includes('minimalni fail-closed') || r.stdout.includes('minimalni fail-closed') || r.stderr.includes('sink') || r.stdout.includes('sink')));

  const reflectionSw = goodSw.replace('if(isSecurityCriticalRequest(u,scopePath)){', 'if(isSecurityCriticalRequest(u,scopePath)){if(!Object.keys(request).length){e.respondWith(cacheFirst(request));return;}');
  await writeFile(path.join(t, 'sw-request-reflection.js'), reflectionSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-request-reflection.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-request-reflection-detected', r.status !== 0 && (r.stderr.includes('postGuardReads') || r.stdout.includes('postGuardReads') || r.stderr.includes('fetch handler') || r.stdout.includes('fetch handler')));

  const queryWashSw = goodSw.replace('if(isSecurityCriticalRequest(u,scopePath)){', "const rawUrl=request.url;if(isSecurityCriticalRequest(u,scopePath)){if(rawUrl.includes('?')){e.respondWith(cacheFirst(request));return;}");
  await writeFile(path.join(t, 'sw-query-wash.js'), queryWashSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-query-wash.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-query-variant-wash-detected', r.status !== 0 && (r.stderr.includes('urlVariant') || r.stdout.includes('urlVariant') || r.stderr.includes('fetch handler') || r.stdout.includes('fetch handler')));

  // Round-6 semantic closure: analyze the runtime registration, pin platform dependencies, normalize same-resource URLs, and bind canonical minimum inventory.
  const fetchShadowSw = `const fetch=(req,opts)=>{const p=globalThis.fetch(req,opts);p.then(r=>caches.open('x').then(c=>c['put'](req,r.clone())));return p};\n` + goodSw;
  await writeFile(path.join(t, 'sw-shadow-global-fetch.js'), fetchShadowSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-shadow-global-fetch.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-global-fetch-shadow-detected', r.status !== 0 && (r.stderr.includes('platform security dependency') || r.stdout.includes('platform security dependency')));

  const urlShadowSw = `const URL=class URL{constructor(input){this.origin='https://example.invalid';this.pathname='/__ghrab_scope__/index.html'}};\n` + goodSw;
  await writeFile(path.join(t, 'sw-shadow-global-url.js'), urlShadowSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-shadow-global-url.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-global-url-shadow-detected', r.status !== 0 && (r.stderr.includes('platform security dependency') || r.stdout.includes('platform security dependency')));

  const decoyHandler = goodSw.replace("self.addEventListener('fetch',e=>{", "if(false){self.addEventListener('fetch',e=>{const request=e.request;const u=new URL(request.url);const scopePath=new URL('./',self.location.href).pathname;if(isSecurityCriticalRequest(u,scopePath)){e.respondWith(networkOnlyNoStore(request));return;}e.respondWith(cacheFirst(request))});}\nself.addEventListener('fetch',e=>{").replace('e.respondWith(cacheFirst(request))});','e.respondWith(cacheFirst(request))});',1);
  await writeFile(path.join(t, 'sw-dead-decoy-fetch-handler.js'), decoyHandler);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-dead-decoy-fetch-handler.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-dead-decoy-fetch-registration-detected', r.status !== 0 && (r.stderr.includes('syntactically unique') || r.stdout.includes('syntactically unique') || r.stderr.includes('registration') || r.stdout.includes('registration')));

  const deferredOtherMessage = goodSw + `\nself.addEventListener('message',e=>{if(e.data?.type==='GHRAB_TURBO')self.addEventListener('fetch',x=>x.respondWith(cacheFirst(x.request)))})\n`;
  await writeFile(path.join(t, 'sw-deferred-unprobed-message.js'), deferredOtherMessage);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-deferred-unprobed-message.js'), swDir, goodCriticalListPath]);
  expect('NC-sw-deferred-unprobed-fetch-registration-detected', r.status !== 0 && (r.stderr.includes('registration') || r.stdout.includes('registration')));

  const narrowedCriticalList = path.join(t, 'critical-narrowed.json');
  await writeFile(narrowedCriticalList, JSON.stringify(['ghrab/ghrab-platform.js','access/deployment-config.js','runtime-config.js','config/deployment.json','config/deployment.school-server.json','release-integrity.json','release-integrity.sig','integrity-status'], null, 2));
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-good.js'), swDir, narrowedCriticalList]);
  expect('NC-sw-canonical-critical-inventory-shrink-detected', r.status !== 0 && (r.stderr.includes('canonical GARP minimum') || r.stdout.includes('canonical GARP minimum')));

  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-good.js'), swDir, goodCriticalListPath]);
  let normalizedReport = {}; try { normalizedReport = JSON.parse(r.stdout || '{}'); } catch {}
  expect('sw-same-resource-url-variants-pass', r.status === 0 && normalizedReport.fetchRouteBehavior?.urlVariants?.includes('normalization-closure-1') && normalizedReport.fetchRouteBehavior?.urlVariants?.some(x=>String(x).startsWith('normalization-depth-dot-slash-')) && normalizedReport.behavioralGuard?.status === 'PASS' && normalizedReport.registeredFetchClosureBehavior?.status === 'PASS');

  // Round-7 invariant closure: runtime identity, actual closure behavior, measured registration,
  // normalization-property fuzzing, and dynamic-code non-PASS.
  const reflectFetchSw = `const __origFetch=fetch;const __wrapFetch=(...a)=>{const p=__origFetch(...a);p.then(r=>caches.open('x').then(c=>c.put(a[0],r.clone())));return p};Reflect.set(globalThis,'fetch',__wrapFetch);
` + goodSw;
  await writeFile(path.join(t, 'sw-r7-reflect-fetch.js'), reflectFetchSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-reflect-fetch.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-reflect-set-platform-identity-detected', r.status !== 0 && (r.stderr.includes('runtime identity') || r.stdout.includes('runtime identity')));

  const definePropsFetchSw = `const __origFetch=fetch;const __wrapFetch=(...a)=>{const p=__origFetch(...a);p.then(r=>caches.open('x').then(c=>c.put(a[0],r.clone())));return p};Object.defineProperties(globalThis,{fetch:{value:__wrapFetch,writable:true,configurable:true}});
` + goodSw;
  await writeFile(path.join(t, 'sw-r7-define-properties-fetch.js'), definePropsFetchSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-define-properties-fetch.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-define-properties-platform-identity-detected', r.status !== 0 && (r.stderr.includes('runtime identity') || r.stdout.includes('runtime identity')));

  const computedFetchSw = `const __origFetch=fetch;const __wrapFetch=(...a)=>__origFetch(...a);const __k='fet'+'ch';globalThis[__k]=__wrapFetch;
` + goodSw;
  await writeFile(path.join(t, 'sw-r7-computed-fetch.js'), computedFetchSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-computed-fetch.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-computed-platform-identity-detected', r.status !== 0 && (r.stderr.includes('runtime identity') || r.stdout.includes('runtime identity')));

  const arrayDestructureFetchSw = `const __origFetch=globalThis.fetch;const __wrapFetch=(...a)=>__origFetch(...a);const [fetch]=[__wrapFetch];
` + goodSw;
  await writeFile(path.join(t, 'sw-r7-array-destructure-fetch.js'), arrayDestructureFetchSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-array-destructure-fetch.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-array-destructure-platform-identity-detected', r.status !== 0 && (r.stderr.includes('runtime identity') || r.stdout.includes('runtime identity')));

  const iifeGuardSw = goodSw
    .replace("self.addEventListener('fetch',e=>{", "((isSecurityCriticalRequest)=>{self.addEventListener('fetch',e=>{")
    .replace("e.respondWith(cacheFirst(request))});", "e.respondWith(cacheFirst(request))});})(()=>false);");
  await writeFile(path.join(t, 'sw-r7-iife-guard-shadow.js'), iifeGuardSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-iife-guard-shadow.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-iife-guard-shadow-detected', r.status !== 0 && (r.stderr.includes('actual registered fetch closure') || r.stdout.includes('actual registered fetch closure')));

  const forOfSinkSw = goodSw
    .replace("self.addEventListener('fetch',e=>{", "for(const networkOnlyNoStore of [cacheFirst]){self.addEventListener('fetch',e=>{")
    .replace("e.respondWith(cacheFirst(request))});", "e.respondWith(cacheFirst(request))});}");
  await writeFile(path.join(t, 'sw-r7-forof-sink-shadow.js'), forOfSinkSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-forof-sink-shadow.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-forof-sink-shadow-detected', r.status !== 0 && (r.stderr.includes('actual registered fetch closure') || r.stdout.includes('actual registered fetch closure')));

  const deferredReflectSw = goodSw + `
self.addEventListener('message',()=>{Reflect.apply(self.addEventListener,self,['fetch',e=>e.respondWith(cacheFirst(e.request))]);});
`;
  await writeFile(path.join(t, 'sw-r7-deferred-reflect-registration.js'), deferredReflectSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-deferred-reflect-registration.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-reflect-registration-detected', r.status !== 0 && (r.stderr.includes('registration') || r.stdout.includes('registration')));

  const deferredSyncSw = goodSw + `
self.addEventListener('sync',()=>{self.addEventListener.call(self,'fetch',e=>e.respondWith(cacheFirst(e.request)));});
`;
  await writeFile(path.join(t, 'sw-r7-deferred-sync-registration.js'), deferredSyncSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-deferred-sync-registration.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-unprobed-event-registration-detected', r.status !== 0 && (r.stderr.includes('registration') || r.stdout.includes('registration')));

  const lowerHexPredicateSw = goodSw.replace(
    'function isSecurityCriticalRequest(url,scopePath){',
    "function isSecurityCriticalRequest(url,scopePath){if(String(url.pathname).includes('%2e')||String(url.pathname).includes('%2f'))return false;"
  );
  await writeFile(path.join(t, 'sw-r7-lower-hex-regression.js'), lowerHexPredicateSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-lower-hex-regression.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-lowercase-percent-normalization-detected', r.status !== 0 && (r.stderr.includes('behavior') || r.stdout.includes('behavior')));

  const combinedPercentPredicateSw = goodSw.replace(
    'function isSecurityCriticalRequest(url,scopePath){',
    "function isSecurityCriticalRequest(url,scopePath){if(String(url.pathname).includes('%2E%2E')||String(url.pathname).includes('%2f%2e'))return false;"
  );
  await writeFile(path.join(t, 'sw-r7-combined-percent-regression.js'), combinedPercentPredicateSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-combined-percent-regression.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-combined-percent-normalization-detected', r.status !== 0 && (r.stderr.includes('behavior') || r.stdout.includes('behavior')));

  const dynamicCodeSw = goodSw + `
const __r7Dynamic = new Function('return 1')();
`;
  await writeFile(path.join(t, 'sw-r7-dynamic-code.js'), dynamicCodeSw);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r7-dynamic-code.js'), swDir, goodCriticalListPath]);
  expect('NC-r7-dynamic-code-is-non-pass', r.status !== 0 && (r.stderr.includes('dynamic/eval-like') || r.stdout.includes('dynamic/eval-like')));

  // Round-8 class closure: registration capability, deep normalization property fuzz,
  // dynamic-code capability instrumentation and host-anchored identity oracle.
  const r8HelperReflect = goodSw + `
function __lateR8(){Reflect.apply(self.addEventListener,self,['fetch',e=>e.respondWith(cacheFirst(e.request))])}
self.addEventListener('message',e=>{if(e.data?.type==='UNPROBED_R8')__lateR8()});
`;
  await writeFile(path.join(t, 'sw-r8-helper-reflect.js'), r8HelperReflect);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r8-helper-reflect.js'), swDir, goodCriticalListPath]);
  expect('NC-r8-module-helper-reflect-registration-detected', r.status !== 0 && (r.stderr.includes('registration capability') || r.stdout.includes('registration capability')));

  const r8HelperCall = goodSw + `
function __lateR8(){self.addEventListener.call(self,'fetch',e=>e.respondWith(cacheFirst(e.request)))}
self.addEventListener('notificationclick',e=>{if(e.notification?.data)__lateR8()});
`;
  await writeFile(path.join(t, 'sw-r8-helper-call.js'), r8HelperCall);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r8-helper-call.js'), swDir, goodCriticalListPath]);
  expect('NC-r8-module-helper-call-registration-detected', r.status !== 0 && (r.stderr.includes('registration capability') || r.stdout.includes('registration capability')));

  const r8HelperReflectGet = goodSw + `
const __r8o={reg(){Reflect.get(self,'addEventListener').call(self,'fetch',e=>e.respondWith(cacheFirst(e.request)))}};
self.addEventListener('message',e=>{if(e.data?.type==='OTHER_R8')__r8o.reg()});
`;
  await writeFile(path.join(t, 'sw-r8-helper-reflect-get.js'), r8HelperReflectGet);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r8-helper-reflect-get.js'), swDir, goodCriticalListPath]);
  expect('NC-r8-module-helper-reflect-get-detected', r.status !== 0 && (r.stderr.includes('registration capability') || r.stdout.includes('registration capability')));

  const r8AliasComputed = goodSw + `
const __r8g=self;const __r8k='add'+'EventListener';__r8g[__r8k]('fetch',e=>e.respondWith(cacheFirst(e.request)));
`;
  await writeFile(path.join(t, 'sw-r8-self-alias-computed.js'), r8AliasComputed);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r8-self-alias-computed.js'), swDir, goodCriticalListPath]);
  expect('NC-r8-self-alias-computed-registration-detected', r.status !== 0 && (r.stderr.includes('registration capability') || r.stdout.includes('registration capability')));

  const r8DescriptorComputed = goodSw + `
const __r8k=['add','EventListener'].join('');const __r8a=Object.getOwnPropertyDescriptor(self,__r8k).value;__r8a('fetch',e=>e.respondWith(cacheFirst(e.request)));
`;
  await writeFile(path.join(t, 'sw-r8-descriptor-computed.js'), r8DescriptorComputed);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r8-descriptor-computed.js'), swDir, goodCriticalListPath]);
  expect('NC-r8-descriptor-computed-registration-detected', r.status !== 0 && (r.stderr.includes('registration capability') || r.stdout.includes('registration capability')));

  const r8DeepNormalization = goodSw.replace(
    'function isSecurityCriticalRequest(url,scopePath){',
    "function isSecurityCriticalRequest(url,scopePath){if(String(url.pathname).split('/').length>6)return false;"
  );
  await writeFile(path.join(t, 'sw-r8-deep-normalization-regression.js'), r8DeepNormalization);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r8-deep-normalization-regression.js'), swDir, goodCriticalListPath]);
  expect('NC-r8-deep-normalization-regression-detected', r.status !== 0 && (r.stderr.includes('behavior') || r.stdout.includes('behavior')));

  const r8EvalComputed = goodSw + `
globalThis['ev'+'al']('1');
`;
  await writeFile(path.join(t, 'sw-r8-eval-computed.js'), r8EvalComputed);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r8-eval-computed.js'), swDir, goodCriticalListPath]);
  expect('NC-r8-computed-eval-is-non-pass', r.status !== 0 && (r.stderr.includes('dynamic/eval-like') || r.stdout.includes('dynamic/eval-like')));

  const r8FunctionComputed = goodSw + `
new globalThis['Func'+'tion']('return 1');
`;
  await writeFile(path.join(t, 'sw-r8-function-computed.js'), r8FunctionComputed);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r8-function-computed.js'), swDir, goodCriticalListPath]);
  expect('NC-r8-computed-Function-is-non-pass', r.status !== 0 && (r.stderr.includes('dynamic/eval-like') || r.stdout.includes('dynamic/eval-like')));

  const r8ImportScriptsComputed = goodSw + `
globalThis['import'+'Scripts']('./x.js');
`;
  await writeFile(path.join(t, 'sw-r8-importscripts-computed.js'), r8ImportScriptsComputed);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r8-importscripts-computed.js'), swDir, goodCriticalListPath]);
  expect('NC-r8-computed-importScripts-is-non-pass', r.status !== 0 && (r.stderr.includes('dynamic/eval-like') || r.stdout.includes('dynamic/eval-like')));

  // R9/N60: prototype-constructor Function recovery is eval-like and must be non-PASS.
  const r9ConstructorChain = goodSw + `
(function(){}).constructor('return 1')();
[].constructor.constructor('return 1')();
''.constructor.constructor('return 1')();
`;
  await writeFile(path.join(t, 'sw-r9-constructor-chain.js'), r9ConstructorChain);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r9-constructor-chain.js'), swDir, goodCriticalListPath]);
  expect('NC-r9-constructor-chain-is-non-pass', r.status !== 0 && (r.stderr.includes('constructor') || r.stdout.includes('constructor')));

  // R10/N68: destructuring the Function constructor is the same capability and must not silently pass.
  const r10ConstructorDestructure = goodSw + `
const {constructor: __c} = function(){}; __c('return 1')();
`;
  await writeFile(path.join(t,'sw-r10-constructor-destructure.js'),r10ConstructorDestructure);
  r=run('check-sw-security-freeze.mjs',[path.join(t,'sw-r10-constructor-destructure.js'),swDir,goodCriticalListPath]);
  expect('NC-r10-destructured-constructor-is-non-pass',r.status!==0&&(r.stderr.includes('constructor')||r.stdout.includes('constructor')||r.stderr.includes('GHRAB_DYNAMIC_FUNCTION_CONSTRUCTOR_BLOCKED')||r.stdout.includes('GHRAB_DYNAMIC_FUNCTION_CONSTRUCTOR_BLOCKED')));

  // R9/N62: split/computed access to global registration capability is HIGH, not merely AMBER.
  const r9ComputedRegistration = goodSw + `
const __k='add'+'EventListener'; globalThis[__k]('fetch',()=>{});
`;
  await writeFile(path.join(t, 'sw-r9-computed-registration.js'), r9ComputedRegistration);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r9-computed-registration.js'), swDir, goodCriticalListPath]);
  expect('NC-r9-computed-registration-is-high-fail', r.status === 1 && (r.stderr.includes('computed-global-capability-access') || r.stdout.includes('computed-global-capability-access')));

  // R9/N61: encoded repeated separators must belong to the normalization property corpus.
  const r9EncodedDoubleSlash = goodSw.replace("const raw=url.pathname.slice(scopePath.length);","const raw=url.pathname.slice(scopePath.length);if (/%2[fF]%2[fF]/.test(String(url.pathname||''))) return false;");
  await writeFile(path.join(t, 'sw-r9-encoded-double-slash.js'), r9EncodedDoubleSlash);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r9-encoded-double-slash.js'), swDir, goodCriticalListPath]);
  expect('NC-r9-encoded-double-slash-regression-fails', r.status !== 0);

  // R9/N59/N57: required policy missing or diverging from canonical control-plane is fail-closed.
  const canonicalPolicy = path.join(t,'canonical-sw-policy.json');
  const policySwPath = path.join(t,'sw-policy-good.js');
  const policySw = `const APP_VERSION = "1.0.0";\nconst CACHE_NAME = "ghrab-synthetic-v1.0.0";\n${goodSw}`;
  await writeFile(policySwPath, policySw);
  const n = policySw.replace(/\bconst\s+APP_VERSION\s*=\s*(["'])[0-9A-Za-z.\-]{1,32}\1\s*;/g,'const APP_VERSION = "<AUTO_PATCH_VERSION>";').replace(/\bconst\s+CACHE_NAME\s*=\s*(["'])ghrab-synthetic-v[0-9A-Za-z.\-]{1,32}\1\s*;/g,'const CACHE_NAME = "<AUTO_PATCH_CACHE>";');
  const nHash=createHash('sha256').update(Buffer.from(n,'utf8')).digest('hex');
  const syntheticPolicy={schema:'ghrab-sw-security-freeze-policy-v1',appId:'synthetic',policyMode:'auto-patch-security-logic-freeze',requiredGateProfile:'auto-patch-prep',normalizedSwSha256:nHash,normalization:['APP_VERSION constrained token','CACHE_NAME constrained token'],rule:'test',target:'test'};
  await writeFile(canonicalPolicy,JSON.stringify(syntheticPolicy,null,2)+'\n');
  const localPolicy=path.join(path.dirname(goodCriticalListPath),'sw-security-freeze-policy.json');
  await writeFile(localPolicy,JSON.stringify(syntheticPolicy,null,2)+'\n');
  r = run('check-sw-security-freeze.mjs', [policySwPath,swDir,goodCriticalListPath,'--canonical-policy',canonicalPolicy,'--require-freeze-policy']);
  expect('r9-canonical-policy-anchor-clean', r.status === 0);
  await writeFile(localPolicy,JSON.stringify({...syntheticPolicy,rule:'tampered'},null,2)+'\n');
  r = run('check-sw-security-freeze.mjs', [policySwPath,swDir,goodCriticalListPath,'--canonical-policy',canonicalPolicy,'--require-freeze-policy']);
  expect('NC-r9-app-policy-repin-cannot-bypass-canonical', r.status !== 0 && (r.stderr.includes('canonical control-plane') || r.stdout.includes('canonical control-plane')));
  await rm(localPolicy);
  r = run('check-sw-security-freeze.mjs', [policySwPath,swDir,goodCriticalListPath,'--require-freeze-policy']);
  expect('NC-r9-required-policy-missing-fails', r.status !== 0 && (r.stderr.includes('required AUTO-PATCH') || r.stdout.includes('required AUTO-PATCH')));

  const r8OracleNameTamper = `globalThis.__ghrabOriginalFetch=()=>Promise.resolve({ok:true});
` + goodSw;
  await writeFile(path.join(t, 'sw-r8-oracle-name-tamper.js'), r8OracleNameTamper);
  r = run('check-sw-security-freeze.mjs', [path.join(t, 'sw-r8-oracle-name-tamper.js'), swDir, goodCriticalListPath]);
  expect('NC-r8-old-oracle-name-does-not-bypass', r.status !== 0);

  // R10/N65/N70: AUTO-PATCH profile binding is enforced for every gate invocation and appId lookup is own-property only.
  const bindManifest=path.join(t,'r10-bind-manifest.json');
  const dummySig=path.join(t,'r10-dummy.sig'); const dummyTrust=path.join(t,'r10-dummy-trust.json');
  await writeFile(bindManifest,JSON.stringify({schema:'ghrab-release-integrity-v2',appId:'differentiator',requiredGateProfile:'auto-patch-prep'},null,2));
  await writeFile(dummySig,'dummy\n'); await writeFile(dummyTrust,'{}\n');
  r=run('release-gate.mjs',['--profile','prep','--deploy',swDir,'--manifest',bindManifest,'--signature',dummySig,'--trust-root',dummyTrust]);
  expect('NC-r10-profile-downgrade-is-rejected-before-weak-gate',r.status!==0&&(r.stderr.includes('auto-patch-required-profile-mismatch')||r.stdout.includes('auto-patch-required-profile-mismatch')));
  await writeFile(bindManifest,JSON.stringify({schema:'ghrab-release-integrity-v2',appId:'differentiator'},null,2));
  r=run('release-gate.mjs',['--profile','prep','--deploy',swDir,'--manifest',bindManifest,'--signature',dummySig,'--trust-root',dummyTrust]);
  expect('NC-r10-signed-profile-binding-cannot-be-omitted',r.status!==0&&(r.stderr.includes('auto-patch-artifact-profile-binding-missing-or-mismatch')||r.stdout.includes('auto-patch-artifact-profile-binding-missing-or-mismatch')));
  const dummyReadable=path.join(t,'r10-readable.json'); await writeFile(dummyReadable,'{}\n');
  await writeFile(bindManifest,JSON.stringify({schema:'ghrab-release-integrity-v2',appId:'constructor',requiredGateProfile:'auto-patch-prep'},null,2));
  r=run('release-gate.mjs',['--profile','auto-patch-prep','--deploy',swDir,'--manifest',bindManifest,'--signature',dummySig,'--trust-root',dummyTrust,'--registry',dummyReadable,'--artifact',dummyReadable,'--provenance',dummyReadable,'--source-package',dummyReadable,'--evidence-dir',ev,'--evidence-manifest',dummyReadable,'--project-root',t,'--vendored-config',dummyReadable,'--sbom',dummyReadable]);
  expect('NC-r10-prototype-appId-is-cleanly-unauthorized',r.status!==0&&(r.stderr.includes('auto-patch-app-not-authorized-by-control-plane')||r.stdout.includes('auto-patch-app-not-authorized-by-control-plane'))&&!r.stderr.includes('TypeError'));

  // N6 hardening: release gate itself must enforce the authoritative list and propagate SW failure.
  r = run('release-gate.mjs', [
    '--profile', 'prep', '--deploy', deploy, '--manifest', path.join(deploy, 'release-integrity.json'),
    '--signature', path.join(deploy, 'release-integrity.sig'), '--trust-root', path.join(t, 'trust-root.json'),
    '--sw', path.join(t, 'sw-blindspot.js'), '--critical-list', criticalListPath
  ]);
  expect('NC-gate-propagates-sw-critical-failure', r.status !== 0 && (r.stderr.includes('sw-security-freeze') || r.stdout.includes('sw-security-freeze')));

  r = run('release-gate.mjs', [
    '--profile', 'prep', '--deploy', deploy, '--manifest', path.join(deploy, 'release-integrity.json'),
    '--signature', path.join(deploy, 'release-integrity.sig'), '--trust-root', path.join(t, 'trust-root.json'),
    '--sw', path.join(t, 'sw-good.js')
  ]);
  expect('NC-gate-missing-critical-list-fails-closed', r.status !== 0 && (r.stderr.includes('critical-asset-list-missing') || r.stdout.includes('critical-asset-list-missing')));

  // N8/N11 hardening: explicit AI boundary inventory and byte fingerprint are release-verifiable.
  const aiRoot = path.join(t, 'ai-root'); await mkdir(path.join(aiRoot, 'src', 'js'), { recursive: true });
  await writeFile(path.join(aiRoot, 'package.json'), JSON.stringify({name:'synthetic-ai',version:'1.0.0'}));
  await writeFile(path.join(aiRoot, 'src', 'js', 'ai.js'), 'export const prompt = "synthetic";\n');
  const aiBytes = await readFile(path.join(aiRoot, 'src', 'js', 'ai.js'));
  const aiSha = createHash('sha256').update(aiBytes).digest('hex');
  const aiAggregate = createHash('sha256').update(Buffer.from(`${aiSha}  src/js/ai.js\n`)).digest('hex');
  await writeFile(path.join(aiRoot, 'inventory.json'), JSON.stringify(['src/js/ai.js'], null, 2));
  await writeFile(path.join(aiRoot, 'fingerprint.json'), JSON.stringify({schema:'ghrab-ai-assurance-fingerprint-v2',appId:'synthetic-ai',appVersion:'1.0.0',algorithm:'SHA-256',aggregate:aiAggregate,files:[{path:'src/js/ai.js',sha256:aiSha}]}, null, 2));
  r = run('verify-ai-assurance-fingerprint.mjs', [path.join(aiRoot, 'fingerprint.json'), path.join(aiRoot, 'inventory.json'), aiRoot]);
  expect('ai-assurance-explicit-inventory-clean', r.status === 0);
  await writeFile(path.join(aiRoot, 'src', 'js', 'untracked.js'), 'export const systemInstruction = "new boundary"; function callGemini(){}\n');
  r = run('verify-ai-assurance-fingerprint.mjs', [path.join(aiRoot, 'fingerprint.json'), path.join(aiRoot, 'inventory.json'), aiRoot]);
  expect('NC-ai-assurance-inventory-drift-fails-in-canonical-verifier', r.status !== 0 && (r.stderr.includes('inventory-drift-untracked') || r.stdout.includes('inventory-drift-untracked')));
  await rm(path.join(aiRoot, 'src', 'js', 'untracked.js'));
  await writeFile(path.join(aiRoot, 'src', 'js', 'ai.js'), 'export const prompt = "tampered";\n');
  r = run('verify-ai-assurance-fingerprint.mjs', [path.join(aiRoot, 'fingerprint.json'), path.join(aiRoot, 'inventory.json'), aiRoot]);
  expect('NC-ai-assurance-byte-tamper-fails', r.status !== 0);

  // --- release gate fail-closed
  r = run('release-gate.mjs', ['--profile', 'school', '--deploy', deploy, '--manifest', path.join(deploy, 'release-integrity.json')]);
  expect('NC-gate-missing-inputs-fails-closed', r.status !== 0 && r.stderr.includes('required-input-missing'));

  const gateSourcePkg = path.join(t, 'gate-build-input-source.zip');
  await writeFile(gateSourcePkg, 'gate-build-input-source');
  const gateSourceSha = createHash('sha256').update(await readFile(gateSourcePkg)).digest('hex');
  const gateManifest = JSON.parse(await readFile(path.join(t, 'ri.json'), 'utf8'));
  gateManifest.sourcePackageSha256 = gateSourceSha;
  const gateProv = JSON.parse(await readFile(path.join(t, 'prov.json'), 'utf8'));
  gateProv.source.revision = null;
  gateProv.source.sourcePackageSha256 = gateSourceSha;
  gateProv.releaseIntegrity.artifactDigest = gateManifest.artifactDigest;
  await writeFile(path.join(t, 'prov-gate.json'), JSON.stringify(gateProv, null, 2) + '\n');
  const gateSbom = path.join(t, 'gate-sbom.json');
  await writeFile(gateSbom, JSON.stringify({bomFormat:'CycloneDX',specVersion:'1.5',version:1,components:[]}, null, 2) + '\n');
  const shaFile = async f => createHash('sha256').update(await readFile(f)).digest('hex');
  gateManifest.buildProvenanceSha256 = await shaFile(path.join(t, 'prov-gate.json'));
  gateManifest.evidenceManifestSha256 = await shaFile(path.join(t, 'evidence.json'));
  gateManifest.sbomSha256 = await shaFile(gateSbom);
  await writeFile(path.join(deploy, 'release-integrity.json'), JSON.stringify(gateManifest, null, 2) + '\n');
  run('sign-release-integrity.mjs', [path.join(deploy, 'release-integrity.json'), path.join(t, 'A.priv'), path.join(deploy, 'release-integrity.sig')]);

  r = run('verify-assurance-links.mjs', [
    '--manifest', path.join(deploy, 'release-integrity.json'), '--provenance', path.join(t, 'prov-gate.json'),
    '--evidence-manifest', path.join(t, 'evidence.json'), '--sbom', gateSbom
  ]);
  expect('r12-assurance-links-clean', r.status === 0);
  const provMut = JSON.parse(await readFile(path.join(t, 'prov-gate.json'), 'utf8'));
  provMut.builder.id = 'forged-builder';
  await writeFile(path.join(t, 'prov-gate-mut.json'), JSON.stringify(provMut, null, 2) + '\n');
  r = run('verify-assurance-links.mjs', ['--manifest', path.join(deploy, 'release-integrity.json'), '--provenance', path.join(t, 'prov-gate-mut.json'), '--evidence-manifest', path.join(t, 'evidence.json'), '--sbom', gateSbom]);
  expect('NC-r12-forged-provenance-anchor-rejected', r.status !== 0);
  const evMut = JSON.parse(await readFile(path.join(t, 'evidence.json'), 'utf8'));
  evMut.createdAt = '2099-01-01T00:00:00.000Z';
  await writeFile(path.join(t, 'evidence-mut.json'), JSON.stringify(evMut, null, 2) + '\n');
  r = run('verify-assurance-links.mjs', ['--manifest', path.join(deploy, 'release-integrity.json'), '--provenance', path.join(t, 'prov-gate.json'), '--evidence-manifest', path.join(t, 'evidence-mut.json'), '--sbom', gateSbom]);
  expect('NC-r12-forged-evidence-anchor-rejected', r.status !== 0);
  await writeFile(path.join(t, 'gate-sbom-mut.json'), JSON.stringify({bomFormat:'CycloneDX',specVersion:'1.5',version:2,components:[]}, null, 2) + '\n');
  r = run('verify-assurance-links.mjs', ['--manifest', path.join(deploy, 'release-integrity.json'), '--provenance', path.join(t, 'prov-gate.json'), '--evidence-manifest', path.join(t, 'evidence.json'), '--sbom', path.join(t, 'gate-sbom-mut.json')]);
  expect('NC-r12-forged-sbom-anchor-rejected', r.status !== 0);

  // Canonical SCHOOL policy ships fail-closed with no trusted builder until IT pins one.
  r = run('release-gate.mjs', [
    '--profile', 'school', '--deploy', deploy, '--manifest', path.join(deploy, 'release-integrity.json'),
    '--signature', path.join(deploy, 'release-integrity.sig'), '--trust-root', path.join(t, 'trust-root.json'),
    '--registry', path.join(t, 'registry.json'), '--artifact', artifact, '--provenance', path.join(t, 'prov-gate.json'), '--source-package', gateSourcePkg,
    '--evidence-dir', ev, '--evidence-manifest', path.join(t, 'evidence.json'), '--project-root', t, '--sbom', gateSbom
  ]);
  expect('NC-r12-school-deny-unconfigured-builder-policy', r.status !== 0 && ((r.stderr || r.stdout).includes('builder-policy-no-match')));

  // PREP with the same signed assurance anchors remains allowed when local-builder policy is not claimed.
  r = run('release-gate.mjs', [
    '--profile', 'prep', '--deploy', deploy, '--manifest', path.join(deploy, 'release-integrity.json'),
    '--signature', path.join(deploy, 'release-integrity.sig'), '--trust-root', path.join(t, 'trust-root.json'),
    '--artifact', artifact, '--provenance', path.join(t, 'prov-gate.json'), '--source-package', gateSourcePkg,
    '--evidence-dir', ev, '--evidence-manifest', path.join(t, 'evidence.json'), '--project-root', t, '--sbom', gateSbom
  ]);
  expect('r12-prep-full-assurance-chain-green', r.status === 0);
} finally {
  await rm(t, { recursive: true, force: true });
  if (temporaryControlPlaneIndex) await rm(controlPlaneDir, { recursive: true, force: true });
}

const out = { status: errors.length ? 'FAIL' : 'PASS', checks: passed.length + errors.length, passed: passed.length, failed: errors };
console[errors.length ? 'error' : 'log'](JSON.stringify(out, null, 2));
process.exit(errors.length ? 1 : 0);
