// Canvas Board — Service Worker
// HTML: network-first (always fresh). Static assets: cache-first (fast).
// Firebase/Firestore requests: always network-only (never cached).

const CACHE = 'vboard-v6';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install: pre-cache app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch handler
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // ── Always network-only for external services (never cache these) ──
  // Firebase / Firestore / Google Auth must never be served from cache
  const networkOnly = [
    'firebaseapp.com', 'firebasedatabase.app',
    'googleapis.com',        // covers firestore.googleapis.com, securetoken.googleapis.com
    'accounts.google.com',
    // Media / oEmbed / preview services
    'gstatic.com', 'cdnjs.cloudflare.com',
    'noembed.com', 'allorigins.win', 'api.microlink.io',
    'youtube.com', 'youtu.be', 'vimeo.com', 'tiktok.com',
    'facebook.com', 'instagram.com', 'pinterest.com',
    'cdninstagram.com', 'pinimg.com', 'vumbnail.com'
  ];
  if (networkOnly.some(h => url.hostname.includes(h))) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
    return;
  }

  // ── HTML: network-first so code changes are always visible immediately ──
  if (e.request.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(e.request)
        .then(resp => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return resp;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // ── Everything else (icons, manifest): cache-first, fallback to network ──
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200 && e.request.method === 'GET') {
          const copy = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
