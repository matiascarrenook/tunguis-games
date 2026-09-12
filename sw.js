const VERSION = "tunguis-v18";
const CACHE_CDN = "tunguis-cdn";
const CACHE_ROM = "tunguis-roms";
const SHELL = [
  "./",
  "./index.html",
  "./jugar.html",
  "./distribuir.html",
  "./coleccion.html",
  "./como-funciona.html",
  "./config.js",
  "./cheats.js",
  "./pokedex.js",
  "./instalar.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./img/firered.svg",
  "./img/leafgreen.svg",
  "./img/emerald.svg",
  "./img/ruby.png",
  "./img/sapphire.png",
  "./favicon.png",
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
    (async () => {
      const keys = await caches.keys();
      const viejos = keys.filter((k) => k.startsWith("tunguis-v") && k !== VERSION);
      for (const k of viejos) {
        const old = await caches.open(k);
        try {
          const reqs = await old.keys();
          for (const rq of reqs) {
            const url = new URL(rq.url);
            const res = await old.match(rq).catch(() => null);
            if (!res) continue;
            if (url.hostname === "cdn.emulatorjs.org") {
              (await caches.open(CACHE_CDN)).put(rq, res);
            } else if (url.pathname.includes("/roms/")) {
              (await caches.open(CACHE_ROM)).put(rq, res);
            }
          }
        } catch (err) {}
        await caches.delete(k);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (e) => {
  const d = e.data;
  if (!d || d.action !== "cacheUrl") return;
  e.waitUntil(
    caches.open(CACHE_ROM).then((c) =>
      c.match(d.url).then((yaCacheado) => {
        if (yaCacheado) return;
        const cross = new URL(d.url, location.href).origin !== location.origin;
        return fetch(d.url, { mode: cross ? "no-cors" : "cors", credentials: "same-origin" })
          .then((res) => {
            if (res && (res.ok || res.type === "opaque")) c.put(d.url, res);
          })
          .catch(() => {});
      })
    )
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  const guardar = (res) => {
    if (res && res.ok) {
      const clone = res.clone();
      caches.open(VERSION).then((c) => c.put(req, clone));
    }
    return res;
  };

  if (url.origin !== location.origin) {
    e.respondWith(
      caches.open(CACHE_CDN).then((c) =>
        c.match(req).then(
          (cached) =>
            cached ||
            fetch(req)
              .then((res) => {
                if (res && res.ok) c.put(req, res.clone());
                return res;
              })
              .catch(() => cached)
        )
      )
    );
    return;
  }

  if (url.pathname.includes("/roms/")) {
    e.respondWith(
      caches.open(CACHE_ROM).then((c) =>
        c.match(req).then(
          (m) =>
            m ||
            fetch(req).then((res) => {
              if (res && res.ok) c.put(req, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  e.respondWith(
    fetch(req)
      .then(guardar)
      .catch(() =>
        caches.match(req).then((c) => c || caches.match("./index.html"))
      )
  );
});