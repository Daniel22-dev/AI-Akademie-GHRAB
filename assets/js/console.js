const root = document.querySelector('#root');
const sessionId = new URLSearchParams(location.search).get('session') || '';
const channelName = sessionId ? `ghrab-academy-presenter-${sessionId}` : '';
const channel = channelName && 'BroadcastChannel' in window ? new BroadcastChannel(channelName) : null;
let started = Date.now();
let slideStarted = Date.now();
let lastLesson = '';
let latestPayload = null;

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderList(items = []) {
  return `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderSpoken(items = []) {
  return `<div class="speech">${items.map(item => `<p>${escapeHtml(String(item || '').trim().replace(/^„/, '').replace(/“$/, ''))}</p>`).join('')}</div>`;
}

function renderStep(number, label, title, kind, body) {
  return `<section class="step ${kind}"><span class="stepno">${number}</span><div class="stepbody"><small>${label}</small><strong>${title}</strong>${body}</div></section>`;
}

function formatElapsed(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function sendCommand(action, extra = {}) {
  const message = { action, ...extra };
  try {
    if (window.opener && typeof window.opener.__ghrabPresenterCommand === 'function') {
      window.opener.__ghrabPresenterCommand(message);
      return;
    }
  } catch {}
  channel?.postMessage({ type: 'command', ...message });
}

function bindControls() {
  root.querySelector('[data-command="previous"]')?.addEventListener('click', () => sendCommand('previous'));
  root.querySelector('[data-command="next"]')?.addEventListener('click', () => sendCommand('next'));
  root.querySelectorAll('[data-command="toggle-presenter"]').forEach(button => button.addEventListener('click', () => sendCommand('toggle-presenter')));
  root.querySelector('[data-action="reset-slide-timer"]')?.addEventListener('click', () => {
    slideStarted = Date.now();
    updateTimer();
  });
}

function updateTimer() {
  const timer = document.querySelector('#timers');
  if (timer) timer.textContent = `${formatElapsed(Date.now() - slideStarted)} / ${formatElapsed(Date.now() - started)}`;
}

function renderPresenterState(payload) {
  if (!payload?.lesson || !payload?.course || !payload?.guide) return;
  latestPayload = payload;
  if (lastLesson !== payload.lesson.id) {
    lastLesson = payload.lesson.id;
    slideStarted = Date.now();
  }

  const guide = payload.guide;
  const position = payload.isCover
    ? ' · ÚVODNÍ OBRAZOVKA'
    : payload.isEnd
      ? ' · ZÁVĚREČNÁ OBRAZOVKA'
      : ` · ČÁST ${payload.lessonIndex + 1} / ${payload.course.totalLessons}`;
  const nextText = payload.isEnd
    ? 'Prezentace je u konce.'
    : payload.next
      ? `Další část: ${escapeHtml(payload.next.title)}`
      : 'Konec prezentace';
  const primaryButton = payload.isEnd
    ? '<button type="button" class="primary" data-command="toggle-presenter">Ukončit projekci</button>'
    : `<button type="button" class="primary" data-command="next" ${payload.next ? '' : 'disabled'}>Další →</button>`;

  root.innerHTML = `
    <header class="top">
      <div class="topline"><div><p class="eyebrow">KONZOLE ŠKOLITELE · ${escapeHtml(payload.course.code)}</p><strong>${escapeHtml(payload.course.title)}</strong></div><span>${payload.presenterMode ? 'PREZENTACE BĚŽÍ' : 'PŘÍPRAVNÝ REŽIM'}</span></div>
      <p class="screen-note"><b>Důležité:</b> projektor nastavte ve Windows na „Rozšířit“, nikoli „Duplikovat“. Toto okno ponechte na displeji notebooku.</p>
    </header>
    <section class="metrics">
      <div class="metric"><strong>${payload.course.duration} min</strong><span>celé školení</span></div>
      <div class="metric"><strong>${payload.lesson.duration} min</strong><span>tato část</span></div>
      <div class="metric"><strong class="timer" id="timers">00:00</strong><span>čas části / celkem</span></div>
    </section>
    <section class="slide"><small>${escapeHtml(payload.lesson.kicker)}${position}</small><h1>${escapeHtml(payload.lesson.title)}</h1><p>${escapeHtml(payload.lesson.summary)}</p></section>
    <div class="guide">
      <p class="guide-note"><strong>Jdi shora dolů, ale nemluv podle papíru.</strong> První karta nabízí možné formulace; ostatní body jsou jen opěrné body pro živé vedení.</p>
      <div class="flow">
        ${renderStep('1', 'ROZJEZD', 'Začni jednou přirozenou větou', 'say', renderSpoken(guide.say))}
        ${renderStep('2', 'CO MUSÍ ZAZNÍT', 'Drž se dvou nebo tří bodů', 'explain', renderList(guide.explain))}
        ${renderStep('3', 'PŘÍKLAD NEBO UKÁZKA', 'Ukaž konkrétní dopad', 'demo', renderList(guide.demo))}
        ${renderStep('4', 'ZAPOJENÍ SKUPINY', 'Polož jednu otázku a počkej', 'ask', `${renderList(guide.ask)}<div class="expected"><small>Kam odpovědi vrátit</small>${renderList(guide.expected)}</div>`)}
        ${renderStep('5', 'KAM DÁL', 'Uzavři, nebo rovnou přepni', 'transition', renderSpoken(guide.transition))}
      </div>
      <p class="support-title">RYCHLÁ OPORA · POUŽIJ JEN PODLE SITUACE</p>
      <div class="support">
        <section class="card method"><strong>Metodický tip</strong>${renderList(guide.facilitation)}</section>
        <section class="card caution"><strong>Na co si dát pozor</strong>${renderList(guide.caution)}</section>
        <section class="card shortcut"><strong>Když nestíháš</strong>${renderList(guide.shortcut)}</section>
        <section class="card fallback"><strong>Když selže technika</strong>${renderList(guide.fallback)}</section>
        <section class="card timing"><strong>Časování</strong><p>${escapeHtml(guide.timing)}</p><small>${escapeHtml(guide.position)}</small></section>
      </div>
    </div>
    <p class="next-preview">${nextText}</p>
    <footer class="controls">
      <button type="button" data-command="previous" ${payload.previous ? '' : 'disabled'}>← Předchozí</button>
      ${primaryButton}
      <button type="button" data-command="toggle-presenter">${payload.presenterMode ? 'Ukončit projekci' : 'Spustit projekci'}</button>
      <button type="button" data-action="reset-slide-timer">Vynulovat čas části</button>
    </footer>`;

  bindControls();
  updateTimer();
}

window.renderPresenterState = renderPresenterState;
channel?.addEventListener('message', event => {
  if (event.data?.type === 'state') renderPresenterState(event.data.payload);
});

if (!sessionId) {
  root.innerHTML = '<p class="error">Konzole nemá identifikátor relace. Zavřete ji a otevřete znovu z AI Akademie.</p>';
} else {
  sendCommand('request-state');
  setTimeout(() => {
    if (!latestPayload) sendCommand('request-state');
  }, 400);
}

setInterval(updateTimer, 1000);
