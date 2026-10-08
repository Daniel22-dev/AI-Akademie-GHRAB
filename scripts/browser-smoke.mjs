#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const appVersion=JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8')).version;
const dist=path.resolve(root,process.argv[2]||'dist-pages');
const out=path.join(root,'qa-results','release-current','browser-smoke');
const port=4173, driverPort=9515, base=`http://127.0.0.1:${port}/`, wd=`http://127.0.0.1:${driverPort}`;
const E='element-6066-11e4-a52e-4f735466cecf';
let server,driver,sid; const passed=[],shots=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(v,m)=>{if(!v)throw new Error(m);passed.push(m);console.log(`[BROWSER] PASS ${m}`)};

function mime(p){return ({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'})[path.extname(p)]||'application/octet-stream'}
async function serve(){
  server=http.createServer(async(req,res)=>{try{let n=decodeURIComponent(new URL(req.url,base).pathname).replace(/^\//,'')||'index.html';if(n.split('/').includes('..'))throw 0;const p=path.resolve(dist,n);if(!p.startsWith(dist+path.sep))throw 0;const b=await fs.readFile(p);res.writeHead(200,{'Content-Type':mime(p),'Cache-Control':'no-store'});res.end(b)}catch{res.writeHead(404);res.end('Not found')}});
  await new Promise((r,j)=>{server.once('error',j);server.listen(port,'127.0.0.1',r)});
}
async function call(method,url,body){const r=await fetch(wd+url,{method,headers:body===undefined?undefined:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});const t=await r.text();let j={};try{j=t?JSON.parse(t):{}}catch{j={value:t}};if(!r.ok||j.value?.error)throw new Error(j.value?.message||t);return j.value}
async function driverUp(){
  driver=spawn('chromedriver',[`--port=${driverPort}`],{stdio:'ignore'});
  for(let i=0;i<100;i++){try{if((await fetch(wd+'/status')).ok)return}catch{}await sleep(100)}throw new Error('ChromeDriver unavailable');
}
const ep=s=>`/session/${sid}${s||''}`;
const js=(script,args=[])=>call('POST',ep('/execute/sync'),{script,args});
const nav=url=>call('POST',ep('/url'),{url});
async function wait(script,label){for(let i=0;i<100;i++){try{if(await js(script))return}catch{}await sleep(100)}throw new Error('Timeout '+label)}
async function element(sel){for(let i=0;i<100;i++){try{const v=await call('POST',ep('/element'),{using:'css selector',value:sel});if(v?.[E])return v[E]}catch{}await sleep(100)}throw new Error('Missing '+sel)}
async function click(sel){const id=await element(sel);const ref={[E]:id};await js('arguments[0].scrollIntoView({block:"center",inline:"nearest"});',[ref]);await sleep(80);try{await call('POST',ep(`/element/${id}/click`),{})}catch(error){console.log('[BROWSER] native click fallback '+sel+': '+error.message.split('\n')[0]);await js('arguments[0].click();',[ref])}}
async function type(sel,text){const id=await element(sel);await call('POST',ep(`/element/${id}/clear`),{});await call('POST',ep(`/element/${id}/value`),{text,value:[...text]})}
async function shot(name){const b=await call('GET',ep('/screenshot'));const p=path.join(out,name+'.png');await fs.writeFile(p,Buffer.from(b,'base64'));shots.push(path.relative(root,p).replaceAll(path.sep,'/'))}
async function noX(label){const v=await js('return {w:innerWidth,s:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)}');ok(v.s<=v.w+2,label+' no horizontal overflow')}
async function switchTo(h){await call('POST',ep('/window'),{handle:h})}

async function run(){
  await fs.rm(out,{recursive:true,force:true});await fs.mkdir(out,{recursive:true});await serve();await driverUp();
  const s=await call('POST','/session',{capabilities:{alwaysMatch:{browserName:'chrome','goog:chromeOptions':{args:['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-popup-blocking','--window-size=1440,1000']}}}});sid=s.sessionId;const caps=s.capabilities||{};const main=await call('GET',ep('/window'));

  await nav(base);await wait('return !!document.querySelector(".academy-hero")','home');ok((await js('return document.querySelector(".academy-hero h1")?.innerText||""')).includes('Všechna školení'),'home Czech heading');await noX('desktop home');await shot('home-desktop');
  const courses=await js('return [...document.querySelectorAll(".course-open")].map(a=>a.getAttribute("href"))');ok(courses.length>=10,'course catalog links');
  await type('#course-search','GitHub');await wait('const c=[...document.querySelectorAll(".course-grid .course-card")];return c.length>0&&c.every(x=>x.innerText.toLowerCase().includes("github"))','search');ok(true,'search filters cards');
  await nav(base+'#/about');await wait('return !!document.querySelector(".about-hero")','about');ok((await js('return document.body.innerText.includes(arguments[0])',['v'+appVersion])),'about shows current app version');

  const lessons=new Set();
  for(const href of courses){await nav(base+href);await wait('return !!document.querySelector(".lesson-stage")','course');const v=await js('return {hrefs:[...document.querySelectorAll(".lesson-nav a")].map(a=>a.getAttribute("href")),w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),i:innerWidth}');ok(v.w<=v.i+2,'course desktop layout');for(const h of v.hrefs)lessons.add(h)}
  ok(lessons.size>=courses.length,'lesson outline links');
  let quiz=null,checklist=null,count=0;
  for(const href of lessons){await nav(base+href);await wait('return !!document.querySelector(".lesson-content-inner")','lesson');const v=await js('return {c:document.querySelector(".lesson-stage")?.dataset.course,l:document.querySelector(".lesson-stage")?.dataset.lesson,t:document.querySelector(".lesson-stage")?.innerText||"",w:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth),i:innerWidth,q:!!document.querySelector("[data-quiz-option]"),k:!!document.querySelector("input[data-checklist]")}');const p=href.replace(/^#\//,'').split('/');ok(v.c===p[1]&&v.l===p[2],'lesson route '+href);ok(!v.t.includes('undefined')&&!v.t.includes('[object Object]'),'lesson text '+href);ok(v.w<=v.i+2,'lesson layout '+href);if(v.q&&!quiz)quiz=href;if(v.k&&!checklist)checklist=href;if(++count%20===0)console.log(`[BROWSER] ${count}/${lessons.size}`)}
  ok(quiz&&checklist,'quiz and checklist exist');
  await nav(base+quiz);await click('[data-quiz-option]');await wait('return !!document.querySelector(".quiz-feedback")','quiz feedback');ok(true,'quiz click feedback');await click('[data-action="reset-quiz"]');await wait('return !document.querySelector(".quiz-feedback")','quiz reset');ok(true,'quiz reset');
  await nav(base+checklist);await click('input[data-checklist]');ok(await js('return document.querySelector("input[data-checklist]")?.checked===true'),'checklist click');

  const primary='#/course/ai-literacy/why-now';await nav(base+primary);await click('[data-action="toggle-trainer"]');await wait('return !!document.querySelector(".speaker-guide")','notes');ok(true,'trainer notes toggle');await click('[data-action="toggle-trainer"]');
  await click('[data-action="open-console"]');let hs=[];for(let i=0;i<100;i++){hs=await call('GET',ep('/window/handles'));if(hs.length>1)break;await sleep(100)}ok(hs.length>1,'presenter console popup');const pop=hs.find(h=>h!==main);await switchTo(pop);await wait('return !!document.querySelector("[data-live-slide-preview]")','console');await wait('const h=document.querySelector("[data-live-slide-preview]");return !!h?.shadowRoot?.querySelector(".lesson-stage")','preview');ok(true,'console live DOM preview');await shot('console');
  await switchTo(main);await click('[data-action="toggle-presenter"]');await wait('return document.body.classList.contains("presenter-mode")&&document.querySelector(".lesson-stage")?.dataset.lesson==="cover"','presenter');ok(!(await js('return !!document.querySelector(".lesson-stage .speaker-guide")')),'notes hidden on projector');await noX('presenter');await shot('presenter-cover');
  await switchTo(pop);await wait('return (document.querySelector("[data-preview-status]")?.innerText||"").includes("ŽIVĚ")','live console');await click('[data-command="next"]');await switchTo(main);await wait('return document.querySelector(".lesson-stage")?.dataset.lesson!=="cover"','console next');ok(true,'console controls projector');
  let end=false;for(let i=0;i<50;i++){if(await js('return !!document.querySelector(".presentation-end")')){end=true;break}await click('.lesson-stage [data-action="next-lesson"]');await sleep(60)}ok(end,'presenter reaches end');await shot('presenter-end');await click('[data-action="restart-presentation"]');await wait('return document.querySelector(".lesson-stage")?.dataset.lesson==="cover"','restart');await click('.presenter-exit-button');await wait('return !document.body.classList.contains("presenter-mode")','exit');ok(true,'presenter restart and exit');
  for(const h of await call('GET',ep('/window/handles'))){if(h!==main){await switchTo(h);await call('DELETE',ep('/window'))}}await switchTo(main);

  await call('POST',ep('/window/rect'),{x:0,y:0,width:390,height:844});await nav(base);await wait('return !!document.querySelector(".mobile-menu")','mobile');await noX('mobile home');await click('.mobile-menu');await wait('return document.querySelector(".site-header")?.classList.contains("menu-open")','mobile menu');ok(true,'mobile menu click');await nav(base+primary);await noX('mobile course');await click('[data-action="toggle-outline"]');await wait('return document.querySelector(".course-workspace")?.classList.contains("outline-open")','outline');await click('.outline-close');await wait('return !document.querySelector(".course-workspace")?.classList.contains("outline-open")','outline close');ok(true,'mobile outline open/close');await shot('course-mobile');

  const report={schema:'ai-akademie-browser-smoke-v1',generatedAt:new Date().toISOString(),browser:`${caps.browserName||'chrome'} ${caps.browserVersion||''}`,courses:courses.length,lessons:lessons.size,status:'PASS',checks:passed,screenshots:shots};await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');console.log(`[BROWSER] PASS ${passed.length} checks, ${courses.length} courses, ${lessons.size} lessons`);
}
async function clean(){if(sid)try{await call('DELETE',ep())}catch{}if(driver&&!driver.killed)driver.kill('SIGTERM');if(server)await new Promise(r=>server.close(r))}
try{await run()}catch(e){console.error('[BROWSER] FAIL',e);await fs.mkdir(out,{recursive:true}).catch(()=>{});await fs.writeFile(path.join(out,'failure.txt'),String(e.stack||e)+'\n').catch(()=>{});process.exitCode=1}finally{await clean()}
