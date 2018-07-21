importScripts('/cache-polyfill.js');


self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('tide-technology').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/assets/*'
     ]);
   })
 );
});