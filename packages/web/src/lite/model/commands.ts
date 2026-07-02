import { buildScene } from './scene';
import type {
  Animation,
  Color,
  ImageSource,
  Layer,
  ResolvedDropShadowEffect,
  ResolvedEffect,
  ResolvedFillEffect,
  ResolvedGaussianBlurEffect,
  ResolvedTintEffect,
  Shape,
  TextDocument,
  Transform,
} from './types';

/**
 * Backend-agnostic rendering command.
 *
 * A command list is produced from the resolved scene graph for a single frame.
 * Renderers iterate the list and emit the corresponding primitives without
 * re-evaluating the animation state.
 */
export type RenderCommand =
  | { type: 'save' }
  | { type: 'restore' }
  | { type: 'transform'; transform: Transform }
  | { type: 'blendMode'; mode: string }
  | { type: 'filter'; filter: string }
  | { type: 'drawShape'; shape: Shape }
  | { type: 'drawImage'; image: ImageSource }
  | { type: 'drawText'; text: TextDocument }
  | { type: 'fillEffect'; color: Color }
  | { type: 'tint'; color: Color; whiteColor?: Color; amount: number };

/**
 * Build a command list for the visible content of a single resolved layer.
 */
export function buildLayerCommands(layer: Layer, options: { includeBlendMode?: boolean } = {}): RenderCommand[] {
  const { includeBlendMode = true } = options;
  const commands: RenderCommand[] = [];

  commands.push({ type: 'save' });
  commands.push({ type: 'transform', transform: layer.transform });

  if (includeBlendMode && layer.blendMode) {
    commands.push({ type: 'blendMode', mode: layer.blendMode });
  }

  const filter = buildEffectFilter(layer.effects);
  if (filter) {
    commands.push({ type: 'filter', filter });
  }

  // Shape arrays are exported top-to-bottom; render the bottom shape first so
  // later (top) shapes composite on top.
  for (let i = layer.shapes.length - 1; i >= 0; i--) {
    commands.push({ type: 'drawShape', shape: layer.shapes[i]! });
  }

  if (layer.image) {
    commands.push({ type: 'drawImage', image: layer.image });
  }

  if (layer.text) {
    commands.push({ type: 'drawText', text: layer.text });
  }

  for (const effect of layer.effects ?? []) {
    if (effect.type === 'fill') {
      const fill = effect as ResolvedFillEffect;
      commands.push({ type: 'fillEffect', color: fill.color });
    } else if (effect.type === 'tint') {
      const tint = effect as ResolvedTintEffect;
      commands.push({
        type: 'tint',
        color: tint.color,
        ...(tint.whiteColor !== undefined && { whiteColor: tint.whiteColor }),
        amount: tint.amount,
      });
    }
  }

  commands.push({ type: 'restore' });
  return commands;
}

/**
 * Build a command list for an entire animation frame.
 *
 * Matte layers are skipped because their content is consumed by the following
 * layer's track matte; callers that need track-matte compositing should use
 * `buildLayerCommands` directly.
 */
export function buildCommandList(animation: Animation, frame: number): RenderCommand[] {
  const layers = buildScene(animation, frame);
  const compFrame = frame + (animation.inPoint ?? 0);
  const commands: RenderCommand[] = [];

  for (const layer of layers) {
    if (!layer.visible || compFrame < layer.inPoint || compFrame >= layer.outPoint) {
      continue;
    }
    if (layer.isMatte) {
      continue;
    }
    commands.push(...buildLayerCommands(layer));
  }

  return commands;
}

function buildEffectFilter(effects: ResolvedEffect[] | undefined): string | undefined {
  if (!effects || effects.length === 0) return undefined;

  const filters: string[] = [];
  for (const effect of effects) {
    if (effect.type === 'drop-shadow') {
      filters.push(buildDropShadowFilter(effect));
    } else if (effect.type === 'gaussian-blur') {
      filters.push(buildGaussianBlurFilter(effect));
    }
  }

  return filters.length > 0 ? filters.join(' ') : undefined;
}

function buildDropShadowFilter(effect: ResolvedDropShadowEffect): string {
  const angleRad = (effect.angle * Math.PI) / 180;
  const dx = effect.distance * Math.cos(angleRad);
  const dy = effect.distance * Math.sin(angleRad);
  const blur = effect.softness;
  const color = colorToCss(effect.color);
  return `drop-shadow(${dx.toFixed(2)}px ${dy.toFixed(2)}px ${blur.toFixed(2)}px ${color})`;
}

function buildGaussianBlurFilter(effect: ResolvedGaussianBlurEffect): string {
  return `blur(${effect.blurriness.toFixed(2)}px)`;
}

function colorToCss(color: Color): string {
  const r = Math.round(color.r);
  const g = Math.round(color.g);
  const b = Math.round(color.b);
  const a = color.a;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
