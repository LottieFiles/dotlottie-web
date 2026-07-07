// Shared helpers for the lab harnesses (run.mjs = visual parity, bench.mjs =
// performance + memory). Anything both harnesses need lives here so they can't
// drift apart.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
export const REPO = resolve(HERE, '../..');
export const FIXTURES = join(REPO, 'fixtures');

/** Parse `--flag[=value]` CLI args into an object (`--flag` alone maps to true). */
export function parseArgs(argv = process.argv.slice(2)) {
  return Object.fromEntries(
    argv.map((a) => {
      const m = a.match(/^--([^=]+)(?:=(.*))?$/);
      return m ? [m[1], m[2] ?? true] : [a, true];
    }),
  );
}

function isLottieJson(file) {
  try {
    const d = JSON.parse(readFileSync(file, 'utf8'));
    return d && typeof d === 'object' && Array.isArray(d.layers) && typeof d.w === 'number';
  } catch {
    return false;
  }
}

/** Recursively collect Lottie JSON fixtures under `dir`. */
export function collectFixtures(dir = FIXTURES) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...collectFixtures(full));
    else if (extname(full) === '.json' && isLottieJson(full)) out.push(full);
  }
  return out;
}

export function openInBrowser(url) {
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  try {
    spawn(cmd, [url], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' }).unref();
  } catch {}
}

function newestMtimeMs(dir) {
  let newest = 0;
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    newest = Math.max(newest, st.isDirectory() ? newestMtimeMs(full) : st.mtimeMs);
  }
  return newest;
}

/**
 * The harnesses load `packages/web/dist` (both the WASM player and the lite
 * bundle), so a missing or stale build silently benchmarks old code. Rebuild
 * when dist is older than the newest source file; `--no-build` skips the check.
 */
export function ensureFreshBuild(args) {
  if (args['no-build'] !== undefined) return;

  const distFile = join(REPO, 'packages/web/dist/lite/index.js');
  const distTime = existsSync(distFile) ? statSync(distFile).mtimeMs : -1;

  if (distTime >= newestMtimeMs(join(REPO, 'packages/web/src'))) return;

  console.log(
    distTime < 0
      ? 'lab: packages/web/dist missing — building it first…\n'
      : 'lab: packages/web/dist is older than src — rebuilding first (skip with --no-build)…\n',
  );
  const r = spawnSync('pnpm', ['--filter', '@lottiefiles/dotlottie-web', 'build'], {
    cwd: REPO,
    stdio: 'inherit',
  });
  if (r.status !== 0) {
    console.error('lab: build failed; rerun with --no-build to use the existing dist.');
    process.exit(1);
  }
  console.log('');
}
