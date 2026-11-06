/* La Cocina Mágica de Yellow - service worker offline */

const CACHE_VERSION = "cocina-yellow-v5";
const STATIC_CACHE = `${CACHE_VERSION}-static`;

const PRECACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./screenshots/cocina.webp",
  "./screenshots/grupos.webp",
  "./screenshots/plato-magico.webp",
  "./screenshots/celebracion.webp",
  "./assets/fonts/baloo2-latin.woff2",
  "./assets/fonts/nunito-latin.woff2",
  "./assets/fonts/nunito-latin-italic.woff2",
  "./assets/images/cocina-fondo.webp",
  "./assets/images/plato-vacio.webp",
  "./assets/images/plato-arepa.webp",
  "./assets/images/plato-arroz.webp",
  "./assets/images/plato-cereal.webp",
  "./assets/images/door-poster.webp",
  "./assets/images/yellow-chef.webp",
  "./assets/images/ingredients/harina-maiz.webp",
  "./assets/images/ingredients/arroz.webp",
  "./assets/images/ingredients/pan.webp",
  "./assets/images/ingredients/pasta.webp",
  "./assets/images/ingredients/cereal.webp",
  "./assets/images/ingredients/pollo.webp",
  "./assets/images/ingredients/carne.webp",
  "./assets/images/ingredients/pescado.webp",
  "./assets/images/ingredients/huevos.webp",
  "./assets/images/ingredients/leche.webp",
  "./assets/images/ingredients/queso.webp",
  "./assets/images/ingredients/yogurt.webp",
  "./assets/images/ingredients/aguacate.webp",
  "./assets/images/ingredients/bananas.webp",
  "./assets/images/ingredients/fresas.webp",
  "./assets/images/ingredients/manzana.webp",
  "./assets/images/ingredients/naranja.webp",
  "./assets/images/ingredients/patilla.webp",
  "./assets/images/ingredients/papa.webp",
  "./assets/images/ingredients/zanahoria.webp",
  "./assets/images/ingredients/brocoli.webp",
  "./assets/images/ingredients/lechuga.webp",
  "./assets/images/ingredients/tomate.webp",
  "./assets/images/ingredients/pimenton.webp",
  "./assets/images/ingredients/aceite-oliva.webp",
  "./assets/images/ingredients/frutos-secos.webp",
  "./assets/videos/1.mp4",
  "./assets/videos/2.mp4",
  "./assets/videos/3.mp4",
  "./assets/videos/4.mp4",
  "./assets/videos/5.mp4"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== STATIC_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put("./index.html", copy)).catch(() => {});
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(STATIC_CACHE);
          return (await cache.match("./index.html")) || (await cache.match("./")) || Response.error();
        })
    );
    return;
  }

  if (url.pathname.endsWith(".mp4")) {
    event.respondWith(handleVideoRequest(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (!response.ok) return response;
          const copy = response.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});

async function handleVideoRequest(request) {
  const range = request.headers.get("range");
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request.url);

  if (!cached) {
    return fetch(request);
  }

  if (!range) {
    return cached;
  }

  const match = /^bytes=(\d+)-(\d*)$/i.exec(range.trim());
  if (!match) {
    return cached;
  }

  const blob = await cached.blob();
  const size = blob.size;
  const start = Number(match[1]);
  const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;

  if (!Number.isFinite(start) || start >= size || end < start) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` },
    });
  }

  const slice = blob.slice(start, end + 1);
  return new Response(slice, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Accept-Ranges": "bytes",
      "Content-Length": String(slice.size),
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Type": "video/mp4",
    },
  });
}

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
