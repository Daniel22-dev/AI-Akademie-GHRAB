import fs from 'node:fs/promises';
import path from 'node:path';
import aiLiteracy from '../courses/00-ai-literacy.js';
import start from '../courses/00-start.js';
import differentiator from '../courses/01-differentiator.js';
import github from '../courses/02-github.js';
import generator from '../courses/03-generator.js';
import ludus from '../courses/04-ludus.js';
import correspondence from '../courses/05-correspondence.js';
import evaluator from '../courses/06-evaluator.js';
import workflow from '../courses/07-workflow.js';
import administrator from '../courses/08-administrator.js';

const courses = [aiLiteracy, start, differentiator, github, generator, ludus, correspondence, evaluator, workflow, administrator];
const clean = value => String(value || '').replace(/\s+/g, ' ').trim();
const lowerFirst = value => {
  const text = clean(value);
  return text ? text.charAt(0).toLocaleLowerCase('cs') + text.slice(1) : '';
};
const sentence = value => {
  const text = clean(value);
  if (!text) return '';
  return /[.!?]$/.test(text) ? text : `${text}.`;
};

function mainPoints(lesson) {
  const points = [];
  for (const block of lesson.blocks || []) {
    if (block.type === 'statement') points.push(block.text);
    if (block.type === 'lead') points.push(block.text);
    if (['cards', 'flow', 'steps'].includes(block.type)) {
      for (const item of block.items || []) points.push(`${item.title}: ${item.text}`);
    }
    if (block.type === 'comparison') {
      points.push(`${block.left?.title}: ${(block.left?.items || []).slice(0, 2).join(', ')}`);
      points.push(`${block.right?.title}: ${(block.right?.items || []).slice(0, 2).join(', ')}`);
    }
    if (block.type === 'showcase') points.push(`${block.before?.title} se mění na ${block.after?.title}`);
    if (block.type === 'decision') points.push(`${block.question}`);
    if (block.type === 'callout') points.push(`${block.title}: ${block.text}`);
    if (points.filter(Boolean).length >= 4) break;
  }
  return [...new Set(points.map(clean).filter(Boolean))].slice(0, 3);
}

function questionFor(lesson) {
  const quiz = lesson.blocks.find(block => block.type === 'quiz');
  if (quiz) return quiz.question;
  const decision = lesson.blocks.find(block => block.type === 'decision');
  if (decision) return decision.question;
  const activity = lesson.blocks.find(block => block.type === 'activity');
  if (activity) return `Kde byste výstup „${activity.output}“ využili ve své vlastní praxi?`;
  const comparison = lesson.blocks.find(block => block.type === 'comparison');
  if (comparison) return `Který rozdíl mezi „${comparison.left.title}“ a „${comparison.right.title}“ je pro vás nejdůležitější?`;
  return `Jaký konkrétní příklad z vlastní práce se vám vybaví u tématu „${lesson.title}“?`;
}

function expectedFor(lesson) {
  const quiz = lesson.blocks.find(block => block.type === 'quiz');
  if (quiz) return sentence(quiz.explanation);
  const decision = lesson.blocks.find(block => block.type === 'decision');
  if (decision) return sentence(`Odpověď má vést k vědomé volbě mezi možnostmi: ${decision.options.map(option => option.title).join(' / ')}`);
  const warning = lesson.blocks.find(block => block.type === 'callout' && ['warning', 'danger', 'success'].includes(block.tone));
  if (warning) return sentence(warning.text);
  return sentence(`Odpovědi propojte s cílem této části: ${lowerFirst(lesson.summary)}`);
}

function demoFor(lesson) {
  const showcase = lesson.blocks.find(block => block.type === 'showcase');
  if (showcase) return sentence(`Nechte nejprve vyniknout rozdíl mezi „${showcase.before.title}“ a „${showcase.after.title}“. Až potom vysvětlete, co změnu způsobilo`);
  const activity = lesson.blocks.find(block => block.type === 'activity');
  if (activity) return sentence(`${activity.brief} Na konci musí být vidět tento výstup: ${activity.output}`);
  const steps = lesson.blocks.find(block => block.type === 'steps');
  if (steps) return sentence(`Ukažte první dva kroky přímo na obrazovce a u každého pojmenujte výsledek: ${steps.items.slice(0, 2).map(item => item.title).join(' → ')}`);
  const code = lesson.blocks.find(block => block.type === 'code');
  if (code) return sentence(`Zobrazte blok „${code.label}“ a zvýrazněte pouze místa, která má učitel skutečně upravit`);
  const table = lesson.blocks.find(block => block.type === 'table');
  if (table) return sentence(`Vyberte z tabulky jeden běžný případ a projděte jej zleva doprava: ${table.headers.join(' → ')}`);
  const comparison = lesson.blocks.find(block => block.type === 'comparison');
  if (comparison) return sentence(`Dejte skupině deset sekund na tiché porovnání obou sloupců a potom zvýrazněte jediný rozhodující rozdíl`);
  return 'Použijte jeden krátký modelový příklad bez osobních údajů a ukažte konkrétní dopad postupu.';
}

function cautionFor(lesson) {
  const warning = lesson.blocks.find(block => block.type === 'callout' && ['warning', 'danger'].includes(block.tone));
  if (warning) return sentence(`${warning.title}: ${warning.text}`);
  if (/hodnot|rubrik/i.test(`${lesson.title} ${lesson.summary}`)) return 'Nenechte návrh AI zaměnit za konečné odborné rozhodnutí učitele; držte se přesně zadané rubriky.';
  if (/žák|student|e-mail|sloh|osobn|anonym/i.test(`${lesson.title} ${lesson.summary}`)) return 'Pracujte pouze s fiktivními nebo skutečně anonymizovanými údaji. Samotné odstranění jména nemusí stačit.';
  return 'Držte výklad u konkrétního cíle. Nezabíhejte do funkcí, které účastníci v této části ještě nepotřebují.';
}

function fallbackFor(lesson) {
  const visualNames = { showcase: 'modelová ukázka', comparison: 'porovnání', table: 'tabulka', flow: 'pracovní postup', steps: 'kroky' };
  const visual = lesson.blocks.find(block => Object.hasOwn(visualNames, block.type));
  if (visual) return sentence(`Když selže internet nebo aplikace, použijte přímo blok „${visualNames[visual.type]}“ na tomto slidu a nechte skupinu popsat správný postup vlastními slovy`);
  return 'Když selže internet nebo aplikace, pokračujte s modelovým příkladem na slidu a nechte účastníky pojmenovat správný postup.';
}

function timingFor(lesson) {
  const total = Math.max(3, Number(lesson.duration) || 5);
  const interaction = lesson.blocks.some(block => ['activity', 'quiz', 'checklist', 'mission', 'decision'].includes(block.type));
  const intro = Math.max(1, Math.round(total * .18));
  const practice = Math.max(1, Math.round(total * (interaction ? .36 : .22)));
  const explain = Math.max(1, total - intro - practice);
  return `${intro} min uvedení · ${explain} min vysvětlení nebo ukázka · ${practice} min zapojení a shrnutí`;
}

const entries = {};
for (const course of courses) {
  course.lessons.forEach((lesson, index) => {
    const points = mainPoints(lesson);
    const next = course.lessons[index + 1];
    entries[`${course.id}/${lesson.id}`] = {
      say: [
        `„Teď se podíváme na téma: ${lesson.title}.“`,
        `„Na konci této části by mělo být jasné toto: ${sentence(lesson.summary)}“`,
        '„Sledujte především, jak se tato myšlenka projeví v konkrétní učitelské praxi.“'
      ],
      explain: points.length ? points.map(sentence) : [sentence(lesson.summary)],
      ask: [questionFor(lesson)],
      expected: [expectedFor(lesson)],
      demo: [demoFor(lesson)],
      facilitation: [sentence(lesson.trainerNote || `Po každém hlavním bodu si ověřte, že skupina dokáže postup převést do vlastní praxe`)],
      caution: [cautionFor(lesson)],
      transition: [next
        ? `„Tento základ teď využijeme v následující části: ${next.title}.“`
        : '„Než skončíme, vyberte si jeden konkrétní krok, který skutečně použijete v praxi.“'],
      fallback: [fallbackFor(lesson)],
      timing: timingFor(lesson)
    };
  });
}

const output = `// Automaticky připravený, ale ručně upravitelný scénář pro všech 68 částí.\n// Znovu vytvořit: npm run build:notes\nexport default ${JSON.stringify(entries, null, 2)};\n`;
await fs.writeFile(path.resolve('courses/speaker-notes.js'), output, 'utf8');
console.log(`Vytvořeno ${Object.keys(entries).length} sad poznámek.`);
