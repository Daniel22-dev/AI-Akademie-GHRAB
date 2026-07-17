import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { courses } from '../courses/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const execFileAsync = promisify(execFile);
const errors = [];
const warnings = [];
const requiredFiles = [
  'index.html', 'manifest.webmanifest', 'sw.js', 'assets/css/styles.css',
  'assets/js/app.js', 'assets/js/console.js', 'assets/js/storage.js', 'assets/js/changelog.js', 'assets/js/starfield.js', 'courses/index.js',
  'courses/speaker-notes.js', 'courses/presentation-enhancements.js', 'console.html',
  'README.md', 'NAHRANI-NA-GITHUB.md'
];
const allowedBlocks = new Set([
  'lead', 'cards', 'flow', 'comparison', 'steps', 'callout', 'checklist',
  'activity', 'quiz', 'table', 'code', 'quote', 'statement', 'showcase',
  'decision', 'mission'
]);

for (const file of requiredFiles) {
  try { await fs.access(path.join(root, file)); }
  catch { errors.push(`Chybí povinný soubor: ${file}`); }
}

const ids = new Set();
const codes = new Set();
let lessonCount = 0;
let visualBlockCount = 0;
const spokenOpenings = new Map();
const noteText = [];
const lessonTitles = new Set();
for (const course of courses) {
  if (!course.id || ids.has(course.id)) errors.push(`Neplatné nebo duplicitní ID kurzu: ${course.id}`);
  ids.add(course.id);
  if (!course.code || codes.has(course.code)) errors.push(`Neplatný nebo duplicitní kód kurzu: ${course.code}`);
  codes.add(course.code);
  if (!Array.isArray(course.lessons) || course.lessons.length === 0) errors.push(`Kurz ${course.id} nemá lekce.`);
  if (!Number.isInteger(course.minimumLessons) || course.minimumLessons < 1 || course.minimumLessons > course.lessons.length) {
    errors.push(`Kurz ${course.id} nemá platně určenou základní cestu.`);
  }

  const contentMinutes = (course.lessons || []).reduce((sum, lesson) => sum + Number(lesson.duration || 0), 0);
  const reserve = Number(course.reserve || 0);
  if (!Number.isFinite(reserve) || reserve < 0) errors.push(`Kurz ${course.id} má neplatnou časovou rezervu.`);
  if (Number(course.duration) !== contentMinutes + reserve) {
    errors.push(`Čas kurzu ${course.id} nesedí: uvedeno ${course.duration}, obsah ${contentMinutes}, rezerva ${reserve}.`);
  }

  const lessonIds = new Set();
  for (const lesson of course.lessons || []) {
    lessonCount += 1;
    lessonTitles.add(lesson.title);
    if (!lesson.id || lessonIds.has(lesson.id)) errors.push(`Kurz ${course.id} má duplicitní ID lekce: ${lesson.id}`);
    lessonIds.add(lesson.id);
    if (!lesson.title || !lesson.summary || !Array.isArray(lesson.blocks)) errors.push(`Neúplná lekce ${course.id}/${lesson.id}`);
    if (!Number.isFinite(Number(lesson.duration)) || Number(lesson.duration) <= 0) errors.push(`Lekce ${course.id}/${lesson.id} má neplatný čas.`);
    if (!lesson.trainerNote) warnings.push(`Lekce ${course.id}/${lesson.id} nemá metodickou poznámku.`);
    const notes = lesson.speakerNotes || {};
    for (const field of ['say', 'explain', 'ask', 'expected', 'demo', 'facilitation', 'caution', 'transition', 'fallback']) {
      if (!Array.isArray(notes[field]) || notes[field].length === 0) errors.push(`Lekce ${course.id}/${lesson.id} nemá připravenou část poznámek: ${field}.`);
      for (const line of notes[field] || []) noteText.push({ key: `${course.id}/${lesson.id}`, field, line: String(line) });
    }
    for (const line of notes.say || []) {
      const opening = String(line).toLocaleLowerCase('cs').replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter(Boolean).slice(0, 4).join(' ');
      if (opening) spokenOpenings.set(opening, [...(spokenOpenings.get(opening) || []), `${course.id}/${lesson.id}`]);
    }
    if (!notes.timing) errors.push(`Lekce ${course.id}/${lesson.id} nemá časovací scénář.`);

    lesson.blocks.forEach((block, blockIndex) => {
      if (!allowedBlocks.has(block.type)) errors.push(`Neznámý blok ${block.type} v ${course.id}/${lesson.id}.`);
      if (['statement', 'showcase', 'decision', 'mission'].includes(block.type)) visualBlockCount += 1;
      if (block.type === 'quiz') {
        if (!Array.isArray(block.options) || block.options.length < 2) errors.push(`Kvíz ${course.id}/${lesson.id}/${blockIndex} nemá dost možností.`);
        if (!Number.isInteger(block.answer) || block.answer < 0 || block.answer >= block.options.length) errors.push(`Kvíz ${course.id}/${lesson.id}/${blockIndex} má neplatnou správnou odpověď.`);
        if (!block.explanation) errors.push(`Kvíz ${course.id}/${lesson.id}/${blockIndex} nemá vysvětlení.`);
      }
      if (block.type === 'showcase') {
        if (!block.before?.items?.length || !block.after?.items?.length) errors.push(`Ukázka ${course.id}/${lesson.id}/${blockIndex} nemá obě strany.`);
      }
    });
  }

  const finalLesson = course.lessons.at(-1);
  if (!finalLesson?.blocks.some(block => block.type === 'mission')) errors.push(`Kurz ${course.id} nekončí přenosem do praxe.`);

  for (const prerequisite of course.prerequisites || []) {
    if (!courses.some(item => item.id === prerequisite)) errors.push(`Kurz ${course.id} odkazuje na neexistující předpoklad ${prerequisite}`);
    if (prerequisite === course.id) errors.push(`Kurz ${course.id} odkazuje sám na sebe.`);
  }

  if (course.icon) {
    const localIcon = course.icon.replace(/^\.\//, '');
    try { await fs.access(path.join(root, localIcon)); }
    catch { errors.push(`Kurz ${course.id} odkazuje na chybějící ikonu ${course.icon}`); }
  }

  const exportPath = path.join(root, 'exports', `${course.id}.html`);
  try {
    const exported = await fs.readFile(exportPath, 'utf8');
    if (!exported.includes('Interaktivní materiál pro účastníky')) errors.push(`Export ${course.id}.html nemá označení pro účastníky.`);
    if (!exported.includes('min celkem')) errors.push(`Export ${course.id}.html nezobrazuje celkový čas prezentace.`);
    if (!exported.includes('id="print-root"')) errors.push(`Export ${course.id}.html nemá režim tisku celé prezentace.`);
    if (!exported.includes('data-reset-quiz')) errors.push(`Export ${course.id}.html nemá možnost opakovat kvíz.`);
    if (!exported.includes('localStorage')) errors.push(`Export ${course.id}.html neukládá stav aktivit.`);
    if (!exported.includes('min-height:44px')) errors.push(`Export ${course.id}.html nemá minimální dotykovou výšku.`);
    if (!exported.includes('Základní cesta')) errors.push(`Export ${course.id}.html nerozlišuje základní a rozšiřující cestu.`);
    if (!exported.includes('Konec prezentace') || !exported.includes('Děkuji za pozornost.')) errors.push(`Export ${course.id}.html nemá závěrečnou obrazovku.`);
    if (!exported.includes('data-action=\"exit-fullscreen\"') || !exported.includes('data-action=\"restart\"')) errors.push(`Export ${course.id}.html nemá bezpečné ukončení a nové spuštění.`);
    if (exported.includes('Poznámka řečníka') || exported.includes('trainerNote') || exported.includes('speakerNotes') || exported.includes('Konzole školitele')) {
      errors.push(`Export ${course.id}.html obsahuje interní informace školitele.`);
    }
    if (!exported.includes('<script>\nconst course=')) errors.push(`Export ${course.id}.html nemá spustitelný skript.`);
  } catch {
    errors.push(`Chybí samostatný export prezentace: exports/${course.id}.html`);
  }
}

const bannedSpeakerPhrases = [
  'Teď se podíváme',
  'Na konci této části by mělo být jasné',
  'Za mě je hlavní pointa',
  'Kdyby vám z této části měla zůstat',
  'Nechci, abychom si odnesli deset detailů',
  'To podstatné bych shrnul takto'
];
for (const phrase of bannedSpeakerPhrases) {
  const hits = noteText.filter(item => item.line.includes(phrase));
  if (hits.length) errors.push(`Do poznámek se vrátila šablonová věta „${phrase}“ (${hits.map(item => item.key).join(', ')}).`);
}
for (const [opening, lessons] of spokenOpenings) {
  if (lessons.length > 1) errors.push(`Mluvené formulace opakují stejný začátek „${opening}“ v: ${lessons.join(', ')}.`);
}
const formalDirective = /\b(?:Nechte|Ukažte|Použijte|Projděte|Zdůrazněte|Nehodnoťte|Přepracujte|Porovnejte|Ověřte|Připravte|Vysvětlete|Požádejte|Zvolte|Vyberte|Nastavte)\b/;
const formalHits = noteText.filter(item => ['say', 'ask', 'expected', 'demo', 'facilitation', 'fallback'].includes(item.field) && formalDirective.test(item.line));
if (formalHits.length) errors.push(`Interní poznámky míchají formální množné oslovení s osobní oporou: ${formalHits.map(item => `${item.key}/${item.field}`).join(', ')}.`);
for (const item of noteText.filter(entry => entry.field === 'transition')) {
  for (const match of item.line.matchAll(/otevři „([^“]+)“/g)) {
    if (!lessonTitles.has(match[1])) errors.push(`Poznámka ${item.key} odkazuje na neexistující lekci „${match[1]}“.`);
  }
}

try {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ghrab-notes-'));
  const tempNotes = path.join(tempDir, 'speaker-notes.js');
  await execFileAsync(process.execPath, [path.join(root, 'scripts/build-speaker-notes.mjs'), '--output', tempNotes], { cwd: root });
  const [generatedNotes, committedNotes] = await Promise.all([
    fs.readFile(tempNotes, 'utf8'),
    fs.readFile(path.join(root, 'courses/speaker-notes.js'), 'utf8')
  ]);
  if (generatedNotes !== committedNotes) errors.push('courses/speaker-notes.js není synchronní se zdrojem. Spusťte npm run build:notes.');
  await fs.rm(tempDir, { recursive: true, force: true });
} catch (error) {
  errors.push(`Nepodařilo se ověřit synchronizaci poznámek: ${error.message}`);
}

if (visualBlockCount < courses.length) errors.push('Akademie nemá dostatek výrazných vizuálních bloků napříč kurzy.');

const sw = await fs.readFile(path.join(root, 'sw.js'), 'utf8');
const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
if (!sw.includes(`ghrab-academy-v${pkg.version}`)) errors.push('Verze cache v sw.js neodpovídá package.json.');
if (!sw.includes("event.request.mode === 'navigate'")) errors.push('Service worker nerozlišuje navigaci od chybějících assetů.');
if (sw.includes("catch(() => caches.match('./index.html'))")) errors.push('Service worker stále maskuje chyby assetů hlavní stránkou.');
if (sw.includes('reloadOpenWindows')) errors.push('Service worker stále automaticky obnovuje otevřená okna.');
if (sw.includes('precacheFreshFiles().then(() => self.skipWaiting())')) errors.push('Service worker stále aktivuje aktualizaci bez souhlasu uživatele.');
if (!sw.includes("event.data?.type === 'SKIP_WAITING'")) errors.push('Service worker nemá řízenou aktivaci čekající aktualizace.');
const skipWaitingCalls = (sw.match(/self\.skipWaiting\(\)/g) || []).length;
if (skipWaitingCalls !== 1) errors.push(`Service worker musí volat skipWaiting právě jednou a jen po zprávě uživatele; nalezeno ${skipWaitingCalls}.`);
const cachedPaths = [...sw.matchAll(/^\s*'(.+?)',?$/gm)].map(match => match[1]);
let precacheBytes = 0;
for (const cachedPath of cachedPaths) {
  const localPath = cachedPath === './' ? 'index.html' : cachedPath.replace(/^\.\//, '');
  try { precacheBytes += (await fs.stat(path.join(root, localPath))).size; }
  catch { errors.push(`Service worker odkazuje na chybějící soubor: ${cachedPath}`); }
}
if (precacheBytes >= 2 * 1024 * 1024) errors.push(`Precache je příliš velká: ${(precacheBytes / 1024 / 1024).toFixed(2)} MB (limit < 2 MB).`);
for (const cachedFile of [
  './console.html',
  './assets/js/console.js',
  './assets/js/changelog.js',
  './courses/presentation-enhancements.js',
  './courses/speaker-notes.js',
  ...courses.map(course => course.icon)
]) {
  if (!sw.includes(`'${cachedFile}'`)) errors.push(`Service worker neukládá důležitý soubor do offline cache: ${cachedFile}`);
}

const index = await fs.readFile(path.join(root, 'index.html'), 'utf8');
if (!index.includes('assets/js/app.js')) errors.push('index.html nenačítá hlavní modul aplikace.');
if (!index.includes('Content-Security-Policy')) errors.push('index.html neobsahuje Content-Security-Policy.');
if (!index.includes('AI Akademie GHRAB')) errors.push('index.html neobsahuje název AI Akademie GHRAB.');
if (index.includes('id="app" aria-live')) errors.push('Celý kořen aplikace stále používá aria-live.');
if (!index.includes('name="robots" content="noindex')) errors.push('index.html nemá zákaz indexování interní aplikace.');

const app = await fs.readFile(path.join(root, 'assets/js/app.js'), 'utf8');
if (!app.includes('fitPresenterSlide')) errors.push('Hlavní aplikace nemá automatické přizpůsobení slidu výšce projekce.');
if (!app.includes('presentationCover')) errors.push('Hlavní aplikace nemá úvodní prezentační obrazovky kurzů.');
if (app.includes("new BroadcastChannel('ghrab-academy-presenter-v1')")) errors.push('Konzole školitele stále používá společný kanál bez identifikátoru relace.');
if (!app.includes('presenterSessionId')) errors.push('Konzole školitele nemá oddělené relace.');
if (app.includes('document.write')) errors.push('Konzole školitele stále používá document.write.');
if (!app.includes("new URL('./console.html'")) errors.push('Hlavní aplikace neotevírá statickou konzoli školitele.');
if (!app.includes('if (!updateReloadRequested) return;')) errors.push('controllerchange není chráněn před automatickým reloadem.');
if (!app.includes('if (!pendingUpdateWorker || presenterMode) return;')) errors.push('Výzva k aktualizaci není odložená během prezentačního režimu.');
if (!app.includes('function createPresenterSessionId()') || !app.includes('try {\n    const stored = sessionStorage')) errors.push('Přístup k sessionStorage nemá bezpečný fallback.');
if (app.includes('renderLessonCompletion') || app.includes('completedLessons') || app.includes('overallProgress') || app.includes('courseProgress')) errors.push('Hlavní aplikace stále obsahuje osobní postup účastníka.');
if (!app.includes('renderPresentationEnd')) errors.push('Hlavní aplikace nemá závěrečnou prezentační obrazovku.');
if (!app.includes('exitPresenter')) errors.push('Hlavní aplikace nemá bezpečný návrat z prezentačního režimu.');
if (!app.includes('open-changelog') || !app.includes('CHANGELOG')) errors.push('Hlavní aplikace nemá dostupný changelog.');
if (!app.includes('course.minimumLessons')) errors.push('Hlavní aplikace nerozlišuje základní a rozšiřující cestu.');
const consoleHtml = await fs.readFile(path.join(root, 'console.html'), 'utf8');
const consoleJs = await fs.readFile(path.join(root, 'assets/js/console.js'), 'utf8');
if (!consoleHtml.includes('assets/js/console.js')) errors.push('console.html nenačítá externí console.js.');
if (consoleHtml.includes('onclick=')) errors.push('console.html obsahuje inline obsluhu událostí.');
if (!consoleJs.includes('addEventListener')) errors.push('console.js nepoužívá bezpečné event listenery.');
if (!consoleHtml.includes('name="robots" content="noindex')) errors.push('console.html nemá zákaz indexování.');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.webmanifest'), 'utf8'));
if (!manifest.id) errors.push('Manifest PWA nemá stabilní id.');
if (manifest.icons?.some(icon => String(icon.purpose).includes('any maskable'))) errors.push('Manifest stále kombinuje any a maskable v jedné ikoně.');
const notFound = await fs.readFile(path.join(root, '404.html'), 'utf8');
if (!notFound.includes("location.hostname.endsWith('.github.io')")) errors.push('404.html neumí odvodit kořen GitHub Pages projektu.');
if (!notFound.includes('name="robots" content="noindex')) errors.push('404.html nemá zákaz indexování.');
const storage = await fs.readFile(path.join(root, 'assets/js/storage.js'), 'utf8');
if (storage.includes('completedLessons')) errors.push('Místní úložiště stále eviduje osobní postup lekcemi.');
if (storage.includes('installedVersion')) errors.push('Místní úložiště stále obsahuje mrtvé installedVersion.');
const changelogSource = await fs.readFile(path.join(root, 'assets/js/changelog.js'), 'utf8');
const changelogModule = await import(new URL('../assets/js/changelog.js', import.meta.url));
if (changelogModule.APP_VERSION !== pkg.version) errors.push('Verze changelogu neodpovídá package.json.');
if (!Array.isArray(changelogModule.CHANGELOG) || changelogModule.CHANGELOG.length !== 10) errors.push('Changelog musí obsahovat přesně deset nejnovějších změn.');
if (!changelogSource.includes('.slice(0, 10)')) warnings.push('Changelog není chráněn automatickým omezením na deset položek.');
if (!app.includes('outline-close')) errors.push('Mobilní osnova nemá vlastní zavírací prvek.');
if (app.includes('Žák 2.B se specifickou poruchou učení')) errors.push('V obsahu zůstal rizikový příklad pseudonymizace žáka.');
if (!app.includes("event.key === 'Escape' && presenterMode")) errors.push('Prezentační režim nelze ukončit klávesou Escape.');
const styles = await fs.readFile(path.join(root, 'assets/css/styles.css'), 'utf8');
if (styles.includes('.presenter-mode .site-header { display: none !important; }')) errors.push('Prezentační režim znovu skrývá nouzové tlačítko pro ukončení.');
if (!styles.includes('.presenter-mode .site-header .presenter-exit-button')) errors.push('Tlačítko pro ukončení prezentace nemá viditelný projektorový styl.');
if (styles.includes('will-change: transform')) errors.push('Prezentační CSS znovu vynucuje zbytečnou kompozitní vrstvu.');
if (styles.includes('.lesson-completion')) errors.push('CSS znovu obsahuje odstraněný osobní postup lekcí.');
if ((styles.match(/\.presenter-mode \.lesson-stage\s*\{/g) || []).length > 1) errors.push('Prezentační layout má znovu duplicitní bloky pro lesson-stage.');

if (errors.length) {
  console.error('\nKontrola selhala:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

if (warnings.length) {
  console.warn('\nUpozornění:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

console.log(`OK: ${courses.length} školení, ${lessonCount} lekcí, ${visualBlockCount} výrazných vizuálních bloků, verze ${pkg.version}.`);
