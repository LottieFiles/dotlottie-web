/**
 * Post-build guard: fails the build if dist/index.js stops being tree-shakable.
 *
 * A `DotLottie`-only consumer bundle must not retain the inline worker. This broke
 * once before: ES2020 down-levels static class fields into top-level side-effectful
 * statements that no bundler can prove pure (issue #344). Statics on exported classes
 * must use the module-level lazy-singleton pattern instead (see src/worker/dotlottie.ts).
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as esbuild from 'esbuild';

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');

// Thrown by the InlineWorker wrapper emitted by rolldown-plugins/plugin-inline-worker.ts.
const WORKER_MARKER = 'Worker is not supported in this environment.';
const MAX_DOTLOTTIE_ONLY_BYTES = 100_000; // 55 KB as of #925; worker would add ~95 KB.

async function bundle(entry) {
  const result = await esbuild.build({
    stdin: { contents: entry, resolveDir: distDir, sourcefile: 'entry.js' },
    bundle: true,
    minify: true,
    write: false,
    format: 'esm',
    logLevel: 'silent',
  });

  return result.outputFiles[0].text;
}

const fullBundle = await bundle(`export * from './index.js';`);

if (!fullBundle.includes(WORKER_MARKER)) {
  throw new Error(
    'verify-dist: worker marker not found in a full-export bundle — the marker string moved and this guard is blind. Update WORKER_MARKER.',
  );
}

const dotLottieOnly = await bundle(`export { DotLottie } from './index.js';`);

if (dotLottieOnly.includes(WORKER_MARKER)) {
  throw new Error(
    'verify-dist: a DotLottie-only bundle retains the inline worker — dist/index.js has top-level side effects again (issue #344). Likely cause: a static class field on an exported class; use the lazy-singleton pattern.',
  );
}

if (dotLottieOnly.length > MAX_DOTLOTTIE_ONLY_BYTES) {
  throw new Error(
    `verify-dist: DotLottie-only bundle is ${dotLottieOnly.length} bytes (limit ${MAX_DOTLOTTIE_ONLY_BYTES}). Raise the limit deliberately if this growth is intended.`,
  );
}

console.log(`verify-dist: ok — DotLottie-only bundle is ${dotLottieOnly.length} bytes, worker tree-shaken.`);
