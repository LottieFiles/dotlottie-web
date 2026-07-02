import type { Color, ColorStop, Layer, Shape } from '../model';
import type { RenderingContext2D } from './types';

export function layerCompositeAlpha(layer: Layer): number {
  // Precomp children already include the precomp opacity via groupOpacity.
  return layer.matteChildren ? 1 : layer.transform.opacity / 100;
}

export function compositeLayerBuffer(
  ctx: RenderingContext2D,
  layer: Layer,
  buffer: HTMLCanvasElement | OffscreenCanvas,
): void {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = layerCompositeAlpha(layer) * blendedLayerPaintAlpha(layer);
  ctx.globalCompositeOperation = (layer.blendMode ?? 'source-over') as GlobalCompositeOperation;
  ctx.drawImage(buffer as CanvasImageSource, 0, 0);
  ctx.restore();
}

export function blendedLayerPaintAlpha(layer: Layer): number {
  if (!layer.blendMode || layer.blendMode === 'source-over') return 1;
  // Canvas already preserves source alpha for screen compositing; applying the
  // paint alpha again makes semi-transparent blend layers too faint.
  if (layer.blendMode === 'screen') return 1;

  let peak = 0;
  let hasPaint = false;
  const visit = (shapes: Shape[]) => {
    for (const shape of shapes) {
      if (shape.type === 'group') {
        visit((shape as Shape & { children: Shape[] }).children);
      } else if (shape.type === 'merge') {
        visit((shape as Shape & { shapes: Shape[] }).shapes);
      }

      const fill = shape.fill;
      if (fill?.type === 'solid') {
        const color = fill.color as Color;
        if (isResolvedColor(color)) {
          hasPaint = true;
          peak = Math.max(peak, color.a);
        }
      } else if (fill?.type === 'gradient') {
        const stops = fill.colors as ColorStop[];
        if (Array.isArray(stops)) {
          for (const stop of stops) {
            hasPaint = true;
            peak = Math.max(peak, stop.color.a);
          }
        }
      }
    }
  };

  visit(layer.shapes);
  return hasPaint ? peak : 1;
}

function isResolvedColor(color: Color): color is Color {
  return (
    typeof color?.r === 'number' &&
    typeof color.g === 'number' &&
    typeof color.b === 'number' &&
    typeof color.a === 'number'
  );
}

export function applyLumaMatteAlpha(ctx: RenderingContext2D, width: number, height: number, isInverted: boolean): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const luminance = (0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!) / 255;
    const alpha = isInverted ? 1 - luminance : luminance;
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = Math.round(alpha * 255);
  }
  ctx.putImageData(imageData, 0, 0);
}
