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
import speakerNotes from './speaker-notes.js';
import { courseEnhancements } from './presentation-enhancements.js';

const rawCourses = [
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
];

function applyPresentationEnhancements(course) {
  const enhancement = courseEnhancements[course.id] || {};
  course.minimumLessons = Math.min(
    course.lessons.length,
    Math.max(1, Number(enhancement.minimumLessons) || course.lessons.length)
  );

  for (const lesson of course.lessons) {
    const key = `${course.id}/${lesson.id}`;
    lesson.speakerNotes = speakerNotes[key] || lesson.speakerNotes || {};
    lesson.layout = enhancement.layouts?.[lesson.id] || lesson.layout || 'standard';
    const decision = enhancement.decisions?.[lesson.id];
    if (decision && !lesson.blocks.some(block => block.type === 'decision')) {
      const quizIndex = lesson.blocks.findIndex(block => block.type === 'quiz');
      if (quizIndex >= 0) lesson.blocks.splice(quizIndex, 0, decision);
      else lesson.blocks.push(decision);
    }
  }

  const finalLesson = course.lessons.at(-1);
  if (enhancement.finalMission && finalLesson && !finalLesson.blocks.some(block => block.type === 'mission' && block.label === enhancement.finalMission.label)) {
    finalLesson.blocks.push(enhancement.finalMission);
  }

  return course;
}

export const courses = rawCourses
  .map(applyPresentationEnhancements)
  .sort((a, b) => a.order - b.order);

export const courseMap = new Map(courses.map(course => [course.id, course]));
