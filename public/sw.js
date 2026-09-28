// Offline support. Change VERSION to drop old caches.
const VERSION = "v1";
const SHELL = `shell-${VERSION}`;
const FONTS = `fonts-${VERSION}`;
const PRECACHE = ["/", "/manifest.webmanifest", "/icon.svg", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== SHELL && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // The page: network first, so a new deploy shows at once; the cache when offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(SHELL).then(c => c.put("/", copy)); return res; })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // Google Fonts: cache first; they never change at the same URL.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone(); caches.open(FONTS).then(c => c.put(req, copy)); return res;
      }))
    );
    return;
  }

  // Own files: cache first, then network.
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
  }
  // Everything else (analytics) goes to the network as normal.
});
