/**
 * GRIMCRAFT service worker — runtime caching only (no precache, so install
 * can never fail on a missing file).
 *
 * - Cross-origin GET (Cloudflare R2 models) -> MODELS_CACHE, cache-first.
 *   Requires R2 CORS (Allow-Origin + GET), otherwise three.js cannot read
 *   the responses and they are not cached.
 * - Same-origin /assets/* (hashed Vite bundle) -> APP_CACHE, cache-first.
 * - Same-origin navigation/HTML -> network-first, cache fallback (offline boot).
 * - Same-origin everything else (maps, icons, json) -> stale-while-revalidate.
 *
 * Bump CACHE_VERSION on every release and whenever R2 model bytes change
 * under the same URL — old caches (incl. legacy 'grimcraft-v3') are purged.
 */

// NOTE: plain static file, copied verbatim from public/ — no Vite defines here.
const CACHE_VERSION = 1;
const APP_CACHE = `grimcraft-app-v${CACHE_VERSION}`;
const MODELS_CACHE = `grimcraft-models-v${CACHE_VERSION}`;
// models/ holds ~270 GLBs (~950MB); trim oldest-first past this cap.
const MAX_MODEL_ENTRIES = 400;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== APP_CACHE && key !== MODELS_CACHE).map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

function cacheable(response) {
  return !!response && response.ok;
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await Promise.all(keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key)));
  }
}

async function putModel(request, response) {
  try {
    const cache = await caches.open(MODELS_CACHE);
    await cache.put(request, response);
  } catch (err) {
    if (err && err.name !== 'QuotaExceededError') {
      throw err;
    }
    await trimCache(MODELS_CACHE, Math.floor(MAX_MODEL_ENTRIES / 2));
    const cache = await caches.open(MODELS_CACHE);
    await cache.put(request, response).catch(() => {});
  }
  trimCache(MODELS_CACHE, MAX_MODEL_ENTRIES).catch(() => {});
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  if (cacheable(response)) {
    const copy = response.clone();
    if (cacheName === MODELS_CACHE) {
      putModel(request, copy).catch(() => {});
    } else {
      caches.open(cacheName).then((cache) => cache.put(request, copy)).catch(() => {});
    }
  }
  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (cacheable(response)) {
      const copy = response.clone();
      caches.open(cacheName).then((cache) => cache.put(request, copy)).catch(() => {});
    }
    return response;
  } catch (_) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw _;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  const refresh = fetch(request).then((response) => {
    if (cacheable(response)) {
      const copy = response.clone();
      caches.open(cacheName).then((cache) => cache.put(request, copy)).catch(() => {});
    }
    return response;
  }).catch(() => cached);
  return cached || refresh;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }
  const url = new URL(request.url);
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(request, APP_CACHE));
  } else if (url.origin !== self.location.origin) {
    event.respondWith(cacheFirst(request, MODELS_CACHE));
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request, APP_CACHE));
  } else {
    event.respondWith(staleWhileRevalidate(request, APP_CACHE));
  }
});
