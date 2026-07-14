import aiLiteracy from './00-ai-literacy.js';
import start from './00-start.js';
import differentiator from './01-differentiator.js';
import github from './02-github.js';
import generator from './03-generator.js';
import ludus from './04-ludus.js';
import correspondence from './05-correspondence.js';
import evaluator from './06-evaluator.js';
import workflow from './07-workflow.js';
import administrator from './08-administrator.js';

export const courses = [
  aiLiteracy,
  start,
  differentiator,
  github,
  generator,
  ludus,
  correspondence,
  evaluator,
  workflow,
  administrator
].sort((a, b) => a.order - b.order);

export const courseMap = new Map(courses.map(course => [course.id, course]));
