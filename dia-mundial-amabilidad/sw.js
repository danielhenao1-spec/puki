/* =========================================================
   Día Mundial de la Amabilidad · Escuela Puki
   Service worker: experiencia completa disponible sin conexión.
   ========================================================= */

const CACHE_VERSION = "puki-amabilidad-v1.0.3";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./Fuentes/fondo-casita-puki.webp",
  "./Fuentes/yellow_idle.mp4",
  "./Fuentes/yellow_happy.mp4",
  "./Fuentes/yellow_transform.mp4",
  "./Fuentes/yellow_superhero_idle.mp4",
  "./Fuentes/orbe_transito.mp4",
  "./Fuentes/orbe_limpieza.mp4",
  "./Fuentes/orbe_cortesia.mp4",
  "./Fuentes/orbe_abrazo.mp4",
  "./Fuentes/orbe_juguetes.mp4",
  "./icons/favicon.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-192.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

/**
 * Los elementos <video> piden fragmentos con Range. Cache Storage guarda la
 * respuesta completa, así que construimos aquí la respuesta 206 para que el
 * video pueda empezar y buscar sin conexión.
 */
async function rangeFromCache(request) {
  const rangeHeader = request.headers.get("range");
  if (!rangeHeader) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
  if (!match) return null;

  const cached = await caches.match(request, { ignoreSearch: true });
  if (!cached) return null;

  const blob = await cached.blob();
  const size = blob.size;
  const [, startRaw, endRaw] = match;

  if (startRaw === "" && endRaw === "") return null;

  let start;
  let end;

  if (startRaw === "") {
    const suffix = Number(endRaw);
    if (!Number.isFinite(suffix) || suffix <= 0) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(startRaw);
    end = endRaw === "" ? size - 1 : Number(endRaw);
  }

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end < start ||
    start >= size
  ) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}` }
    });
  }

  end = Math.min(end, size - 1);

  const headers = new Headers(cached.headers);
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  headers.set("Accept-Ranges", "bytes");
  headers.set("Cache-Control", "no-cache");

  return new Response(blob.slice(start, end + 1), {
    status: 206,
    statusText: "Partial Content",
    headers
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const rangeResponse = await rangeFromCache(request);
      if (rangeResponse) return rangeResponse;

      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);

        if (!response || !response.ok || response.type === "opaque") {
          return response;
        }

        const copy = response.clone();
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(request, copy).catch(() => {});
        });

        return response;
      } catch {
        if (request.mode === "navigate") {
          return caches.match("./index.html");
        }
        return new Response("Recurso no disponible sin conexión.", {
          status: 503,
          statusText: "Offline",
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
