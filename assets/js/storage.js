const STORAGE_KEY = 'ghrab-academy-state-v2';
const LEGACY_STORAGE_KEY = 'ghrab-academy-state-v1';

const defaultState = {
  checklistItems: {},
  quizAnswers: {},
  trainerMode: false,
  lastCourse: null,
  lastLesson: null
};

export function loadState() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const legacy = current ? null : localStorage.getItem(LEGACY_STORAGE_KEY);
    const parsed = JSON.parse(current || legacy || '{}');
    const state = {
      checklistItems: parsed.checklistItems || {},
      quizAnswers: parsed.quizAnswers || {},
      trainerMode: Boolean(parsed.trainerMode),
      lastCourse: parsed.lastCourse || null,
      lastLesson: parsed.lastLesson || null
    };
    if (legacy) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    return state;
  } catch {
    return structuredClone(defaultState);
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      checklistItems: state.checklistItems || {},
      quizAnswers: state.quizAnswers || {},
      trainerMode: Boolean(state.trainerMode),
      lastCourse: state.lastCourse || null,
      lastLesson: state.lastLesson || null
    }));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Akademie zůstává použitelná i v režimu, který blokuje místní úložiště.
  }
}

export function checklistKey(courseId, lessonId, index) {
  return `${courseId}:${lessonId}:${index}`;
}

export function quizKey(courseId, lessonId) {
  return `${courseId}:${lessonId}`;
}
