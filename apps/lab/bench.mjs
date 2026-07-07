#!/usr/bin/env node
// Performance + memory benchmark harness. Renders every Lottie fixture in the
// three engines (dotlottie-web software/WASM, dotlottie-web/lite, lottie-web),
// measures per-frame render cost and steady-state memory, and emits a report
// ranked slowest-first for lite so the biggest performance gaps get attention.
//
// Sibling to run.mjs (visual parity). Together these are the two axes of the
// benchmarks suite: correctness (visual parity) and cost (perf + memory).
//
// Usage (from the repo root):
//   pnpm bench [-- --filter=sub --frames=8 --maxDim=240 --iterations=30
//                 --warmup=5 --limit=N --top=40 --port=8824
//                 --serve --no-serve --no-open --no-build]
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { collectFixtures, ensureFreshBuild, openInBrowser, parseArgs, REPO } from './lib.mjs';
import { startServer } from './server.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));

const args = parseArgs();
const FILTER = typeof args.filter === 'string' ? args.filter : null;
const FRAMES = Number(args.frames ?? 8);
const MAXDIM = Number(args.maxDim ?? 240);
const ITERATIONS = Number(args.iterations ?? 30);
const WARMUP = Number(args.warmup ?? 5);
const TOP = Number(args.top ?? 40);
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const PORT = Number(args.port ?? 8824);

const ENGINE_LABELS = { web: 'dotlottie-web', lite: 'lite', lottieWeb: 'lottie-web' };
const ENGINE_KEYS = ['web', 'lite', 'lottieWeb'];

function fmtBytes(bytes) {
  if (bytes == null) return 'n/a';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function geomean(values) {
  const xs = values.filter((v) => v != null && v > 0);
  if (!xs.length) return null;
  return Math.exp(xs.reduce((s, v) => s + Math.log(v), 0) / xs.length);
}

function bar(value, max, width = 20) {
  const n = max > 0 ? Math.round((Math.min(max, value) / max) * width) : 0;
  return '█'.repeat(n) + '·'.repeat(width - n);
}

function aggregate(results) {
  const ok = results.filter((r) => !r.error);
  const summary = {};
  for (const key of ENGINE_KEYS) {
    const medians = ok.map((r) => r.engines[key]?.render.median).filter((v) => v != null);
    const mems = ok.map((r) => r.engines[key]?.memoryBytes).filter((v) => v != null);
    summary[key] = {
      geomeanMedianMs: medians.length ? +geomean(medians).toFixed(3) : null,
      medianMemoryBytes: mems.length ? mems.sort((a, b) => a - b)[Math.floor(mems.length / 2)] : null,
      count: medians.length,
    };
  }
  // Overall lite-vs-web speedup: geomean of per-fixture speedups.
  const speedups = ok.map((r) => r.speedup?.lite).filter((v) => v != null);
  summary.liteVsWebSpeedup = speedups.length ? +geomean(speedups).toFixed(2) : null;
  return summary;
}

async function main() {
  ensureFreshBuild(args);

  let fixtures = collectFixtures().sort();
  if (FILTER) fixtures = fixtures.filter((f) => f.includes(FILTER));
  fixtures = fixtures.slice(0, LIMIT);

  const interactive = process.stdout.isTTY === true;
  const serve = args.serve !== undefined || (interactive && args['no-serve'] === undefined);

  const server = await startServer({
    port: PORT,
    routes: {
      '/__bench.html': (_req, resp) => {
        const f = join(HERE, 'bench-report.html');
        if (!existsSync(f)) {
          resp.writeHead(404);
          resp.end('report not generated yet');
          return true;
        }
        resp.writeHead(200, { 'Content-Type': 'text/html' });
        resp.end(readFileSync(f));
        return true;
      },
      '/__bench.json': (_req, resp) => {
        const f = join(HERE, 'bench-report.json');
        if (!existsSync(f)) {
          resp.writeHead(404);
          resp.end('report not generated yet');
          return true;
        }
        resp.writeHead(200, { 'Content-Type': 'application/json' });
        resp.end(readFileSync(f));
        return true;
      },
    },
  });

  console.log(
    `lab · bench: ${fixtures.length} fixtures · ${FRAMES} frames · maxDim ${MAXDIM}px · ${ITERATIONS} iterations (warmup ${WARMUP})`,
  );

  // --expose-gc gives window.gc() for stable memory baselines; the precise-memory
  // flag improves the fallback heap counter when the accurate API is unavailable.
  const browser = await chromium.launch({
    args: ['--js-flags=--expose-gc', '--enable-precise-memory-info'],
  });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('  page error:', e.message));
  await page.goto(`http://localhost:${PORT}/apps/lab/bench.html`, { waitUntil: 'load' });
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });

  const memoryApi = await page.evaluate(() =>
    typeof performance.measureUserAgentSpecificMemory === 'function' && self.crossOriginIsolated
      ? 'measureUserAgentSpecificMemory'
      : performance.memory
        ? 'usedJSHeapSize'
        : 'none',
  );
  console.log(`memory metric: ${memoryApi}\n`);

  const results = [];
  let i = 0;
  for (const file of fixtures) {
    i++;
    const src = `/${relative(REPO, file).split('\\').join('/')}`;
    process.stdout.write(`[${i}/${fixtures.length}] ${src.replace(/^\/fixtures\//, '')} … `);
    let r;
    try {
      r = await page.evaluate((cfg) => window.runBench(cfg), {
        src,
        maxDim: MAXDIM,
        sampleFrames: FRAMES,
        iterations: ITERATIONS,
        warmup: WARMUP,
      });
      const ms = (k) => (r.engines[k] ? `${r.engines[k].render.median.toFixed(2)}ms` : 'n/a');
      const sp = r.speedup?.lite != null ? ` · lite ${r.speedup.lite}× ref` : '';
      console.log(`web ${ms('web')} · lite ${ms('lite')} · lw ${ms('lottieWeb')}${sp}`);
    } catch (e) {
      r = { src, error: String(e.message), engines: {} };
      console.log(`FAILED: ${e.message}`);
    }
    results.push(r);
  }

  await browser.close();

  const ok = results.filter((r) => !r.error);
  const failed = results.filter((r) => r.error);
  // Rank slowest-first by lite render time — the perf equivalent of the visual
  // harness's worst-parity-first ranking.
  const ranked = [...ok].sort((a, b) => (b.engines.lite?.render.median ?? 0) - (a.engines.lite?.render.median ?? 0));
  const summary = aggregate(results);

  // Console leaderboard: slowest lite renders.
  const maxLite = ranked[0]?.engines.lite?.render.median ?? 1;
  console.log(`\n══════ SLOWEST lite renders (top ${TOP}) ══════`);
  console.log(`${'lite ms'.padStart(9)}  ${'vs ref'.padStart(7)}  ${''.padEnd(20)}  fixture`);
  for (const r of ranked.slice(0, TOP)) {
    const lite = r.engines.lite?.render.median;
    const spd = r.speedup?.lite != null ? `${r.speedup.lite}×` : '—';
    const name = r.src.replace(/^\/fixtures\//, '');
    console.log(`${(lite?.toFixed(2) ?? 'n/a').padStart(9)}  ${spd.padStart(7)}  ${bar(lite ?? 0, maxLite)}  ${name}`);
  }

  console.log('\n══════ SUMMARY (geomean across fixtures) ══════');
  for (const key of ENGINE_KEYS) {
    const s = summary[key];
    console.log(
      `  ${ENGINE_LABELS[key].padEnd(14)} ${String(s.geomeanMedianMs ?? 'n/a').padStart(8)} ms/frame · median mem ${fmtBytes(s.medianMemoryBytes)}`,
    );
  }
  if (summary.liteVsWebSpeedup != null) {
    const faster = summary.liteVsWebSpeedup >= 1;
    console.log(`  lite is ${summary.liteVsWebSpeedup}× ${faster ? 'faster' : 'slower'} than dotlottie-web (geomean)`);
  }
  if (failed.length) console.log('\nFailed:', failed.map((f) => f.src).join(', '));

  const report = {
    generatedAt: new Date().toISOString(),
    config: { frames: FRAMES, maxDim: MAXDIM, iterations: ITERATIONS, warmup: WARMUP },
    memoryApi,
    summary,
    ranked,
    failed,
  };
  writeFileSync(join(HERE, 'bench-report.json'), JSON.stringify(report, null, 2));
  writeFileSync(join(HERE, 'bench-report.html'), renderHtml(report));

  console.log(`\nreport: ${join(HERE, 'bench-report.html')}`);
  console.log(`json:   ${join(HERE, 'bench-report.json')}`);

  const reportUrl = `http://localhost:${PORT}/__bench.html`;
  if (serve) {
    if (interactive && args['no-open'] === undefined) openInBrowser(reportUrl);
    console.log(`\n🖥  report: ${reportUrl}  (press Ctrl+C to stop)`);
    process.on('SIGINT', () => {
      server.close();
      process.exit(0);
    });
  } else {
    server.close();
  }
}

function renderHtml(report) {
  const { summary, ranked, failed, config, memoryApi } = report;
  const cell = (r, key) => {
    const e = r.engines[key];
    if (!e) return `<td class="eng na">n/a</td>`;
    const isLiteFast = key === 'lite' && r.speedup?.lite != null && r.speedup.lite >= 1;
    const isLiteSlow = key === 'lite' && r.speedup?.lite != null && r.speedup.lite < 1;
    return `<td class="eng ${isLiteFast ? 'fast' : ''} ${isLiteSlow ? 'slow' : ''}">
      <div class=ms>${e.render.median.toFixed(2)}<span class=u>ms</span></div>
      <div class=sub>${e.fps} fps · p95 ${e.render.p95.toFixed(2)}</div>
      <div class=sub>mem ${fmtBytes(e.memoryBytes)}</div>
    </td>`;
  };

  const rows = ranked
    .map((r) => {
      const spd = r.speedup?.lite != null ? `${r.speedup.lite}×` : '—';
      const name = r.src.replace(/^\/fixtures\//, '');
      return `<tr>
      <td class=name>${name}<div class=meta>${r.w}×${r.h} · ${r.frameCount} frames</div></td>
      <td class=spd>${spd}</td>
      ${cell(r, 'web')}${cell(r, 'lite')}${cell(r, 'lottieWeb')}
    </tr>`;
    })
    .join('\n');

  const sumCard = (key) => {
    const s = summary[key];
    return `<div class=card>
      <div class=k>${ENGINE_LABELS[key]}</div>
      <div class=v>${s.geomeanMedianMs ?? 'n/a'}<span class=u>ms/frame</span></div>
      <div class=cs>median mem ${fmtBytes(s.medianMemoryBytes)}</div>
    </div>`;
  };

  return `<!doctype html><meta charset=utf-8><title>dotLottie Lab — perf + memory</title>
<style>
  body{font:13px/1.4 -apple-system,system-ui,sans-serif;margin:0;background:#0e0e11;color:#e6e6e6}
  header{padding:16px 20px;border-bottom:1px solid #26262c;position:sticky;top:0;background:#141418;z-index:2}
  h1{margin:0 0 4px;font-size:16px}
  .sub{color:#8a8a94;font-size:12px}
  .cards{display:flex;gap:12px;margin-top:12px;flex-wrap:wrap}
  .card{background:#1a1a20;border:1px solid #2a2a32;border-radius:6px;padding:10px 14px;min-width:150px}
  .card .k{color:#8a8a94;font-size:11px}
  .card .v{font-size:22px;font-weight:700;margin-top:2px}
  .card .v .u{font-size:11px;color:#8a8a94;font-weight:400;margin-left:3px}
  .card .cs{color:#8a8a94;font-size:11px;margin-top:2px}
  .headline{margin-top:10px;font-size:13px;color:#7fd0a0}
  table{border-collapse:collapse;width:100%}
  th{position:sticky;top:96px;background:#141418;text-align:left;color:#8a8a94;font-weight:600;font-size:11px;padding:8px 12px;border-bottom:1px solid #26262c}
  td{border-bottom:1px solid #23232a;padding:10px 12px;vertical-align:top}
  .name{font-weight:600;max-width:260px;word-break:break-all}
  .name .meta{color:#8a8a94;font-weight:400;font-size:11px;margin-top:3px}
  .spd{font-weight:700;font-size:15px;color:#c7c7cf}
  td.eng .ms{font-size:16px;font-weight:700}
  td.eng .ms .u{font-size:10px;color:#8a8a94;font-weight:400;margin-left:2px}
  td.eng .sub{color:#8a8a94;font-size:11px}
  td.eng.fast{background:#0f1c14}
  td.eng.slow{background:#1f1210}
  td.eng.na{color:#666}
</style>
<header>
  <h1>dotLottie Lab · benchmarks — render performance + memory</h1>
  <div class=sub>${ranked.length} fixtures · ${config.frames} frames · ${config.maxDim}px · ${config.iterations} iterations · memory via ${memoryApi} · ranked by slowest lite render</div>
  <div class=cards>${ENGINE_KEYS.map(sumCard).join('')}</div>
  ${summary.liteVsWebSpeedup != null ? `<div class=headline>lite is <b>${summary.liteVsWebSpeedup}×</b> ${summary.liteVsWebSpeedup >= 1 ? 'faster' : 'slower'} than dotlottie-web (geomean of per-fixture median render time)</div>` : ''}
  ${failed.length ? `<div class="sub">⚠ ${failed.length} failed: ${failed.map((f) => f.src).join(', ')}</div>` : ''}
</header>
<table>
  <thead><tr><th>fixture</th><th>lite vs ref</th><th>dotlottie-web (ref)</th><th>lite</th><th>lottie-web</th></tr></thead>
  <tbody>
${rows}
  </tbody>
</table>`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
