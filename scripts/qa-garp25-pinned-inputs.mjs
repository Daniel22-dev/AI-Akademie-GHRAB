#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const dir=path.resolve('.github/workflows');
const findings=[];
let workflowFiles=0, uses=0;
if(!fs.existsSync(dir)) findings.push('workflows-missing');
else for(const name of fs.readdirSync(dir).filter(n=>/\.ya?ml$/i.test(n)).sort()){
  workflowFiles++;
  const text=fs.readFileSync(path.join(dir,name),'utf8');
  if(!/^permissions:\s*\n\s{2}contents:\s*read\s*$/m.test(text)) findings.push(`${name}:missing-top-level-contents-read`);
  if(/pull_request_target\s*:/.test(text)) findings.push(`${name}:pull_request_target-forbidden`);
  if(/runs-on:\s*ubuntu-latest/.test(text)) findings.push(`${name}:floating-runner`);
  for(const m of text.matchAll(/^\s*uses:\s*([^\s#]+)/gm)){
    uses++;
    const ref=m[1];
    if(!ref.startsWith('./')){
      const rev=ref.slice(ref.lastIndexOf('@')+1);
      if(!/^[0-9a-f]{40}$/i.test(rev)) findings.push(`${name}:unpinned-action:${ref}`);
    }
  }
  for(const m of text.matchAll(/^\s*node-version:\s*([^\s#]+)/gm)){
    if(!/^\d+\.\d+\.\d+$/.test(m[1])) findings.push(`${name}:floating-node:${m[1]}`);
  }
  if(/\bcontinue-on-error:\s*true\b/.test(text)) findings.push(`${name}:continue-on-error`);
  if(/\|\|\s*true/.test(text)) findings.push(`${name}:ignored-exit-code`);
}
const lock=JSON.parse(fs.readFileSync('package-lock.json','utf8'));
if(lock.lockfileVersion!==3) findings.push(`lockfileVersion:${lock.lockfileVersion}`);
const status=findings.length?'FAIL':'PASS';
console[status==='PASS'?'log':'error'](JSON.stringify({status,schema:'ghrab-github-workflow-supply-chain-v2',workflowFiles,workflowUses:uses,findings},null,2));
process.exit(status==='PASS'?0:1);
