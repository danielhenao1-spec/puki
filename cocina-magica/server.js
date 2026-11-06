/* Servidor local sin dependencias para La Cocina Mágica de Yellow */

"use strict";

const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const os = require("os");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 4173;
const HOST = process.env.HOST || "0.0.0.0";

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
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};

function getMimeType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function securityHeaders() {
  return {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
}

function sendError(response, statusCode, message) {
  const body = Buffer.from(message, "utf8");
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": body.length,
    ...securityHeaders(),
  });
  response.end(body);
}

function getLocalAddress() {
  const interfaces = os.networkInterfaces();
  for (const addresses of Object.values(interfaces)) {
    if (!addresses) continue;
    for (const address of addresses) {
      if (address.family === "IPv4" && !address.internal) {
        return address.address;
      }
    }
  }
  return null;
}

async function handleRequest(request, response) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch (error) {
    sendError(response, 400, "Solicitud inválida.");
    return;
  }

  const relativePath = pathname.replace(/^\/+/, "");
  let filePath = path.resolve(ROOT, relativePath || "index.html");

  if (filePath !== ROOT && !filePath.startsWith(`${ROOT}${path.sep}`)) {
    sendError(response, 403, "Acceso denegado.");
    return;
  }

  let stats;
  try {
    stats = await fsp.stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      stats = await fsp.stat(filePath);
    }
  } catch (error) {
    sendError(response, 404, "No encontramos ese archivo en la cocina.");
    return;
  }

  if (!stats.isFile()) {
    sendError(response, 404, "No encontramos ese archivo en la cocina.");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const mimeType = getMimeType(filePath);
  const cacheControl =
    extension === ".mp4"
      ? "public, max-age=86400"
      : extension === ".html" || extension === ".js" || extension === ".css" || extension === ".webmanifest"
        ? "no-cache"
        : "public, max-age=86400";

  const headers = {
    "Content-Type": mimeType,
    "Cache-Control": cacheControl,
    "Accept-Ranges": "bytes",
    ...securityHeaders(),
  };

  if (extension === ".mp4") {
    const range = request.headers.range;
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/i.exec(String(range).trim());
      if (match) {
        const start = Number(match[1]);
        const end = match[2] ? Math.min(Number(match[2]), stats.size - 1) : stats.size - 1;
        if (Number.isFinite(start) && start < stats.size && end >= start) {
          response.writeHead(206, {
            ...headers,
            "Content-Range": `bytes ${start}-${end}/${stats.size}`,
            "Content-Length": String(end - start + 1),
          });
          if (request.method === "HEAD") {
            response.end();
          } else {
            fs.createReadStream(filePath, { start, end }).pipe(response);
          }
          return;
        }
        response.writeHead(416, {
          ...headers,
          "Content-Range": `bytes */${stats.size}`,
        });
        response.end();
        return;
      }
    }
  }

  headers["Content-Length"] = String(stats.size);
  response.writeHead(200, headers);
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendError(response, 405, "Método no permitido.");
    return;
  }
  handleRequest(request, response).catch((error) => {
    console.error("Error atendiendo la solicitud:", error);
    if (!response.headersSent) sendError(response, 500, "Ocurrió un error en la cocina.");
    else response.destroy();
  });
});

server.listen(PORT, HOST, () => {
  const lanAddress = getLocalAddress();
  console.log("");
  console.log("  🦁  La Cocina Mágica de Yellow");
  console.log("  ─────────────────────────────");
  console.log(`  Local:   http://localhost:${PORT}`);
  if (lanAddress) console.log(`  Red:     http://${lanAddress}:${PORT}`);
  console.log("");
  console.log("  Pulsa Ctrl+C para apagar la cocina.");
  console.log("");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`El puerto ${PORT} ya está ocupado. Usa otro: PORT=4180 npm start`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
