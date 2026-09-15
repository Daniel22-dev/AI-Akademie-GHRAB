#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const argv = process.argv.slice(2);
const opt = name => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : null; };
const manifestPath = opt('manifest');
const provenancePath = opt('provenance');
const evidencePath = opt('evidence-manifest');
const sbomPath = opt('sbom');
const deploymentPackagePath = opt('deployment-package');
if (!manifestPath || !provenancePath || !evidencePath || !sbomPath) {
  console.error(JSON.stringify({ status:'FAIL', errors:['required-input-missing'], required:['manifest','provenance','evidence-manifest','sbom'] }, null, 2));
  process.exit(2);
}
const errors = [];
const shaFile = async p => createHash('sha256').update(await readFile(p)).digest('hex');
let m;
try { m = JSON.parse(await readFile(manifestPath, 'utf8')); }
catch { errors.push('release-manifest-unreadable'); }
if (m && m.schema !== 'ghrab-release-integrity-v2') errors.push('release-manifest-schema');
const actual = {};
for (const [field, p] of [['buildProvenanceSha256', provenancePath], ['evidenceManifestSha256', evidencePath], ['sbomSha256', sbomPath]]) {
  try { actual[field] = await shaFile(p); } catch { errors.push(`${field}:file-unreadable`); continue; }
  const expected = String(m?.[field] || '');
  if (!/^[a-f0-9]{64}$/i.test(expected)) errors.push(`${field}:signed-anchor-missing-or-invalid`);
  else if (expected.toLowerCase() !== actual[field].toLowerCase()) errors.push(`${field}:signed-anchor-mismatch`);
}
if (m?.deploymentPackageSha256) {
  if (!deploymentPackagePath) errors.push('deploymentPackageSha256:signed-anchor-present-but-package-not-provided');
  else {
    try {
      actual.deploymentPackageSha256 = await shaFile(deploymentPackagePath);
      if (String(m.deploymentPackageSha256).toLowerCase() !== actual.deploymentPackageSha256.toLowerCase()) errors.push('deploymentPackageSha256:signed-anchor-mismatch');
    } catch { errors.push('deploymentPackageSha256:file-unreadable'); }
  }
} else if (deploymentPackagePath) {
  errors.push('deploymentPackageSha256:package-provided-but-signed-anchor-missing');
}
if (errors.length) {
  console.error(JSON.stringify({ status:'FAIL', errors, actual }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ status:'PASS', anchors:actual }, null, 2));
