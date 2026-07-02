import type { Animation, GroupShape, LayerDefinition, MergeShape, Shape } from '../model';
import type { RenderingContext2D } from './types';

export const SMALL_CANVAS_SUPERSAMPLE_MAX_SIZE = 160;
export const SMALL_CANVAS_SUPERSAMPLE_SCALE = 4;
export const FILL_ONLY_SMALL_CANVAS_SUPERSAMPLE_SCALE = 8;

export function shouldSupersampleSmallCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): boolean {
  const maxDimension = Math.max(canvas.width, canvas.height);
  if (maxDimension <= 64) return true;
  const minDimension = Math.min(canvas.width, canvas.height);
  const aspectRatio = maxDimension / minDimension;
  if (maxDimension <= SMALL_CANVAS_SUPERSAMPLE_MAX_SIZE && minDimension >= 100 && aspectRatio <= 1.5) {
    return true;
  }
  if (maxDimension <= SMALL_CANVAS_SUPERSAMPLE_MAX_SIZE && aspectRatio >= 1.5 && aspectRatio <= 2) {
    return true;
  }
  return canvas.width === canvas.height && maxDimension <= SMALL_CANVAS_SUPERSAMPLE_MAX_SIZE;
}

export function smallCanvasSupersampleScale(animation: Animation): number {
  return isSimpleFillOnlyVectorAnimation(animation)
    ? FILL_ONLY_SMALL_CANVAS_SUPERSAMPLE_SCALE
    : SMALL_CANVAS_SUPERSAMPLE_SCALE;
}

function isSimpleFillOnlyVectorAnimation(animation: Animation): boolean {
  let fillCount = 0;
  let hasStroke = false;
  let hasUnsupportedLayerContent = false;

  const visitShape = (shape: Shape) => {
    if (shape.fill) fillCount++;
    if (shape.stroke) hasStroke = true;
    if (shape.type === 'group') {
      for (const child of (shape as GroupShape).children) visitShape(child);
    } else if (shape.type === 'merge') {
      for (const child of (shape as MergeShape).shapes) visitShape(child);
    }
  };

  const visitLayer = (layer: LayerDefinition) => {
    if (
      layer.image ||
      layer.text ||
      layer.masks?.length ||
      layer.trackMatte ||
      layer.matteChildren?.length ||
      layer.effects?.length
    ) {
      hasUnsupportedLayerContent = true;
    }
    for (const shape of layer.shapes ?? []) visitShape(shape);
  };

  for (const layer of animation.layers) visitLayer(layer);
  return fillCount > 0 && !hasStroke && !hasUnsupportedLayerContent;
}

export function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas {
  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(width, height);
  }
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function createOffscreenContext(
  width: number,
  height: number,
): { canvas: HTMLCanvasElement | OffscreenCanvas; ctx: RenderingContext2D } {
  const canvas = createOffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d', { alpha: true }) as RenderingContext2D | null;
  if (!ctx) {
    throw new Error('Could not get 2D context from offscreen canvas');
  }
  return { canvas, ctx };
}
