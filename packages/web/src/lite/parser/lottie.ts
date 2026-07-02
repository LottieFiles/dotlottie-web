import type {
  Animatable,
  AnimatedTransform,
  Animation,
  AudioSource,
  Color,
  ColorStop,
  DropShadowEffect,
  Effect,
  EllipseShape,
  Fill,
  FillEffect,
  GaussianBlurEffect,
  GradientFill,
  GradientStroke,
  GroupShape,
  ImageSource,
  Keyframe,
  LayerDefinition,
  LayerType,
  MaskDefinition,
  MaskMode,
  MergeShape,
  PathData,
  PathShape,
  Point,
  PointAnimatable,
  PolystarShape,
  RectShape,
  SeparatePointAnimatable,
  Shape,
  Slots,
  SolidStroke,
  Stroke,
  TextDocument,
  TextGlyph,
  ThreeDRotation,
  TintEffect,
  Transform,
  TrimPath,
} from '../model';
import { evaluateAnimatable, evaluatePoint, isAnimated } from '../model';

/**
 * Parse a Lottie JSON object into the dotLottieLitePlayer runtime model.
 *
 * Phase 1 supports:
 * - Shape layers with rectangles, ellipses, and paths.
 * - Static and animated transforms (position, anchor, scale, rotation, opacity).
 * - Static and animated path shapes.
 * - Solid fills and strokes.
 */
type ImageAssets = Map<string, ImageSource>;
type AudioAssets = Map<string, { src: string }>;

type IdContext = { nextId: number };
const MAX_PARENT_GRADIENT_STROKE_WIDTH_SCALE = 6;
let nextGeneratedShapeId = 0;

export function parseLottie(data: Record<string, unknown>, slotOverrides?: Slots): Animation {
  const parsedSlots = parseSlots(data.slots);
  const slots =
    slotOverrides && Object.keys(slotOverrides).length > 0 ? { ...parsedSlots, ...slotOverrides } : parsedSlots;
  const resolvedData =
    Object.keys(slots).length > 0 ? (resolveSlotsInData(data, slots) as Record<string, unknown>) : data;

  const version = String(resolvedData.v ?? '5.5.0');
  const frameRate = Number(resolvedData.fr ?? 60);
  const inPoint = Number(resolvedData.ip ?? 0);
  const outPoint = Number(resolvedData.op ?? frameRate);
  const width = Number(resolvedData.w ?? 512);
  const height = Number(resolvedData.h ?? 512);

  const imageAssets = parseImageAssets(resolvedData.assets);
  const audioAssets = parseAudioAssets(resolvedData.assets);
  const textGlyphs = parseTextGlyphs(resolvedData.chars);
  const assets = parseAssets(resolvedData.assets, imageAssets, audioAssets, textGlyphs);
  const layers = Array.isArray(resolvedData.layers) ? (resolvedData.layers as unknown[]) : [];
  const parsedLayers = layers.map((layer, index) =>
    parseLayer(layer as Record<string, unknown>, index, imageAssets, audioAssets, textGlyphs),
  );

  const idContext: IdContext = { nextId: 1_000_000 };
  const topOldToNew = new Map<number, number>();
  const flattenedLayers: LayerDefinition[] = [];
  for (const parsed of parsedLayers) {
    const originalInd = parsed.ind;
    const layersForRoot = flattenPrecomp(parsed, assets, idContext);
    const syntheticInd = (layersForRoot as unknown as { syntheticInd?: number }).syntheticInd;
    topOldToNew.set(originalInd, syntheticInd ?? layersForRoot[0].ind);
    flattenedLayers.push(...layersForRoot);
  }

  for (const layer of flattenedLayers) {
    if (layer.parentId !== undefined) {
      const newParentId = topOldToNew.get(layer.parentId);
      if (newParentId !== undefined) {
        layer.parentId = newParentId;
      }
    }
  }

  return {
    version,
    frameRate,
    inPoint,
    outPoint,
    duration: outPoint - inPoint,
    width,
    height,
    layers: flattenedLayers,
    slots,
  };
}

function parseSlots(data: unknown): Slots {
  const slots: Slots = {};
  if (!data || typeof data !== 'object') return slots;
  for (const [key, value] of Object.entries(data)) {
    if (!value || typeof value !== 'object') continue;
    const record = value as Record<string, unknown>;
    const p = record.p;
    if (!p || typeof p !== 'object') continue;
    const pRecord = p as Record<string, unknown>;
    slots[key] = {
      p: {
        a: pRecord.a === 1 ? 1 : 0,
        k: pRecord.k,
      },
    };
  }
  return slots;
}

function resolveSlotsInData(data: unknown, slots: Slots): unknown {
  if (Array.isArray(data)) {
    return data.map((item) => resolveSlotsInData(item, slots));
  }

  if (!data || typeof data !== 'object') {
    return data;
  }

  const record = data as Record<string, unknown>;
  const sid = record.sid;
  if (typeof sid === 'string' && slots[sid]) {
    return resolveSlotsInData(slots[sid].p, slots);
  }

  const resolved: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    resolved[key] = resolveSlotsInData(value, slots);
  }
  return resolved;
}

function parseAssets(
  data: unknown,
  imageAssets: ImageAssets,
  audioAssets: AudioAssets,
  textGlyphs: Record<string, TextGlyph>,
): Map<string, LayerDefinition[]> {
  const assets = new Map<string, LayerDefinition[]>();
  if (!Array.isArray(data)) return assets;

  for (const asset of data) {
    if (!asset || typeof asset !== 'object') continue;
    const record = asset as Record<string, unknown>;
    const id = String(record.id ?? '');
    if (!id) continue;
    const assetLayers = Array.isArray(record.layers) ? (record.layers as unknown[]) : [];
    assets.set(
      id,
      assetLayers.map((layer, index) =>
        parseLayer(layer as Record<string, unknown>, index, imageAssets, audioAssets, textGlyphs),
      ),
    );
  }

  return assets;
}

function parseImageAssets(data: unknown): ImageAssets {
  const images = new Map<string, ImageSource>();
  if (!Array.isArray(data)) return images;

  for (const asset of data) {
    if (!asset || typeof asset !== 'object') continue;
    const record = asset as Record<string, unknown>;
    const id = String(record.id ?? '');
    if (!id || record.layers !== undefined) continue;
    if (record._t === 2) continue;

    const embedded = record.e === 1;
    const path = String(record.p ?? '');
    const basePath = String(record.u ?? '');
    const src = embedded ? (path.startsWith('data:') ? path : `data:image/png;base64,${path}`) : `${basePath}${path}`;
    const width = Number(record.w ?? 512);
    const height = Number(record.h ?? 512);

    images.set(id, { src, width, height });
  }

  return images;
}

function parseAudioAssets(data: unknown): AudioAssets {
  const audios = new Map<string, { src: string }>();
  if (!Array.isArray(data)) return audios;

  for (const asset of data) {
    if (!asset || typeof asset !== 'object') continue;
    const record = asset as Record<string, unknown>;
    const id = String(record.id ?? '');
    if (!id || record._t !== 2) continue;

    const embedded = record.e === 1;
    const path = String(record.p ?? '');
    const basePath = String(record.u ?? '');
    const src = embedded ? `data:audio;base64,${path}` : `${basePath}${path}`;

    audios.set(id, { src });
  }

  return audios;
}

function allocateId(context: IdContext): number {
  return context.nextId++;
}

function flattenPrecomp(
  layer: LayerDefinition,
  assets: Map<string, LayerDefinition[]>,
  context: IdContext,
): LayerDefinition[] {
  const refId = layer.refId;
  if (!refId || !assets.has(refId)) {
    layer.ind = allocateId(context);
    return [layer];
  }

  const compLayers = assets.get(refId) ?? [];
  const compInds = new Set(compLayers.map((l) => l.ind).filter((n) => Number.isFinite(n)));
  const localMap = new Map<number, number>();

  const precompLayer: LayerDefinition = {
    id: `${layer.id}-precomp`,
    name: layer.name,
    type: 'precomp',
    index: layer.index,
    ind: allocateId(context),
    inPoint: layer.inPoint,
    outPoint: layer.outPoint,
    startTime: layer.startTime ?? 0,
    transformStartTime: layer.transformStartTime,
    stretch: layer.stretch ?? 1,
    timeRemap: layer.timeRemap,
    parentId: layer.parentId,
    transform: layer.transform,
    shapes: [],
    masks: layer.masks,
    masksUseContentFrame: layer.isPrecompChildContent,
    trackMatte: layer.trackMatte,
    isMatte: layer.isMatte,
    blendMode: layer.blendMode,
    effects: layer.effects,
    groupOpacity: layer.groupOpacity,
    isPrecompChildContent: false,
    // The synthetic precomp layer's placement transform lives on the parent
    // composition timeline and must follow the parent precomp's time remapping.
    parentTimeRemap: layer.parentTimeRemap,
    parentStartTime: layer.parentStartTime,
    remappedSourceWindow: layer.remappedSourceWindow,
    visible: layer.visible,
  };

  const children: LayerDefinition[] = [];

  for (const [index, compLayer] of compLayers.entries()) {
    const merged = mergePrecompLayer(layer, compLayer, index, compInds);
    const originalInd = merged.ind;
    const childLayers = flattenPrecomp(merged, assets, context);
    localMap.set(
      originalInd,
      (childLayers as LayerDefinition[] & { syntheticInd?: number }).syntheticInd ?? childLayers[0].ind,
    );
    children.push(...childLayers);
  }

  // A matte precomp must sit directly above the layer it masks in the flattened
  // list, so place its synthetic layer at the end of its block. For all other
  // precomps, keep the synthetic layer at the start so it pairs correctly with
  // a matte layer above it.
  const result = precompLayer.isMatte ? [...children, precompLayer] : [precompLayer, ...children];

  // Tag the result with the synthetic precomp layer's new id so callers can
  // remap external parent references to the correct layer regardless of whether
  // the synthetic layer sits at the start or end of the block.
  Object.assign(result, { syntheticInd: precompLayer.ind });

  // Remap child parent ids before creating composited copies so that
  // matteChildren resolve their parent transforms correctly.
  // Only remap the children; the synthetic precomp layer's parentId is an
  // external reference to the containing composition. For matte precomps the
  // synthetic layer sits at the end of result, so iterate children directly to
  // avoid remapping the synthetic layer with the inner precomp's localMap.
  for (const l of children) {
    if (l.parentId !== undefined) {
      const newParentId = localMap.get(l.parentId);
      if (newParentId !== undefined) {
        l.parentId = newParentId;
      } else if (l.parentId === -1 || l.parentId === undefined) {
        // Children with no explicit parent inside the precomp inherit the
        // synthetic precomp layer's transform.
        l.parentId = precompLayer.ind;
      }
    }
  }

  if (
    precompLayer.isMatte ||
    precompLayer.trackMatte ||
    precompLayer.masks?.length ||
    isNonDefaultBlendMode(precompLayer.blendMode)
  ) {
    // A precomp that participates in a track matte, acts as a matte, has layer
    // masks, or uses group-level blending must render its content as one
    // composited unit. Keep the children in the layer list for transform
    // resolution, but hide them from normal rendering and attach visible copies
    // to the precomp layer for compositing.
    precompLayer.matteChildren = children.map((child) => ({ ...child, visible: true }));
    for (const child of children) {
      child.visible = false;
      child.hiddenByPrecompComposite = true;
    }
  }

  return result;
}

function mergePrecompLayer(
  precomp: LayerDefinition,
  compLayer: LayerDefinition,
  index: number,
  compInds: Set<number>,
): LayerDefinition {
  const precompStartTime = precomp.startTime ?? 0;
  const compLayerStartTime = compLayer.startTime ?? 0;
  // The child's global placement is the precomp instance's start time plus the
  // child's own start time within the precomp. Content (shapes/masks) is
  // authored relative to the child's local timeline, but layer transforms are
  // authored relative to the containing precomp's timeline.
  const startTime = precompStartTime + compLayerStartTime;

  const parentId = compLayer.parentId !== undefined && compInds.has(compLayer.parentId) ? compLayer.parentId : -1;

  // Inherit ancestor precomp opacities so the entire precomp composite fades
  // together when any ancestor precomp layer is animated or set to zero.
  // Each entry records the timing context of the ancestor instance so the
  // opacity animatable is evaluated on the correct frame.
  const groupOpacity = [
    ...(precomp.groupOpacity ?? []),
    {
      opacity: precomp.transform.opacity,
      startTime: precomp.transformStartTime ?? 0,
      stretch: precomp.stretch ?? 1,
    },
  ];

  // For time-remapped precomps, child visibility stays in the source precomp
  // timeline because the remapped parent frame decides which source-frame
  // children are active. Normal precomps are flattened into the parent timeline
  // and clipped to the instance's visible range.
  const isTimeRemapped = (precomp.timeRemap ?? precomp.parentTimeRemap) !== undefined;
  const useSourceWindow = precomp.remappedSourceWindow === true || precomp.timeRemap !== undefined;
  const sourceWindowParentInPoint =
    useSourceWindow && precomp.timeRemap !== undefined && precomp.remappedSourceWindow !== true
      ? precomp.inPoint
      : precomp.sourceWindowParentInPoint;
  const sourceWindowParentOutPoint =
    useSourceWindow && precomp.timeRemap !== undefined && precomp.remappedSourceWindow !== true
      ? precomp.outPoint
      : precomp.sourceWindowParentOutPoint;
  const unclippedInPoint = useSourceWindow
    ? compLayer.inPoint
    : isTimeRemapped
      ? precomp.inPoint
      : Math.max(precomp.inPoint, compLayer.inPoint + precompStartTime);
  const unclippedOutPoint = useSourceWindow
    ? compLayer.outPoint
    : isTimeRemapped
      ? precomp.outPoint
      : Math.min(precomp.outPoint, compLayer.outPoint + precompStartTime);
  const sourceWindowDuration = precomp.outPoint - precomp.inPoint;
  const shouldClipToParentSourceWindow = useSourceWindow && precomp.remappedSourceWindow === true;
  const inPoint = unclippedInPoint;
  const outPoint = shouldClipToParentSourceWindow
    ? Math.min(unclippedOutPoint, sourceWindowDuration)
    : unclippedOutPoint;

  return {
    id: `${precomp.id}-comp-${index}`,
    name: `${precomp.name} > ${compLayer.name}`,
    type: compLayer.type,
    index: precomp.index * 1000 + index,
    ind: compLayer.ind,
    inPoint,
    outPoint,
    refId: compLayer.refId,
    parentId,
    transform: compLayer.transform,
    shapes: compLayer.shapes,
    image: compLayer.image,
    audio: compLayer.audio,
    text: compLayer.text,
    masks: compLayer.masks,
    trackMatte: compLayer.trackMatte,
    isMatte: compLayer.isMatte,
    blendMode: compLayer.blendMode ?? precomp.blendMode,
    startTime,
    transformStartTime: precompStartTime,
    stretch: precomp.stretch,
    // Non-precomp children live on the precomp timeline, so their content
    // must follow the precomp's time remapping. Precomp layers keep their own
    // time remapping and inherit the parent's remapping separately.
    timeRemap: compLayer.timeRemap ?? (compLayer.refId ? undefined : (precomp.timeRemap ?? precomp.parentTimeRemap)),
    // Transforms of precomp children are authored on the precomp timeline,
    // so they must be evaluated using the parent precomp's time remapping.
    parentTimeRemap: precomp.timeRemap ?? precomp.parentTimeRemap,
    parentStartTime: precomp.remappedSourceWindow
      ? precompStartTime - (precomp.transformStartTime ?? 0)
      : precomp.parentStartTime,
    remappedSourceWindow: useSourceWindow,
    sourceWindowParentInPoint,
    sourceWindowParentOutPoint,
    effects: [...(precomp.effects ?? []), ...(compLayer.effects ?? [])],
    groupOpacity,
    isPrecompChildContent: true,
    visible: precomp.visible && compLayer.visible,
  };
}

function parseLayer(
  data: Record<string, unknown>,
  index: number,
  imageAssets: ImageAssets,
  audioAssets: AudioAssets,
  textGlyphs: Record<string, TextGlyph>,
): LayerDefinition {
  const shapes = Array.isArray(data.shapes) ? (data.shapes as unknown[]) : [];
  const layerType = Number(data.ty ?? 2);
  const transform = parseLayerTransform(
    data.ks as Record<string, unknown> | undefined,
    layerType === 1 ? 'destination' : 'segment-start',
  );
  const layerStyle: ShapeStyle = {
    pathTransformScale: 100,
    strokeTransformScale: 100,
    layerTransformScale: transformScalePercent(evaluateTransform(transform, 0)) / 100,
  };
  const type = parseLayerType(layerType);
  const refId = data.refId !== undefined ? String(data.refId) : undefined;
  const ind = Number(data.ind ?? index);
  const rawMasks = Array.isArray(data.masksProperties) ? data.masksProperties : undefined;
  const masks = rawMasks
    ?.filter((mask) => String((mask as Record<string, unknown>).mode ?? '') !== 'n')
    .map((mask) => parseMask(mask as Record<string, unknown>));
  const trackMatte = parseTrackMatte(data.tt);
  const blendMode = parseBlendMode(data.bm);
  const text = layerType === 5 ? parseTextDocument(data.t, rawMasks, textGlyphs) : undefined;
  const stretch = Number(data.sr ?? 1);
  const timeRemap = data.tm !== undefined ? parseAnimatableNumber(data.tm) : undefined;
  const effects = parseEffects(data.ef);
  const threeDRotation =
    data.ddd === 1 ? parseThreeDRotation(data.ks as Record<string, unknown> | undefined) : undefined;
  const image = layerType === 2 && refId ? imageAssets.get(refId) : undefined;
  const audio = layerType === 6 && refId ? parseAudioLayer(data, audioAssets.get(refId)) : undefined;

  const parsedShapes = parseShapeChildren(shapes, layerStyle);
  const layerShapes = layerType === 1 ? buildSolidShapes(data, layerStyle) : parsedShapes;
  applyFillEffect(layerShapes, effects);

  return {
    id: `layer-${index}`,
    name: String(data.nm ?? `Layer ${index}`),
    type,
    index,
    ind,
    inPoint: Number(data.ip ?? 0),
    outPoint: Number(data.op ?? 60),
    startTime: Number(data.st ?? 0),
    refId: layerType === 0 ? refId : undefined,
    parentId: data.parent !== undefined ? Number(data.parent) : undefined,
    transform,
    shapes: layerShapes,
    image,
    audio,
    masks,
    trackMatte,
    isMatte: data.td !== undefined,
    blendMode,
    text,
    stretch,
    timeRemap,
    effects,
    threeDRotation,
    visible: data.hd !== true && layerType !== 3 && layerType !== 6,
  };
}

function parseThreeDRotation(data: Record<string, unknown> | undefined): ThreeDRotation {
  return {
    x: parseAnimatableNumber(data?.rx),
    y: parseAnimatableNumber(data?.ry),
  };
}

function parseAudioLayer(data: Record<string, unknown>, asset: { src: string } | undefined): AudioSource | undefined {
  if (!asset) return undefined;
  const settings = data.au;
  const levels =
    settings && typeof settings === 'object'
      ? parseAnimatableNumber((settings as Record<string, unknown>).lv, 100)
      : 100;

  return {
    src: asset.src,
    inPoint: Number(data.ip ?? 0),
    outPoint: Number(data.op ?? 60),
    startTime: Number(data.st ?? 0),
    levels,
  };
}

function buildSolidShapes(data: Record<string, unknown>, style: ShapeStyle): Shape[] {
  const width = parseNumber(data.sw);
  const height = parseNumber(data.sh);
  const color = parseHexColor(data.sc);

  const rectShape: RectShape = {
    id: generatedShapeId('solid'),
    type: 'rect',
    rect: {
      x: 0,
      y: 0,
      width,
      height,
    },
    position: { x: width / 2, y: height / 2 },
    size: { x: width, y: height },
    cornerRadius: 0,
    fill: { type: 'solid', color },
    stroke: style.stroke,
    trim: style.trim,
  };

  return [rectShape];
}

function parseHexColor(data: unknown): Color {
  const hex = String(data ?? '#000000').replace('#', '');
  const normalized =
    hex.length <= 4
      ? hex
          .split('')
          .map((c) => c + c)
          .join('')
      : hex;
  const int = Number.parseInt(normalized.slice(0, 6), 16) || 0;
  return {
    r: (int >> 16) & 0xff,
    g: (int >> 8) & 0xff,
    b: int & 0xff,
    a: 1,
  };
}

function parseMask(data: Record<string, unknown>): MaskDefinition {
  return {
    path: parseAnimatablePathData(data.pt),
    mode: parseMaskMode(data.mode),
    inverted: data.inv === true,
    opacity: parseAnimatableNumber(data.o),
    expansion: parseNumber(data.x),
  };
}

function parseMaskMode(value: unknown): MaskMode {
  if (value === 's') return 'subtract';
  if (value === 'i') return 'intersect';
  if (value === 'f') return 'difference';
  return 'add';
}

function parseTrackMatte(value: unknown): LayerDefinition['trackMatte'] {
  if (value === 2) return 'alpha-inverted';
  if (value === 4) return 'luma-inverted';
  if (value === 3) return 'luma';
  if (value === 1) return 'alpha';
  return undefined;
}

function parseLayerType(layerType: number): LayerType {
  if (layerType === 0) return 'precomp';
  if (layerType === 1) return 'solid';
  if (layerType === 2) return 'image';
  if (layerType === 4) return 'shape';
  if (layerType === 5) return 'text';
  if (layerType === 6) return 'audio';
  return 'null';
}

function parseEffects(data: unknown): Effect[] {
  if (!Array.isArray(data)) return [];

  const effects: Effect[] = [];
  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    const effect = item as Record<string, unknown>;
    const mn = String(effect.mn ?? '');
    const parsed = parseEffectByMatchName(effect, mn);
    if (parsed) effects.push(parsed);
  }
  return effects;
}

function parseEffectByMatchName(effect: Record<string, unknown>, mn: string): Effect | null {
  if (mn === 'ADBE Fill') {
    return parseFillEffect(effect);
  }
  if (mn === 'ADBE Drop Shadow') {
    return parseDropShadowEffect(effect);
  }
  if (mn === 'ADBE Gaussian Blur 2' || mn === 'ADBE Gaussian Blur') {
    return parseGaussianBlurEffect(effect);
  }
  if (mn === 'ADBE Tint') {
    return parseTintEffect(effect);
  }
  if (mn === 'ADBE Tritone') {
    return parseTritoneEffect(effect);
  }
  return null;
}

function parseFillEffect(effect: Record<string, unknown>): FillEffect | null {
  const color = parseAnimatableShapeColor(findEffectProperty(effect, 'ADBE Fill-0002'));
  const opacity = parseAnimatableFillEffectOpacity(findEffectProperty(effect, 'ADBE Fill-0005'));
  return {
    type: 'fill',
    color,
    opacity,
  };
}

function parseAnimatableFillEffectOpacity(data: unknown): Animatable<number> {
  return parseAnimatable(data, 1, parseFillEffectOpacityValue);
}

function parseFillEffectOpacityValue(data: unknown): number | null {
  const value = parseNumberValue(data);
  if (value === null) return null;
  if (value <= 1) return value;
  // ThorVG treats ADBE Fill opacity as inverse 8-bit transparency for the
  // checked samples: 100 resolves to about 155/255 output alpha.
  return (255 - Math.max(0, Math.min(255, value))) / 255;
}

function parseDropShadowEffect(effect: Record<string, unknown>): DropShadowEffect | null {
  const color = parseAnimatableShapeColor(findEffectProperty(effect, 'ADBE Drop Shadow-0001'));
  const opacity = parseAnimatableEffectAmount(findEffectProperty(effect, 'ADBE Drop Shadow-0002'));
  const angle = parseNumber(findEffectProperty(effect, 'ADBE Drop Shadow-0003'));
  const distance = parseNumber(findEffectProperty(effect, 'ADBE Drop Shadow-0004'));
  const softness = parseNumber(findEffectProperty(effect, 'ADBE Drop Shadow-0005'));
  return {
    type: 'drop-shadow',
    color,
    opacity,
    angle,
    distance,
    softness,
  };
}

function parseGaussianBlurEffect(effect: Record<string, unknown>): GaussianBlurEffect | null {
  const blurriness = parseAnimatableNumber(findEffectProperty(effect, 'ADBE Gaussian Blur 2-0001'));
  return { type: 'gaussian-blur', blurriness };
}

function parseTintEffect(effect: Record<string, unknown>): TintEffect | null {
  const color = parseAnimatableShapeColor(findEffectProperty(effect, 'ADBE Tint-0001'));
  const whiteColorData = findEffectProperty(effect, 'ADBE Tint-0002');
  const whiteColor = whiteColorData === undefined ? undefined : parseAnimatableShapeColor(whiteColorData);
  const amount = parseAnimatableEffectAmount(findEffectProperty(effect, 'ADBE Tint-0003'));
  return { type: 'tint', color, whiteColor, amount };
}

function parseTritoneEffect(effect: Record<string, unknown>): TintEffect | null {
  const color = parseAnimatableShapeColor(findEffectProperty(effect, 'ADBE Tritone-0003'));
  return { type: 'tint', color, amount: 1 };
}

function parseAnimatableEffectAmount(data: unknown): Animatable<number> {
  return parseAnimatable(data, 1, parseEffectAmountValue);
}

function parseEffectAmountValue(data: unknown): number | null {
  const value = parseNumberValue(data);
  if (value === null) return null;
  return normalizeEffectAmount(value);
}

function normalizeEffectAmount(value: number): number {
  if (value <= 1) return value;
  if (value <= 100) return value / 100;
  return value / 255;
}

function findEffectProperty(effect: Record<string, unknown>, matchName: string): unknown {
  const queue: Record<string, unknown>[] = [effect];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;
    if (String(current.mn ?? '') === matchName) {
      return current.v;
    }
    const children = current.ef;
    if (Array.isArray(children)) {
      for (const child of children) {
        if (child && typeof child === 'object') {
          queue.push(child as Record<string, unknown>);
        }
      }
    }
  }
  return undefined;
}

function applyFillEffect(shapes: Shape[], effects: Effect[]): void {
  const fill = effects.find((e): e is FillEffect => e.type === 'fill');
  if (!fill) return;
  const fillColor = fill.color;
  const fillOpacity = scaleEffectOpacityToShapeOpacity(fill.opacity);
  function applyToShape(shape: Shape): void {
    if (shape.type === 'group') {
      for (const child of (shape as GroupShape).children) {
        applyToShape(child);
      }
    } else if (shape.type === 'merge') {
      for (const child of (shape as MergeShape).shapes) {
        applyToShape(child);
      }
    } else {
      shape.fill = { type: 'solid', color: fillColor, opacity: fillOpacity };
    }
  }
  for (const shape of shapes) {
    applyToShape(shape);
  }
}

function scaleEffectOpacityToShapeOpacity(opacity: Animatable<number>): Animatable<number> {
  if (typeof opacity === 'number') {
    return opacity * 100;
  }
  return {
    ...opacity,
    keyframes: opacity.keyframes.map((keyframe) => ({
      ...keyframe,
      value: keyframe.value * 100,
    })),
  };
}

function parseBlendMode(value: unknown): string | undefined {
  const modes: Record<number, string> = {
    0: 'source-over',
    1: 'multiply',
    2: 'screen',
    3: 'overlay',
    4: 'darken',
    5: 'lighten',
    6: 'color-dodge',
    7: 'color-burn',
    8: 'hard-light',
    9: 'soft-light',
    10: 'difference',
    11: 'exclusion',
    12: 'hue',
    13: 'saturation',
    14: 'color',
    15: 'luminosity',
  };
  return modes[Number(value)];
}

function isNonDefaultBlendMode(value: string | undefined): boolean {
  return value !== undefined && value !== 'source-over';
}

function parseTextDocument(
  data: unknown,
  masks?: unknown[],
  glyphs: Record<string, TextGlyph> = {},
): TextDocument | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const record = data as Record<string, unknown>;
  const docData = record.d;
  if (!docData || typeof docData !== 'object') return undefined;
  const docRecord = docData as Record<string, unknown>;
  let value = docRecord.k;
  if (Array.isArray(value) && value.length > 0) {
    value = (value[0] as Record<string, unknown>).s;
  }
  if (!value || typeof value !== 'object') return undefined;
  const doc = value as Record<string, unknown>;
  const animator = parseTextRangeScaleAnimator(record.a);
  const textPath = parseTextPath(record.p, masks);

  return {
    text: String(doc.t ?? ''),
    fontFamily: String(doc.f ?? 'sans-serif'),
    size: parseNumber(doc.s) || 24,
    color: parseColor(doc.fc),
    tracking: parseNumber(doc.tr),
    justification: parseJustification(doc.j),
    lineHeight: parseNumber(doc.lh),
    ...animator,
    textPath,
    ...(Object.keys(glyphs).length > 0 ? { glyphs } : {}),
  };
}

function parseTextGlyphs(data: unknown): Record<string, TextGlyph> {
  const glyphs: Record<string, TextGlyph> = {};
  if (!Array.isArray(data)) return glyphs;

  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    const ch = record.ch;
    if (typeof ch !== 'string' || ch.length === 0) continue;
    const paths = collectGlyphPaths(record.data);
    if (paths.length === 0) continue;
    glyphs[ch] = {
      width: parseNumber(record.w),
      size: parseNumber(record.size) || 100,
      paths,
    };
  }
  return glyphs;
}

function collectGlyphPaths(data: unknown): PathData[] {
  if (!data || typeof data !== 'object') return [];
  const record = data as Record<string, unknown>;
  const shapes = Array.isArray(record.shapes) ? record.shapes : Array.isArray(record.it) ? record.it : [];
  const paths: PathData[] = [];

  for (const item of shapes) {
    if (!item || typeof item !== 'object') continue;
    const shape = item as Record<string, unknown>;
    if (String(shape.ty) === 'sh') {
      const path = parsePathDataValue((shape.ks as Record<string, unknown> | undefined)?.k);
      if (path) paths.push(path);
    } else if (String(shape.ty) === 'gr') {
      paths.push(...collectGlyphPaths(shape));
    }
  }
  return paths;
}

function parseTextPath(data: unknown, masks?: unknown[]): TextDocument['textPath'] | undefined {
  if (!data || typeof data !== 'object' || !Array.isArray(masks) || masks.length === 0) {
    return undefined;
  }
  const record = data as Record<string, unknown>;
  if (record.f === undefined) return undefined;
  const maskIndex = Math.max(0, Number(record.m ?? 0));
  const mask = masks[maskIndex] as Record<string, unknown> | undefined;
  const maskPath = mask?.pt;
  if (maskPath === undefined) return undefined;
  return {
    path: parseAnimatablePathData(maskPath),
    firstMargin: parseAnimatableNumber(record.f),
  };
}

function parseTextRangeScaleAnimator(
  data: unknown,
): Pick<TextDocument, 'rangeSelectorScale' | 'rangeSelectorEnd' | 'rangeSelectorShape'> {
  if (!Array.isArray(data)) return {};
  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    const animator = item as Record<string, unknown>;
    const selector = animator.s;
    const properties = animator.a;
    if (!selector || typeof selector !== 'object' || !properties || typeof properties !== 'object') {
      continue;
    }
    const selectorRecord = selector as Record<string, unknown>;
    const propertiesRecord = properties as Record<string, unknown>;
    if (propertiesRecord.s === undefined || selectorRecord.e === undefined) {
      continue;
    }
    return {
      rangeSelectorScale: parseAnimatablePoint(propertiesRecord.s, { x: 100, y: 100 }),
      rangeSelectorEnd: parseAnimatableNumber(selectorRecord.e, 100),
      rangeSelectorShape: Number(selectorRecord.sh ?? 1),
    };
  }
  return {};
}

function parseJustification(value: unknown): TextDocument['justification'] {
  if (value === 0) return 'left';
  if (value === 1) return 'right';
  return 'center';
}

function parseTransform(
  data: Record<string, unknown> | undefined,
  opacityIncomingTangentSource: IncomingTangentSource = 'segment-start',
): AnimatedTransform {
  const ks = data ?? {};
  return {
    position: parseAnimatablePoint(ks.p),
    anchor: parseAnimatablePoint(ks.a),
    scale: parseAnimatablePoint(ks.s, { x: 100, y: 100 }),
    rotation: parseAnimatableNumber(ks.r, 0),
    opacity: parseAnimatableNumber(ks.o, 100, opacityIncomingTangentSource),
    skew: ks.sk !== undefined ? parseAnimatableNumber(ks.sk, 0) : undefined,
    skewAxis: ks.sa !== undefined ? parseAnimatableNumber(ks.sa, 0) : undefined,
  };
}

function parseLayerTransform(
  data: Record<string, unknown> | undefined,
  opacityIncomingTangentSource: IncomingTangentSource = 'segment-start',
): AnimatedTransform {
  const transform = parseTransform(data, opacityIncomingTangentSource);
  if (transform.skew !== undefined && transform.skewAxis !== undefined) {
    return { ...transform, skewAxis: negateAnimatableNumber(transform.skewAxis) };
  }
  return transform;
}

function negateAnimatableNumber(value: Animatable<number>): Animatable<number> {
  if (!isAnimated(value)) return -value;
  return {
    ...value,
    keyframes: value.keyframes.map((keyframe) => ({
      ...keyframe,
      value: -keyframe.value,
    })),
  };
}

function parseAnimatablePoint(data: unknown, defaultValue: Point = { x: 0, y: 0 }): PointAnimatable {
  if (isSeparateDimensions(data)) {
    const record = data as Record<string, unknown>;
    return {
      x: parseAnimatableNumber(record.x, defaultValue.x),
      y: parseAnimatableNumber(record.y, defaultValue.y),
    } as unknown as PointAnimatable;
  }

  // Multi-dimensional properties (position, scale, anchor, etc.) can specify
  // per-dimension easing curves. Lottie represents these as arrays on the
  // keyframe `i`/`o` objects. Split the property into separate X/Y animatables
  // so each dimension keeps its own bezier timing.
  if (hasPerDimensionEasing(data)) {
    return {
      x: parseAnimatableNumberDimension(data, 0, defaultValue.x),
      y: parseAnimatableNumberDimension(data, 1, defaultValue.y),
    } as unknown as PointAnimatable;
  }

  return parseAnimatable(data, defaultValue, parsePointValue);
}

function isSeparateDimensions(data: unknown): data is Record<string, unknown> {
  return (
    typeof data === 'object' && data !== null && !Array.isArray(data) && (data as Record<string, unknown>).s === true
  );
}

function hasPerDimensionEasing(data: unknown): boolean {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const record = data as Record<string, unknown>;
  if (record.a !== 1) return false;
  const keyframes = Array.isArray(record.k) ? (record.k as unknown[]) : [];
  for (const raw of keyframes) {
    if (!raw || typeof raw !== 'object') continue;
    const kf = raw as Record<string, unknown>;
    for (const key of ['i', 'o']) {
      const tangent = kf[key];
      if (!tangent || typeof tangent !== 'object') continue;
      const tRecord = tangent as Record<string, unknown>;
      if (Array.isArray(tRecord.x) || Array.isArray(tRecord.y)) {
        return true;
      }
    }
  }
  return false;
}

type IncomingTangentSource = 'segment-start' | 'destination';

function parseAnimatableNumber(
  data: unknown,
  defaultValue = 0,
  incomingTangentSource: IncomingTangentSource = 'segment-start',
): Animatable<number> {
  return parseAnimatable(data, defaultValue, parseNumberValue, incomingTangentSource);
}

function parseAnimatableNumberDimension(data: unknown, dimension: number, defaultValue: number): Animatable<number> {
  if (!data || typeof data !== 'object') {
    const parsed = parseDimensionValue(data, dimension);
    return parsed ?? defaultValue;
  }

  const record = data as Record<string, unknown>;
  const animated = record.a === 1;

  if (!animated) {
    const parsed = parseDimensionValue(record.k, dimension);
    return parsed ?? defaultValue;
  }

  const keyframes = Array.isArray(record.k) ? (record.k as unknown[]) : [];
  const expression = typeof record.x === 'string' ? record.x : undefined;

  const parsedKeyframes: Keyframe<number>[] = [];
  let previousRaw: Record<string, unknown> | undefined;
  for (let i = 0; i < keyframes.length; i++) {
    const raw = keyframes[i] as Record<string, unknown>;
    const value = parseDimensionValue(raw.s, dimension);
    if (value !== null) {
      const inTangent = parseSegmentDimensionInTangent(raw, previousRaw, dimension);
      parsedKeyframes.push({
        time: Number(raw.t ?? 0),
        value,
        hold: raw.h === 1,
        outTangent: parseDimensionTangent(raw.o, dimension),
        inTangent,
      });
      previousRaw = raw;
      continue;
    }

    if (i === keyframes.length - 1 && i > 0) {
      const markerPreviousRaw = keyframes[i - 1] as Record<string, unknown>;
      const markerValue = parseDimensionValue(markerPreviousRaw.e, dimension);
      if (markerValue !== null) {
        parsedKeyframes.push({
          time: Number(raw.t ?? 0),
          value: markerValue,
          hold: true,
          outTangent: parseDimensionTangent(raw.o, dimension),
          inTangent: parseSegmentDimensionInTangent(raw, markerPreviousRaw, dimension),
        });
      }
    }
    previousRaw = raw;
  }

  return { keyframes: parsedKeyframes, expression };
}

function parseDimensionValue(data: unknown, dimension: number): number | null {
  if (typeof data === 'number') return data;
  if (Array.isArray(data) && dimension < data.length) {
    const value = data[dimension];
    return typeof value === 'number' ? value : null;
  }
  return null;
}

function parseDimensionTangent(data: unknown, dimension: number): Point | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const record = data as Record<string, unknown>;
  const xValue = Array.isArray(record.x) ? record.x[dimension] : record.x;
  const yValue = Array.isArray(record.y) ? record.y[dimension] : record.y;
  if (typeof xValue === 'number' && typeof yValue === 'number') {
    return { x: xValue, y: yValue };
  }
  return undefined;
}

function parseSegmentDimensionInTangent(
  data: Record<string, unknown>,
  previousData: Record<string, unknown> | undefined,
  dimension: number,
): Point | undefined {
  return previousData
    ? (parseDimensionTangent(previousData.i, dimension) ?? parseDimensionTangent(data.i, dimension))
    : parseDimensionTangent(data.i, dimension);
}

function isAnimatedPoint(value: PointAnimatable): boolean {
  // Static points are plain {x, y} numbers. Separate-dimension points are
  // {x, y} where each component is either a number or an AnimatedProperty.
  // Only return true when a component actually has keyframes.
  if (typeof value !== 'object' || value === null) return false;
  if ('x' in value && 'y' in value) {
    const separate = value as SeparatePointAnimatable;
    return (
      (typeof separate.x === 'object' && separate.x !== null && 'keyframes' in separate.x) ||
      (typeof separate.y === 'object' && separate.y !== null && 'keyframes' in separate.y)
    );
  }
  return 'keyframes' in value;
}

function isAnimatedTransform(animated: AnimatedTransform): boolean {
  return (
    isAnimatedPoint(animated.position) ||
    isAnimatedPoint(animated.anchor) ||
    isAnimatedPoint(animated.scale) ||
    isAnimated(animated.rotation) ||
    isAnimated(animated.opacity) ||
    (animated.skew !== undefined && isAnimated(animated.skew)) ||
    (animated.skewAxis !== undefined && isAnimated(animated.skewAxis))
  );
}

function parseAnimatable<T>(
  data: unknown,
  defaultValue: T,
  parseStatic: (value: unknown) => T | null,
  incomingTangentSource: IncomingTangentSource = 'segment-start',
): Animatable<T> {
  if (!data || typeof data !== 'object') {
    const parsed = parseStatic(data);
    return parsed ?? defaultValue;
  }

  const record = data as Record<string, unknown>;
  const animated = record.a === 1;

  if (!animated) {
    const parsed = parseStatic(record.k);
    return parsed ?? defaultValue;
  }

  const keyframes = Array.isArray(record.k) ? (record.k as unknown[]) : [];
  const expression = typeof record.x === 'string' ? record.x : undefined;

  const parsedKeyframes: Keyframe<T>[] = [];
  let previousRaw: Record<string, unknown> | undefined;
  for (let i = 0; i < keyframes.length; i++) {
    const raw = keyframes[i] as Record<string, unknown>;
    const parsed = parseKeyframe(raw, previousRaw, parseStatic, incomingTangentSource);
    if (parsed !== null) {
      parsedKeyframes.push(parsed);
      previousRaw = raw;
      continue;
    }

    // Lottie often ends animated properties with a marker keyframe that has no
    // value of its own. Use the preceding keyframe's end value (e) so the
    // property holds correctly past the preceding keyframe.
    if (i === keyframes.length - 1 && i > 0) {
      const markerPreviousRaw = keyframes[i - 1] as Record<string, unknown>;
      const markerValue = parseStatic(markerPreviousRaw.e);
      if (markerValue !== null) {
        parsedKeyframes.push({
          time: Number(raw.t ?? 0),
          value: markerValue,
          hold: true,
          outTangent: parseTangent(raw.o),
          inTangent: parseSegmentInTangent(raw, markerPreviousRaw, incomingTangentSource),
        });
      }
    }
    previousRaw = raw;
  }

  return {
    keyframes: parsedKeyframes,
    expression,
  };
}

function parseKeyframe<T>(
  data: Record<string, unknown>,
  previousData: Record<string, unknown> | undefined,
  parseStatic: (value: unknown) => T | null,
  incomingTangentSource: IncomingTangentSource,
): Keyframe<T> | null {
  const time = Number(data.t ?? 0);
  const value = parseStatic(data.s);
  if (value === null) return null;

  return {
    time,
    value,
    hold: data.h === 1,
    outTangent: parseTangent(data.o),
    inTangent: parseSegmentInTangent(data, previousData, incomingTangentSource),
    to: parsePointValue(data.to) ?? undefined,
    ti: parsePointValue(data.ti) ?? undefined,
  };
}

function parseSegmentInTangent(
  data: Record<string, unknown>,
  previousData: Record<string, unknown> | undefined,
  incomingTangentSource: IncomingTangentSource = 'segment-start',
): Point | undefined {
  if (incomingTangentSource === 'destination') {
    return parseTangent(data.i) ?? (previousData ? parseTangent(previousData.i) : undefined);
  }
  return previousData ? (parseTangent(previousData.i) ?? parseTangent(data.i)) : parseTangent(data.i);
}

function parseTangent(data: unknown): Point | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const record = data as Record<string, unknown>;
  const x = Array.isArray(record.x) ? record.x[0] : record.x;
  const y = Array.isArray(record.y) ? record.y[0] : record.y;
  if (typeof x === 'number' && typeof y === 'number') {
    return { x, y };
  }
  return undefined;
}

function parsePointValue(data: unknown): Point | null {
  if (Array.isArray(data) && data.length >= 2) {
    return { x: Number(data[0] ?? 0), y: Number(data[1] ?? 0) };
  }
  return null;
}

function parseNumberValue(data: unknown): number | null {
  if (typeof data === 'number') return data;
  if (Array.isArray(data) && data.length >= 1) {
    return Number(data[0]);
  }
  return null;
}

function parseNumber(data: unknown): number {
  if (typeof data === 'number') return data;
  if (data && typeof data === 'object' && 'k' in data) {
    return parseNumber((data as Record<string, unknown>).k);
  }
  return 0;
}

type ShapeStyle = {
  fill?: Fill;
  stroke?: Stroke[];
  trim?: TrimPath;
  cornerRadius?: Animatable<number>;
  offset?: Animatable<number>;
  offsetLineJoin?: 'miter' | 'round' | 'bevel';
  offsetMiterLimit?: number;
  /**
   * Combined scale (percent) of all ancestor group transforms that apply to the
   * path geometry. Used to compensate stroke width so strokes defined in an
   * ancestor group are not scaled by descendant group transforms.
   */
  pathTransformScale: number;
  /**
   * Combined scale (percent) of ancestor group transforms that own the current
   * stroke. When a stroke is defined in a group, this is updated to match
   * `pathTransformScale`; inherited strokes keep the owning groups' scale.
   */
  strokeTransformScale: number;
  /**
   * Static layer transform scale as a factor. Used only for parent-level
   * gradient-group strokes that would otherwise be inflated by huge layer
   * transforms after being attached to child paths.
   */
  layerTransformScale: number;
};

function parseMergeMode(value: unknown): MergeShape['mode'] {
  const mode = Number(value);
  if (mode === 2) return 'add';
  if (mode === 3) return 'subtract';
  if (mode === 4) return 'intersect';
  if (mode === 5) return 'exclude';
  return 'merge';
}

function transformScalePercent(transform: Transform | undefined): number {
  if (!transform) return 100;
  const sx = transform.scale.x;
  const sy = transform.scale.y;
  return (Math.abs(sx) + Math.abs(sy)) / 2;
}

function strokeWidthScaleFromStyle(style: ShapeStyle): number | undefined {
  if (!style.stroke || style.stroke.length === 0) return undefined;
  const scale = style.pathTransformScale / style.strokeTransformScale;
  return Math.abs(scale - 1) < 0.001 ? undefined : scale;
}

function isPrimitiveShape(shape: Shape): shape is RectShape | EllipseShape | PathShape | PolystarShape {
  return shape.type === 'rect' || shape.type === 'ellipse' || shape.type === 'path' || shape.type === 'polystar';
}

function canCoalescePrimitive(shape: Shape): boolean {
  return isPrimitiveShape(shape) && !shape.trim && (shape.fill !== undefined || shape.stroke !== undefined);
}

function coalesceGroupPrimitives(children: Shape[]): Shape[] {
  if (children.length < 2) return children;

  const result: Shape[] = [];
  let run: Shape[] = [];
  let runFill: Fill | undefined;
  let runStroke: Stroke | Stroke[] | undefined;
  let runTransform: Transform | undefined;
  let runStrokeWidthScale: number | undefined;

  function flushRun() {
    if (run.length <= 1) {
      result.push(...run);
      run = [];
      return;
    }
    result.push({
      id: generatedShapeId('merge'),
      type: 'merge',
      mode: 'merge',
      shapes: run,
      fill: runFill,
      stroke: runStroke,
      trim: undefined,
      transform: runTransform,
      strokeWidthScale: runStrokeWidthScale,
    } as MergeShape);
    run = [];
  }

  for (const child of children) {
    if (canCoalescePrimitive(child)) {
      const primitive = child as RectShape | EllipseShape | PathShape | PolystarShape;
      if (
        run.length > 0 &&
        (primitive.fill !== runFill ||
          primitive.stroke !== runStroke ||
          primitive.transform !== runTransform ||
          primitive.strokeWidthScale !== runStrokeWidthScale)
      ) {
        flushRun();
      }
      if (run.length === 0) {
        runFill = primitive.fill;
        runStroke = primitive.stroke;
        runTransform = primitive.transform;
        runStrokeWidthScale = primitive.strokeWidthScale;
      }
      run.push(child);
      continue;
    }

    flushRun();
    result.push(child);
  }
  flushRun();
  return result;
}

function applyFillToShape(shape: Shape, fill: Fill): void {
  if (shape.type === 'group') {
    for (const child of (shape as unknown as GroupShape).children) {
      applyFillToShape(child, fill);
    }
  } else {
    (shape as unknown as { fill?: Fill }).fill = fill;
  }
}

function applyFillToUnfilledShape(shape: Shape, fill: Fill): void {
  if (shape.type === 'group') {
    for (const child of (shape as unknown as GroupShape).children) {
      applyFillToUnfilledShape(child, fill);
    }
  } else if (shape.fill === undefined) {
    (shape as unknown as { fill?: Fill }).fill = fill;
  }
}

function applyPaintOrderToShape(shape: Shape, paintOrder: Shape['paintOrder']): void {
  if (shape.type === 'group') {
    for (const child of (shape as unknown as GroupShape).children) {
      applyPaintOrderToShape(child, paintOrder);
    }
    return;
  }
  if (shape.type === 'merge') {
    const merge = shape as MergeShape;
    for (const child of merge.shapes) {
      applyPaintOrderToShape(child, paintOrder);
    }
  }
  (shape as unknown as { paintOrder?: Shape['paintOrder'] }).paintOrder = paintOrder;
}

function applyStrokeToShape(
  shape: Shape,
  stroke: Stroke,
  options: { strokeWidthScale?: number; compensateGroupScale?: boolean } = {},
): void {
  if (shape.type === 'group') {
    const group = shape as GroupShape;
    const groupScale =
      options.compensateGroupScale === false || group.transform === undefined
        ? 1
        : transformScalePercent(group.transform) / 100;
    const inheritedWidthScale = (options.strokeWidthScale ?? 1) * groupScale;
    for (const child of (shape as unknown as GroupShape).children) {
      applyStrokeToShape(child, stroke, {
        ...options,
        strokeWidthScale: inheritedWidthScale,
      });
    }
  } else {
    const renderable = shape as unknown as {
      stroke?: Stroke | Stroke[];
      strokeWidthScale?: number;
    };
    const existing = renderable.stroke ?? [];
    renderable.stroke = [...(Array.isArray(existing) ? existing : [existing]), stroke];
    const { strokeWidthScale } = options;
    if (strokeWidthScale !== undefined && strokeWidthScale > 1) {
      renderable.strokeWidthScale =
        renderable.strokeWidthScale !== undefined
          ? Math.max(renderable.strokeWidthScale, strokeWidthScale)
          : strokeWidthScale;
    }
  }
}

function parentGradientStrokeWidthScale(style: ShapeStyle, group: GroupShape): number {
  const groupScale = group.transform === undefined ? 1 : transformScalePercent(group.transform) / 100;
  const layerScale = style.layerTransformScale;
  if (groupScale > 1) {
    return Math.min(groupScale, MAX_PARENT_GRADIENT_STROKE_WIDTH_SCALE);
  }
  return Math.min(layerScale, MAX_PARENT_GRADIENT_STROKE_WIDTH_SCALE);
}

function hasGradientFill(shape: Shape): boolean {
  if (shape.fill?.type === 'gradient') return true;
  if (shape.type === 'merge' && (shape as MergeShape).fill?.type === 'gradient') return true;
  if (shape.type === 'group') {
    return (shape as GroupShape).children.some((child) => hasGradientFill(child));
  }
  if (shape.type === 'merge') {
    return (shape as MergeShape).shapes.some((child) => hasGradientFill(child));
  }
  return false;
}

function applyTrimToShape(shape: Shape, trim: TrimPath): void {
  if (shape.type === 'group') {
    for (const child of (shape as unknown as GroupShape).children) {
      applyTrimToShape(child, trim);
    }
  } else {
    const target = shape as unknown as { trim?: TrimPath; trims?: TrimPath[] };
    if (target.trim && isIdentityTrimPath(trim)) {
      return;
    }
    if (target.trim) {
      target.trims = [...(target.trims ?? [target.trim]), trim];
    }
    target.trim = trim;
  }
}

function applyOffsetToShape(
  shape: Shape,
  offset: Animatable<number>,
  lineJoin?: 'miter' | 'round' | 'bevel',
  miterLimit?: number,
): void {
  if (shape.type === 'group') {
    for (const child of (shape as unknown as GroupShape).children) {
      applyOffsetToShape(child, offset, lineJoin, miterLimit);
    }
  } else if (shape.type === 'rect' || shape.type === 'ellipse' || shape.type === 'polystar' || shape.type === 'path') {
    Object.assign(shape as unknown as { offset?: Animatable<number> }, {
      offset,
      ...(lineJoin !== undefined ? { offsetLineJoin: lineJoin } : {}),
      ...(miterLimit !== undefined ? { offsetMiterLimit: miterLimit } : {}),
    });
  }
}

function parseOffsetLineJoin(value: unknown): 'miter' | 'round' | 'bevel' | undefined {
  if (value === 1) return 'miter';
  if (value === 2) return 'round';
  if (value === 3) return 'bevel';
  return undefined;
}

function isIdentityTrimPath(trim: TrimPath): boolean {
  return isStaticNumber(trim.start, 0) && isStaticNumber(trim.end, 100) && isStaticNumber(trim.offset, 0);
}

function isStaticNumber(value: Animatable<number>, expected: number): boolean {
  return typeof value === 'number' && Math.abs(value - expected) < 1e-6;
}

function applyCornerRadiusToShape(shape: Shape, cornerRadius: Animatable<number>): void {
  if (shape.type === 'group') {
    for (const child of (shape as unknown as GroupShape).children) {
      applyCornerRadiusToShape(child, cornerRadius);
    }
  } else if (shape.type === 'rect' || shape.type === 'path' || shape.type === 'polystar') {
    (shape as unknown as { cornerRadius?: Animatable<number> }).cornerRadius = cornerRadius;
    if (shape.type === 'polystar') {
      const polystar = shape as PolystarShape;
      polystar.animatedProperties = {
        ...(polystar.animatedProperties ?? {}),
        cornerRadius,
      };
    }
  }
}

/**
 * Parse a list of shape items in declaration order. Style modifiers (fills,
 * strokes, trims, rounded corners) apply to the run of preceding primitive
 * shapes, matching After Effects/Lottie rendering semantics. This prevents a
 * stroke placed before a rectangle from stroking that rectangle, while still
 * allowing multiple modifiers to apply to the same primitive when they appear
 * consecutively.
 */
function parseShapeChildren(children: unknown[], style: ShapeStyle): Shape[] {
  const result: Shape[] = [];
  const run: Shape[] = [];
  let runFill: Fill | undefined;
  const runStroke: Stroke[] = [];
  let runStyled = false;
  const currentStyle: ShapeStyle = {
    ...style,
    stroke: style.stroke ? [...style.stroke] : undefined,
  };
  const hasInheritedStroke = (currentStyle.stroke?.length ?? 0) > 0;

  function resetRun() {
    run.length = 0;
    runFill = undefined;
    runStroke.length = 0;
    runStyled = false;
  }

  function effectiveStroke(): Stroke[] {
    return [...(currentStyle.stroke ?? []), ...runStroke];
  }

  function effectiveStrokeTransformScale(): number {
    if (hasInheritedStroke) {
      return currentStyle.strokeTransformScale;
    }
    return runStroke.length > 0 ? currentStyle.pathTransformScale : currentStyle.strokeTransformScale;
  }

  for (const child of children) {
    const childRecord = child as Record<string, unknown>;
    const childType = String(childRecord.ty);

    if (childType === 'gr') {
      if (runStyled) resetRun();
      const shapes = parseShape(childRecord, currentStyle);
      result.push(...shapes);
      run.push(...shapes);
      continue;
    }

    if (childType === 'rc') {
      if (runStyled) resetRun();
      const shape = parseRectShape(childRecord, currentStyle);
      result.push(shape);
      run.push(shape);
      continue;
    }

    if (childType === 'el') {
      if (runStyled) resetRun();
      const shape = parseEllipseShape(childRecord, currentStyle);
      result.push(shape);
      run.push(shape);
      continue;
    }

    if (childType === 'sh') {
      if (runStyled) resetRun();
      const shape = parsePathShape(childRecord, currentStyle);
      result.push(shape);
      run.push(shape);
      continue;
    }

    if (childType === 'sr') {
      if (runStyled) resetRun();
      const shape = parsePolystarShape(childRecord, currentStyle);
      result.push(shape);
      run.push(shape);
      continue;
    }

    if (childType === 'mm') {
      if (runStyled) resetRun();
      const operands: Shape[] = [];
      while (result.length > 0) {
        const last = result[result.length - 1];
        if (
          last.type === 'rect' ||
          last.type === 'ellipse' ||
          last.type === 'path' ||
          last.type === 'polystar' ||
          last.type === 'group' ||
          last.type === 'merge'
        ) {
          operands.unshift(last);
          result.pop();
        } else {
          break;
        }
      }
      if (operands.length > 0) {
        const mergeStroke = effectiveStroke();
        const merge: MergeShape = {
          id: generatedShapeId('merge'),
          type: 'merge',
          mode: parseMergeMode(childRecord.mm),
          shapes: operands,
          fill: runFill ?? currentStyle.fill,
          stroke: mergeStroke.length > 0 ? mergeStroke : undefined,
          trim: currentStyle.trim,
          offset: currentStyle.offset,
          transform: undefined,
          strokeWidthScale: strokeWidthScaleFromStyle({
            pathTransformScale: currentStyle.pathTransformScale,
            strokeTransformScale: effectiveStrokeTransformScale(),
            layerTransformScale: currentStyle.layerTransformScale,
          }),
        } as MergeShape;
        run.length = 0;
        result.push(merge);
        run.push(merge);
      }
      continue;
    }

    if (childType === 'fl') {
      const fill = parseFill(childRecord);
      runFill = fill;
      for (const shape of run) {
        if (shape.type === 'group') {
          applyFillToUnfilledShape(shape, fill);
        } else {
          applyFillToShape(shape, fill);
        }
        if (runStroke.length > 0) {
          applyPaintOrderToShape(shape, 'fill-stroke');
        }
      }
      runStyled = true;
      continue;
    }

    if (childType === 'gf') {
      const fill = parseGradientFill(childRecord);
      runFill = fill;
      for (const shape of run) {
        if (shape.type === 'group') {
          applyFillToUnfilledShape(shape, fill);
        } else {
          applyFillToShape(shape, fill);
        }
      }
      runStyled = true;
      continue;
    }

    if (childType === 'st') {
      const stroke = parseStroke(childRecord);
      if (!hasInheritedStroke) {
        currentStyle.strokeTransformScale = currentStyle.pathTransformScale;
      }
      runStroke.push(stroke);
      for (const shape of run) {
        if (shape.type === 'group' && hasGradientFill(shape)) {
          const group = shape as GroupShape;
          applyStrokeToShape(shape, stroke, {
            strokeWidthScale: parentGradientStrokeWidthScale(currentStyle, group),
            compensateGroupScale: false,
          });
          continue;
        }
        applyStrokeToShape(shape, stroke);
      }
      runStyled = true;
      continue;
    }

    if (childType === 'gs') {
      const stroke = parseGradientStroke(childRecord);
      if (!hasInheritedStroke) {
        currentStyle.strokeTransformScale = currentStyle.pathTransformScale;
      }
      runStroke.push(stroke);
      for (const shape of run) {
        if (shape.type === 'group' && hasGradientFill(shape)) {
          const group = shape as GroupShape;
          applyStrokeToShape(shape, stroke, {
            strokeWidthScale: parentGradientStrokeWidthScale(currentStyle, group),
            compensateGroupScale: false,
          });
          continue;
        }
        applyStrokeToShape(shape, stroke);
      }
      runStyled = true;
      continue;
    }

    if (childType === 'tm') {
      const trim = parseTrimPath(childRecord);
      currentStyle.trim = trim;
      for (const shape of run) {
        applyTrimToShape(shape, trim);
      }
      continue;
    }

    if (childType === 'op') {
      const offset = parseAnimatableNumber(childRecord.a);
      const lineJoin = parseOffsetLineJoin(childRecord.lj);
      const miterLimit = parseNumber(childRecord.ml);
      currentStyle.offset = offset;
      currentStyle.offsetLineJoin = lineJoin;
      currentStyle.offsetMiterLimit = miterLimit;
      for (const shape of run) {
        applyOffsetToShape(shape, offset, lineJoin, miterLimit);
      }
      continue;
    }

    if (childType === 'rd') {
      const cornerRadius = parseAnimatableNumber(childRecord.r);
      currentStyle.cornerRadius = cornerRadius;
      for (const shape of run) {
        applyCornerRadiusToShape(shape, cornerRadius);
      }
    }

    if (childType === 'rp') {
      const copies = repeatShapes(run, childRecord);
      result.push(...copies);
      run.push(...copies);
      runStyled = true;
    }

    // Transforms are handled at the group level before iterating children.
    // Other unsupported modifiers are ignored.
  }

  return result;
}

function repeatShapes(shapes: Shape[], data: Record<string, unknown>): Shape[] {
  const count = Math.max(0, Math.floor(parseNumber(data.c)));
  if (count <= 1 || shapes.length === 0 || !data.tr || typeof data.tr !== 'object') return [];

  const transform = evaluateTransform(parseTransform(data.tr as Record<string, unknown>), 0);
  const copies: Shape[] = [];
  for (let index = 1; index < count; index++) {
    for (const shape of shapes) {
      copies.push(cloneShapeWithRepeaterTransform(shape, transform, index));
    }
  }
  return copies;
}

function cloneShapeWithRepeaterTransform(shape: Shape, transform: Transform, index: number): Shape {
  const clone = JSON.parse(JSON.stringify(shape)) as Shape;
  const original = clone.transform ?? identityTransform();
  clone.id = generatedShapeId(`${shape.type}-repeat`);
  clone.transform = {
    position: {
      x: original.position.x + transform.position.x * index,
      y: original.position.y + transform.position.y * index,
    },
    anchor: original.anchor,
    scale: {
      x: original.scale.x * (transform.scale.x / 100) ** index,
      y: original.scale.y * (transform.scale.y / 100) ** index,
    },
    rotation: original.rotation + transform.rotation * index,
    opacity: original.opacity * (transform.opacity / 100) ** index,
  };
  return clone;
}

function identityTransform(): Transform {
  return {
    position: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 },
    scale: { x: 100, y: 100 },
    rotation: 0,
    opacity: 100,
  };
}

function parseShape(
  data: Record<string, unknown>,
  style: ShapeStyle = {
    pathTransformScale: 100,
    strokeTransformScale: 100,
    layerTransformScale: 1,
  },
): Shape[] {
  const type = String(data.ty);

  if (type === 'gr') {
    // Shape group: flatten children recursively, applying group-level styles.
    const children = Array.isArray(data.it) ? (data.it as unknown[]) : [];
    const groupStyle: ShapeStyle = {
      ...style,
      stroke: style.stroke ? [...style.stroke] : undefined,
    };
    let groupTransform: AnimatedTransform | undefined;
    for (const child of children) {
      const childRecord = child as Record<string, unknown>;
      if (String(childRecord.ty) === 'tr') {
        groupTransform = parseShapeTransform(childRecord);
        break;
      }
    }
    const groupStaticTransform = groupTransform ? evaluateTransform(groupTransform, 0) : undefined;
    const groupScale = transformScalePercent(groupStaticTransform);

    if (groupTransform && isAnimatedTransform(groupTransform)) {
      // The animated group transform is applied at runtime, so it does not
      // contribute to the static path scale. Children are parsed without the
      // group transform baked in; the group shape applies it.
      const groupChildren = parseShapeChildren(children, groupStyle);
      return [
        {
          id: generatedShapeId('group'),
          type: 'group',
          children: coalesceGroupPrimitives(groupChildren),
          transform: groupStaticTransform,
          animatedTransform: groupTransform,
        } as GroupShape,
      ];
    }

    // Static group transform: bake it into the path scale tracking. Strokes
    // defined in this group scale with it; inherited strokes do not.
    groupStyle.pathTransformScale *= groupScale / 100;
    const groupChildren = parseShapeChildren(children, groupStyle);

    return [
      {
        id: generatedShapeId('group'),
        type: 'group',
        children: coalesceGroupPrimitives(groupChildren),
        transform: groupStaticTransform,
      } as GroupShape,
    ];
  }

  if (type === 'rc') {
    return [parseRectShape(data, style)];
  }

  if (type === 'el') {
    return [parseEllipseShape(data, style)];
  }

  if (type === 'sh') {
    return [parsePathShape(data, style)];
  }

  if (type === 'sr') {
    return [parsePolystarShape(data, style)];
  }

  // Style modifiers (fl, gf, st, gs, tm, rd) are collected in a first pass
  // before primitives are created, so by the time we reach them here the style
  // has already been applied. Ignore them to avoid duplicating strokes or
  // re-applying fills.
  if (
    type === 'fl' ||
    type === 'gf' ||
    type === 'st' ||
    type === 'gs' ||
    type === 'tm' ||
    type === 'op' ||
    type === 'rd'
  ) {
    return [];
  }

  if (type === 'mm') {
    // Merge path modifier is handled inside groups, not as a top-level shape.
    return [];
  }

  // Unsupported shape types are silently ignored in Phase 1.
  return [];
}

function parseShapeTransform(data: Record<string, unknown>): AnimatedTransform {
  const transform = parseTransform(data);
  if (transform.skew !== undefined && transform.skewAxis !== undefined) {
    return { ...transform, skewAxis: negateAnimatableNumber(transform.skewAxis) };
  }
  return transform;
}

function evaluateTransform(animated: AnimatedTransform, frame: number): Transform {
  return {
    position: evaluatePoint(animated.position, frame),
    anchor: evaluatePoint(animated.anchor, frame),
    scale: evaluatePoint(animated.scale, frame),
    rotation: evaluateAnimatable(animated.rotation, frame),
    opacity: evaluateAnimatable(animated.opacity, frame),
    skew: animated.skew !== undefined ? evaluateAnimatable(animated.skew, frame) : 0,
    skewAxis: animated.skewAxis !== undefined ? evaluateAnimatable(animated.skewAxis, frame) : 0,
  };
}

function parseRectShape(data: Record<string, unknown>, style: ShapeStyle, transform?: Transform): RectShape {
  const position = parseAnimatablePoint(data.p);
  const size = parseAnimatablePoint(data.s);
  const cornerRadius = style.cornerRadius !== undefined ? style.cornerRadius : parseAnimatableNumber(data.r);

  const staticPosition = evaluatePoint(position, 0);
  const staticSize = evaluatePoint(size, 0);

  return {
    id: generatedShapeId('rect'),
    type: 'rect',
    rect: {
      x: staticPosition.x - staticSize.x / 2,
      y: staticPosition.y - staticSize.y / 2,
      width: staticSize.x,
      height: staticSize.y,
    },
    position,
    size,
    cornerRadius,
    fill: style.fill,
    stroke: style.stroke,
    trim: style.trim,
    offset: style.offset,
    offsetLineJoin: style.offsetLineJoin,
    offsetMiterLimit: style.offsetMiterLimit,
    transform,
    strokeWidthScale: strokeWidthScaleFromStyle(style),
  };
}

function parseEllipseShape(data: Record<string, unknown>, style: ShapeStyle, transform?: Transform): EllipseShape {
  return {
    id: generatedShapeId('ellipse'),
    type: 'ellipse',
    center: parseAnimatablePoint(data.p),
    radius: parseAnimatablePoint(data.s),
    fill: style.fill,
    stroke: style.stroke,
    trim: style.trim,
    offset: style.offset,
    offsetLineJoin: style.offsetLineJoin,
    offsetMiterLimit: style.offsetMiterLimit,
    transform,
    strokeWidthScale: strokeWidthScaleFromStyle(style),
  };
}

function parsePathShape(data: Record<string, unknown>, style: ShapeStyle, transform?: Transform): PathShape {
  const pathData = parseAnimatablePathData(data.ks);

  return {
    id: generatedShapeId('path'),
    type: 'path',
    path: pathData,
    fill: style.fill,
    stroke: style.stroke,
    trim: style.trim,
    offset: style.offset,
    offsetLineJoin: style.offsetLineJoin,
    offsetMiterLimit: style.offsetMiterLimit,
    transform,
    strokeWidthScale: strokeWidthScaleFromStyle(style),
    cornerRadius: style.cornerRadius,
  };
}

function parsePolystarShape(data: Record<string, unknown>, style: ShapeStyle, transform?: Transform): PolystarShape {
  const center = parseAnimatablePoint(data.p);
  const points = parseAnimatableNumber(data.pt);
  const outerRadius = parseAnimatableNumber(data.or);
  const innerRadius = parseAnimatableNumber(data.ir);
  const outerRoundness = parseAnimatableNumber(data.os);
  const innerRoundness = parseAnimatableNumber(data.is);
  const rotation = parseAnimatableNumber(data.r);
  const cornerRadius = style.cornerRadius;

  return {
    id: generatedShapeId('polystar'),
    type: 'polystar',
    center: evaluatePoint(center, 0),
    starType: Number(data.sy) === 2 ? 'polygon' : 'star',
    points: evaluateAnimatable(points, 0),
    outerRadius: evaluateAnimatable(outerRadius, 0),
    innerRadius: evaluateAnimatable(innerRadius, 0),
    outerRoundness: evaluateAnimatable(outerRoundness, 0),
    innerRoundness: evaluateAnimatable(innerRoundness, 0),
    rotation: evaluateAnimatable(rotation, 0),
    cornerRadius,
    animatedProperties: {
      center,
      points,
      outerRadius,
      innerRadius,
      outerRoundness,
      innerRoundness,
      rotation,
      ...(cornerRadius !== undefined ? { cornerRadius } : {}),
    },
    fill: style.fill,
    stroke: style.stroke,
    trim: style.trim,
    offset: style.offset,
    offsetLineJoin: style.offsetLineJoin,
    offsetMiterLimit: style.offsetMiterLimit,
    transform,
    strokeWidthScale: strokeWidthScaleFromStyle(style),
  };
}

function parseAnimatablePathData(data: unknown): Animatable<PathData> {
  return parseAnimatable(data, emptyPathData(), parsePathDataValue);
}

function parsePathDataValue(data: unknown): PathData | null {
  // Animated path keyframes wrap the shape in an array.
  if (Array.isArray(data) && data.length > 0) {
    return parsePathDataValue(data[0]);
  }
  if (!data || typeof data !== 'object') return null;

  const record = data as Record<string, unknown>;
  const vertices = parsePointArray(record.v);
  const inTangents = parsePointArray(record.i);
  const outTangents = parsePointArray(record.o);
  const closed = record.c === true;

  if (vertices.length === 0) return null;

  return { vertices, inTangents, outTangents, closed };
}

function parsePointArray(data: unknown): Point[] {
  if (!Array.isArray(data)) return [];
  return data
    .map((item) => {
      if (Array.isArray(item) && item.length >= 2) {
        return { x: Number(item[0] ?? 0), y: Number(item[1] ?? 0) };
      }
      return null;
    })
    .filter((p): p is Point => p !== null);
}

function emptyPathData(): PathData {
  return { vertices: [], inTangents: [], outTangents: [], closed: false };
}

function parseFill(data: Record<string, unknown>): Fill {
  const rule = Number(data.r) === 2 ? 'evenodd' : 'nonzero';
  return {
    type: 'solid',
    color: parseAnimatableShapeColor(data.c),
    opacity: parseAnimatableNumber(data.o, 100),
    fillRule: rule,
  };
}

function parseGradientFill(data: Record<string, unknown>): GradientFill {
  const rule = Number(data.r) === 2 ? 'evenodd' : 'nonzero';
  return {
    type: 'gradient',
    gradientType: Number(data.t) === 2 ? 'radial' : 'linear',
    start: parseAnimatablePoint(data.s),
    end: parseAnimatablePoint(data.e),
    colors: parseAnimatableGradient(data.g),
    highlightLength: Number(data.h ?? 0) || undefined,
    highlightAngle: Number(data.a ?? 0) || undefined,
    opacity: parseAnimatableNumber(data.o, 100),
    fillRule: rule,
  };
}

function parseAnimatableGradient(data: unknown): Animatable<ColorStop[]> {
  if (!data || typeof data !== 'object') {
    return [];
  }

  const record = data as Record<string, unknown>;
  // Gradient colors are sometimes wrapped in an extra object: g.k = { a, k }.
  const inner: Record<string, unknown> =
    !Array.isArray(record.k) && record.k && typeof record.k === 'object'
      ? (record.k as Record<string, unknown>)
      : record;
  const stopCount = Number(record.p ?? 0);
  return parseAnimatable(inner, [], (value) => parseGradientStops(value, stopCount));
}

interface RawColorStop {
  offset: number;
  r: number;
  g: number;
  b: number;
}

interface RawAlphaStop {
  offset: number;
  a: number;
}

function parseSeparateStops(
  values: unknown[],
  stopCount: number,
): { colors: RawColorStop[]; alphas: RawAlphaStop[] } | null {
  if (values.length < stopCount * 4) return null;
  const colors: RawColorStop[] = [];
  for (let i = 0; i < stopCount; i++) {
    const base = i * 4;
    const offset = Number(values[base]);
    if (!Number.isFinite(offset)) continue;
    colors.push({
      offset,
      r: Number(values[base + 1]) * 255,
      g: Number(values[base + 2]) * 255,
      b: Number(values[base + 3]) * 255,
    });
  }
  const alphas: RawAlphaStop[] = [];
  for (let i = stopCount * 4; i < values.length - 1; i += 2) {
    const offset = Number(values[i]);
    if (!Number.isFinite(offset)) continue;
    alphas.push({
      offset,
      a: Number(values[i + 1]),
    });
  }
  return { colors, alphas };
}

function parseInterleavedStops(
  values: unknown[],
  stopCount: number,
): { colors: RawColorStop[]; alphas: RawAlphaStop[] } | null {
  if (values.length < stopCount * 6) return null;
  const colors: RawColorStop[] = [];
  const alphas: RawAlphaStop[] = [];
  for (let i = 0; i < stopCount; i++) {
    const base = i * 6;
    const offset = Number(values[base]);
    if (!Number.isFinite(offset)) continue;
    colors.push({
      offset,
      r: Number(values[base + 1]) * 255,
      g: Number(values[base + 2]) * 255,
      b: Number(values[base + 3]) * 255,
    });
    alphas.push({
      offset: Number(values[base + 4]),
      a: Number(values[base + 5]),
    });
  }
  return { colors, alphas };
}

function isMonotonicOffsets(stops: RawColorStop[] | RawAlphaStop[]): boolean {
  for (let i = 1; i < stops.length; i++) {
    if (stops[i].offset < stops[i - 1].offset - 1e-6) return false;
  }
  return stops.length > 0;
}

function parseGradientStops(data: unknown, knownStopCount = 0): ColorStop[] | null {
  let values: unknown[] | undefined;
  let stopCount = knownStopCount;

  if (Array.isArray(data)) {
    values = data;
  } else if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    values = Array.isArray(record.k) ? (record.k as unknown[]) : undefined;
    if (stopCount === 0) {
      stopCount = Number(record.p ?? 0);
    }
  }

  if (!values || values.length === 0) return null;

  if (stopCount === 0) {
    // Infer stop count from the total length. The most common layouts are
    // 4 values per stop (no alpha) and 6 values per stop (with alpha).
    // Prefer 4-value stops unless the length is an exact multiple of 6 but not 4.
    if (values.length % 4 === 0 && values.length % 6 !== 0) {
      stopCount = values.length / 4;
    } else if (values.length % 6 === 0 && values.length % 4 !== 0) {
      stopCount = values.length / 6;
    } else if (values.length % 4 === 0) {
      // Ambiguous (e.g. 12, 24, 36...). Default to 4-value stops; this matches
      // the common no-alpha case and can be overridden via knownStopCount.
      stopCount = values.length / 4;
    } else {
      stopCount = Math.floor(values.length / 4);
    }
  }

  // Bodymovin exports gradient stops in three layouts:
  //   - 4 values per stop: [offset, r, g, b, ...]                    (no alpha)
  //   - 4 color values per stop followed by 2 alpha values per stop:
  //       [offset, r, g, b, ...] [offset, alpha, ...]
  //   - 6 values per stop: [offset, r, g, b, alphaOffset, alpha]     (interleaved)
  // The separate alpha-block layout is the most common in real-world exports.
  const trySeparate = parseSeparateStops(values, stopCount);
  const tryInterleaved = parseInterleavedStops(values, stopCount);

  // Prefer the separate-block layout when it produces a valid, monotonic set of
  // color offsets. Fall back to interleaved only when it is the only valid option.
  const isSeparateValid = trySeparate && isMonotonicOffsets(trySeparate.colors);
  const isInterleavedValid = tryInterleaved && isMonotonicOffsets(tryInterleaved.colors);

  let colors: RawColorStop[];
  let alphas: RawAlphaStop[];
  if (isSeparateValid) {
    colors = trySeparate.colors;
    alphas = trySeparate.alphas;
  } else if (isInterleavedValid) {
    colors = tryInterleaved.colors;
    alphas = tryInterleaved.alphas;
  } else if (trySeparate) {
    colors = trySeparate.colors;
    alphas = trySeparate.alphas;
  } else if (tryInterleaved) {
    colors = tryInterleaved.colors;
    alphas = tryInterleaved.alphas;
  } else {
    return null;
  }

  if (colors.length === 0) return null;

  // Merge color and alpha stops by offset. If one list lacks a stop at an offset
  // present in the other, interpolate the missing component.
  const offsets = Array.from(new Set([...colors.map((c) => c.offset), ...alphas.map((a) => a.offset)])).sort(
    (a, b) => a - b,
  );

  const sampleAlpha = (offset: number): number => {
    if (alphas.length === 0) return 1;
    if (offset <= alphas[0].offset) return alphas[0].a;
    if (offset >= alphas[alphas.length - 1].offset) return alphas[alphas.length - 1].a;
    for (let i = 0; i < alphas.length - 1; i++) {
      const a1 = alphas[i];
      const a2 = alphas[i + 1];
      if (offset >= a1.offset && offset <= a2.offset) {
        const t = a2.offset === a1.offset ? 0 : (offset - a1.offset) / (a2.offset - a1.offset);
        return a1.a + (a2.a - a1.a) * t;
      }
    }
    return alphas[alphas.length - 1].a;
  };

  const sampleColor = (offset: number): RawColorStop => {
    if (offset <= colors[0].offset) return colors[0];
    if (offset >= colors[colors.length - 1].offset) return colors[colors.length - 1];
    for (let i = 0; i < colors.length - 1; i++) {
      const c1 = colors[i];
      const c2 = colors[i + 1];
      if (offset >= c1.offset && offset <= c2.offset) {
        const t = c2.offset === c1.offset ? 0 : (offset - c1.offset) / (c2.offset - c1.offset);
        return {
          offset,
          r: c1.r + (c2.r - c1.r) * t,
          g: c1.g + (c2.g - c1.g) * t,
          b: c1.b + (c2.b - c1.b) * t,
        };
      }
    }
    return colors[colors.length - 1];
  };

  const stops: ColorStop[] = [];
  for (const offset of offsets) {
    const color = sampleColor(offset);
    stops.push({
      offset,
      color: {
        r: color.r,
        g: color.g,
        b: color.b,
        a: sampleAlpha(offset),
      },
    });
  }

  return stops.length > 0 ? stops : null;
}

function parseStroke(data: Record<string, unknown>): SolidStroke {
  const dash = parseDashPattern(data.d);
  return {
    type: 'solid',
    color: parseAnimatableShapeColor(data.c),
    width: parseAnimatableNumber(data.w, 1),
    opacity: parseAnimatableNumber(data.o, 100),
    lineCap: parseLineCap(data.lc),
    lineJoin: parseLineJoin(data.lj),
    miterLimit: Number(data.ml ?? 4),
    dash: dash.dash,
    dashOffset: dash.offset,
  };
}

function parseGradientStroke(data: Record<string, unknown>): GradientStroke {
  const dash = parseDashPattern(data.d);
  return {
    type: 'gradient',
    gradientType: Number(data.t) === 2 ? 'radial' : 'linear',
    start: parseAnimatablePoint(data.s),
    end: parseAnimatablePoint(data.e),
    colors: parseAnimatableGradient(data.g),
    width: parseAnimatableNumber(data.w, 1),
    opacity: parseAnimatableNumber(data.o, 100),
    lineCap: parseLineCap(data.lc),
    lineJoin: parseLineJoin(data.lj),
    miterLimit: Number(data.ml ?? 4),
    dash: dash.dash,
    dashOffset: dash.offset,
    highlightLength: Number(data.h ?? 0) || undefined,
    highlightAngle: Number(data.a ?? 0) || undefined,
  };
}

function parseTrimPath(data: Record<string, unknown>): TrimPath {
  return {
    start: parseAnimatableNumber(data.s),
    end: parseAnimatableNumber(data.e),
    offset: parseAnimatableNumber(data.o),
    mode: Number(data.m) === 2 ? 'individual' : 'simultaneous',
    groupId: generatedShapeId('trim'),
  };
}

function generatedShapeId(prefix: string): string {
  return `${prefix}-${nextGeneratedShapeId++}`;
}

function parseLineCap(value: unknown): Stroke['lineCap'] {
  if (value === 1) return 'butt';
  if (value === 3) return 'square';
  return 'round';
}

function parseLineJoin(value: unknown): Stroke['lineJoin'] {
  if (value === 1) return 'miter';
  if (value === 3) return 'bevel';
  return 'round';
}

function parseDashPattern(data: unknown): {
  dash?: Animatable<number>[];
  offset?: Animatable<number>;
} {
  if (!Array.isArray(data) || data.length === 0) return {};
  const dash: Animatable<number>[] = [];
  let offset: Animatable<number> | undefined;
  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    const kind = String(record.n ?? '');
    const value = parseAnimatableNumber(record.v);
    if (kind === 'o') {
      offset = value;
    } else if (kind === 'd' || kind === 'g') {
      dash.push(value);
    }
  }
  return {
    dash: dash.length > 0 ? dash : undefined,
    offset,
  };
}

function parseColor(data: unknown): Color {
  if (Array.isArray(data) && data.length >= 3) {
    return {
      r: Number(data[0]) * 255,
      g: Number(data[1]) * 255,
      b: Number(data[2]) * 255,
      a: data[3] !== undefined ? Number(data[3]) : 1,
    };
  }
  if (data && typeof data === 'object' && 'k' in data) {
    return parseColor((data as Record<string, unknown>).k);
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

function parseShapeColor(data: unknown): Color {
  const color = parseColor(data);
  return { ...color, a: 1 };
}

function parseAnimatableShapeColor(data: unknown): Animatable<Color> {
  return parseAnimatable(data, { r: 0, g: 0, b: 0, a: 1 }, parseShapeColor);
}
