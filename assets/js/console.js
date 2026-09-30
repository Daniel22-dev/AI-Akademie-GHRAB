const root = document.querySelector('#root');
const hasTrustedOpener = (() => {
  try { return !!window.opener && window.opener.location.origin === location.origin; } catch { return false; }
})();
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
    }
  } catch {}
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

function ensurePreviewSurface(host) {
  if (host.shadowRoot) return host.shadowRoot;
  const shadow = host.attachShadow({ mode: 'open' });
  const appStyles = document.createElement('link');
  appStyles.rel = 'stylesheet';
  appStyles.href = './assets/css/styles.css';
  const previewStyles = document.createElement('style');
  previewStyles.textContent = `
    :host { display:block; position:relative; overflow:hidden; border-radius:12px; background:#020713; }
    .projection-mirror {
      position:absolute; top:0; left:0; overflow:hidden; transform-origin:top left;
      color-scheme:dark;
      --bg:#020713; --bg-soft:#061321; --panel:rgba(5,18,33,.82); --panel-strong:rgba(7,23,41,.94);
      --panel-light:rgba(255,255,255,.055); --text:#edf8ff; --soft:#c7dce9; --muted:#88a4b8;
      --cyan:#50e8ff; --cyan-2:#8db7ff; --purple:#a877ff; --green:#59e0a5; --gold:#f0aa4b; --red:#ff8f9a;
      --line:rgba(128,207,255,.17); --line-strong:rgba(128,207,255,.32); --shadow:0 28px 90px rgba(0,0,0,.42);
      --radius:24px; --radius-sm:15px; --header-height:76px; --max:1460px;
      font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      background:#020713;
    }
    .projection-mirror .lesson-stage { margin:0 !important; }
    .projection-mirror a, .projection-mirror button, .projection-mirror input,
    .projection-mirror select, .projection-mirror textarea, .projection-mirror [contenteditable] {
      pointer-events:none !important;
    }
  `;
  const mirror = document.createElement('div');
  mirror.className = 'projection-mirror presenter-mode';
  mirror.setAttribute('aria-hidden', 'true');
  shadow.append(appStyles, previewStyles, mirror);
  return shadow;
}

function renderSlidePreview(preview, presenterMode) {
  const host = root.querySelector('[data-live-slide-preview]');
  const status = root.querySelector('[data-preview-status]');
  if (!host || !preview?.html) {
    if (status) status.textContent = 'NÁHLED NENÍ K DISPOZICI';
    return;
  }
  const width = Math.max(1, Number(preview.width) || 1600);
  const height = Math.max(1, Number(preview.height) || 900);
  const availableWidth = Math.max(1, host.clientWidth || host.getBoundingClientRect().width || 640);
  const scale = Math.min(1, availableWidth / width);
  host.style.height = `${Math.max(220, Math.round(height * scale))}px`;

  const shadow = ensurePreviewSurface(host);
  const mirror = shadow.querySelector('.projection-mirror');
  mirror.style.width = `${width}px`;
  mirror.style.height = `${height}px`;
  mirror.style.transform = `scale(${scale})`;
  mirror.innerHTML = preview.html;

  if (status) status.textContent = `${presenterMode ? 'ŽIVĚ' : 'PŘÍPRAVNÝ NÁHLED'} · ${width}×${height}`;
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
    <section class="presenter-workspace">
      <aside class="visual-column">
        <section class="preview-card">
          <div class="preview-heading"><div><small>PROJEKTOR</small><strong>Náhled aktuálního slidu</strong></div><span class="preview-status" data-preview-status>NAČÍTÁM…</span></div>
          <div class="live-slide-preview" data-live-slide-preview aria-hidden="true"></div>
        </section>
        <section class="slide-context">
          <small>${escapeHtml(payload.lesson.kicker)}${position}</small>
          <h1>${escapeHtml(payload.lesson.title)}</h1>
          <p>${escapeHtml(payload.lesson.summary)}</p>
        </section>
        <p class="next-preview">${nextText}</p>
      </aside>
      <section class="notes-column">
        <div class="guide">
          <p class="guide-note"><strong>Jdi shora dolů, ale nemluv podle papíru.</strong> Náhled vlevo je to, co právě vidí publikum; poznámky vpravo jsou jen tvoje opora.</p>
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
      </section>
    </section>
    <footer class="controls">
      <button type="button" data-command="previous" ${payload.previous ? '' : 'disabled'}>← Předchozí</button>
      ${primaryButton}
      <button type="button" data-command="toggle-presenter">${payload.presenterMode ? 'Ukončit projekci' : 'Spustit projekci'}</button>
      <button type="button" data-action="reset-slide-timer">Vynulovat čas části</button>
    </footer>`;

  bindControls();
  updateTimer();
  requestAnimationFrame(() => renderSlidePreview(payload.preview, payload.presenterMode));
}

window.renderPresenterState = renderPresenterState;
if (!hasTrustedOpener || typeof window.opener.__ghrabPresenterCommand !== 'function') {
  root.innerHTML = '<p class="error">Konzole musí být otevřena přímo z AI Akademie. Zavřete ji a otevřete znovu tlačítkem Konzole školitele.</p>';
} else {
  sendCommand('request-state');
  setTimeout(() => {
    if (!latestPayload) sendCommand('request-state');
  }, 400);
}

addEventListener('resize', () => {
  if (latestPayload?.preview) requestAnimationFrame(() => renderSlidePreview(latestPayload.preview, latestPayload.presenterMode));
});
setInterval(updateTimer, 1000);
