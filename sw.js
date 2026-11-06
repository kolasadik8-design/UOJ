// University of Juba - Admissions - Service Worker V15
const CACHE_NAME = "uj-admissions-v15";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => k !== CACHE_NAME ? caches.delete(k) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // For Firebase / Google APIs - always go to network, don't cache
  if (e.request.url.includes("firebase") || e.request.url.includes("googleapis") || e.request.url.includes("gstatic")) {
    return fetch(e.request).catch(() => caches.match("./index.html"));
  }
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((res) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, res.clone());
          return res;
        });
      }).catch(() => caches.match("./index.html"));
    })
  );
});
