const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/dist/index.bundle.js",
    "/dist/db.bundle.js",
    "/dist/manifest.json",
    "/icons/icon-512x512.png",
    "style.css",
    "/db.js"
];

const DATA_CACHE_NAME = "data-cache-v1";
const CACHE_NAME = "static-cache-v2";

self.addEventListener("install", evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("files pre-cached");
            return caches.addAll(FILES_TO_CACHE);
            })
           );
        
    
    self.skipWaiting();
});

self.addEventListener("activate", evt => {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("old cache data removed", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.ClientRectList.claim();
})

self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(evt.request).then((response) => {
                    if (response.status === 200) {
                        cache.put(evt.request.url, response.clone());
                    }
                    return response;
                }).catch((err) => {
                    return cache.match(evt.request);
                });
            }).catch((err) => console.log(err))
        );
        return;
    }
    evt.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(evt.request).then((response) => {
                return response || fetch(evt.request);
            });
        })
    );
});