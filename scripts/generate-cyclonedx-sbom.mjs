#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const lock=JSON.parse(fs.readFileSync(path.join(root,'package-lock.json'),'utf8'));
const components=[];
for (const [lockPath,meta] of Object.entries(lock.packages||{})) {
  if (!lockPath.startsWith('node_modules/') || !meta?.version) continue;
  const tail=lockPath.slice(lockPath.lastIndexOf('node_modules/')+'node_modules/'.length).split('/');
  const name=tail[0].startsWith('@')?`${tail[0]}/${tail[1]}`:tail[0];
  components.push({type:'library',name,version:String(meta.version),purl:`pkg:npm/${encodeURIComponent(name).replace('%40','@')}@${meta.version}`});
}
components.sort((a,b)=>a.purl.localeCompare(b.purl,'en'));
const bom={bomFormat:'CycloneDX',specVersion:'1.5',serialNumber:`urn:uuid:${crypto.randomUUID()}`,version:1,metadata:{timestamp:new Date().toISOString(),component:{type:'application',name:pkg.name,version:pkg.version}},components};
const out=process.argv[2]||`security/sbom/ai-akademie-${pkg.version}.cdx.json`;
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,JSON.stringify(bom,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',output:out,dependencies:components.length},null,2));
