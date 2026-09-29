const CACHE_NAME = 'incheon-2201-nav-v1';
const CORE_ASSETS = [
  './incheon-2201-signal-nav.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 페이지/아이콘 등 정적 파일은 캐시 우선, 그 외(API 호출 등)는 네트워크로 그대로 통과
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isCore = CORE_ASSETS.some((a) => url.pathname.endsWith(a.replace('./', '/')));
  if (!isCore) return; // API 요청 등은 서비스워커가 건드리지 않음

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
