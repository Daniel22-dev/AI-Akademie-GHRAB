const CACHE = 'ghrab-academy-v1.4.2-cache-1';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './404.html',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/js/changelog.js',
  './assets/js/starfield.js',
  './assets/js/storage.js',
  './assets/brand/apple-touch-icon.png',
  './assets/brand/brand-mark.svg',
  './assets/brand/icon-192.png',
  './assets/brand/icon-32.png',
  './assets/brand/icon-512.png',
  './assets/brand/portal-gateway.png',
  './assets/brand/school-logo.png',
  './assets/apps/ai-literacy.png',
  './assets/apps/correspondence.png',
  './assets/apps/differentiator.png',
  './assets/apps/essay-evaluator-v2.png',
  './assets/apps/generator.png',
  './assets/apps/ludus.png',
  './assets/course-icons/administrator.png',
  './assets/course-icons/ai-literacy.png',
  './assets/course-icons/correspondence.png',
  './assets/course-icons/differentiator.png',
  './assets/course-icons/evaluator.png',
  './assets/course-icons/generator.png',
  './assets/course-icons/github.png',
  './assets/course-icons/ludus.png',
  './assets/course-icons/start.png',
  './assets/course-icons/workflow.png',
  './courses/00-ai-literacy.js',
  './courses/00-start.js',
  './courses/01-differentiator.js',
  './courses/02-github.js',
  './courses/03-generator.js',
  './courses/04-ludus.js',
  './courses/05-correspondence.js',
  './courses/06-evaluator.js',
  './courses/07-workflow.js',
  './courses/08-administrator.js',
  './courses/index.js',
  './courses/presentation-enhancements.js',
  './courses/speaker-notes.js',
  './exports/administrator.html',
  './exports/ai-literacy.html',
  './exports/correspondence.html',
  './exports/differentiator.html',
  './exports/evaluator.html',
  './exports/generator.html',
  './exports/github.html',
  './exports/ludus.html',
  './exports/start.html',
  './exports/workflow.html'
];

const FRESH_EXTENSIONS = /\.(?:html?|js|css|webmanifest)$/i;

async function precacheFreshFiles() {
  const cache = await caches.open(CACHE);
  const requests = FILES.map(url => new Request(url, { cache: 'reload' }));
  await cache.addAll(requests);
}

async function deleteOldCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
}

async function reloadOpenWindows() {
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  await Promise.all(windows.map(client => client.navigate(client.url).catch(() => undefined)));
}

async function networkFirst(request, offlineFallback) {
  const cache = await caches.open(CACHE);

  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response && response.status === 200 && response.type !== 'opaque') {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (offlineFallback) return cache.match(offlineFallback);
    return new Response('Zdroj není dostupný offline.', { status: 504, statusText: 'Offline' });
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type !== 'opaque') {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Zdroj není dostupný offline.', { status: 504, statusText: 'Offline' });
  }
}

self.addEventListener('install', event => {
  event.waitUntil(precacheFreshFiles().then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    deleteOldCaches()
      .then(() => self.clients.claim())
      .then(() => reloadOpenWindows())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const needsFreshVersion =
    event.request.mode === 'navigate' ||
    ['document', 'script', 'style'].includes(event.request.destination) ||
    FRESH_EXTENSIONS.test(url.pathname);

  event.respondWith(
    needsFreshVersion
      ? networkFirst(event.request, event.request.mode === 'navigate' ? './index.html' : null)
      : cacheFirst(event.request)
  );
});
