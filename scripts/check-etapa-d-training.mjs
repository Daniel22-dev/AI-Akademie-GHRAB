import { courses, courseMap } from "../courses/index.js";
const current = {
  "ai-literacy": "0.21.197",
  "differentiator": "1.3.50",
  "generator": "7.1.99",
  "ludus": "1.16.31",
  "correspondence": "5.10.34",
  "evaluator": "1.5.30",
  "activa": "0.5.30",
  "sortio": "1.1.23",
  "lesson-hub": "1.2.26",
  "maturita-desk": "1.0.6"
};
for (const [id,version] of Object.entries(current)) {
  const lesson = courseMap.get(id);
  if (!lesson) throw Error("Missing course: "+id);
  const meta = lesson.training || {};
  if (meta.appVersion === version) continue;
  if (meta.reviewStatus !== "review-required" && meta.reviewStatus !== "pilot")
    throw Error("Stale training without explicit review flag: "+id+" "+meta.appVersion+" versus "+version);
  if (meta.currentAppVersion && meta.currentAppVersion !== version)
    throw Error("Review target incorrect: "+id);
}
const git = courseMap.get("generator");
const secure = git.lessons.find(lesson=>lesson.id==="secure-classroom");
if (!secure || secure.duration!==10 || git.lessons.reduce((n,lesson)=>n+lesson.duration,git.reserve)!==git.duration)
  throw Error("GIT training duration mismatch");
const content=JSON.stringify(secure);
for (const phrase of ["START","END","Google Forms","SECURE-ANSWERS-V1","Verifier","Teacher/Admin","Recovery","7.1.99"])
  if(!content.includes(phrase))throw Error("Missing workflow instruction: "+phrase);
for (const field of ["say","explain","ask","expected","demo","facilitation","caution","transition","fallback","shortcut"])
  if(!Array.isArray(secure.speakerNotes?.[field])||!secure.speakerNotes[field].length)
    throw Error("Missing presenter note: "+field);
if (!git.training?.reviewStatus || git.training.reviewStatus!=="pilot" || git.training.appVersion!=="7.1.99")
  throw Error("New GIT long-course review status must remain pilot");
console.log("[ETAPA D] PASS manual-app training version status and complete GIT v7.1.99 secure workflow");
