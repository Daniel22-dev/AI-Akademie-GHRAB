const APP_VERSION = '1.4.11';
const CACHE_NAME = 'ghrab-ai-akademie-v1.4.11';
const CACHE_PREFIX = 'ghrab-ai-akademie-v';
const LEGACY_CACHE_PREFIX = 'ghrab-academy-v';

function isSecurityCriticalRequest(url, scopePath) {
  const rawPathname = String(url?.pathname || '');
  const rawScope = String(scopePath || '');
  if (!rawPathname.startsWith(rawScope)) return false;
  let relative = rawPathname.slice(rawScope.length);
  try { relative = decodeURIComponent(relative); }
  catch { return true; }
  relative = relative.replace(/\\/g, '/');
  const segments = [];
  for (const segment of relative.split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') {
      if (!segments.length) return true;
      segments.pop();
      continue;
    }
    segments.push(segment);
  }
  relative = segments.join('/');
  return relative === 'runtime-config.js' ||
    relative === 'config/deployment.json' ||
    relative === 'config/deployment.school-server.json' ||
    relative === 'access/deployment-config.js' ||
    relative === 'ghrab/ghrab-platform.js' ||
    relative === 'release-integrity.json' ||
    relative === 'release-integrity.sig' ||
    relative === 'integrity-status.json' ||
    relative.endsWith('/app-guard.js') ||
    relative.endsWith('/access-control.js') ||
    relative.endsWith('/revoked-access.json');
}

async function networkOnlyNoStore(request) {
  return fetch(request, { cache: 'no-store' });
}

async function purgeAcademyCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) || key.startsWith(LEGACY_CACHE_PREFIX)).map(key => caches.delete(key)));
}

self.addEventListener('install', () => {
  // Záměrně nic neprecacheujeme. Interní Akademie musí při odebrání oprávnění selhat uzavřeně.
});

self.addEventListener('activate', event => {
  event.waitUntil(purgeAcademyCaches().then(() => self.clients.claim()));
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const scopePath = new URL('./', self.location.href).pathname;
  if (!url.pathname.startsWith(scopePath)) return;

  // Security-critical i běžný interní runtime je vždy network-only/no-store.
  // Tím se po expiraci/odebrání serverového oprávnění nepoužije stará SW cache.
  if (isSecurityCriticalRequest(url, scopePath)) {
    event.respondWith(networkOnlyNoStore(request));
    return;
  }
  event.respondWith(networkOnlyNoStore(request));
});
