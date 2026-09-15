#!/usr/bin/env node
import { createHash, generateKeyPairSync } from 'node:crypto';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const t = await mkdtemp(path.join(tmpdir(), 'garp-r12-delta-'));
const passed = [], failed = [];
const run = (s,a) => spawnSync(process.execPath,[path.join(here,s),...a],{encoding:'utf8'});
const expect = (name,cond) => (cond ? passed : failed).push(name);
const sha = async p => createHash('sha256').update(await readFile(p)).digest('hex');
try {
  const deploy = path.join(t,'deploy'); await mkdir(deploy);
  await writeFile(path.join(deploy,'index.html'),'<h1>r12</h1>\n');
  const source = path.join(t,'source.zip'); await writeFile(source,'source-r12');
  const artifact = path.join(t,'artifact.zip'); await writeFile(artifact,'artifact-r12');
  const evidenceDir = path.join(t,'evidence'); await mkdir(evidenceDir); await writeFile(path.join(evidenceDir,'run.txt'),'PASS\n');
  const evidence = path.join(t,'evidence.json');
  run('create-evidence-manifest.mjs',[evidenceDir,evidence]);
  const sbom = path.join(t,'sbom.json'); await writeFile(sbom,JSON.stringify({bomFormat:'CycloneDX',specVersion:'1.5',version:1,components:[]},null,2)+'\n');
  const sourceSha = await sha(source);
  const artifactSha = await sha(artifact);
  const prov = path.join(t,'prov.json');
  const provenance = {
    schema:'ghrab-build-provenance-v1', subject:{name:'artifact.zip',sha256:artifactSha},
    source:{repository:null,revision:null,sourcePackageSha256:sourceSha},
    builder:{id:'trusted-builder',workflow:'workflow@main',entrypoint:'npm run build'},
    invocation:{startedAt:null,finishedAt:new Date().toISOString(),lockfileSha256:null,parameters:{profile:'school'}},
    releaseIntegrity:{artifactDigest:null}, assurance:{slsaReference:'v1.2',claimedSlsaLevel:null,note:'selftest'}
  };
  await writeFile(prov,JSON.stringify(provenance,null,2)+'\n');
  const policy = path.join(t,'builder-policy.json');
  await writeFile(policy,JSON.stringify({schema:'ghrab-school-builder-policy-v1',mode:'deny-unless-listed',revision:'SELFTEST',allowedBuilders:[{id:'trusted-builder',workflow:'workflow@main',entrypoint:'npm run build'}]},null,2)+'\n');
  let r = run('verify-build-provenance.mjs',[artifact,prov,'--builder-policy',policy]);
  expect('builder-policy-exact-match',r.status===0);
  const badBuilder={...provenance,builder:{...provenance.builder,id:'synthetic-trusted-school-builder'}};
  await writeFile(path.join(t,'prov-bad-builder.json'),JSON.stringify(badBuilder,null,2)+'\n');
  r=run('verify-build-provenance.mjs',[artifact,path.join(t,'prov-bad-builder.json'),'--builder-policy',policy]);
  expect('arbitrary-builder-rejected',r.status!==0);
  const badWorkflow={...provenance,builder:{...provenance.builder,workflow:'evil@main'}};
  await writeFile(path.join(t,'prov-bad-workflow.json'),JSON.stringify(badWorkflow,null,2)+'\n');
  r=run('verify-build-provenance.mjs',[artifact,path.join(t,'prov-bad-workflow.json'),'--builder-policy',policy]);
  expect('workflow-mismatch-rejected',r.status!==0);

  r=run('create-release-integrity.mjs',[deploy,'synthetic-r12','1.0.0','r12-key',path.join(t,'ri-base.json')]);
  const manifest=JSON.parse(await readFile(path.join(t,'ri-base.json'),'utf8'));
  provenance.releaseIntegrity.artifactDigest=manifest.artifactDigest;
  await writeFile(prov,JSON.stringify(provenance,null,2)+'\n');
  manifest.sourcePackageSha256=sourceSha;
  manifest.buildProvenanceSha256=await sha(prov);
  manifest.evidenceManifestSha256=await sha(evidence);
  manifest.sbomSha256=await sha(sbom);
  await writeFile(path.join(deploy,'release-integrity.json'),JSON.stringify(manifest,null,2)+'\n');
  r=run('verify-assurance-links.mjs',['--manifest',path.join(deploy,'release-integrity.json'),'--provenance',prov,'--evidence-manifest',evidence,'--sbom',sbom]);
  expect('assurance-links-clean',r.status===0);
  const forged={...provenance,builder:{...provenance.builder,id:'forged'}};
  await writeFile(path.join(t,'prov-forged.json'),JSON.stringify(forged,null,2)+'\n');
  r=run('verify-assurance-links.mjs',['--manifest',path.join(deploy,'release-integrity.json'),'--provenance',path.join(t,'prov-forged.json'),'--evidence-manifest',evidence,'--sbom',sbom]);
  expect('forged-provenance-rejected',r.status!==0);
  const ev=JSON.parse(await readFile(evidence,'utf8')); ev.createdAt='2099-01-01T00:00:00.000Z';
  await writeFile(path.join(t,'evidence-forged.json'),JSON.stringify(ev,null,2)+'\n');
  r=run('verify-assurance-links.mjs',['--manifest',path.join(deploy,'release-integrity.json'),'--provenance',prov,'--evidence-manifest',path.join(t,'evidence-forged.json'),'--sbom',sbom]);
  expect('forged-evidence-rejected',r.status!==0);
  await writeFile(path.join(t,'sbom-forged.json'),JSON.stringify({bomFormat:'CycloneDX',specVersion:'1.5',version:2,components:[]},null,2)+'\n');
  r=run('verify-assurance-links.mjs',['--manifest',path.join(deploy,'release-integrity.json'),'--provenance',prov,'--evidence-manifest',evidence,'--sbom',path.join(t,'sbom-forged.json')]);
  expect('forged-sbom-rejected',r.status!==0);

  const kp=generateKeyPairSync('ed25519');
  await writeFile(path.join(t,'priv.pem'),kp.privateKey.export({type:'pkcs8',format:'pem'}));
  const publicKeyPem=kp.publicKey.export({type:'spki',format:'pem'});
  await writeFile(path.join(t,'trust.json'),JSON.stringify({schema:'ghrab-trust-root-v1',keys:[{keyId:'r12-key',algorithm:'Ed25519',status:'active',publicKeyPem}]},null,2)+'\n');
  run('sign-release-integrity.mjs',[path.join(deploy,'release-integrity.json'),path.join(t,'priv.pem'),path.join(deploy,'release-integrity.sig')]);
  await writeFile(path.join(t,'registry.json'),JSON.stringify({schema:'ghrab-release-registry-v1',apps:[{appId:'synthetic-r12',approvedVersion:'1.0.0',artifactDigest:manifest.artifactDigest,keyId:'r12-key',status:'approved',history:[]}]},null,2)+'\n');
  r=run('release-gate.mjs',['--profile','prep','--deploy',deploy,'--manifest',path.join(deploy,'release-integrity.json'),'--signature',path.join(deploy,'release-integrity.sig'),'--trust-root',path.join(t,'trust.json'),'--artifact',artifact,'--provenance',prov,'--source-package',source,'--evidence-dir',evidenceDir,'--evidence-manifest',evidence,'--project-root',t,'--sbom',sbom]);
  expect('prep-gate-with-assurance-green',r.status===0);
  r=run('release-gate.mjs',['--profile','prep','--deploy',deploy,'--manifest',path.join(deploy,'release-integrity.json'),'--signature',path.join(deploy,'release-integrity.sig'),'--trust-root',path.join(t,'trust.json'),'--artifact',artifact,'--provenance',path.join(t,'prov-forged.json'),'--source-package',source,'--evidence-dir',evidenceDir,'--evidence-manifest',evidence,'--project-root',t,'--sbom',sbom]);
  expect('prep-gate-forged-assurance-red',r.status!==0);
  r=run('release-gate.mjs',['--profile','school','--deploy',deploy,'--manifest',path.join(deploy,'release-integrity.json'),'--signature',path.join(deploy,'release-integrity.sig'),'--trust-root',path.join(t,'trust.json'),'--registry',path.join(t,'registry.json'),'--artifact',artifact,'--provenance',prov,'--source-package',source,'--evidence-dir',evidenceDir,'--evidence-manifest',evidence,'--project-root',t,'--sbom',sbom]);
  expect('school-gate-default-policy-denies-unconfigured-builder',r.status!==0 && ((r.stderr||r.stdout).includes('builder-policy-no-match')));
} finally { await rm(t,{recursive:true,force:true}); }
const out={status:failed.length?'FAIL':'PASS',checks:passed.length+failed.length,passed:passed.length,failed};
console[failed.length?'error':'log'](JSON.stringify(out,null,2));
process.exit(failed.length?1:0);
