import type {
  Animatable,
  AnimatedProperty,
  AnimatedTransform,
  Animation,
  ColorStop,
  DropShadowEffect,
  Effect,
  EllipseShape,
  ExpressionEvaluator,
  FillEffect,
  GaussianBlurEffect,
  GroupShape,
  Keyframe,
  Layer,
  LayerDefinition,
  MergeShape,
  PathData,
  PathShape,
  Point,
  PointAnimatable,
  PolystarShape,
  RectShape,
  ResolvedEffect,
  SeparatePointAnimatable,
  Shape,
  TextDocument,
  TintEffect,
  Transform,
} from './types';

export interface EvaluationContext {
  frameRate: number;
  evaluator?: ExpressionEvaluator;
}

/**
 * Type guard for animated properties.
 */
export function isAnimated<T>(value: Animatable<T>): value is AnimatedProperty<T> {
  return typeof value === 'object' && value !== null && 'keyframes' in value;
}

/**
 * Evaluate an animatable value at a given frame.
 * When an expression evaluator is provided and the property has an expression,
 * the expression is evaluated and its result returned.
 */
function isSeparatePointAnimatable(value: unknown): value is SeparatePointAnimatable {
  return typeof value === 'object' && value !== null && !('keyframes' in value) && ('x' in value || 'y' in value);
}

function isStaticPointAnimatable(value: PointAnimatable): boolean {
  if (isAnimated(value as unknown as Animatable<Point>)) return false;
  // `isSeparatePointAnimatable` only checks for the presence of `x`/`y` keys,
  // which a plain static `{x, y}` Point also has -- it cannot by itself tell
  // "genuinely separate, per-axis-keyframed" apart from "already a plain
  // static point". Only the latter is safe to treat as static here, so check
  // each axis individually rather than trusting the coarser separate-point
  // classification.
  if (isSeparatePointAnimatable(value)) {
    const separate = value as SeparatePointAnimatable;
    return !isAnimated(separate.x) && !isAnimated(separate.y);
  }
  return true;
}

export function evaluateAnimatable<T>(value: Animatable<T>, frame: number, context?: EvaluationContext): T {
  if (isSeparatePointAnimatable(value)) {
    const separate = value as SeparatePointAnimatable;
    return {
      x: evaluateAnimatable(separate.x, frame, context),
      y: evaluateAnimatable(separate.y, frame, context),
    } as unknown as T;
  }
  if (!isAnimated(value)) {
    return value;
  }
  const baseValue = evaluateValue(value.keyframes, frame);
  if (value.expression && context?.evaluator) {
    const result = context.evaluator.evaluate(value.expression, {
      frame,
      time: frame / context.frameRate,
      value: baseValue,
    });
    if (result !== undefined) return result as T;
  }
  return baseValue;
}

export function evaluatePoint(value: PointAnimatable, frame: number, context?: EvaluationContext): Point {
  return evaluateAnimatable(value as unknown as Animatable<Point>, frame, context) as Point;
}

/**
 * Evaluate an animated property at a given frame.
 * Supports hold keyframes, single-keyframe constants, linear interpolation,
 * and cubic-bezier easing for scalar and color values when the keyframe
 * tangents form a monotonic time curve.
 */
export function evaluateValue<T>(keyframes: Keyframe<T>[], frame: number): T {
  if (keyframes.length === 0) {
    // Defensive: parsers fall back to static defaults instead of emitting
    // empty animated properties, but hand-built animation data can still
    // reach here. Returning undefined instead of throwing keeps a malformed
    // property from crashing the shared render loop.
    return undefined as unknown as T;
  }
  if (keyframes.length === 1) {
    return keyframes[0]!.value;
  }

  // Before the first keyframe, hold the first value. After the last keyframe,
  // hold the last value.
  if (frame <= keyframes[0]!.time) {
    return keyframes[0]!.value;
  }
  if (frame >= keyframes[keyframes.length - 1]!.time) {
    return keyframes[keyframes.length - 1]!.value;
  }

  // Find the surrounding keyframes. Use half-open intervals so that the value
  // at a keyframe's exact time comes from the following segment. This makes
  // hold keyframes jump to the new value on the hold frame, matching dotLottie.
  for (let i = 0; i < keyframes.length - 1; i++) {
    const k1 = keyframes[i]!;
    const k2 = keyframes[i + 1]!;
    if (frame >= k1.time && frame < k2.time) {
      if (k1.hold) return k1.value;
      // Scalar/color/path/point keyframes use temporal bezier easing when
      // tangents are present. Point values additionally apply spatial bezier
      // interpolation using the per-keyframe to/ti handles.
      const useBezier =
        typeof k1.value === 'number' ||
        isPointLike(k1.value) ||
        isColorLike(k1.value) ||
        isColorStopArray(k1.value) ||
        isPathData(k1.value);
      const u = useBezier ? solveBezierParameter(k1, k2, frame) : (frame - k1.time) / (k2.time - k1.time);
      return interpolateValues(k1.value, k2.value, u, k1, k2);
    }
  }

  return keyframes[keyframes.length - 1]!.value;
}

function interpolateValues<T>(a: T, b: T, u: number, k1: Keyframe<T>, k2: Keyframe<T>): T {
  const outTangent = k1.outTangent;
  const inTangent = k2.inTangent;
  const hasTangents = outTangent !== undefined && inTangent !== undefined;

  if (typeof a === 'number' && typeof b === 'number') {
    if (hasTangents) {
      const dv = b - a;
      const oy = outTangent.y ?? 0;
      const iy = inTangent.y ?? 0;
      // Use the raw temporal-bezier control points (no overshoot clamp): ThorVG
      // evaluates the full cubic, so extreme handles must be allowed to overshoot
      // the keyframe span to match (e.g. hourglass's rotation handle iy=-11.69).
      const cp1 = a + oy * dv;
      const cp2 = a + iy * dv;
      return cubicBezierAxis(u, a, cp1, cp2, b) as T;
    }
    return (a + (b - a) * u) as T;
  }
  if (isPointLike(a) && isPointLike(b)) {
    const hasSpatialTangents = isNonZeroPoint(k1.to) || isNonZeroPoint(k2.ti);
    if (hasSpatialTangents) {
      const progress = easedProgress(u, k1, k2);
      const cp1 = k1.to ? { x: a.x + k1.to.x, y: a.y + k1.to.y } : a;
      const cp2 = k2.ti ? { x: b.x + k2.ti.x, y: b.y + k2.ti.y } : b;
      const spatialU = spatialBezierParameterForProgress(a, cp1, cp2, b, progress);
      return {
        x: cubicBezierAxis(spatialU, a.x, cp1.x, cp2.x, b.x),
        y: cubicBezierAxis(spatialU, a.y, cp1.y, cp2.y, b.y),
      } as T;
    }
    if (hasTangents) {
      const dvx = b.x - a.x;
      const dvy = b.y - a.y;
      const oy = outTangent.y ?? 0;
      const iy = inTangent.y ?? 0;
      return {
        x: cubicBezierAxis(u, a.x, a.x + oy * dvx, a.x + iy * dvx, b.x),
        y: cubicBezierAxis(u, a.y, a.y + oy * dvy, a.y + iy * dvy, b.y),
      } as T;
    }
    return {
      x: a.x + (b.x - a.x) * u,
      y: a.y + (b.y - a.y) * u,
    } as T;
  }
  if (isColorLike(a) && isColorLike(b)) {
    if (hasTangents) {
      const oy = outTangent.y ?? 0;
      const iy = inTangent.y ?? 0;
      return {
        r: cubicBezierAxis(u, a.r, a.r + oy * (b.r - a.r), a.r + iy * (b.r - a.r), b.r),
        g: cubicBezierAxis(u, a.g, a.g + oy * (b.g - a.g), a.g + iy * (b.g - a.g), b.g),
        b: cubicBezierAxis(u, a.b, a.b + oy * (b.b - a.b), a.b + iy * (b.b - a.b), b.b),
        a: cubicBezierAxis(u, a.a, a.a + oy * (b.a - a.a), a.a + iy * (b.a - a.a), b.a),
      } as T;
    }
    return {
      r: a.r + (b.r - a.r) * u,
      g: a.g + (b.g - a.g) * u,
      b: a.b + (b.b - a.b) * u,
      a: a.a + (b.a - a.a) * u,
    } as T;
  }
  if (isColorStopArray(a) && isColorStopArray(b)) {
    const count = Math.min(a.length, b.length);
    const stops: ColorStop[] = [];
    const oy = outTangent?.y ?? 0;
    const iy = inTangent?.y ?? 0;
    const interpolateStopScalar = (from: number, to: number): number =>
      hasTangents
        ? cubicBezierAxis(u, from, from + oy * (to - from), from + iy * (to - from), to)
        : from + (to - from) * u;
    for (let i = 0; i < count; i++) {
      const sa = a[i]!;
      const sb = b[i]!;
      stops.push({
        offset: interpolateStopScalar(sa.offset, sb.offset),
        color: {
          r: interpolateStopScalar(sa.color.r, sb.color.r),
          g: interpolateStopScalar(sa.color.g, sb.color.g),
          b: interpolateStopScalar(sa.color.b, sb.color.b),
          a: interpolateStopScalar(sa.color.a, sb.color.a),
        },
      });
    }
    return stops as T;
  }

  if (isPathData(a) && isPathData(b)) {
    return interpolatePathData(a, b, easedProgress(u, k1, k2)) as T;
  }
  return u < 0.5 ? a : b;
}

function easedProgress<T>(u: number, k1: Keyframe<T>, k2: Keyframe<T>): number {
  const outTangent = k1.outTangent;
  const inTangent = k2.inTangent;
  if (!outTangent || !inTangent) return u;
  return cubicBezierAxis(u, 0, outTangent.y ?? 0, inTangent.y ?? 1, 1);
}

function spatialBezierParameterForProgress(p0: Point, p1: Point, p2: Point, p3: Point, progress: number): number {
  const samples = 32;
  const lengths: number[] = [0];
  let prev = p0;
  let total = 0;
  for (let i = 1; i <= samples; i++) {
    const u = i / samples;
    const point = {
      x: cubicBezierAxis(u, p0.x, p1.x, p2.x, p3.x),
      y: cubicBezierAxis(u, p0.y, p1.y, p2.y, p3.y),
    };
    total += Math.hypot(point.x - prev.x, point.y - prev.y);
    lengths.push(total);
    prev = point;
  }
  if (total <= 1e-9) return progress;
  const target = Math.max(0, Math.min(1, progress)) * total;
  for (let i = 1; i < lengths.length; i++) {
    if (lengths[i]! >= target) {
      const segment = lengths[i]! - lengths[i - 1]!;
      const t = segment <= 1e-9 ? 0 : (target - lengths[i - 1]!) / segment;
      return (i - 1 + t) / samples;
    }
  }
  return 1;
}

function isNonZeroPoint(point: Point | undefined): boolean {
  return point !== undefined && (Math.abs(point.x) > 1e-9 || Math.abs(point.y) > 1e-9);
}

function isColorStopArray(value: unknown): value is ColorStop[] {
  return Array.isArray(value) && value.length > 0 && isColorStop(value[0]);
}

function isColorStop(value: unknown): value is ColorStop {
  return (
    typeof value === 'object' &&
    value !== null &&
    'offset' in value &&
    'color' in value &&
    isColorLike((value as ColorStop).color)
  );
}

function solveBezierParameter<T>(k1: Keyframe<T>, k2: Keyframe<T>, frame: number): number {
  const outTangent = k1.outTangent;
  const inTangent = k2.inTangent;
  if (!outTangent || !inTangent) {
    return (frame - k1.time) / (k2.time - k1.time);
  }

  const dt = k2.time - k1.time;
  if (dt <= 0) return 0;

  const p1x = (outTangent.x ?? 0) * dt;
  const p2x = (inTangent.x ?? 0) * dt;
  const target = frame - k1.time;

  // Tangents outside the keyframe span cannot be used to build a valid time
  // curve; fall back to linear interpolation in that case.
  if (p1x < 0 || p2x > dt) {
    return (frame - k1.time) / (k2.time - k1.time);
  }

  // For monotonic time curves the simple binary search is sufficient and cheap.
  if (p1x <= p2x) {
    return binarySearchBezierParameter(0, 1, target, p1x, p2x, dt);
  }

  // Non-monotonic curves can loop back in time. Sample the curve to find the
  // first interval where the target time is crossed, then refine with a local
  // binary search so the result matches the earliest valid parameter value.
  const steps = 64;
  let prevU = 0;
  let prevX = 0;
  for (let i = 1; i <= steps; i++) {
    const u = i / steps;
    const x = cubicBezierAxis(u, 0, p1x, p2x, dt);
    if ((prevX <= target && x >= target) || (prevX >= target && x <= target)) {
      return binarySearchBezierParameter(prevU, u, target, p1x, p2x, dt);
    }
    prevU = u;
    prevX = x;
  }

  // Target was not crossed inside the sampled range (curve overshoots); fall
  // back to linear timing.
  return (frame - k1.time) / (k2.time - k1.time);
}

function binarySearchBezierParameter(
  lo: number,
  hi: number,
  target: number,
  p1x: number,
  p2x: number,
  dt: number,
): number {
  let low = lo;
  let high = hi;
  for (let iter = 0; iter < 24; iter++) {
    const mid = (low + high) / 2;
    const bx = cubicBezierAxis(mid, 0, p1x, p2x, dt);
    if (bx < target) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

function cubicBezierAxis(u: number, p0: number, p1: number, p2: number, p3: number): number {
  const omu = 1 - u;
  return omu * omu * omu * p0 + 3 * omu * omu * u * p1 + 3 * omu * u * u * p2 + u * u * u * p3;
}

function isPathData(value: unknown): value is PathData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'vertices' in value &&
    'inTangents' in value &&
    'outTangents' in value &&
    'closed' in value
  );
}

function interpolatePathData(a: PathData, b: PathData, t: number): PathData {
  const count = Math.min(a.vertices.length, b.vertices.length);
  const vertices: PathData['vertices'] = [];
  const inTangents: PathData['inTangents'] = [];
  const outTangents: PathData['outTangents'] = [];

  for (let i = 0; i < count; i++) {
    vertices.push(interpolatePoint(a.vertices[i]!, b.vertices[i]!, t));
    inTangents.push(interpolatePoint(a.inTangents[i] ?? { x: 0, y: 0 }, b.inTangents[i] ?? { x: 0, y: 0 }, t));
    outTangents.push(interpolatePoint(a.outTangents[i] ?? { x: 0, y: 0 }, b.outTangents[i] ?? { x: 0, y: 0 }, t));
  }

  return {
    vertices,
    inTangents,
    outTangents,
    closed: t < 0.5 ? a.closed : b.closed,
  };
}

function interpolatePoint(
  a: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
): { x: number; y: number } {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  };
}

function isPointLike(value: unknown): value is { x: number; y: number } {
  return typeof value === 'object' && value !== null && 'x' in value && 'y' in value;
}

function isColorLike(value: unknown): value is { r: number; g: number; b: number; a: number } {
  return typeof value === 'object' && value !== null && 'r' in value && 'g' in value && 'b' in value;
}

export interface AffineMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export function transformToMatrix(transform: Transform): AffineMatrix {
  if (transform.matrix) {
    return transform.matrix;
  }
  const rad = (transform.rotation * Math.PI) / 180;
  const sx = transform.scale.x / 100;
  const sy = transform.scale.y / 100;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const base: AffineMatrix = {
    a: cos,
    b: sin,
    c: -sin,
    d: cos,
    e: 0,
    f: 0,
  };
  const skew = transform.skew ?? 0;
  const skewAxis = transform.skewAxis ?? 0;
  const skewMatrix =
    Math.abs(skew) > 1e-9 ? skewAxisMatrix((-skew * Math.PI) / 180, (skewAxis * Math.PI) / 180) : identityMatrix();
  const scaleMatrix: AffineMatrix = { a: sx, b: 0, c: 0, d: sy, e: 0, f: 0 };
  const rs = multiplyMatrices(multiplyMatrices(base, skewMatrix), scaleMatrix);

  // M = T(position) * R * Skew(axis) * S * T(-anchor)
  const { a, b, c, d } = rs;
  const e = transform.position.x - (a * transform.anchor.x + c * transform.anchor.y);
  const f = transform.position.y - (b * transform.anchor.x + d * transform.anchor.y);

  return { a, b, c, d, e, f };
}

function identityMatrix(): AffineMatrix {
  return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
}

function skewAxisMatrix(skew: number, axis: number): AffineMatrix {
  const shear = Math.tan(skew);
  const cos = Math.cos(axis);
  const sin = Math.sin(axis);
  const rotateAxis: AffineMatrix = { a: cos, b: sin, c: -sin, d: cos, e: 0, f: 0 };
  const shearMatrix: AffineMatrix = { a: 1, b: 0, c: shear, d: 1, e: 0, f: 0 };
  const rotateBack: AffineMatrix = { a: cos, b: -sin, c: sin, d: cos, e: 0, f: 0 };
  return multiplyMatrices(multiplyMatrices(rotateAxis, shearMatrix), rotateBack);
}

export function multiplyMatrices(parent: AffineMatrix, child: AffineMatrix): AffineMatrix {
  return {
    a: parent.a * child.a + parent.c * child.b,
    b: parent.b * child.a + parent.d * child.b,
    c: parent.a * child.c + parent.c * child.d,
    d: parent.b * child.c + parent.d * child.d,
    e: parent.a * child.e + parent.c * child.f + parent.e,
    f: parent.b * child.e + parent.d * child.f + parent.f,
  };
}

export function invertMatrix(matrix: AffineMatrix): AffineMatrix {
  const det = matrix.a * matrix.d - matrix.b * matrix.c;
  if (det === 0) {
    return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  }
  return {
    a: matrix.d / det,
    b: -matrix.b / det,
    c: -matrix.c / det,
    d: matrix.a / det,
    e: (matrix.c * matrix.f - matrix.d * matrix.e) / det,
    f: (matrix.b * matrix.e - matrix.a * matrix.f) / det,
  };
}

export function applyMatrixToPoint(matrix: AffineMatrix, point: Point): Point {
  return {
    x: matrix.a * point.x + matrix.c * point.y + matrix.e,
    y: matrix.b * point.x + matrix.d * point.y + matrix.f,
  };
}

function matrixToTransform(matrix: AffineMatrix): Transform {
  const scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  const scaleY = scaleX === 0 ? 0 : determinant / scaleX;
  const rotation = (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI;

  return {
    position: { x: matrix.e, y: matrix.f },
    anchor: { x: 0, y: 0 },
    scale: { x: scaleX * 100, y: scaleY * 100 },
    rotation,
    opacity: 100,
  };
}

export function combineTransforms(parent: Transform, child: Transform, inheritOpacity = true): Transform {
  const combined = multiplyMatrices(transformToMatrix(parent), transformToMatrix(child));
  const result = matrixToTransform(combined);
  result.matrix = combined;
  // Layer parenting inherits position/scale/rotation but not opacity. Shape
  // group transforms still multiply opacity down the group hierarchy.
  result.opacity = inheritOpacity ? (parent.opacity * child.opacity) / 100 : child.opacity;
  return result;
}

/**
 * Build the scene state for a given frame.
 */
export function buildScene(animation: Animation, frame: number): Layer[] {
  const compFrame = frame + (animation.inPoint ?? 0);
  const layerByInd = new Map<number, LayerDefinition>();

  for (const layer of animation.layers) {
    layerByInd.set(layer.ind, layer);
  }

  const resolvedCache = new Map<number, Transform>();
  const context: EvaluationContext = {
    frameRate: animation.frameRate,
    ...(animation.expressionEvaluator !== undefined && { evaluator: animation.expressionEvaluator }),
  };

  function evaluateTimeRemapFrame(timeRemap: Animatable<number>, parentStartTime = 0): number {
    const sourceFrame = evaluateAnimatable(timeRemap, compFrame, context) * animation.frameRate;
    // dotLottie/ThorVG renders a static zero time-remap on the first displayed
    // source frame rather than the pre-roll frame 0 used by raw multiplication.
    return (nearlyEqual(sourceFrame, 0) ? 1 : sourceFrame) - parentStartTime;
  }

  function getLayerTransformFrame(layer: LayerDefinition): number {
    const transformStartTime = layer.transformStartTime ?? 0;
    const compLayerStartTime = (layer.startTime ?? 0) - transformStartTime;
    if (layer.parentTimeRemap !== undefined) {
      // Inner layer transforms are authored on the precomp timeline, so they
      // follow any time remapping applied to the parent precomp instance.
      const remappedFrame = evaluateTimeRemapFrame(layer.parentTimeRemap, layer.parentStartTime ?? 0);
      return layer.remappedSourceWindow ? remappedFrame : remappedFrame - compLayerStartTime;
    }
    if (layer.isPrecompChildContent) {
      // A precomp instance's time stretch (sr) compresses/expands its inner
      // timeline: inner content advances at 1/sr per comp frame (sr=0.8 -> 1.25x).
      // The child's start-time lives in the (already stretched) inner timeline, so
      // apply the stretch to the comp frame first, THEN subtract the start-time —
      // otherwise staggered clips inside a stretched comp land on the wrong frame.
      return compFrame / (layer.stretch ?? 1) - transformStartTime;
    }
    return (compFrame - transformStartTime) * (layer.stretch ?? 1);
  }

  function getResolvedTransform(ind: number): Transform {
    const cached = resolvedCache.get(ind);
    if (cached) return cached;

    const layer = layerByInd.get(ind);
    if (!layer) {
      return {
        position: { x: 0, y: 0 },
        anchor: { x: 0, y: 0 },
        scale: { x: 100, y: 100 },
        rotation: 0,
        opacity: 100,
      };
    }

    const transformFrame = getLayerTransformFrame(layer);
    let transform = evaluateTransform(layer.transform, transformFrame, context);

    if (layer.parentId && layerByInd.has(layer.parentId)) {
      const parentTransform = getResolvedTransform(layer.parentId);
      transform = combineTransforms(parentTransform, transform, false);
    }

    resolvedCache.set(ind, transform);
    return transform;
  }

  function evaluateLayer(layer: LayerDefinition): Layer {
    const resolvedTransform = getResolvedTransform(layer.ind);
    let transform: Transform = resolvedTransform;
    if (layer.groupOpacity !== undefined) {
      transform = {
        ...resolvedTransform,
        position: { ...resolvedTransform.position },
        anchor: { ...resolvedTransform.anchor },
        scale: { ...resolvedTransform.scale },
      };
      for (const entry of layer.groupOpacity) {
        const groupFrame = (compFrame - entry.startTime) * entry.stretch;
        const groupOpacity = evaluateAnimatable(entry.opacity, groupFrame, context);
        transform.opacity = (transform.opacity * groupOpacity) / 100;
      }
    }
    // Visibility follows lottie-web semantics: precomp children are checked
    // against the precomp's rendered frame (remapped or stretched), and the
    // inPoint/outPoint are interpreted relative to the precomp timeline.
    const transformStartTime = layer.transformStartTime ?? 0;
    let timelineFrame: number;
    let contentFrame: number;
    let inPoint = layer.inPoint;
    let outPoint = layer.outPoint;
    if (layer.parentTimeRemap !== undefined && layer.remappedSourceWindow) {
      // Visibility is authored on the source precomp timeline. Content and
      // transforms use the child-local version of that same remapped frame.
      timelineFrame = evaluateTimeRemapFrame(layer.parentTimeRemap, layer.parentStartTime ?? 0);
      contentFrame = getLayerTransformFrame(layer);
    } else if (layer.parentTimeRemap !== undefined) {
      // Most time-remapped child visibility stays on the parent composition
      // window for current corpus compatibility; content follows remapped time.
      timelineFrame = (compFrame - transformStartTime) / (layer.stretch ?? 1);
      contentFrame = getLayerTransformFrame(layer);
      inPoint -= transformStartTime;
      outPoint -= transformStartTime;
    } else if (layer.isPrecompChildContent) {
      timelineFrame = (compFrame - transformStartTime) / (layer.stretch ?? 1);
      contentFrame = getLayerTransformFrame(layer);
      inPoint -= transformStartTime;
      outPoint -= transformStartTime;
    } else {
      timelineFrame = compFrame;
      contentFrame = compFrame;
    }
    // Top-level layer shapes/masks are authored on the composition timeline.
    const parentWindowVisible =
      layer.sourceWindowParentInPoint === undefined ||
      (compFrame >= layer.sourceWindowParentInPoint &&
        compFrame <= (layer.sourceWindowParentOutPoint ?? Number.POSITIVE_INFINITY));
    const parentDefinition = layer.parentId !== undefined ? layerByInd.get(layer.parentId) : undefined;
    const hiddenByMovedZeroOpacityNullParent =
      layer.type === 'precomp' &&
      layer.trackMatte !== undefined &&
      parentDefinition?.type === 'null' &&
      parentDefinition.isPrecompChildContent === true &&
      isMovedZeroOpacityNull(parentDefinition);
    const hiddenByEdgeOnThreeDProjection = isEdgeOnThreeDProjection(layer, getLayerTransformFrame(layer), context);
    const maskFrame = layer.masksUseContentFrame ? getLayerTransformFrame(layer) : contentFrame;

    let shapes = layer.shapes as Shape[];
    for (let index = 0; index < layer.shapes.length; index++) {
      const shape = layer.shapes[index]!;
      const evaluated = evaluateShape(shape, contentFrame, context);
      if (evaluated !== shape && shapes === layer.shapes) {
        shapes = layer.shapes.slice(0, index) as Shape[];
      }
      if (shapes !== layer.shapes) {
        shapes.push(evaluated);
      }
    }

    // Destructure the unresolved (animatable) properties so the `...rest`
    // spread does not leak their definition types into the resolved Layer.
    const { text, effects, masks, matteChildren, ...rest } = layer;
    return {
      ...rest,
      transform,
      inPoint,
      outPoint,
      timelineFrame,
      shapes,
      ...(text && { text: evaluateText(text, contentFrame, context) }),
      ...(effects && { effects: evaluateEffects(effects, contentFrame, context) }),
      ...(masks && {
        masks: masks.map((mask) => ({
          ...mask,
          path: evaluateAnimatable(mask.path, maskFrame, context),
          opacity: evaluateAnimatable(mask.opacity, maskFrame, context),
        })),
      }),
      ...(matteChildren && { matteChildren: matteChildren.map(evaluateLayer) }),
      visible:
        layer.visible && parentWindowVisible && !hiddenByMovedZeroOpacityNullParent && !hiddenByEdgeOnThreeDProjection,
    };
  }

  function isEdgeOnThreeDProjection(layer: LayerDefinition, frame: number, context: EvaluationContext): boolean {
    if (!layer.threeDRotation) return false;
    const rotationX = evaluateAnimatable(layer.threeDRotation.x, frame, context);
    const rotationY = evaluateAnimatable(layer.threeDRotation.y, frame, context);
    const projectedArea =
      Math.abs(Math.cos((rotationX * Math.PI) / 180)) * Math.abs(Math.cos((rotationY * Math.PI) / 180));
    return projectedArea < 0.08;
  }

  function isMovedZeroOpacityNull(layer: LayerDefinition): boolean {
    const localFrame = getLayerTransformFrame(layer);
    const current = evaluateTransform(layer.transform, localFrame, context);
    if (current.opacity > 0) {
      return false;
    }
    const rest = evaluateTransform(layer.transform, 0, context);
    return !sameTransform(current, rest);
  }

  return animation.layers.map(evaluateLayer);
}

function evaluateEffects(effects: Effect[], frame: number, context: EvaluationContext): ResolvedEffect[] {
  return effects.map((effect) => {
    if (effect.type === 'fill') {
      const fill = effect as FillEffect;
      const color = evaluateAnimatable(fill.color, frame, context);
      const opacity = evaluateAnimatable(fill.opacity, frame, context);
      return {
        ...fill,
        color: { ...color, a: color.a * opacity },
        opacity,
      };
    }
    if (effect.type === 'drop-shadow') {
      const drop = effect as DropShadowEffect;
      const color = evaluateAnimatable(drop.color, frame, context);
      const opacity = evaluateAnimatable(drop.opacity, frame, context);
      return {
        ...drop,
        color: { ...color, a: color.a * opacity },
        opacity,
      };
    }
    if (effect.type === 'gaussian-blur') {
      const blur = effect as GaussianBlurEffect;
      return {
        ...blur,
        blurriness: evaluateAnimatable(blur.blurriness, frame, context),
      };
    }
    const { whiteColor, ...tint } = effect as TintEffect;
    return {
      ...tint,
      color: evaluateAnimatable(tint.color, frame, context),
      ...(whiteColor !== undefined && { whiteColor: evaluateAnimatable(whiteColor, frame, context) }),
      amount: evaluateAnimatable(tint.amount, frame, context),
    };
  });
}

function evaluateText(text: TextDocument, frame: number, context: EvaluationContext): TextDocument {
  if (text.rangeSelectorScale === undefined && text.rangeSelectorEnd === undefined && text.textPath === undefined) {
    return text;
  }
  return {
    ...text,
    ...(text.rangeSelectorScale !== undefined && {
      rangeSelectorScale: evaluatePoint(text.rangeSelectorScale, frame, context),
    }),
    ...(text.rangeSelectorEnd !== undefined && {
      rangeSelectorEnd: evaluateAnimatable(text.rangeSelectorEnd, frame, context),
    }),
    ...(text.textPath !== undefined && {
      textPath: {
        path: evaluateAnimatable(text.textPath.path, frame, context),
        firstMargin: evaluateAnimatable(text.textPath.firstMargin, frame, context),
      },
    }),
  };
}

function sameTransform(a: Transform, b: Transform): boolean {
  return (
    samePoint(a.position, b.position) &&
    samePoint(a.anchor, b.anchor) &&
    samePoint(a.scale, b.scale) &&
    nearlyEqual(a.rotation, b.rotation) &&
    nearlyEqual(a.skew ?? 0, b.skew ?? 0) &&
    nearlyEqual(a.skewAxis ?? 0, b.skewAxis ?? 0)
  );
}

function samePoint(a: Point, b: Point): boolean {
  return nearlyEqual(a.x, b.x) && nearlyEqual(a.y, b.y);
}

function nearlyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < 1e-6;
}

function evaluateShape(shape: Shape, frame: number, context: EvaluationContext): Shape {
  let result: Shape = shape;

  if (shape.repeaterMatrix !== undefined) {
    // Compose the static repeater matrix with the shape's PER-FRAME own transform
    // (the group scale may animate 0→100, so baking at parse time collapses it),
    // and fold in the per-copy fade + the animated-count visibility.
    const base: Transform =
      shape.animatedTransform !== undefined
        ? evaluateTransform(shape.animatedTransform, frame, context)
        : (shape.transform ?? {
            position: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          });
    let opacity = base.opacity * (shape.repeaterOpacityMult ?? 1);
    if (shape.repeaterCount !== undefined) {
      const count = evaluateAnimatable(shape.repeaterCount, frame, context);
      opacity *= Math.max(0, Math.min(1, count - (shape.repeaterIndex ?? 0)));
    }
    const matrix = multiplyMatrices(shape.repeaterMatrix, transformToMatrix(base));
    // Drop `animatedTransform` (via destructuring rather than an explicit
    // `undefined`, for exactOptionalPropertyTypes): it has been folded into
    // the resolved `transform` above and must not be evaluated again.
    const { animatedTransform: _folded, ...rest } = result;
    result = { ...rest, transform: { ...base, opacity, matrix } };
  }

  if (shape.type === 'path') {
    // Read from `result`, not the original shape: the repeater block above may
    // have composed a per-copy transform/opacity into `result`, which spreading
    // the raw shape would silently discard (copies would pile up unfaded at the
    // base position). Path fields are untouched by that block, so evaluation is
    // unaffected.
    const pathShape = result as PathShape;
    const pathAnimated = isAnimated(pathShape.path);
    const hasOffset = pathShape.offset !== undefined;
    const offsetAnimated = hasOffset && isAnimated(pathShape.offset as Animatable<number>);
    const hasCornerRadius = pathShape.cornerRadius !== undefined;
    const cornerRadiusAnimated = hasCornerRadius && isAnimated(pathShape.cornerRadius as Animatable<number>);

    let path = evaluateAnimatable(pathShape.path, frame, context);
    const offset = hasOffset ? evaluateAnimatable(pathShape.offset as Animatable<number>, frame, context) : undefined;
    if (offset !== undefined && offset !== 0) {
      path = offsetClosedPath(path, offset);
    }
    if (hasCornerRadius) {
      const radius = evaluateAnimatable(pathShape.cornerRadius as Animatable<number>, frame, context);
      if (radius > 0) {
        path = roundPathCorners(path, radius);
      }
    }

    // A static offset/cornerRadius still needs to be applied once (it can
    // still transform `path` into a new object), so identity is only
    // preserved when the computed path/offset actually match the raw
    // fields -- not merely when nothing is animated.
    if (
      pathAnimated ||
      offsetAnimated ||
      cornerRadiusAnimated ||
      path !== pathShape.path ||
      offset !== pathShape.offset
    ) {
      result = {
        ...pathShape,
        path,
        offset,
      } as PathShape;
    }
  }

  if (result.type === 'ellipse') {
    const ellipse = result as EllipseShape;
    if (!isStaticPointAnimatable(ellipse.center) || !isStaticPointAnimatable(ellipse.radius)) {
      result = {
        ...ellipse,
        center: evaluatePoint(ellipse.center, frame, context),
        radius: evaluatePoint(ellipse.radius, frame, context),
      } as EllipseShape;
    }
  }

  if (result.type === 'merge') {
    const merge = result as MergeShape;
    result = {
      ...merge,
      shapes: merge.shapes.map((child) => evaluateShape(child, frame, context)),
    } as MergeShape;
  }

  if (result.type === 'group') {
    const group = result as GroupShape;
    let groupTransform = group.transform;
    if (group.animatedTransform) {
      // The animated transform already represents the group's full transform at
      // this frame; the static frame-0 transform must not be composed again.
      groupTransform = evaluateTransform(group.animatedTransform, frame, context);
    }
    let children = group.children;
    for (let index = 0; index < group.children.length; index++) {
      const child = group.children[index]!;
      const evaluated = evaluateShape(child, frame, context);
      if (evaluated !== child && children === group.children) {
        children = group.children.slice(0, index);
      }
      if (children !== group.children) {
        children.push(evaluated);
      }
    }
    if (groupTransform !== group.transform || children !== group.children) {
      result = {
        ...group,
        transform: groupTransform,
        children,
      } as GroupShape;
    }
  }

  if (result.type === 'rect') {
    const rect = result as RectShape;
    const hasOffset = rect.offset !== undefined;
    const hasAnimatedCornerRadius = isAnimated(rect.cornerRadius);
    if (
      !isStaticPointAnimatable(rect.position) ||
      !isStaticPointAnimatable(rect.size) ||
      hasOffset ||
      hasAnimatedCornerRadius
    ) {
      const position = evaluatePoint(rect.position, frame, context);
      const offset = rect.offset !== undefined ? evaluateAnimatable(rect.offset, frame, context) : 0;
      const rawSize = evaluatePoint(rect.size, frame, context);
      const cornerRadius = evaluateAnimatable(rect.cornerRadius, frame, context);
      const size = {
        x: Math.max(0, rawSize.x + offset * 2),
        y: Math.max(0, rawSize.y + offset * 2),
      };
      result = {
        ...rect,
        position,
        size,
        offset,
        cornerRadius: Math.max(0, cornerRadius + offset),
        rect: {
          x: position.x - size.x / 2,
          y: position.y - size.y / 2,
          width: size.x,
          height: size.y,
        },
      } as RectShape;
    }
  }

  if (result.type === 'polystar') {
    const polystar = result as PolystarShape;
    const animated = polystar.animatedProperties;
    const offset = polystar.offset !== undefined ? evaluateAnimatable(polystar.offset, frame, context) : 0;
    if (animated || offset !== 0) {
      const outerRadius =
        animated?.outerRadius !== undefined
          ? evaluateAnimatable(animated.outerRadius, frame, context)
          : polystar.outerRadius;
      const innerRadius =
        animated?.innerRadius !== undefined
          ? evaluateAnimatable(animated.innerRadius, frame, context)
          : polystar.innerRadius;
      result = {
        ...polystar,
        center: animated?.center ? evaluatePoint(animated.center, frame, context) : polystar.center,
        points: animated?.points !== undefined ? evaluateAnimatable(animated.points, frame, context) : polystar.points,
        outerRadius,
        innerRadius,
        outerRoundness:
          animated?.outerRoundness !== undefined
            ? evaluateAnimatable(animated.outerRoundness, frame, context)
            : polystar.outerRoundness,
        innerRoundness:
          animated?.innerRoundness !== undefined
            ? evaluateAnimatable(animated.innerRoundness, frame, context)
            : polystar.innerRoundness,
        rotation:
          animated?.rotation !== undefined ? evaluateAnimatable(animated.rotation, frame, context) : polystar.rotation,
        cornerRadius:
          animated?.cornerRadius !== undefined
            ? evaluateAnimatable(animated.cornerRadius, frame, context)
            : polystar.cornerRadius,
        offset,
      } as PolystarShape;
    }
  }

  if (result.type === 'ellipse' && result.offset !== undefined) {
    const ellipse = result as EllipseShape;
    const offset = evaluateAnimatable(result.offset, frame, context);
    const radius = evaluatePoint(ellipse.radius, frame, context);
    result = {
      ...ellipse,
      offset,
      radius: {
        x: Math.max(0, radius.x + offset * 2),
        y: Math.max(0, radius.y + offset * 2),
      },
    } as EllipseShape;
  }

  if (result.trim) {
    result = {
      ...result,
      trim: {
        start: evaluateAnimatable(result.trim.start, frame, context),
        end: evaluateAnimatable(result.trim.end, frame, context),
        offset: evaluateAnimatable(result.trim.offset, frame, context),
        mode: result.trim.mode,
        ...(result.trim.groupId !== undefined && { groupId: result.trim.groupId }),
      },
    };
  }

  if (result.trims) {
    result = {
      ...result,
      trims: result.trims.map((trim) => ({
        start: evaluateAnimatable(trim.start, frame, context),
        end: evaluateAnimatable(trim.end, frame, context),
        offset: evaluateAnimatable(trim.offset, frame, context),
        mode: trim.mode,
        ...(trim.groupId !== undefined && { groupId: trim.groupId }),
      })),
    };
  }

  if (result.fill?.type === 'solid') {
    const fill = result.fill;
    const hasAnimatedFill = isAnimated(fill.color) || isAnimated(fill.opacity ?? 100);
    const fillOpacity = evaluateAnimatable(fill.opacity ?? 100, frame, context) / 100;
    if (hasAnimatedFill || fillOpacity !== 1) {
      const color = evaluateAnimatable(fill.color, frame, context);
      result = {
        ...result,
        fill: {
          ...fill,
          color: { ...color, a: color.a * fillOpacity },
        },
      };
    }
  } else if (result.fill?.type === 'gradient') {
    const fill = result.fill;
    const hasAnimatedFill =
      isAnimated(fill.opacity ?? 100) ||
      !isStaticPointAnimatable(fill.start) ||
      !isStaticPointAnimatable(fill.end) ||
      isAnimated(fill.colors);
    const fillOpacity = evaluateAnimatable(fill.opacity ?? 100, frame, context) / 100;
    if (hasAnimatedFill || fillOpacity !== 1) {
      result = {
        ...result,
        fill: {
          ...fill,
          start: evaluatePoint(fill.start, frame, context),
          end: evaluatePoint(fill.end, frame, context),
          colors: evaluateAnimatable(fill.colors, frame, context).map((stop) => ({
            ...stop,
            color: { ...stop.color, a: stop.color.a * fillOpacity },
          })),
        },
      };
    }
  }

  if (result.stroke) {
    const strokes = Array.isArray(result.stroke) ? result.stroke : [result.stroke];
    result = {
      ...result,
      stroke: strokes.map((stroke) => {
        if (stroke.type === 'solid') {
          return {
            ...stroke,
            color: evaluateAnimatable(stroke.color, frame, context),
            width: evaluateAnimatable(stroke.width, frame, context),
            opacity: evaluateAnimatable(stroke.opacity, frame, context),
            ...(stroke.dash && { dash: stroke.dash.map((value) => evaluateAnimatable(value, frame, context)) }),
            ...(stroke.dashOffset !== undefined && {
              dashOffset: evaluateAnimatable(stroke.dashOffset, frame, context),
            }),
          };
        }
        return {
          ...stroke,
          start: evaluateAnimatable(stroke.start, frame, context),
          end: evaluateAnimatable(stroke.end, frame, context),
          colors: evaluateAnimatable(stroke.colors, frame, context),
          width: evaluateAnimatable(stroke.width, frame, context),
          opacity: evaluateAnimatable(stroke.opacity, frame, context),
          ...(stroke.dash && { dash: stroke.dash.map((value) => evaluateAnimatable(value, frame, context)) }),
          ...(stroke.dashOffset !== undefined && {
            dashOffset: evaluateAnimatable(stroke.dashOffset, frame, context),
          }),
        };
      }),
    };
  }

  return result;
}

function evaluateTransform(transform: AnimatedTransform, frame: number, context: EvaluationContext): Transform {
  return {
    position: evaluatePoint(transform.position, frame, context),
    anchor: evaluatePoint(transform.anchor, frame, context),
    scale: evaluatePoint(transform.scale, frame, context),
    rotation: evaluateAnimatable(transform.rotation, frame, context),
    opacity: evaluateAnimatable(transform.opacity, frame, context),
    skew: transform.skew !== undefined ? evaluateAnimatable(transform.skew, frame, context) : 0,
    skewAxis: transform.skewAxis !== undefined ? evaluateAnimatable(transform.skewAxis, frame, context) : 0,
  };
}

function offsetClosedPath(pathData: PathData, offset: number): PathData {
  if (!pathData.closed || pathData.vertices.length < 3 || offset === 0) {
    return pathData;
  }

  const sampled = sampleClosedPath(pathData, 48);
  if (sampled.length < 3) {
    return pathData;
  }

  const vertices = offsetClosedPolylineWithRoundJoins(sampled, offset);
  return {
    ...pathData,
    vertices,
    inTangents: vertices.map(() => ({ x: 0, y: 0 })),
    outTangents: vertices.map(() => ({ x: 0, y: 0 })),
  };
}

function sampleClosedPath(pathData: PathData, samplesPerSegment: number): Point[] {
  const points: Point[] = [];
  const count = pathData.vertices.length;
  for (let index = 0; index < count; index++) {
    const nextIndex = (index + 1) % count;
    const from = pathData.vertices[index]!;
    const to = pathData.vertices[nextIndex]!;
    const out = pathData.outTangents[index] ?? { x: 0, y: 0 };
    const incoming = pathData.inTangents[nextIndex] ?? { x: 0, y: 0 };
    const cp1 = { x: from.x + out.x, y: from.y + out.y };
    const cp2 = { x: to.x + incoming.x, y: to.y + incoming.y };
    if (index === 0) points.push(from);
    for (let sample = 1; sample <= samplesPerSegment; sample++) {
      points.push(sampleCubicPoint(from, cp1, cp2, to, sample / samplesPerSegment));
    }
  }
  points.pop();
  return points;
}

function sampleCubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * p1.x + 3 * mt * t ** 2 * p2.x + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p1.y + 3 * mt * t ** 2 * p2.y + t ** 3 * p3.y,
  };
}

function offsetClosedPolylineWithRoundJoins(points: Point[], offset: number): Point[] {
  const area = signedPolylineArea(points);
  const outwardSign = area >= 0 ? 1 : -1;
  const result: Point[] = [];
  const arcSteps = 6;

  for (let index = 0; index < points.length; index++) {
    const previous = points[(index - 1 + points.length) % points.length]!;
    const point = points[index]!;
    const next = points[(index + 1) % points.length]!;
    const previousNormal = edgeNormal(previous, point, outwardSign);
    const nextNormal = edgeNormal(point, next, outwardSign);
    const startAngle = Math.atan2(previousNormal.y, previousNormal.x);
    const endAngle = Math.atan2(nextNormal.y, nextNormal.x);
    let delta = endAngle - startAngle;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    for (let step = 0; step <= arcSteps; step++) {
      const angle = startAngle + delta * (step / arcSteps);
      result.push({
        x: point.x + Math.cos(angle) * offset,
        y: point.y + Math.sin(angle) * offset,
      });
    }
  }

  return result;
}

function signedPolylineArea(points: Point[]): number {
  let area = 0;
  for (let index = 0; index < points.length; index++) {
    const current = points[index]!;
    const next = points[(index + 1) % points.length]!;
    area += current.x * next.y - next.x * current.y;
  }
  return area / 2;
}

function edgeNormal(from: Point, to: Point, sign: number): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length <= 1e-9) return { x: 0, y: 0 };
  return {
    x: (sign * dy) / length,
    y: (sign * -dx) / length,
  };
}

/**
 * Apply a Lottie round-corners modifier to a path. Each sharp corner is
 * replaced with a quadratic arc sampled into line segments.
 */
function roundPathCorners(pathData: PathData, radius: number): PathData {
  if (radius <= 0 || pathData.vertices.length < 2) {
    return pathData;
  }

  const count = pathData.vertices.length;
  const closed = pathData.closed;
  const vertices: Point[] = [];
  const inTangents: Point[] = [];
  const outTangents: Point[] = [];
  const segmentsPerCorner = 6;

  const zeroTangent: Point = { x: 0, y: 0 };

  for (let i = 0; i < count; i += 1) {
    const hasPrev = closed || i > 0;
    const hasNext = closed || i < count - 1;
    if (!hasPrev || !hasNext) {
      vertices.push(pathData.vertices[i]!);
      inTangents.push(pathData.inTangents[i]!);
      outTangents.push(pathData.outTangents[i]!);
      continue;
    }

    const curr = pathData.vertices[i]!;
    const prev = pathData.vertices[i === 0 ? count - 1 : i - 1]!;
    const next = pathData.vertices[i === count - 1 ? 0 : i + 1]!;
    const v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };
    const len1 = Math.hypot(v1.x, v1.y);
    const len2 = Math.hypot(v2.x, v2.y);

    if (len1 === 0 || len2 === 0) {
      vertices.push(curr);
      inTangents.push(pathData.inTangents[i]!);
      outTangents.push(pathData.outTangents[i]!);
      continue;
    }

    const r = Math.min(radius, len1 / 2, len2 / 2);
    if (r <= 0.5) {
      vertices.push(curr);
      inTangents.push(pathData.inTangents[i]!);
      outTangents.push(pathData.outTangents[i]!);
      continue;
    }

    const a = {
      x: curr.x + (v1.x / len1) * r,
      y: curr.y + (v1.y / len1) * r,
    };
    const b = {
      x: curr.x + (v2.x / len2) * r,
      y: curr.y + (v2.y / len2) * r,
    };

    vertices.push(a);
    inTangents.push(zeroTangent);
    outTangents.push(zeroTangent);

    for (let s = 1; s < segmentsPerCorner; s += 1) {
      const t = s / segmentsPerCorner;
      const inv = 1 - t;
      const p = {
        x: inv * inv * a.x + 2 * inv * t * curr.x + t * t * b.x,
        y: inv * inv * a.y + 2 * inv * t * curr.y + t * t * b.y,
      };
      vertices.push(p);
      inTangents.push(zeroTangent);
      outTangents.push(zeroTangent);
    }

    vertices.push(b);
    inTangents.push(zeroTangent);
    outTangents.push(zeroTangent);
  }

  return { vertices, inTangents, outTangents, closed };
}
