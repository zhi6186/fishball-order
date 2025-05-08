const CACHE_NAME = 'fishball-offline-v3';
const DYNAMIC_CACHE = 'fishball-data-v3';
const OFFLINE_URL = 'order.html';

// 需要缓存的静态资源
const PRECACHE = [
  'order.html',
  'status.html',
  'db.js',
  'icons/icon-192.png',
  // 其他CSS/JS文件
];

// 安装阶段：预缓存关键资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// 拦截请求并返回缓存
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(cached => cached || fetch(event.request))
        .then(response => {
          // 动态缓存API数据
          if (event.request.url.includes('/api/')) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match(OFFLINE_URL);
          }
        })
    );
  }
});
