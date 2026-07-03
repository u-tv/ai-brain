const CACHE_NAME = 'gitflow-v1';
const STATIC_ASSETS = [
  '.',
  'index.html',
  'manifest.json'
];

// Install: cache app shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

// Fetch: network-first for API, cache-first for static assets
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // GitHub API requests – use network-first fallback to cache
  if (url.hostname === 'api.github.com') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const cloned = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, cloned));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Static assets – cache-first
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
  );
});
