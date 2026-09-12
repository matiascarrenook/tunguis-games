const VERSION = "tunguis-v1";
const SHELL = [
  "./",
  "./index.html",
  "./jugar.html",
  "./distribuir.html",
  "./config.js",
  "./cheats.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./apple-touch-icon.png",
  "./img/firered.svg",
  "./img/leafgreen.svg",
  "./img/emerald.svg",
  "./img/ruby.png",
  "./img/sapphire.png",
  "./favicon.svg"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(VERSION)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin !== location.origin) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const fresh = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const clone = res.clone();
              caches.open(VERSION).then((c) => c.put(req, clone));
            }
            return res;
          })
          .catch(() => cached);
        return cached || fresh;
      })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const clone = res.clone();
              caches.open(VERSION).then((c) => c.put(req, clone));
            }
            return res;
          })
          .catch(() => caches.match("./index.html"))
    )
  );
});