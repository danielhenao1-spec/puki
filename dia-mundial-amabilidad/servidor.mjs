/*
  Servidor local para la PWA de Preescolar Puki.
  Sin dependencias: solo Node.js 18 o superior.

  Uso:
    node servidor.mjs
    node servidor.mjs --open    (abre el navegador automáticamente)
*/

import { createServer } from "node:http";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4173);
const OPEN_BROWSER = process.argv.includes("--open");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2"
};

function sendText(response, status, message) {
  response.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(message);
}

function parseRange(rangeHeader, fileSize) {
  if (!rangeHeader) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
  if (!match) return null;

  const startRaw = match[1];
  const endRaw = match[2];

  if (startRaw === "" && endRaw === "") return null;

  let start;
  let end;

  if (startRaw === "") {
    const suffixLength = Number(endRaw);
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return null;
    start = Math.max(0, fileSize - suffixLength);
    end = fileSize - 1;
  } else {
    start = Number(startRaw);
    end = endRaw === "" ? fileSize - 1 : Number(endRaw);
  }

  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start < 0 ||
    end < start ||
    start >= fileSize
  ) {
    return { invalid: true };
  }

  return { start, end: Math.min(end, fileSize - 1) };
}

const server = createServer(async (request, response) => {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("Permissions-Policy", "fullscreen=(self)");

  if (request.method !== "GET" && request.method !== "HEAD") {
    sendText(response, 405, "Método no permitido.");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(request.url || "/", `http://${request.headers.host || "localhost"}`).pathname
    );
  } catch {
    sendText(response, 400, "Solicitud inválida.");
    return;
  }

  let relativePath = pathname.replace(/^\/+/, "");
  if (!relativePath) relativePath = "index.html";

  let filePath = path.resolve(ROOT, relativePath);
  const rootWithSeparator = ROOT.endsWith(path.sep) ? ROOT : ROOT + path.sep;

  if (filePath !== ROOT && !filePath.startsWith(rootWithSeparator)) {
    sendText(response, 403, "Acceso denegado.");
    return;
  }

  let stats;
  try {
    stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      stats = await fs.stat(filePath);
    }
  } catch {
    sendText(response, 404, "No encontrado.");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || "application/octet-stream";
  const range = parseRange(request.headers.range, stats.size);

  if (range?.invalid) {
    response.writeHead(416, {
      "Content-Range": `bytes */${stats.size}`,
      "Cache-Control": "no-cache"
    });
    response.end();
    return;
  }

  const commonHeaders = {
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-cache",
    "Cross-Origin-Resource-Policy": "same-origin"
  };

  if (request.method === "HEAD") {
    response.writeHead(200, {
      ...commonHeaders,
      "Content-Length": stats.size
    });
    response.end();
    return;
  }

  if (range) {
    const { start, end } = range;
    response.writeHead(206, {
      ...commonHeaders,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${stats.size}`
    });
    createReadStream(filePath, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, {
    ...commonHeaders,
    "Content-Length": stats.size
  });
  createReadStream(filePath).pipe(response);
});

server.listen(PORT, "127.0.0.1", () => {
  const url = `http://localhost:${PORT}/`;
  console.log("");
  console.log("  Día Mundial de la Amabilidad · Preescolar Puki");
  console.log("  ------------------------------------------");
  console.log(`  Aplicación disponible en: ${url}`);
  console.log("  Pulsa Ctrl+C para detener el servidor.");
  console.log("");

  if (OPEN_BROWSER) {
    const command =
      process.platform === "win32"
        ? `start "" "${url}"`
        : process.platform === "darwin"
          ? `open "${url}"`
          : `xdg-open "${url}"`;

    exec(command, () => {});
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `El puerto ${PORT} ya está ocupado. Prueba con otro puerto:`
    );
    console.error(`  $env:PORT=4174; node servidor.mjs`);
  } else {
    console.error("No se pudo iniciar el servidor:", error);
  }
  process.exitCode = 1;
});

function stopServer() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);
