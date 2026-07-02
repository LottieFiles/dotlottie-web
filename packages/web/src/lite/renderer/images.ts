import type { ImageSource } from '../model';
import type { RenderingContext2D } from './types';

export type ImageCache = Map<string, HTMLImageElement>;

export function loadImageSource(imageCache: ImageCache, src: string): Promise<void> {
  const cached = imageCache.get(src);
  if (cached?.complete && cached.naturalWidth > 0) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const image = new Image();
    imageCache.set(src, image);
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export function getCachedImage(imageCache: ImageCache, src: string): HTMLImageElement | undefined {
  const cached = imageCache.get(src);
  if (cached) {
    return cached.complete && cached.naturalWidth > 0 ? cached : undefined;
  }

  const image = new Image();
  imageCache.set(src, image);
  image.src = src;
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
