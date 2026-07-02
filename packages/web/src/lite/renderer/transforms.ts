import type { Transform } from '../model';
import { transformToMatrix } from '../model';
import type { RenderingContext2D } from './types';

export function applyTransform(ctx: RenderingContext2D, transform: Transform): void {
  if (Math.abs(transform.opacity - 100) > 1e-9) {
    ctx.globalAlpha = transform.opacity / 100;
  }
  const matrix = transformToMatrix(transform);
  ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
}

export function strokeScale(transform: Transform | undefined): number {
  if (!transform) return 1;
  const matrix = transformToMatrix(transform);
  const sx = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
  const sy = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
  // Avoid division by zero; use the average axis scale as the stroke-width
  // scaling factor. This keeps strokes visually consistent when a shape group
  // transform scales the path geometry without inflating the stroke width.
  return Math.max((sx + sy) / 2, 0.0001);
}
