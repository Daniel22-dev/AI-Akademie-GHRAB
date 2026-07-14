const CACHE = 'ghrab-academy-v1.0.0';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/styles.css',
  './assets/js/app.js',
  './assets/js/storage.js',
  './assets/js/starfield.js',
  './courses/index.js',
  './courses/00-start.js',
  './courses/01-differentiator.js',
  './courses/02-github.js',
  './courses/03-generator.js',
  './courses/04-ludus.js',
  './courses/05-correspondence.js',
  './courses/06-evaluator.js',
  './courses/07-workflow.js',
  './courses/08-administrator.js',
  './assets/brand/brand-mark.svg',
  './assets/brand/portal-gateway.png',
  './assets/brand/school-logo.png',
  './assets/brand/icon-32.png',
  './assets/brand/icon-192.png',
  './assets/brand/icon-512.png',
  './assets/brand/apple-touch-icon.png',
  './assets/apps/correspondence.png',
  './assets/apps/differentiator.png',
  './assets/apps/essay-evaluator-v2.png',
  './assets/apps/generator.png',
  './assets/apps/ludus.png'
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
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (!response || response.status !== 200 || response.type === 'opaque') return response;
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
