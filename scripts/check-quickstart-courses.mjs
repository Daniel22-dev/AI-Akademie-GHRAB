import { readFile } from 'node:fs/promises';
import { courses, courseMap } from '../courses/index.js';

const required = [
  { id: 'quick-studio', lessons: 3, duration: 18 },
  { id: 'quick-api', lessons: 3, duration: 17 },
  { id: 'quick-git', lessons: 4, duration: 30 }
];
const fail = message => { throw new Error('[ETAPA C] ' + message); };
const ids = new Set();
for (const expected of required) {
  const course = courseMap.get(expected.id);
  if (!course) fail('Missing course '+expected.id);
  if (course.lessons.length !== expected.lessons || course.duration !== expected.duration)
    fail('Unexpected course length: ' + course.id);
  if (course.required) fail('Starter must not replace mandatory foundation: '+course.id);
  if (!course.training?.verifiedAt || !course.training?.trainingVersion?.includes('pilot'))
    fail('Missing pilot review metadata: '+course.id);
  if (!course.handout?.workflow?.length || !course.handout?.checks?.length ||
      !course.handout?.teacherDecision?.some(x => x.includes('Učitel')))
    fail('Incomplete attendee handout: '+course.id);
  for (const lesson of course.lessons) {
    const key=course.id+'/'+lesson.id;
    if (ids.has(key)) fail('Duplicate lesson '+key);
    ids.add(key);
    const notes=lesson.speakerNotes;
    for (const field of ['say','explain','ask','expected','demo','facilitation','caution','transition','fallback','shortcut']) {
      if (!Array.isArray(notes?.[field]) || !notes[field].length) fail('Missing private presenter note '+key+'/'+field);
    }
    if (!notes.timing || !lesson.blocks.length) fail('Incomplete training section '+key);
    if (!lesson.blocks.some(block => ['steps','comparison','flow','mission','activity','quiz','decision','cards','checklist'].includes(block.type)))
      fail('Only passive content in '+key);
  }
}
if (courses.filter(c=>c.required).length!==1 || courseMap.get('ai-literacy')?.required!==true)
  fail('Mandatory AI+AI Studio foundation was changed');
const home = await readFile(new URL('../assets/js/app.js', import.meta.url),'utf8');
if (!home.includes('renderStartPaths()') || !home.includes('academy-start-card') ||
    !required.every(x=>home.includes(x.id)))
  fail('Starter routes are missing from Academy homepage');
const notes=await readFile(new URL('../assets/js/console.js',import.meta.url),'utf8');
if (!notes.includes('data-live-slide-preview') || !notes.includes('renderSpoken(guide.say)'))
  fail('Presenter console lost live preview or confidential notes');
const source=await readFile(new URL('../courses/quickstart-courses.js',import.meta.url),'utf8');
for (const secret of [/sk-[A-Za-z0-9]{25,}/,/AIza[0-9A-Za-z_-]{30,}/, /ghp_[0-9a-zA-Z]{25,}/])
  if (secret.test(source)) fail('A credential-like token appeared in course content');
console.log('[ETAPA C] PASS '+required.length+' short decks, '+ids.size+' slides, 3 curated handouts, presenter notes and safe routes.');
