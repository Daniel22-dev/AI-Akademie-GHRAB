#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const base = process.env.AUTO_PATCH_BASE || process.argv[2] || 'HEAD^';
const head = process.env.AUTO_PATCH_HEAD || process.argv[3] || 'HEAD';
const maxFiles = Number(process.env.AUTO_PATCH_MAX_FILES || 30);
const maxChangedLines = Number(process.env.AUTO_PATCH_MAX_CHANGED_LINES || 4000);

function run(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}
function normalize(p) { return p.replaceAll('\\', '/').replace(/^\.\//, ''); }
function protectedReason(inputPath) {
  const p = normalize(inputPath);
  const lower = p.toLowerCase();
  if (p.startsWith('.github/')) return 'trusted GitHub workflow';
  if (p.startsWith('security/')) return 'trusted GARP/security/control-plane';
  if (p.startsWith('dist/') || p.startsWith('dist-school-server/')) return 'generated deployment output';
  if (p === 'package.json' || p === 'package-lock.json') return 'dependency/build metadata';
  if (p === 'scripts/auto-patch-worker.mjs' || p === 'scripts/auto-patch-guard.mjs') return 'AUTO PATCH worker/guard';
  if (lower === '.env' || lower.startsWith('.env.') || /\.(pem|key|p12|pfx|jks|keystore)$/i.test(p)) return 'secret/key material';
  if (/\.(zip|7z|rar|tar|gz|png|jpe?g|gif|webp|ico|pdf|woff2?|ttf|otf|mp4|mp3|wav)$/i.test(p)) return 'binary asset';
  return null;
}

let changedRaw;
try { changedRaw = run(['diff', '--name-status', '-z', `${base}...${head}`]); }
catch (error) { fail(`Cannot determine changed files for ${base}...${head}: ${error.message}`); }
const fields = changedRaw ? changedRaw.split('\0').filter(Boolean) : [];
const changed = [];
for (let i = 0; i < fields.length;) {
  const status = fields[i++];
  if (/^[RC]/.test(status)) {
    const from = fields[i++];
    const to = fields[i++];
    changed.push({ status, paths: [from, to] });
  } else {
    const p = fields[i++];
    changed.push({ status, paths: [p] });
  }
}

if (!changed.length) fail('AUTO PATCH produced no file changes');
const uniquePaths = [...new Set(changed.flatMap(c => c.paths).map(normalize))];
if (uniquePaths.length > maxFiles) fail(`AUTO PATCH changes ${uniquePaths.length} paths; maximum is ${maxFiles}`);
for (const p of uniquePaths) {
  if (!p || p.includes('..') || path.isAbsolute(p)) fail(`Unsafe changed path: ${p}`);
  const reason = protectedReason(p);
  if (reason) fail(`AUTO PATCH modified protected path ${p}: ${reason}`);
}

let additions = 0;
let deletions = 0;
const numstat = run(['diff', '--numstat', `${base}...${head}`]);
for (const line of numstat.split(/\r?\n/).filter(Boolean)) {
  const [a, d] = line.split('\t');
  if (a === '-' || d === '-') fail(`Binary diff detected: ${line}`);
  additions += Number(a || 0);
  deletions += Number(d || 0);
}
if (additions + deletions > maxChangedLines) {
  fail(`AUTO PATCH changes ${additions + deletions} lines; maximum is ${maxChangedLines}`);
}

const diff = run(['diff', '--no-ext-diff', '--unified=0', `${base}...${head}`]);
const forbiddenPatterns = [
  [/OPENAI_API_KEY\s*[=:]\s*['\"][^'\"]+/i, 'embedded OpenAI API key'],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key material'],
  [/\b(?:eval|new\s+Function|Function)\s*\(/, 'dynamic code execution'],
  [/https?:\/\/[^\s'\"`]+/i, 'new external URL/network dependency'],
  [/document\.write\s*\(/i, 'document.write sink'],
  [/innerHTML\s*=\s*[^;]+/i, 'direct innerHTML assignment'],
  [/insertAdjacentHTML\s*\(/i, 'HTML injection sink']
];
for (const [pattern, label] of forbiddenPatterns) {
  const addedOnly = diff.split(/\r?\n/).filter(l => l.startsWith('+') && !l.startsWith('+++')).join('\n');
  if (pattern.test(addedOnly)) fail(`AUTO PATCH introduced forbidden construct: ${label}`);
}

const result = { status: 'PASS', base, head, changedPaths: uniquePaths, additions, deletions };
console.log(JSON.stringify(result, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) {
  const fs = await import('node:fs/promises');
  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `\n## AUTO PATCH guard\n\nPASS — ${uniquePaths.length} paths, +${additions}/-${deletions} lines.\n`);
}

function fail(message) {
  console.error(JSON.stringify({ status: 'FAIL', error: message, base, head }, null, 2));
  process.exit(1);
}
