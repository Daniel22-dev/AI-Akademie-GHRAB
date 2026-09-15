#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFile, readdir, lstat } from 'node:fs/promises';
import path from 'node:path';

const argv=process.argv.slice(2); const dirArg=argv.shift(),manifestArg=argv.shift();
if(!dirArg||!manifestArg){console.error('Usage: node verify-evidence-manifest.mjs <evidence-dir> <manifest> [--project-root <root>] [--required-policy <policy.json>] [--release-manifest <release-integrity.json>]');process.exit(2);}
let projectRoot=process.cwd(); let requiredPolicyArg=null; let releaseManifestArg=null;
for(let i=0;i<argv.length;i++){
  if(argv[i]==='--project-root'){projectRoot=path.resolve(argv[++i]||'.');continue;}
  if(argv[i]==='--required-policy'){requiredPolicyArg=path.resolve(argv[++i]||'');continue;}
  if(argv[i]==='--release-manifest'){releaseManifestArg=path.resolve(argv[++i]||'');continue;}
  console.error(`Unknown option: ${argv[i]}`);process.exit(2);
}
const root=path.resolve(dirArg), manifest=JSON.parse(await readFile(manifestArg,'utf8')); const errors=[];
if(!['ghrab-security-evidence-manifest-v1','ghrab-security-evidence-manifest-v2'].includes(manifest.schema)) errors.push(`schema:${manifest.schema||'missing'}`);
const expected=new Map((manifest.files||[]).map(x=>[x.path,x])); const seen=new Set(); const hex=b=>createHash('sha256').update(b).digest('hex');
async function walk(dir,base=''){
 for(const name of (await readdir(dir)).sort((a,b)=>a.localeCompare(b,'en'))){
  const abs=path.join(dir,name),rel=path.posix.join(base,name),st=await lstat(abs);
  if(st.isSymbolicLink()){errors.push(`symlink:${rel}`);continue;}
  if(st.isDirectory()) await walk(abs,rel);
  else if(st.isFile()){
    seen.add(rel); const e=expected.get(rel),d=await readFile(abs);
    if(!e) errors.push(`unexpected:${rel}`);
    else { if(e.size!==d.length) errors.push(`size:${rel}`); if(e.sha256!==hex(d)) errors.push(`sha256:${rel}`); }
  }
 }
}
await walk(root); for(const rel of expected.keys()) if(!seen.has(rel)) errors.push(`missing:${rel}`);

function canonicalExternalPath(value){
  const raw=String(value||'').replaceAll('\\','/');
  if(!raw||raw.includes('\0')||raw.startsWith('/')) return {ok:false,raw,reason:'absolute-or-empty'};
  const normalized=path.posix.normalize(raw);
  if(normalized==='.'||normalized==='..'||normalized.startsWith('../')||normalized.split('/').includes('..')) return {ok:false,raw,normalized,reason:'escape'};
  if(raw!==normalized) return {ok:false,raw,normalized,reason:'noncanonical'};
  return {ok:true,raw,normalized};
}
function globRegex(glob){
  let out='^'; const text=String(glob||'');
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(ch==='*'){
      if(text[i+1]==='*'){out+='.*';i++;}
      else out+='[^/]*';
    } else if('\\.^$+?()[]{}|'.includes(ch)) out+='\\'+ch;
    else out+=ch;
  }
  return new RegExp(out+'$');
}

const externalRows=Array.isArray(manifest.externalFiles)?manifest.externalFiles:[];
const extPaths=new Set(); const extByPath=new Map();
for(const e of externalRows){
  const c=canonicalExternalPath(e?.path);
  if(!c.ok){errors.push(`external-invalid:${e?.path||''}:${c.reason}${c.normalized?`->${c.normalized}`:''}`);continue;}
  if(extPaths.has(c.normalized)) errors.push(`external-duplicate:${c.normalized}`);
  extPaths.add(c.normalized); extByPath.set(c.normalized,e);
}

let requiredPolicy=null; let releaseManifest=null;
if(requiredPolicyArg){
  try{requiredPolicy=JSON.parse(await readFile(requiredPolicyArg,'utf8'));}catch(e){errors.push(`required-policy-unreadable:${String(e)}`);}
  if(requiredPolicy){
    if(requiredPolicy.schema!=='ghrab-required-evidence-policy-v1') errors.push(`required-policy-schema:${requiredPolicy.schema||'missing'}`);
    if(requiredPolicy.appId && manifest.appId!==requiredPolicy.appId) errors.push(`required-policy-appId:${manifest.appId||'missing'}!=${requiredPolicy.appId}`);
    for(const relRaw of requiredPolicy.requiredExternalFiles||[]){
      const c=canonicalExternalPath(relRaw);
      if(!c.ok){errors.push(`required-policy-path-invalid:${relRaw}`);continue;}
      if(!extPaths.has(c.normalized)) errors.push(`required-external-missing:${c.normalized}`);
    }
    for(const glob of requiredPolicy.requiredExternalGlobs||[]){const re=globRegex(glob);if(![...extPaths].some(p=>re.test(p)))errors.push(`required-external-glob-missing:${glob}`);}
    const minimum=Number(requiredPolicy.minimumExternalFiles||0); if(extPaths.size<minimum) errors.push(`required-external-count:${extPaths.size}<${minimum}`);

    const anchors=Array.isArray(requiredPolicy.requiredReleaseAnchors)?requiredPolicy.requiredReleaseAnchors:[];
    if(anchors.length){
      if(!releaseManifestArg) errors.push('required-release-manifest-missing');
      else {
        try{releaseManifest=JSON.parse(await readFile(releaseManifestArg,'utf8'));}catch(e){errors.push(`release-manifest-unreadable:${String(e)}`);}
      }
      if(releaseManifest && requiredPolicy.appId && releaseManifest.appId!==requiredPolicy.appId) errors.push(`release-manifest-appId:${releaseManifest.appId||'missing'}!=${requiredPolicy.appId}`);
      for(const anchor of anchors){
        const glob=String(anchor?.glob||''), field=String(anchor?.releaseManifestField||''), minimumMatches=Math.max(1,Number(anchor?.minimumMatches||1));
        if(!glob||!field){errors.push('required-release-anchor-invalid');continue;}
        const wanted=releaseManifest?.[field];
        if(!/^[0-9a-f]{64}$/i.test(String(wanted||''))){errors.push(`required-release-anchor-field-invalid:${field}`);continue;}
        const re=globRegex(glob); const matches=[...extPaths].filter(p=>re.test(p) && String(extByPath.get(p)?.sha256||'').toLowerCase()===String(wanted).toLowerCase());
        if(matches.length<minimumMatches) errors.push(`required-release-anchor-missing-or-mismatch:${glob}:${field}:${matches.length}<${minimumMatches}`);
      }
    }
  }
}

for(const e of externalRows){
  const c=canonicalExternalPath(e?.path); if(!c.ok) continue;
  const rel=c.normalized, abs=path.resolve(projectRoot,rel);
  if(abs!==projectRoot&&!abs.startsWith(projectRoot+path.sep)){errors.push(`external-escape:${rel}`);continue;}
  try{const st=await lstat(abs);if(st.isSymbolicLink()||!st.isFile()){errors.push(`external-not-file:${rel}`);continue;}const d=await readFile(abs);if(e.size!==d.length)errors.push(`external-size:${rel}`);if(e.sha256!==hex(d))errors.push(`external-sha256:${rel}`);}catch{errors.push(`external-missing:${rel}`)}
}
if(errors.length){console.error(JSON.stringify({status:'FAIL',errors,requiredPolicy:requiredPolicyArg||null,releaseManifest:releaseManifestArg||null},null,2));process.exit(1);}
console.log(JSON.stringify({status:'PASS',files:seen.size,externalFiles:externalRows.length,requiredPolicy:requiredPolicyArg||null,releaseManifest:releaseManifestArg||null},null,2));
