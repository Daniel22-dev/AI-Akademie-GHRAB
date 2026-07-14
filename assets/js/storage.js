const STORAGE_KEY = 'ghrab-academy-state-v1';

const defaultState = {
  completedLessons: {},
  checklistItems: {},
  quizAnswers: {},
  trainerMode: false,
  lastCourse: null,
  lastLesson: null,
  installedVersion: '1.0.1'
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
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
