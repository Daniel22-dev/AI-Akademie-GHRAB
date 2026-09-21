#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root=process.cwd();
const deploy=path.resolve(process.argv[2]||'dist-pages');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const sha256=b=>crypto.createHash('sha256').update(b).digest('hex');
function walk(dir,base=''){
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
    const abs=path.join(dir,e.name), rel=path.posix.join(base,e.name);
    if(e.isDirectory()) out.push(...walk(abs,rel));
    else if(e.isFile()) out.push({path:rel,sha256:sha256(fs.readFileSync(abs)),size:fs.statSync(abs).size});
    else throw new Error(`irregular-artifact-entry:${rel}`);
  }
  return out;
}
const files=walk(deploy);
const artifactDigest=sha256(Buffer.from(files.map(f=>`${f.sha256}  ${f.path}\n`).join('')));
const sbomPath=path.join(root,'security','sbom',`ai-akademie-${pkg.version}.cdx.json`);
if(!fs.existsSync(sbomPath)) throw new Error(`missing-sbom:${sbomPath}`);
let sourceCommit=process.env.GHRAB_SOURCE_COMMIT||process.env.GITHUB_SHA||'';
if(!sourceCommit){try{sourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();}catch{sourceCommit='UNBOUND-LOCAL';}}
const generatedAt=process.env.SOURCE_DATE_EPOCH?new Date(Number(process.env.SOURCE_DATE_EPOCH)*1000).toISOString():new Date().toISOString();
const toolingFile=path.join(root,'security','garp25','CANONICAL-TOOLING.txt');
const selftestFile=path.join(root,'security','garp25','tools','selftest-garp251.mjs');
const evidence={
  schema:'ghrab-current-release-evidence-v1',
  appId:'ai-akademie',
  version:pkg.version,
  sourceCommit,
  buildRun:process.env.GHRAB_BUILD_ID||process.env.GITHUB_RUN_ID||'local',
  generatedAt,
  environment:process.env.GHRAB_ENVIRONMENT||'PREP-PUBLIC-PAGES',
  gate:'AI Akademie P5 release gate',
  garpProfile:'GARP-2.5.1 cumulative / N5 / Safe Promotion',
  artifact:{root:path.relative(root,deploy).replaceAll('\\','/'),digestAlgorithm:'sha256-path-content-v1',sha256:artifactDigest,fileCount:files.length},
  sbom:{path:path.relative(root,sbomPath).replaceAll('\\','/'),sha256:sha256(fs.readFileSync(sbomPath))},
  tooling:{identityFile:'security/garp25/CANONICAL-TOOLING.txt',identitySha256:sha256(fs.readFileSync(toolingFile)),selftestSha256:sha256(fs.readFileSync(selftestFile))},
  assurance:{mode:'TRANSITIONAL',signed:false,note:'CI evidence is byte-bound to source commit, deployment artifact and SBOM, but is not a production cryptographic attestation. AI Akademie is not enrolled in the current AI Studio central auto-patch policy.'}
};
fs.mkdirSync(path.join(root,'qa-results','release-current'),{recursive:true});
const out=path.join(root,'qa-results','release-current','current-release-evidence.json');
fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',output:out,appId:evidence.appId,version:evidence.version,sourceCommit,artifactSha256:artifactDigest,sbomSha256:evidence.sbom.sha256,assuranceMode:evidence.assurance.mode},null,2));
