import type {
  Color,
  ColorStop,
  Fill,
  Point,
  ResolvedDropShadowEffect,
  ResolvedEffect,
  ResolvedGaussianBlurEffect,
  Stroke,
} from '../model';
import type { RenderingContext2D } from './types';

export function colorToCss(color: Color): string {
  const r = Math.round(color.r);
  const g = Math.round(color.g);
  const b = Math.round(color.b);
  const a = color.a;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function buildEffectFilter(effects: ResolvedEffect[] | undefined, scale = 1): string | undefined {
  if (!effects || effects.length === 0) return undefined;
  const filters = effects.flatMap((effect) =>
    effect.type === 'gaussian-blur' ? [buildGaussianBlurFilter(effect, scale)] : [],
  );
  return filters.length > 0 ? filters.join(' ') : undefined;
}

export function dropShadowOffset(effect: ResolvedDropShadowEffect): Point {
  const angleRad = ((180 - effect.angle) * Math.PI) / 180;
  return {
    x: effect.distance * Math.cos(angleRad),
    y: effect.distance * Math.sin(angleRad),
  };
}

export function dropShadowBlur(effect: ResolvedDropShadowEffect): number {
  return Math.max(0, effect.softness * 0.2125);
}

function buildGaussianBlurFilter(effect: ResolvedGaussianBlurEffect, scale: number): string {
  return `blur(${(effect.blurriness * scale).toFixed(2)}px)`;
}

export function applyFill(ctx: RenderingContext2D, fill: Fill): void {
  if (fill.type === 'solid') {
    ctx.fillStyle = colorToCss(fill.color as unknown as Color);
    return;
  }

  const start = fill.start as unknown as Point;
  const end = fill.end as unknown as Point;
  const colors = fill.colors as unknown as ColorStop[];

  let gradient: CanvasGradient;
  if (fill.gradientType === 'radial') {
    gradient = createRadialGradient(ctx, start, end, fill.highlightLength, fill.highlightAngle);
  } else {
    const fallback = degenerateLinearGradientColor(start, end, colors);
    if (fallback) {
      ctx.fillStyle = fallback;
      return;
    }
    gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
  }
  for (const stop of colors) {
    gradient.addColorStop(stop.offset, colorToCss(stop.color));
  }
  ctx.fillStyle = gradient;
}

export function applyStrokes(
  ctx: RenderingContext2D,
  stroke: Stroke | Stroke[],
  path: Path2D,
  widthScale = 1,
  options: { skipDashPattern?: boolean } = {},
): void {
  const strokes = Array.isArray(stroke) ? stroke : [stroke];
  // Stroke modifiers in Lottie are ordered top-to-bottom in the shape stack, so
  // the last modifier in the array is drawn first and the first is drawn last.
  for (let i = strokes.length - 1; i >= 0; i--) {
    const s = strokes[i]!;
    const width = Number(s.width);
    const opacity = Number(s.opacity ?? 100) / 100;
    if (width <= 0 || opacity <= 0) {
      continue;
    }
    applyStroke(ctx, s, widthScale, options);
    ctx.stroke(path);
  }
}

export function applyStroke(
  ctx: RenderingContext2D,
  stroke: Stroke,
  widthScale = 1,
  options: { skipDashPattern?: boolean } = {},
): void {
  const opacity = Number(stroke.opacity ?? 100) / 100;
  if (stroke.type === 'solid') {
    const color = stroke.color as unknown as Color;
    ctx.strokeStyle = colorToCss({ ...color, a: color.a * opacity });
  } else {
    const start = stroke.start as unknown as Point;
    const end = stroke.end as unknown as Point;
    const colors = stroke.colors as unknown as ColorStop[];

    let gradient: CanvasGradient;
    if (stroke.gradientType === 'radial') {
      gradient = createRadialGradient(ctx, start, end, stroke.highlightLength, stroke.highlightAngle);
    } else {
      const fallback = degenerateLinearGradientColor(
        start,
        end,
        colors.map((stop) => ({
          ...stop,
          color: { ...stop.color, a: stop.color.a * opacity },
        })),
      );
      if (fallback) {
        ctx.strokeStyle = fallback;
        ctx.lineWidth = Number(stroke.width) / widthScale;
        ctx.lineCap = effectiveLineCap(stroke);
        ctx.lineJoin = stroke.lineJoin;
        ctx.miterLimit = stroke.miterLimit;
        if (!options.skipDashPattern) {
          applyDashPattern(ctx, stroke);
        }
        return;
      }
      gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
    }
    for (const stop of colors) {
      gradient.addColorStop(stop.offset, colorToCss({ ...stop.color, a: stop.color.a * opacity }));
    }
    ctx.strokeStyle = gradient;
  }

  ctx.lineWidth = Number(stroke.width) / widthScale;
  ctx.lineCap = effectiveLineCap(stroke);
  ctx.lineJoin = stroke.lineJoin;
  ctx.miterLimit = stroke.miterLimit;
  if (!options.skipDashPattern) {
    applyDashPattern(ctx, stroke);
  }
}

function applyDashPattern(ctx: RenderingContext2D, stroke: Stroke): void {
  if (typeof ctx.setLineDash !== 'function') return;
  if (stroke.dash) {
    ctx.setLineDash(stroke.dash.map(Number).filter((value) => value > 0));
  } else {
    ctx.setLineDash([]);
  }
  ctx.lineDashOffset = Number(stroke.dashOffset ?? 0);
}

function effectiveLineCap(stroke: Stroke): CanvasLineCap {
  if (stroke.lineCap === 'butt' && stroke.dash?.length) return 'square';
  return stroke.lineCap;
}

function degenerateLinearGradientColor(start: Point, end: Point, colors: ColorStop[]): string | undefined {
  if (colors.length === 0) return undefined;
  if (Math.abs(start.x - end.x) > 1e-9 || Math.abs(start.y - end.y) > 1e-9) {
    return undefined;
  }
  return colorToCss(colors[colors.length - 1]!.color);
}

function createRadialGradient(
  ctx: RenderingContext2D,
  start: Point,
  end: Point,
  highlightLength?: number,
  highlightAngle?: number,
): CanvasGradient {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const radius = Math.sqrt(dx * dx + dy * dy);

  let focalX = start.x;
  let focalY = start.y;
  if (radius > 0 && highlightLength !== undefined && highlightLength > 0) {
    const baseAngle = Math.atan2(dy, dx);
    const angle = baseAngle + ((highlightAngle ?? 0) * Math.PI) / 180;
    const distance = radius * highlightLength;
    focalX = start.x + Math.cos(angle) * distance;
    focalY = start.y + Math.sin(angle) * distance;
  }

  return ctx.createRadialGradient(focalX, focalY, 0, start.x, start.y, radius);
}
