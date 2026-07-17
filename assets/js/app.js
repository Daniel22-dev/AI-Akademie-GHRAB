import { courses, courseMap } from '../../courses/index.js';
import { loadState, saveState, checklistKey, quizKey } from './storage.js';
import { APP_VERSION, CHANGELOG } from './changelog.js';
import { startStarfield } from './starfield.js';

const app = document.querySelector('#app');
let state = loadState();
let searchTerm = '';
let activeCategory = 'Vše';
let presenterMode = false;
let presentationCover = false;
let presentationEnd = false;
let routePresentationTarget = null;
let deferredInstallPrompt = null;
let presenterConsoleWindow = null;
let pendingUpdateWorker = null;
let updateReloadRequested = false;
let changelogReturnFocus = null;

function createPresenterSessionId() {
  const fallback = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    const stored = sessionStorage.getItem('ghrab-presenter-session');
    if (stored) return stored;
    sessionStorage.setItem('ghrab-presenter-session', fallback);
  } catch {
    // Některé soukromé režimy blokují sessionStorage. Relace pak žije jen v paměti této karty.
  }
  return fallback;
}

const presenterSessionId = createPresenterSessionId();
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
  console: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 9l2 2 3-3M14 12h3"/></svg>',
  history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>'
};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeAccent(value = '') {
  const accent = String(value).trim();
  return /^#[0-9a-f]{3,8}$/i.test(accent) ? accent : '#50e8ff';
}

function safeAssetPath(value = '') {
  const asset = String(value).trim();
  return /^\.\/assets\/[a-z0-9/_-]+\.(?:png|svg|webp|jpe?g)$/i.test(asset) ? escapeHtml(asset) : '';
}


function cleanSentence(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
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

function buildSpeakerGuide(course, lesson, lessonIndex) {
  const explicit = lesson.speakerNotes || {};
  const timingMeta = courseTiming(course);
  const missing = ['say', 'explain', 'ask', 'expected', 'demo', 'facilitation', 'caution', 'transition', 'fallback']
    .filter(field => !Array.isArray(explicit[field]) || explicit[field].length === 0);
  if (missing.length) console.warn(`Chybí poznámky ${course.id}/${lesson.id}: ${missing.join(', ')}`);
  return {
    say: uniqueList(explicit.say || ['Poznámky pro tuto část nejsou k dispozici.']),
    explain: uniqueList(explicit.explain || ['Poznámky pro tuto část nejsou k dispozici.']),
    ask: uniqueList(explicit.ask || ['Jak se toto téma promítá do vaší praxe?']),
    expected: uniqueList(explicit.expected || ['Vrať diskusi k cíli této části.']),
    demo: uniqueList(explicit.demo || ['Použij připravený příklad na slidu.']),
    facilitation: uniqueList(explicit.facilitation || [lesson.trainerNote || 'Drž se cíle této části.']),
    caution: uniqueList(explicit.caution || ['Nevkládej do ukázky osobní ani citlivé údaje.']),
    transition: uniqueList(explicit.transition || ['Přejdi na další část prezentace.']),
    fallback: uniqueList(explicit.fallback || ['Pokračuj s připraveným obsahem na slidu bez živé ukázky.']),
    shortcut: uniqueList(explicit.shortcut || ['Řekni hlavní pointu, polož jednu otázku a přejdi dál.']),
    timing: explicit.timing || `${lesson.duration} min na tuto část`,
    position: `Část ${lessonIndex + 1} z ${course.lessons.length} · ${lesson.duration} min tato část · ${timingMeta.total} min celé školení`
  };
}

function renderGuideList(items) {
  return `<ul>${uniqueList(items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function cleanSpokenLine(item) {
  return String(item || '').trim().replace(/^„/, '').replace(/“$/, '');
}

function renderSpeechLines(items) {
  return `<div class="speaker-lines">${uniqueList(items || []).map(item => `<p>${escapeHtml(cleanSpokenLine(item))}</p>`).join('')}</div>`;
}

function renderSpeakerStep(number, label, title, className, body) {
  return `
    <section class="speaker-step ${className}">
      <div class="speaker-step-marker" aria-hidden="true"><span>${number}</span></div>
      <div class="speaker-step-body">
        <header><small>${label}</small><h4>${title}</h4></header>
        ${body}
      </div>
    </section>`;
}

function renderSpeakerGuide(course, lesson, lessonIndex) {
  const guide = buildSpeakerGuide(course, lesson, lessonIndex);
  return `
    <aside class="speaker-guide" aria-label="Interní poznámky řečníka">
      <header>
        <div><p class="eyebrow">INTERNÍ POZNÁMKY ŘEČNÍKA</p><h3>Mluvní opora pro živé školení</h3></div>
        <div class="speaker-guide-badges"><span class="speaker-order-badge">1 → 5 · JASNÝ POSTUP</span><span>Na projekci skryto</span></div>
      </header>
      <p class="speaker-guide-intro"><strong>Nečti to slovo od slova.</strong> První karta nabízí přirozené formulace, které můžeš upravit po svém. Další kroky jen hlídají, aby část měla směr a nezabředla do detailů.</p>
      <div class="speaker-guide-flow">
        ${renderSpeakerStep('1', 'ROZJEZD', 'Začni jednou přirozenou větou', 'say', renderSpeechLines(guide.say))}
        ${renderSpeakerStep('2', 'CO MUSÍ ZAZNÍT', 'Drž se dvou nebo tří bodů', 'explain', renderGuideList(guide.explain))}
        ${renderSpeakerStep('3', 'PŘÍKLAD NEBO UKÁZKA', 'Ukaž konkrétní dopad', 'demo', renderGuideList(guide.demo))}
        ${renderSpeakerStep('4', 'ZAPOJENÍ SKUPINY', 'Polož jednu otázku a nech chvíli ticho', 'ask', `${renderGuideList(guide.ask)}<div class="speaker-subnote"><b>Kam odpovědi vrátit</b>${renderGuideList(guide.expected)}</div>`)}
        ${renderSpeakerStep('5', 'KAM DÁL', 'Uzavři, nebo rovnou přepni', 'transition', renderSpeechLines(guide.transition))}
      </div>
      <div class="speaker-support-heading"><span>RYCHLÁ OPORA</span><p>Tyto body nejsou další pořadí. Použij je jen podle situace.</p></div>
      <div class="speaker-guide-support">
        <section class="speaker-card facilitation"><strong>Metodický tip</strong>${renderGuideList(guide.facilitation)}</section>
        <section class="speaker-card caution"><strong>Na co si dát pozor</strong>${renderGuideList(guide.caution)}</section>
        <section class="speaker-card shortcut"><strong>Když nestíháš</strong>${renderGuideList(guide.shortcut)}</section>
        <section class="speaker-card fallback"><strong>Když selže technika</strong>${renderGuideList(guide.fallback)}</section>
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
      isEnd: false,
      presenterMode,
      previous: null,
      next: { id: course.lessons[0].id, title: course.lessons[0].title },
      guide: {
        say: [`Dobrý den, jsem rád, že jste dorazili. Dnes se budeme věnovat tématu ${course.title}.`, `Nebudu vás provádět každým tlačítkem. Raději si během ${timing.total} minut ukážeme několik věcí, které se dají opravdu použít ve škole.`],
        explain: course.outcomes.slice(0, 4),
        ask: ['Kdo už s tímto tématem nebo aplikací má aspoň malou zkušenost?'],
        expected: ['Vezmi dvě nebo tři krátké odpovědi. Jen si zmapuj skupinu; podrobnosti nech až na konkrétní části.'],
        demo: ['Na úvod ukaž pouze cíl a čas. Do aplikace nebo podrobné ukázky vstup až na prvním obsahovém slidu.'],
        facilitation: ['Ověř, že všichni dobře vidí projekci a vědí, jestli budou potřebovat vlastní zařízení.'],
        caution: ['Nevysvětluj všechny cíle jeden po druhém. Úvod má skupinu naladit, ne vyčerpat první část školení.'],
        transition: [`Stačí krátce říct: „Tak pojďme na první věc.“ A otevři část ${course.lessons[0].title}.`],
        shortcut: ['Přivítej skupinu, řekni jeden cíl a jdi rovnou na první část.'],
        fallback: ['Když se začíná pozdě, nech jen přivítání, jednu otázku a první slide.'],
        timing: '1–2 min přivítání · 1 min očekávání skupiny · plynulý přechod k první části',
        position: `Úvodní obrazovka · ${timing.total} min celé školení`
      }
    };
  }
  if (presenterMode && presentationEnd) {
    return {
      course: { id: course.id, title: course.title, code: course.code, duration: timing.total, totalLessons: course.lessons.length },
      lesson: { id: 'end', title: 'Konec prezentace', summary: `Školení ${course.title} bylo dokončeno.`, duration: 0, kicker: `${course.code} · ZÁVĚR` },
      lessonIndex: course.lessons.length,
      isCover: false,
      isEnd: true,
      presenterMode,
      previous: { id: course.lessons.at(-1).id, title: course.lessons.at(-1).title },
      next: null,
      guide: {
        say: ['To je ode mě všechno podstatné.', 'Než skončíme, zkuste si každý vybrat jednu malou věc, kterou opravdu uděláte — ne někdy, ale v některé z příštích hodin.'],
        explain: course.outcomes.slice(0, 4),
        ask: ['Co z dnešního školení vyzkoušíte jako první?'],
        expected: ['Vezmi několik konkrétních odpovědí. Když někdo zůstane obecný, zeptej se: „V jaké hodině nebo situaci přesně?“'],
        demo: ['Ukaž, kde kolegové najdou prezentaci, aplikaci nebo navazující podporu. Nic dalšího už nepředváděj.'],
        facilitation: ['Nech prostor pro poslední dotazy a případně domluv jeden konkrétní další krok.'],
        caution: ['Neskonči posledním obsahovým slidem beze slova. Jedna jasná závěrečná věta stačí, aby všichni věděli, že je hotovo.'],
        transition: ['Po posledním dotazu poděkuj a prezentaci ukonči. Není potřeba znovu shrnovat celé školení.'],
        shortcut: ['Poděkuj, polož jednu závěrečnou otázku a ukaž, kde jsou materiály.'],
        fallback: ['Když není čas, poděkuj, ukaž kontakt nebo materiály a prezentaci ukonči.'],
        timing: '2–5 min dotazy, shrnutí a uzavření školení',
        position: `Závěrečná obrazovka · ${timing.total} min celé školení`
      }
    };
  }
  return {
    course: { id: course.id, title: course.title, code: course.code, duration: timing.total, totalLessons: course.lessons.length },
    lesson: { id: lesson.id, title: lesson.title, summary: lesson.summary, duration: lesson.duration, kicker: lesson.kicker },
    lessonIndex,
    isCover: false,
    isEnd: false,
    presenterMode,
    previous: lessonIndex > 0 ? { id: course.lessons[lessonIndex - 1].id, title: course.lessons[lessonIndex - 1].title } : presenterMode ? { id: 'cover', title: 'Úvodní obrazovka' } : null,
    next: lessonIndex < course.lessons.length - 1 ? { id: course.lessons[lessonIndex + 1].id, title: course.lessons[lessonIndex + 1].title } : presenterMode ? { id: 'end', title: 'Konec prezentace' } : null,
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
    if (presenterMode && presentationEnd) {
      presentationEnd = false;
      navigate(`/course/${course.id}/${course.lessons.at(-1).id}`);
      return;
    }
    if (presenterMode && lessonIndex === 0) {
      presentationCover = true;
      presentationEnd = false;
      render();
      return;
    }
    if (lessonIndex > 0) navigate(`/course/${course.id}/${course.lessons[lessonIndex - 1].id}`);
  }
  if (message.action === 'next') {
    if (presenterMode && presentationCover) {
      presentationCover = false;
      presentationEnd = false;
      navigate(`/course/${course.id}/${course.lessons[0].id}`);
      return;
    }
    if (presenterMode && presentationEnd) return;
    if (lessonIndex < course.lessons.length - 1) {
      navigate(`/course/${course.id}/${course.lessons[lessonIndex + 1].id}`);
    } else if (presenterMode) {
      presentationEnd = true;
      presentationCover = false;
      render();
    }
  }
  if (message.action === 'goto' && message.lessonId) {
    if (message.lessonId === 'cover') {
      presentationCover = true;
      presentationEnd = false;
      render();
    } else if (message.lessonId === 'end') {
      presentationCover = false;
      presentationEnd = true;
      render();
    } else if (course.lessons.some(item => item.id === message.lessonId)) {
      presentationCover = false;
      presentationEnd = false;
      navigate(`/course/${course.id}/${message.lessonId}`);
    }
  }
  if (message.action === 'toggle-presenter') {
    if (presenterMode) exitPresenter();
    else {
      presenterMode = true;
      presentationCover = true;
      presentationEnd = false;
      render();
    }
  }
  if (message.action === 'request-state') sendPresenterState();
}

function openPresenterConsole() {
  const context = currentCourseContext();
  if (!context) return;
  const consoleUrl = new URL('./console.html', location.href);
  consoleUrl.searchParams.set('session', presenterSessionId);
  const popup = window.open(consoleUrl.href, 'ghrab-presenter-console', 'popup=yes,width=590,height=900,resizable=yes,scrollbars=yes');
  if (!popup) {
    toast('Prohlížeč zablokoval okno konzole. Povolte vyskakovací okna pro tuto stránku.');
    return;
  }
  presenterConsoleWindow = popup;
  popup.focus();
  setTimeout(sendPresenterState, 250);
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
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const target = `#${normalized}`;
  if (location.hash === target) render();
  else location.hash = normalized;
}

function openChangelog() {
  const overlay = document.querySelector('.changelog-overlay');
  if (!overlay) return;
  changelogReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  overlay.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => overlay.classList.add('open'));
  overlay.querySelector('.changelog-close')?.focus();
}

function closeChangelog() {
  const overlay = document.querySelector('.changelog-overlay');
  if (!overlay || overlay.hidden) return;
  overlay.classList.remove('open');
  document.body.classList.remove('modal-open');
  setTimeout(() => {
    overlay.hidden = true;
    changelogReturnFocus?.focus?.();
    changelogReturnFocus = null;
  }, 180);
}

function trapChangelogFocus(event) {
  if (event.key !== 'Tab') return false;
  const overlay = document.querySelector('.changelog-overlay');
  if (!overlay || overlay.hidden) return false;
  const focusable = [...overlay.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter(element => !element.disabled && !element.hidden);
  if (!focusable.length) return true;
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
  return true;
}

async function exitPresenter(goHome = false) {
  presenterMode = false;
  presentationCover = false;
  presentationEnd = false;
  document.body.classList.remove('presenter-mode');
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch {}
  if (goHome) {
    if (route().page === 'home') renderHome();
    else navigate('/');
  } else {
    render();
  }
  queueMicrotask(showPendingUpdateToast);
}


function renderChangelogModal() {
  return `
    <div class="changelog-overlay" data-changelog-overlay hidden>
      <section class="changelog-dialog panel-glass" role="dialog" aria-modal="true" aria-labelledby="changelog-title">
        <header>
          <div><p class="eyebrow">HISTORIE VÝVOJE</p><h2 id="changelog-title">Posledních 10 změn</h2><p>Nová položka se vkládá nahoru a automaticky vytlačí nejstarší záznam.</p></div>
          <button type="button" class="changelog-close" data-action="close-changelog" aria-label="Zavřít changelog">${icons.close}</button>
        </header>
        <div class="changelog-list">
          ${CHANGELOG.map((item, index) => `<article class="changelog-item ${index === 0 ? 'latest' : ''}"><div><span>v${escapeHtml(item.version)}</span><time>${escapeHtml(item.date)}</time></div><section><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.detail)}</p></section></article>`).join('')}
        </div>
        <footer><span>Zobrazeno ${CHANGELOG.length} nejnovějších změn</span><strong>AI Akademie GHRAB v${APP_VERSION}</strong></footer>
      </section>
    </div>`;
}

function shell(content, currentPage = 'home') {
  return `
    <header class="site-header ${presenterMode ? 'is-presenting' : ''}">
      <a class="brand" href="#/" aria-label="AI Akademie GHRAB — rozcestník prezentací">
        <span class="brand-mark"><img src="./assets/brand/icon-192.png" alt="" width="48" height="48"></span>
        <span class="brand-copy"><strong>AI Akademie <em>GHRAB</em></strong><small>Prezentace a podklady školitele</small></span>
      </a>
      <nav class="top-nav" aria-label="Hlavní navigace a prezentační ovládání">
        <a href="#/" class="${currentPage === 'home' ? 'active' : ''}" title="Zpět na rozcestník">${icons.home}<span>Rozcestník</span></a>
        ${currentPage === 'course' ? `<button type="button" data-action="toggle-trainer" class="${state.trainerMode ? 'active' : ''}" aria-pressed="${state.trainerMode}" title="Zobrazit nebo skrýt poznámky řečníka">${icons.notes}<span>Poznámky</span></button>` : ''}
        ${!presenterMode ? `<button type="button" data-action="open-changelog" title="Zobrazit posledních deset změn">${icons.history}<span>Změny</span></button>` : ''}
        ${presenterMode ? `<button type="button" class="presenter-exit-button" data-action="exit-presenter" title="Ukončit prezentační režim a vrátit se do Akademie">${icons.close}<span>Ukončit prezentaci</span></button>` : ''}
        <button type="button" data-action="fullscreen" title="Přepnout celou obrazovku">${icons.expand}<span>Celá obrazovka</span></button>
      </nav>
      <button class="mobile-menu" type="button" data-action="toggle-menu" aria-expanded="false" aria-label="Otevřít navigaci">☰</button>
    </header>
    <main class="main ${presenterMode ? 'presenter-main' : ''}">${content}</main>
    ${presenterMode ? '' : footer()}
    ${renderChangelogModal()}
    <div id="toast" class="toast" role="status" aria-live="polite"></div>
  `;
}

function footer() {
  return `
    <footer class="site-footer">
      <div>
        <img src="./assets/brand/school-logo.png" alt="Logo Gymnázia Ostrava-Hrabůvka">
        <span><strong>AI Akademie GHRAB</strong><small>Soukromý rozcestník interaktivních prezentací · verze ${APP_VERSION}</small></span>
      </div>
      <div class="footer-actions">
        <button type="button" data-action="open-changelog" class="text-button">${icons.history} Changelog · v${APP_VERSION}</button>
        <button type="button" data-action="install" class="text-button" ${deferredInstallPrompt ? '' : 'hidden'}>Nainstalovat rozcestník</button>
      </div>
    </footer>
  `;
}


function filteredCourses() {
  const query = searchTerm.trim().toLocaleLowerCase('cs');
  return courses.filter(course => {
    const matchesSearch = !query || [course.title, course.subtitle, course.category, course.audience, course.code]
      .join(' ')
      .toLocaleLowerCase('cs')
      .includes(query);
    const matchesCategory = activeCategory === 'Vše' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
}

function renderCourseResults(items = filteredCourses()) {
  return items.length
    ? items.map(renderCourseCard).join('')
    : '<div class="empty-state"><h3>Žádná prezentace neodpovídá filtru.</h3><p>Zkuste jiný výraz nebo zrušte filtr kategorií.</p></div>';
}

function renderHome() {
  if (presenterMode && document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
  document.title = 'AI Akademie GHRAB · Prezentace školitele';
  document.body.classList.remove('presenter-mode');
  presenterMode = false;
  presentationCover = false;
  presentationEnd = false;
  const categories = ['Vše', ...new Set(courses.map(course => course.category))];
  const filtered = filteredCourses();
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
        ${renderCourseResults(filtered)}
      </div>
    </section>
  `;

  app.innerHTML = shell(content, 'home');
}

function renderLearningMap() {
  return `
    <section class="learning-map shell-wide">
      <div class="section-heading compact">
        <div><p class="eyebrow">DOPORUČENÁ VZDĚLÁVACÍ CESTA</p><h2>Nejdříve společný základ. Potom si každý vybere to, co skutečně potřebuje.</h2></div>
        <p>Mapa není povinný žebřík všech kurzů. Ukazuje dvě společné vstupní prezentace a následné samostatné směry podle práce učitele.</p>
      </div>
      <div class="map-stage panel-glass presenter-map learning-path-v3">
        <section class="map-foundation">
          <header><span>1 · SPOLEČNÝ ZÁKLAD</span><strong>Začínají zde všichni uživatelé</strong></header>
          <div class="foundation-flow">
            ${mapNode('ai-literacy', '01', 'AI gramotnost', 'core')}
            <span class="map-arrow" aria-hidden="true">→</span>
            ${mapNode('start', '02', 'Bezpečný start', 'core')}
          </div>
        </section>

        <div class="map-choice-label"><span>2 · Vyberte si jednu nebo více praktických cest</span></div>

        <div class="map-routes">
          <article class="map-route map-route-materials">
            <header>
              <div><span>CESTA A</span><h3>Tvorba výukových materiálů</h3></div>
              <p>Od úpravy pracovního listu až po hotový test nebo interaktivní aktivitu.</p>
            </header>
            <div class="materials-path">
              <div class="materials-start">
                <small>ZAČNĚTE ZDE</small>
                ${mapNode('differentiator', 'A1', 'Diferenciátor')}
              </div>
              <div class="materials-next">
                <small>POTOM ZVOLTE FORMU VÝSTUPU</small>
                <div>
                  ${mapNode('generator', 'A2', 'Generátor testů')}
                  <span class="choice-or">NEBO</span>
                  ${mapNode('ludus', 'A3', 'LUDUS')}
                </div>
              </div>
            </div>
            <a class="map-optional" href="#/course/github"><span>VOLITELNÉ ROZŠÍŘENÍ</span><strong>Publikování přes GitHub Pages</strong></a>
          </article>

          <div class="map-route-pair">
            <article class="map-route map-route-simple communication">
              <header>
                <div><span>CESTA B</span><h3>Komunikace</h3></div>
                <p>Rychlejší, věcná a citlivá školní korespondence.</p>
              </header>
              ${mapNode('correspondence', 'B1', 'Korespondenční asistent')}
            </article>
            <article class="map-route map-route-simple evaluation">
              <header>
                <div><span>CESTA C</span><h3>Hodnocení</h3></div>
                <p>Kontrolované hodnocení podle předem dané rubriky.</p>
              </header>
              ${mapNode('evaluator', 'C1', 'Hodnotitel')}
            </article>
          </div>
        </div>

        <div class="map-choice-label secondary"><span>3 · Navazující možnosti</span></div>
        <div class="map-secondary-grid">
          <section class="map-secondary-card advanced-track">
            <div><span>POKROČILÁ PRÁCE</span><h3>Propojte více aplikací</h3><p>Doporučeno po zvládnutí alespoň dvou nástrojů.</p></div>
            ${mapNode('workflow', 'D1', 'Propojený pracovní postup', 'advanced')}
          </section>
          <section class="map-secondary-card role-track">
            <div><span>SAMOSTATNÁ ROLE</span><h3>Správa a vedení školení</h3><p>Není součástí běžné učitelské cesty.</p></div>
            ${mapNode('administrator', 'S1', 'Správce a lektor', 'advanced')}
          </section>
        </div>
      </div>
    </section>`;
}

function mapNode(id, number, label, className = '') {
  return `<a class="map-node ${className}" href="#/course/${id}"><small>${number}</small><strong>${escapeHtml(label)}</strong><span>Otevřít</span></a>`;
}

function renderCourseCard(course) {
  const lessonWord = course.lessons.length === 1 ? 'část' : course.lessons.length < 5 ? 'části' : 'částí';
  const prerequisites = (course.prerequisites || []).map(id => courseMap.get(id)?.shortTitle || id);
  return `
    <article class="course-card presenter-card" style="--course-accent:${safeAccent(course.accent)}">
      <div class="course-card-top">
        <div class="course-icon"><img src="${safeAssetPath(course.icon)}" alt=""></div>
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
      ${prerequisites.length ? `<p class="prerequisite-note">Doporučená návaznost: ${escapeHtml(prerequisites.join(', '))}</p>` : ''}
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
      <div class="presentation-cover-art" style="--course-accent:${safeAccent(course.accent)}">
        <div class="cover-orbit orbit-a"></div><div class="cover-orbit orbit-b"></div>
        <img src="${safeAssetPath(course.icon)}" alt="">
        <span>AI AKADEMIE<br>GHRAB</span>
      </div>
    </div>
    <nav class="lesson-controls presentation-cover-controls" aria-label="Zahájení prezentace">
      <button type="button" disabled>${icons.arrowLeft}<span><small>Předchozí část</small><strong>Úvodní obrazovka</strong></span></button>
      <button type="button" data-action="next-lesson"><span><small>Začít školení</small><strong>${escapeHtml(course.lessons[0].title)}</strong></span>${icons.arrowRight}</button>
    </nav>`;
}

function renderPresentationEnd(course) {
  const timing = courseTiming(course);
  return `
    <div class="presentation-end">
      <div class="presentation-end-orbit" aria-hidden="true"><span>${icons.check}</span></div>
      <p class="eyebrow">${escapeHtml(course.code)} · KONEC ŠKOLENÍ</p>
      <h1>Děkuji za pozornost.</h1>
      <p>Prezentace <strong>${escapeHtml(course.title)}</strong> je u konce. Nyní můžete školení bezpečně ukončit, vrátit se na rozcestník nebo jej spustit znovu.</p>
      <div class="presentation-end-summary">
        <span>${icons.clock}${timing.total} min plánovaného času</span>
        <span>${course.lessons.length} obsahových částí</span>
        <span>${icons.check} závěrečná obrazovka</span>
      </div>
      <div class="presentation-end-actions">
        <button type="button" class="button primary" data-action="exit-presenter">${icons.close} Ukončit prezentaci</button>
        <button type="button" class="button secondary" data-action="restart-presentation">${icons.replay} Spustit znovu od úvodu</button>
        <button type="button" class="button secondary" data-action="back-home">${icons.home} Zpět na rozcestník</button>
      </div>
      <small>Prezentaci lze kdykoliv ukončit také tlačítkem vpravo nahoře nebo klávesou X či Esc.</small>
    </div>
    <nav class="lesson-controls presentation-end-controls" aria-label="Konec prezentace">
      <button type="button" data-action="previous-lesson">${icons.arrowLeft}<span><small>Zpět k poslední části</small><strong>${escapeHtml(course.lessons.at(-1).title)}</strong></span></button>
      <button type="button" data-action="exit-presenter"><span><small>Ukončit projekci</small><strong>Vrátit se do Akademie</strong></span>${icons.close}</button>
    </nav>`;
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
    <nav class="lesson-controls" aria-label="Navigace mezi částmi">
      <button type="button" data-action="previous-lesson" ${lessonIndex === 0 && !presenterMode ? 'disabled' : ''}>${icons.arrowLeft}<span><small>Předchozí část</small><strong>${lessonIndex > 0 ? escapeHtml(course.lessons[lessonIndex - 1].title) : presenterMode ? 'Úvodní obrazovka' : 'Začátek prezentace'}</strong></span></button>
      <button type="button" data-action="next-lesson" ${lessonIndex === course.lessons.length - 1 && !presenterMode ? 'disabled' : ''}><span><small>${lessonIndex < course.lessons.length - 1 ? 'Další část' : 'Závěrečná obrazovka'}</small><strong>${lessonIndex < course.lessons.length - 1 ? escapeHtml(course.lessons[lessonIndex + 1].title) : 'Konec prezentace'}</strong></span>${icons.arrowRight}</button>
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
  document.title = `${lesson.title} · ${course.title} · AI Akademie GHRAB`;
  state.lastCourse = course.id;
  state.lastLesson = lesson.id;
  saveState(state);

  document.body.classList.toggle('presenter-mode', presenterMode);
  const content = `
    <section class="course-hero shell-wide" style="--course-accent:${safeAccent(course.accent)}">
      <a class="back-link" href="#/">${icons.arrowLeft} Zpět na rozcestník</a>
      <div class="course-hero-grid presenter-course-hero">
        <div class="course-hero-icon"><img src="${safeAssetPath(course.icon)}" alt=""></div>
        <div>
          <div class="course-title-row"><span>${escapeHtml(course.code)}</span><span>${escapeHtml(course.category)}</span><span>${escapeHtml(course.level)}</span><span class="course-total-duration">${icons.clock} CELKEM ${timing.total} MIN</span></div>
          <h1>${escapeHtml(course.title)}</h1>
          <p>${escapeHtml(course.subtitle)}</p>
          <p class="course-timing-detail">${timing.content} min výukového obsahu${timing.reserve ? ` · ${timing.reserve} min diskuse a organizační rezervy` : ''}</p>
          <p class="course-route-detail"><strong>Základní cesta:</strong> ${course.minimumLessons} částí · <strong>Rozšíření:</strong> ${Math.max(0, course.lessons.length - course.minimumLessons)} částí</p>
        </div>
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
            ${course.lessons.map((item, index) => `<a href="#/course/${course.id}/${item.id}" class="${index === lessonIndex ? 'active' : ''}" ${index === lessonIndex ? 'aria-current="step"' : ''}><span>${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(item.title)}</strong><small>${index < course.minimumLessons ? 'Základní cesta' : 'Rozšíření'} · ${item.duration} min</small></span></a>`).join('')}
          </nav>
        </div>
        <div class="sidebar-panel outcomes panel-glass"><p class="eyebrow">CÍLE ŠKOLENÍ</p><ul>${course.outcomes.map(outcome => `<li>${icons.check}${escapeHtml(outcome)}</li>`).join('')}</ul></div>
        <div class="sidebar-panel share-panel panel-glass"><p class="eyebrow">PRO ÚČASTNÍKY</p><p>Samostatný HTML export neobsahuje poznámky řečníka ani ostatní prezentace.</p><a href="./exports/${course.id}.html" download>${icons.download} Stáhnout prezentaci</a></div>
      </aside>

      <article class="lesson-stage panel-glass ${presenterMode && presentationCover ? 'is-cover' : ''} ${presenterMode && presentationEnd ? 'is-end' : ''}" data-course="${course.id}" data-lesson="${presentationCover ? 'cover' : presentationEnd ? 'end' : lesson.id}">
        ${presenterMode && presentationCover ? renderPresentationCover(course) : presenterMode && presentationEnd ? renderPresentationEnd(course) : renderLessonStage(course, lesson, lessonIndex)}
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
      if (presenterMode) {
        exitPresenter();
      } else {
        presenterMode = true;
        presentationCover = true;
        presentationEnd = false;
        document.body.classList.add('presenter-mode');
        render();
        if (presenterConsoleWindow && !presenterConsoleWindow.closed) presenterConsoleWindow.focus();
      }
      return;
    }
    if (action === 'exit-presenter') {
      exitPresenter();
      return;
    }
    if (action === 'restart-presentation' && context) {
      presentationEnd = false;
      presentationCover = true;
      render();
      return;
    }
    if (action === 'back-home') {
      exitPresenter(true);
      return;
    }
    if (action === 'open-changelog') {
      openChangelog();
      return;
    }
    if (action === 'close-changelog') {
      closeChangelog();
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
    if (action === 'next-lesson' && context) {
      handlePresenterCommand({ action: 'next' });
      return;
    }
    if (action === 'previous-lesson' && context) {
      handlePresenterCommand({ action: 'previous' });
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
    if (action === 'install' && deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.finally(() => {
        deferredInstallPrompt = null;
        render();
      });
      return;
    }
  }

  if (event.target.matches('[data-changelog-overlay]')) {
    closeChangelog();
    return;
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
    const grid = document.querySelector('.course-grid');
    if (grid) grid.innerHTML = renderCourseResults();
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
  if (trapChangelogFocus(event)) return;
  if (event.key === 'Escape' && !document.querySelector('.changelog-overlay')?.hidden) {
    closeChangelog();
    return;
  }
  if (event.key === 'Escape' && presenterMode) {
    exitPresenter();
    return;
  }
  if (event.target.matches('input, textarea, select, [contenteditable="true"]')) return;
  if (event.target.matches('button') && event.key === ' ') return;
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
    presentationEnd = false;
    render();
  }
  if (event.key === 'End' && presenterMode) {
    const lastLessonId = context.course.lessons.at(-1).id;
    presentationCover = false;
    if (context.lesson.id === lastLessonId) {
      presentationEnd = true;
      render();
    } else {
      presentationEnd = false;
      routePresentationTarget = 'end';
      navigate(`/course/${context.course.id}/${lastLessonId}`);
    }
  }
  if (event.key.toLowerCase() === 'f') toggleFullscreen();
  if (event.key.toLowerCase() === 'p') {
    if (presenterMode) exitPresenter();
    else {
      presenterMode = true;
      presentationCover = true;
      presentationEnd = false;
      render();
    }
  }
  if (event.key.toLowerCase() === 'x' && presenterMode) exitPresenter();
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
  if (!content || !inner || presentationCover || presentationEnd) return;
  inner.style.zoom = '';
  inner.style.transform = '';
  inner.style.width = '';
  inner.dataset.scale = '1';
  const available = Math.max(1, content.clientHeight - 2);
  const needed = Math.max(1, inner.scrollHeight);
  const scale = Math.min(1, available / needed);
  if (CSS.supports?.('zoom', String(scale))) inner.style.zoom = String(scale);
  else inner.style.transform = `scale(${scale})`;
  inner.dataset.scale = scale.toFixed(3);
  document.querySelector('.lesson-stage')?.style.setProperty('--slide-scale', scale.toFixed(3));
}

function showPendingUpdateToast() {
  if (!pendingUpdateWorker || presenterMode) return;
  toast('Je připravena nová verze Akademie.', {
    persistent: true,
    actionLabel: 'Načíst aktualizaci',
    onAction: () => {
      updateReloadRequested = true;
      pendingUpdateWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  });
}

function offerUpdate(worker) {
  if (!worker) return;
  pendingUpdateWorker = worker;
  queueMicrotask(showPendingUpdateToast);
}

function toast(message, options = {}) {
  const element = document.querySelector('#toast');
  if (!element) return;
  const { persistent = false, actionLabel = '', onAction = null } = options;
  element.replaceChildren();
  const text = document.createElement('span');
  text.textContent = message;
  element.append(text);
  if (actionLabel && typeof onAction === 'function') {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = actionLabel;
    button.addEventListener('click', onAction, { once: true });
    element.append(button);
  }
  element.classList.add('show');
  clearTimeout(toast.timer);
  if (!persistent) toast.timer = setTimeout(() => element.classList.remove('show'), 2600);
}

function render() {
  const current = route();
  if (current.page === 'course') renderCourse(current.courseId, current.lessonId);
  else renderHome();
  queueMicrotask(sendPresenterState);
  queueMicrotask(showPendingUpdateToast);
}

app.addEventListener('click', handleClick);
app.addEventListener('input', handleInput);
app.addEventListener('change', handleChange);
addEventListener('hashchange', () => {
  const target = routePresentationTarget;
  routePresentationTarget = null;
  presentationCover = target === 'cover';
  presentationEnd = target === 'end';
  render();
});
addEventListener('resize', () => requestAnimationFrame(fitPresenterSlide));
addEventListener('keydown', handleKeyboard);
addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  document.querySelectorAll('[data-action="install"]').forEach(button => { button.hidden = false; });
});
addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  toast('Rozcestník byl nainstalován.');
});

startStarfield(document.querySelector('#starfield'));

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!updateReloadRequested) return;
    updateReloadRequested = false;
    location.reload();
  });

  addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
      if (registration.waiting) offerUpdate(registration.waiting);
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        installing?.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            offerUpdate(registration.waiting || installing);
          }
        });
      });
      await registration.update();
    } catch (error) {
      console.warn('Service worker se nepodařilo aktualizovat.', error);
    }
  });
}

render();
