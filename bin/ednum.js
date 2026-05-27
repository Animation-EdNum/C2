#!/usr/bin/env node
/* SPDX-License-Identifier: AGPL-3.0-only
 * Copyright (C) 2026 Vivian Epiney (AP-EdNum, HEP-VS) */
/**
 * Suite EdNum — Local server
 * Serves the static suite on localhost when run via `npx @ednum/suite-ednum`
 */

'use strict';

const http = require('node:http');
const fs   = require('node:fs');
const path = require('node:path');
const url  = require('node:url');

// ─── Configuration ────────────────────────────────────────────────────────────
const PORT    = parseInt(process.env.PORT || '3000', 10);
const ROOT    = path.resolve(path.join(__dirname, '..')); // package root (one level up from /bin)
const SECURE_ROOT = ROOT.endsWith(path.sep) ? ROOT : ROOT + path.sep;
const OPEN_BROWSER = process.argv.includes('--no-open') === false;

// ─── MIME types ───────────────────────────────────────────────────────────────
const MIME = {
  '.html'  : 'text/html; charset=utf-8',
  '.css'   : 'text/css; charset=utf-8',
  '.js'    : 'application/javascript; charset=utf-8',
  '.json'  : 'application/json; charset=utf-8',
  '.svg'   : 'image/svg+xml',
  '.png'   : 'image/png',
  '.jpg'   : 'image/jpeg',
  '.jpeg'  : 'image/jpeg',
  '.webp'  : 'image/webp',
  '.ico'   : 'image/x-icon',
  '.woff'  : 'font/woff',
  '.woff2' : 'font/woff2',
  '.ttf'   : 'font/ttf',
  '.otf'   : 'font/otf',
  '.mp3'   : 'audio/mpeg',
  '.wav'   : 'audio/wav',
  '.txt'   : 'text/plain; charset=utf-8',
};

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 200;
const ipRequestCounts = new Map();

// Clear the request counts periodically to prevent memory leaks.
// unref() ensures this interval doesn't prevent Node from exiting.
setInterval(() => {
  ipRequestCounts.clear();
}, RATE_LIMIT_WINDOW_MS).unref();

// ─── Server ───────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('405 Method Not Allowed');
    return;
  }

  // Rate limiting check
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const currentCount = ipRequestCounts.get(ip) || 0;

  if (currentCount >= RATE_LIMIT_MAX_REQUESTS) {
    res.writeHead(429, {
      'Content-Type': 'text/plain',
      'Retry-After': Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)
    });
    res.end('429 Too Many Requests');
    return;
  }
  ipRequestCounts.set(ip, currentCount + 1);

  // Parse the request URL and resolve the file path
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname || '';
  try {
    pathname = decodeURIComponent(pathname);
  } catch (e) {
    // fallback to original pathname if decode fails
  }

  let filePath = path.resolve(path.join(ROOT, pathname));

  // Prevent directory traversal outside ROOT
  if (filePath !== ROOT && !filePath.startsWith(SECURE_ROOT)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  // Serve index.html for directory requests
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 — File not found: ${parsedUrl.pathname}`);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 — Internal server error: ${err.message}`);
      }
      return;
    }

    const ext      = path.extname(filePath).toLowerCase();
    const mimeType = MIME[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type'  : mimeType,
      // Allow Service Worker to work from root scope
      'Service-Worker-Allowed': '/',
    });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  const localUrl = `http://localhost:${PORT}`;

  console.log('');
  console.log('  🎓 Suite EdNum — Éducation Numérique (HEP-VS)');
  console.log('  ───────────────────────────────────────────────');
  console.log(`  ✅ Serveur démarré sur : \x1b[36m${localUrl}\x1b[0m`);
  console.log(`  📚 Portail principal   : \x1b[36m${localUrl}/index.html\x1b[0m`);
  console.log(`  👶 Portail Cycle 1     : \x1b[36m${localUrl}/indexC1.html\x1b[0m`);
  console.log('');
  console.log('  Appuyez sur  Ctrl+C  pour arrêter le serveur.');
  console.log('');

  // Attempt to open the browser automatically
  if (OPEN_BROWSER) {
    openBrowser(localUrl);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ❌ Le port ${PORT} est déjà utilisé.`);
    console.error(`  👉 Essayez : PORT=3001 npx @ednum/suite-ednum\n`);
  } else {
    console.error(`\n  ❌ Erreur serveur : ${err.message}\n`);
  }
  process.exit(1);
});

// ─── Open browser helper ──────────────────────────────────────────────────────
function openBrowser(url) {
  const { platform } = process;
  let cmd;

  if (platform === 'win32')       cmd = `start "" "${url}"`;
  else if (platform === 'darwin') cmd = `open "${url}"`;
  else                            cmd = `xdg-open "${url}"`;

  require('node:child_process').exec(cmd, (err) => {
    if (err) {
      // Silently fail — the URL is already printed in the console
    }
  });
}
