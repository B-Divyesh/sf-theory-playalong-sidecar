const VERSION = 'sidecar-v3';
const SHELL = ['/', '/demo', '/privacy', '/terms', '/offline.html', '/manifest.webmanifest', '/icon.svg', '/assets/harmony-console.webp', '/assets/app.js', '/assets/index.css'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => Promise.all(SHELL.map(async url => {
    const response = await fetch(new Request(url, {cache:'reload'}));
    if (!response.ok) throw new Error(`Could not cache ${url}`);
    await cache.put(url, response);
  }))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()).then(() => self.clients.matchAll().then(clients => clients.forEach(client => client.postMessage({type:'SW_READY'})))));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request, {ignoreVary:true}).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('/', {ignoreVary:true}) : caches.match('/offline.html', {ignoreVary:true}))));
});
