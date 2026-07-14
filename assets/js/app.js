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
let deferredInstallPrompt = null;

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
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
};

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

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
  const progress = overallProgress();
  return `
    <header class="site-header ${presenterMode ? 'is-presenting' : ''}">
      <a class="brand" href="#/" aria-label="AI Studio GHRAB Akademie — domů">
        <span class="brand-mark"><img src="./assets/brand/brand-mark.svg" alt="" width="46" height="46"></span>
        <span class="brand-copy"><strong>AI Studio <em>GHRAB</em></strong><small>Akademie · interaktivní školení</small></span>
      </a>
      <nav class="top-nav" aria-label="Hlavní navigace">
        <a href="#/" class="${currentPage === 'home' ? 'active' : ''}">${icons.home}<span>Přehled</span></a>
        <button type="button" data-action="toggle-trainer" class="${state.trainerMode ? 'active' : ''}" aria-pressed="${state.trainerMode}">${icons.notes}<span>Poznámky školitele</span></button>
        <button type="button" data-action="fullscreen">${icons.expand}<span>Celá obrazovka</span></button>
      </nav>
      <div class="header-progress" title="Celkový průběh">
        <span>${progress.percent}%</span>
        <div class="mini-progress"><i style="width:${progress.percent}%"></i></div>
      </div>
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
        <span><strong>AI Studio GHRAB · Akademie</strong><small>Modulární vzdělávací portál · verze 1.0.1</small></span>
      </div>
      <div class="footer-actions">
        <button type="button" data-action="install" class="text-button" ${deferredInstallPrompt ? '' : 'hidden'}>Nainstalovat aplikaci</button>
        <button type="button" data-action="reset-progress" class="text-button danger-text">Smazat můj postup</button>
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
  const overall = overallProgress();
  const completeCourses = courses.filter(course => courseProgress(course).percent === 100).length;

  const content = `
    <section class="academy-hero shell-wide">
      <div class="hero-copy">
        <p class="eyebrow">UČITELÉ · PRAXE · BEZPEČNOST · NÁVAZNOST</p>
        <h1>Školení, která tvoří <span>jeden systém.</span></h1>
        <p class="hero-lead">Od prvního bezpečného přihlášení přes Diferenciátor až po interaktivní testy, výukové hry, komunikaci, hodnocení a správu projektu. Každý modul má vlastní cíl, praktický výstup a jasnou návaznost.</p>
        <div class="hero-actions">
          <a class="button primary" href="#/course/start/orientation">Začít společným základem ${icons.arrowRight}</a>
          <a class="button secondary" href="#courses">Prohlédnout všechna školení</a>
        </div>
        <div class="hero-metrics">
          <div><strong>${courses.length}</strong><span>modulárních školení</span></div>
          <div><strong>${courses.reduce((sum, course) => sum + course.lessons.length, 0)}</strong><span>interaktivních lekcí</span></div>
          <div><strong>${Math.round(courses.reduce((sum, course) => sum + course.duration, 0) / 60)} h</strong><span>kompletní vzdělávací cesty</span></div>
        </div>
      </div>
      <div class="academy-portal" aria-hidden="true">
        <div class="portal-glow"></div>
        <div class="portal-ring ring-one"></div>
        <div class="portal-ring ring-two"></div>
        <div class="portal-ring ring-three"></div>
        <img src="./assets/brand/portal-gateway.png" alt="">
        <div class="portal-core"><span>${overall.percent}%</span><small>celkový postup</small></div>
        <div class="orbit-label orbit-label-a">START</div>
        <div class="orbit-label orbit-label-b">PRAXE</div>
        <div class="orbit-label orbit-label-c">APLIKACE</div>
      </div>
    </section>

    <section class="dashboard-strip shell-wide" aria-label="Můj postup">
      <article class="progress-summary panel-glass">
        <div class="progress-ring" style="--progress:${overall.percent * 3.6}deg"><span>${overall.percent}%</span></div>
        <div><p class="eyebrow">MOJE CESTA</p><h2>${overall.completed} z ${overall.total} lekcí dokončeno</h2><p>Postup se ukládá pouze v tomto prohlížeči. Můžete se kdykoliv vrátit přesně tam, kde jste skončili.</p></div>
      </article>
      <article class="dashboard-number panel-glass"><strong>${completeCourses}</strong><span>dokončených školení</span></article>
      <article class="dashboard-number panel-glass"><strong>${courses.filter(course => course.required).length}</strong><span>společné základní moduly</span></article>
    </section>

    ${renderLearningMap()}

    <section id="courses" class="courses-section shell-wide">
      <div class="section-heading">
        <div><p class="eyebrow">KATALOG ŠKOLENÍ</p><h2>Vyberte si další praktický krok.</h2></div>
        <p>Ne každý musí absolvovat všechno. Povinný je společný základ; další větve se vybírají podle předmětu, role a skutečné potřeby.</p>
      </div>
      <div class="course-tools panel-glass">
        <label class="search-box">${icons.search}<input id="course-search" type="search" placeholder="Hledat školení, aplikaci nebo kód…" value="${escapeHtml(searchTerm)}"></label>
        <div class="filter-chips" role="group" aria-label="Filtr kategorií">
          ${categories.map(category => `<button type="button" data-category="${escapeHtml(category)}" class="${activeCategory === category ? 'active' : ''}">${escapeHtml(category)}</button>`).join('')}
        </div>
      </div>
      <div class="course-grid">
        ${filtered.length ? filtered.map(renderCourseCard).join('') : '<div class="empty-state"><h3>Žádné školení neodpovídá filtru.</h3><p>Zkuste jiný výraz nebo zrušte filtr kategorií.</p></div>'}
      </div>
    </section>
  `;

  app.innerHTML = shell(content, 'home');
}

function renderLearningMap() {
  const status = id => courseProgress(courseMap.get(id)).percent;
  return `
    <section class="learning-map shell-wide">
      <div class="section-heading compact">
        <div><p class="eyebrow">LOGICKÁ NÁVAZNOST</p><h2>Jedno společné jádro, několik cílených větví.</h2></div>
      </div>
      <div class="map-stage panel-glass">
        <div class="map-core">
          ${mapNode('start', '1', 'Bezpečný start', status('start'), 'core')}
          <span class="map-arrow">→</span>
          ${mapNode('differentiator', '2', 'Diferenciátor', status('differentiator'), 'core')}
        </div>
        <div class="map-branches">
          <article class="map-branch interactive">
            <header><span>VĚTEV A</span><strong>Interaktivní materiály</strong></header>
            <div>${mapNode('github', '3A', 'GitHub', status('github'))}<span>→</span>${mapNode('generator', '4A', 'Generátor', status('generator'))}<span>nebo</span>${mapNode('ludus', '4B', 'LUDUS', status('ludus'))}</div>
          </article>
          <article class="map-branch communication">
            <header><span>VĚTEV B</span><strong>Komunikace</strong></header>
            <div>${mapNode('correspondence', '3B', 'Korespondence', status('correspondence'))}</div>
          </article>
          <article class="map-branch evaluation">
            <header><span>VĚTEV C</span><strong>Hodnocení</strong></header>
            <div>${mapNode('evaluator', '3C', 'Hodnotitel', status('evaluator'))}</div>
          </article>
        </div>
        <div class="map-advanced">
          ${mapNode('workflow', '5', 'Propojený workflow', status('workflow'), 'advanced')}
          <span class="map-arrow">→</span>
          ${mapNode('administrator', '6', 'Mentor a správce', status('administrator'), 'advanced')}
        </div>
      </div>
    </section>
  `;
}

function mapNode(id, number, label, progress, className = '') {
  return `<a class="map-node ${className}" href="#/course/${id}"><small>${number}</small><strong>${escapeHtml(label)}</strong><i><b style="width:${progress}%"></b></i><span>${progress}%</span></a>`;
}

function renderCourseCard(course) {
  const progress = courseProgress(course);
  const prerequisites = prerequisiteStatus(course);
  const lessonWord = course.lessons.length === 1 ? 'lekce' : course.lessons.length < 5 ? 'lekce' : 'lekcí';
  return `
    <article class="course-card" style="--course-accent:${course.accent}">
      <div class="course-card-top">
        <div class="course-icon"><img src="${course.icon}" alt=""></div>
        <div class="course-badges">
          ${course.required ? '<span class="badge required">Společný základ</span>' : '<span class="badge optional">Volitelné</span>'}
          <span class="badge">${escapeHtml(course.code)}</span>
        </div>
      </div>
      <p class="course-category">${escapeHtml(course.category)}</p>
      <h3>${escapeHtml(course.title)}</h3>
      <p class="course-subtitle">${escapeHtml(course.subtitle)}</p>
      <div class="course-meta">
        <span>${icons.clock}${course.duration} min</span>
        <span>${course.lessons.length} ${lessonWord}</span>
        <span>${escapeHtml(course.level)}</span>
      </div>
      <div class="course-progress-row"><span>${progress.percent ? `${progress.percent}% dokončeno` : 'Nezahájeno'}</span><strong>${progress.completed}/${progress.total}</strong></div>
      <div class="course-progress"><i style="width:${progress.percent}%"></i></div>
      ${prerequisites.ready ? '' : `<p class="prerequisite-note">Doporučený předpoklad: ${prerequisites.missing.map(id => escapeHtml(courseMap.get(id)?.shortTitle || id)).join(', ')}</p>`}
      <a class="course-open" href="#/course/${course.id}/${course.lessons[0].id}">${progress.percent ? 'Pokračovat' : 'Otevřít školení'} ${icons.arrowRight}</a>
    </article>
  `;
}

function renderCourse(courseId, lessonId) {
  const course = courseMap.get(courseId);
  if (!course) {
    navigate('/');
    return;
  }

  let lessonIndex = Math.max(0, course.lessons.findIndex(lesson => lesson.id === lessonId));
  if (lessonIndex < 0) lessonIndex = 0;
  const lesson = course.lessons[lessonIndex];
  const progress = courseProgress(course);
  const prerequisite = prerequisiteStatus(course);
  state.lastCourse = course.id;
  state.lastLesson = lesson.id;
  saveState(state);

  document.body.classList.toggle('presenter-mode', presenterMode);
  const content = `
    <section class="course-hero shell-wide" style="--course-accent:${course.accent}">
      <a class="back-link" href="#/">${icons.arrowLeft} Zpět na rozcestník</a>
      <div class="course-hero-grid">
        <div class="course-hero-icon"><img src="${course.icon}" alt=""></div>
        <div>
          <div class="course-title-row"><span>${escapeHtml(course.code)}</span><span>${course.required ? 'společný základ' : 'volitelný modul'}</span><span>${escapeHtml(course.level)}</span></div>
          <h1>${escapeHtml(course.title)}</h1>
          <p>${escapeHtml(course.subtitle)}</p>
        </div>
        <div class="course-hero-progress"><strong>${progress.percent}%</strong><span>${progress.completed} z ${progress.total} lekcí</span><div><i style="width:${progress.percent}%"></i></div></div>
      </div>
      ${prerequisite.ready ? '' : `<div class="course-warning">Doporučené předpoklady zatím nejsou dokončené: ${prerequisite.missing.map(id => `<a href="#/course/${id}">${escapeHtml(courseMap.get(id)?.title || id)}</a>`).join(', ')}. Modul lze přesto otevřít.</div>`}
    </section>

    <section class="course-workspace shell-wide">
      <aside class="course-sidebar">
        <div class="sidebar-panel panel-glass">
          <p class="eyebrow">OBSAH ŠKOLENÍ</p>
          <nav class="lesson-nav" aria-label="Lekce školení">
            ${course.lessons.map((item, index) => {
              const done = completedLesson(course.id, item.id);
              const active = index === lessonIndex;
              return `<a href="#/course/${course.id}/${item.id}" class="${active ? 'active' : ''} ${done ? 'done' : ''}"><span>${done ? icons.check : String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(item.title)}</strong><small>${item.duration} min</small></span></a>`;
            }).join('')}
          </nav>
        </div>
        <div class="sidebar-panel outcomes panel-glass">
          <p class="eyebrow">VÝSTUPY MODULU</p>
          <ul>${course.outcomes.map(outcome => `<li>${icons.check}${escapeHtml(outcome)}</li>`).join('')}</ul>
        </div>
      </aside>

      <article class="lesson-stage panel-glass" data-course="${course.id}" data-lesson="${lesson.id}">
        <div class="lesson-toolbar">
          <div><span>Lekce ${lessonIndex + 1} / ${course.lessons.length}</span><strong>${escapeHtml(lesson.duration)} min</strong></div>
          <div>
            <button type="button" class="icon-control ${state.trainerMode ? 'active' : ''}" data-action="toggle-trainer" title="Poznámky školitele">${icons.notes}</button>
            <button type="button" class="icon-control ${presenterMode ? 'active' : ''}" data-action="toggle-presenter" title="Prezentační režim">${icons.present}</button>
            <button type="button" class="icon-control" data-action="copy-link" title="Kopírovat odkaz na lekci">${icons.copy}</button>
            <button type="button" class="icon-control" data-action="fullscreen" title="Celá obrazovka">${icons.expand}</button>
          </div>
        </div>
        <header class="lesson-header">
          <p class="eyebrow">${escapeHtml(lesson.kicker)}</p>
          <h2>${escapeHtml(lesson.title)}</h2>
          <p>${escapeHtml(lesson.summary)}</p>
        </header>
        ${state.trainerMode && lesson.trainerNote ? `<aside class="trainer-note"><span>${icons.notes}</span><div><strong>Poznámka školitele</strong><p>${escapeHtml(lesson.trainerNote)}</p></div></aside>` : ''}
        <div class="lesson-content">
          ${lesson.blocks.map((block, index) => renderBlock(block, course, lesson, index)).join('')}
        </div>
        <div class="lesson-completion ${completedLesson(course.id, lesson.id) ? 'done' : ''}">
          <div><span>${completedLesson(course.id, lesson.id) ? icons.check : String(lessonIndex + 1).padStart(2, '0')}</span><div><strong>${completedLesson(course.id, lesson.id) ? 'Lekce je dokončena' : 'Dokončili jste tuto lekci?'}</strong><p>Označení se uloží pouze v tomto prohlížeči.</p></div></div>
          <button type="button" class="button ${completedLesson(course.id, lesson.id) ? 'secondary' : 'primary'}" data-action="mark-complete">${completedLesson(course.id, lesson.id) ? 'Označit jako nedokončenou' : 'Dokončit lekci'}</button>
        </div>
        <nav class="lesson-controls" aria-label="Navigace mezi lekcemi">
          <button type="button" data-action="previous-lesson" ${lessonIndex === 0 ? 'disabled' : ''}>${icons.arrowLeft}<span><small>Předchozí</small><strong>${lessonIndex > 0 ? escapeHtml(course.lessons[lessonIndex - 1].title) : 'Začátek modulu'}</strong></span></button>
          <button type="button" data-action="next-lesson" ${lessonIndex === course.lessons.length - 1 ? 'disabled' : ''}><span><small>Další</small><strong>${lessonIndex < course.lessons.length - 1 ? escapeHtml(course.lessons[lessonIndex + 1].title) : 'Konec modulu'}</strong></span>${icons.arrowRight}</button>
        </nav>
      </article>
    </section>
  `;

  app.innerHTML = shell(content, 'course');
  if (!presenterMode) window.scrollTo({ top: 0, behavior: 'instant' });
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
      state.trainerMode = !state.trainerMode;
      saveState(state);
      render();
      return;
    }
    if (action === 'fullscreen') {
      toggleFullscreen();
      return;
    }
    if (action === 'toggle-presenter') {
      presenterMode = !presenterMode;
      document.body.classList.toggle('presenter-mode', presenterMode);
      render();
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
    if (action === 'next-lesson' && context && context.lessonIndex < context.course.lessons.length - 1) {
      const next = context.course.lessons[context.lessonIndex + 1];
      navigate(`/course/${context.course.id}/${next.id}`);
      return;
    }
    if (action === 'previous-lesson' && context && context.lessonIndex > 0) {
      const previous = context.course.lessons[context.lessonIndex - 1];
      navigate(`/course/${context.course.id}/${previous.id}`);
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
  if (event.key === 'ArrowRight' && context.lessonIndex < context.course.lessons.length - 1) {
    navigate(`/course/${context.course.id}/${context.course.lessons[context.lessonIndex + 1].id}`);
  }
  if (event.key === 'ArrowLeft' && context.lessonIndex > 0) {
    navigate(`/course/${context.course.id}/${context.course.lessons[context.lessonIndex - 1].id}`);
  }
  if (event.key.toLowerCase() === 'f') toggleFullscreen();
  if (event.key.toLowerCase() === 'p') {
    presenterMode = !presenterMode;
    render();
  }
  if (event.key.toLowerCase() === 'n') {
    state.trainerMode = !state.trainerMode;
    saveState(state);
    render();
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
}

app.addEventListener('click', handleClick);
app.addEventListener('input', handleInput);
app.addEventListener('change', handleChange);
addEventListener('hashchange', render);
addEventListener('keydown', handleKeyboard);
addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  render();
});
addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  toast('Akademie byla nainstalována.');
});

startStarfield(document.querySelector('#starfield'));

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

render();
