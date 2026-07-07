/**
 * Bundle-size gate for the lite player.
 *
 * The lite variant exists to be small: no WASM, no runtime fetches, minimal JS.
 * This check fails the build when the gzipped ESM bundle exceeds the budget so
 * size regressions surface in the PR that introduces them, not after release.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

// 35 KB since the 2026-07 upstream sync (34.69 KB actual): compound-fill holes,
// explicit track mattes (tp), repeater rework, supersample fast paths, zip-bomb
// guards, and parsed-source caching. Renderer stats instrumentation accounts for
// only ~0.6 KB of that — candidate for an upstream tree-shakeable split.
const GZIP_BUDGET_BYTES = 35 * 1024;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bundlePath = path.resolve(__dirname, '../dist/lite/index.js');

let bundle;

try {
  bundle = await fs.readFile(bundlePath);
} catch {
  console.error(`[lite-bundle-size] Bundle not found at ${bundlePath}. Run the build first.`);
  process.exit(1);
}

const gzipped = gzipSync(bundle, { level: 9 }).byteLength;
const format = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;

if (gzipped > GZIP_BUDGET_BYTES) {
  console.error(
    `[lite-bundle-size] FAIL: dist/lite/index.js is ${format(gzipped)} gzipped, ` +
      `over the ${format(GZIP_BUDGET_BYTES)} budget (raw: ${format(bundle.byteLength)}).`,
  );
  process.exit(1);
}

console.log(
  `[lite-bundle-size] OK: dist/lite/index.js is ${format(gzipped)} gzipped ` +
    `(budget ${format(GZIP_BUDGET_BYTES)}, raw ${format(bundle.byteLength)}).`,
);
