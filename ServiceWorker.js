const CACHE_NAME = "minuseins-wonderland-0.6"; // Increment this for each new version
const urlsToCache = [
    "/",
    "Build/WebBuild.loader.js",
    "Build/WebBuild.framework.js.unityweb",
    "Build/WebBuild.data.unityweb",
    "Build/WebBuild.wasm.unityweb",
    "TemplateData/style.css",
    "TemplateData/favicon.ico",
    "manifest.webmanifest"
];

// Install Service Worker
self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch and Cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log(`[Service Worker] Returning cached resource: ${event.request.url}`);
                return response;
            }

            console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
            return fetch(event.request).then(fetchResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    if (event.request.url.match(/\.data/) || event.request.url.match(/\.bundle/)) {
                        console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
                        cache.put(event.request, fetchResponse.clone());
                    }
                    return fetchResponse;
                });
            });
        })
    );
});

// Activate Service Worker
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/*const cacheName = "minuseins-wonderland-0.3";
const contentToCache = [
    "Build/WebBuild.loader.js",
    "Build/WebBuild.framework.js.unityweb",
    "Build/WebBuild.data.unityweb",
    "Build/WebBuild.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
*/