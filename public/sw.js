// The production build replaces these two values from its content-hashed files.
const VERSION = 'sidecar-development';
const SHELL = [
  '/', '/demo', '/privacy', '/terms', '/offline.html', '/simple.css',
  '/manifest.webmanifest', '/icon.svg',
  '/assets/harmony-console.32a49c4c.webp'
];
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
