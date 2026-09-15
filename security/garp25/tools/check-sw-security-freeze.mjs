#!/usr/bin/env node
// GARP 2.5.1 GHRAB - service-worker security freeze checker, tooling hardening R2.
// Goal: fail closed against security-critical assets entering Cache API write paths.
// This is intentionally conservative static analysis. Unknown install/precache writes are AMBER,
// never silent PASS. Runtime cache writes are accepted only when structurally behind the
// isSecurityCriticalRequest -> networkOnlyNoStore early-return boundary.
import { readFile, readdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { Script, createContext } from 'node:vm';
import { createHash } from 'node:crypto';

const argv = process.argv.slice(2);
const swPath = argv.shift();
const deployDirArg = argv.shift();
let listArg = null;
if (argv[0] && !argv[0].startsWith('--')) listArg = argv.shift();
const opt = name => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : null; };
const flag = name => argv.includes(`--${name}`);
const canonicalPolicyArg = opt('canonical-policy');
const requireFreezePolicy = flag('require-freeze-policy') || !!canonicalPolicyArg;
if (!swPath || !deployDirArg) {
  console.error('Usage: node check-sw-security-freeze.mjs <sw.js> <deployment-dir> [security-critical-list.json] [--canonical-policy <policy.json>] [--require-freeze-policy]');
  process.exit(2);
}

const DEFAULT_CRITICAL = [
  'app-guard', 'access-control', 'platform-runtime', 'revoked-access.json',
  'release-integrity.json', 'release-integrity.sig', 'integrity-status', 'runtime-config'
];
let critical = DEFAULT_CRITICAL;
if (listArg) {
  try {
    const parsed = JSON.parse(await readFile(listArg, 'utf8'));
    if (!Array.isArray(parsed) || !parsed.length || parsed.some(x => typeof x !== 'string' || !x.trim())) {
      throw new Error('critical list must be a non-empty JSON array of strings');
    }
    critical = parsed;
  } catch (e) {
    console.error(JSON.stringify({ status: 'ERROR', error: 'critical-asset-list-invalid', detail: String(e) }, null, 2));
    process.exit(2);
  }
}

const rawSw = await readFile(swPath, 'utf8');
const sw = stripComments(rawSw);
const deployRoot = path.resolve(deployDirArg);
const findings = [];
const unresolvedCacheWrites = [];

// App-local security logic freeze. AUTO-PATCH mode is fail-closed and may additionally
// anchor the app-local policy to a canonical control-plane policy supplied by A-tooling.
let swFreezePolicy = null;
let swFreezePolicyBytes = null;
let swFreezePolicyResult = { status: 'NOT_CONFIGURED', pass: !requireFreezePolicy };
let canonicalPolicyResult = { status: canonicalPolicyArg ? 'UNVERIFIED' : 'NOT_REQUESTED', pass: !canonicalPolicyArg };
let policyPath = null;
if (listArg) {
  policyPath = path.join(path.dirname(path.resolve(listArg)), 'sw-security-freeze-policy.json');
  try {
    swFreezePolicyBytes = await readFile(policyPath);
    const parsed = JSON.parse(swFreezePolicyBytes.toString('utf8'));
    if (parsed?.schema !== 'ghrab-sw-security-freeze-policy-v1' || !/^[0-9a-f]{64}$/i.test(String(parsed?.normalizedSwSha256 || ''))) {
      throw new Error('invalid schema or normalizedSwSha256');
    }
    swFreezePolicy = { ...parsed, path: policyPath };
  } catch (e) {
    if (e?.code !== 'ENOENT') {
      console.error(JSON.stringify({ status: 'ERROR', error: 'sw-security-freeze-policy-invalid', detail: String(e) }, null, 2));
      process.exit(2);
    }
  }
}
if (!swFreezePolicy && requireFreezePolicy) {
  swFreezePolicyResult = { status: 'FAIL', pass: false, policy: policyPath, reason: 'required-auto-patch-freeze-policy-missing' };
  findings.push({ severity: 'HIGH', issue: 'required AUTO-PATCH service-worker freeze policy is missing', detail: swFreezePolicyResult });
}
if (canonicalPolicyArg) {
  try {
    const canonicalBytes = await readFile(path.resolve(canonicalPolicyArg));
    const parsed = JSON.parse(canonicalBytes.toString('utf8'));
    if (parsed?.schema !== 'ghrab-sw-security-freeze-policy-v1' || !/^[0-9a-f]{64}$/i.test(String(parsed?.normalizedSwSha256 || ''))) {
      throw new Error('invalid canonical schema or normalizedSwSha256');
    }
    const pass = !!swFreezePolicyBytes && Buffer.compare(swFreezePolicyBytes, canonicalBytes) === 0;
    canonicalPolicyResult = { status: pass ? 'PASS' : 'FAIL', pass, canonicalPolicy: path.resolve(canonicalPolicyArg), appPolicy: policyPath, appId: parsed.appId || null };
    if (!pass) findings.push({ severity: 'HIGH', issue: 'app-local SW freeze policy differs from canonical control-plane policy', detail: canonicalPolicyResult });
  } catch (e) {
    canonicalPolicyResult = { status: 'FAIL', pass: false, canonicalPolicy: path.resolve(canonicalPolicyArg), detail: String(e) };
    findings.push({ severity: 'HIGH', issue: 'canonical AUTO-PATCH SW freeze policy unavailable or invalid', detail: canonicalPolicyResult });
  }
}
function normalizedSwForFreezePolicy(text, appId = '') {
  let appVersionCount = 0, cacheNameCount = 0, platformCacheCount = 0;
  const safeAppId = String(appId || '').replace(/[^A-Za-z0-9_-]/g, '');
  // R10/N69: normalize only narrow version/cache tokens, never an arbitrary string hole.
  const versionToken = '[0-9A-Za-z.\\-]{1,32}';
  const appVersionRe = new RegExp(`\\bconst\\s+APP_VERSION\\s*=\\s*(["'])${versionToken}\\1\\s*;`, 'g');
  const cacheNameRe = safeAppId ? new RegExp(`\\bconst\\s+CACHE_NAME\\s*=\\s*(["'])ghrab-${safeAppId}-v${versionToken}\\1\\s*;`, 'g') : null;
  const platformCacheRe = safeAppId ? new RegExp(`caches\\.open\\(\\s*(["'])ghrab-${safeAppId}-v${versionToken}\\1\\s*\\)`, 'g') : null;
  let normalized = String(text)
    .replace(appVersionRe, () => { appVersionCount++; return 'const APP_VERSION = "<AUTO_PATCH_VERSION>";'; });
  if (cacheNameRe) normalized = normalized.replace(cacheNameRe, () => { cacheNameCount++; return 'const CACHE_NAME = "<AUTO_PATCH_CACHE>";'; });
  if (platformCacheRe) normalized = normalized.replace(platformCacheRe, () => { platformCacheCount++; return 'caches.open("<AUTO_PATCH_PLATFORM_CACHE>")'; });
  return { normalized, appVersionCount, cacheNameCount, platformCacheCount };
}
if (swFreezePolicy) {
  const n = normalizedSwForFreezePolicy(rawSw, swFreezePolicy.appId);
  const actual = createHash('sha256').update(Buffer.from(n.normalized, 'utf8')).digest('hex');
  const requiredPlatformMarkers = Number.isInteger(swFreezePolicy.requiredPlatformCacheMarkers) ? swFreezePolicy.requiredPlatformCacheMarkers : null;
  const pass = n.appVersionCount === 1 && n.cacheNameCount === 1 && (requiredPlatformMarkers === null || n.platformCacheCount === requiredPlatformMarkers) && actual === swFreezePolicy.normalizedSwSha256;
  swFreezePolicyResult = {
    status: pass ? 'PASS' : 'FAIL', pass, policy: swFreezePolicy.path,
    expectedSha256: swFreezePolicy.normalizedSwSha256, actualSha256: actual,
    appVersionMarkers: n.appVersionCount, cacheNameMarkers: n.cacheNameCount, platformCacheMarkers: n.platformCacheCount,
    scope: 'full-service-worker-source-except-version-and-cache-name'
  };
  if (!pass) findings.push({ severity: 'HIGH', issue: 'service-worker security logic differs from pinned AUTO-PATCH baseline', detail: swFreezePolicyResult });
}

const norm = value => String(value || '').replace(/^\.\//, '').replace(/^\//, '');
const matchesCritical = value => { const v=norm(value); if (!v) return false; return critical.some(c => { const cc=norm(c); return cc && (v.includes(cc) || cc.includes(v)); }); };

async function walk(dir, base = '') {
  const out = [];
  for (const name of (await readdir(dir)).sort()) {
    const abs = path.join(dir, name), rel = path.posix.join(base, name);
    const st = await lstat(abs);
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) out.push(...await walk(abs, rel));
    else if (st.isFile()) out.push(rel);
  }
  return out;
}
let files;
try { files = await walk(deployRoot); }
catch (e) { console.error(JSON.stringify({ status: 'ERROR', error: String(e) })); process.exit(2); }

const criticalFiles = files.filter(f => matchesCritical(f));
if (!criticalFiles.length) {
  findings.push({ severity: 'INFO', issue: 'zadny security-critical asset nenalezen - overit seznam rucne', detail: critical.join(',') });
}

function stripComments(text) {
  let out = '', i = 0, quote = null;
  while (i < text.length) {
    const ch = text[i], next = text[i + 1];
    if (quote) {
      out += ch;
      if (ch === '\\') { if (i + 1 < text.length) out += text[++i]; }
      else if (ch === quote) quote = null;
      i++; continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; out += ch; i++; continue; }
    if (ch === '/' && next === '/') {
      out += '  '; i += 2;
      while (i < text.length && text[i] !== '\n') { out += ' '; i++; }
      continue;
    }
    if (ch === '/' && next === '*') {
      out += '  '; i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) {
        out += text[i] === '\n' ? '\n' : ' '; i++;
      }
      if (i < text.length) { out += '  '; i += 2; }
      continue;
    }
    out += ch; i++;
  }
  return out;
}

function scanBalanced(text, openIndex, openChar = '(', closeChar = ')') {
  let depth = 0, quote = null;
  for (let i = openIndex; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === openChar) depth++;
    else if (ch === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function splitTopLevel(text, sep = ',') {
  const out = []; let start = 0, round = 0, square = 0, curly = 0, quote = null;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i++;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '(') round++; else if (ch === ')') round--;
    else if (ch === '[') square++; else if (ch === ']') square--;
    else if (ch === '{') curly++; else if (ch === '}') curly--;
    else if (ch === sep && round === 0 && square === 0 && curly === 0) {
      out.push(text.slice(start, i).trim()); start = i + 1;
    }
  }
  out.push(text.slice(start).trim());
  return out.filter(Boolean);
}

function decodeString(expr) {
  const t = expr.trim();
  if (t.length < 2 || !['"', "'", '`'].includes(t[0]) || t[t.length - 1] !== t[0]) return null;
  if (t[0] === '`' && t.includes('${')) return null;
  try {
    if (t[0] === '"') return JSON.parse(t);
    const inner = t.slice(1, -1).replace(/\\([\\'"`])/g, '$1');
    return inner;
  } catch { return null; }
}

const env = new Map();
function captureStaticAssignments(text) {
  const starts = [
    ...text.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*/g),
    ...text.matchAll(/\b(self\.[A-Za-z_$][\w$]*)\s*=\s*/g)
  ].sort((a,b) => a.index - b.index);
  for (const m of starts) {
    const name = m[1], start = m.index + m[0].length;
    let round=0, square=0, curly=0, quote=null, end=start;
    for (let i=start; i<text.length; i++) {
      const ch=text[i];
      if (quote) { if (ch==='\\') i++; else if (ch===quote) quote=null; end=i+1; continue; }
      if (ch==='\"'||ch==="'"||ch==='`') { quote=ch; end=i+1; continue; }
      if (ch==='(') round++; else if (ch===')') round--;
      else if (ch==='[') square++; else if (ch===']') square--;
      else if (ch==='{') curly++; else if (ch==='}') curly--;
      if ((ch===';' || ch==='\n') && round===0 && square===0 && curly===0) { end=i; break; }
      end=i+1;
    }
    const expr=text.slice(start,end).trim();
    if (expr) env.set(name, expr);
  }
}
captureStaticAssignments(sw);

function resolveObjectValues(expr, seen, depth) {
  const m = expr.match(/^Object\.values\s*\(\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\)$/);
  if (!m) return null;
  const raw = env.get(m[1]);
  if (!raw || !raw.trim().startsWith('{') || !raw.trim().endsWith('}')) return null;
  const body = raw.trim().slice(1, -1);
  const vals = [];
  for (const part of splitTopLevel(body)) {
    const idx = part.indexOf(':'); if (idx < 0) return null;
    const r = resolveExpr(part.slice(idx + 1), seen, depth + 1); if (!r) return null;
    vals.push(...r);
  }
  return vals;
}

function resolveExpr(expr, seen = new Set(), depth = 0) {
  if (depth > 12) return null;
  let t = String(expr || '').trim();
  while (t.startsWith('(') && t.endsWith(')')) {
    const end = scanBalanced(t, 0); if (end !== t.length - 1) break; t = t.slice(1, -1).trim();
  }
  const lit = decodeString(t); if (lit !== null) return [lit];
  if (/^new\s+Request\s*\(/.test(t)) {
    const open = t.indexOf('('), end = scanBalanced(t, open); if (end < 0) return null;
    const first = splitTopLevel(t.slice(open + 1, end))[0]; return resolveExpr(first, seen, depth + 1);
  }
  if (t.startsWith('[') && t.endsWith(']')) {
    const vals = [];
    for (const part of splitTopLevel(t.slice(1, -1))) {
      if (part.startsWith('...')) { const r = resolveExpr(part.slice(3), seen, depth + 1); if (!r) return null; vals.push(...r); }
      else { const r = resolveExpr(part, seen, depth + 1); if (!r) return null; vals.push(...r); }
    }
    return vals;
  }
  const concat = t.match(/^(.+?)\.concat\s*\((.*)\)$/s);
  if (concat) {
    const base = resolveExpr(concat[1], seen, depth + 1); if (!base) return null;
    const vals = [...base];
    for (const arg of splitTopLevel(concat[2])) { const r = resolveExpr(arg, seen, depth + 1); if (!r) return null; vals.push(...r); }
    return vals;
  }
  const split = t.match(/^(.+?)\.split\s*\((.*)\)$/s);
  if (split) {
    const base = resolveExpr(split[1], seen, depth + 1), sep = resolveExpr(split[2], seen, depth + 1);
    if (!base || base.length !== 1 || !sep || sep.length !== 1) return null;
    return base[0].split(sep[0]);
  }
  const ov = resolveObjectValues(t, seen, depth); if (ov) return ov;
  if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(t)) {
    if (seen.has(t)) return null;
    const raw = env.get(t); if (!raw) return null;
    const nextSeen = new Set(seen); nextSeen.add(t);
    return resolveExpr(raw, nextSeen, depth + 1);
  }
  return null;
}

function enclosingFunctionName(pos) {
  const prefix = sw.slice(0, pos);
  const matches = [...prefix.matchAll(/(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{/g)];
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i], open = m.index + m[0].lastIndexOf('{');
    const end = scanBalanced(sw, open, '{', '}');
    if (end >= pos) return m[1];
  }
  return null;
}

function installRanges() {
  const ranges = [];
  for (const m of sw.matchAll(/addEventListener\s*\(\s*['"]install['"]\s*,/g)) {
    const start = m.index, open = sw.indexOf('(', start), end = scanBalanced(sw, open);
    if (end > start) ranges.push([start, end]);
  }
  return ranges;
}
const installs = installRanges();
const isInstallPos = pos => installs.some(([a,b]) => pos >= a && pos <= b);

const precached = new Set();
const precacheSources = [];
function addResolved(values, source) {
  const uniq = [...new Set((values || []).filter(Boolean))];
  for (const v of uniq) precached.add(v);
  if (uniq.length) precacheSources.push({ source, entries: uniq });
}
function noteUnresolved(pos, method, expr, source) {
  unresolvedCacheWrites.push({ method, expression: expr.slice(0, 180), source, installOrPrecache: isInstallPos(pos), function: enclosingFunctionName(pos) });
}

const iteratorAddVars = new Set();
for (const m of sw.matchAll(/\bfor\s*\(\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s+of\s+([^)]*)\)\s*\{/g)) {
  const openBrace = m.index + m[0].lastIndexOf('{'), endBrace = scanBalanced(sw, openBrace, '{', '}');
  if (endBrace < 0) continue;
  const body = sw.slice(openBrace + 1, endBrace);
  if (new RegExp(`\\.\\s*add\\s*\\(\\s*${m[1]}\\s*\\)`).test(body)) iteratorAddVars.add(m[1]);
}
for (const m of sw.matchAll(/\bfor\s*\(\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s+of\s+Object\.values\s*\(\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\)\s*\)\s*\{/g)) {
  const openBrace = m.index + m[0].lastIndexOf('{'), endBrace = scanBalanced(sw, openBrace, '{', '}');
  if (endBrace < 0) continue;
  const body = sw.slice(openBrace + 1, endBrace);
  if (new RegExp(`\\.\\s*add\\s*\\(\\s*${m[1]}\\s*\\)`).test(body)) iteratorAddVars.add(m[1]);
}
for (const m of sw.matchAll(/(?:([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)|Object\.values\s*\([^)]*\))\.(?:map|forEach)\s*\(\s*([A-Za-z_$][\w$]*)\s*=>[\s\S]{0,260}?\.\s*add\s*\(\s*\2\s*\)/g)) iteratorAddVars.add(m[2]);

// Direct Cache API writes. Parse the first argument, not the variable name.
for (const m of sw.matchAll(/\.\s*(addAll|add|put)\s*\(/g)) {
  const method = m[1], open = m.index + m[0].lastIndexOf('('), close = scanBalanced(sw, open);
  if (close < 0) { noteUnresolved(m.index, method, '<unbalanced>', 'direct-call'); continue; }
  const args = splitTopLevel(sw.slice(open + 1, close));
  const first = args[0] || '';
  const values = resolveExpr(first);
  if (values) addResolved(values, `${method}:expression`);
  else {
    const fn = enclosingFunctionName(m.index);
    // Dynamic request cache writes are structurally safe only if they live in runtime helpers
    // whose callers sit behind the security-critical early return. Verified below.
    const idOnly = /^[A-Za-z_$][\w$]*$/.test(first.trim());
    if (method === 'add' && idOnly && iteratorAddVars.has(first.trim())) {
      // resolved by the iterator pass below
    } else if (!(method === 'put' && first.trim() === 'request' && ['networkFirst','cacheFirst'].includes(fn))) {
      noteUnresolved(m.index, method, first, 'direct-call');
    }
  }
}

// Iterated add paths where the cache.add argument is a loop variable.
for (const m of sw.matchAll(/\bfor\s*\(\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s+of\s+Object\.values\s*\(\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\)\s*\)\s*\{/g)) {
  const openBrace = m.index + m[0].lastIndexOf('{'), endBrace = scanBalanced(sw, openBrace, '{', '}');
  if (endBrace < 0) continue;
  const body = sw.slice(openBrace + 1, endBrace), varName = m[1];
  if (new RegExp(`\\.\\s*add\\s*\\(\\s*${varName}\\s*\\)`).test(body)) {
    const expr = `Object.values(${m[2]})`, values = resolveExpr(expr);
    if (values) addResolved(values, `for-of-add:${expr}`); else noteUnresolved(m.index, 'add', expr, 'for-of');
  }
}
for (const m of sw.matchAll(/\bfor\s*\(\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s+of\s+([^)]*)\)\s*\{/g)) {
  const openBrace = m.index + m[0].lastIndexOf('{'), endBrace = scanBalanced(sw, openBrace, '{', '}');
  if (endBrace < 0) continue;
  const body = sw.slice(openBrace + 1, endBrace);
  const varName = m[1];
  if (new RegExp(`\\.\\s*add\\s*\\(\\s*${varName}\\s*\\)`).test(body)) {
    const values = resolveExpr(m[2]);
    if (values) addResolved(values, `for-of-add:${m[2].trim()}`);
    else noteUnresolved(m.index, 'add', m[2], 'for-of');
  }
}

// map/forEach receiver paths. Resolve the receiver expression, including Object.values(...).
for (const m of sw.matchAll(/((?:[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)|(?:Object\.values\s*\([^)]*\)))\.(map|forEach)\s*\(\s*([A-Za-z_$][\w$]*)\s*=>[\s\S]{0,260}?\.\s*add\s*\(\s*\3\s*\)/g)) {
  const receiver = m[1].trim();
  const values = resolveExpr(receiver);
  if (values) addResolved(values, `${m[2]}-add:${receiver}`);
  else noteUnresolved(m.index, 'add', receiver, `${m[2]}-receiver`);
}

for (const p of precached) {
  for (const c of critical) {
    const pp=norm(p), cc=norm(c);
    if (pp && cc && (pp.includes(cc) || cc.includes(pp))) {
      findings.push({ severity: 'CRITICAL', issue: 'security-critical asset je v Cache API write/precache ceste', detail: `${p} (vzor: ${c})` });
    }
  }
}

// Structural + bounded behavioral exemption. Comments/proximity never count.
function namedFunctionDeclarations(name) {
  const re = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(sw))) {
    const open = m.index + m[0].lastIndexOf('{');
    const end = scanBalanced(sw, open, '{', '}');
    if (end <= open) break;
    out.push({ start: m.index, open, end, source: sw.slice(m.index, end + 1), body: sw.slice(open + 1, end) });
    re.lastIndex = end + 1;
  }
  return out;
}
function extractFunction(name) {
  const decls = namedFunctionDeclarations(name);
  return decls.length === 1 ? decls[0].body : '';
}
function extractFunctionSource(name) {
  const decls = namedFunctionDeclarations(name);
  return decls.length === 1 ? decls[0].source : '';
}
function assignmentCountForName(name) {
  const bare = [...sw.matchAll(new RegExp(`\\b${name}\\s*=`, 'g'))].length;
  const memberDot = [...sw.matchAll(new RegExp(`\\b(?:self|globalThis|this)\\s*\\.\\s*${name}\\s*=`, 'g'))].length;
  const memberBracket = [...sw.matchAll(new RegExp(`\\b(?:self|globalThis|this)\\s*\\[\\s*['"]${name}['"]\\s*\\]\\s*=`, 'g'))].length;
  return bare + memberDot + memberBracket;
}
const SECURITY_FUNCTION_NAMES = ['isSecurityCriticalRequest', 'networkOnlyNoStore', 'networkFirst', 'cacheFirst', 'isRuntimeRequest'];
const GLOBAL_SECURITY_DEPENDENCIES = ['fetch', 'URL', 'caches', 'Request', 'Response'];
function maskStringsForStructure(text) {
  let out = '', quote = null, escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quote) {
      if (ch === '\n' && quote !== '`') { quote = null; out += '\n'; escape = false; continue; }
      if (escape) { escape = false; out += ch === '\n' ? '\n' : ' '; continue; }
      if (ch === '\\') { escape = true; out += ' '; continue; }
      if (ch === quote) { quote = null; out += ' '; continue; }
      out += ch === '\n' ? '\n' : ' '; continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; out += ' '; continue; }
    out += ch;
  }
  return out;
}
const swCodeMask = maskStringsForStructure(sw);
function braceDepthAt(mask, index) {
  let depth = 0;
  for (let i = 0; i < index; i++) {
    if (mask[i] === '{') depth++;
    else if (mask[i] === '}') depth = Math.max(0, depth - 1);
  }
  return depth;
}
const dynamicCodeFindings = [];
for (const m of swCodeMask.matchAll(/\b(?:eval|Function|importScripts)\b|\bimport\s*\(/g)) {
  dynamicCodeFindings.push({ kind: 'dynamic-code-capability', index: m.index, excerpt: sw.slice(Math.max(0, m.index - 40), Math.min(sw.length, m.index + 100)) });
}
// R10/N68: any executable identifier token `constructor` is eval-like capability.
// The shipped SW has no legitimate constructor capability use. Strings/comments are masked,
// so this closes destructuring and prototype-chain forms without enumerating surface syntax.
for (const m of swCodeMask.matchAll(/\bconstructor\b/g)) {
  dynamicCodeFindings.push({ kind: 'constructor-capability', index: m.index, excerpt: sw.slice(Math.max(0, m.index - 50), Math.min(sw.length, m.index + 120)) });
}
// Obfuscated access to a global dynamic-code primitive must not turn into a silent PASS.
// The production SW has no legitimate computed access to its global object.
for (const m of swCodeMask.matchAll(/\b(?:globalThis|this)\b|\bself\s*\[/g)) {
  dynamicCodeFindings.push({ kind: 'computed-or-alternate-global-access', index: m.index, excerpt: sw.slice(Math.max(0, m.index - 40), Math.min(sw.length, m.index + 100)) });
}
for (const item of dynamicCodeFindings) findings.push({
  severity: 'HIGH', issue: 'dynamic/eval-like or obfuscated global capability in service worker is forbidden in AUTO-PATCH security context', detail: item
});

function registrationCapabilityInvariant() {
  const violations = [];
  const allowedSelfMembers = new Set(['addEventListener', 'skipWaiting', 'clients', 'location', 'registration']);
  const directSites = [];
  for (const m of swCodeMask.matchAll(/\bself\s*\.\s*addEventListener\s*\(/g)) {
    const wordOffset = m[0].indexOf('addEventListener');
    const wordIndex = m.index + wordOffset;
    const depth = braceDepthAt(swCodeMask, m.index);
    directSites.push({ index: m.index, wordIndex, depth });
    if (depth !== 0) violations.push({ kind: 'deferred-direct-registration', index: m.index, depth });
  }
  const acceptedWords = new Set(directSites.map(x => x.wordIndex));
  for (const m of swCodeMask.matchAll(/\baddEventListener\b/g)) {
    if (!acceptedWords.has(m.index)) violations.push({ kind: 'registration-capability-escape', index: m.index, text: sw.slice(Math.max(0,m.index-50), Math.min(sw.length,m.index+100)) });
  }
  for (const m of swCodeMask.matchAll(/\bonfetch\b/g)) {
    violations.push({ kind: 'onfetch-capability', index: m.index, text: sw.slice(Math.max(0,m.index-50), Math.min(sw.length,m.index+100)) });
  }
  // Every reference to self must remain a direct member access from a deliberately tiny allowlist.
  // This prevents laundering addEventListener through aliases/helpers even when the property name is computed.
  for (const m of swCodeMask.matchAll(/\bself\b/g)) {
    const tail = swCodeMask.slice(m.index + m[0].length);
    const member = /^\s*\.\s*([A-Za-z_$][\w$]*)/.exec(tail);
    if (!member) {
      violations.push({ kind: 'self-capability-escape', index: m.index, text: sw.slice(Math.max(0,m.index-40), Math.min(sw.length,m.index+100)) });
      continue;
    }
    if (!allowedSelfMembers.has(member[1])) violations.push({ kind: 'self-member-not-allowlisted', member: member[1], index: m.index });
  }
  // Computed access to the global object can synthesize security capability names
  // (for example 'add' + 'EventListener') and is therefore a HIGH capability escape.
  for (const m of swCodeMask.matchAll(/\b(?:globalThis|this)\s*\[/g)) {
    violations.push({ kind: 'computed-global-capability-access', index: m.index, text: sw.slice(Math.max(0,m.index-40), Math.min(sw.length,m.index+120)) });
  }
  const metaPatterns = [
    /\bReflect\s*\./g,
    /\bObject\s*\.\s*(?:defineProperty|defineProperties|assign|getOwnPropertyDescriptor|getOwnPropertyDescriptors|getPrototypeOf|setPrototypeOf)\s*\(/g,
    /\bProxy\b/g,
    /\\u[0-9a-fA-F]{4}/g
  ];
  for (const re of metaPatterns) for (const m of swCodeMask.matchAll(re)) {
    violations.push({ kind: 'registration-metaprogramming-capability', index: m.index, text: sw.slice(Math.max(0,m.index-40), Math.min(sw.length,m.index+100)) });
  }
  return { directSites, violations, pass: violations.length === 0 };
}
const registrationCapability = registrationCapabilityInvariant();
if (!registrationCapability.pass) findings.push({
  severity: 'HIGH', issue: 'fetch registration capability escapes direct top-level registration invariant', detail: registrationCapability
});
function globalDependencyMutationSummary(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const declarations = [...sw.matchAll(new RegExp(`\\b(?:const|let|var|function|class)\\s+${escaped}\\b`, 'g'))].length;
  const bareAssignments = [...sw.matchAll(new RegExp(`(^|[^.\\w$])${escaped}\\s*=(?!=)`, 'gm'))].length;
  const memberAssignments = [...sw.matchAll(new RegExp(`\\b(?:self|globalThis|this)\\s*(?:\\.\\s*${escaped}|\\[\\s*['"]${escaped}['"]\\s*\\])\\s*=`, 'g'))].length;
  const defineProperty = [...sw.matchAll(new RegExp(`Object\\.defineProperty\\s*\\(\\s*(?:globalThis|self|this|${escaped}\\.prototype)\\s*,\\s*['"]${escaped}['"]`, 'g'))].length;
  const destructuring = [...sw.matchAll(new RegExp(`\\b(?:const|let|var)\\s*\\{[^}]*\\b${escaped}\\b[^}]*\\}`, 'g'))].length;
  const objectAssign = [...sw.matchAll(new RegExp(`Object\\.assign\\s*\\(\\s*(?:globalThis|self|this)\\s*,\\s*\\{[^}]*\\b${escaped}\\s*:`, 'g'))].length;
  const prototypeMutation = name === 'URL' || name === 'Request' || name === 'Response'
    ? [...sw.matchAll(new RegExp(`(?:Object\\.defineProperty\\s*\\(\\s*${escaped}\\.prototype|${escaped}\\.prototype\\s*\\.)`, 'g'))].length
    : 0;
  const mutations = declarations + bareAssignments + memberAssignments + defineProperty + destructuring + objectAssign + prototypeMutation;
  return { name, declarations, bareAssignments, memberAssignments, defineProperty, destructuring, objectAssign, prototypeMutation, mutations, pass: mutations === 0 };
}
const globalDependencyIdentity = GLOBAL_SECURITY_DEPENDENCIES.map(globalDependencyMutationSummary);
for (const item of globalDependencyIdentity.filter(x => !x.pass)) findings.push({
  severity: 'HIGH', issue: 'platform security dependency is shadowed or mutated', detail: item
});

const fetchRegistrationSyntax = {
  directSites: registrationCapability.directSites,
  violations: registrationCapability.violations,
  pass: registrationCapability.pass
};

const securityFunctionIdentity = SECURITY_FUNCTION_NAMES.map(name => {
  const declarations = namedFunctionDeclarations(name).length;
  const assignments = assignmentCountForName(name);
  const references = [...sw.matchAll(new RegExp(`\\b${name}\\s*\\(`, 'g'))].length;
  const required = name === 'isSecurityCriticalRequest' || name === 'networkOnlyNoStore' || references > declarations;
  const pass = assignments === 0 && declarations <= 1 && (!required || declarations === 1);
  return { name, declarations, assignments, references, required, pass };
});
for (const item of securityFunctionIdentity.filter(x => !x.pass)) findings.push({
  severity: 'HIGH',
  issue: 'security-relevant function identity is ambiguous or shadowed',
  detail: item
});
function criticalRepresentativePath(entry) {
  const c = norm(entry);
  const special = {
    'app-guard': 'access/app-guard.js',
    'access-control': 'access/access-control.js',
    'platform-runtime': 'ghrab/ghrab-platform.js',
    'revoked-access.json': 'access/revoked-access.json',
    'integrity-status': 'integrity-status.json',
    'runtime-config': 'runtime-config.js'
  };
  if (special[c]) return special[c];
  if (c.includes('/') || /\.[A-Za-z0-9_-]+$/.test(c)) return c;
  return `access/${c}.js`;
}
const CANONICAL_MINIMUM_CRITICAL_ASSETS = [
  'app-guard', 'access-control', 'platform-runtime', 'access/deployment-config.js',
  'revoked-access.json', 'runtime-config', 'config/deployment.json',
  'config/deployment.school-server.json', 'release-integrity.json',
  'release-integrity.sig', 'integrity-status'
];
const appCriticalRepresentativePaths = new Set(critical.map(criticalRepresentativePath).map(norm));
const missingCanonicalCriticalAssets = CANONICAL_MINIMUM_CRITICAL_ASSETS.filter(entry => !appCriticalRepresentativePaths.has(norm(criticalRepresentativePath(entry))));
const canonicalCriticalInventory = {
  minimum: CANONICAL_MINIMUM_CRITICAL_ASSETS,
  applicationCount: critical.length,
  missing: missingCanonicalCriticalAssets,
  pass: missingCanonicalCriticalAssets.length === 0
};
if (!canonicalCriticalInventory.pass) findings.push({
  severity: 'HIGH', issue: 'application security-critical asset inventory is narrower than canonical GARP minimum', detail: canonicalCriticalInventory
});

function normalizeSecurityPathForChecker(input) {
  let relative = String(input || '');
  try { relative = decodeURIComponent(relative); }
  catch { return { failClosed: true, normalized: null, reason: 'malformed-percent' }; }
  relative = relative.replace(/\\/g, '/');
  const segments = [];
  for (const segment of relative.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') {
      if (!segments.length) return { failClosed: true, normalized: null, reason: 'scope-escape' };
      segments.pop();
      continue;
    }
    segments.push(segment);
  }
  return { failClosed: false, normalized: norm(segments.join('/')), reason: null };
}
function percentByte(ch, lower = false) {
  const code = ch.codePointAt(0);
  if (code > 0x7f) return null;
  const hex = code.toString(16).padStart(2, '0');
  return '%' + (lower ? hex.toLowerCase() : hex.toUpperCase());
}
function oneStepSameResourceMutations(value) {
  const out = new Set();
  const text = String(value || '');
  // Segment-level equivalences. These are generated from the normalization rule,
  // not from a fixed list of previously observed bypass strings.
  out.add('./' + text);
  out.add('probe/../' + text);
  out.add('probe/%2E%2E/' + text);
  out.add('probe/%2e%2e/' + text);
  // Keep encoded separators around dot segments so the URL parser cannot
  // pre-normalize them away before the service worker sees pathname.
  out.add('probe%2F%2E%2E%2F' + text);
  out.add('probe%2f%2e%2e%2f' + text);
  out.add('.//' + text);
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const upper = percentByte(ch, false), lower = percentByte(ch, true);
    if (upper) out.add(text.slice(0, i) + upper + text.slice(i + 1));
    if (lower) out.add(text.slice(0, i) + lower + text.slice(i + 1));
    if (ch === '/') {
      out.add(text.slice(0, i) + '//' + text.slice(i + 1));
      out.add(text.slice(0, i) + '/./' + text.slice(i + 1));
      out.add(text.slice(0, i) + '/probe/../' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2F' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2f' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2F%2F' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2f%2f' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2F%2f' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2f%2F' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2F%2E/' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2f%2e/' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2Fprobe%2F%2E%2E/' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2fprobe%2f%2e%2e/' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%5C' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%5c' + text.slice(i + 1));
    }
    if (ch === '.') {
      out.add(text.slice(0, i) + '%2E' + text.slice(i + 1));
      out.add(text.slice(0, i) + '%2e' + text.slice(i + 1));
    }
  }
  return [...out];
}
function stableSeed(text) {
  let h = 2166136261 >>> 0;
  for (const ch of String(text || '')) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h || 0x9e3779b9;
}
function seededNext(state) {
  let x = state.value >>> 0;
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
  state.value = x >>> 0;
  return state.value;
}
function criticalPathVariants(path) {
  const base = norm(path);
  const fastSelftest = process.env.GHRAB_GARP_SELFTEST === '1';
  const deepLimit = fastSelftest ? 8 : 24;
  const fuzzAttempts = fastSelftest ? 8 : 128;
  const fuzzDepthLimit = fastSelftest ? 8 : 24;
  const variants = new Map();
  const add = (requestPath, label, query = '') => {
    let observedPath = String(requestPath || '');
    try {
      const scopePath = '/__ghrab_scope__/';
      const parsed = new URL(`https://example.invalid${scopePath}${requestPath}${query || ''}`);
      if (!parsed.pathname.startsWith(scopePath)) return;
      observedPath = parsed.pathname.slice(scopePath.length);
    } catch { return; }
    const normalized = normalizeSecurityPathForChecker(observedPath);
    if (normalized.failClosed || normalized.normalized !== base) return;
    const key = `${requestPath}|${query}`;
    if (!variants.has(key)) variants.set(key, { urlVariant: label, requestPath, query, observedPath, normalizedPath: normalized.normalized });
  };
  add(base, 'canonical');
  add(base, 'canonical-query', '?ghrab_audit=1');

  // Unbounded-class regression anchors: depth is deliberately much greater than any previous bypass.
  for (let depth = 1; depth <= deepLimit; depth++) {
    add('.//'.repeat(depth) + base, `normalization-depth-dot-slash-${depth}`);
    add('probe/../'.repeat(depth) + base, `normalization-depth-dotdot-${depth}`);
    add('probe%2F%2E%2E%2F'.repeat(depth) + base, `normalization-depth-encoded-dotdot-${depth}`);
  }

  const first = oneStepSameResourceMutations(base);
  for (const value of first) add(value, 'normalization-closure-1');

  // Deterministic property fuzz: repeatedly compose normalization-preserving mutations.
  // The reference normalizer is the oracle; only real same-resource forms are kept.
  const rng = { value: stableSeed(`GHRAB-R8:${base}`) };
  const accepted = first.filter(v => {
    try {
      const parsed = new URL(`https://example.invalid/__ghrab_scope__/${v}`);
      const observed = parsed.pathname.slice('/__ghrab_scope__/'.length);
      const n = normalizeSecurityPathForChecker(observed);
      return !n.failClosed && n.normalized === base;
    } catch { return false; }
  });
  const pool = [base, ...accepted];
  for (let attempt = 0; attempt < fuzzAttempts; attempt++) {
    let value = pool[seededNext(rng) % pool.length];
    const depth = 1 + (seededNext(rng) % fuzzDepthLimit);
    for (let d = 0; d < depth; d++) {
      const choices = oneStepSameResourceMutations(value);
      if (!choices.length) break;
      value = choices[seededNext(rng) % choices.length];
    }
    add(value, `normalization-fuzz-depth-${depth}`);
  }

  // Malformed percent is a fail-closed property of the shipped predicate.
  variants.set(`${base}%|`, { urlVariant: 'malformed-percent-fail-closed', requestPath: `${base}%`, query: '', expectedFailClosed: true, normalizedPath: null });
  return [...variants.values()];
}

function criticalBehaviorCases() {
  const byPath = new Map();
  for (const entry of critical) {
    const rel = criticalRepresentativePath(entry);
    byPath.set(rel, { path: rel, authority: entry, source: 'authoritative-list', inDeployment: files.includes(rel) });
  }
  for (const file of criticalFiles) {
    if (!byPath.has(file)) byPath.set(file, { path: file, authority: file, source: 'deployment-match', inDeployment: true });
    else byPath.get(file).inDeployment = true;
  }
  return [...byPath.values()];
}
const criticalCases = criticalBehaviorCases();
const securityCriticalFn = extractFunction('isSecurityCriticalRequest');
function behavioralCriticalGuard() {
  const source = extractFunctionSource('isSecurityCriticalRequest');
  const cases = [];
  if (!source) return { status: 'FAIL', reason: 'guard-function-missing', cases, checkedAuthoritative: 0 };
  const forbidden = /\b(?:eval|Function|process|require|globalThis|WebAssembly|Proxy|Reflect|constructor|__proto__|Promise|queueMicrotask|setTimeout|setInterval|setImmediate|Atomics|async|await)\b/;
  if (forbidden.test(source)) return { status: 'FAIL', reason: 'guard-function-not-safe-for-bounded-eval', cases, checkedAuthoritative: 0 };
  try {
    const context = createContext(Object.create(null));
    new Script(`${source}; this.__ghrabGuard = isSecurityCriticalRequest;`).runInContext(context, { timeout: 50 });
    const fn = context.__ghrabGuard;
    if (typeof fn !== 'function') return { status: 'FAIL', reason: 'guard-function-not-callable', cases, checkedAuthoritative: 0 };
    const scopePath = '/__ghrab_scope__/';
    for (const spec of criticalCases) {
      for (const variant of criticalPathVariants(spec.path)) {
        const pathname = scopePath + (variant.observedPath || variant.requestPath);
        let actual = false;
        try { actual = fn({ pathname }, scopePath) === true; }
        catch (e) { cases.push({ ...spec, ...variant, expected: true, actual: 'ERROR', error: String(e) }); continue; }
        cases.push({ ...spec, ...variant, expected: true, actual });
      }
    }
    for (const file of ['index.html', 'assets/app.js', 'manual/index.html']) {
      if (criticalCases.some(c => norm(c.path) === norm(file))) continue;
      const pathname = scopePath + file;
      let actual = false;
      try { actual = fn({ pathname }, scopePath) === true; }
      catch (e) { cases.push({ path: file, source: 'negative-control', expected: false, actual: 'ERROR', error: String(e) }); continue; }
      cases.push({ path: file, source: 'negative-control', expected: false, actual });
    }
    const falseNegatives = cases.filter(c => c.expected === true && c.actual !== true);
    const falsePositives = cases.filter(c => c.expected === false && c.actual !== false);
    return {
      status: falseNegatives.length ? 'FAIL' : (falsePositives.length ? 'AMBER' : 'PASS'),
      checkedAuthoritative: criticalCases.length,
      checkedDeployed: criticalCases.filter(c => c.inDeployment).length,
      cases, falseNegatives, falsePositives
    };
  } catch (e) {
    return { status: 'FAIL', reason: 'guard-behavior-eval-error', error: String(e), cases, checkedAuthoritative: criticalCases.length };
  }
}
const behavioralGuard = behavioralCriticalGuard();
if ((behavioralGuard.falseNegatives || []).length) findings.push({
  severity: 'HIGH', issue: 'security-critical predicate behavioralne nechrani autoritativni kriticky asset',
  detail: { failedCount: behavioralGuard.falseNegatives.length, sample: behavioralGuard.falseNegatives.slice(0, 8) }
});
if (behavioralGuard.status === 'FAIL' && !(behavioralGuard.falseNegatives || []).length) findings.push({
  severity: 'HIGH', issue: 'security-critical predicate nelze behavioralne overit', detail: behavioralGuard
});
if ((behavioralGuard.falsePositives || []).length) findings.push({
  severity: 'MEDIUM', issue: 'security-critical predicate je behavioralne prilis siroky',
  detail: { failedCount: behavioralGuard.falsePositives.length, sample: behavioralGuard.falsePositives.slice(0, 8) }
});
const behaviorallyProtected = new Set(criticalCases.filter(spec => {
  const relevant = (behavioralGuard.cases || []).filter(c => c.expected === true && norm(c.path) === norm(spec.path));
  return relevant.length > 0 && relevant.every(c => c.actual === true);
}).map(c => norm(c.path)));

function extractFetchHandlerSource() {
  let m = /addEventListener\s*\(\s*['"]fetch['"]\s*,\s*\(([^)]*)\)\s*=>\s*\{/.exec(sw);
  if (m) {
    const open = m.index + m[0].lastIndexOf('{'), end = scanBalanced(sw, open, '{', '}');
    if (end > open) return `(${m[1]}) => ${sw.slice(open, end + 1)}`;
  }
  m = /addEventListener\s*\(\s*['"]fetch['"]\s*,\s*([A-Za-z_$][\w$]*)\s*=>\s*\{/.exec(sw);
  if (m) {
    const open = m.index + m[0].lastIndexOf('{'), end = scanBalanced(sw, open, '{', '}');
    if (end > open) return `(${m[1]}) => ${sw.slice(open, end + 1)}`;
  }
  m = /addEventListener\s*\(\s*['"]fetch['"]\s*,\s*function\s*\(([^)]*)\)\s*\{/.exec(sw);
  if (m) {
    const open = m.index + m[0].lastIndexOf('{'), end = scanBalanced(sw, open, '{', '}');
    if (end > open) return `function(${m[1]}) ${sw.slice(open, end + 1)}`;
  }
  return '';
}
function makeTrackedURLConstructor(state) {
  const allowedPreGuard = new Set(['origin', 'pathname']);
  return function TrackedURL(input, base) {
    const url = new URL(input, base);
    return new Proxy(url, {
      get(target, prop) {
        if (state.phase === 'pre-guard' && typeof prop === 'string' && !allowedPreGuard.has(prop)) {
          state.preGuardReads.add(`url.${prop}`);
        } else if (state.phase === 'guard-or-later' && typeof prop === 'string') {
          state.postGuardReads.add(`url.${prop}`);
        }
        const value = Reflect.get(target, prop, target);
        return typeof value === 'function' ? value.bind(target) : value;
      }
    });
  };
}
function noteRequestRead(state, prop, kind = 'get') {
  const key = typeof prop === 'symbol' ? prop.toString() : String(prop);
  if (state.phase === 'pre-guard') {
    const allowed = new Set(['method', 'url']);
    if (!allowed.has(key)) state.preGuardReads.add(`request.${kind}:${key}`);
  } else if (state.phase === 'guard-or-later') {
    state.postGuardReads.add(`request.${kind}:${key}`);
  }
}
function makeTrackedRequest(state, spec) {
  const headers = Object.freeze({ get(){ return null; }, has(){ return false; }, entries(){ return [][Symbol.iterator](); } });
  const values = Object.freeze({
    method: 'GET',
    url: `https://example.invalid/__ghrab_scope__/${spec.requestPath || norm(spec.path)}${spec.query || ''}`,
    headers,
    destination: 'script',
    referrer: 'https://example.invalid/__ghrab_scope__/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    mode: 'no-cors',
    credentials: 'same-origin',
    cache: 'default',
    redirect: 'follow',
    integrity: '',
    keepalive: false,
    signal: null,
    body: null,
    bodyUsed: false,
    duplex: 'half'
  });
  const target = Object.create(null);
  return new Proxy(target, {
    get(_target, prop) {
      if (prop === Symbol.toStringTag) return 'Request';
      noteRequestRead(state, prop, 'get');
      return values[prop];
    },
    has(_target, prop) {
      noteRequestRead(state, prop, 'has');
      return Object.prototype.hasOwnProperty.call(values, prop);
    },
    ownKeys() {
      noteRequestRead(state, '[[ownKeys]]', 'reflect');
      return [];
    },
    getOwnPropertyDescriptor(_target, prop) {
      noteRequestRead(state, prop, 'descriptor');
      return undefined;
    },
    getPrototypeOf() {
      noteRequestRead(state, '[[prototype]]', 'reflect');
      return Object.prototype;
    }
  });
}
function makeTrackedEvent(state, request, respondCalls) {
  const allowedPreGuard = new Set(['request']);
  const base = {
    request,
    clientId: 'client-1',
    resultingClientId: '',
    replacesClientId: '',
    preloadResponse: Promise.resolve(undefined),
    handled: Promise.resolve(undefined),
    respondWith(value) {
      const route = value && value.__ghrabRoute ? value.__ghrabRoute : 'unknown';
      if (state.phase === 'pre-guard') state.preGuardEffects.add(`event.respondWith:${route}`);
      respondCalls.push(route);
    },
    waitUntil() {}
  };
  return new Proxy(base, {
    get(target, prop, receiver) {
      if (state.phase === 'pre-guard' && typeof prop === 'string' && !allowedPreGuard.has(prop)) {
        state.preGuardReads.add(`event.${prop}`);
      } else if (state.phase === 'guard-or-later' && typeof prop === 'string' && prop !== 'respondWith') {
        state.postGuardReads.add(`event.${prop}`);
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
let runtimeFetchHarness = null;
async function fetchHandlerRegistrationSummary() {
  const registrations = [], onfetchAssignments = [], topLevelEffects = [], lifecycleEffects = [], lifecycleErrors = [], deferredFetchRegistrations = [], registrationCapabilityEscapes = [];
  let phase = 'top-level';
  let activeTrace = null;
  const recordEffect = value => {
    (phase === 'top-level' ? topLevelEffects : lifecycleEffects).push(value);
    if (activeTrace) activeTrace.effects.push(value);
  };
  const dynamicCodeCalls = [];
  const addEventListener = function(type, handler) {
    registrations.push({ type: String(type), callable: typeof handler === 'function', handler, phase });
  };
  const cache = Object.freeze({
    addAll(...args){ recordEffect('cache.addAll'); if (activeTrace) activeTrace.cacheCalls.push({ method: 'addAll', args }); return Promise.resolve(); },
    add(...args){ recordEffect('cache.add'); if (activeTrace) activeTrace.cacheCalls.push({ method: 'add', args }); return Promise.resolve(); },
    put(...args){ recordEffect('cache.put'); if (activeTrace) activeTrace.cacheCalls.push({ method: 'put', args }); return Promise.resolve(); },
    match(...args){ recordEffect('cache.match'); if (activeTrace) activeTrace.cacheCalls.push({ method: 'match', args }); return Promise.resolve(null); }
  });
  const originalCaches = Object.freeze({
    open(name){ recordEffect('caches.open'); if (activeTrace) activeTrace.cacheCalls.push({ method: 'open', name }); return Promise.resolve(cache); },
    match(...args){ recordEffect('caches.match'); if (activeTrace) activeTrace.cacheCalls.push({ method: 'match-global', args }); return Promise.resolve(null); },
    delete(...args){ recordEffect('caches.delete'); if (activeTrace) activeTrace.cacheCalls.push({ method: 'delete', args }); return Promise.resolve(false); },
    keys(){ recordEffect('caches.keys'); if (activeTrace) activeTrace.cacheCalls.push({ method: 'keys' }); return Promise.resolve([]); }
  });
  class SandboxURL extends URL {}
  class SandboxRequest {}
  class SandboxResponse {}
  const originalFetch = function(request, options = undefined) {
    recordEffect('fetch');
    if (activeTrace) activeTrace.fetchCalls.push({ request, options: options && typeof options === 'object' ? { ...options } : options });
    return Promise.resolve(Object.freeze({ ok: true, status: 200, clone(){ return this; } }));
  };
  const SandboxFunction = function(){ dynamicCodeCalls.push({ kind: 'Function', phase }); throw new Error('GHRAB_DYNAMIC_CODE_BLOCKED'); };
  const sandbox = {
    URL: SandboxURL,
    Request: SandboxRequest,
    Response: SandboxResponse,
    console: Object.freeze({ log(){}, warn(){}, error(){} }),
    fetch: originalFetch,
    caches: originalCaches,
    eval(){ dynamicCodeCalls.push({ kind: 'eval', phase }); throw new Error('GHRAB_DYNAMIC_CODE_BLOCKED'); },
    Function: SandboxFunction,
    importScripts(){ dynamicCodeCalls.push({ kind: 'importScripts', phase }); throw new Error('GHRAB_DYNAMIC_CODE_BLOCKED'); }
  };
  const context = createContext(sandbox);
  // R10/N68 behavioral backstop. Trap Function.prototype.constructor in the audited realm;
  // this catches destructuring and prototype chains regardless of spelling around them.
  try {
    new Script(`Object.defineProperty(Function.prototype,'constructor',{configurable:false,get(){throw new Error('GHRAB_DYNAMIC_FUNCTION_CONSTRUCTOR_BLOCKED')}});`).runInContext(context, { timeout: 30 });
  } catch (e) {
    dynamicCodeCalls.push({ kind: 'Function.prototype.constructor-trap-install', phase, error: String(e) });
  }
  // Model ServiceWorkerGlobalScope with one realm, while keeping trusted references in host scope.
  context.self = context;
  Object.defineProperty(context, 'addEventListener', { value: addEventListener, writable: false, configurable: false, enumerable: true });
  context.location = Object.freeze({ origin: 'https://example.invalid', href: 'https://example.invalid/__ghrab_scope__/sw.js' });
  context.registration = Object.freeze({ scope: 'https://example.invalid/__ghrab_scope__/' });
  context.clients = Object.freeze({ claim(){ recordEffect('self.clients.claim'); return Promise.resolve(); } });
  context.skipWaiting = function(){ recordEffect('self.skipWaiting'); return Promise.resolve(); };
  Object.defineProperty(context, 'onfetch', {
    configurable: false,
    enumerable: true,
    get(){ return undefined; },
    set(value){ onfetchAssignments.push({ callable: typeof value === 'function', source: 'global.set', phase }); }
  });
  let error = null;
  try { new Script(sw).runInContext(context, { timeout: 100 }); }
  catch (e) { error = String(e); }

  let resolvedIdentity = null;
  try {
    resolvedIdentity = new Script('({fetch,URL,caches,Request,Response,addEventListener,onfetch})').runInContext(context, { timeout: 30 });
  } catch (e) {
    if (!error) error = `identity-probe:${String(e)}`;
  }
  const identityProbe = resolvedIdentity ? {
    fetch: resolvedIdentity.fetch === originalFetch,
    URL: resolvedIdentity.URL === SandboxURL,
    caches: resolvedIdentity.caches === originalCaches,
    Request: resolvedIdentity.Request === SandboxRequest,
    Response: resolvedIdentity.Response === SandboxResponse,
    addEventListener: resolvedIdentity.addEventListener === addEventListener,
    onfetch: resolvedIdentity.onfetch === undefined
  } : null;
  const platformIdentityPass = !!identityProbe && [...GLOBAL_SECURITY_DEPENDENCIES, 'addEventListener', 'onfetch'].every(name => identityProbe[name] === true);

  const countFetch = () => registrations.filter(r => r.type === 'fetch').length + onfetchAssignments.length;
  const initialFetchCount = countFetch();
  if (!error) {
    phase = 'lifecycle';
    const topHandlers = registrations.filter(r => r.phase === 'top-level' && r.callable && r.type !== 'fetch');
    for (const reg of topHandlers) {
      const source = Function.prototype.toString.call(reg.handler);
      if (/\baddEventListener\b|\bonfetch\b/.test(source)) {
        registrationCapabilityEscapes.push({ trigger: reg.type, reason: 'registration-capability-referenced-inside-event-handler' });
      }
      const variants = reg.type === 'message'
        ? [
            { data: { type: '__GHRAB_AUDIT__' } },
            { data: { type: 'GHRAB_SKIP_WAITING' } },
            { data: { type: 'GHRAB_TURBO' } },
            { data: null }
          ]
        : [{ data: null }];
      for (const variant of variants) {
        const waits = [];
        const event = {
          ...variant,
          tag: 'sync',
          lastChance: false,
          notification: Object.freeze({ data: null }),
          waitUntil(value){ waits.push(Promise.resolve(value)); },
          respondWith(){},
          request: Object.freeze({ method: 'GET', url: 'https://example.invalid/__ghrab_scope__/index.html' })
        };
        const before = countFetch();
        try {
          const returned = reg.handler(event);
          if (returned && typeof returned.then === 'function') await returned;
          if (waits.length) await Promise.allSettled(waits);
          await Promise.resolve();
          await Promise.resolve();
        } catch (e) {
          lifecycleErrors.push({ type: reg.type, error: String(e) });
        }
        const after = countFetch();
        if (after > before) deferredFetchRegistrations.push({ trigger: reg.type, added: after - before });
      }
    }
    phase = 'done';
  }

  const fetchRegistrations = registrations.filter(r => r.type === 'fetch');
  const invalidFetchHandlers = fetchRegistrations.filter(r => !r.callable).length + onfetchAssignments.filter(r => !r.callable).length;
  const total = fetchRegistrations.length + onfetchAssignments.length;
  const selectedFetchHandler = initialFetchCount === 1 && fetchRegistrations.length >= 1 && typeof fetchRegistrations[0].handler === 'function'
    ? fetchRegistrations[0].handler
    : null;
  const selectedFetchHandlerSource = selectedFetchHandler ? Function.prototype.toString.call(selectedFetchHandler) : '';
  runtimeFetchHarness = selectedFetchHandler ? {
    handler: selectedFetchHandler,
    activateTrace(trace){ activeTrace = trace; },
    clearTrace(){ activeTrace = null; }
  } : null;
  return {
    addEventListenerCount: fetchRegistrations.length,
    onfetchAssignments: onfetchAssignments.length,
    total,
    initialFetchCount,
    invalidFetchHandlers,
    topLevelEffects,
    lifecycleEffects,
    lifecycleErrors,
    deferredFetchRegistrations,
    registrationCapabilityEscapes,
    dynamicCodeCalls,
    platformIdentity: identityProbe,
    platformIdentityPass,
    registrations: registrations.map(r => ({ type: r.type, callable: r.callable, phase: r.phase })),
    selectedFetchHandlerSource,
    error,
    pass: !error && registrationCapability.pass && dynamicCodeCalls.length === 0 && platformIdentityPass && topLevelEffects.length === 0 && initialFetchCount === 1 && total === 1 && invalidFetchHandlers === 0 && deferredFetchRegistrations.length === 0 && registrationCapabilityEscapes.length === 0 && lifecycleErrors.length === 0
  };
}

const fetchHandlerRegistrations = await fetchHandlerRegistrationSummary();
if (!fetchHandlerRegistrations.platformIdentityPass) findings.push({
  severity: 'HIGH', issue: 'platform security dependency runtime identity changed or was shadowed', detail: fetchHandlerRegistrations.platformIdentity
});
for (const item of fetchHandlerRegistrations.deferredFetchRegistrations || []) findings.push({
  severity: 'HIGH', issue: 'deferred fetch handler registration detected behaviorally', detail: item
});
for (const item of fetchHandlerRegistrations.registrationCapabilityEscapes || []) findings.push({
  severity: 'HIGH', issue: 'event handler retains fetch-registration capability', detail: item
});
for (const item of fetchHandlerRegistrations.dynamicCodeCalls || []) findings.push({
  severity: 'HIGH', issue: 'dynamic/eval-like capability invoked in service-worker sandbox', detail: item
});
async function behavioralRegisteredFetchClosureGuard() {
  const cases = [];
  if (!fetchHandlerRegistrations.pass || !runtimeFetchHarness) {
    return { status: 'FAIL', reason: 'fetch-runtime-harness-unavailable', cases, checkedAuthoritative: criticalCases.length };
  }
  const routeCases = criticalCases.flatMap(spec => criticalPathVariants(spec.path).map(variant => ({ ...spec, ...variant })));
  for (const spec of routeCases) {
    const trace = { fetchCalls: [], cacheCalls: [], effects: [] };
    const request = Object.freeze({
      method: 'GET',
      url: `https://example.invalid/__ghrab_scope__/${spec.requestPath}${spec.query || ''}`,
      cache: 'default',
      mode: 'no-cors',
      destination: 'script',
      headers: Object.freeze({ get(){ return null; } })
    });
    let respondPromise = null, respondCalls = 0, error = null;
    const event = Object.freeze({
      request,
      respondWith(value){ respondCalls++; respondPromise = Promise.resolve(value); },
      waitUntil(){}
    });
    runtimeFetchHarness.activateTrace(trace);
    try {
      const returned = runtimeFetchHarness.handler(event);
      if (returned && typeof returned.then === 'function') await returned;
      if (respondPromise) await respondPromise;
      await Promise.resolve();
      await Promise.resolve();
    } catch (e) { error = String(e); }
    finally { runtimeFetchHarness.clearTrace(); }
    const cacheWrites = trace.cacheCalls.filter(c => ['put', 'add', 'addAll'].includes(c.method));
    const cacheTouches = trace.cacheCalls.filter(c => !['keys', 'delete'].includes(c.method));
    const noStoreFetches = trace.fetchCalls.filter(c => c.options && c.options.cache === 'no-store');
    const pass = !error && respondCalls === 1 && trace.fetchCalls.length === 1 && noStoreFetches.length === 1 && cacheWrites.length === 0 && cacheTouches.length === 0;
    cases.push({ ...spec, respondCalls, fetchCalls: trace.fetchCalls.map(c => ({ options: c.options || null })), cacheCalls: trace.cacheCalls.map(c => ({ method: c.method })), error, pass });
  }
  const failed = cases.filter(c => !c.pass);
  return { status: failed.length ? 'FAIL' : 'PASS', checkedAuthoritative: criticalCases.length, evaluatedCases: cases.length, cases, failed };
}
const registeredFetchClosureBehavior = await behavioralRegisteredFetchClosureGuard();
if ((registeredFetchClosureBehavior.failed || []).length) findings.push({
  severity: 'HIGH', issue: 'actual registered fetch closure bypasses critical network-only/no-store invariant',
  detail: { failedCount: registeredFetchClosureBehavior.failed.length, sample: registeredFetchClosureBehavior.failed.slice(0, 8) }
});
if (registeredFetchClosureBehavior.status === 'FAIL' && !(registeredFetchClosureBehavior.failed || []).length) findings.push({
  severity: 'HIGH', issue: 'actual registered fetch closure cannot be behaviorally verified', detail: registeredFetchClosureBehavior
});

function behavioralFetchRouteGuard() {
  if (!fetchHandlerRegistrations.pass) return { status: 'FAIL', reason: 'fetch-handler-registration-ambiguous', registrations: fetchHandlerRegistrations, cases: [], checkedAuthoritative: criticalCases.length };
  const handlerSource = fetchHandlerRegistrations.selectedFetchHandlerSource || '';
  const predicateSource = extractFunctionSource('isSecurityCriticalRequest');
  const runtimeSource = extractFunctionSource('isRuntimeRequest') || 'function isRuntimeRequest(){ return false; }';
  const cases = [];
  const routeCases = criticalCases.flatMap(spec => criticalPathVariants(spec.path).map(variant => ({ ...spec, ...variant })));
  if (!handlerSource) return { status: 'FAIL', reason: 'fetch-handler-not-recognized', cases, checkedAuthoritative: criticalCases.length };
  if (!predicateSource) return { status: 'FAIL', reason: 'guard-function-missing', cases, checkedAuthoritative: criticalCases.length };
  const trackedHandlerSource = handlerSource.replace(/\bisSecurityCriticalRequest\s*\(/g, '__ghrabTrackedSecurityCriticalRequest(');
  const evalSource = `${predicateSource}\n${runtimeSource}\nfunction __ghrabTrackedSecurityCriticalRequest(...args){ __ghrabBeginGuard(); try { return isSecurityCriticalRequest(...args); } finally { __ghrabEndGuard(); } }\nthis.__ghrabFetchHandler = (${trackedHandlerSource});`;
  const forbidden = /\b(?:eval|Function|process|require|globalThis|WebAssembly|Proxy|Reflect|constructor|__proto__|Promise|queueMicrotask|setTimeout|setInterval|setImmediate|Atomics|async|await)\b/;
  if (forbidden.test(evalSource)) return { status: 'FAIL', reason: 'fetch-handler-not-safe-for-bounded-eval', cases, checkedAuthoritative: criticalCases.length };
  try {
    for (const spec of routeCases) {
      const state = { phase: 'pre-guard', preGuardReads: new Set(), postGuardReads: new Set(), preGuardEffects: new Set(), routeEffects: [] };
      const respondCalls = [];
      const request = makeTrackedRequest(state, spec);
      const event = makeTrackedEvent(state, request, respondCalls);
      const context = createContext({
        URL: makeTrackedURLConstructor(state),
        console: Object.freeze({ log(){}, warn(){}, error(){} }),
        self: Object.freeze({
          location: Object.freeze({ origin: 'https://example.invalid', href: 'https://example.invalid/__ghrab_scope__/sw.js' }),
          registration: Object.freeze({ scope: 'https://example.invalid/__ghrab_scope__/' })
        }),
        __ghrabBeginGuard: () => { state.phase = 'guard-eval'; },
        __ghrabEndGuard: () => { state.phase = 'guard-or-later'; },
        networkOnlyNoStore: () => { state.routeEffects.push({ phase: state.phase, route: 'networkOnlyNoStore' }); if (state.phase === 'pre-guard') state.preGuardEffects.add('networkOnlyNoStore'); return Object.freeze({ __ghrabRoute: 'networkOnlyNoStore' }); },
        cacheFirst: () => { state.routeEffects.push({ phase: state.phase, route: 'cacheFirst' }); if (state.phase === 'pre-guard') state.preGuardEffects.add('cacheFirst'); return Object.freeze({ __ghrabRoute: 'cacheFirst' }); },
        networkFirst: () => { state.routeEffects.push({ phase: state.phase, route: 'networkFirst' }); if (state.phase === 'pre-guard') state.preGuardEffects.add('networkFirst'); return Object.freeze({ __ghrabRoute: 'networkFirst' }); },
        fetch: () => { state.routeEffects.push({ phase: state.phase, route: 'fetch' }); if (state.phase === 'pre-guard') state.preGuardEffects.add('fetch'); return Object.freeze({ __ghrabRoute: 'directFetch' }); },
        caches: Object.freeze({
          match: () => { state.routeEffects.push({ phase: state.phase, route: 'caches.match' }); if (state.phase === 'pre-guard') state.preGuardEffects.add('caches.match'); return Object.freeze({ __ghrabRoute: 'cacheMatch' }); },
          open: () => { state.routeEffects.push({ phase: state.phase, route: 'caches.open' }); if (state.phase === 'pre-guard') state.preGuardEffects.add('caches.open'); return Object.freeze({ __ghrabRoute: 'cacheOpen' }); },
          delete: () => { state.routeEffects.push({ phase: state.phase, route: 'caches.delete' }); if (state.phase === 'pre-guard') state.preGuardEffects.add('caches.delete'); return false; },
          keys: () => { state.routeEffects.push({ phase: state.phase, route: 'caches.keys' }); if (state.phase === 'pre-guard') state.preGuardEffects.add('caches.keys'); return []; }
        })
      });
      new Script(evalSource).runInContext(context, { timeout: 50 });
      const handler = context.__ghrabFetchHandler;
      if (typeof handler !== 'function') return { status: 'FAIL', reason: 'fetch-handler-not-callable', cases, checkedAuthoritative: criticalCases.length };
      let returned = null, error = null;
      try { returned = handler(event); }
      catch (e) { error = String(e); }
      const asyncUnsupported = returned && typeof returned.then === 'function';
      const preGuardReads = [...state.preGuardReads].sort();
      const postGuardReads = [...state.postGuardReads].sort();
      const preGuardEffects = [...state.preGuardEffects].sort();
      const routeEffects = [...state.routeEffects];
      const exactCriticalRoute = routeEffects.length === 1 && routeEffects[0].route === 'networkOnlyNoStore' && routeEffects[0].phase === 'guard-or-later';
      const pass = !error && !asyncUnsupported && preGuardReads.length === 0 && postGuardReads.length === 0 && preGuardEffects.length === 0 && exactCriticalRoute && respondCalls.length === 1 && respondCalls[0] === 'networkOnlyNoStore';
      cases.push({ ...spec, expectedRoute: 'networkOnlyNoStore', respondCalls, preGuardReads, postGuardReads, preGuardEffects, routeEffects, exactCriticalRoute, returnedAsync: !!asyncUnsupported, error, pass });
    }
    const failed = cases.filter(c => !c.pass);
    return {
      status: failed.length ? 'FAIL' : 'PASS',
      checkedAuthoritative: criticalCases.length,
      checkedDeployed: criticalCases.filter(c => c.inDeployment).length,
      evaluatedCases: routeCases.length,
      urlVariants: [...new Set(routeCases.map(c => c.urlVariant))],
      preGuardPolicy: {
        requestAllowed: ['method', 'url'],
        eventAllowed: ['request'],
        urlAllowed: ['origin', 'pathname'],
        rule: 'Exactly one fetch handler registration is permitted. Before the guard, routing-sensitive reads and all network/cache/respondWith effects are fail-closed. After a positive guard, the critical branch may read only event.respondWith and must produce exactly one total route effect: networkOnlyNoStore.'
      },
      cases, failed
    };
  } catch (e) {
    return { status: 'FAIL', reason: 'fetch-handler-behavior-eval-error', error: String(e), cases, checkedAuthoritative: criticalCases.length };
  }
}
const fetchRouteBehavior = behavioralFetchRouteGuard();
if ((fetchRouteBehavior.failed || []).length) findings.push({
  severity: 'HIGH', issue: 'fetch handler neroutuje kriticky asset fail-closed pres networkOnlyNoStore',
  detail: { failedCount: fetchRouteBehavior.failed.length, sample: fetchRouteBehavior.failed.slice(0, 8) }
});
if (fetchRouteBehavior.status === 'FAIL' && !(fetchRouteBehavior.failed || []).length) findings.push({
  severity: 'HIGH', issue: 'fetch handler nelze behavioralne overit', detail: fetchRouteBehavior
});

const selectedFetchHandlerSource = fetchHandlerRegistrations.selectedFetchHandlerSource || '';
let fetchBody = selectedFetchHandlerSource;
function analyzeStructuralNetworkOnlyGuard() {
  const m = /if\s*\(\s*isSecurityCriticalRequest\s*\(/.exec(fetchBody);
  if (!m) return { pass: false, reason: 'positive-guard-if-not-found' };
  const conditionOpen = fetchBody.indexOf('(', m.index), conditionEnd = scanBalanced(fetchBody, conditionOpen);
  if (conditionEnd < 0) return { pass: false, reason: 'guard-condition-unbalanced' };
  const condition = fetchBody.slice(conditionOpen + 1, conditionEnd).trim();
  if (!/^isSecurityCriticalRequest\s*\(/.test(condition)) return { pass: false, reason: 'guard-negated-or-wrapped', condition };
  let branchOpen = conditionEnd + 1;
  while (/\s/.test(fetchBody[branchOpen] || '')) branchOpen++;
  if (fetchBody[branchOpen] !== '{') return { pass: false, reason: 'guard-branch-not-block' };
  const branchEnd = scanBalanced(fetchBody, branchOpen, '{', '}');
  if (branchEnd < 0) return { pass: false, reason: 'guard-branch-unbalanced' };
  const branch = fetchBody.slice(branchOpen + 1, branchEnd);
  const preGuardBody = fetchBody.slice(0, m.index);
  const preGuardRespondWith = /\.\s*respondWith\s*\(/.test(preGuardBody);
  const hasRespondWithNetworkOnly = /\.\s*respondWith\s*\(\s*networkOnlyNoStore\s*\(/.test(branch);
  const hasReturn = /\breturn\b/.test(branch);
  const cacheFirstIdx = fetchBody.indexOf('cacheFirst');
  const pass = !preGuardRespondWith && hasRespondWithNetworkOnly && hasReturn && (cacheFirstIdx < 0 || branchEnd < cacheFirstIdx);
  return { pass, condition, preGuardRespondWith, hasRespondWithNetworkOnly, hasReturn, branchBeforeCacheFirst: cacheFirstIdx < 0 || branchEnd < cacheFirstIdx };
}
function networkOnlySinkShapeSummary() {
  const body = extractFunction('networkOnlyNoStore');
  if (!body) return { pass: false, reason: 'network-only-sink-missing-or-ambiguous', body: '' };
  const compact = body.replace(/\s+/g, ' ').trim();
  const exactMinimal = /^return\s+fetch\s*\(\s*request\s*,\s*\{\s*cache\s*:\s*['"]no-store['"]\s*\}\s*\)\s*;?$/.test(compact);
  const fetchCalls = [...body.matchAll(/\bfetch\s*\(/g)].length;
  const requestPropertyReads = [...body.matchAll(/\brequest\s*(?:\.|\[)/g)].length;
  const cacheApiTokens = /\bcaches\b|\.\s*(?:put|add|addAll|match|open|delete|keys)\s*\(|\[\s*['"](?:put|add|addAll|match|open|delete|keys)['"]\s*\]/.test(body);
  const controlFlow = /\b(?:if|switch|for|while|try|catch)\b|\?/.test(body);
  return { pass: exactMinimal && fetchCalls === 1 && requestPropertyReads === 0 && !cacheApiTokens && !controlFlow, exactMinimal, fetchCalls, requestPropertyReads, cacheApiTokens, controlFlow, compact };
}
function makeSinkTrackedRequest(state) {
  const target = Object.create(null);
  const values = Object.freeze({
    method: 'GET',
    url: 'https://example.invalid/__ghrab_scope__/runtime-config.js',
    destination: 'script', mode: 'no-cors', referrer: 'https://example.invalid/__ghrab_scope__/',
    headers: Object.freeze({ get(){ return null; }, has(){ return false; } }),
    cache: 'default', credentials: 'same-origin', redirect: 'follow', integrity: ''
  });
  return new Proxy(target, {
    get(_t, prop) {
      if (prop === Symbol.toStringTag) return 'Request';
      state.requestReads.add(typeof prop === 'symbol' ? prop.toString() : String(prop));
      return values[prop];
    },
    has(_t, prop) {
      state.reflectionReads.add(`has:${String(prop)}`);
      return Object.prototype.hasOwnProperty.call(values, prop);
    },
    ownKeys() {
      state.reflectionReads.add('ownKeys');
      return [];
    },
    getOwnPropertyDescriptor(_t, prop) {
      state.reflectionReads.add(`descriptor:${String(prop)}`);
      return undefined;
    },
    getPrototypeOf() {
      state.reflectionReads.add('getPrototypeOf');
      return Object.prototype;
    }
  });
}
async function behavioralNetworkOnlyNoStoreGuard() {
  const source = extractFunctionSource('networkOnlyNoStore');
  const sinkShape = networkOnlySinkShapeSummary();
  if (!source) return { status: 'FAIL', reason: 'network-only-sink-missing-or-ambiguous', sinkShape, fetchCalls: [], cacheCalls: [], requestReads: [], reflectionReads: [] };
  const forbidden = /\b(?:eval|Function|process|require|globalThis|WebAssembly|Proxy|Reflect|constructor|__proto__)\b/;
  if (forbidden.test(source)) return { status: 'FAIL', reason: 'network-only-sink-not-safe-for-bounded-eval', sinkShape, fetchCalls: [], cacheCalls: [], requestReads: [], reflectionReads: [] };
  if (!sinkShape.pass) return { status: 'FAIL', reason: 'network-only-sink-shape-fail-closed', sinkShape, fetchCalls: [], cacheCalls: [], requestReads: [], reflectionReads: [] };
  const fetchCalls = [], cacheCalls = [];
  const state = { requestReads: new Set(), reflectionReads: new Set() };
  const request = makeSinkTrackedRequest(state);
  const cacheTarget = Object.create(null);
  const cache = new Proxy(cacheTarget, {
    get(_t, prop) {
      const method = String(prop);
      return (...args) => { cacheCalls.push({ object: 'cache', method, argc: args.length }); return method === 'match' ? null : Promise.resolve(); };
    }
  });
  const cachesMock = new Proxy(Object.create(null), {
    get(_t, prop) {
      const method = String(prop);
      return (...args) => {
        cacheCalls.push({ object: 'caches', method, argc: args.length });
        if (method === 'open') return Promise.resolve(cache);
        if (method === 'keys') return Promise.resolve([]);
        if (method === 'match') return Promise.resolve(null);
        if (method === 'delete') return Promise.resolve(false);
        return Promise.resolve(null);
      };
    }
  });
  try {
    const context = createContext({
      CACHE_NAME: '__ghrab-security-test-cache__',
      caches: cachesMock,
      fetch: (req, options) => {
        const optionKeys = options && typeof options === 'object' ? Object.keys(options).sort() : [];
        fetchCalls.push({ sameRequest: req === request, optionKeys, cache: options?.cache ?? null });
        return Object.freeze({ ok: true, clone(){ return this; } });
      }
    });
    new Script(`${source}; this.__ghrabNetworkOnlyNoStore = networkOnlyNoStore;`).runInContext(context, { timeout: 50 });
    const fn = context.__ghrabNetworkOnlyNoStore;
    if (typeof fn !== 'function') return { status: 'FAIL', reason: 'network-only-sink-not-callable', sinkShape, fetchCalls, cacheCalls, requestReads: [...state.requestReads], reflectionReads: [...state.reflectionReads] };
    let result, error = null;
    try { result = await fn(request); } catch (e) { error = String(e); }
    const requestReads = [...state.requestReads].sort();
    const reflectionReads = [...state.reflectionReads].sort();
    const cacheWrites = cacheCalls.filter(c => ['put','add','addAll'].includes(c.method));
    const pass = sinkShape.pass && !error && fetchCalls.length === 1 && fetchCalls[0].sameRequest && fetchCalls[0].cache === 'no-store' && fetchCalls[0].optionKeys.length === 1 && fetchCalls[0].optionKeys[0] === 'cache' && cacheCalls.length === 0 && requestReads.length === 0 && reflectionReads.length === 0;
    return { status: pass ? 'PASS' : 'FAIL', sinkShape, error, fetchCalls, cacheCalls, cacheWrites, requestReads, reflectionReads, resultObserved: !!result };
  } catch (e) {
    return { status: 'FAIL', reason: 'network-only-sink-behavior-eval-error', sinkShape, error: String(e), fetchCalls, cacheCalls, cacheWrites: cacheCalls.filter(c => ['put','add','addAll'].includes(c.method)), requestReads: [...state.requestReads], reflectionReads: [...state.reflectionReads] };
  }
}
const networkOnlySinkBody = extractFunction('networkOnlyNoStore');
const networkOnlySinkStaticWrites = [
  ...networkOnlySinkBody.matchAll(/\.\s*(put|add|addAll)\s*\(/g),
  ...networkOnlySinkBody.matchAll(/\[\s*['"](put|add|addAll)['"]\s*\]/g)
].map(m => m[1]);
if (networkOnlySinkStaticWrites.length) findings.push({
  severity: 'CRITICAL', issue: 'networkOnlyNoStore obsahuje Cache API write', detail: networkOnlySinkStaticWrites
});
const networkOnlySink = await behavioralNetworkOnlyNoStoreGuard();
if ((networkOnlySink.cacheWrites || []).length) findings.push({
  severity: 'CRITICAL', issue: 'networkOnlyNoStore zapisuje do Cache API', detail: networkOnlySink
});
else if (networkOnlySink.status !== 'PASS') findings.push({
  severity: 'HIGH', issue: 'networkOnlyNoStore neprokazuje minimalni fail-closed kontrakt fetch(request,{cache:no-store})', detail: networkOnlySink
});

const structuralGuard = analyzeStructuralNetworkOnlyGuard();
const structuralNetworkOnlyGuard = structuralGuard.pass;
const criticalLiterals = [...securityCriticalFn.matchAll(/(['"`])((?:\\.|(?!\1)[\s\S])*)\1/g)]
  .filter(m => !(m[1] === '`' && m[2].includes('${'))).map(m => norm(m[2]));
const structurallyExempt = file => structuralNetworkOnlyGuard
  && fetchRouteBehavior.status === 'PASS'
  && networkOnlySink.status === 'PASS'
  && behaviorallyProtected.has(norm(file))
  && criticalLiterals.some(l => norm(file).includes(l) || l.includes(norm(file)));

const hasCacheFirst = /\bcacheFirst\s*\(/.test(sw)
  || /CacheFirst|StaleWhileRevalidate|staleWhileRevalidate/.test(sw)
  || /const\s+cached\s*=\s*await\s+cache(?:s)?\.match[\s\S]{0,240}if\s*\(\s*cached\s*\)\s*return\s+cached/.test(sw);
if (hasCacheFirst) {
  for (const f of criticalFiles) {
    if (!structurallyExempt(f)) findings.push({
      severity: 'HIGH', issue: 'security-critical asset nema strukturani isSecurityCriticalRequest -> networkOnlyNoStore vyjimku pred cache-first', detail: f
    });
  }
}

// Dynamic request writes in cacheFirst/networkFirst are accepted only with the proven early-return guard.
if (!structuralNetworkOnlyGuard) {
  for (const m of sw.matchAll(/\.\s*put\s*\(\s*request\s*,/g)) {
    const fn = enclosingFunctionName(m.index);
    if (['networkFirst','cacheFirst'].includes(fn)) noteUnresolved(m.index, 'put', 'request', 'unguarded-runtime-helper');
  }
}

// Any unresolved install/precache write is AMBER, never silent PASS. Unknown writes elsewhere are also
// AMBER unless explicitly recognized as the guarded runtime-request pattern above.
for (const u of unresolvedCacheWrites) findings.push({ severity: 'MEDIUM', issue: 'unresolved-cache-write', detail: u });

for (const p of precached) if (/release-integrity\.(json|sig)$/.test(p))
  findings.push({ severity: 'CRITICAL', issue: 'integritni artefakt je precachovan - integrity check by overoval zmrazenou verzi', detail: p });

function compactBehaviorReport(report) {
  if (!report || typeof report !== 'object') return report;
  const { cases = [], failed = [], falseNegatives = [], falsePositives = [], ...rest } = report;
  return {
    ...rest,
    caseCount: Array.isArray(cases) ? cases.length : 0,
    failedCount: Array.isArray(failed) ? failed.length : 0,
    falseNegativeCount: Array.isArray(falseNegatives) ? falseNegatives.length : 0,
    falsePositiveCount: Array.isArray(falsePositives) ? falsePositives.length : 0,
    failedSample: Array.isArray(failed) ? failed.slice(0, 8) : [],
    falseNegativeSample: Array.isArray(falseNegatives) ? falseNegatives.slice(0, 8) : [],
    falsePositiveSample: Array.isArray(falsePositives) ? falsePositives.slice(0, 8) : [],
    caseSample: Array.isArray(cases) ? cases.slice(0, 6) : []
  };
}
const blocking = findings.filter(f => f.severity === 'CRITICAL' || f.severity === 'HIGH');
const amber = findings.filter(f => f.severity === 'MEDIUM');
const status = blocking.length ? 'FAIL' : (amber.length ? 'AMBER' : 'PASS');
const out = {
  status,
  serviceWorker: swPath,
  criticalListSource: listArg || 'DEFAULT_CRITICAL(ad-hoc only; release gate must supply authoritative list)',
  precachedEntries: precached.size,
  precacheSources,
  unresolvedCacheWrites,
  cacheFirstDetected: hasCacheFirst,
  structuralNetworkOnlyGuard,
  structuralGuard,
  securityFunctionIdentity,
  globalDependencyIdentity,
  fetchRegistrationSyntax,
  canonicalCriticalInventory,
  behavioralGuard: compactBehaviorReport(behavioralGuard),
  fetchHandlerRegistrations,
  registeredFetchClosureBehavior: compactBehaviorReport(registeredFetchClosureBehavior),
  dynamicCodeFindings,
  fetchRouteBehavior: compactBehaviorReport(fetchRouteBehavior),
  networkOnlySink,
  criticalAssetsInDeployment: criticalFiles,
  authoritativeCriticalAssets: critical,
  swSecurityFreezePolicy: swFreezePolicyResult,
  canonicalSwFreezePolicy: canonicalPolicyResult,
  findings,
  checkerRevision: 'garp-2.5.1-r10-profile-binding-hotfix',
  note: 'R10 AUTO-PATCH closure: app-local SW freeze policy can be anchored byte-for-byte to canonical A-tooling control plane; required policy is fail-closed in AUTO-PATCH mode; registration laundering and computed global capability access are HIGH; URL property corpus includes repeated encoded separators; prototype-constructor eval-like paths are non-PASS. Non-proven critical behavior is non-PASS. Does not replace SIM-07 or LIVE server tests.'
};
console[status === 'PASS' ? 'log' : 'error'](JSON.stringify(out, null, 2));
process.exit(status === 'PASS' ? 0 : (status === 'AMBER' ? 2 : 1));
