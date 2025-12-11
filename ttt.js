const CACHE_NAME = 'chem-cache-v1';
const OFFLINE_URL = '/FrontendElements/index.html';

const ASSETS = [
  '/FrontendElements/',
  '/FrontendElements/index.html',
  '/FrontendElements/manifest.webmanifest',
  '/FrontendElements/pwa-192x192.png',
  '/FrontendElements/pwa-512x512.png',
];

// установка – кладём нужные файлы в кэш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// активация – чистим старые кэши
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// стратегия network-first с fallback в кэш
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
      )
  );
});
