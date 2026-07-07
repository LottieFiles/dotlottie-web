import { describe, expect, it } from 'vitest';
import type { Layer } from '../../src/lite/model';
import { blendedLayerPaintAlpha } from '../../src/lite/renderer/compositing';

function layerWithFill(blendMode: string | undefined, alpha: number): Layer {
  return {
    id: 'layer',
    name: 'Layer',
    type: 'shape',
    index: 0,
    inPoint: 0,
    outPoint: 60,
    transform: {
      position: { x: 0, y: 0 },
      anchor: { x: 0, y: 0 },
      scale: { x: 100, y: 100 },
      rotation: 0,
      opacity: 100,
    },
    shapes: [
      {
        id: 'shape',
        type: 'ellipse',
        fill: {
          type: 'solid',
          color: { r: 0, g: 255, b: 0, a: alpha },
        },
      },
    ],
    ...(blendMode === undefined ? {} : { blendMode }),
    visible: true,
  };
}

describe('blendedLayerPaintAlpha', () => {
  it('does not adjust source-over layers', () => {
    expect(blendedLayerPaintAlpha(layerWithFill('source-over', 0.8))).toBe(1);
  });

  it('does not adjust opaque blend layers', () => {
    expect(blendedLayerPaintAlpha(layerWithFill('screen', 1))).toBe(1);
  });

  it('does not double-apply paint alpha for screen layers', () => {
    expect(blendedLayerPaintAlpha(layerWithFill('screen', 0.8))).toBe(1);
  });

  it('uses resolved paint alpha for other non-default blend layers', () => {
    expect(blendedLayerPaintAlpha(layerWithFill('overlay', 0.8))).toBeCloseTo(0.8);
  });
});
