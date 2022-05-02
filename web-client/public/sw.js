var cacheName = "Recipes";
var filesToCache = ["/", "/favicon.ico"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (filesToCache.includes(new URL(event.request.url).pathname)) {
    event.respondWith(
      (async function () {
        const cache = await caches.open(cacheName);
        try {
          let response = await fetch(event.request);
          await cache.put(event.request, response);
          return response.clone();
        } catch {
          return await cache.match(event.request);
        }
      })()
    );
  }
});
