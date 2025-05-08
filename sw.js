const CACHE_NAME = 'fishball-cache-v1';
const urlsToCache = [
  'order.html',
  'status.html',
  'icon-192.png',
  // 其他需要缓存的文件（CSS/JS/图片）
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});