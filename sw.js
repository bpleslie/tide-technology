importScripts('/cache-polyfill.js');


self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('tide-technology').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/assets/css/main.css',
       '/assets/css/font-awesome.min.css',
       '/assets/fonts/OpenSans-Bold.ttf',
       '/cache-polyfill.js'
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});