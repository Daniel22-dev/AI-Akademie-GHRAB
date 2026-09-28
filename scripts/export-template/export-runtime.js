const icons={left:'<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>',right:'<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>',
  expand:'<svg viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5"/></svg>',list:'<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  print:'<svg viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',replay:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
  close:'<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>'};
let index=0;
const stateKey='ghrab-export-state-'+course.id;
let localState={checks:{},quizzes:{}};
try{
  localState=Object.assign(localState,JSON.parse(localStorage.getItem(stateKey)||'{}'))}catch{}
const save=()=>{
  try{
    localStorage.setItem(stateKey,JSON.stringify(localState))}catch{}};
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const slideCount=course.lessons.length+2;
function calloutIcon(t){
  return t==='success'?'✓':t==='warning'?'!':t==='danger'?'×':'i'}
function block(b,bi,lessonId,printMode){
  switch(b.type){
case'lead':
      return '<p class="lead">'+esc(b.text)+'</p>';
case'cards':
      return '<div class="cards c'+(b.columns||3)+'">'+b.items.map(x=>'<article><span>'+esc(x.icon)+'</span><h3>'+esc(x.title)+'</h3><p>'+esc(x.text)+'</p></article>').join('')
          +'</div>';
case'flow':
      return '<div class="flow">'+b.items.map((x,i)=>(i?'<i>→</i>':'')+'<article><span>'+esc(x.number)+'</span><h3>'+esc(x.title)+'</h3><p>'+esc(x.text)+'</p></article>').join('')
          +'</div>';
case'comparison':
      return '<div class="comparison"><article><h3>'+esc(b.left.title)+'</h3><ul>'+b.left.items.map(x=>'<li>'+esc(x)+'</li>').join('')
          +'</ul></article><article><h3>'+esc(b.right.title)+'</h3><ul>'+b.right.items.map(x=>'<li>'+esc(x)+'</li>').join('')
          +'</ul></article></div>';
case'steps':
      return '<ol class="steps">'+b.items.map((x,i)=>'<li><span>'+String(i+1).padStart(2,'0')+'</span><div><h3>'+esc(x.title)+'</h3><p>'+esc(x.text)+'</p>'
          +(x.detail?'<small>'+esc(x.detail)+'</small>':'')+'</div></li>').join('')+'</ol>';
case'callout':
      return '<aside class="callout '+esc(b.tone||'info')+'"><span>'+calloutIcon(b.tone)+'</span><div><h3>'+esc(b.title)+'</h3><p>'
          +esc(b.text)+'</p></div></aside>';
case'activity':
      return '<section class="activity"><header><span>PRAXE</span><div><h3>'+esc(b.title)+'</h3><p>'+esc(b.brief)+'</p></div></header><ol>'
          +b.steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol><footer><strong>Výstup:</strong> '+esc(b.output)+'</footer></section>';
case'checklist':
      return '<section class="checklist"><h3>'+esc(b.title)+'</h3>'+b.items.map((x,i)=>{
        const key=lessonId+'-'+bi+'-'+i;
        const checked=!!localState.checks[key];
        return '<label class="'+(checked?'checked':'')+'"><input type="checkbox" data-check="'+key+'" '+(checked?'checked':'')
            +'><span>'+esc(x)+'</span></label>'}).join('')+'</section>';
case'quiz':
      {
        const key=lessonId+'-'+bi;
        const selected=Number.isInteger(localState.quizzes[key])?localState.quizzes[key]:null;
        const answered=selected!==null;
        const correct=selected===b.answer;
        return '<section class="quiz" data-quiz="'+key+'" data-answer="'+b.answer+'" data-explanation="'+esc(b.explanation)+'"><h3>'
            +esc(b.question)+'</h3><div class="options">'+b.options.map((x,i)=>'<button data-option="'+i+'" class="'+(answered&&i===b.answer?'correct ':'')
            +(answered&&i===selected&&i!==b.answer?'incorrect':'')+'" '+(answered?'disabled':'')+'><span>'+String.fromCharCode(65+i)
            +'</span>'+esc(x)+'</button>').join('')+'</div>'+(answered?'<div class="feedback"><strong>'+(correct?'Správně.':'Ještě ne.')+'</strong> '+esc(b.explanation)
            +'<button data-reset-quiz="'+key+'">Zkusit znovu</button></div>':'')+'</section>'}
case'table':
      return '<div class="table-wrap"><table><thead><tr>'+b.headers.map(x=>'<th>'+esc(x)+'</th>').join('')+'</tr></thead><tbody>'
          +b.rows.map(r=>'<tr>'+r.map(x=>'<td>'+esc(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
case'code':
      return '<section class="code"><span>'+esc(b.label)+'</span><pre><code>'+esc(b.code)+'</code></pre><button data-copy="'
          +esc(b.code)+'">Kopírovat</button></section>';
case'quote':
      return '<blockquote class="quote"><span>“</span><p>'+esc(b.text)+'</p></blockquote>';
case'statement':
      return '<section class="statement"><span>'+esc(b.label||'HLAVNÍ MYŠLENKA')+'</span><strong>'+esc(b.text)+'</strong>'
          +(b.detail?'<p>'+esc(b.detail)+'</p>':'')+'</section>';
case'showcase':
      return '<section class="showcase"><header><span>'+esc(b.label||'MODELOVÁ UKÁZKA')+'</span><div><h3>'+esc(b.title)+'</h3>'
          +(b.text?'<p>'+esc(b.text)+'</p>':'')+'</div></header><div class="showcase-grid"><article><small>'+esc((b.before||{}).label||'PŘED')
          +'</small><strong>'+esc((b.before||{}).title||'')+'</strong><ul>'+((b.before||{}).items||[]).map(x=>'<li>'+esc(x)+'</li>').join('')
          +'</ul></article><i>'+icons.right+'</i><article><small>'+esc((b.after||{}).label||'PO')+'</small><strong>'+esc((b.after||{}).title||'')
          +'</strong><ul>'+((b.after||{}).items||[]).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></article></div>'+(b.caption?'<footer>'+esc(b.caption)+'</footer>':'')
          +'</section>';
case'decision':
      return '<section class="decision"><span>'+esc(b.label||'ROZHODNUTÍ')+'</span><h3>'+esc(b.question)+'</h3><div>'
          +(b.options||[]).map(x=>'<article><strong>'+esc(x.title)+'</strong><p>'+esc(x.text)+'</p></article>').join('')+'</div></section>';
case'mission':
      return '<section class="mission"><div><span>'+esc(b.label||'ŽIVÁ MISE')+'</span><h3>'+esc(b.title)+'</h3><p>'+esc(b.brief)
          +'</p></div><strong>'+esc(b.time||'7 MIN')+'</strong>'+(b.output?'<footer>Výstup: '+esc(b.output)+'</footer>':'')
          +'</section>';
default:
      return''}}
function cover(cls){
  return '<section class="slide cover '+(cls||'')+'"><div><p class="kicker">'+esc(course.code)+' · '+esc(course.category)
      +'</p><h1>'+esc(course.title)+'<span>AI Akademie GHRAB</span></h1><p class="subtitle">'+esc(course.subtitle)+'</p><div class="cover-meta"><span class="pill">'
      +esc(course.audience)+'</span><span class="pill">'+course.timing.total+' minut celkem</span><span class="pill">'
      +course.timing.content+' minut obsahu</span>'+(course.timing.reserve?'<span class="pill">'+course.timing.reserve+' minut diskuse a rezervy</span>':'')
      +'<span class="pill">'+course.lessons.length+' částí</span><span class="pill">Základní cesta: '+course.minimumLessons
      +' částí</span></div><ul class="cover-outcomes">'+course.outcomes.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div><div class="cover-art"><img src="'
      +course.icon+'" alt=""></div></section>'}
function lesson(l,li,cls){
  return '<section class="slide layout-'+esc(l.layout||'standard')+' '+(cls||'')+'"><p class="kicker">'+esc(l.kicker)+' · '
      +l.duration+' MIN TATO ČÁST · '+course.timing.total+' MIN CELKEM</p><h2>'+esc(l.title)+'</h2><p class="summary">'
      +esc(l.summary)+'</p><div class="content">'+l.blocks.map((b,bi)=>block(b,bi,l.id,!!cls)).join('')+'</div></section>'}
function ending(cls){
  return '<section class="slide end-slide '+(cls||'')+'"><div class="end-mark">'+icons.check+'</div><p class="kicker">'
      +esc(course.code)+' · KONEC PREZENTACE</p><h1>Děkuji za pozornost.</h1><p>Prezentace <strong>'+esc(course.title)
      +'</strong> je u konce. Můžete ji spustit znovu, vrátit se na obsah nebo ukončit režim celé obrazovky.</p><div class="end-meta"><span class="pill">'
      +course.timing.total+' minut celkem</span><span class="pill">'+course.lessons.length+' obsahových částí</span><span class="pill">Závěrečná obrazovka</span></div><div class="end-actions"><button class="primary" data-action="exit-fullscreen">'
      +icons.close+' Ukončit prezentaci</button><button data-action="restart">'+icons.replay+' Spustit znovu</button><button data-action="last-slide">'
      +icons.left+' Zpět na poslední část</button></div><small class="end-hint">Celou obrazovku lze kdykoliv ukončit také klávesou Esc.</small></section>'}
function fitSlide(){
  if(innerWidth<=900)return;
  const viewport=document.querySelector('.slide-viewport');
  const inner=viewport?.querySelector('.slide-inner');
  if(!viewport||!inner)return;
  inner.style.transform='';
  inner.style.width='';
  const available=Math.max(1,viewport.clientHeight-2);
  const needed=Math.max(1,inner.scrollHeight);
  const scale=Math.min(1,available/needed);
  inner.style.transform='scale('+scale+')';
  inner.style.width=(100/scale)+'%'}
function renderPrint(){
  document.querySelector('#print-root').innerHTML=cover('print-slide')+course.lessons.map((l,i)=>lesson(l,i,'print-slide')).join('')+ending('print-slide')}
function render(){
  const isCover=index===0;
  const isEnd=index===slideCount-1;
  const active=!isCover&&!isEnd?course.lessons[index-1]:null;
  document.title=(isEnd?'Konec prezentace':active?active.title:course.title)+' · AI Akademie GHRAB';
  const pct=Math.round(index/(slideCount-1)*100);
  const nextButton=isEnd?'<button class="next" data-action="restart">Znovu od začátku '+icons.replay+'</button>':'<button class="next" data-action="next">'+(index===slideCount-2?'Dokončit':'Další')+' '+icons.right+'</button>';
  document.querySelector('#app').innerHTML='<header class="topbar"><div class="brand"><img src="'+brandIcon+'" alt=""><div><strong>AI Akademie GHRAB</strong><small>Interaktivní materiál pro účastníky</small></div></div><div class="top-title"><small>'
      +esc(course.code)+'<span class="duration-chip">'+course.timing.total+' min celkem</span></small><strong>'+(isEnd?'Konec prezentace':active?esc(active.title):esc(course.title))
      +'</strong></div><div class="top-actions"><button class="icon-btn menu-btn" data-action="menu" title="Obsah">'+icons.list
      +'</button><button class="icon-btn" data-action="print" title="Vytisknout nebo uložit celou prezentaci jako PDF">'
      +icons.print+'</button><button class="icon-btn" data-action="fullscreen" title="Celá obrazovka">'+icons.expand+'</button></div></header><main class="workspace"><aside class="sidebar"><p class="sidebar-label">OBSAH PREZENTACE</p><nav class="nav"><button data-slide="0" class="'
      +(isCover?'active':'')+'"><b>00</b><span><strong>Úvodní obrazovka</strong><small>'+course.timing.total+' min celkem</small></span></button>'
      +course.lessons.map((l,i)=>'<button data-slide="'+(i+1)+'" class="'+(index===i+1?'active':'')+'"><b>'+String(i+1).padStart(2,'0')
      +'</b><span><strong>'+esc(l.title)+'</strong><small>'+(i<course.minimumLessons?'Základní cesta':'Rozšíření')+' · '
      +l.duration+' min</small></span></button>').join('')+'<button data-slide="'+(slideCount-1)+'" class="end-nav '+(isEnd?'active':'')
      +'"><b>✓</b><span><strong>Konec prezentace</strong><small>Ukončení a návrat</small></span></button></nav></aside><article class="stage"><div class="slide-viewport"><div class="slide-inner">'
      +(isCover?cover(''):isEnd?ending(''):lesson(active,index-1,''))+'</div></div></article></main><footer class="bottom"><button data-action="prev" '
      +(isCover?'disabled':'')+'>'+icons.left+' Předchozí</button><div class="progress"><span>'+(index+1)+' / '+slideCount
      +' · '+course.timing.total+' min celkem</span><div class="progress-bar"><i style="width:'+pct+'%"></i></div></div>'
      +nextButton+'</footer>';
  bind();
  requestAnimationFrame(fitSlide)}
function bind(){
  document.querySelectorAll('[data-slide]').forEach(b=>b.onclick=()=>{
    index=Number(b.dataset.slide);
    document.querySelector('.workspace')?.classList.remove('menu-open');
    render()});
  document.querySelector('[data-action="prev"]')?.addEventListener('click',()=>{
    if(index>0){
      index--;
      render()}});
  document.querySelector('[data-action="next"]')?.addEventListener('click',()=>{
    if(index<slideCount-1){
      index++;
      render()}});
  document.querySelectorAll('[data-action="restart"]').forEach(b=>b.addEventListener('click',()=>{
    index=0;
    render()}));
  document.querySelector('[data-action="last-slide"]')?.addEventListener('click',()=>{
    index=slideCount-2;
    render()});
  document.querySelectorAll('[data-action="menu"]').forEach(b=>b.addEventListener('click',()=>document.querySelector('.workspace')?.classList.toggle('menu-open')));
  document.querySelector('[data-action="exit-fullscreen"]')?.addEventListener('click',async()=>{
    try{
      if(document.fullscreenElement)await document.exitFullscreen()}catch{}});
  document.querySelector('[data-action="fullscreen"]')?.addEventListener('click',async()=>{
    if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()});
  document.querySelector('[data-action="print"]')?.addEventListener('click',()=>window.print());
  document.querySelectorAll('[data-check]').forEach(input=>input.addEventListener('change',()=>{
    localState.checks[input.dataset.check]=input.checked;
    input.closest('label')?.classList.toggle('checked',input.checked);
    save()}));
  document.querySelectorAll('.quiz').forEach(q=>q.querySelectorAll('[data-option]').forEach(btn=>btn.onclick=()=>{
    const key=q.dataset.quiz;
    if(Number.isInteger(localState.quizzes[key]))return;
    localState.quizzes[key]=Number(btn.dataset.option);
    save();
    render()}));
  document.querySelectorAll('[data-reset-quiz]').forEach(btn=>btn.onclick=()=>{
    delete localState.quizzes[btn.dataset.resetQuiz];
    save();
    render()});
  document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=async()=>{
    try{
      await navigator.clipboard.writeText(b.dataset.copy);
      b.textContent='Zkopírováno'}catch{}})}
addEventListener('keydown',e=>{
  if(e.target.matches('input,textarea,select,[contenteditable="true"]'))return;
  if(e.target.matches('button')&&e.key===' ')return;
  if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){
    e.preventDefault();
    if(index<slideCount-1){
      index++;
      render()}}
  if(e.key==='ArrowLeft'||e.key==='PageUp'){
    e.preventDefault();
    if(index>0){
      index--;
      render()}}
  if(e.key.toLowerCase()==='f')document.querySelector('[data-action="fullscreen"]')?.click();
  if(e.key==='Home'){
    index=0;
    render()}
  if(e.key==='End'){
    index=slideCount-1;
    render()}});addEventListener('resize',()=>requestAnimationFrame(fitSlide));renderPrint();render();
