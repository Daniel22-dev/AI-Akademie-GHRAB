const STORAGE_KEY = 'ghrab-academy-state-v1';

const defaultState = {
  completedLessons: {},
  checklistItems: {},
  quizAnswers: {},
  trainerMode: false,
  lastCourse: null,
  lastLesson: null,
  installedVersion: '1.3.0'
};

export function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      ...defaultState,
      ...parsed,
      completedLessons: parsed.completedLessons || {},
      checklistItems: parsed.checklistItems || {},
      quizAnswers: parsed.quizAnswers || {}
    };
  } catch {
    return structuredClone(defaultState);
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Akademie zůstává použitelná i v režimu, který blokuje místní úložiště.
  }
}

export function resetState() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  return structuredClone(defaultState);
}

export function lessonKey(courseId, lessonId) {
  return `${courseId}:${lessonId}`;
}

export function checklistKey(courseId, lessonId, index) {
  return `${courseId}:${lessonId}:${index}`;
}

export function quizKey(courseId, lessonId) {
  return `${courseId}:${lessonId}`;
}
