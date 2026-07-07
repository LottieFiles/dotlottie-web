#!/usr/bin/env node
// Visual-parity harness: renders every Lottie fixture in three engines
// (dotlottie-web software, dotlottie-web/lite, lottie-web), diffs lite against
// the dotlottie-web reference, and emits a report ranked worst-first so the
// biggest parity gaps get attention first. lottie-web acts as an oracle: when
// lite matches lottie-web but both differ from dotlottie-web, the reference is
// the likely outlier.
//
// Usage (from the repo root):
//   pnpm parity [-- --filter=sub --frames=5 --maxDim=240 --top=40 --limit=N
//                  --port=8823 --serve --no-serve --no-open --no-build]
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { collectFixtures, ensureFreshBuild, openInBrowser, parseArgs, REPO } from './lib.mjs';
import { startServer } from './server.mjs';

const HERE = fileURLToPath(new URL('.', import.meta.url));

const DASHBOARD_ROUTE = '/__live';
const EVENTS_ROUTE = '/__events';
const REPORT_HTML_ROUTE = '/__parity.html';
const REPORT_JSON_ROUTE = '/__parity.json';

// Live dashboard state, streamed to connected browsers over Server-Sent Events.
const sseClients = new Set();
const liveState = { total: 0, startTime: 0, done: false, results: [], meta: {}, reportUrl: null };
function broadcast(event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(payload);
    } catch {}
  }
}

const args = parseArgs();
const FILTER = typeof args.filter === 'string' ? args.filter : null;
const FRAMES = Number(args.frames ?? 5);
const MAXDIM = Number(args.maxDim ?? 240);
const TOP = Number(args.top ?? 40);
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const PORT = Number(args.port ?? 8823);

function serveDashboard(_req, resp) {
  resp.writeHead(200, { 'Content-Type': 'text/html' });
  resp.end(readFileSync(join(HERE, 'dashboard.html')));
  return true;
}

function serveReport(file, type) {
  return (_req, resp) => {
    const reportFile = join(HERE, file);
    if (!existsSync(reportFile)) {
      resp.writeHead(404);
      resp.end('report not generated yet');
      return true;
    }
    resp.writeHead(200, { 'Content-Type': type });
    resp.end(readFileSync(reportFile));
    return true;
  };
}

function serveEvents(req, resp) {
  resp.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  resp.write('retry: 2000\n\n');
  resp.write(`data: ${JSON.stringify({ type: 'init', ...liveState })}\n\n`);
  sseClients.add(resp);
  req.on('close', () => sseClients.delete(resp));
  return true;
}

async function main() {
  ensureFreshBuild(args);

  const server = await startServer({
    port: PORT,
    routes: {
      '/': serveDashboard,
      [DASHBOARD_ROUTE]: serveDashboard,
      [EVENTS_ROUTE]: serveEvents,
      [REPORT_HTML_ROUTE]: serveReport('parity-report.html', 'text/html'),
      [REPORT_JSON_ROUTE]: serveReport('parity-report.json', 'application/json'),
    },
  });

  let fixtures = collectFixtures().sort();
  if (FILTER) fixtures = fixtures.filter((f) => f.includes(FILTER));
  fixtures = fixtures.slice(0, LIMIT);

  const interactive = process.stdout.isTTY === true;
  const serve = args.serve !== undefined || (interactive && args['no-serve'] === undefined);
  const dashboardUrl = `http://localhost:${PORT}${DASHBOARD_ROUTE}`;

  liveState.total = fixtures.length;
  liveState.startTime = Date.now();
  liveState.done = false;
  liveState.results = [];
  liveState.reportUrl = null;
  liveState.meta = { frames: FRAMES, maxDim: MAXDIM };
  broadcast({ type: 'start', total: fixtures.length, startTime: liveState.startTime, meta: liveState.meta });

  console.log(`lab · visual parity: ${fixtures.length} fixtures · ${FRAMES} frames · maxDim ${MAXDIM}px`);
  console.log(`live dashboard: ${dashboardUrl}\n`);
  if (interactive && args['no-open'] === undefined) openInBrowser(dashboardUrl);

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('  page error:', e.message));
  await page.goto(`http://localhost:${PORT}/apps/lab/compare.html`, { waitUntil: 'load' });
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });

  const results = liveState.results;
  let i = 0;
  for (const file of fixtures) {
    i++;
    const src = `/${relative(REPO, file).split('\\').join('/')}`;
    broadcast({ type: 'progress', i, total: fixtures.length, src });
    process.stdout.write(`[${i}/${fixtures.length}] ${src} … `);
    let r;
    try {
      r = await page.evaluate((cfg) => window.runFixture(cfg), { src, maxDim: MAXDIM, sampleFrames: FRAMES });
      const oracle = r.hasLottieWeb ? ` (lw↔web ${r.maxLwVsWeb}%)` : ' (lw n/a)';
      console.log(`lite↔web max ${r.maxLiteVsWeb}%${r.referenceSuspect ? ' [ref-suspect]' : ''}${oracle}`);
    } catch (e) {
      r = { src, error: String(e.message), maxLiteVsWeb: -1, perFrame: [] };
      console.log(`FAILED: ${e.message}`);
    }
    results.push(r);
    broadcast({ type: 'result', i, total: fixtures.length, r, elapsed: Date.now() - liveState.startTime });
  }

  await browser.close();

  const ranked = results.filter((r) => !r.error).sort((a, b) => b.maxLiteVsWeb - a.maxLiteVsWeb);
  const failed = results.filter((r) => r.error);

  // Console leaderboard.
  console.log(`\n══════ WORST lite↔web parity (top ${TOP}) ══════`);
  for (const r of ranked.slice(0, TOP)) {
    const flag = r.referenceSuspect ? ' ⚠ref' : '';
    const name = r.src.replace(/^\/fixtures\//, '');
    console.log(`${String(r.maxLiteVsWeb).padStart(6)}%  ${bar(r.maxLiteVsWeb)}  ${name}${flag}`);
  }
  if (failed.length) {
    console.log('\nFailed to render:', failed.map((f) => f.src).join(', '));
  }

  writeFileSync(
    join(HERE, 'parity-report.json'),
    JSON.stringify({ generatedFrames: FRAMES, maxDim: MAXDIM, ranked, failed }, null, 2),
  );
  writeFileSync(join(HERE, 'parity-report.html'), renderHtml(ranked, failed, { FRAMES, MAXDIM }));

  liveState.done = true;
  liveState.reportUrl = REPORT_HTML_ROUTE;
  liveState.elapsedMs = Date.now() - liveState.startTime;
  broadcast({ type: 'done', reportUrl: REPORT_HTML_ROUTE, elapsedMs: liveState.elapsedMs });

  console.log(`\nreport: ${join(HERE, 'parity-report.html')}`);
  console.log(`json:   ${join(HERE, 'parity-report.json')}`);

  if (serve) {
    console.log(`\n🖥  live dashboard + report: ${dashboardUrl}  (press Ctrl+C to stop)`);
    process.on('SIGINT', () => {
      server.close();
      process.exit(0);
    });
    // The open server keeps the process alive so the report stays viewable.
  } else {
    server.close();
  }
}

function bar(pct, width = 24) {
  const n = Math.round((Math.min(100, pct) / 100) * width);
  return '█'.repeat(n) + '·'.repeat(width - n);
}

function renderHtml(ranked, failed, meta) {
  const rows = ranked
    .map((r) => {
      const t = r.thumbs || {};
      const frameCells = r.perFrame
        .map(
          (p) =>
            `${p.frame}: <b>${p.liteVsWeb.diffPct}%</b>${p.lwVsWeb ? ` <span class=lw>(lw ${p.lwVsWeb.diffPct}%)</span>` : ''}`,
        )
        .join('<br>');
      const img = (u, label) =>
        u
          ? `<figure><img src="${u}"><figcaption>${label}</figcaption></figure>`
          : `<figure class=na><figcaption>${label}<br>n/a</figcaption></figure>`;
      return `<tr class="${r.referenceSuspect ? 'suspect' : ''}">
      <td class=score><div class=num>${r.maxLiteVsWeb}%</div><div class=avg>avg ${r.avgLiteVsWeb}%</div>${r.referenceSuspect ? '<div class=tag>ref-suspect</div>' : ''}</td>
      <td class=name>${r.src.replace(/^\//, '')}<div class=meta>${r.w}×${r.h} · frame ${t.worstFrame}</div></td>
      <td class=thumbs>${img(t.web, 'dotlottie-web')}${img(t.lite, 'lite')}${img(t.lottieWeb, 'lottie-web')}${img(t.diff, 'lite▲web diff')}</td>
      <td class=frames>${frameCells}</td>
    </tr>`;
    })
    .join('\n');

  return `<!doctype html><meta charset=utf-8><title>dotLottie Lab — visual parity</title>
<style>
  body{font:13px/1.4 -apple-system,system-ui,sans-serif;margin:0;background:#0e0e11;color:#e6e6e6}
  header{padding:16px 20px;border-bottom:1px solid #26262c;position:sticky;top:0;background:#141418;z-index:2}
  h1{margin:0 0 4px;font-size:16px}
  .sub{color:#8a8a94;font-size:12px}
  table{border-collapse:collapse;width:100%}
  td{border-bottom:1px solid #23232a;padding:10px 12px;vertical-align:top}
  tr.suspect{background:#1b1710}
  .score .num{font-size:20px;font-weight:700}
  .score .avg{color:#8a8a94;font-size:11px}
  .tag{margin-top:4px;font-size:10px;color:#e0a83a;border:1px solid #6a531a;border-radius:3px;padding:1px 4px;display:inline-block}
  .name{font-weight:600;max-width:220px;word-break:break-all}
  .name .meta{color:#8a8a94;font-weight:400;font-size:11px;margin-top:3px}
  .thumbs{display:flex;gap:8px}
  figure{margin:0;text-align:center}
  figure img{display:block;border:1px solid #33333c;border-radius:4px;background:#000}
  figcaption{color:#8a8a94;font-size:10px;margin-top:3px}
  figure.na{width:130px;height:96px;display:flex;align-items:center;justify-content:center;border:1px dashed #33333c;border-radius:4px;color:#666}
  .frames{color:#c7c7cf;font-size:11px;white-space:nowrap}
  .lw{color:#6f9fd8}
  .legend{color:#8a8a94;font-size:11px;margin-top:6px}
</style>
<header>
  <h1>dotLottie Lab · visual parity — dotlottie-web/lite vs dotlottie-web</h1>
  <div class=sub>${ranked.length} fixtures · ${meta.FRAMES} frames each · ${meta.MAXDIM}px · ranked by worst lite↔web frame diff</div>
  <div class=legend>columns: dotlottie-web (reference) · lite (target) · lottie-web (oracle) · diff heatmap (pink = mismatch). <b>ref-suspect</b> = lite agrees with lottie-web, so dotlottie-web may be the outlier.${failed.length ? ` · ${failed.length} failed: ${failed.map((f) => f.src).join(', ')}` : ''}</div>
</header>
<table><tbody>
${rows}
</tbody></table>`;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
