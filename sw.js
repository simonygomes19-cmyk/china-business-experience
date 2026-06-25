// Service Worker — China Business Experience (PWA)
const CACHE = 'cbe-v4';
const ASSETS = [
  '/', '/index.html', '/config.js', '/manifest.webmanifest',
  '/icons/icon-192.png', '/icons/icon-512.png',
  '/img/hero.jpg', '/img/fair.jpg', '/img/skyline.jpg',
  '/img/xangai.jpg', '/img/guangzhou.jpg', '/img/shenzhen.jpg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Deixa POST (envio ao Supabase) passar direto, sem cache
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // CDNs externos e API do Supabase: rede normal, sem interceptar
  if (url.origin !== location.origin) return;
  // Cache-first para arquivos do próprio site
  e.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => cached)
    )
  );
});
