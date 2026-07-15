import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { courses } from '../courses/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const requiredFiles = [
  'index.html', 'manifest.webmanifest', 'sw.js', 'assets/css/styles.css',
  'assets/js/app.js', 'assets/js/storage.js', 'assets/js/starfield.js', 'courses/index.js',
  'courses/speaker-notes.js', 'courses/presentation-enhancements.js',
  'README.md', 'NAHRANI-NA-GITHUB.md', 'AUDIT-IMPLEMENTACE-v1.3.0.md'
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
    if (!lesson.id || lessonIds.has(lesson.id)) errors.push(`Kurz ${course.id} má duplicitní ID lekce: ${lesson.id}`);
    lessonIds.add(lesson.id);
    if (!lesson.title || !lesson.summary || !Array.isArray(lesson.blocks)) errors.push(`Neúplná lekce ${course.id}/${lesson.id}`);
    if (!Number.isFinite(Number(lesson.duration)) || Number(lesson.duration) <= 0) errors.push(`Lekce ${course.id}/${lesson.id} má neplatný čas.`);
    if (!lesson.trainerNote) warnings.push(`Lekce ${course.id}/${lesson.id} nemá metodickou poznámku.`);
    const notes = lesson.speakerNotes || {};
    for (const field of ['say', 'explain', 'ask', 'expected', 'demo', 'facilitation', 'caution', 'transition', 'fallback']) {
      if (!Array.isArray(notes[field]) || notes[field].length === 0) errors.push(`Lekce ${course.id}/${lesson.id} nemá připravenou část poznámek: ${field}.`);
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
    if (exported.includes('Poznámka řečníka') || exported.includes('trainerNote') || exported.includes('speakerNotes') || exported.includes('Konzole školitele')) {
      errors.push(`Export ${course.id}.html obsahuje interní informace školitele.`);
    }
    if (!exported.includes('<script>\nconst course=')) errors.push(`Export ${course.id}.html nemá spustitelný skript.`);
  } catch {
    errors.push(`Chybí samostatný export prezentace: exports/${course.id}.html`);
  }
}

if (visualBlockCount < courses.length) errors.push('Akademie nemá dostatek výrazných vizuálních bloků napříč kurzy.');

const sw = await fs.readFile(path.join(root, 'sw.js'), 'utf8');
const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
if (!sw.includes(`ghrab-academy-v${pkg.version}`)) errors.push('Verze cache v sw.js neodpovídá package.json.');
if (!sw.includes("event.request.mode === 'navigate'")) errors.push('Service worker nerozlišuje navigaci od chybějících assetů.');
if (sw.includes("catch(() => caches.match('./index.html'))")) errors.push('Service worker stále maskuje chyby assetů hlavní stránkou.');
for (const cachedFile of [
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

const app = await fs.readFile(path.join(root, 'assets/js/app.js'), 'utf8');
if (!app.includes('fitPresenterSlide')) errors.push('Hlavní aplikace nemá automatické přizpůsobení slidu výšce projekce.');
if (!app.includes('presentationCover')) errors.push('Hlavní aplikace nemá úvodní prezentační obrazovky kurzů.');
if (app.includes("new BroadcastChannel('ghrab-academy-presenter-v1')")) errors.push('Konzole školitele stále používá společný kanál bez identifikátoru relace.');
if (!app.includes('presenterSessionId')) errors.push('Konzole školitele nemá oddělené relace.');
if (!app.includes('renderLessonCompletion')) errors.push('Hlavní aplikace nezobrazuje skutečný postup lekcemi.');
if (!app.includes('course.minimumLessons')) errors.push('Hlavní aplikace nerozlišuje základní a rozšiřující cestu.');
if (!app.includes('outline-close')) errors.push('Mobilní osnova nemá vlastní zavírací prvek.');
if (app.includes('Žák 2.B se specifickou poruchou učení')) errors.push('V obsahu zůstal rizikový příklad pseudonymizace žáka.');

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
