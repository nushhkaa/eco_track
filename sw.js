/**
 * Service Worker — Eco-Tracks Nepal
 * Caches all app assets for fully offline use.
 */

const CACHE_NAME = 'ecotracks-v3';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './setup.html',
  './admin.html',
  './class_select.html',
  './student.html',
  './analytics.html',
  './solutions.html',
  './overview.html',
  './history.html',
  './transparency.html',
  './goals.html',
  './heatmap.html',
  './css/main.css',
  './js/storage_manager.js',
  './js/calculator_engine.js',
  './js/emission_factors.js',
  './js/geographic_matrix.js',
  './js/goal_engine.js',
  './js/i18n.js',
  './js/nav.js',
  './js/solutions.js',
  './js/utils.js',
  './js/vendor/chart.min.js',
  './data/geographic_matrix.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache what we can; ignore failures for optional assets
      return Promise.allSettled(ASSETS_TO_CACHE.map(url => cache.add(url)));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests and cross-origin fetches
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful responses for future offline use
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback for HTML navigation
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
