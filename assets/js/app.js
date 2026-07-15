import { courses, courseMap } from '../../courses/index.js';
import {
  loadState,
  saveState,
  resetState,
  lessonKey,
  checklistKey,
  quizKey
} from './storage.js';
import { startStarfield } from './starfield.js';

const app = document.querySelector('#app');
let state = loadState();
let searchTerm = '';
let activeCategory = 'Vše';
let presenterMode = false;
let presentationCover = false;
let deferredInstallPrompt = null;
let presenterConsoleWindow = null;
const presenterSessionId = sessionStorage.getItem('ghrab-presenter-session') || (crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
sessionStorage.setItem('ghrab-presenter-session', presenterSessionId);
const presenterChannelName = `ghrab-academy-presenter-${presenterSessionId}`;
const presenterChannel = 'BroadcastChannel' in window ? new BroadcastChannel(presenterChannelName) : null;

const icons = {
  arrowLeft: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>',
  expand: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5"/></svg>',
  notes: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4zM8 9h8M8 13h8M8 17h5"/></svg>',
  present: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h16v12H4zM8 21l4-6 4 6M2 3h20"/></svg>',
  copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 9h11v11H9zM4 4h11v11H4z"/></svg>',
  reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>',
  console: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 9l2 2 3-3M14 12h3"/></svg>'
};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function cleanSentence(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function lowerFirst(value = '') {
  const text = cleanSentence(value);
  return text ? text.charAt(0).toLocaleLowerCase('cs') + text.slice(1) : '';
}

function uniqueList(items = []) {
  const seen = new Set();
  return items
    .map(cleanSentence)
    .filter(Boolean)
    .filter(item => {
      const key = item.toLocaleLowerCase('cs').replace(/[„“”"'.:;!?]/g, '').trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function courseTiming(course) {
  const content = course.lessons.reduce((sum, lesson) => sum + (Number(lesson.duration) || 0), 0);
  const reserve = Number.isFinite(Number(course.reserve)) ? Number(course.reserve) : Math.max(0, Number(course.duration) - content);
  const total = content + Math.max(0, reserve);
  return { content, reserve: Math.max(0, reserve), total };
}

function formatMinutes(total = 0) {
  const minutes = Math.max(0, Math.round(Number(total) || 0));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  if (!rest) return `${hours} h`;
  return `${hours} h ${rest} min`;
}

function firstMeaningfulPoints(lesson, limit = 4) {
  const points = [];
  for (const block of lesson.blocks || []) {
    if (block.type === 'lead' && block.text) points.push(cleanSentence(block.text));
    if (block.type === 'cards' || block.type === 'flow' || block.type === 'steps') {
      for (const item of block.items || []) {
        const point = [item.title, item.text].filter(Boolean).join(': ');
        if (point) points.push(cleanSentence(point));
      }
    }
    if (block.type === 'comparison') {
      if (block.left?.title) points.push(`${block.left.title}: ${(block.left.items || []).slice(0, 2).join(', ')}`);
      if (block.right?.title) points.push(`${block.right.title}: ${(block.right.items || []).slice(0, 2).join(', ')}`);
    }
    if (block.type === 'callout' && block.title) points.push(`${block.title}: ${block.text || ''}`);
    if (points.length >= limit) break;
  }
  return uniqueList(points).slice(0, limit);
}

function suggestedQuestion(lesson) {
  const quiz = (lesson.blocks || []).find(block => block.type === 'quiz');
  if (quiz?.question) return quiz.question;
  const activity = (lesson.blocks || []).find(block => block.type === 'activity');
  if (activity?.title) return `Jak byste téma „${activity.title}“ převedli do svého předmětu nebo své běžné praxe?`;
  const comparison = (lesson.blocks || []).find(block => block.type === 'comparison');
  if (comparison) return 'Který z uvedených přístupů je vám bližší a podle čeho byste se rozhodovali v praxi?';
  const checklist = (lesson.blocks || []).find(block => block.type === 'checklist');
  if (checklist) return 'Který bod tohoto kontrolního seznamu bývá podle vás v praxi nejtěžší dodržet?';
  return `Kde se s tématem „${lesson.title}“ setkáváte ve své vlastní učitelské praxi?`;
}

function expectedAnswer(lesson) {
  const quiz = (lesson.blocks || []).find(block => block.type === 'quiz');
  if (quiz) return `Směřujte diskusi k tomuto závěru: ${quiz.explanation}`;
  const callout = (lesson.blocks || []).find(block => block.type === 'callout' && ['success', 'warning', 'danger'].includes(block.tone));
  if (callout) return `Očekávaný závěr: ${callout.text}`;
  return `Očekávejte konkrétní příklad z výuky. Nakonec jej propojte s hlavní myšlenkou této části: ${lesson.summary}`;
}

function suggestedDemo(lesson) {
  const activity = (lesson.blocks || []).find(block => block.type === 'activity');
  if (activity) return `${activity.brief} Výstup, který má být na konci vidět: ${activity.output}`;
  const code = (lesson.blocks || []).find(block => block.type === 'code');
  if (code) return `Na obrazovce ukažte část „${code.label}“. Zvýrazněte jen dvě místa, která mají kolegové upravit pro svůj předmět.`;
  const steps = (lesson.blocks || []).find(block => block.type === 'steps');
  if (steps) return 'Postupujte po jednotlivých krocích. Po každém kroku ukažte konkrétní dopad na výsledný materiál nebo rozhodnutí.';
  const comparison = (lesson.blocks || []).find(block => block.type === 'comparison');
  if (comparison) return 'Nechte kolegy nejprve deset sekund porovnat oba sloupce. Potom zvýrazněte jeden rozhodující rozdíl.';
  return 'Ukažte jeden stručný konkrétní příklad z běžné školní situace a pojmenujte, co přesně se díky postupu zlepšilo.';
}

function suggestedCaution(lesson) {
  const warning = (lesson.blocks || []).find(block => block.type === 'callout' && ['warning', 'danger'].includes(block.tone));
  if (warning) return `${warning.title}: ${warning.text}`;
  return 'Nenechte diskusi sklouznout k obecnému nadšení ani odmítání. Vraťte ji ke konkrétnímu cíli, odpovědnosti učitele a ověření výsledku.';
}

function timingPlan(lesson) {
  const total = Math.max(3, Number(lesson.duration) || 5);
  const hasActivity = (lesson.blocks || []).some(block => ['activity', 'quiz', 'checklist'].includes(block.type));
  const intro = Math.max(1, Math.round(total * .16));
  const interaction = Math.max(1, Math.round(total * (hasActivity ? .38 : .24)));
  const explanation = Math.max(1, total - intro - interaction);
  return `${intro} min uvedení tématu · ${explanation} min vysvětlení nebo ukázka · ${interaction} min zapojení kolegů a shrnutí`;
}

function buildSpeakerGuide(course, lesson, lessonIndex) {
  const explicit = lesson.speakerNotes || {};
  const points = uniqueList(explicit.explain || firstMeaningfulPoints(lesson));
  const spokenSummary = lowerFirst(lesson.summary).replace(/\.$/, '');
  const say = uniqueList(explicit.say || [
    `„Teď se zaměříme na část ${lesson.title}.“`,
    `„Nejdůležitější je, že ${spokenSummary}.“`,
    points[0] ? `„Při této části sledujte hlavně toto: ${lowerFirst(points[0])}.“` : ''
  ]);
  const ask = uniqueList(explicit.ask || [suggestedQuestion(lesson)]);
  const demo = uniqueList(explicit.demo || [suggestedDemo(lesson)]);
  const caution = uniqueList(explicit.caution || [suggestedCaution(lesson)]);
  const facilitation = uniqueList(explicit.facilitation || [lesson.trainerNote]);
  const expected = uniqueList(explicit.expected || [expectedAnswer(lesson)]);
  const nextLesson = course.lessons[lessonIndex + 1];
  const transition = uniqueList(explicit.transition || [nextLesson
    ? `„Tím máme vyjasněný základ. Teď na něj navážeme částí ${nextLesson.title}.“`
    : '„Na závěr si každý vyberte jeden konkrétní krok, který použijete ve své praxi.“']);
  const fallback = uniqueList(explicit.fallback || ['Když nefunguje internet nebo aplikace, použijte připravený statický příklad na slidu a nechte kolegy popsat správný postup vlastními slovy.']);
  const timing = explicit.timing || timingPlan(lesson);
  const timingMeta = courseTiming(course);
  return {
    say,
    explain: points,
    ask,
    expected,
    demo,
    facilitation,
    caution,
    transition,
    fallback,
    timing,
    position: `Část ${lessonIndex + 1} z ${course.lessons.length} · ${lesson.duration} min tato část · ${timingMeta.total} min celé školení`
  };
}

function renderGuideList(items) {
  return `<ul>${uniqueList(items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderSpeakerGuide(course, lesson, lessonIndex) {
  const guide = buildSpeakerGuide(course, lesson, lessonIndex);
  return `
    <aside class="speaker-guide" aria-label="Interní poznámky řečníka">
      <header>
        <div><p class="eyebrow">INTERNÍ POZNÁMKY ŘEČNÍKA</p><h3>Scénář pro vedení této části</h3></div>
        <span>Na projekci skryto</span>
      </header>
      <div class="speaker-guide-grid">
        <section class="speaker-card say"><strong>Řekni přímo</strong>${renderGuideList(guide.say)}</section>
        <section class="speaker-card explain"><strong>Vysvětli a zdůrazni</strong>${renderGuideList(guide.explain)}</section>
        <section class="speaker-card ask"><strong>Zeptej se kolegů</strong>${renderGuideList(guide.ask)}<div class="speaker-subnote"><b>Očekávaný směr:</b>${renderGuideList(guide.expected)}</div></section>
        <section class="speaker-card demo"><strong>Ukaž nebo proveď</strong>${renderGuideList(guide.demo)}</section>
        <section class="speaker-card facilitation"><strong>Metodický tip</strong>${renderGuideList(guide.facilitation)}</section>
        <section class="speaker-card caution"><strong>Pozor při výkladu</strong>${renderGuideList(guide.caution)}</section>
        <section class="speaker-card transition"><strong>Přechod dál</strong>${renderGuideList(guide.transition)}</section>
        <section class="speaker-card fallback"><strong>Záložní varianta</strong>${renderGuideList(guide.fallback)}</section>
        <section class="speaker-card timing"><strong>Časování</strong><p>${escapeHtml(guide.timing)}</p><small>${escapeHtml(guide.position)}</small></section>
      </div>
    </aside>`;
}

function presenterPayload() {
  const context = currentCourseContext();
  if (!context) return null;
  const { course, lesson, lessonIndex } = context;
  const timing = courseTiming(course);
  if (presenterMode && presentationCover) {
    return {
      course: { id: course.id, title: course.title, code: course.code, duration: timing.total, totalLessons: course.lessons.length },
      lesson: { id: 'cover', title: 'Úvodní obrazovka', summary: course.subtitle, duration: 0, kicker: `${course.code} · ZAČÁTEK` },
      lessonIndex: -1,
      isCover: true,
      presenterMode,
      previous: null,
      next: { id: course.lessons[0].id, title: course.lessons[0].title },
      guide: {
        say: [`„Vítejte na školení ${course.title}.“`, `„Během ${timing.total} minut si ukážeme praktický postup a na konci budete mít jasno, jak jej bezpečně použít.“`],
        explain: course.outcomes.slice(0, 4),
        ask: ['S jakou zkušeností nebo očekáváním dnes přicházíte?'],
        expected: ['Stačí dvě až tři krátké odpovědi. Neřešte je do hloubky; použijte je pro naladění skupiny.'],
        demo: ['Na úvod pouze ukažte cíle a časový rámec. Do aplikace vstupte až v první obsahové části.'],
        facilitation: ['Ověřte, že všichni dobře vidí projekci a vědí, zda budou potřebovat vlastní zařízení.'],
        caution: ['Nezdržujte se podrobným vysvětlováním všech cílů. Úvod má vytvořit očekávání, ne nahradit samotné školení.'],
        transition: [`„Začneme částí ${course.lessons[0].title}.“`],
        fallback: ['Když je skupina opožděná, zkraťte úvod na přivítání, cíl a jednu otázku.'],
        timing: '1–2 min přivítání · 1 min očekávání skupiny · plynulý přechod k první části',
        position: `Úvodní obrazovka · ${timing.total} min celé školení`
      }
    };
  }
  return {
    course: { id: course.id, title: course.title, code: course.code, duration: timing.total, totalLessons: course.lessons.length },
    lesson: { id: lesson.id, title: lesson.title, summary: lesson.summary, duration: lesson.duration, kicker: lesson.kicker },
    lessonIndex,
    isCover: false,
    presenterMode,
    previous: lessonIndex > 0 ? { id: course.lessons[lessonIndex - 1].id, title: course.lessons[lessonIndex - 1].title } : presenterMode ? { id: 'cover', title: 'Úvodní obrazovka' } : null,
    next: lessonIndex < course.lessons.length - 1 ? { id: course.lessons[lessonIndex + 1].id, title: course.lessons[lessonIndex + 1].title } : null,
    guide: buildSpeakerGuide(course, lesson, lessonIndex)
  };
}

function sendPresenterState() {
  const payload = presenterPayload();
  if (!payload) return;
  presenterChannel?.postMessage({ type: 'state', sessionId: presenterSessionId, payload });
  try {
    if (presenterConsoleWindow && !presenterConsoleWindow.closed && typeof presenterConsoleWindow.renderPresenterState === 'function') {
      presenterConsoleWindow.renderPresenterState(payload);
    }
  } catch {}
}

function handlePresenterCommand(message = {}) {
  const context = currentCourseContext();
  if (!context) return;
  const { course, lessonIndex } = context;
  if (message.action === 'previous') {
    if (presenterMode && presentationCover) return;
    if (presenterMode && lessonIndex === 0) {
      presentationCover = true;
      render();
      return;
    }
    if (lessonIndex > 0) navigate(`/course/${course.id}/${course.lessons[lessonIndex - 1].id}`);
  }
  if (message.action === 'next') {
    if (presenterMode && presentationCover) {
      presentationCover = false;
      render();
      return;
    }
    if (lessonIndex < course.lessons.length - 1) navigate(`/course/${course.id}/${course.lessons[lessonIndex + 1].id}`);
  }
  if (message.action === 'goto' && message.lessonId) {
    if (message.lessonId === 'cover') {
      presentationCover = true;
      render();
    } else if (course.lessons.some(item => item.id === message.lessonId)) {
      presentationCover = false;
      navigate(`/course/${course.id}/${message.lessonId}`);
    }
  }
  if (message.action === 'toggle-presenter') {
    presenterMode = !presenterMode;
    presentationCover = presenterMode;
    render();
  }
  if (message.action === 'request-state') sendPresenterState();
}

function presenterConsoleDocument() {
  return `<!doctype html>
<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Konzole školitele · AI Akademie GHRAB</title>
<style>
:root{color-scheme:dark;--bg:#030815;--panel:#08182a;--text:#eef8ff;--muted:#8da8bb;--cyan:#50e8ff;--purple:#a877ff;--gold:#f0aa4b;--green:#59e0a5;--red:#ff8f9a;--line:rgba(126,203,255,.2);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}*{box-sizing:border-box}body{margin:0;color:var(--text);background:radial-gradient(circle at 20% 0%,rgba(57,139,211,.2),transparent 34%),linear-gradient(180deg,#020714,#061321);line-height:1.45}.app{min-height:100vh;padding:18px}.top{position:sticky;top:0;z-index:4;margin:-18px -18px 16px;padding:15px 18px;border-bottom:1px solid var(--line);background:rgba(2,8,18,.94);backdrop-filter:blur(18px)}.topline{display:flex;justify-content:space-between;gap:12px;align-items:center}.eyebrow{margin:0;color:var(--cyan);font-size:.68rem;font-weight:950;letter-spacing:.14em}.screen-note{margin:9px 0 0;color:var(--muted);font-size:.72rem}.screen-note b{color:var(--gold)}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}.metric{padding:11px;border:1px solid var(--line);border-radius:13px;background:rgba(255,255,255,.035)}.metric strong{display:block;font-size:1.08rem}.metric span{color:var(--muted);font-size:.64rem}.slide{padding:18px;border:1px solid var(--line);border-radius:18px;background:linear-gradient(145deg,rgba(8,27,46,.92),rgba(3,13,25,.88))}.slide small{color:var(--purple);font-weight:900;letter-spacing:.08em}.slide h1{margin:8px 0;font-size:clamp(1.7rem,5vw,2.7rem);line-height:1.02}.slide p{margin:0;color:#c8dce8}.guide{display:grid;gap:10px;margin-top:13px}.card{padding:15px;border:1px solid var(--line);border-left:4px solid;border-radius:0 14px 14px 0;background:rgba(255,255,255,.035)}.card strong{display:block;margin-bottom:8px}.card ul{display:grid;gap:7px;margin:0;padding-left:19px}.card li,.card p{color:#d4e5ef;font-size:.82rem}.card.say{border-left-color:var(--cyan);background:rgba(80,232,255,.065)}.card.say strong{color:var(--cyan)}.card.say li{font-size:.9rem;font-weight:720}.card.explain{border-left-color:var(--purple)}.card.explain strong{color:#d4c2ff}.card.ask{border-left-color:var(--gold)}.card.ask strong{color:#ffd18d}.card.demo{border-left-color:var(--green)}.card.demo strong{color:#a7ffd6}.card.caution{border-left-color:var(--red)}.card.caution strong{color:#ffbbc1}.card.timing{border-left-color:#8da8bb}.card small{color:var(--muted)}.timer{font-variant-numeric:tabular-nums}.controls{position:sticky;bottom:0;display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:16px -18px -18px;padding:13px 18px;border-top:1px solid var(--line);background:rgba(2,8,18,.94);backdrop-filter:blur(18px)}button{min-height:44px;border:1px solid var(--line);border-radius:12px;color:var(--text);background:rgba(255,255,255,.045);font:inherit;font-weight:850;cursor:pointer}button.primary{color:#03111d;border-color:transparent;background:linear-gradient(135deg,var(--cyan),#9abaff)}button:disabled{opacity:.35;cursor:default}.next-preview{margin-top:12px;color:var(--muted);font-size:.72rem}
</style></head><body><div id="root" class="app"><p>Načítám poznámky…</p></div>
<script>
const channel='BroadcastChannel' in window?new BroadcastChannel('${presenterChannelName}'):null;let started=Date.now(),slideStarted=Date.now(),lastLesson='';
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const list=items=>'<ul>'+((items||[]).map(x=>'<li>'+esc(x)+'</li>').join(''))+'</ul>';const fmt=ms=>{const sec=Math.floor(ms/1000),m=Math.floor(sec/60),s=sec%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')};
function command(action,extra={}){try{if(opener&&typeof opener.__ghrabPresenterCommand==='function'){opener.__ghrabPresenterCommand({action,...extra});return}}catch{}channel?.postMessage({type:'command',action,...extra})}
window.renderPresenterState=p=>{if(!p)return;if(lastLesson!==p.lesson.id){lastLesson=p.lesson.id;slideStarted=Date.now()}const g=p.guide;document.querySelector('#root').innerHTML='<header class="top"><div class="topline"><div><p class="eyebrow">KONZOLE ŠKOLITELE · '+esc(p.course.code)+'</p><strong>'+esc(p.course.title)+'</strong></div><span>'+(p.presenterMode?'PREZENTACE BĚŽÍ':'PŘÍPRAVNÝ REŽIM')+'</span></div><p class="screen-note"><b>Důležité:</b> projektor nastavte ve Windows na „Rozšířit“, nikoli „Duplikovat“. Toto okno ponechte na displeji notebooku.</p></header><section class="metrics"><div class="metric"><strong>'+p.course.duration+' min</strong><span>celé školení</span></div><div class="metric"><strong>'+p.lesson.duration+' min</strong><span>tato část</span></div><div class="metric"><strong class="timer" id="timers">00:00</strong><span>čas části / celkem</span></div></section><section class="slide"><small>'+esc(p.lesson.kicker)+(p.isCover?' · ÚVODNÍ OBRAZOVKA':' · ČÁST '+(p.lessonIndex+1)+' / '+p.course.totalLessons)+'</small><h1>'+esc(p.lesson.title)+'</h1><p>'+esc(p.lesson.summary)+'</p></section><div class="guide"><section class="card say"><strong>Řekni přímo</strong>'+list(g.say)+'</section><section class="card explain"><strong>Vysvětli a zdůrazni</strong>'+list(g.explain)+'</section><section class="card ask"><strong>Zeptej se kolegů</strong>'+list(g.ask)+'<small>Očekávaný směr</small>'+list(g.expected)+'</section><section class="card demo"><strong>Ukaž nebo proveď</strong>'+list(g.demo)+'</section><section class="card explain"><strong>Metodický tip</strong>'+list(g.facilitation)+'</section><section class="card caution"><strong>Pozor při výkladu</strong>'+list(g.caution)+'</section><section class="card demo"><strong>Přechod dál</strong>'+list(g.transition)+'</section><section class="card caution"><strong>Záložní varianta</strong>'+list(g.fallback)+'</section><section class="card timing"><strong>Časování</strong><p>'+esc(g.timing)+'</p><small>'+esc(g.position)+'</small></section></div><p class="next-preview">Další část: '+(p.next?esc(p.next.title):'konec prezentace')+'</p><footer class="controls"><button onclick="command(\'previous\')" '+(!p.previous?'disabled':'')+'>← Předchozí</button><button class="primary" onclick="command(\'next\')" '+(!p.next?'disabled':'')+'>Další →</button><button onclick="command(\'toggle-presenter\')">'+(p.presenterMode?'Ukončit projekci':'Spustit projekci')+'</button><button onclick="slideStarted=Date.now()">Vynulovat čas části</button></footer>'};
setInterval(()=>{const e=document.querySelector('#timers');if(e)e.textContent=fmt(Date.now()-slideStarted)+' / '+fmt(Date.now()-started)},1000);channel&&(channel.onmessage=e=>{if(e.data?.type==='state')window.renderPresenterState(e.data.payload)});channel?.postMessage({type:'command',action:'request-state'});try{opener?.__ghrabPresenterCommand?.({action:'request-state'})}catch{}
<\/script></body></html>`;
}

function openPresenterConsole() {
  const context = currentCourseContext();
  if (!context) return;
  const popup = window.open('', 'ghrab-presenter-console', 'popup=yes,width=590,height=900,resizable=yes,scrollbars=yes');
  if (!popup) {
    toast('Prohlížeč zablokoval okno konzole. Povolte vyskakovací okna pro tuto stránku.');
    return;
  }
  presenterConsoleWindow = popup;
  try {
    popup.document.open();
    popup.document.write(presenterConsoleDocument());
    popup.document.close();
    popup.focus();
    setTimeout(sendPresenterState, 120);
  } catch {
    toast('Konzoli školitele se nepodařilo otevřít.');
  }
}

window.__ghrabPresenterCommand = handlePresenterCommand;
presenterChannel?.addEventListener('message', event => {
  if (event.data?.type === 'command') handlePresenterCommand(event.data);
});

function route() {
  const clean = location.hash.replace(/^#\/?/, '');
  if (!clean) return { page: 'home' };
  const parts = clean.split('/').filter(Boolean);
  if (parts[0] === 'course' && parts[1]) {
    return { page: 'course', courseId: parts[1], lessonId: parts[2] || null };
  }
  return { page: 'home' };
}

function navigate(path) {
  location.hash = path;
}

function completedLesson(courseId, lessonId) {
  return Boolean(state.completedLessons[lessonKey(courseId, lessonId)]);
}

function courseProgress(course) {
  const completed = course.lessons.filter(lesson => completedLesson(course.id, lesson.id)).length;
  return {
    completed,
    total: course.lessons.length,
    percent: Math.round((completed / course.lessons.length) * 100)
  };
}

function overallProgress() {
  const total = courses.reduce((sum, course) => sum + course.lessons.length, 0);
  const completed = courses.reduce(
    (sum, course) => sum + course.lessons.filter(lesson => completedLesson(course.id, lesson.id)).length,
    0
  );
  return { completed, total, percent: Math.round((completed / total) * 100) };
}

function prerequisiteStatus(course) {
  if (!course.prerequisites.length) return { ready: true, missing: [] };
  const missing = course.prerequisites.filter(id => {
    const prerequisite = courseMap.get(id);
    return prerequisite && courseProgress(prerequisite).percent < 100;
  });
  return { ready: missing.length === 0, missing };
}

function shell(content, currentPage = 'home') {
  return `
    <header class="site-header ${presenterMode ? 'is-presenting' : ''}">
      <a class="brand" href="#/" aria-label="AI Akademie GHRAB — rozcestník prezentací">
        <span class="brand-mark"><img src="./assets/brand/icon-192.png" alt="" width="48" height="48"></span>
        <span class="brand-copy"><strong>AI Akademie <em>GHRAB</em></strong><small>Prezentace a podklady školitele</small></span>
      </a>
      ${!presenterMode ? (() => { const progress = overallProgress(); return `<div class="header-progress" title="Dokončeno ${progress.completed} z ${progress.total} částí"><span>${progress.percent}%</span><div class="mini-progress"><i style="width:${progress.percent}%"></i></div></div>`; })() : ''}
      <nav class="top-nav" aria-label="Hlavní navigace a prezentační ovládání">
        <a href="#/" class="${currentPage === 'home' ? 'active' : ''}" title="Zpět na rozcestník">${icons.home}<span>Rozcestník</span></a>
        ${currentPage === 'course' ? `<button type="button" data-action="toggle-trainer" class="${state.trainerMode ? 'active' : ''}" aria-pressed="${state.trainerMode}" title="Zobrazit nebo skrýt poznámky řečníka">${icons.notes}<span>Poznámky</span></button>` : ''}
        <button type="button" data-action="fullscreen" title="Přepnout celou obrazovku">${icons.expand}<span>Celá obrazovka</span></button>
      </nav>
      <button class="mobile-menu" type="button" data-action="toggle-menu" aria-expanded="false" aria-label="Otevřít navigaci">☰</button>
    </header>
    <main class="main ${presenterMode ? 'presenter-main' : ''}">${content}</main>
    ${presenterMode ? '' : footer()}
    <div id="toast" class="toast" role="status" aria-live="polite"></div>
  `;
}

function footer() {
  return `
    <footer class="site-footer">
      <div>
        <img src="./assets/brand/school-logo.png" alt="Logo Gymnázia Ostrava-Hrabůvka">
        <span><strong>AI Akademie GHRAB</strong><small>Soukromý rozcestník interaktivních prezentací · verze 1.3.0</small></span>
      </div>
      <div class="footer-actions">
        <button type="button" data-action="install" class="text-button" ${deferredInstallPrompt ? '' : 'hidden'}>Nainstalovat rozcestník</button>
      </div>
    </footer>
  `;
}

function renderHome() {
  document.body.classList.remove('presenter-mode');
  presenterMode = false;
  const categories = ['Vše', ...new Set(courses.map(course => course.category))];
  const filtered = courses.filter(course => {
    const query = searchTerm.trim().toLocaleLowerCase('cs');
    const matchesSearch = !query || [course.title, course.subtitle, course.category, course.audience, course.code]
      .join(' ')
      .toLocaleLowerCase('cs')
      .includes(query);
    const matchesCategory = activeCategory === 'Vše' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  const totalSections = courses.reduce((sum, course) => sum + course.lessons.length, 0);
  const totalMinutes = courses.reduce((sum, course) => sum + course.duration, 0);

  const content = `
    <section class="academy-hero shell-wide presenter-hero">
      <div class="hero-copy">
        <p class="eyebrow">PREZENTAČNÍ CENTRUM · ŠKOLENÍ · PODKLADY</p>
        <h1>Všechna školení.<span>Jedno místo.</span></h1>
        <p class="hero-lead">Soukromý rozcestník pro přípravu a vedení školení kolegů. Otevřete konkrétní prezentaci, zapněte poznámky řečníka, spusťte režim celé obrazovky nebo stáhněte samostatné interaktivní HTML pro účastníky.</p>
        <div class="hero-actions">
          <a class="button primary" href="#/course/ai-literacy/why-now">Spustit úvodní osvětu ${icons.arrowRight}</a>
          <a class="button secondary" href="#courses">Otevřít katalog prezentací</a>
        </div>
        <div class="hero-metrics">
          <div><strong>${courses.length}</strong><span>samostatných prezentací</span></div>
          <div><strong>${totalSections}</strong><span>prezentačních částí</span></div>
          <div><strong>${formatMinutes(totalMinutes)}</strong><span>celkového času školení</span></div>
        </div>
      </div>
      <div class="academy-portal academy-identity" aria-hidden="true">
        <div class="portal-glow"></div>
        <div class="portal-ring ring-one"></div>
        <div class="portal-ring ring-two"></div>
        <div class="portal-ring ring-three"></div>
        <img class="academy-app-icon" src="./assets/brand/icon-512.png" alt="">
        <div class="portal-core"><span>${courses.length}</span><small>prezentací</small></div>
        <div class="orbit-label orbit-label-a">PŘÍPRAVA</div>
        <div class="orbit-label orbit-label-b">ŠKOLENÍ</div>
        <div class="orbit-label orbit-label-c">EXPORT</div>
      </div>
    </section>

    ${(() => { const progress = overallProgress(); return `<section class="progress-summary shell-wide panel-glass" aria-label="Můj postup Akademií"><div class="progress-ring" style="--progress:${Math.round(progress.percent * 3.6)}deg"><span>${progress.percent}%</span></div><div><p class="eyebrow">MŮJ POSTUP V TOMTO PROHLÍŽEČI</p><h2>${progress.completed ? `Dokončeno ${progress.completed} z ${progress.total} částí` : 'Začněte společným základem'}</h2><p>Postup, odpovědi a checklisty se ukládají pouze lokálně v tomto prohlížeči. Neobsahují jména ani údaje studentů.</p></div><button type="button" class="text-button" data-action="reset-progress">Vynulovat místní postup</button></section>`; })()}

    <section class="presenter-dashboard shell-wide" aria-label="Možnosti rozcestníku">
      <article class="presenter-feature panel-glass"><span>${icons.present}</span><div><p class="eyebrow">PREZENTOVAT</p><h2>Spusťte školení přímo z rozcestníku</h2><p>Každá část funguje jako samostatná obrazovka. Šipky mění části, klávesa F zapíná celou obrazovku a P prezentační režim.</p></div></article>
      <article class="presenter-feature panel-glass"><span>${icons.notes}</span><div><p class="eyebrow">PŘIPRAVIT SE</p><h2>Poznámky řečníka zůstávají jen vám</h2><p>V rozcestníku můžete zobrazit metodické poznámky, doporučené ukázky a upozornění. Export pro účastníky je neobsahuje.</p></div></article>
      <article class="presenter-feature panel-glass"><span>${icons.download}</span><div><p class="eyebrow">SDÍLET</p><h2>Stáhněte jediný interaktivní HTML soubor</h2><p>Každou prezentaci lze stáhnout samostatně a poslat účastníkům. Soubor funguje offline a neobsahuje celý rozcestník.</p></div></article>
    </section>

    ${renderLearningMap()}

    <section id="courses" class="courses-section shell-wide">
      <div class="section-heading">
        <div><p class="eyebrow">KATALOG PREZENTACÍ</p><h2>Vyberte školení, které právě vedete.</h2></div>
        <p>Rozcestník je určen pro školitele. Účastníkům sdílejte pouze export konkrétní prezentace, nikoli celou Akademii.</p>
      </div>
      <div class="course-tools panel-glass">
        <label class="search-box">${icons.search}<input id="course-search" type="search" placeholder="Hledat prezentaci, aplikaci nebo téma…" value="${escapeHtml(searchTerm)}"></label>
        <div class="filter-chips" role="group" aria-label="Filtr kategorií">
          ${categories.map(category => `<button type="button" data-category="${escapeHtml(category)}" class="${activeCategory === category ? 'active' : ''}">${escapeHtml(category)}</button>`).join('')}
        </div>
      </div>
      <div class="course-grid">
        ${filtered.length ? filtered.map(renderCourseCard).join('') : '<div class="empty-state"><h3>Žádná prezentace neodpovídá filtru.</h3><p>Zkuste jiný výraz nebo zrušte filtr kategorií.</p></div>'}
      </div>
    </section>
  `;

  app.innerHTML = shell(content, 'home');
}

function renderLearningMap() {
  return `
    <section class="learning-map shell-wide">
      <div class="section-heading compact">
        <div><p class="eyebrow">DOPORUČENÁ VZDĚLÁVACÍ CESTA</p><h2>Společný základ, potom cesta podle skutečné potřeby učitele.</h2></div>
        <p>Ne každý musí absolvovat všechna školení. Po dvou úvodních kurzech si kolega zvolí větev podle toho, co chce ve své práci zlepšit.</p>
      </div>
      <div class="map-stage panel-glass presenter-map learning-path-v2">
        <section class="map-foundation">
          <header><span>SPOLEČNÝ ZÁKLAD</span><strong>Pro všechny uživatele</strong></header>
          <div>${mapNode('ai-literacy', '01', 'AI gramotnost', 'core')}<span class="map-arrow">→</span>${mapNode('start', '02', 'Bezpečný start', 'core')}</div>
        </section>
        <div class="map-choice-label"><span>Potom si vyberte cestu</span></div>
        <div class="map-branches map-branches-v2">
          <article class="map-branch materials">
            <header><span>TVORBA MATERIÁLŮ</span><strong>Od pracovního listu k interaktivní aktivitě</strong></header>
            <div>${mapNode('differentiator', 'A1', 'Diferenciátor')}<span>→</span>${mapNode('generator', 'A2', 'Generátor testů')}<span>nebo</span>${mapNode('ludus', 'A3', 'LUDUS')}</div>
            <a class="map-optional" href="#/course/github">Volitelné publikování: GitHub Pages</a>
          </article>
          <article class="map-branch communication">
            <header><span>KOMUNIKACE</span><strong>Rychlejší a citlivější korespondence</strong></header>
            <div>${mapNode('correspondence', 'B1', 'Korespondenční asistent')}</div>
          </article>
          <article class="map-branch evaluation">
            <header><span>HODNOCENÍ</span><strong>Kontrolované hodnocení podle rubriky</strong></header>
            <div>${mapNode('evaluator', 'C1', 'Hodnotitel')}</div>
          </article>
        </div>
        <section class="map-advanced map-advanced-v2">
          <div><span>POKROČILÁ PRÁCE</span><p>Po zvládnutí alespoň dvou aplikací</p></div>
          ${mapNode('workflow', 'D1', 'Propojený pracovní postup', 'advanced')}
        </section>
        <section class="map-role-track">
          <div><span>SAMOSTATNÁ ROLE</span><p>Není pokračováním běžné učitelské cesty</p></div>
          ${mapNode('administrator', 'S1', 'Správce a lektor', 'advanced')}
        </section>
      </div>
    </section>`;
}

function mapNode(id, number, label, className = '') {
  return `<a class="map-node ${className}" href="#/course/${id}"><small>${number}</small><strong>${escapeHtml(label)}</strong><span>Otevřít</span></a>`;
}

function renderCourseCard(course) {
  const lessonWord = course.lessons.length === 1 ? 'část' : course.lessons.length < 5 ? 'části' : 'částí';
  const prerequisites = (course.prerequisites || []).map(id => courseMap.get(id)?.shortTitle || id);
  const progress = courseProgress(course);
  const readiness = prerequisiteStatus(course);
  return `
    <article class="course-card presenter-card" style="--course-accent:${course.accent}">
      <div class="course-card-top">
        <div class="course-icon"><img src="${course.icon}" alt=""></div>
        <div class="course-badges">
          <span class="badge ready">${escapeHtml(course.status || 'Připraveno')}</span>
          <span class="badge">${escapeHtml(course.code)}</span>
        </div>
      </div>
      <p class="course-category">${escapeHtml(course.category)}</p>
      <h3>${escapeHtml(course.title)}</h3>
      <p class="course-subtitle">${escapeHtml(course.subtitle)}</p>
      <div class="course-meta">
        <span>${icons.clock}${courseTiming(course).total} min</span>
        <span>${course.lessons.length} ${lessonWord}</span>
        <span>${escapeHtml(course.audience)}</span>
      </div>
      ${prerequisites.length ? `<p class="prerequisite-note ${readiness.ready ? 'ready' : 'waiting'}">${readiness.ready ? 'Doporučená návaznost splněna' : 'Nejprve doporučujeme'}: ${escapeHtml(prerequisites.join(', '))}</p>` : ''}
      <div class="course-progress-row"><span>Místní postup</span><strong>${progress.completed} / ${progress.total} částí</strong></div>
      <div class="course-progress" aria-label="Dokončeno ${progress.percent} procent"><i style="width:${progress.percent}%"></i></div>
      <div class="course-card-actions">
        <a class="course-open" href="#/course/${course.id}/${course.lessons[0].id}">Otevřít školení ${icons.arrowRight}</a>
        <a class="course-download" href="./exports/${course.id}.html" download>${icons.download} Stáhnout HTML</a>
      </div>
    </article>
  `;
}

function renderPresentationCover(course) {
  const timing = courseTiming(course);
  return `
    <div class="presentation-cover">
      <div class="presentation-cover-copy">
        <p class="eyebrow">${escapeHtml(course.code)} · ${escapeHtml(course.category)}</p>
        <h1>${escapeHtml(course.title)}</h1>
        <p class="presentation-cover-subtitle">${escapeHtml(course.subtitle)}</p>
        <div class="presentation-cover-meta">
          <span>${icons.clock}${timing.total} min celkem</span>
          <span>${timing.content} min obsah</span>
          ${timing.reserve ? `<span>${timing.reserve} min diskuse a rezerva</span>` : ''}
          <span>${course.lessons.length} částí</span>
        </div>
        <div class="presentation-cover-takeaway">
          <strong>Po školení účastník:</strong>
          <ul>${course.outcomes.slice(0, 4).map(outcome => `<li>${escapeHtml(outcome)}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="presentation-cover-art" style="--course-accent:${course.accent}">
        <div class="cover-orbit orbit-a"></div><div class="cover-orbit orbit-b"></div>
        <img src="${course.icon}" alt="">
        <span>AI AKADEMIE<br>GHRAB</span>
      </div>
    </div>
    <nav class="lesson-controls presentation-cover-controls" aria-label="Zahájení prezentace">
      <button type="button" disabled>${icons.arrowLeft}<span><small>Předchozí část</small><strong>Úvodní obrazovka</strong></span></button>
      <button type="button" data-action="next-lesson"><span><small>Začít školení</small><strong>${escapeHtml(course.lessons[0].title)}</strong></span>${icons.arrowRight}</button>
    </nav>`;
}

function renderLessonCompletion(course, lesson, lessonIndex) {
  const done = completedLesson(course.id, lesson.id);
  const progress = courseProgress(course);
  return `<section class="lesson-completion ${done ? 'done' : ''}" aria-label="Stav dokončení této části">
    <div><span>${done ? icons.check : String(lessonIndex + 1).padStart(2, '0')}</span><div><strong>${done ? 'Tato část je dokončená' : 'Označte část po skutečném absolvování'}</strong><p>Postup se ukládá pouze v tomto prohlížeči · kurz ${progress.completed} / ${progress.total}</p></div></div>
    <button type="button" class="button ${done ? 'secondary' : 'primary'}" data-action="mark-complete">${done ? 'Označit jako nedokončené' : 'Označit jako dokončené'}</button>
  </section>`;
}

function renderLessonStage(course, lesson, lessonIndex) {
  const timing = courseTiming(course);
  return `
    <div class="lesson-toolbar">
      <div class="lesson-time-summary">
        <span>Část ${lessonIndex + 1} / ${course.lessons.length}</span>
        <strong>${escapeHtml(lesson.duration)} min tato část</strong>
        <b>${icons.clock}${timing.total} min celkem</b>
        <i aria-hidden="true"><span style="width:${Math.round(((lessonIndex + 1) / course.lessons.length) * 100)}%"></span></i>
      </div>
      <div class="lesson-toolbar-actions">
        <button type="button" class="icon-control mobile-outline-button" data-action="toggle-outline" title="Otevřít obsah školení">☰</button>
        <button type="button" class="icon-control ${state.trainerMode ? 'active' : ''}" data-action="toggle-trainer" title="Poznámky řečníka pro přípravu">${icons.notes}</button>
        <button type="button" class="icon-control" data-action="open-console" title="Otevřít konzoli školitele v samostatném okně">${icons.console}</button>
        <button type="button" class="icon-control ${presenterMode ? 'active' : ''}" data-action="toggle-presenter" title="Prezentační režim">${icons.present}</button>
        <button type="button" class="icon-control" data-action="copy-link" title="Kopírovat odkaz na tuto část">${icons.copy}</button>
        <button type="button" class="icon-control" data-action="fullscreen" title="Celá obrazovka">${icons.expand}</button>
      </div>
    </div>
    <header class="lesson-header">
      <p class="eyebrow">${escapeHtml(lesson.kicker)}</p>
      <h2>${escapeHtml(lesson.title)}</h2>
      <p>${escapeHtml(lesson.summary)}</p>
    </header>
    ${state.trainerMode && !presenterMode ? renderSpeakerGuide(course, lesson, lessonIndex) : ''}
    <div class="lesson-content"><div class="lesson-content-inner layout-${escapeHtml(lesson.layout || 'standard')}">
      ${lesson.blocks.map((block, index) => renderBlock(block, course, lesson, index)).join('')}
    </div></div>
    ${!presenterMode ? renderLessonCompletion(course, lesson, lessonIndex) : ''}
    <nav class="lesson-controls" aria-label="Navigace mezi částmi">
      <button type="button" data-action="previous-lesson" ${lessonIndex === 0 && !presenterMode ? 'disabled' : ''}>${icons.arrowLeft}<span><small>Předchozí část</small><strong>${lessonIndex > 0 ? escapeHtml(course.lessons[lessonIndex - 1].title) : presenterMode ? 'Úvodní obrazovka' : 'Začátek prezentace'}</strong></span></button>
      <button type="button" data-action="next-lesson" ${lessonIndex === course.lessons.length - 1 ? 'disabled' : ''}><span><small>Další část</small><strong>${lessonIndex < course.lessons.length - 1 ? escapeHtml(course.lessons[lessonIndex + 1].title) : 'Konec prezentace'}</strong></span>${icons.arrowRight}</button>
    </nav>`;
}

function renderCourse(courseId, lessonId) {
  const course = courseMap.get(courseId);
  if (!course) {
    navigate('/');
    return;
  }

  let lessonIndex = course.lessons.findIndex(lesson => lesson.id === lessonId);
  if (lessonIndex < 0) lessonIndex = 0;
  const lesson = course.lessons[lessonIndex];
  const timing = courseTiming(course);
  const progress = courseProgress(course);
  state.lastCourse = course.id;
  state.lastLesson = lesson.id;
  saveState(state);

  document.body.classList.toggle('presenter-mode', presenterMode);
  const content = `
    <section class="course-hero shell-wide" style="--course-accent:${course.accent}">
      <a class="back-link" href="#/">${icons.arrowLeft} Zpět na rozcestník</a>
      <div class="course-hero-grid presenter-course-hero">
        <div class="course-hero-icon"><img src="${course.icon}" alt=""></div>
        <div>
          <div class="course-title-row"><span>${escapeHtml(course.code)}</span><span>${escapeHtml(course.category)}</span><span>${escapeHtml(course.level)}</span><span class="course-total-duration">${icons.clock} CELKEM ${timing.total} MIN</span></div>
          <h1>${escapeHtml(course.title)}</h1>
          <p>${escapeHtml(course.subtitle)}</p>
          <p class="course-timing-detail">${timing.content} min výukového obsahu${timing.reserve ? ` · ${timing.reserve} min diskuse a organizační rezervy` : ''}</p>
          <p class="course-route-detail"><strong>Základní cesta:</strong> ${course.minimumLessons} částí · <strong>Rozšíření:</strong> ${Math.max(0, course.lessons.length - course.minimumLessons)} částí</p>
        </div>
        <div class="course-hero-progress" aria-label="Postup kurzem"><strong>${progress.percent}%</strong><span>${progress.completed} z ${progress.total} částí dokončeno</span><div><i style="width:${progress.percent}%"></i></div></div>
        <div class="course-hero-actions">
          <button type="button" class="button secondary" data-action="open-console">${icons.console} Konzole školitele</button>
          <a class="button secondary download-presentation" href="./exports/${course.id}.html" download>${icons.download} HTML pro účastníky</a>
          <button type="button" class="button primary" data-action="toggle-presenter">${icons.present} Spustit od úvodu</button>
        </div>
      </div>

      <aside class="projection-privacy-guide panel-glass" aria-label="Návod pro skryté poznámky řečníka">
        <div class="projection-guide-heading">
          <span class="projection-guide-icon">${icons.console}</span>
          <div>
            <p class="eyebrow">BEZPEČNÁ PROJEKCE</p>
            <h2>Jak mít poznámky na notebooku, ale ne na projektoru</h2>
            <p>Poznámky se před účastníky skryjí pouze při použití <strong>rozšířených obrazovek</strong>. Hlavní prezentaci promítejte na projektor a Konzoli školitele nechte na displeji notebooku.</p>
          </div>
          <span class="projection-safe-badge">${icons.check} V prezentaci automaticky skryto</span>
        </div>
        <ol class="projection-steps">
          <li><span>1</span><div><strong>Připojte projektor</strong><p>Ve Windows stiskněte <kbd>Win</kbd> + <kbd>P</kbd> a zvolte <b>Rozšířit</b>.</p></div></li>
          <li><span>2</span><div><strong>Otevřete Konzoli školitele</strong><p>Klikněte na tlačítko výše. Konzoli ponechte na obrazovce notebooku.</p></div></li>
          <li><span>3</span><div><strong>Přesuňte prezentaci na projektor</strong><p>Okno s prezentací přetáhněte na druhou obrazovku a zapněte celou obrazovku.</p></div></li>
          <li><span>4</span><div><strong>Ovládejte školení z konzole</strong><p>Na notebooku uvidíte scénář, čas i další část. Kolegové uvidí pouze prezentaci.</p></div></li>
        </ol>
        <details class="projection-details">
          <summary>Podrobný návod a kontrola před zahájením školení</summary>
          <div class="projection-details-grid">
            <section><h3>Rychlá kontrola</h3><ul><li>Na notebooku a projektoru vidíte <strong>různý obsah</strong>.</li><li>Konzole školitele zůstává pouze na notebooku.</li><li>Na projektoru je otevřená hlavní prezentace.</li><li>Po spuštění prezentačního režimu nejsou poznámky součástí projekce.</li></ul></section>
            <section class="projection-warning"><h3>Nejčastější chyba</h3><p>Pokud notebook i projektor ukazují totéž, je zapnutý režim <strong>Duplikovat</strong>. Přepněte přes <kbd>Win</kbd> + <kbd>P</kbd> na <strong>Rozšířit</strong>.</p><p>Na Macu použijte <strong>Nastavení systému → Monitory → Rozšířit plochu</strong>.</p></section>
          </div>
        </details>
      </aside>
    </section>

    <section class="course-workspace shell-wide">
      <aside class="course-sidebar" id="course-outline">
        <div class="sidebar-panel panel-glass">
          <p class="eyebrow">OSNOVA PREZENTACE</p>
          <button type="button" class="outline-close" data-action="toggle-outline" aria-label="Zavřít obsah školení">×</button>
          <nav class="lesson-nav" aria-label="Části prezentace">
            ${course.lessons.map((item, index) => `<a href="#/course/${course.id}/${item.id}" class="${index === lessonIndex ? 'active' : ''}" ${index === lessonIndex ? 'aria-current="step"' : ''}><span>${completedLesson(course.id, item.id) ? icons.check : String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(item.title)}</strong><small>${index < course.minimumLessons ? 'Základní cesta' : 'Rozšíření'} · ${item.duration} min</small></span></a>`).join('')}
          </nav>
        </div>
        <div class="sidebar-panel outcomes panel-glass"><p class="eyebrow">CÍLE ŠKOLENÍ</p><ul>${course.outcomes.map(outcome => `<li>${icons.check}${escapeHtml(outcome)}</li>`).join('')}</ul></div>
        <div class="sidebar-panel share-panel panel-glass"><p class="eyebrow">PRO ÚČASTNÍKY</p><p>Samostatný HTML export neobsahuje poznámky řečníka ani ostatní prezentace.</p><a href="./exports/${course.id}.html" download>${icons.download} Stáhnout prezentaci</a></div>
      </aside>

      <article class="lesson-stage panel-glass ${presenterMode && presentationCover ? 'is-cover' : ''}" data-course="${course.id}" data-lesson="${presentationCover ? 'cover' : lesson.id}">
        ${presenterMode && presentationCover ? renderPresentationCover(course) : renderLessonStage(course, lesson, lessonIndex)}
      </article>
    </section>`;

  app.innerHTML = shell(content, 'course');
  if (!presenterMode) window.scrollTo({ top: 0, behavior: 'instant' });
  requestAnimationFrame(fitPresenterSlide);
}

function renderBlock(block, course, lesson, index) {
  switch (block.type) {
    case 'lead':
      return `<p class="content-lead">${escapeHtml(block.text)}</p>`;
    case 'cards':
      return `<div class="content-cards columns-${block.columns || 3}">${block.items.map(item => `<article><span>${escapeHtml(item.icon)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join('')}</div>`;
    case 'flow':
      return `<div class="content-flow">${block.items.map((item, itemIndex) => `${itemIndex ? '<i>→</i>' : ''}<article><span>${escapeHtml(item.number)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join('')}</div>`;
    case 'comparison':
      return `<div class="comparison"><article><h3>${escapeHtml(block.left.title)}</h3><ul>${block.left.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article><article><h3>${escapeHtml(block.right.title)}</h3><ul>${block.right.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article></div>`;
    case 'steps':
      return `<ol class="content-steps">${block.items.map((item, itemIndex) => `<li><span>${String(itemIndex + 1).padStart(2, '0')}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>${item.detail ? `<small>${escapeHtml(item.detail)}</small>` : ''}</div></li>`).join('')}</ol>`;
    case 'callout':
      return `<aside class="callout ${escapeHtml(block.tone || 'info')}"><span>${calloutIcon(block.tone)}</span><div><h3>${escapeHtml(block.title)}</h3><p>${escapeHtml(block.text)}</p></div></aside>`;
    case 'checklist':
      return renderChecklist(block, course, lesson, index);
    case 'activity':
      return `<section class="activity-block"><header><span>PRAXE</span><div><h3>${escapeHtml(block.title)}</h3><p>${escapeHtml(block.brief)}</p></div></header><ol>${block.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol><footer><strong>Výstup:</strong> ${escapeHtml(block.output)}</footer></section>`;
    case 'quiz':
      return renderQuiz(block, course, lesson);
    case 'table':
      return `<div class="table-wrap"><table><thead><tr>${block.headers.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${block.rows.map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    case 'code':
      return `<section class="code-block"><span>${escapeHtml(block.label)}</span><pre><code>${escapeHtml(block.code)}</code></pre><button type="button" data-copy-code="${escapeHtml(block.code)}">${icons.copy} Kopírovat</button></section>`;
    case 'quote':
      return `<blockquote class="content-quote"><span>“</span><p>${escapeHtml(block.text)}</p></blockquote>`;
    case 'statement':
      return `<section class="statement-block"><span>${escapeHtml(block.label || 'HLAVNÍ MYŠLENKA')}</span><strong>${escapeHtml(block.text)}</strong>${block.detail ? `<p>${escapeHtml(block.detail)}</p>` : ''}</section>`;
    case 'showcase':
      return `<section class="showcase-block"><header><span>${escapeHtml(block.label || 'MODELOVÁ UKÁZKA')}</span><div><h3>${escapeHtml(block.title)}</h3>${block.text ? `<p>${escapeHtml(block.text)}</p>` : ''}</div></header><div class="showcase-grid"><article class="showcase-before"><small>${escapeHtml(block.before?.label || 'PŘED')}</small><strong>${escapeHtml(block.before?.title || '')}</strong><ul>${(block.before?.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article><i>${icons.arrowRight}</i><article class="showcase-after"><small>${escapeHtml(block.after?.label || 'PO')}</small><strong>${escapeHtml(block.after?.title || '')}</strong><ul>${(block.after?.items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article></div>${block.caption ? `<footer>${escapeHtml(block.caption)}</footer>` : ''}</section>`;
    case 'decision':
      return `<section class="decision-block"><span>${escapeHtml(block.label || 'ROZHODNUTÍ')}</span><h3>${escapeHtml(block.question)}</h3><div>${(block.options || []).map(option => `<article><strong>${escapeHtml(option.title)}</strong><p>${escapeHtml(option.text)}</p></article>`).join('')}</div></section>`;
    case 'mission':
      return `<section class="mission-block"><div><span>${escapeHtml(block.label || 'ŽIVÁ MISE')}</span><h3>${escapeHtml(block.title)}</h3><p>${escapeHtml(block.brief)}</p></div><strong>${escapeHtml(block.time || '7 MIN')}</strong>${block.output ? `<footer>Výstup: ${escapeHtml(block.output)}</footer>` : ''}</section>`;
    default:
      return '';
  }
}

function calloutIcon(tone) {
  if (tone === 'success') return '✓';
  if (tone === 'warning') return '!';
  if (tone === 'danger') return '×';
  return 'i';
}

function renderChecklist(block, course, lesson, blockIndex) {
  return `
    <section class="checklist-block">
      <h3>${escapeHtml(block.title)}</h3>
      <div>
        ${block.items.map((item, itemIndex) => {
          const key = checklistKey(course.id, lesson.id, `${blockIndex}-${itemIndex}`);
          const checked = Boolean(state.checklistItems[key]);
          return `<label class="${checked ? 'checked' : ''}"><input type="checkbox" data-checklist="${escapeHtml(key)}" ${checked ? 'checked' : ''}><span>${icons.check}</span><strong>${escapeHtml(item)}</strong></label>`;
        }).join('')}
      </div>
    </section>
  `;
}

function renderQuiz(block, course, lesson) {
  const key = quizKey(course.id, lesson.id);
  const selected = Number.isInteger(state.quizAnswers[key]) ? state.quizAnswers[key] : null;
  const answered = selected !== null;
  const correct = answered && selected === block.answer;
  return `
    <section class="quiz-block" data-quiz-key="${escapeHtml(key)}">
      <header><span>RYCHLÁ KONTROLA</span><h3>${escapeHtml(block.question)}</h3></header>
      <div class="quiz-options">
        ${block.options.map((option, optionIndex) => {
          const classes = [selected === optionIndex ? 'selected' : '', answered && optionIndex === block.answer ? 'correct' : '', answered && selected === optionIndex && optionIndex !== block.answer ? 'incorrect' : ''].filter(Boolean).join(' ');
          return `<button type="button" data-quiz-option="${optionIndex}" class="${classes}" ${answered ? 'disabled' : ''}><span>${String.fromCharCode(65 + optionIndex)}</span>${escapeHtml(option)}</button>`;
        }).join('')}
      </div>
      ${answered ? `<div class="quiz-feedback ${correct ? 'correct' : 'incorrect'}"><strong>${correct ? 'Správně.' : 'Ještě ne.'}</strong><p>${escapeHtml(block.explanation)}</p><button type="button" data-action="reset-quiz">Zkusit znovu</button></div>` : ''}
    </section>
  `;
}

function currentCourseContext() {
  const current = route();
  if (current.page !== 'course') return null;
  const course = courseMap.get(current.courseId);
  if (!course) return null;
  const lessonIndex = Math.max(0, course.lessons.findIndex(lesson => lesson.id === current.lessonId));
  return { course, lesson: course.lessons[lessonIndex], lessonIndex };
}

function handleClick(event) {
  const actionElement = event.target.closest('[data-action]');
  if (actionElement) {
    const action = actionElement.dataset.action;
    const context = currentCourseContext();

    if (action === 'toggle-trainer') {
      if (presenterMode) {
        openPresenterConsole();
        toast('Poznámky jsou otevřené v samostatné konzoli školitele.');
      } else {
        state.trainerMode = !state.trainerMode;
        saveState(state);
        render();
      }
      return;
    }
    if (action === 'open-console') {
      openPresenterConsole();
      return;
    }
    if (action === 'fullscreen') {
      toggleFullscreen();
      return;
    }
    if (action === 'toggle-presenter') {
      presenterMode = !presenterMode;
      presentationCover = presenterMode;
      document.body.classList.toggle('presenter-mode', presenterMode);
      render();
      if (presenterMode && presenterConsoleWindow && !presenterConsoleWindow.closed) presenterConsoleWindow.focus();
      return;
    }
    if (action === 'toggle-outline') {
      document.querySelector('.course-workspace')?.classList.toggle('outline-open');
      return;
    }
    if (action === 'toggle-menu') {
      const header = document.querySelector('.site-header');
      const expanded = header?.classList.toggle('menu-open');
      actionElement.setAttribute('aria-expanded', String(Boolean(expanded)));
      return;
    }
    if (action === 'mark-complete' && context) {
      const key = lessonKey(context.course.id, context.lesson.id);
      state.completedLessons[key] = !state.completedLessons[key];
      saveState(state);
      render();
      toast(state.completedLessons[key] ? 'Lekce označena jako dokončená.' : 'Lekce označena jako nedokončená.');
      return;
    }
    if (action === 'next-lesson' && context) {
      if (presenterMode && presentationCover) {
        presentationCover = false;
        render();
        return;
      }
      if (context.lessonIndex < context.course.lessons.length - 1) {
        const next = context.course.lessons[context.lessonIndex + 1];
        navigate(`/course/${context.course.id}/${next.id}`);
      }
      return;
    }
    if (action === 'previous-lesson' && context) {
      if (presenterMode && !presentationCover && context.lessonIndex === 0) {
        presentationCover = true;
        render();
        return;
      }
      if (context.lessonIndex > 0) {
        const previous = context.course.lessons[context.lessonIndex - 1];
        navigate(`/course/${context.course.id}/${previous.id}`);
      }
      return;
    }
    if (action === 'copy-link') {
      copyText(location.href, 'Odkaz na lekci byl zkopírován.');
      return;
    }
    if (action === 'reset-quiz' && context) {
      delete state.quizAnswers[quizKey(context.course.id, context.lesson.id)];
      saveState(state);
      render();
      return;
    }
    if (action === 'reset-progress') {
      if (confirm('Opravdu chcete smazat celý postup, odpovědi a checklisty v tomto prohlížeči?')) {
        state = resetState();
        render();
        toast('Místní postup byl smazán.');
      }
      return;
    }
    if (action === 'install' && deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.finally(() => {
        deferredInstallPrompt = null;
        render();
      });
      return;
    }
  }

  const categoryButton = event.target.closest('[data-category]');
  if (categoryButton) {
    activeCategory = categoryButton.dataset.category || 'Vše';
    renderHome();
    document.querySelector('#courses')?.scrollIntoView({ block: 'start' });
    return;
  }

  const quizOption = event.target.closest('[data-quiz-option]');
  if (quizOption) {
    const context = currentCourseContext();
    if (!context) return;
    state.quizAnswers[quizKey(context.course.id, context.lesson.id)] = Number(quizOption.dataset.quizOption);
    saveState(state);
    render();
    return;
  }

  const copyCode = event.target.closest('[data-copy-code]');
  if (copyCode) {
    copyText(copyCode.dataset.copyCode || '', 'Text byl zkopírován.');
  }
}

function handleInput(event) {
  if (event.target.id === 'course-search') {
    searchTerm = event.target.value;
    const caret = event.target.selectionStart;
    renderHome();
    const input = document.querySelector('#course-search');
    input?.focus();
    input?.setSelectionRange(caret, caret);
  }
}

function handleChange(event) {
  const checklist = event.target.closest('[data-checklist]');
  if (!checklist) return;
  state.checklistItems[checklist.dataset.checklist] = checklist.checked;
  saveState(state);
  checklist.closest('label')?.classList.toggle('checked', checklist.checked);
}

function handleKeyboard(event) {
  if (event.target.matches('input, textarea, select, button')) return;
  const context = currentCourseContext();
  if (!context) return;
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    handlePresenterCommand({ action: 'next' });
  }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    handlePresenterCommand({ action: 'previous' });
  }
  if (event.key === 'Home' && presenterMode) {
    presentationCover = true;
    render();
  }
  if (event.key === 'End' && presenterMode) {
    presentationCover = false;
    navigate(`/course/${context.course.id}/${context.course.lessons.at(-1).id}`);
  }
  if (event.key.toLowerCase() === 'f') toggleFullscreen();
  if (event.key.toLowerCase() === 'p') {
    presenterMode = !presenterMode;
    presentationCover = presenterMode;
    render();
  }
  if (event.key.toLowerCase() === 'n') {
    if (presenterMode) openPresenterConsole();
    else {
      state.trainerMode = !state.trainerMode;
      saveState(state);
      render();
    }
  }
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    toast('Celou obrazovku se nepodařilo aktivovat.');
  }
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    toast(message);
  }
}


function fitPresenterSlide() {
  const content = document.querySelector('.presenter-mode .lesson-content');
  const inner = content?.querySelector('.lesson-content-inner');
  if (!content || !inner || presentationCover) return;
  inner.style.transform = '';
  inner.style.width = '';
  inner.dataset.scale = '1';
  const available = Math.max(1, content.clientHeight - 2);
  const needed = Math.max(1, inner.scrollHeight);
  const scale = Math.min(1, available / needed);
  inner.style.transform = `scale(${scale})`;
  inner.style.width = `${100 / scale}%`;
  inner.dataset.scale = scale.toFixed(3);
  document.querySelector('.lesson-stage')?.style.setProperty('--slide-scale', scale.toFixed(3));
}

function toast(message) {
  const element = document.querySelector('#toast');
  if (!element) return;
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove('show'), 2600);
}

function render() {
  const current = route();
  if (current.page === 'course') renderCourse(current.courseId, current.lessonId);
  else renderHome();
  queueMicrotask(sendPresenterState);
}

app.addEventListener('click', handleClick);
app.addEventListener('input', handleInput);
app.addEventListener('change', handleChange);
addEventListener('hashchange', render);
addEventListener('resize', () => requestAnimationFrame(fitPresenterSlide));
addEventListener('keydown', handleKeyboard);
addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  render();
});
addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  toast('Rozcestník byl nainstalován.');
});

startStarfield(document.querySelector('#starfield'));

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

render();
