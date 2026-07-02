# Visual parity harness

Renders every Lottie fixture in three engines and reports where
**`@lottiefiles/dotlottie-web/lite`** (the pure-Canvas2D renderer) diverges from
the **`@lottiefiles/dotlottie-web`** software renderer (ThorVG/WASM), ranked
worst-first so the biggest gaps get fixed first.

The three engines:

| Column          | Package                                      | Role                                                 |
| --------------- | -------------------------------------------- | ---------------------------------------------------- |
| `dotlottie-web` | `@lottiefiles/dotlottie-web` (software/WASM) | **Reference** — the canonical output lite must match |
| `lite`          | `@lottiefiles/dotlottie-web/lite`            | **Target** — the renderer under test                 |
| `lottie-web`    | `lottie-web` (canvas)                        | **Oracle** — an independent third implementation     |

## Why the oracle matters

Every fixture is diffed three ways (lite↔web, lottie-web↔web, lite↔lottie-web).
The ranking is by **lite↔web**, but the oracle tells us *whose* bug it is:

* **lite↔web high, lottie-web↔web low** → lite is the outlier. A real lite bug —
  highest ROI to fix.
* **lite↔web high AND lottie-web↔web high, and lite≈lottie-web** → both
  independent renderers agree with each other but not with the reference, so the
  ThorVG reference is the likely outlier. Flagged **`ref-suspect`** and
  deprioritized for lite work.

## Usage

```bash
# build the lite/web bundles first (the harness loads packages/web/dist)
pnpm --filter @lottiefiles/dotlottie-web build

# run across every fixture
pnpm --filter visual-parity parity

# common flags (pass through after --)
pnpm --filter visual-parity parity -- \
  --filter=confetti \   # only fixtures whose path contains this substring
  --frames=5 \          # frames sampled per animation (evenly across [ip, op-1])
  --maxDim=240 \        # longest canvas edge in px
  --top=50 \            # rows in the console leaderboard
  --limit=20            # cap number of fixtures (quick smoke run)
```

(Or from this directory: `node run.mjs [flags]`.)

Outputs, written next to `run.mjs`:

* `report.html` — visual side-by-side (reference · lite · lottie-web · diff
  heatmap) for every fixture, worst-first. Open in a browser.
* `report.json` — machine-readable per-frame diffs for scripting/CI.

## How it works

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
