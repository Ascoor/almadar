const STATIC_CACHE = 'almadar-static-v2';
const RUNTIME_CACHE = 'almadar-runtime-v2';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.ico'];
const MAX_RUNTIME_ENTRIES = 80;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

const putInCache = async (cacheName, request, response, maxEntries) => {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);

  if (!maxEntries) return;
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
  }
};

const networkFirst = async (request) => {
  try {
    const freshResponse = await fetch(request);
    if (freshResponse && freshResponse.ok) {
      putInCache(RUNTIME_CACHE, request, freshResponse.clone(), MAX_RUNTIME_ENTRIES);
    }
    return freshResponse;
  } catch (_) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw _;
  }
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    putInCache(STATIC_CACHE, request, response.clone());
  }
  return response;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isHTMLNavigation = request.mode === 'navigate';

  if (isSameOrigin && (isHTMLNavigation || /\.(js|css|png|jpg|svg|ico|webp)$/.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isSameOrigin || url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
