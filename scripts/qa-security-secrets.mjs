#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const roots=['index.html','console.html','404.html','manifest.webmanifest','sw.js','assets','courses','exports','scripts','security'];
const skip=new Set(['node_modules','dist','dist-school-server','.git']);
const patterns=[
  ['private-key',/-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/],
  ['pgp-private-key',new RegExp('-----BEGIN ' + 'PGP PRIVATE KEY ' + 'BLOCK-----')],
  ['google-api-key',/AIza[0-9A-Za-z_-]{25,}/],
  ['openai-or-generic-secret',/\bsk-(?:proj-|ant-)?[0-9A-Za-z_-]{20,}\b/],
  ['bearer-token',/\bBearer\s+[A-Za-z0-9._~-]{20,}/]
];
const findings=[];
function scan(file){
  const text=fs.readFileSync(file,'utf8');
  for(const [kind,re] of patterns){ re.lastIndex=0; if(re.test(text)) findings.push({kind,file:path.relative(root,file)}); }
  const kty=/(?:^|[,{]\s*)[\"']?kty[\"']?\s*:\s*[\"'](?:EC|OKP|RSA)[\"']/im;
  const d=/(?:^|[,{]\s*)[\"']?d[\"']?\s*:\s*[\"'][A-Za-z0-9_-]{20,}[\"']/im;
  const km=kty.exec(text), dm=d.exec(text);
  if(km&&dm&&Math.abs(km.index-dm.index)<=4096) findings.push({kind:'jwk-private-key',file:path.relative(root,file)});
}
function walk(p){
  const rel=path.relative(root,p).replace(/\\/g,'/');
  if(rel === 'security/garp25/tools' || rel.startsWith('security/garp25/tools/')) return;
  const st=fs.statSync(p); if(st.isDirectory()){
    if(skip.has(path.basename(p))) return;
    for(const e of fs.readdirSync(p)) walk(path.join(p,e));
  } else if(st.isFile()) {
    const ext=path.extname(p).toLowerCase();
    if(['.js','.mjs','.html','.json','.md','.txt','.css','.webmanifest'].includes(ext) || path.basename(p)==='package.json') scan(p);
  }
}
for(const rel of roots){const p=path.join(root,rel); if(fs.existsSync(p)) walk(p);}
const out={status:findings.length?'FAIL':'PASS',findings:findings.map(f=>({...f,value:'REDACTED'}))};
console.log(JSON.stringify(out,null,2));
process.exit(findings.length?1:0);
