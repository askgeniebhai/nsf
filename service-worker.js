"use strict";

/*
 * NSF app-shell service worker.
 *
 * Scope is intentionally narrow and conservative:
 *  - Only same-origin GET requests are ever intercepted. Cross-origin
 *    requests (the lucide icon CDN, Google Fonts) are left completely
 *    untouched and always go straight to the network, exactly as they did
 *    before this service worker existed.
 *  - Page navigations use network-first, so a guard who is online always
 *    gets the current login/portal pages -- the cache is only a fallback
 *    for when the network is unavailable, never a way to serve stale
 *    authentication or business logic.
 *  - NSF has no server API: attendance, payroll, and every other business
 *    record lives in localStorage, which this service worker cannot see
 *    and does not touch. There is nothing "dynamic" for it to cache.
 *  - The cache name is versioned; old caches are removed on activate, so
 *    an update to the app ships cleanly without a manual cache-clear.
 */

const CACHE_VERSION = "nsf-shell-v1";

const APP_SHELL = [
    "/index.html",
    "/login.html",
    "/css/style.css",
    "/js/StorageService.js",
    "/js/seed.js",
    "/js/auth.js",
    "/js/engine.js",
    "/js/ui-components.js",
    "/js/attendance.js",
    "/js/identity.js",
    "/js/pwa.js",
    "/assets/images/logo.png",
    "/assets/icons/icon-192.png",
    "/assets/icons/icon-512.png",
    "/manifest.webmanifest"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_VERSION)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((names) =>
                Promise.all(
                    names
                        .filter((name) => name !== CACHE_VERSION)
                        .map((name) => caches.delete(name))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const req = event.request;
    const url = new URL(req.url);

    if (req.method !== "GET" || url.origin !== self.location.origin) {
        return;
    }

    if (req.mode === "navigate") {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
                    return res;
                })
                .catch(() =>
                    caches
                        .match(req)
                        .then((cached) => cached || caches.match("/login.html"))
                )
        );
        return;
    }

    event.respondWith(
        caches.match(req).then((cached) => {
            const networkFetch = fetch(req)
                .then((res) => {
                    if (res && res.ok) {
                        const copy = res.clone();
                        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
                    }
                    return res;
                })
                .catch(() => cached);
            return cached || networkFetch;
        })
    );
});
