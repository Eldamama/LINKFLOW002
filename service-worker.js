const CACHE_NAME = "linkflow-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./video.html",
  "./generate.html",
  "./dashboard.html",
  "./style.css",
  "./app.js",
  "./manifest.json"
];

// Installation : Mise en cache des fichiers essentiels
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("LinkFlow: Fichiers mis en cache");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation : Nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Interception des requêtes : Mode hors-ligne / Performance
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
