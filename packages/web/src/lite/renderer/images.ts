import type { ImageSource } from '../model';
import type { RenderingContext2D } from './types';

// The cache holds the decoded bitmap once ready. A pending load leaves no
// entry, so callers treat it as "not yet available" and re-check next frame.
export type ImageCache = Map<string, ImageBitmap>;

// Track in-flight decodes per cache so repeated synchronous getCachedImage
// misses (one per rendered frame until the decode resolves) don't spawn
// duplicate loads, and so preload() can await a load kicked off by a render.
const inFlight = new WeakMap<ImageCache, Map<string, Promise<void>>>();

// Sources whose decode failed stay failed (matching the old `new Image()`
// behavior); without this a 404 asset would refetch on every rendered frame.
const failedSources = new WeakMap<ImageCache, Set<string>>();

function pendingMap(cache: ImageCache): Map<string, Promise<void>> {
  let map = inFlight.get(cache);
  if (!map) {
    map = new Map();
    inFlight.set(cache, map);
  }
  return map;
}

function failedSet(cache: ImageCache): Set<string> {
  let set = failedSources.get(cache);
  if (!set) {
    set = new Set();
    failedSources.set(cache, set);
  }
  return set;
}

// Decode WITHOUT colour management so results match dotLottie/ThorVG, which read
// raw pixels and ignore any embedded ICC profile. Browsers colour-manage both
// `new Image()` and the default createImageBitmap path, which shifts colours on
// profiled PNGs (e.g. a cyan background decoding to a visibly different cyan).
async function decode(src: string): Promise<ImageBitmap> {
  const response = await fetch(src);
  const blob = await response.blob();
  return createImageBitmap(blob, { colorSpaceConversion: 'none' });
}

export function loadImageSource(imageCache: ImageCache, src: string): Promise<void> {
  if (imageCache.has(src) || failedSet(imageCache).has(src)) return Promise.resolve();
  const pending = pendingMap(imageCache);
  const existing = pending.get(src);
  // Share the in-flight promise so preload() only resolves once decodes finish.
  if (existing) return existing;
  const load = decode(src)
    .then((bitmap) => {
      imageCache.set(src, bitmap);
    })
    .catch(() => {
      // Remember the failure; the frame renders without the image rather than
      // throwing, and no per-frame refetch loop starts.
      failedSet(imageCache).add(src);
    })
    .finally(() => {
      pending.delete(src);
    });
  pending.set(src, load);
  return load;
}

export function getCachedImage(imageCache: ImageCache, src: string): ImageBitmap | undefined {
  const cached = imageCache.get(src);
  if (cached) return cached;
  // Kick off a load for a later frame (idempotent via the in-flight map and the
  // failed set) when a render reaches an image before preload finished.
  void loadImageSource(imageCache, src);
  return undefined;
}

export function drawImageSource(ctx: RenderingContext2D, imageCache: ImageCache, imageSource: ImageSource): void {
  const image = getCachedImage(imageCache, imageSource.src);
  if (image) {
    // dotLottie/ThorVG samples raster image layers on the vertical pixel
    // center. Matching that avoids a one-row blur on embedded image assets.
    ctx.save();
    ctx.rect(0, 0, imageSource.width, imageSource.height);
    ctx.clip();
    ctx.drawImage(image, 0, -0.5, imageSource.width, imageSource.height);
    ctx.restore();
  }
}
