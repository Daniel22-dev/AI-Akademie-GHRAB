import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { courses } from '../courses/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const requiredFiles = [
  'index.html', 'manifest.webmanifest', 'sw.js', 'assets/css/styles.css',
  'assets/js/app.js', 'assets/js/storage.js', 'assets/js/starfield.js', 'courses/index.js'
];

for (const file of requiredFiles) {
  try { await fs.access(path.join(root, file)); }
  catch { errors.push(`Chybí povinný soubor: ${file}`); }
}

const ids = new Set();
const codes = new Set();
let lessonCount = 0;
for (const course of courses) {
  if (!course.id || ids.has(course.id)) errors.push(`Neplatné nebo duplicitní ID kurzu: ${course.id}`);
  ids.add(course.id);
  if (!course.code || codes.has(course.code)) errors.push(`Neplatný nebo duplicitní kód kurzu: ${course.code}`);
  codes.add(course.code);
  if (!Array.isArray(course.lessons) || course.lessons.length === 0) errors.push(`Kurz ${course.id} nemá lekce.`);
  const lessonIds = new Set();
  for (const lesson of course.lessons || []) {
    lessonCount += 1;
    if (!lesson.id || lessonIds.has(lesson.id)) errors.push(`Kurz ${course.id} má duplicitní ID lekce: ${lesson.id}`);
    lessonIds.add(lesson.id);
    if (!lesson.title || !lesson.summary || !Array.isArray(lesson.blocks)) errors.push(`Neúplná lekce ${course.id}/${lesson.id}`);
  }
  for (const prerequisite of course.prerequisites || []) {
    if (!courses.some(item => item.id === prerequisite)) errors.push(`Kurz ${course.id} odkazuje na neexistující předpoklad ${prerequisite}`);
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
    if (exported.includes('Poznámka řečníka') || exported.includes('trainerNote')) errors.push(`Export ${course.id}.html obsahuje interní poznámky řečníka.`);
  } catch {
    errors.push(`Chybí samostatný export prezentace: exports/${course.id}.html`);
  }
}

const sw = await fs.readFile(path.join(root, 'sw.js'), 'utf8');
const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
if (!sw.includes(`ghrab-academy-v${pkg.version}`)) errors.push('Verze cache v sw.js neodpovídá package.json.');

const index = await fs.readFile(path.join(root, 'index.html'), 'utf8');
if (!index.includes('assets/js/app.js')) errors.push('index.html nenačítá hlavní modul aplikace.');
if (!index.includes('Content-Security-Policy')) errors.push('index.html neobsahuje Content-Security-Policy.');
if (!index.includes('AI Akademie GHRAB')) errors.push('index.html neobsahuje nový název AI Akademie GHRAB.');

if (errors.length) {
  console.error('\nKontrola selhala:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`OK: ${courses.length} školení, ${lessonCount} lekcí, verze ${pkg.version}.`);
