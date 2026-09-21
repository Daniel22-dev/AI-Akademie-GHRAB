#!/usr/bin/env node
const base=String(process.env.GHRAB_LIVE_URL||'https://daniel22-dev.github.io/AI-Akademie-GHRAB/').replace(/\/?$/,'/');
const expected=String(process.env.GHRAB_LIVE_VERSION||'');
const attempts=Math.max(1,Number(process.env.GHRAB_LIVE_ATTEMPTS||8));
const delay=Math.max(500,Number(process.env.GHRAB_LIVE_DELAY_MS||5000));
const maxDelay=Math.max(delay,Number(process.env.GHRAB_LIVE_MAX_DELAY_MS||30000));
if(!expected) throw new Error('GHRAB_LIVE_VERSION missing');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let last='';
for(let i=1;i<=attempts;i++){
  try{
    const [c,s]=await Promise.all([
      fetch(new URL('assets/js/changelog.js',base),{cache:'no-store'}),
      fetch(new URL('sw.js',base),{cache:'no-store'})
    ]);
    if(!c.ok||!s.ok) throw new Error(`http:${c.status}/${s.status}`);
    const [ct,st]=await Promise.all([c.text(),s.text()]);
    const needle=`'${expected}'`;
    if(ct.includes(`APP_VERSION = ${needle}`)&&st.includes(`APP_VERSION = ${needle}`)){
      console.log(JSON.stringify({status:'PASS',base,version:expected,attempt:i},null,2)); process.exit(0);
    }
    last=`version-mismatch-attempt-${i}`;
  }catch(e){last=String(e?.message||e);}
  if(i<attempts) await sleep(Math.min(maxDelay,delay*(2**(i-1))));
}
console.error(JSON.stringify({status:'FAIL',base,version:expected,error:last},null,2)); process.exit(1);
