#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
// Visual-parity harness: renders every Lottie fixture in three engines
// (dotlottie-web software, dotlottie-web/lite, lottie-web), diffs lite against
// the dotlottie-web reference, and emits a report ranked worst-first so the
// biggest parity gaps get attention first. lottie-web acts as an oracle: when
// lite matches lottie-web but both differ from dotlottie-web, the reference is
// the likely outlier.
//
// Usage:
//   pnpm --filter visual-parity parity [--filter=sub] [--frames=5] [--maxDim=240]
//                                      [--top=40] [--limit=N] [--port=8823]
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const REPO = resolve(HERE, '../..');
const FIXTURES = resolve(REPO, 'fixtures');

// Resolve lottie-web's canvas ESM build without hardcoding the (version- and
// package-manager-specific) node_modules layout; served at a stable route below.
const require = createRequire(import.meta.url);
const LOTTIE_WEB_CANVAS = join(
  dirname(require.resolve('lottie-web/package.json')),
  'build/player/esm/lottie_canvas.min.js',
);
const LOTTIE_WEB_ROUTE = '/vendor/lottie-web-canvas.mjs';

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? true] : [a, true];
  }),
);
const FILTER = typeof args.filter === 'string' ? args.filter : null;
const FRAMES = Number(args.frames ?? 5);
const MAXDIM = Number(args.maxDim ?? 240);
const TOP = Number(args.top ?? 40);
const LIMIT = args.limit ? Number(args.limit) : Infinity;
const PORT = Number(args.port ?? 8823);

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

function startServer() {
  return new Promise((res) => {
    const server = createServer((req, resp) => {
      try {
        const urlPath = decodeURIComponent(req.url.split('?')[0]);
        if (urlPath === LOTTIE_WEB_ROUTE) {
          resp.writeHead(200, { 'Content-Type': 'text/javascript', 'Access-Control-Allow-Origin': '*' });
          resp.end(readFileSync(LOTTIE_WEB_CANVAS));
          return;
        }
        const filePath = join(REPO, urlPath);
        if (!filePath.startsWith(REPO) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
          resp.writeHead(404);
          resp.end('nope');
          return;
        }
        resp.writeHead(200, {
          'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
        });
        resp.end(readFileSync(filePath));
      } catch {
        resp.writeHead(500);
        resp.end('err');
      }
    });
    server.listen(PORT, () => res(server));
  });
}

function isLottieJson(file) {
  try {
    const d = JSON.parse(readFileSync(file, 'utf8'));
    return d && typeof d === 'object' && Array.isArray(d.layers) && typeof d.w === 'number';
  } catch {
    return false;
  }
}

function collectFixtures(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...collectFixtures(full));
    } else if (extname(full) === '.json' && isLottieJson(full)) {
      out.push(full);
    }
  }
  return out;
}

function bar(pct, width = 24) {
  const n = Math.round((Math.min(100, pct) / 100) * width);
  return '█'.repeat(n) + '·'.repeat(width - n);
}

async function main() {
  const server = await startServer();
  let fixtures = collectFixtures(FIXTURES).sort();
  if (FILTER) fixtures = fixtures.filter((f) => f.includes(FILTER));
  fixtures = fixtures.slice(0, LIMIT);
  console.log(`visual-parity: ${fixtures.length} fixtures · ${FRAMES} frames · maxDim ${MAXDIM}px\n`);

  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('  page error:', e.message));
  await page.goto(`http://localhost:${PORT}/apps/visual-parity/compare.html`, { waitUntil: 'load' });
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });

  const results = [];
  let i = 0;
  for (const file of fixtures) {
    i++;
    const src = `/${relative(REPO, file).split('\\').join('/')}`;
    process.stdout.write(`[${i}/${fixtures.length}] ${src} … `);
    try {
      const r = await page.evaluate((cfg) => window.runFixture(cfg), { src, maxDim: MAXDIM, sampleFrames: FRAMES });
      results.push(r);
      const oracle = r.hasLottieWeb ? ` (lw↔web ${r.maxLwVsWeb}%)` : ' (lw n/a)';
      console.log(`lite↔web max ${r.maxLiteVsWeb}%${r.referenceSuspect ? ' [ref-suspect]' : ''}${oracle}`);
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      results.push({ src, error: String(e.message), maxLiteVsWeb: -1, perFrame: [] });
    }
  }

  await browser.close();
  server.close();

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

  const outDir = HERE;
  writeFileSync(
    join(outDir, 'report.json'),
    JSON.stringify({ generatedFrames: FRAMES, maxDim: MAXDIM, ranked, failed }, null, 2),
  );
  writeFileSync(join(outDir, 'report.html'), renderHtml(ranked, failed, { FRAMES, MAXDIM }));
  console.log(`\nreport: ${join(outDir, 'report.html')}`);
  console.log(`json:   ${join(outDir, 'report.json')}`);
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

  return `<!doctype html><meta charset=utf-8><title>Lottie visual parity</title>
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
  <h1>Lottie visual parity — dotlottie-web/lite vs dotlottie-web</h1>
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
