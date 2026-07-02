import type { Layer, ResolvedMask } from '../model';
import { buildPathFromPathData } from './paths';
import type { RenderingContext2D } from './types';

export function applyMasks(ctx: RenderingContext2D, layer: Layer): void {
  if (!layer.masks || layer.masks.length === 0) return;
  for (const mask of layer.masks) {
    applyMask(ctx, mask, layer);
  }
  ctx.globalCompositeOperation = 'source-over';
}

function applyMask(ctx: RenderingContext2D, mask: ResolvedMask, layer: Layer): void {
  const path = buildPathFromPathData(mask.path);

  ctx.save();
  const layerTransform = layer.transform;
  ctx.translate(layerTransform.position.x, layerTransform.position.y);
  ctx.rotate((layerTransform.rotation * Math.PI) / 180);
  ctx.scale(layerTransform.scale.x / 100, layerTransform.scale.y / 100);
  ctx.translate(-layerTransform.anchor.x, -layerTransform.anchor.y);

  let addOp: GlobalCompositeOperation = 'destination-in';
  let subtractOp: GlobalCompositeOperation = 'destination-out';
  if (mask.inverted) {
    // Inverting a mask reverses which pixels are kept.
    [addOp, subtractOp] = [subtractOp, addOp];
  }

  if (mask.mode === 'subtract') {
    ctx.globalCompositeOperation = subtractOp;
  } else {
    // 'add', 'intersect', and 'difference' all keep pixels that overlap
    // the mask shape. Full difference semantics would require compositing
    // against higher masks, which we do not yet implement.
    ctx.globalCompositeOperation = addOp;
  }

  ctx.globalAlpha = mask.opacity / 100;
  ctx.fill(path, 'evenodd');
  ctx.restore();
}
