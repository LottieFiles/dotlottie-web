# dotLottie Lab

Test suite for the web players: **visual parity** (correctness) and **render
performance + memory** (cost), measured across the same three engines on the
same fixture set (`fixtures/`):

| Column          | Package                                      | Role                                                 |
| --------------- | -------------------------------------------- | ---------------------------------------------------- |
| `dotlottie-web` | `@lottiefiles/dotlottie-web` (software/WASM) | **Reference** — the canonical output lite must match |
| `lite`          | `@lottiefiles/dotlottie-web/lite`            | **Target** — the renderer under test                 |
| `lottie-web`    | `lottie-web` (canvas)                        | **Oracle** — an independent third implementation     |

Both harnesses run from the repo root and rebuild `packages/web/dist`
automatically when it is missing or older than the sources (skip with
`--no-build`):

```bash
pnpm parity   # visual parity — where lite's output diverges from the reference
pnpm bench    # performance + memory — what each engine costs per frame
```

Layout: `run.mjs`/`compare.html`/`dashboard.html` are the parity harness,
`bench.mjs`/`bench.html` the perf harness; `server.mjs` (static server with
COOP/COEP isolation) and `lib.mjs` (fixtures, CLI args, build check) are shared.

## Visual parity harness

Renders every Lottie fixture in the three engines and reports where
**`@lottiefiles/dotlottie-web/lite`** (the pure-Canvas2D renderer) diverges from
the **`@lottiefiles/dotlottie-web`** software renderer (ThorVG/WASM), ranked
worst-first so the biggest gaps get fixed first.

### Why the oracle matters

Every fixture is diffed three ways (lite↔web, lottie-web↔web, lite↔lottie-web).
The ranking is by **lite↔web**, but the oracle tells us *whose* bug it is:

* **lite↔web high, lottie-web↔web low** → lite is the outlier. A real lite bug —
  highest ROI to fix.
* **lite↔web high AND lottie-web↔web high, and lite≈lottie-web** → both
  independent renderers agree with each other but not with the reference, so the
  ThorVG reference is the likely outlier. Flagged **`ref-suspect`** and
  deprioritized for lite work.

### Usage

```bash
# run across every fixture
pnpm parity

# common flags (pass through after --)
pnpm parity -- \
  --filter=confetti \   # only fixtures whose path contains this substring
  --frames=5 \          # frames sampled per animation (evenly across [ip, op-1])
  --maxDim=240 \        # longest canvas edge in px
  --top=50 \            # rows in the console leaderboard
  --limit=20 \          # cap number of fixtures (quick smoke run)
  --serve \             # keep the server up after the run (implied on a TTY)
  --no-serve \          # exit as soon as the run finishes
  --no-open \           # don't auto-open the dashboard in a browser
  --no-build            # skip the packages/web freshness check/rebuild
```

(Or from this directory: `node run.mjs [flags]`.)

### Live dashboard

When run in a terminal, the harness opens a **live dashboard** in your browser
and streams progress over Server-Sent Events as each fixture completes — a
progress bar with ETA, running stats (median, \<5% / 5–10% / 10–20% / ≥20%
buckets), a strip of the most recent renders, and a worst-first leaderboard with
side-by-side thumbnails that reorders as results arrive. No more staring at a
silent terminal for minutes.

* Dashboard: `http://localhost:8823/__live` (also served at `/`)
* Full report once done: `http://localhost:8823/__parity.html` · `/__parity.json`
* The server stays up after the run so the report stays viewable (Ctrl+C to
  stop). In non-interactive/CI runs it exits automatically; force either with
  `--serve` / `--no-serve`.

Outputs, also written to disk next to `run.mjs`:

* `parity-report.html` — visual side-by-side (reference · lite · lottie-web ·
  diff heatmap) for every fixture, worst-first. Open in a browser.
* `parity-report.json` — machine-readable per-frame diffs for scripting/CI.

### How it works

`run.mjs` starts a static file server at the repo root, launches headless
Chromium via Playwright, and loads `compare.html`. That page imports all three
engines, and `window.runFixture()` renders each fixture at the sampled frames,
reads back the canvas pixels, and computes diffs + thumbnails. The driver calls
it once per fixture and aggregates the ranking.

Notes:

* Only **integer** frames are sampled. ThorVG (dotlottie-web) may skip
  re-rendering a subframe when it is within \~0.001 of the previous frame (a
  performance optimization), so fractional frames produce spurious diffs.
* The exact end frame (`op`) is skipped — engines resolve the loop boundary
  inconsistently (clamp vs wrap), which would produce spurious diffs. Frames are
  sampled across `[ip, op-1]`.
* Only `.json` Lottie fixtures are covered today (lottie-web can't open a
  packaged `.lottie` without unzipping). `.lottie` support is a possible
  follow-up.
* The diff metric is the percentage of pixels whose summed RGBA delta exceeds a
  small threshold; sub-pixel anti-aliasing on edges typically lands animations
  in the 1–3% "matching" band.

## Performance + memory benchmarks

`bench.mjs` renders every fixture in all three engines and measures **render
cost** and **memory**, ranked slowest-first for lite (the perf equivalent of the
visual harness's worst-parity-first ranking).

```bash
# run across every fixture
pnpm bench

# common flags
pnpm bench -- \
  --filter=confetti \   # only fixtures whose path contains this substring
  --frames=8 \          # distinct integer frames rendered per animation
  --iterations=30 \     # timed render passes over the frame set (more = stabler)
  --warmup=5 \          # untimed warmup passes (JIT / cache priming)
  --maxDim=240 \        # longest canvas edge in px
  --limit=20 \          # cap number of fixtures (quick smoke run)
  --top=40 \            # rows in the console leaderboard
  --no-serve --no-open  # exit immediately, don't open the report
```

(Or from this directory: `node bench.mjs [flags]`.)

Outputs, written next to `bench.mjs`:

* `bench-report.html` — per-fixture table (median ms · fps · p95 · memory for
  each engine, plus lite-vs-reference speedup), with a geomean summary. Also
  served at `http://localhost:8824/__bench.html` while the process is up.
* `bench-report.json` — machine-readable results for scripting/CI regression
  tracking.

### Metrics

* **Render time** — each `setFrame + render` (or lottie-web `goToAndStop`) is
  timed individually and **synchronously** (no `requestAnimationFrame` between
  renders), so the number is the engine's actual CPU/WASM render cost, not the
  display's 60 Hz vsync cadence. Reported as median / mean / p95 ms per frame;
  `fps` is `1000 / median`. Frames are cycled so consecutive renders always
  differ, defeating "skip redraw if the frame is unchanged" optimizations.
* **Memory** — measured with
  [`performance.measureUserAgentSpecificMemory()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory)
  when available (accurate, includes WASM linear memory; requires the
  cross-origin isolation the server enables via COOP/COEP), falling back to
  `performance.memory.usedJSHeapSize`. Chromium is launched with
  `--js-flags=--expose-gc` so the harness can force a GC for a stable baseline.
  Per engine it reports the **delta**: `measure → create + load + prime render →
  gc → measure`.

### Caveats

* The memory number is a **per-instance delta**, not the process total. A one-off
  global cost — most notably the `dotlottie-web` **WASM runtime**, which stays
  resident after `destroy()` — is paid on its first fixture and reads as \~0 on
  later ones. Treat reference-engine memory as *incremental per instance on top
  of an amortized WASM baseline*, and compare engines by their own trend rather
  than a single fixture's absolute delta.
* Whole-agent GC-delta memory is inherently noisier than render timing; run over
  many fixtures and read the geomean/median summary, not one row.
* Only **integer** frames across `[ip, op-1]` are rendered, matching the visual
  harness (ThorVG may skip near-duplicate subframes; loop boundaries differ
  across engines).
* The perf and visual harnesses share `server.mjs` and `lib.mjs`, the fixture
  set, and the three-engine load path, but run as separate processes on separate
  ports (visual `8823`, bench `8824`).
