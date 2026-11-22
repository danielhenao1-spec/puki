/**
 * Servidor local estático para "El Castillo de los Sueños".
 * No tiene dependencias externas. Usa Node.js 18 o superior.
 *
 *   node servidor-local.js
 *   Abre http://127.0.0.1:4177
 *
 * Incluye soporte de peticiones HTTP Range, necesario para que
 * los videos MP4 puedan buscar y reproducirse con fluidez.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 4177;
const HOST = process.env.HOST || "127.0.0.1";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ico": "image/x-icon"
};

function notFound(response) {
  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Archivo no encontrado");
}

function serveFile(request, response, file, stat) {
  const extension = path.extname(file).toLowerCase();
  const type = MIME[extension] || "application/octet-stream";
  const range = request.headers.range;

  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    if (!match) {
      response.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
      response.end();
      return;
    }

    let start = match[1] ? parseInt(match[1], 10) : 0;
    let end = match[2] ? parseInt(match[2], 10) : stat.size - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= stat.size) {
      response.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
      response.end();
      return;
    }

    end = Math.min(end, stat.size - 1);
    response.writeHead(206, {
      "Content-Type": type,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store"
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }
    fs.createReadStream(file, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, {
    "Content-Type": type,
    "Content-Length": stat.size,
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store"
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }
  fs.createReadStream(file).pipe(response);
}

const server = http.createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  } catch (error) {
    response.writeHead(400);
    return response.end("Solicitud inválida");
  }

  if (pathname === "/") pathname = "/index.html";
  const file = path.resolve(ROOT, "." + pathname);

  // Evita salir de la carpeta del proyecto.
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
    response.writeHead(403);
    return response.end("Acceso no permitido");
  }

  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) return notFound(response);
    serveFile(request, response, file, stat);
  });
});

server.listen(PORT, HOST, () => {
  console.log("");
  console.log("  El Castillo de los Sueños");
  console.log(`  Servidor listo en http://${HOST}:${PORT}`);
  console.log("  Pulsa Ctrl+C para detenerlo.");
  console.log("");
});
