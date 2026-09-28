// Sestaví samostatné HTML prezentace pro účastníky do složky exports/.
//
// Šablona exportu má tři části:
//   scripts/export-template/export.css         vzhled exportu
//   scripts/export-template/export-runtime.js  běhový skript exportu (navigace, kvízy, tisk)
//   htmlTemplate() níže                        kostra HTML a vložená data kurzu
//
// Zápis šablon: do exportu se vkládá zhuštěná podoba, aby soubory zůstaly malé a stabilní.
// Řádek začínající mezerami je pokračováním předchozího řádku; při sestavení se
// zalomení i úvodní mezery odstraní. Řádek bez odsazení zůstává samostatným řádkem.
// Pokračovací řádek smí navazovat jen tam, kde spojení nemůže změnit význam kódu:
//   CSS: za znaky { } ;
//   JS:  za znaky ; { } : , ( [  nebo před operátorem + (ne ++)
// Jinak sestavení skončí chybou s číslem řádku.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { courses } from '../courses/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'exports');
const templateDir = path.join(root, 'scripts', 'export-template');
const ACCENT_PLACEHOLDER = '__COURSE_ACCENT__';

const CONTINUATION_RULES = {
  css: { after: '{};', plusBefore: false },
  js: { after: ';{}:,([', plusBefore: true }
};

async function readTemplate(fileName, language) {
  const rules = CONTINUATION_RULES[language];
  const text = (await fs.readFile(path.join(templateDir, fileName), 'utf8'))
    .replace(/\r\n/g, '\n')
    .replace(/\n$/, '');
  let output = '';
  text.split('\n').forEach((line, index) => {
    const indent = /^ +/.exec(line);
    if (index === 0 || !indent) {
      output += (index === 0 ? '' : '\n') + line;
      return;
    }
    const rest = line.slice(indent[0].length);
    if (!rest) return;
    const previous = output.trimEnd().at(-1) ?? '';
    const joinsAfterSafeChar = rules.after.includes(previous);
    const startsWithPlus = rules.plusBefore && rest.startsWith('+') && !rest.startsWith('++');
    if (!joinsAfterSafeChar && !startsWithPlus) {
      throw new Error(`${fileName}:${index + 1}: pokračovací řádek navazuje za znak "${previous}". `
        + 'Odsazený řádek se připojuje k předchozímu; povolené navázání je popsané v hlavičce build-exports.mjs.');
    }
    output += rest;
  });
  return output;
}

const exportCss = await readTemplate('export.css', 'css');
const exportRuntime = await readTemplate('export-runtime.js', 'js');
if (exportCss.split(ACCENT_PLACEHOLDER).length !== 2) {
  throw new Error(`export.css musí obsahovat právě jeden zástupný text ${ACCENT_PLACEHOLDER}.`);
}
// Kontrola syntaxe běhového skriptu; nic se nespouští.
new vm.Script(exportRuntime, { filename: 'export-runtime.js' });

const escapeScript = value => JSON.stringify(value)
  .replace(/<\/(script)/gi, '<\\/$1')
  .replace(/<!--/g, '<\\u0021--');

async function dataUri(relativePath) {
  const full = path.join(root, relativePath.replace(/^\.\//, ''));
  const data = await fs.readFile(full);
  const ext = path.extname(full).toLowerCase();
  const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${data.toString('base64')}`;
}

function courseTiming(course) {
  const content = course.lessons.reduce((sum, lesson) => sum + Number(lesson.duration || 0), 0);
  const reserve = Number.isFinite(Number(course.reserve))
    ? Math.max(0, Number(course.reserve))
    : Math.max(0, Number(course.duration || 0) - content);
  return { content, reserve, total: content + reserve };
}

// Účastnická kopie kurzu: bez poznámek školitele, s ikonou vloženou jako data URI.
function participantCourse(course, courseIcon) {
  const copy = structuredClone(course);
  copy.icon = courseIcon;
  for (const lesson of copy.lessons) {
    delete lesson.trainerNote;
    delete lesson.speakerNotes;
  }
  copy.timing = courseTiming(copy);
  copy.duration = copy.timing.total;
  return copy;
}

function htmlTemplate(course, courseIcon, brandIcon) {
  const safeCourse = escapeScript(participantCourse(course, courseIcon));
  const css = exportCss.replace(ACCENT_PLACEHOLDER, () => course.accent);
  return `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#050b18">
<meta name="robots" content="noindex, nofollow">
<title>${course.title} · AI Akademie GHRAB</title>
<style>
${css}
</style>
</head>
<body>
<div class="stars"></div>
<div id="app" class="app"></div>
<div id="print-root"></div>
<script>
const course=${safeCourse};
const brandIcon=${JSON.stringify(brandIcon)};
${exportRuntime}
<\/script>
</body>
</html>`;
}

await fs.mkdir(outputDir, { recursive: true });
const brandIcon = await dataUri('./assets/brand/icon-192.png');
for (const course of courses) {
  const courseIcon = await dataUri(course.icon);
  await fs.writeFile(path.join(outputDir, `${course.id}.html`), htmlTemplate(course, courseIcon, brandIcon));
}

console.log(`Vytvořeno ${courses.length} samostatných HTML prezentací v exports/.`);
