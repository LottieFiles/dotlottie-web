// Shared static file server for both lab harnesses (run.mjs = visual parity,
// bench.mjs = performance + memory). Serves the repo tree with the COOP/COEP
// headers that enable cross-origin isolation — required for
// performance.measureUserAgentSpecificMemory() in the bench harness — plus a
// stable route for lottie-web's canvas ESM build and any per-harness custom
// routes passed in by the caller (dashboards, SSE streams, generated reports).
import { existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, extname, join } from 'node:path';
import { REPO } from './lib.mjs';

// Resolve lottie-web's canvas ESM build without hardcoding the (version- and
// package-manager-specific) node_modules layout; served at a stable route.
const require = createRequire(import.meta.url);
export const LOTTIE_WEB_CANVAS = join(
  dirname(require.resolve('lottie-web/package.json')),
  'build/player/esm/lottie_canvas.min.js',
);
export const LOTTIE_WEB_ROUTE = '/vendor/lottie-web-canvas.mjs';

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.lottie': 'application/zip',
  '.map': 'application/json',
  '.css': 'text/css',
};

/**
 * Start a static server rooted at the repo.
 *
 * @param {object} opts
 * @param {number} opts.port
 * @param {Record<string, (req, resp) => boolean>} [opts.routes]
 *   Optional exact-path handlers, checked before static files. A handler returns
 *   true if it served the request (so unknown paths fall through to static).
 * @returns {Promise<import('node:http').Server>}
 */
export function startServer({ port, routes = {} }) {
  return new Promise((res) => {
    const server = createServer((req, resp) => {
      try {
        const urlPath = decodeURIComponent(req.url.split('?')[0]);

        const custom = routes[urlPath];
        if (custom?.(req, resp)) return;

        if (urlPath === LOTTIE_WEB_ROUTE) {
          resp.writeHead(200, { 'Content-Type': 'text/javascript', 'Access-Control-Allow-Origin': '*' });
          resp.end(readFileSync(LOTTIE_WEB_CANVAS));
          return;
        }

        const filePath = join(REPO, urlPath);
        if (!filePath.startsWith(REPO) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
          resp.writeHead(404);
          resp.end('not found');
          return;
        }
        resp.writeHead(200, {
          'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
          // Cross-origin isolation: required for the accurate memory API.
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cross-Origin-Resource-Policy': 'cross-origin',
        });
        resp.end(readFileSync(filePath));
      } catch {
        resp.writeHead(500);
        resp.end('error');
      }
    });
    server.listen(port, () => res(server));
  });
}
