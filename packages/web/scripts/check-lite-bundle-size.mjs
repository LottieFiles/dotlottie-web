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

// Baseline at introduction: 31.62 KB gzipped (full DotLottie API surface, parser,
// Canvas2D renderer, packaged image/font resolution). Budget leaves <0.5 KB of
// headroom on purpose — additions to src/lite must justify their bytes.
const GZIP_BUDGET_BYTES = 32 * 1024;

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
