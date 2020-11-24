const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/db.js",
    "/dist/index.bundle.js",
    "/dist/db.bundle.js",
    "/dist/manifest.json",
    "/icons/icon-512x512.png",
    "style.css"
];

const DATA_CACHE_NAME = "data-cache-v1";
const CACHE_NAME = "static-cache-v1";

self.addEventListener("install", evt => {
    evt.waitUntill(
        caches.open(CACHE_NAME).then(chache => {
            console.log("files pre-cached");
            return caches.addAll(FILES_TO_CACHE).then((result) => {
                console.log("result add all", result);
            }).catch((err) => {
                console.log("Error: ", err);
            });
        })
    )
    self.skipWaiting();
});

self.addEventListener("activate", evt => {
    evt.waitUntill(
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
    evt,respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(evt.request).then((response) => {
                return response || fetch(evt.request);
            });
        })
    );
});