import type {
  AffineMatrix,
  Animation,
  Color,
  ColorStop,
  EllipseShape,
  Fill,
  GroupShape,
  ImageSource,
  Layer,
  LayerDefinition,
  MergeShape,
  PathData,
  PathShape,
  Point,
  Renderer,
  ResolvedDropShadowEffect,
  Shape,
  Stroke,
  TextDocument,
  TextGlyph,
  Transform,
  TrimPath,
} from '../model';
import { buildScene, combineTransforms, multiplyMatrices, transformToMatrix } from '../model';
import { createOffscreenContext, shouldSupersampleSmallCanvas, smallCanvasSupersampleScale } from './canvas';
import { applyLumaMatteAlpha, compositeLayerBuffer, layerCompositeAlpha } from './compositing';
import { getCachedImage, loadImageSource } from './images';
import { applyMasks } from './masks';
import { applyFill, applyStrokes, buildEffectFilter, colorToCss, dropShadowBlur, dropShadowOffset } from './paint';
import {
  appendPath,
  appendTrimmedSegment,
  buildPathFromPathData,
  distance,
  effectiveTrimPath,
  getTrimmedPath,
  getTrimVisibleRanges,
  isFullTrimPath,
  shapeToPath,
  shapeToPoints,
  transformPath,
  trimmedEllipsePath,
} from './paths';
import { applyTransform, strokeScale } from './transforms';
import type { RenderingContext2D } from './types';

interface OffscreenBuffer {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  ctx: RenderingContext2D;
}

interface ScaledImageCacheEntry {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  pixels: number;
}

export interface Canvas2DRendererOptions {
  contextAttributes?: CanvasRenderingContext2DSettings;
}

const MAX_SCALED_IMAGE_CACHE_PIXELS = 4_000_000;

/**
 * Canvas2D rendering backend for dotLottieLitePlayer.
 */
export class Canvas2DRenderer implements Renderer {
  private imageCache = new Map<string, HTMLImageElement>();
  private scaledImageCache = new Map<string, ScaledImageCacheEntry>();
  private scaledImageCachePixels = 0;
  private offscreenPool = new Map<string, OffscreenBuffer[]>();
  private pathDataCache = new WeakMap<PathData, Path2D>();
  private shapePathCache = new WeakMap<Shape, Path2D>();
  private animationDashPatternCache = new WeakMap<Animation, boolean>();
  private compFrame = 0;
  private renderScaleX = 1;
  private renderScaleY = 1;
  private renderHasDashPatterns = false;

  constructor(private readonly options: Canvas2DRendererOptions = {}) {}

  dispose(): void {
    this.imageCache.clear();
    this.scaledImageCache.clear();
    this.scaledImageCachePixels = 0;
    this.offscreenPool.clear();
    this.pathDataCache = new WeakMap<PathData, Path2D>();
    this.shapePathCache = new WeakMap<Shape, Path2D>();
    this.animationDashPatternCache = new WeakMap<Animation, boolean>();
  }

  render(animation: Animation, frame: number, canvas: HTMLCanvasElement | OffscreenCanvas): void {
    const ctx = canvas.getContext('2d', this.options.contextAttributes) as RenderingContext2D | null;
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }

    if (canvas.width <= 0 || canvas.height <= 0) {
      canvas.width = animation.width;
      canvas.height = animation.height;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.filter = 'none';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.renderHasDashPatterns = this.animationHasDashPatterns(animation);

    if (this.shouldSupersampleSmallCanvas(canvas)) {
      const supersampleScale = smallCanvasSupersampleScale(animation);
      this.withOffscreenContext(
        canvas.width * supersampleScale,
        canvas.height * supersampleScale,
        ({ canvas: buffer, ctx: bufferCtx }) => {
          this.renderFrameToContext(animation, frame, bufferCtx, buffer.width, buffer.height);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(buffer as CanvasImageSource, 0, 0, canvas.width, canvas.height);
        },
      );
      return;
    }

    if (this.shouldSupersampleVectorCanvas(animation, canvas)) {
      const supersampleScale = this.vectorCanvasSupersampleScale(animation);
      this.withOffscreenContext(
        canvas.width * supersampleScale,
        canvas.height * supersampleScale,
        ({ canvas: buffer, ctx: bufferCtx }) => {
          this.renderFrameToContext(animation, frame, bufferCtx, buffer.width, buffer.height);
          if (animation.layers.some((layer) => this.layerHasTextContent(layer))) {
            this.downsampleTextSupersample(ctx, bufferCtx, canvas.width, canvas.height, supersampleScale);
          } else {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(buffer as CanvasImageSource, 0, 0, canvas.width, canvas.height);
          }
        },
      );
      return;
    }

    this.renderFrameToContext(animation, frame, ctx, canvas.width, canvas.height);
  }

  private shouldSupersampleSmallCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): boolean {
    return shouldSupersampleSmallCanvas(canvas);
  }

  private withOffscreenContext<T>(width: number, height: number, callback: (buffer: OffscreenBuffer) => T): T {
    const buffer = this.acquireOffscreenContext(width, height);
    try {
      return callback(buffer);
    } finally {
      this.releaseOffscreenContext(buffer);
    }
  }

  private acquireOffscreenContext(width: number, height: number): OffscreenBuffer {
    const key = `${width}x${height}`;
    const buffer = this.offscreenPool.get(key)?.pop();
    if (!buffer) return createOffscreenContext(width, height);

    this.resetOffscreenContext(buffer);
    return buffer;
  }

  private releaseOffscreenContext(buffer: OffscreenBuffer): void {
    const key = `${buffer.canvas.width}x${buffer.canvas.height}`;
    const buffers = this.offscreenPool.get(key) ?? [];
    if (buffers.length >= 8) return;

    buffers.push(buffer);
    this.offscreenPool.set(key, buffers);
  }

  private resetOffscreenContext(buffer: OffscreenBuffer): void {
    const resettable = buffer.ctx as RenderingContext2D & { reset?: () => void };
    if (typeof resettable.reset === 'function') {
      resettable.reset();
      return;
    }

    const { width, height } = buffer.canvas;
    buffer.canvas.width = width;
    buffer.canvas.height = height;
  }

  private shouldSupersampleVectorCanvas(animation: Animation, canvas: HTMLCanvasElement | OffscreenCanvas): boolean {
    if (canvas.width > 512 || canvas.height > 512) return false;
    if (animation.layers.some((layer) => this.layerHasRasterContent(layer))) return false;
    return animation.layers.some((layer) => this.layerHasHighQualityVectorContent(layer));
  }

  private vectorCanvasSupersampleScale(animation: Animation): number {
    if (animation.layers.some((layer) => this.layerHasTextContent(layer))) return 4;
    if (animation.layers.length >= 120) return 2;
    return animation.layers.some((layer) => this.layerHasComplexVectorContent(layer)) ? 4 : 2;
  }

  private layerHasRasterContent(layer: LayerDefinition): boolean {
    if (layer.image || layer.audio) return true;
    return (layer.matteChildren ?? []).some((child) => this.layerHasRasterContent(child));
  }

  private layerHasTextContent(layer: LayerDefinition): boolean {
    if (layer.text) return true;
    return (layer.matteChildren ?? []).some((child) => this.layerHasTextContent(child));
  }

  private layerHasHighQualityVectorContent(layer: LayerDefinition): boolean {
    if (layer.text || layer.effects?.length || layer.blendMode) return true;
    if ((layer.shapes?.length ?? 0) > 0) return true;
    return (layer.matteChildren ?? []).some((child) => this.layerHasHighQualityVectorContent(child));
  }

  private layerHasComplexVectorContent(layer: LayerDefinition): boolean {
    if (
      layer.effects?.length ||
      this.layerHasNonDefaultBlendMode(layer) ||
      layer.masks?.length ||
      layer.trackMatte ||
      layer.matteChildren?.length
    ) {
      return true;
    }
    if ((layer.shapes ?? []).some((shape) => this.shapeHasComplexVectorContent(shape))) return true;
    return (layer.matteChildren ?? []).some((child) => this.layerHasComplexVectorContent(child));
  }

  private layerHasNonDefaultBlendMode(layer: LayerDefinition): boolean {
    return !!layer.blendMode && layer.blendMode !== 'source-over';
  }

  private shapeHasComplexVectorContent(shape: Shape): boolean {
    if (shape.trim || shape.trims?.length || shape.offset !== undefined) return true;
    if (shape.fill?.type === 'gradient') return true;
    const strokes = Array.isArray(shape.stroke) ? shape.stroke : shape.stroke ? [shape.stroke] : [];
    if (strokes.some((stroke) => stroke.type === 'gradient')) return true;
    if (shape.type === 'group') {
      return (shape as GroupShape).children.some((child) => this.shapeHasComplexVectorContent(child));
    }
    if (shape.type === 'merge') {
      return (shape as MergeShape).shapes.some((child) => this.shapeHasComplexVectorContent(child));
    }
    return false;
  }

  private downsampleTextSupersample(
    ctx: RenderingContext2D,
    sourceCtx: RenderingContext2D,
    width: number,
    height: number,
    scale: number,
  ): void {
    const source = sourceCtx.getImageData(0, 0, width * scale, height * scale);
    const output = ctx.createImageData(width, height);
    const samples = scale * scale;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let alphaSum = 0;
        let maxAlpha = -1;
        let red = 0;
        let green = 0;
        let blue = 0;
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            const sourceIndex = ((y * scale + sy) * source.width + x * scale + sx) * 4;
            const alpha = source.data[sourceIndex + 3]!;
            alphaSum += alpha;
            if (alpha > maxAlpha) {
              maxAlpha = alpha;
              red = source.data[sourceIndex]!;
              green = source.data[sourceIndex + 1]!;
              blue = source.data[sourceIndex + 2]!;
            }
          }
        }
        const outputIndex = (y * width + x) * 4;
        output.data[outputIndex] = red;
        output.data[outputIndex + 1] = green;
        output.data[outputIndex + 2] = blue;
        output.data[outputIndex + 3] = Math.round(alphaSum / samples);
      }
    }

    ctx.putImageData(output, 0, 0);
  }

  private renderFrameToContext(
    animation: Animation,
    frame: number,
    ctx: RenderingContext2D,
    width: number,
    height: number,
  ): void {
    this.renderScaleX = width / animation.width;
    this.renderScaleY = height / animation.height;
    this.compFrame = frame + (animation.inPoint ?? 0);
    if (!this.renderHasDashPatterns && typeof ctx.setLineDash === 'function') {
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
    }
    const layers = buildScene(animation, frame);

    this.renderLayerList(ctx, layers, width, height);
    this.renderScaleX = 1;
    this.renderScaleY = 1;
  }

  renderResolvedLayer(layer: Layer, canvas: HTMLCanvasElement | OffscreenCanvas, width: number, height: number): void {
    this.renderResolvedLayers([layer], canvas, width, height, layer.timelineFrame ?? layer.inPoint);
  }

  renderResolvedLayers(
    layers: Layer[],
    canvas: HTMLCanvasElement | OffscreenCanvas,
    width: number,
    height: number,
    compFrame = layers.find((layer) => layer.timelineFrame !== undefined)?.timelineFrame ?? layers[0]?.inPoint ?? 0,
  ): void {
    const ctx = canvas.getContext('2d', this.options.contextAttributes) as RenderingContext2D | null;
    if (!ctx) throw new Error('Could not create 2D rendering context');

    const previousScaleX = this.renderScaleX;
    const previousScaleY = this.renderScaleY;
    const previousCompFrame = this.compFrame;

    this.renderScaleX = canvas.width / width;
    this.renderScaleY = canvas.height / height;
    this.compFrame = compFrame;

    try {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.renderLayerList(ctx, layers, canvas.width, canvas.height);
    } finally {
      this.renderScaleX = previousScaleX;
      this.renderScaleY = previousScaleY;
      this.compFrame = previousCompFrame;
    }
  }

  /**
   * Render a list of layers from bottom to top, handling visibility, track
   * mattes, and layer masks. Used for the root layer stack and for the
   * children of a masked precomp.
   */
  private renderLayerList(ctx: RenderingContext2D, layers: Layer[], width: number, height: number): void {
    // Layers are stored top-to-bottom. Render from the bottom of the stack
    // upward so later draws cover earlier ones. A matte layer sits directly
    // above its masked layer, so when iterating backward we encounter the
    // masked layer first and the matte layer next.
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i]!;
      // Matte definition layers are never drawn directly; they are consumed by
      // the masked layer below them.
      if (layer.isMatte) {
        continue;
      }

      if (!this.isLayerRenderable(layer)) {
        continue;
      }
      if (layer.transform && layerCompositeAlpha(layer) <= 0) {
        continue;
      }
      if (layer.trackMatte) {
        let matteIndex = i - 1;
        while (matteIndex >= 0 && !layers[matteIndex]!.isMatte) {
          matteIndex--;
        }
        if (matteIndex >= 0) {
          const matteLayer = layers[matteIndex]!;
          if (this.isLayerRenderable(matteLayer)) {
            this.renderTrackMattePair(ctx, matteLayer, layer, width, height);
          } else if (this.isInvertedTrackMatte(layer)) {
            this.renderBufferedLayer(ctx, layer, width, height);
          }
          i = matteIndex;
          continue;
        }
      }

      if (layer.masks && layer.masks.length > 0) {
        this.renderMaskedLayer(ctx, layer, width, height);
      } else if (this.canRenderLayerDirectly(layer)) {
        this.renderLayerContent(ctx, layer);
      } else {
        this.renderBufferedLayer(ctx, layer, width, height);
      }
    }
  }

  private isLayerRenderable(layer: Layer): boolean {
    const layerFrame = layer.timelineFrame ?? this.compFrame;
    return layer.visible && layerFrame >= layer.inPoint && layerFrame < layer.outPoint;
  }

  private isInvertedTrackMatte(layer: Layer): boolean {
    return layer.trackMatte === 'alpha-inverted' || layer.trackMatte === 'luma-inverted';
  }

  private canRenderLayerDirectly(layer: Layer): boolean {
    if (layer.matteChildren) return false;
    if (layer.effects?.length) return false;
    if (layer.blendMode && layer.blendMode !== 'source-over') return false;
    return Math.abs(layer.transform.opacity - 100) < 0.001 || this.layerPaintOperationCount(layer) <= 1;
  }

  private renderBufferedLayer(ctx: RenderingContext2D, layer: Layer, width: number, height: number): void {
    this.withOffscreenContext(width, height, ({ canvas: buffer, ctx: bufferCtx }) => {
      this.renderLayerContent(bufferCtx, layer, { ignoreTransformOpacity: true });
      this.applyLayerDropShadows(bufferCtx, layer, width, height);
      this.applyMasksScaled(bufferCtx, layer);

      compositeLayerBuffer(ctx, layer, buffer);
    });
  }

  /**
   * Preload all image assets referenced by the animation so that subsequent
   * render() calls can draw them synchronously.
   */
  async preload(animation: Animation): Promise<void> {
    const srcs = new Set<string>();
    const collect = (layers: LayerDefinition[]) => {
      for (const layer of layers) {
        if (layer.image) srcs.add(layer.image.src);
        if (layer.matteChildren) collect(layer.matteChildren);
      }
    };
    collect(animation.layers);
    await Promise.all([...srcs].map((src) => this.loadImage(src)));
  }

  private loadImage(src: string): Promise<void> {
    return loadImageSource(this.imageCache, src);
  }

  private renderLayer(
    ctx: RenderingContext2D,
    layer: Layer,
    applyBlend = true,
    options: { ignoreTransformOpacity?: boolean } = {},
  ): void {
    ctx.save();
    const transform = options.ignoreTransformOpacity ? { ...layer.transform, opacity: 100 } : layer.transform;
    applyTransform(ctx, transform);

    if (applyBlend && layer.blendMode) {
      ctx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;
    }

    const filter = buildEffectFilter(layer.effects, this.effectFilterScale());
    if (filter) {
      ctx.filter = filter;
    }

    this.drawLayerShapes(ctx, layer.shapes);

    if (layer.image) {
      this.drawImage(ctx, layer.image);
    }

    if (layer.text) {
      this.renderText(ctx, layer.text);
    }

    for (const effect of layer.effects ?? []) {
      if (effect.type === 'fill') {
        this.applyColorOverlay(ctx, effect.color, 1);
      } else if (effect.type === 'tint') {
        this.applyTintMap(ctx, effect.color, effect.whiteColor, effect.amount);
      }
    }

    ctx.restore();
  }

  private drawLayerShapes(ctx: RenderingContext2D, shapes: Shape[]): void {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i]!;
      if (shape.trim?.mode === 'simultaneous' && shape.trim.groupId) {
        const group = [shape];
        let j = i - 1;
        while (j >= 0 && shapes[j]!.trim?.groupId === shape.trim.groupId) {
          group.push(shapes[j]!);
          j--;
        }
        if (group.length > 1) {
          this.drawTrimmedShapeGroup(ctx, group.reverse(), shape.trim as TrimPath);
          i = j;
          continue;
        }
      }
      this.drawShape(ctx, shape);
    }
  }

  private applyColorOverlay(ctx: RenderingContext2D, color: Color, amount: number): void {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha = Math.max(0, Math.min(1, amount));
    ctx.fillStyle = colorToCss(color);
    const size = 10000;
    ctx.fillRect(-size, -size, size * 2, size * 2);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  private applyTintMap(
    ctx: RenderingContext2D,
    blackColor: Color,
    whiteColor: Color | undefined,
    amount: number,
  ): void {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    if (width <= 0 || height <= 0 || amount <= 0) return;

    const targetWhite = whiteColor ?? { r: 255, g: 255, b: 255, a: 1 };
    const mix = Math.max(0, Math.min(1, amount));
    const image = ctx.getImageData(0, 0, width, height);
    const data = image.data;
    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3]!;
      if (alpha === 0) continue;
      const r = data[index]!;
      const g = data[index + 1]!;
      const b = data[index + 2]!;
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const mappedR = blackColor.r + (targetWhite.r - blackColor.r) * luminance;
      const mappedG = blackColor.g + (targetWhite.g - blackColor.g) * luminance;
      const mappedB = blackColor.b + (targetWhite.b - blackColor.b) * luminance;
      data[index] = Math.round(r + (mappedR - r) * mix);
      data[index + 1] = Math.round(g + (mappedG - g) * mix);
      data[index + 2] = Math.round(b + (mappedB - b) * mix);
    }
    ctx.putImageData(image, 0, 0);
  }

  private renderText(ctx: RenderingContext2D, text: TextDocument): void {
    ctx.fillStyle = colorToCss(text.color);
    ctx.textAlign = text.justification ?? 'left';
    ctx.textBaseline = 'middle';

    const lines = text.text.replace(/\r/g, '\n').split('\n');
    const lineHeight = text.lineHeight ?? text.size * 1.2;
    const isHeavyMultiline = lines.length > 1 && /black|heavy|bold/i.test(text.fontFamily);
    const isHeavySingleLine = lines.length === 1 && /black|heavy|bold/i.test(text.fontFamily);
    const fontStyle = textFontStyle(text.fontFamily);
    const baseFontSize = isHeavyMultiline ? text.size * 0.912 : text.size;
    const textScaleX = (isHeavyMultiline ? 1.1 : isHeavySingleLine ? 1.014 : 1) * fontStyle.scaleX;
    let y =
      (isHeavyMultiline ? -lineHeight * 0.25 : isHeavySingleLine ? -text.size * 0.29 : 0) +
      fontStyle.offsetY * text.size;
    const selectorScale =
      text.rangeSelectorEnd !== undefined && text.rangeSelectorScale && 'x' in text.rangeSelectorScale
        ? Number(text.rangeSelectorScale.x) / 100
        : 1;
    const selectorEnd = Math.max(0, Math.min(100, Number(text.rangeSelectorEnd ?? 0)));
    const selectableChars = lines.reduce((sum, line) => sum + line.length, 0) + Math.max(0, lines.length - 1);
    const selectedChars =
      text.rangeSelectorShape === 4 && selectorScale < 1
        ? Math.min(selectableChars, (selectableChars * selectorEnd) / 100 + 0.5)
        : (selectableChars * selectorEnd) / 100;

    if (text.textPath) {
      ctx.save();
      ctx.scale(textScaleX, 1);
      ctx.translate((fontStyle.offsetX * text.size) / textScaleX, 0);
      this.renderTextOnPath(ctx, text, fontStyle, baseFontSize);
      ctx.restore();
      return;
    }

    if (text.rangeSelectorShape === 4 && text.glyphs && selectorScale < 1) {
      ctx.save();
      this.renderTriangleRangeGlyphText(ctx, text, lines, {
        lineHeight,
        selectedChars,
        startY: 0,
      });
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.scale(textScaleX, 1);
    ctx.translate((fontStyle.offsetX * text.size) / textScaleX, 0);
    if (text.rangeSelectorShape === 4 && selectorScale < 1 && selectedChars > 0) {
      this.renderTriangleRangeText(ctx, text, lines, {
        baseFontSize,
        fontStyle,
        lineHeight,
        selectedChars,
        startY: y,
      });
      ctx.restore();
      return;
    }

    let charCursor = 0;
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]!;
      const lineStart = charCursor;
      const lineEnd = lineStart + line.length;
      charCursor = lineEnd;
      const selected = selectorScale < 1 && lines.length > 1 && index > 0 && lineEnd <= selectedChars + 0.5;
      const fontSize = selected ? baseFontSize * selectorScale : baseFontSize;
      ctx.font = canvasFont(fontStyle, fontSize);
      if (selected && text.justification === 'center') {
        this.fillTextWithTracking(ctx, line, 0, y, baseFontSize * 0.2);
      } else {
        ctx.fillText(line, 0, y);
      }
      y += lineHeight;
    }
    ctx.restore();
  }

  private renderTriangleRangeGlyphText(
    ctx: RenderingContext2D,
    text: TextDocument,
    lines: string[],
    options: {
      lineHeight: number;
      selectedChars: number;
      startY: number;
    },
  ): void {
    const glyphs = text.glyphs;
    if (!glyphs) return;

    const glyphScale = text.size / 100;
    let y = options.startY;
    let charCursor = 0;

    for (const line of lines) {
      const chars = [...line];
      const widths = chars.map((char) => (glyphs[char]?.width ?? text.size) * glyphScale);
      const totalWidth = widths.reduce((sum, width) => sum + width, 0);
      let x = text.justification === 'center' ? -totalWidth / 2 : text.justification === 'right' ? -totalWidth : 0;

      for (let index = 0; index < chars.length; index++) {
        const char = chars[index]!;
        const glyph = glyphs[char];
        const influence = triangleSelectorInfluence(charCursor + index + 0.5, options.selectedChars, 0.735) * 0.8;
        const scale = glyphScale * (1 - influence);
        if (glyph) {
          this.fillTextGlyph(ctx, glyph, x, y, scale);
        }
        x += widths[index]!;
      }

      charCursor += chars.length + 1;
      y += options.lineHeight;
    }
  }

  private fillTextGlyph(ctx: RenderingContext2D, glyph: TextGlyph, x: number, y: number, scale: number): void {
    if (scale <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    for (const path of glyph.paths) {
      ctx.fill(buildPathFromPathData(path), 'nonzero');
    }
    ctx.restore();
  }

  private renderTriangleRangeText(
    ctx: RenderingContext2D,
    text: TextDocument,
    lines: string[],
    options: {
      baseFontSize: number;
      fontStyle: CanvasTextFontStyle;
      lineHeight: number;
      selectedChars: number;
      startY: number;
    },
  ): void {
    const { baseFontSize, fontStyle, lineHeight, selectedChars } = options;
    let y = options.startY;
    let charCursor = 0;
    ctx.textAlign = 'center';

    for (const line of lines) {
      const chars = [...line];
      ctx.font = canvasFont(fontStyle, baseFontSize);
      const widths = chars.map((char) => ctx.measureText(char).width);
      const totalWidth = widths.reduce((sum, width) => sum + width, 0);
      let x = text.justification === 'center' ? -totalWidth / 2 : text.justification === 'right' ? -totalWidth : 0;

      for (let index = 0; index < chars.length; index++) {
        const char = chars[index]!;
        const width = widths[index]!;
        const influence = triangleSelectorInfluence(charCursor + index + 0.5, selectedChars);
        const fontSize = baseFontSize * (1 - influence);
        ctx.font = canvasFont(fontStyle, fontSize);
        const scaledWidth = ctx.measureText(char).width;
        ctx.fillText(char, x + scaledWidth / 2, y);
        x += width;
      }

      charCursor += chars.length + 1;
      y += lineHeight;
    }
  }

  private renderTextOnPath(
    ctx: RenderingContext2D,
    text: TextDocument,
    fontStyle: CanvasTextFontStyle,
    fontSize: number,
  ): void {
    const pathData = text.textPath?.path as PathData | undefined;
    if (!pathData || pathData.vertices.length < 2) {
      ctx.font = canvasFont(fontStyle, fontSize);
      ctx.fillText(text.text, 0, 0);
      return;
    }

    const points = pathDataToPoints(pathData, 24);
    if (points.length < 2) return;

    const lengths = cumulativeLengths(points);
    const total = lengths[lengths.length - 1]!;
    if (total <= 0) return;

    const chars = [...text.text];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = canvasFont(fontStyle, fontSize);
    let cursor = Number(text.textPath?.firstMargin ?? 0);
    for (const char of chars) {
      const width = ctx.measureText(char).width;
      const mid = cursor + width / 2;
      cursor += width + (text.tracking ?? 0);
      if (mid < 0 || mid > total) continue;

      const sample = samplePath(points, lengths, mid);
      ctx.save();
      ctx.translate(sample.point.x, sample.point.y - fontSize * 0.32);
      ctx.rotate(sample.angle);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }

  private fillTextWithTracking(ctx: RenderingContext2D, text: string, x: number, y: number, tracking: number): void {
    const chars = [...text];
    const totalWidth =
      chars.reduce((sum, char) => sum + ctx.measureText(char).width, 0) + Math.max(0, chars.length - 1) * tracking;
    let cursor = x - totalWidth / 2;
    for (const char of chars) {
      const width = ctx.measureText(char).width;
      ctx.fillText(char, cursor + width / 2, y);
      cursor += width + tracking;
    }
  }

  private drawImage(ctx: RenderingContext2D, imageSource: ImageSource): void {
    const image = getCachedImage(this.imageCache, imageSource.src);
    if (!image) return;

    const width = Math.max(1, Math.round(imageSource.width));
    const height = Math.max(1, Math.round(imageSource.height));
    const cache = this.scaledImageFor(imageSource.src, image, width, height);
    if (cache) {
      ctx.drawImage(cache as CanvasImageSource, 0, 0);
      return;
    }

    ctx.save();
    ctx.rect(0, 0, imageSource.width, imageSource.height);
    ctx.clip();
    ctx.drawImage(image, 0, -0.5, imageSource.width, imageSource.height);
    ctx.restore();
  }

  private scaledImageFor(
    src: string,
    image: HTMLImageElement,
    width: number,
    height: number,
  ): HTMLCanvasElement | OffscreenCanvas | null {
    if (typeof OffscreenCanvas === 'undefined' && typeof document === 'undefined') return null;
    const pixels = width * height;
    if (pixels > MAX_SCALED_IMAGE_CACHE_PIXELS) return null;

    const key = `${src}|${width}x${height}`;
    const cached = this.scaledImageCache.get(key);
    if (cached) {
      this.scaledImageCache.delete(key);
      this.scaledImageCache.set(key, cached);
      return cached.canvas;
    }

    const { canvas, ctx } = createOffscreenContext(width, height);
    ctx.drawImage(image, 0, -0.5, width, height);
    this.scaledImageCache.set(key, { canvas, pixels });
    this.scaledImageCachePixels += pixels;
    this.evictScaledImageCache();
    return canvas;
  }

  private evictScaledImageCache(): void {
    while (this.scaledImageCachePixels > MAX_SCALED_IMAGE_CACHE_PIXELS) {
      const first = this.scaledImageCache.entries().next();
      if (first.done) return;
      const [key, entry] = first.value;
      this.scaledImageCache.delete(key);
      this.scaledImageCachePixels -= entry.pixels;
    }
  }

  private renderTrackMattePair(
    ctx: RenderingContext2D,
    matteLayer: Layer,
    maskedLayer: Layer,
    width: number,
    height: number,
  ): void {
    this.withOffscreenContext(width, height, ({ canvas: buffer, ctx: bufferCtx }) => {
      this.renderLayerContent(bufferCtx, maskedLayer, { ignoreTransformOpacity: true });
      this.applyLayerDropShadows(bufferCtx, maskedLayer, width, height);
      this.applyMasksScaled(bufferCtx, maskedLayer);

      const isLuma = maskedLayer.trackMatte === 'luma' || maskedLayer.trackMatte === 'luma-inverted';
      const isInverted = this.isInvertedTrackMatte(maskedLayer);

      if (isLuma) {
        // Luma mattes use the matte layer's brightness rather than its alpha.
        // Render the matte to a separate buffer (with its own masks), convert RGB
        // to alpha, then apply that alpha mask to the content buffer.
        this.withOffscreenContext(width, height, ({ canvas: maskBuffer, ctx: maskCtx }) => {
          this.withOffscreenContext(width, height, ({ canvas: matteTemp, ctx: matteTempCtx }) => {
            this.renderLayerContent(matteTempCtx, matteLayer, { ignoreTransformOpacity: true });
            this.applyLayerDropShadows(matteTempCtx, matteLayer, width, height);
            this.applyMasksScaled(matteTempCtx, matteLayer);
            maskCtx.setTransform(1, 0, 0, 1, 0, 0);
            maskCtx.save();
            // When the matte layer is a precomp, its children already include the
            // precomp's opacity through groupOpacity; otherwise apply the matte layer's
            // own opacity. We draw into a temp buffer first because renderLayerContent
            // resets globalAlpha when ignoreTransformOpacity is true.
            maskCtx.globalAlpha = layerCompositeAlpha(matteLayer);
            maskCtx.drawImage(matteTemp as CanvasImageSource, 0, 0);
            maskCtx.restore();
          });
          applyLumaMatteAlpha(maskCtx, width, height, isInverted);
          bufferCtx.setTransform(1, 0, 0, 1, 0, 0);
          bufferCtx.globalCompositeOperation = 'destination-in';
          bufferCtx.drawImage(maskBuffer as CanvasImageSource, 0, 0);
          bufferCtx.globalCompositeOperation = 'source-over';
        });
      } else {
        // Render the matte layer (with its own masks) to a separate buffer and use
        // its alpha to mask the content. Drawing with destination-in/out directly
        // would ignore matte-layer masks because renderLayer does not apply masks.
        if (this.canApplyAlphaMatteDirectly(matteLayer)) {
          this.applyAlphaMatteDirectly(bufferCtx, matteLayer, isInverted);
        } else {
          this.withOffscreenContext(width, height, ({ canvas: matteBuffer, ctx: matteCtx }) => {
            this.renderLayerContent(matteCtx, matteLayer, { ignoreTransformOpacity: true });
            this.applyLayerDropShadows(matteCtx, matteLayer, width, height);
            this.applyMasksScaled(matteCtx, matteLayer);
            bufferCtx.setTransform(1, 0, 0, 1, 0, 0);
            bufferCtx.globalCompositeOperation = isInverted ? 'destination-out' : 'destination-in';
            bufferCtx.globalAlpha = layerCompositeAlpha(matteLayer);
            bufferCtx.drawImage(matteBuffer as CanvasImageSource, 0, 0);
            bufferCtx.globalAlpha = 1;
            bufferCtx.globalCompositeOperation = 'source-over';
          });
        }
      }

      compositeLayerBuffer(ctx, maskedLayer, buffer);
    });
  }

  private renderMaskedLayer(ctx: RenderingContext2D, layer: Layer, width: number, height: number): void {
    this.withOffscreenContext(width, height, ({ canvas: buffer, ctx: bufferCtx }) => {
      this.renderLayerContent(bufferCtx, layer, { ignoreTransformOpacity: true });
      this.applyLayerDropShadows(bufferCtx, layer, width, height);
      this.applyMasksScaled(bufferCtx, layer);

      compositeLayerBuffer(ctx, layer, buffer);
    });
  }

  private applyLayerDropShadows(ctx: RenderingContext2D, layer: Layer, width: number, height: number): void {
    const shadows = (layer.effects ?? []).filter(
      (effect): effect is ResolvedDropShadowEffect => effect.type === 'drop-shadow' && effect.color.a > 0,
    );
    if (shadows.length === 0) return;

    this.withOffscreenContext(width, height, ({ canvas: source, ctx: sourceCtx }) => {
      sourceCtx.drawImage(ctx.canvas as CanvasImageSource, 0, 0);

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, width, height);

      for (const shadow of shadows) {
        this.withOffscreenContext(width, height, ({ canvas: mask, ctx: maskCtx }) => {
          maskCtx.drawImage(source as CanvasImageSource, 0, 0);
          maskCtx.globalCompositeOperation = 'source-in';
          maskCtx.fillStyle = colorToCss(shadow.color);
          maskCtx.fillRect(0, 0, width, height);
          maskCtx.globalCompositeOperation = 'source-over';

          const offset = dropShadowOffset(shadow);
          const blurScale = (Math.abs(this.renderScaleX) + Math.abs(this.renderScaleY)) / 2;
          ctx.filter = `blur(${(dropShadowBlur(shadow) * blurScale).toFixed(2)}px)`;
          ctx.drawImage(mask as CanvasImageSource, offset.x * this.renderScaleX, offset.y * this.renderScaleY);
          ctx.filter = 'none';
        });
      }

      ctx.drawImage(source as CanvasImageSource, 0, 0);
      ctx.restore();
    });
  }

  private renderLayerContent(
    ctx: RenderingContext2D,
    layer: Layer,
    options: { ignoreTransformOpacity?: boolean } = {},
  ): void {
    if (layer.matteChildren) {
      // A precomp that participates in a track matte, acts as a matte, or has
      // layer masks must render as a single composited unit. Its children's
      // transforms already include the precomp instance transform (they are
      // parented to the synthetic precomp layer), so we must not apply the
      // precomp transform again. Render the children directly through the full
      // layer-list renderer so inner track mattes and masks compose correctly.
      const filter = buildEffectFilter(layer.effects, this.effectFilterScale());
      if (filter) {
        ctx.filter = filter;
      }
      const canvas = ctx.canvas;
      this.renderLayerList(
        ctx,
        layer.matteChildren.map((child) => ({
          ...child,
          visible: child.visible && !child.hiddenByPrecompComposite,
        })),
        canvas.width,
        canvas.height,
      );
      if (filter) {
        ctx.filter = 'none';
      }
      return;
    }
    ctx.save();
    ctx.setTransform(this.renderScaleX, 0, 0, this.renderScaleY, 0, 0);
    this.renderLayer(ctx, layer, false, options);
    ctx.restore();
  }

  private applyMasksScaled(ctx: RenderingContext2D, layer: Layer): void {
    if (!layer.masks || layer.masks.length === 0) return;
    ctx.save();
    ctx.setTransform(this.renderScaleX, 0, 0, this.renderScaleY, 0, 0);
    applyMasks(ctx, layer);
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
  }

  private effectFilterScale(): number {
    return (Math.abs(this.renderScaleX) + Math.abs(this.renderScaleY)) / 2;
  }

  private drawShape(
    ctx: RenderingContext2D,
    shape: Shape,
    path?: Path2D,
    groupMatrix: AffineMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
  ): void {
    if (shape.transform && shape.transform.opacity <= 0) {
      return;
    }

    if (shape.type === 'merge') {
      this.drawMergeShape(ctx, shape as MergeShape);
      return;
    }

    if (shape.type === 'group') {
      const group = shape as GroupShape;
      const hasTransform = group.transform !== undefined;
      const childMatrix = group.transform
        ? multiplyMatrices(groupMatrix, transformToMatrix(group.transform))
        : groupMatrix;
      if (hasTransform) {
        ctx.save();
        const layerAlpha = ctx.globalAlpha;
        applyTransform(ctx, {
          ...group.transform,
          opacity: (group.transform?.opacity ?? 100) * layerAlpha,
        } as Transform);
      }
      // Lottie stores group children top-to-bottom; render from the bottom of
      // the stack upward and group any simultaneous trim-path runs so they share
      // a single cumulative length.
      let i = group.children.length - 1;
      while (i >= 0) {
        const child = group.children[i]!;
        if (child.trim?.mode === 'simultaneous' && child.trim.groupId) {
          const run: Shape[] = [child];
          let j = i - 1;
          while (j >= 0 && group.children[j]!.trim?.groupId === child.trim.groupId) {
            run.push(group.children[j]!);
            j--;
          }
          // drawTrimmedShapeGroup expects the run in bottom-to-top order.
          this.drawTrimmedShapeGroup(ctx, run.reverse(), child.trim as TrimPath, childMatrix);
          i = j;
        } else {
          this.drawShape(ctx, child, undefined, childMatrix);
          i--;
        }
      }
      if (hasTransform) {
        ctx.restore();
      }
      return;
    }

    const hasShapeTransform = shape.transform !== undefined;
    if (hasShapeTransform) {
      ctx.save();
      // Compose the shape transform opacity with the layer opacity already set
      // on the context.
      const layerAlpha = ctx.globalAlpha;
      applyTransform(ctx, {
        ...shape.transform,
        opacity: (shape.transform?.opacity ?? 100) * layerAlpha,
      } as Transform);
    }

    const trim = effectiveTrimPath(shape);
    const shapePath =
      path ?? (trim && !isFullTrimPath(trim) ? getTrimmedPath(shape, trim) : this.shapeToCachedPath(shape));
    const strokeWidthScale = (shape.strokeWidthScale ?? 1) * strokeScale(shape.transform);
    const fillBeforeStroke = shape.paintOrder === 'fill-stroke' && shape.stroke !== undefined;
    if (!fillBeforeStroke && shape.stroke) {
      this.applyShapeStrokes(ctx, shape.stroke, shapePath, strokeWidthScale);
    }
    if (shape.fill && this.fillIsVisible(shape.fill)) {
      applyFill(ctx, shape.fill);
      ctx.fill(shapePath, shape.fill.fillRule ?? 'nonzero');
    }
    if (fillBeforeStroke && shape.stroke) {
      this.applyShapeStrokes(ctx, shape.stroke, shapePath, strokeWidthScale);
    }

    if (hasShapeTransform) {
      ctx.restore();
    }
  }

  private drawMergeShape(ctx: RenderingContext2D, shape: MergeShape): void {
    const mode = shape.mode;

    // For merge/add modes, combine all operand geometries into a single Path2D
    // and fill/stroke it once. This preserves holes created by overlapping paths
    // with opposite winding, which is essential for the Lottie merge-path union
    // behavior.
    if (mode === 'merge' || mode === 'add') {
      const combined = new Path2D();
      for (const operand of shape.shapes) {
        const operandPath = this.operandPath(operand);
        appendPath(combined, operandPath);
      }
      this.drawMergedPath(ctx, shape, combined);
      return;
    }

    // Subtract / intersect / exclude require boolean set operations. Build an
    // alpha mask from the operand geometries in an offscreen buffer, then fill
    // the union of the operands on another buffer and mask it. Strokes are
    // omitted because they cannot be derived from the boolean silhouette.
    const canvas = ctx.canvas;
    this.withOffscreenContext(canvas.width, canvas.height, ({ canvas: maskBuffer, ctx: maskCtx }) => {
      // Boolean shapes live inside the current scene-graph transform. Apply it
      // to the offscreen buffers so operands are positioned consistently, but
      // reset before compositing so the buffer is drawn in screen space.
      const baseMatrix = ctx.getTransform();
      maskCtx.setTransform(baseMatrix);

      const shapeTransform = shape.transform;
      const hasShapeTransform = shapeTransform !== undefined;
      if (hasShapeTransform) {
        maskCtx.save();
        applyTransform(maskCtx, shapeTransform);
      }

      maskCtx.fillStyle = '#ffffff';
      for (let i = 0; i < shape.shapes.length; i++) {
        const operand = shape.shapes[i]!;
        const operandPath = this.operandPath(operand);
        if (i === 0) {
          maskCtx.globalCompositeOperation = 'source-over';
        } else if (mode === 'subtract') {
          maskCtx.globalCompositeOperation = 'destination-out';
        } else if (mode === 'intersect') {
          maskCtx.globalCompositeOperation = 'destination-in';
        } else {
          // exclude
          maskCtx.globalCompositeOperation = 'xor';
        }
        maskCtx.fill(operandPath);
      }

      if (hasShapeTransform) {
        maskCtx.restore();
      }

      if (!shape.fill) return;

      this.withOffscreenContext(canvas.width, canvas.height, ({ canvas: fillBuffer, ctx: fillCtx }) => {
        if (!shape.fill) return;

        if (!this.fillIsVisible(shape.fill)) return;

        if (shape.fill.type === 'solid') {
          applyFill(fillCtx, shape.fill);
          fillCtx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          fillCtx.setTransform(baseMatrix);

          if (hasShapeTransform) {
            fillCtx.save();
            applyTransform(fillCtx, shapeTransform);
          }

          const union = new Path2D();
          for (const operand of shape.shapes) {
            const operandPath = this.operandPath(operand);
            appendPath(union, operandPath);
          }
          applyFill(fillCtx, shape.fill);
          fillCtx.fill(union, shape.fill.fillRule ?? 'nonzero');

          if (hasShapeTransform) {
            fillCtx.restore();
          }
        }

        fillCtx.globalCompositeOperation = 'destination-in';
        fillCtx.setTransform(new DOMMatrix());
        fillCtx.drawImage(maskBuffer as CanvasImageSource, 0, 0);
        fillCtx.globalCompositeOperation = 'source-over';

        ctx.save();
        ctx.setTransform(new DOMMatrix());
        ctx.drawImage(fillBuffer as CanvasImageSource, 0, 0);
        ctx.restore();
      });
    });
  }

  /**
   * Build a Path2D for a merge-path operand, applying any transforms defined on
   * the operand itself or on nested group wrappers. Merge paths are frequently
   * authored with transformed shape groups as operands, and ignoring those
   * transforms produces tiny or misaligned geometry.
   */
  private operandPath(operand: Shape, parentTransform?: Transform): Path2D {
    if (operand.type === 'group') {
      const group = operand as GroupShape;
      const groupTransform = group.transform;
      const combined =
        groupTransform && parentTransform
          ? combineTransforms(parentTransform, groupTransform)
          : (groupTransform ?? parentTransform);
      const path = new Path2D();
      for (const child of group.children) {
        const childPath = this.operandPath(child, combined);
        appendPath(path, childPath);
      }
      return path;
    }

    const trim = effectiveTrimPath(operand);
    const path = trim && !isFullTrimPath(trim) ? getTrimmedPath(operand, trim) : this.shapeToCachedPath(operand);
    const transform = operand.transform
      ? parentTransform
        ? combineTransforms(parentTransform, operand.transform)
        : operand.transform
      : parentTransform;
    if (!transform) return path;
    return transformPath(path, transform);
  }

  private drawMergedPath(ctx: RenderingContext2D, shape: Shape, path: Path2D): void {
    const hasShapeTransform = shape.transform !== undefined;
    if (hasShapeTransform) {
      ctx.save();
      const layerAlpha = ctx.globalAlpha;
      applyTransform(ctx, {
        ...shape.transform,
        opacity: (shape.transform?.opacity ?? 100) * layerAlpha,
      } as Transform);
    }

    const strokeWidthScale = (shape.strokeWidthScale ?? 1) * strokeScale(shape.transform);
    const fillBeforeStroke = shape.paintOrder === 'fill-stroke' && shape.stroke !== undefined;
    if (!fillBeforeStroke && shape.stroke) {
      this.applyShapeStrokes(ctx, shape.stroke, path, strokeWidthScale);
    }
    if (shape.fill && this.fillIsVisible(shape.fill)) {
      applyFill(ctx, shape.fill);
      ctx.fill(path, shape.fill.fillRule ?? 'nonzero');
    }
    if (fillBeforeStroke && shape.stroke) {
      this.applyShapeStrokes(ctx, shape.stroke, path, strokeWidthScale);
    }

    if (hasShapeTransform) {
      ctx.restore();
    }
  }

  private shapeToCachedPath(shape: Shape): Path2D {
    if (shape.type === 'path') {
      const data = (shape as PathShape).path as PathData;
      const cached = this.pathDataCache.get(data);
      if (cached) return cached;

      const path = buildPathFromPathData(data);
      this.pathDataCache.set(data, path);
      return path;
    }

    const cached = this.shapePathCache.get(shape);
    if (cached) return cached;

    const path = shapeToPath(shape);
    this.shapePathCache.set(shape, path);
    return path;
  }

  private applyShapeStrokes(
    ctx: RenderingContext2D,
    stroke: Stroke | Stroke[],
    path: Path2D,
    widthScale: number,
  ): void {
    applyStrokes(ctx, stroke, path, widthScale, {
      skipDashPattern: !this.renderHasDashPatterns,
    });
  }

  private canApplyAlphaMatteDirectly(matteLayer: Layer): boolean {
    if (matteLayer.masks?.length || matteLayer.effects?.length) return false;
    if (matteLayer.blendMode && matteLayer.blendMode !== 'source-over') return false;
    if (matteLayer.matteChildren) return false;
    return this.mattePaintOperationCount(matteLayer.shapes) === 1;
  }

  private applyAlphaMatteDirectly(ctx: RenderingContext2D, matteLayer: Layer, isInverted: boolean): void {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = isInverted ? 'destination-out' : 'destination-in';
    ctx.globalAlpha = layerCompositeAlpha(matteLayer);
    this.renderLayerContent(ctx, matteLayer, { ignoreTransformOpacity: true });
    ctx.restore();
  }

  private mattePaintOperationCount(shapes: Shape[]): number {
    let count = 0;
    for (const shape of shapes) {
      if (shape.transform?.opacity !== undefined && shape.transform.opacity <= 0) continue;
      if (shape.type === 'group') {
        count += this.mattePaintOperationCount((shape as GroupShape).children);
      } else if (shape.type === 'merge') {
        count += this.mattePaintOperationCount((shape as MergeShape).shapes);
      } else {
        if (shape.fill && this.fillIsVisible(shape.fill)) count += 1;
        const strokes = Array.isArray(shape.stroke) ? shape.stroke : shape.stroke ? [shape.stroke] : [];
        for (const stroke of strokes) {
          if (this.strokeIsVisible(stroke)) count += 1;
        }
      }
      if (count > 1) return count;
    }
    return count;
  }

  private layerPaintOperationCount(layer: Layer): number {
    let count = this.mattePaintOperationCount(layer.shapes);
    if (layer.image) count += 1;
    if (layer.text) count += 1;
    return count;
  }

  private strokeIsVisible(stroke: Stroke): boolean {
    if (Number(stroke.width) <= 0 || Number(stroke.opacity ?? 100) <= 0) return false;
    if (stroke.type === 'solid') return (stroke.color as Color).a > 0;
    return (stroke.colors as ColorStop[]).some((stop) => stop.color.a > 0);
  }

  private fillIsVisible(fill: Fill): boolean {
    if (fill.type === 'solid') {
      return (fill.color as Color).a > 0;
    }

    const stops = fill.colors as ColorStop[];
    return stops.some((stop) => stop.color.a > 0);
  }

  private animationHasDashPatterns(animation: Animation): boolean {
    const cached = this.animationDashPatternCache.get(animation);
    if (cached !== undefined) return cached;

    const hasDash = animation.layers.some((layer) => this.layerHasDashPatterns(layer));
    this.animationDashPatternCache.set(animation, hasDash);
    return hasDash;
  }

  private layerHasDashPatterns(layer: LayerDefinition): boolean {
    if (layer.shapes.some((shape) => this.shapeHasDashPatterns(shape))) return true;
    return (layer.matteChildren ?? []).some((child) => this.layerHasDashPatterns(child));
  }

  private shapeHasDashPatterns(shape: Shape): boolean {
    const strokes = Array.isArray(shape.stroke) ? shape.stroke : shape.stroke ? [shape.stroke] : [];
    if (strokes.some((stroke) => (stroke.dash?.length ?? 0) > 0 || stroke.dashOffset !== undefined)) {
      return true;
    }
    if (shape.type === 'group') {
      return (shape as GroupShape).children.some((child) => this.shapeHasDashPatterns(child));
    }
    if (shape.type === 'merge') {
      return (shape as MergeShape).shapes.some((child) => this.shapeHasDashPatterns(child));
    }
    return false;
  }

  private drawTrimmedShapeGroup(
    ctx: RenderingContext2D,
    shapes: Shape[],
    trim: TrimPath,
    groupMatrix: AffineMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
  ): void {
    if (isFullTrimPath(trim)) {
      for (const shape of shapes) {
        this.drawShape(ctx, shape, undefined, groupMatrix);
      }
      return;
    }

    // Ellipses can be trimmed with true arcs instead of polygonized samples,
    // which keeps circular strokes smooth at any scale.
    if (shapes.every((shape) => shape.type === 'ellipse')) {
      for (const shape of shapes) {
        this.drawShape(ctx, shape, trimmedEllipsePath(shape as EllipseShape, trim), groupMatrix);
      }
      return;
    }

    const shapeData = shapes.map((shape) => {
      const points = shapeToPoints(shape, 128);
      const lengths: number[] = [0];
      for (let i = 1; i < points.length; i++) {
        lengths.push(lengths[i - 1]! + distance(points[i - 1]!, points[i]!));
      }
      return { shape, points, lengths, length: lengths[lengths.length - 1]! };
    });

    const totalLength = shapeData.reduce((sum, data) => sum + data.length, 0);
    if (totalLength <= 0) {
      for (const shape of shapes) {
        this.drawShape(ctx, shape, new Path2D(), groupMatrix);
      }
      return;
    }

    const ranges = getTrimVisibleRanges(trim);

    let cumulative = 0;
    for (const data of shapeData) {
      const shapeStart = cumulative;
      const shapeEnd = cumulative + data.length;
      const path = new Path2D();

      for (const [rangeStartPercent, rangeEndPercent] of ranges) {
        const rangeStart = rangeStartPercent * totalLength;
        const rangeEnd = rangeEndPercent * totalLength;
        const subStart = Math.max(shapeStart, rangeStart);
        const subEnd = Math.min(shapeEnd, rangeEnd);
        if (subStart < subEnd) {
          appendTrimmedSegment(path, data.points, data.lengths, subStart - shapeStart, subEnd - shapeStart);
        }
      }

      this.drawShape(ctx, data.shape, path, groupMatrix);
      cumulative = shapeEnd;
    }
  }
}

interface CanvasTextFontStyle {
  family: string;
  style: string;
  weight: string;
  scaleX: number;
  offsetX: number;
  offsetY: number;
}

function textFontStyle(fontFamily: string): CanvasTextFontStyle {
  const isHeavy = /black|heavy|bold/i.test(fontFamily);
  if (isHeavy) {
    return {
      family: `${cssFontFamily(fontFamily)}, "Arial Black", sans-serif`,
      style: 'normal',
      weight: 'normal',
      scaleX: 1,
      offsetX: 0,
      offsetY: 0,
    };
  }

  const isItalic = /italic|oblique/i.test(fontFamily);
  const isLight = /light|thin/i.test(fontFamily);
  const family = fontFamily
    .replace(/\b(italic|oblique|light|thin|regular|medium|bold|black|heavy)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    family: `${cssFontFamily(family || fontFamily)}, sans-serif`,
    style: isItalic ? 'italic' : 'normal',
    weight: isLight ? '300' : 'normal',
    scaleX: isItalic && isLight ? 0.95 : 1,
    offsetX: isItalic && isLight ? 0.28 : 0,
    offsetY: isItalic && isLight ? -0.2 : 0,
  };
}

function canvasFont(style: CanvasTextFontStyle, size: number): string {
  return `${style.style} ${style.weight} ${size}px ${style.family}`;
}

function cssFontFamily(fontFamily: string): string {
  return fontFamily
    .split(',')
    .map((family) => family.trim())
    .filter(Boolean)
    .map((family) => (/^["'].*["']$/.test(family) ? family : JSON.stringify(family)))
    .join(', ');
}

function pathDataToPoints(path: PathData, segmentsPerCurve: number): Point[] {
  const points: Point[] = [];
  if (path.vertices.length === 0) return points;

  points.push(path.vertices[0]!);
  for (let index = 0; index < path.vertices.length - 1; index++) {
    appendPathDataSegment(points, path, index, index + 1, segmentsPerCurve);
  }
  if (path.closed && path.vertices.length > 1) {
    appendPathDataSegment(points, path, path.vertices.length - 1, 0, segmentsPerCurve);
  }
  return points;
}

function appendPathDataSegment(
  points: Point[],
  path: PathData,
  fromIndex: number,
  toIndex: number,
  segmentsPerCurve: number,
): void {
  const from = path.vertices[fromIndex]!;
  const to = path.vertices[toIndex]!;
  const outTangent = path.outTangents[fromIndex] ?? { x: 0, y: 0 };
  const inTangent = path.inTangents[toIndex] ?? { x: 0, y: 0 };
  const isLine =
    Math.abs(outTangent.x) <= 1e-9 &&
    Math.abs(outTangent.y) <= 1e-9 &&
    Math.abs(inTangent.x) <= 1e-9 &&
    Math.abs(inTangent.y) <= 1e-9;
  if (isLine) {
    points.push(to);
    return;
  }

  const cp1 = { x: from.x + outTangent.x, y: from.y + outTangent.y };
  const cp2 = { x: to.x + inTangent.x, y: to.y + inTangent.y };
  for (let step = 1; step <= segmentsPerCurve; step++) {
    const t = step / segmentsPerCurve;
    points.push(cubicPoint(from, cp1, cp2, to, t));
  }
}

function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

function cumulativeLengths(points: Point[]): number[] {
  const lengths = [0];
  for (let index = 1; index < points.length; index++) {
    lengths.push(lengths[index - 1]! + distance(points[index - 1]!, points[index]!));
  }
  return lengths;
}

function samplePath(points: Point[], lengths: number[], distanceAlongPath: number): { point: Point; angle: number } {
  const total = lengths[lengths.length - 1]!;
  const dist = Math.max(0, Math.min(distanceAlongPath, total));
  let index = lengths.findIndex((length) => length >= dist);
  if (index <= 0) index = 1;
  if (index >= points.length) index = points.length - 1;

  const prevLength = lengths[index - 1]!;
  const nextLength = lengths[index]!;
  const segmentLength = nextLength - prevLength;
  const t = segmentLength > 0 ? (dist - prevLength) / segmentLength : 0;
  const from = points[index - 1]!;
  const to = points[index]!;
  return {
    point: {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    },
    angle: Math.atan2(to.y - from.y, to.x - from.x),
  };
}

function triangleSelectorInfluence(charPosition: number, selectedChars: number, peak = 0.65): number {
  if (selectedChars <= 0 || charPosition < 0 || charPosition > selectedChars) return 0;
  const t = charPosition / selectedChars;
  return t <= peak ? t / peak : (1 - t) / (1 - peak);
}
