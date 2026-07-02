import { describe, expect, it } from 'vitest';
import {
  FILL_ONLY_SMALL_CANVAS_SUPERSAMPLE_SCALE,
  SMALL_CANVAS_SUPERSAMPLE_SCALE,
  smallCanvasSupersampleScale,
} from '../../src/lite/renderer/canvas';
import { applyFill, applyStroke, dropShadowBlur, dropShadowOffset } from '../../src/lite/renderer/paint';
import { buildPathFromPathData, isFullTrimPath } from '../../src/lite/renderer/paths';
import { Canvas2DRenderer } from '../../src/lite/renderer/renderer';

describe('Canvas2DRenderer', () => {
  it('can be instantiated', () => {
    const renderer = new Canvas2DRenderer();
    expect(renderer).toBeDefined();
  });

  it('clears renderer-owned caches on dispose', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      animationDashPatternCache: WeakMap<object, boolean>;
      dispose: () => void;
      imageCache: Map<string, object>;
      offscreenPool: Map<string, object[]>;
      pathDataCache: WeakMap<object, object>;
      scaledImageCache: Map<string, { canvas: object; pixels: number }>;
      scaledImageCachePixels: number;
      shapePathCache: WeakMap<object, object>;
    };
    const pathKey = {};
    const shapeKey = {};
    const animationKey = {};
    const oldPathCache = renderer.pathDataCache;
    const oldShapeCache = renderer.shapePathCache;
    const oldAnimationCache = renderer.animationDashPatternCache;

    renderer.imageCache.set('asset.png', {});
    renderer.scaledImageCache.set('asset.png@2', { canvas: {}, pixels: 200 });
    renderer.scaledImageCachePixels = 200;
    renderer.offscreenPool.set('100x100', [{}]);
    renderer.pathDataCache.set(pathKey, {});
    renderer.shapePathCache.set(shapeKey, {});
    renderer.animationDashPatternCache.set(animationKey, true);

    renderer.dispose();

    expect(renderer.imageCache.size).toBe(0);
    expect(renderer.scaledImageCache.size).toBe(0);
    expect(renderer.scaledImageCachePixels).toBe(0);
    expect(renderer.offscreenPool.size).toBe(0);
    expect(renderer.pathDataCache).not.toBe(oldPathCache);
    expect(renderer.shapePathCache).not.toBe(oldShapeCache);
    expect(renderer.animationDashPatternCache).not.toBe(oldAnimationCache);
  });

  it('draws image layers with the ThorVG vertical sampling offset', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      imageCache: Map<string, { complete: boolean; naturalWidth: number }>;
      drawImage: (
        ctx: {
          clip: () => void;
          drawImage: (...args: unknown[]) => void;
          rect: (...args: unknown[]) => void;
          restore: () => void;
          save: () => void;
        },
        image: { src: string; width: number; height: number },
      ) => void;
    };
    const image = { complete: true, naturalWidth: 10 };
    const calls: Array<[string, ...unknown[]]> = [];

    // The source repo ran this test in Node, where scaledImageFor() bails out early because
    // OffscreenCanvas and document are undefined, so drawImage() always took the direct-draw
    // path. In browser mode OffscreenCanvas is real and would reject the mock image, so we use
    // dimensions above MAX_SCALED_IMAGE_CACHE_PIXELS (4M) to reach the same direct-draw path
    // that applies the ThorVG vertical sampling offset.
    renderer.imageCache.set('asset.png', image);
    renderer.drawImage(
      {
        clip: () => calls.push(['clip']),
        drawImage: (...args: unknown[]) => calls.push(['drawImage', ...args]),
        rect: (...args: unknown[]) => calls.push(['rect', ...args]),
        restore: () => calls.push(['restore']),
        save: () => calls.push(['save']),
      },
      { src: 'asset.png', width: 4000, height: 2000 },
    );

    expect(calls).toEqual([
      ['save'],
      ['rect', 0, 0, 4000, 2000],
      ['clip'],
      ['drawImage', image, 0, -0.5, 4000, 2000],
      ['restore'],
    ]);
  });

  it('supersamples small vector canvases only', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      shouldSupersampleSmallCanvas: (canvas: { width: number; height: number }) => boolean;
    };

    expect(SMALL_CANVAS_SUPERSAMPLE_SCALE).toBe(4);
    expect(renderer.shouldSupersampleSmallCanvas({ width: 46, height: 46 })).toBe(true);
    expect(renderer.shouldSupersampleSmallCanvas({ width: 64, height: 52 })).toBe(true);
    expect(renderer.shouldSupersampleSmallCanvas({ width: 135, height: 135 })).toBe(true);
    expect(renderer.shouldSupersampleSmallCanvas({ width: 150, height: 120 })).toBe(true);
    expect(renderer.shouldSupersampleSmallCanvas({ width: 133, height: 73 })).toBe(true);
    expect(renderer.shouldSupersampleSmallCanvas({ width: 94, height: 73 })).toBe(false);
    expect(renderer.shouldSupersampleSmallCanvas({ width: 112, height: 84 })).toBe(false);
    expect(renderer.shouldSupersampleSmallCanvas({ width: 100, height: 35 })).toBe(false);
    expect(renderer.shouldSupersampleSmallCanvas({ width: 161, height: 52 })).toBe(false);
    expect(renderer.shouldSupersampleSmallCanvas({ width: 1080, height: 1080 })).toBe(false);
  });

  it('supersamples medium vector-only canvases but excludes raster content', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      shouldSupersampleVectorCanvas: (animation: unknown, canvas: { width: number; height: number }) => boolean;
    };

    expect(
      renderer.shouldSupersampleVectorCanvas(
        {
          layers: [
            {
              shapes: [{ id: 'shape', type: 'rect' }],
            },
          ],
        },
        { width: 400, height: 400 },
      ),
    ).toBe(true);
    expect(
      renderer.shouldSupersampleVectorCanvas(
        {
          layers: [
            {
              text: {
                text: 'Hello',
                fontFamily: 'AvertaStd-Black',
                size: 24,
                color: { r: 255, g: 255, b: 255, a: 1 },
              },
            },
          ],
        },
        { width: 512, height: 512 },
      ),
    ).toBe(true);
    expect(
      renderer.shouldSupersampleVectorCanvas(
        {
          layers: [
            {
              matteChildren: [
                {
                  image: { src: 'image.png', width: 100, height: 100 },
                },
              ],
            },
          ],
        },
        { width: 112, height: 84 },
      ),
    ).toBe(false);
    expect(
      renderer.shouldSupersampleVectorCanvas(
        {
          layers: [
            {
              shapes: [{ id: 'shape', type: 'rect' }],
            },
          ],
        },
        { width: 513, height: 512 },
      ),
    ).toBe(false);
  });

  it('uses 4x vector supersampling for text and complex vector animations', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      vectorCanvasSupersampleScale: (animation: unknown) => number;
    };

    expect(
      renderer.vectorCanvasSupersampleScale({
        layers: [
          {
            blendMode: 'source-over',
            shapes: [{ id: 'shape', type: 'rect' }],
          },
        ],
      }),
    ).toBe(2);
    expect(
      renderer.vectorCanvasSupersampleScale({
        layers: [
          {
            shapes: [
              {
                id: 'shape',
                type: 'rect',
                fill: {
                  type: 'gradient',
                  gradientType: 'linear',
                  start: { x: 0, y: 0 },
                  end: { x: 10, y: 10 },
                  colors: [],
                },
              },
            ],
          },
        ],
      }),
    ).toBe(4);
    expect(
      renderer.vectorCanvasSupersampleScale({
        layers: [
          {
            blendMode: 'screen',
            shapes: [{ id: 'shape', type: 'ellipse' }],
          },
        ],
      }),
    ).toBe(4);
    expect(
      renderer.vectorCanvasSupersampleScale({
        layers: [
          {
            text: {
              text: 'Hello',
              fontFamily: 'AvertaStd-Black',
              size: 24,
              color: { r: 255, g: 255, b: 255, a: 1 },
            },
            shapes: [
              {
                id: 'shape',
                type: 'path',
                offset: 4,
              },
            ],
          },
        ],
      }),
    ).toBe(4);
  });

  it('uses a higher supersample scale for simple fill-only vector animations', () => {
    const fillOnlyAnimation = {
      layers: [
        {
          shapes: [
            {
              id: 'shape',
              type: 'path',
              fill: { type: 'solid', color: { r: 255, g: 255, b: 255, a: 1 } },
            },
          ],
        },
      ],
    };
    const strokedAnimation = {
      layers: [
        {
          shapes: [
            {
              id: 'shape',
              type: 'path',
              fill: { type: 'solid', color: { r: 255, g: 255, b: 255, a: 1 } },
              stroke: {
                type: 'solid',
                color: { r: 255, g: 255, b: 255, a: 1 },
                width: 1,
                opacity: 100,
              },
            },
          ],
        },
      ],
    };
    const maskedAnimation = {
      layers: [
        {
          masks: [{}],
          shapes: [
            {
              id: 'shape',
              type: 'path',
              fill: { type: 'solid', color: { r: 255, g: 255, b: 255, a: 1 } },
            },
          ],
        },
      ],
    };

    expect(smallCanvasSupersampleScale(fillOnlyAnimation as never)).toBe(FILL_ONLY_SMALL_CANVAS_SUPERSAMPLE_SCALE);
    expect(smallCanvasSupersampleScale(strokedAnimation as never)).toBe(SMALL_CANVAS_SUPERSAMPLE_SCALE);
    expect(smallCanvasSupersampleScale(maskedAnimation as never)).toBe(SMALL_CANVAS_SUPERSAMPLE_SCALE);
  });

  it('maps Lottie drop shadow direction and softness to ThorVG-compatible canvas values', () => {
    const effect = {
      type: 'drop-shadow',
      color: { r: 0, g: 0, b: 0, a: 0.75 },
      opacity: 0.75,
      angle: 135,
      distance: 10,
      softness: 20,
    } as const;

    const offset = dropShadowOffset(effect);

    expect(offset.x).toBeCloseTo(7.071, 3);
    expect(offset.y).toBeCloseTo(7.071, 3);
    expect(dropShadowBlur(effect)).toBe(4.25);
  });

  it('uses the final stop for degenerate linear gradients', () => {
    const fillCtx = {
      fillStyle: '',
      createLinearGradient: () => {
        throw new Error('degenerate fill gradient should not create a CanvasGradient');
      },
    };

    applyFill(fillCtx as never, {
      type: 'gradient',
      gradientType: 'linear',
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      colors: [
        { offset: 0, color: { r: 255, g: 0, b: 0, a: 1 } },
        { offset: 1, color: { r: 0, g: 0, b: 255, a: 1 } },
      ],
    });

    expect(fillCtx.fillStyle).toBe('rgba(0, 0, 255, 1)');

    const strokeCtx = {
      strokeStyle: '',
      lineWidth: 0,
      lineCap: '',
      lineJoin: '',
      miterLimit: 0,
      lineDashOffset: 0,
      dash: [] as number[],
      setLineDash(values: number[]) {
        this.dash = values;
      },
      createLinearGradient: () => {
        throw new Error('degenerate stroke gradient should not create a CanvasGradient');
      },
    };

    applyStroke(strokeCtx as never, {
      type: 'gradient',
      gradientType: 'linear',
      start: { x: 2, y: 2 },
      end: { x: 2, y: 2 },
      colors: [
        { offset: 0, color: { r: 255, g: 0, b: 0, a: 1 } },
        { offset: 1, color: { r: 0, g: 255, b: 0, a: 0.5 } },
      ],
      width: 4,
      opacity: 50,
      lineCap: 'round',
      lineJoin: 'round',
      miterLimit: 4,
      dash: [10, 5],
      dashOffset: 12,
    });

    expect(strokeCtx.strokeStyle).toBe('rgba(0, 255, 0, 0.25)');
    expect(strokeCtx.dash).toEqual([10, 5]);
    expect(strokeCtx.lineDashOffset).toBe(12);
  });

  it('uses square caps for dashed butt-cap strokes to match ThorVG stroke coverage', () => {
    const strokeCtx = {
      strokeStyle: '',
      lineWidth: 0,
      lineCap: '',
      lineJoin: '',
      miterLimit: 0,
      lineDashOffset: 0,
      dash: [] as number[],
      setLineDash(values: number[]) {
        this.dash = values;
      },
    };

    applyStroke(strokeCtx as never, {
      type: 'solid',
      color: { r: 0, g: 255, b: 0, a: 1 },
      width: 8,
      opacity: 100,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 4,
      dash: [10, 5],
      dashOffset: 12,
    });

    expect(strokeCtx.lineCap).toBe('square');

    applyStroke(strokeCtx as never, {
      type: 'solid',
      color: { r: 0, g: 255, b: 0, a: 1 },
      width: 8,
      opacity: 100,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 4,
    });

    expect(strokeCtx.lineCap).toBe('butt');
  });

  it('uses light italic font fallback metrics without the heavy text fallback', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      renderText: (ctx: Record<string, unknown>, text: unknown) => void;
    };
    const calls: Array<[string, ...unknown[]]> = [];
    const ctx = {
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      fillText: (...args: unknown[]) => calls.push(['fillText', ...args]),
      measureText: (text: string) => ({ width: text.length * 40 }),
      restore: () => calls.push(['restore']),
      save: () => calls.push(['save']),
      scale: (...args: unknown[]) => calls.push(['scale', ...args]),
      translate: (...args: unknown[]) => calls.push(['translate', ...args]),
    };

    renderer.renderText(ctx, {
      text: 'Hello',
      fontFamily: 'Ubuntu Light Italic',
      size: 100,
      color: { r: 0, g: 0, b: 0, a: 1 },
      justification: 'left',
    });

    expect(ctx.font).toBe('italic 300 100px "Ubuntu", sans-serif');
    expect(calls).toContainEqual(['scale', 0.95, 1]);
    const translate = calls.find((call) => call[0] === 'translate');
    expect(translate?.[1]).toBeCloseTo(29.474, 3);
    expect(translate?.[2]).toBe(0);
    expect(calls).toContainEqual(['fillText', 'Hello', 0, -20]);
  });

  it('renders triangle range selectors per character at the selection endpoint', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      renderText: (ctx: Record<string, unknown>, text: unknown) => void;
    };
    const calls: Array<[string, ...unknown[]]> = [];
    const ctx = {
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      fillText: (...args: unknown[]) => calls.push(['fillText', ...args]),
      measureText: (text: string) => ({ width: text.length * 10 }),
      restore: () => calls.push(['restore']),
      save: () => calls.push(['save']),
      scale: (...args: unknown[]) => calls.push(['scale', ...args]),
      translate: (...args: unknown[]) => calls.push(['translate', ...args]),
    };

    renderer.renderText(ctx, {
      text: 'AB',
      fontFamily: 'AvertaStd-Black',
      size: 20,
      color: { r: 0, g: 0, b: 0, a: 1 },
      justification: 'center',
      rangeSelectorEnd: 0,
      rangeSelectorScale: { x: 40, y: 40 },
      rangeSelectorShape: 4,
    });

    expect(calls).not.toContainEqual(['fillText', 'AB', 0, 0]);
    expect(calls).toContainEqual(['fillText', 'A', -5, -5.8]);
    expect(calls).toContainEqual(['fillText', 'B', 5, -5.8]);
  });

  it('counts line breaks as triangle range-selector positions', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      renderText: (ctx: Record<string, unknown>, text: unknown) => void;
    };
    const calls: Array<[string, ...unknown[]]> = [];
    let currentFont = '';
    const ctx = {
      fillStyle: '',
      get font() {
        return currentFont;
      },
      set font(value: string) {
        currentFont = value;
      },
      textAlign: '',
      textBaseline: '',
      fillText: (...args: unknown[]) => calls.push(['fillText', currentFont, ...args]),
      measureText: (text: string) => ({ width: text.length * 10 }),
      restore: () => calls.push(['restore']),
      save: () => calls.push(['save']),
      scale: (...args: unknown[]) => calls.push(['scale', ...args]),
      translate: (...args: unknown[]) => calls.push(['translate', ...args]),
    };

    renderer.renderText(ctx, {
      text: 'A\nB',
      fontFamily: 'AvertaStd-Black',
      size: 20,
      color: { r: 0, g: 0, b: 0, a: 1 },
      justification: 'left',
      lineHeight: 20,
      rangeSelectorEnd: 100,
      rangeSelectorScale: { x: 40, y: 40 },
      rangeSelectorShape: 4,
    });

    const bCall = calls.find((call) => call[0] === 'fillText' && call[2] === 'B');
    const fontSize = Number(String(bCall?.[1]).match(/ ([0-9.]+)px /)?.[1]);
    expect(fontSize).toBeCloseTo(9.554, 3);
  });

  it('renders triangle range selectors with embedded glyph paths when available', () => {
    const previousPath2D = globalThis.Path2D;
    const pathCalls: Array<[string, ...number[]]> = [];
    class MockPath2D {
      moveTo(...args: number[]) {
        pathCalls.push(['moveTo', ...args]);
      }

      lineTo(...args: number[]) {
        pathCalls.push(['lineTo', ...args]);
      }

      bezierCurveTo(...args: number[]) {
        pathCalls.push(['bezierCurveTo', ...args]);
      }

      closePath() {
        pathCalls.push(['closePath']);
      }
    }

    const renderer = new Canvas2DRenderer() as unknown as {
      renderText: (ctx: Record<string, unknown>, text: unknown) => void;
    };
    const calls: Array<[string, ...unknown[]]> = [];
    const ctx = {
      fillStyle: '',
      textAlign: '',
      textBaseline: '',
      fillText: (...args: unknown[]) => calls.push(['fillText', ...args]),
      fill: (...args: unknown[]) => calls.push(['fill', ...args]),
      restore: () => calls.push(['restore']),
      save: () => calls.push(['save']),
      scale: (...args: unknown[]) => calls.push(['scale', ...args]),
      translate: (...args: unknown[]) => calls.push(['translate', ...args]),
    };

    globalThis.Path2D = MockPath2D as unknown as typeof Path2D;
    try {
      const glyph = {
        width: 50,
        size: 20,
        paths: [
          {
            vertices: [
              { x: 0, y: 0 },
              { x: 10, y: 0 },
              { x: 5, y: -10 },
            ],
            inTangents: [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ],
            outTangents: [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 0 },
            ],
            closed: true,
          },
        ],
      };

      renderer.renderText(ctx, {
        text: 'ABC',
        fontFamily: 'AvertaStd-Black',
        size: 20,
        color: { r: 0, g: 0, b: 0, a: 1 },
        justification: 'center',
        rangeSelectorEnd: 100,
        rangeSelectorScale: { x: 40, y: 40 },
        rangeSelectorShape: 4,
        glyphs: {
          A: glyph,
          B: glyph,
          C: glyph,
        },
      });
    } finally {
      globalThis.Path2D = previousPath2D;
    }

    expect(calls.some((call) => call[0] === 'fillText')).toBe(false);
    expect(calls.some((call) => call[0] === 'fill')).toBe(true);
    const glyphScales = calls.filter((call) => call[0] === 'scale');
    expect(glyphScales[1]![1]).toBeCloseTo(0.091, 3);
    expect(pathCalls).toContainEqual(['moveTo', 0, 0]);
    expect(pathCalls).toContainEqual(['lineTo', 10, 0]);
  });

  it('draws text-path glyphs along the sampled path with ThorVG baseline offset', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      renderText: (ctx: Record<string, unknown>, text: unknown) => void;
    };
    const calls: Array<[string, ...unknown[]]> = [];
    const ctx = {
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      fillText: (...args: unknown[]) => calls.push(['fillText', ...args]),
      measureText: () => ({ width: 20 }),
      restore: () => calls.push(['restore']),
      rotate: (...args: unknown[]) => calls.push(['rotate', ...args]),
      save: () => calls.push(['save']),
      scale: (...args: unknown[]) => calls.push(['scale', ...args]),
      translate: (...args: unknown[]) => calls.push(['translate', ...args]),
    };

    renderer.renderText(ctx, {
      text: 'A',
      fontFamily: 'Helvetica',
      size: 200,
      color: { r: 0, g: 0, b: 0, a: 1 },
      textPath: {
        firstMargin: 40,
        path: {
          vertices: [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
          ],
          inTangents: [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ],
          outTangents: [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
          ],
          closed: false,
        },
      },
    });

    expect(calls).toContainEqual(['translate', 50, -64]);
    expect(calls).toContainEqual(['rotate', 0]);
    expect(calls).toContainEqual(['fillText', 'A', 0, 0]);
  });

  it('preserves evaluated child visibility while suppressing duplicated matte children', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      renderLayerContent: (ctx: { canvas: { width: number; height: number } }, layer: unknown) => void;
      renderLayerList: (
        ctx: { canvas: { width: number; height: number } },
        layers: Array<{ visible: boolean; hiddenByPrecompComposite?: boolean }>,
        width: number,
        height: number,
      ) => void;
    };
    let captured: Array<{ visible: boolean; hiddenByPrecompComposite?: boolean }> = [];
    renderer.renderLayerList = (_ctx, layers) => {
      captured = layers;
    };

    renderer.renderLayerContent(
      { canvas: { width: 100, height: 100 } },
      {
        effects: [],
        matteChildren: [
          { visible: true, hiddenByPrecompComposite: true },
          { visible: true, hiddenByPrecompComposite: false },
          { visible: false, hiddenByPrecompComposite: false },
        ],
      },
    );

    expect(captured.map((layer) => layer.visible)).toEqual([false, true, false]);
  });

  it('treats inactive alpha mattes as empty masks', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      renderLayerList: (
        ctx: { canvas: { width: number; height: number } },
        layers: Array<{
          visible: boolean;
          inPoint: number;
          outPoint: number;
          isMatte?: boolean;
          trackMatte?: 'alpha';
        }>,
        width: number,
        height: number,
      ) => void;
      renderTrackMattePair: () => void;
      renderBufferedLayer: () => void;
    };
    let mattePairs = 0;
    let bufferedLayers = 0;
    renderer.renderTrackMattePair = () => {
      mattePairs++;
    };
    renderer.renderBufferedLayer = () => {
      bufferedLayers++;
    };

    renderer.renderLayerList(
      { canvas: { width: 100, height: 100 } },
      [
        { visible: false, inPoint: 0, outPoint: 60, isMatte: true },
        { visible: true, inPoint: 0, outPoint: 60, trackMatte: 'alpha' },
      ],
      100,
      100,
    );

    expect(mattePairs).toBe(0);
    expect(bufferedLayers).toBe(0);
  });

  it('renders inverted-matte content when the matte is inactive', () => {
    const renderer = new Canvas2DRenderer() as unknown as {
      renderLayerList: (
        ctx: { canvas: { width: number; height: number } },
        layers: Array<{
          visible: boolean;
          inPoint: number;
          outPoint: number;
          isMatte?: boolean;
          trackMatte?: 'alpha-inverted';
        }>,
        width: number,
        height: number,
      ) => void;
      renderTrackMattePair: () => void;
      renderBufferedLayer: () => void;
    };
    let mattePairs = 0;
    let bufferedLayers = 0;
    renderer.renderTrackMattePair = () => {
      mattePairs++;
    };
    renderer.renderBufferedLayer = () => {
      bufferedLayers++;
    };

    renderer.renderLayerList(
      { canvas: { width: 100, height: 100 } },
      [
        { visible: false, inPoint: 0, outPoint: 60, isMatte: true },
        { visible: true, inPoint: 0, outPoint: 60, trackMatte: 'alpha-inverted' },
      ],
      100,
      100,
    );

    expect(mattePairs).toBe(0);
    expect(bufferedLayers).toBe(1);
  });

  it('recognizes evaluated full trim paths', () => {
    expect(isFullTrimPath({ start: 0, end: 100, offset: 0, mode: 'simultaneous' })).toBe(true);
    expect(isFullTrimPath({ start: 10, end: 110, offset: 45, mode: 'individual' })).toBe(true);
    expect(isFullTrimPath({ start: 0, end: 99.9, offset: 0, mode: 'simultaneous' })).toBe(false);
  });

  it('emits line commands for zero-tangent path segments', () => {
    const previousPath2D = globalThis.Path2D;
    const calls: Array<[string, ...number[]]> = [];

    class MockPath2D {
      moveTo(...args: number[]) {
        calls.push(['moveTo', ...args]);
      }

      lineTo(...args: number[]) {
        calls.push(['lineTo', ...args]);
      }

      bezierCurveTo(...args: number[]) {
        calls.push(['bezierCurveTo', ...args]);
      }

      closePath() {
        calls.push(['closePath']);
      }
    }

    globalThis.Path2D = MockPath2D as unknown as typeof Path2D;
    try {
      buildPathFromPathData({
        vertices: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: 10 },
        ],
        inTangents: [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ],
        outTangents: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: 0 },
        ],
        closed: true,
      });
    } finally {
      globalThis.Path2D = previousPath2D;
    }

    expect(calls).toEqual([
      ['moveTo', 0, 0],
      ['lineTo', 10, 0],
      ['bezierCurveTo', 11, 0, 10, 10, 10, 10],
      ['lineTo', 0, 0],
      ['closePath'],
    ]);
  });
});
