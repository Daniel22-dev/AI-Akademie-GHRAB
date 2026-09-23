#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
function arg(name, fallback = null) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
}
const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(arg('--root', defaultRoot));
const outputArg = arg('--output', 'qa-results/garp27/architecture-result.json');
const output = path.isAbsolute(outputArg) ? outputArg : path.join(root, outputArg);
const posix = p => p.replaceAll('\\', '/');
const rel = p => posix(path.relative(root, p));
const read = p => fs.readFileSync(p, 'utf8');
const readJson = p => JSON.parse(read(p));
const sha256Buf = b => crypto.createHash('sha256').update(b).digest('hex');
const sha256File = p => sha256Buf(fs.readFileSync(p));
const exists = p => fs.existsSync(p);
const checks = [];
function check(id, pass, detail = null) { checks.push({ id, pass: Boolean(pass), ...(detail === null ? {} : { detail }) }); }
function listFiles(dir) {
  if (!exists(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}
function candidateFiles() {
  const excludedTop = new Set(['node_modules', 'dist-pages', 'dist-school-server', 'qa-results', '.git']);
  const excludedSecurity = [/^security\/sbom\//, /^security\/post-release\//, /^security\/post-release-auto-patch\//, /^security\/evidence\//];
  return listFiles(root).filter(file => {
    const r = rel(file);
    const top = r.split('/')[0];
    if (excludedTop.has(top)) return false;
    if (excludedSecurity.some(rx => rx.test(r))) return false;
    return true;
  });
}
function pathContentDigest(files) {
  const rows = files.map(file => `${sha256File(file)}  ${rel(file)}\n`).sort();
  return sha256Buf(Buffer.from(rows.join('')));
}
function resolveImport(fromFile, spec) {
  if (!spec.startsWith('.')) return { external: true, spec };
  let target = path.resolve(path.dirname(fromFile), spec);
  const tries = [target];
  if (!path.extname(target)) tries.push(`${target}.js`, path.join(target, 'index.js'));
  target = tries.find(exists) || target;
  return { external: false, target };
}
function parseStaticImports(source) {
  const found = [];
  const patterns = [
    /\bimport\s+(?:[^'"\n;]+?\s+from\s+)?['"]([^'"]+)['"]/g,
    /\bexport\s+[^'"\n;]+?\s+from\s+['"]([^'"]+)['"]/g
  ];
  for (const rx of patterns) {
    let m;
    while ((m = rx.exec(source))) found.push(m[1]);
  }
  return [...new Set(found)];
}
function parseDynamicImports(source) {
  const out = [];
  const rx = /\bimport\s*\(\s*([^)]*?)\s*\)/g;
  let m;
  while ((m = rx.exec(source))) {
    const raw = m[1].trim();
    const literal = raw.match(/^(['"])(.*?)\1$/s);
    out.push({ raw, literal: literal ? literal[2] : null });
  }
  return out;
}
function findCycles(graph) {
  const cycles = [];
  const state = new Map();
  const stack = [];
  function visit(node) {
    state.set(node, 1); stack.push(node);
    for (const next of graph.get(node) || []) {
      if (!graph.has(next)) continue;
      if (!state.has(next)) visit(next);
      else if (state.get(next) === 1) {
        const i = stack.indexOf(next);
        cycles.push([...stack.slice(i), next]);
      }
    }
    stack.pop(); state.set(node, 2);
  }
  for (const node of graph.keys()) if (!state.has(node)) visit(node);
  const uniq = new Map();
  for (const c of cycles) uniq.set(c.join(' -> '), c);
  return [...uniq.values()];
}

let pkg, policy, inventory, arch, profile;
try {
  pkg = readJson(path.join(root, 'package.json'));
  policy = readJson(path.join(root, 'security/garp27/garp27-policy.json'));
  inventory = readJson(path.join(root, 'security/garp27/capability-inventory.json'));
  arch = readJson(path.join(root, 'security/garp27/architecture-policy.json'));
  profile = readJson(path.join(root, 'security/garp27/application-migration-profile.json'));
} catch (error) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const result = { classification: 'APP_BEHAVIOR_TEST', status: 'HARNESS_ERROR', message: error.message };
  fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
  console.error(JSON.stringify(result, null, 2));
  process.exit(2);
}

const versions = { package: pkg.version, policy: policy.appVersion, inventory: inventory.appVersion, architecture: arch.appVersion, profile: profile.appVersion };
check('identity:app-id', policy.appId === 'ai-akademie' && inventory.appId === 'ai-akademie' && arch.appId === 'ai-akademie' && profile.appId === 'ai-akademie', { policy: policy.appId, inventory: inventory.appId, architecture: arch.appId, profile: profile.appId });
check('identity:garp-version', [policy, inventory, arch, profile].every(x => x.garpVersion === '2.7'), 'all application contracts must be GARP 2.7');
check('identity:version-coherence', Object.values(versions).every(v => v === pkg.version), versions);
const swPath = path.join(root, 'sw.js');
const changelogPath = path.join(root, 'assets/js/changelog.js');
const currentStatusPath = path.join(root, 'CURRENT-RELEASE-STATUS.md');
check('identity:service-worker-version', exists(swPath) && read(swPath).includes(`const APP_VERSION = '${pkg.version}'`) && read(swPath).includes(`ghrab-ai-akademie-v${pkg.version}`));
check('identity:changelog-version', exists(changelogPath) && read(changelogPath).includes(`export const APP_VERSION = '${pkg.version}'`));
check('identity:current-status-version', exists(currentStatusPath) && read(currentStatusPath).includes(`**Version:** ${pkg.version}`));

const packageScripts = pkg.scripts || {};
for (const script of arch.requiredPackageScripts || []) check(`ci:package-script:${script}`, typeof packageScripts[script] === 'string' && packageScripts[script].trim().length > 0);
for (const [workflow, commands] of Object.entries(arch.workflowRequirements || {})) {
  const wf = path.join(root, workflow);
  const text = exists(wf) ? read(wf) : '';
  for (const cmd of commands) check(`ci:workflow:${workflow}:${cmd}`, text.includes(cmd), exists(wf) ? 'required command present' : 'workflow missing');
  const stale = text.match(/security\/sbom\/ai-akademie-\d+\.\d+\.\d+\.cdx\.json/g) || [];
  check(`ci:no-hardcoded-sbom-version:${workflow}`, stale.length === 0, stale);
}

const sourceFiles = [];
for (const sourceRoot of arch.runtimeSourceRoots || []) sourceFiles.push(...listFiles(path.join(root, sourceRoot)).filter(f => f.endsWith('.js')));
for (const standalone of arch.runtimeStandaloneModules || []) {
  const file = path.join(root, standalone);
  if (exists(file)) sourceFiles.push(file);
  else check(`graph:standalone-exists:${standalone}`, false, 'missing standalone runtime module');
}
const uniqueSourceFiles = [...new Set(sourceFiles.map(file => path.resolve(file)))].sort();
check('graph:nonempty-scope', uniqueSourceFiles.length > 0, { files: uniqueSourceFiles.length, roots: arch.runtimeSourceRoots });

const graph = new Map();
const unresolved = [];
const forbiddenImports = [];
const bareImports = [];
const dynamicUnknown = [];
const syntaxFailures = [];
const forbiddenPrefixes = arch.forbiddenRuntimeImportPrefixes || [];
const approvedDynamic = new Map((inventory.approvedDynamicImports || []).map(x => [x.file, x]));
for (const file of uniqueSourceFiles) {
  const r = rel(file);
  const source = read(file);
  if (file.endsWith('.js')) {
    const syntax = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (syntax.status !== 0) syntaxFailures.push({ file: r, error: (syntax.stderr || syntax.stdout || '').trim() });
  }
  const edges = [];
  for (const spec of parseStaticImports(source)) {
    const rr = resolveImport(file, spec);
    if (rr.external) { bareImports.push({ file: r, spec }); continue; }
    const targetRel = rel(rr.target);
    if (!exists(rr.target)) unresolved.push({ file: r, spec, resolved: targetRel });
    if (forbiddenPrefixes.some(prefix => targetRel.startsWith(prefix))) forbiddenImports.push({ file: r, spec, resolved: targetRel });
    edges.push(targetRel);
  }
  for (const dyn of parseDynamicImports(source)) {
    if (dyn.literal !== null) {
      if (/^https?:/i.test(dyn.literal)) dynamicUnknown.push({ file: r, expression: dyn.raw, reason: 'cross-origin-or-absolute-network-import' });
      else {
        const rr = resolveImport(file, dyn.literal);
        if (!rr.external) {
          const targetRel = rel(rr.target);
          if (!exists(rr.target)) unresolved.push({ file: r, spec: dyn.literal, resolved: targetRel });
          if (forbiddenPrefixes.some(prefix => targetRel.startsWith(prefix))) forbiddenImports.push({ file: r, spec: dyn.literal, resolved: targetRel });
          edges.push(targetRel);
        } else bareImports.push({ file: r, spec: dyn.literal });
      }
    } else {
      const approved = approvedDynamic.get(r);
      if (!approved || approved.expression.replace(/\s+/g, '') !== dyn.raw.replace(/\s+/g, '')) dynamicUnknown.push({ file: r, expression: dyn.raw, reason: 'non-literal dynamic import is not approved' });
      else {
        for (const guard of approved.requiredGuards || []) if (!source.includes(guard)) dynamicUnknown.push({ file: r, expression: dyn.raw, reason: `missing guard: ${guard}` });
      }
    }
  }
  graph.set(r, [...new Set(edges)]);
}
check('graph:syntax', syntaxFailures.length === 0, syntaxFailures);
check('graph:no-unresolved-imports', unresolved.length === 0, unresolved);
check('graph:no-bare-runtime-imports', bareImports.length === 0, bareImports);
check('graph:no-forbidden-runtime-imports', forbiddenImports.length === 0, forbiddenImports);
check('graph:dynamic-imports-approved', dynamicUnknown.length === 0, dynamicUnknown);
const cycles = findCycles(graph);
check('graph:no-cycles', cycles.length === 0, cycles);

const appSource = exists(path.join(root, 'assets/js/app.js')) ? read(path.join(root, 'assets/js/app.js')) : '';
const swSource = exists(swPath) ? read(swPath) : '';
const allRuntimeSource = uniqueSourceFiles.map(file => ({ file: rel(file), text: read(file) }));
const forbiddenNetwork = [];
for (const item of allRuntimeSource) {
  if (/\b(?:WebSocket|EventSource|XMLHttpRequest)\s*\(/.test(item.text) || /\.sendBeacon\s*\(/.test(item.text)) forbiddenNetwork.push({ file: item.file, reason: 'undeclared network API' });
  if (item.file !== 'sw.js' && /\bfetch\s*\(/.test(item.text)) forbiddenNetwork.push({ file: item.file, reason: 'fetch outside service worker is not in approved capability inventory' });
}
check('capability:no-undeclared-network-api', forbiddenNetwork.length === 0, forbiddenNetwork);
check('capability:studio-dynamic-import-guarded', appSource.includes("candidate.origin !== location.origin") && appSource.includes("['/AI-Studio-GHRAB/', '/ai-studio/'].includes(normalizedPath)") && appSource.includes("new URL('access/access-control.js', studioUrl)"));
check('capability:service-worker-same-origin', swSource.includes('if (url.origin !== self.location.origin) return;') && swSource.includes("fetch(request, { cache: 'no-store' })"));
const fileApiHits = [];
for (const item of allRuntimeSource) if (/\b(?:FileReader|showOpenFilePicker|showSaveFilePicker|FormData)\b|type\s*=\s*["']file["']/i.test(item.text)) fileApiHits.push(item.file);
check('capability:no-user-file-processing', inventory.userFileProcessing === false && fileApiHits.length === 0, fileApiHits);
const extraStorage = [];
for (const item of allRuntimeSource) if (/\b(?:sessionStorage|indexedDB)\b/.test(item.text)) extraStorage.push(item.file);
check('capability:storage-within-inventory', extraStorage.length === 0, extraStorage);

const artifact = path.join(root, 'dist-pages');
check('artifact:exists', exists(artifact) && fs.statSync(artifact).isDirectory());
if (exists(artifact) && fs.statSync(artifact).isDirectory()) {
  const actualTop = fs.readdirSync(artifact).sort((a, b) => a.localeCompare(b, 'en'));
  const expectedTop = [...(inventory.artifactTopLevel || [])].sort((a, b) => a.localeCompare(b, 'en'));
  check('artifact:top-level-inventory', JSON.stringify(actualTop) === JSON.stringify(expectedTop), { expected: expectedTop, actual: actualTop });
  const artifactFiles = listFiles(artifact);
  const forbiddenArtifact = [];
  for (const file of artifactFiles) {
    const r = posix(path.relative(artifact, file));
    const segments = r.split('/');
    if ((inventory.forbiddenArtifactPathSegments || []).some(seg => segments.includes(seg))) forbiddenArtifact.push({ path: r, reason: 'forbidden path segment' });
    if ((inventory.forbiddenArtifactSuffixes || []).some(s => r.endsWith(s))) forbiddenArtifact.push({ path: r, reason: 'forbidden suffix' });
    if (/(^|\/)(?:mock-auth|test-runner|debug-bypass|red-team)(?:[./_-]|$)/i.test(r)) forbiddenArtifact.push({ path: r, reason: 'test/bypass artifact marker' });
  }
  check('artifact:no-dev-test-security-payload', forbiddenArtifact.length === 0, forbiddenArtifact);
  const externalRefs = [];
  for (const file of artifactFiles.filter(f => /\.(?:html|css|js)$/i.test(f))) {
    const text = read(file);
    const rx = /\b(?:src|href)\s*=\s*["']https?:\/\//ig;
    if (rx.test(text)) externalRefs.push(posix(path.relative(artifact, file)));
  }
  check('artifact:no-cross-origin-static-resource', externalRefs.length === 0, externalRefs);
  const artifactHasSecurity = artifactFiles.some(f => rel(f).includes('/security/garp27/') || rel(f).includes('/security/garp25/'));
  check('authority:no-security-tooling-in-runtime-artifact', !artifactHasSecurity);
}

const runtimeAuthorityImports = forbiddenImports.filter(x => x.resolved.startsWith('security/garp25/') || x.resolved.startsWith('security/garp27/'));
check('authority:no-runtime-security-engine-import', runtimeAuthorityImports.length === 0, runtimeAuthorityImports);
check('authority:legacy-baseline-preserved', exists(path.join(root, 'security/garp25')) && arch.legacyAuthoritiesAllowed?.includes('security/garp25'), 'legacy tooling remains verification/release baseline only');
check('authority:garp27-not-runtime-engine', !uniqueSourceFiles.some(f => rel(f).startsWith('security/garp27/')) && arch.activeAuthority === 'security/garp27');

const candidateScope = candidateFiles();
const candidateDigest = pathContentDigest(candidateScope);
const policyDigest = sha256File(path.join(root, 'security/garp27/garp27-policy.json'));
const inventoryDigest = sha256File(path.join(root, 'security/garp27/capability-inventory.json'));
const architecturePolicyDigest = sha256File(path.join(root, 'security/garp27/architecture-policy.json'));
const toolDigest = sha256File(fileURLToPath(import.meta.url));

const failed = checks.filter(c => !c.pass);
const result = {
  classification: 'APP_BEHAVIOR_TEST',
  testPack: 'AI-AKADEMIE-GARP27-ARCHITECTURE-INTEGRITY-v1',
  garpVersion: '2.7',
  status: failed.length ? 'FAIL' : 'PASS',
  appId: 'ai-akademie',
  appVersion: pkg.version,
  scope: {
    runtimeSourceRoots: arch.runtimeSourceRoots,
    runtimeSourceFiles: uniqueSourceFiles.length,
    candidateFilesBound: candidateScope.length,
    artifact: 'dist-pages'
  },
  binding: { candidateDigestSha256: candidateDigest, policySha256: policyDigest, inventorySha256: inventoryDigest, architecturePolicySha256: architecturePolicyDigest, toolSha256: toolDigest },
  architectureCases: {
    'G27-AR01': failed.some(c => c.id.startsWith('graph:')) ? 'FAIL' : 'PASS',
    'G27-AR02': failed.some(c => c.id.startsWith('artifact:') || c.id === 'authority:no-security-tooling-in-runtime-artifact') ? 'FAIL' : 'PASS',
    'G27-AR03': failed.some(c => c.id.startsWith('capability:') || c.id.startsWith('identity:version')) ? 'FAIL' : 'PASS',
    'G27-AR04': failed.some(c => c.id.startsWith('ci:')) ? 'FAIL' : 'PARTIAL_LOCAL_ENFORCEMENT',
    'G27-AR05': failed.some(c => c.id.startsWith('authority:') || c.id.startsWith('graph:no-forbidden')) ? 'FAIL' : 'PASS'
  },
  limitations: [
    'G27-AR04 cannot be fully independent while policy/gate code can be changed in the same candidate; repository-side governance is required for full closure.',
    'Static analysis does not claim semantic equivalence detection of arbitrary duplicated security code.',
    'School-server and LIVE behavior are outside this local/CI scope.'
  ],
  checks,
  failed: failed.map(c => c.id)
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ status: result.status, output: rel(output), checks: checks.length, passed: checks.length - failed.length, failed: result.failed, candidateDigestSha256: candidateDigest, architectureCases: result.architectureCases }, null, 2));
process.exit(failed.length ? 1 : 0);
