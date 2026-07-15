const CACHE = 'ghrab-academy-v1.3.0';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './404.html',
  './assets/css/styles.css',
  './assets/js/app.js',
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

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(async () => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return new Response('Zdroj není dostupný offline.', { status: 504, statusText: 'Offline' });
      });
    })
  );
});
