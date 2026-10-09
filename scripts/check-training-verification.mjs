import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { verification, attachTrainingData } from '../courses/training-data.js';

// No "verified by omission" when a new course is added.
const statuses = new Set(['verified', 'pilot', 'review-required']);
const ids = ['ai-literacy', 'differentiator', 'generator', 'ludus', 'correspondence',
  'evaluator', 'activa', 'sortio', 'lesson-hub', 'maturita-desk', 'github',
  'workflow', 'administrator', 'quick-studio', 'quick-api', 'quick-git'];
for (const id of ids) {
  const data = verification[id];
  assert(data, 'Missing training metadata for ' + id);
  assert(statuses.has(data.reviewStatus), 'Missing/unknown review status: ' + id);
  assert(data.reviewStatus !== 'verified' || data.verifiedAt, 'Verified without date: ' + id);
}
// Explicit unknown should never inherit a "verified" badge.
const fallback = attachTrainingData({
  id: 'unlisted-training', title: 'Test', subtitle: 'Test', lessons: [], outcomes: []
});
assert.equal(fallback.training.reviewStatus, 'review-required');
const appSource = readFileSync(new URL('../assets/js/app.js', import.meta.url), 'utf8');
assert(appSource.includes("training.reviewStatus === 'verified' && training.verifiedAt"),
  'The UI must only label explicitly verified courses as verified');
assert(appSource.includes('course.training.reviewStatus === "verified" ? "✓" : "◌"'),
  'The catalogue verification icon must fail closed');
assert(!appSource.includes('poslední obsahové ověření'),
  'Unreviewed material must not be called content-verified');
console.log('[TRAINING] PASS: ' + ids.length + ' courses have explicit verification states');
