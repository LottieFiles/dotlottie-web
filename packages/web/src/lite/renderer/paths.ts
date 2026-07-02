import type {
  EllipseShape,
  PathData,
  PathShape,
  Point,
  PolystarShape,
  RectShape,
  Shape,
  Transform,
  TrimPath,
} from '../model';
import { transformToMatrix } from '../model';

export function shapeToPath(shape: Shape): Path2D {
  if (shape.type === 'rect') {
    return buildRectPath(shape as RectShape);
  }
  if (shape.type === 'ellipse') {
    return buildEllipsePath(shape as EllipseShape);
  }
  if (shape.type === 'path') {
    return buildPathPath(shape as PathShape);
  }
  if (shape.type === 'polystar') {
    return buildPolystarPath(shape as PolystarShape);
  }
  return new Path2D();
}

export function transformPath(path: Path2D, transform: Transform): Path2D {
  const matrix = transformToMatrix(transform);
  const domMatrix = new DOMMatrix([matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f]);
  const result = new Path2D();
  const resultWithAddPath = result as unknown as { addPath?: (p: Path2D, m?: DOMMatrix) => void };
  if (typeof resultWithAddPath.addPath === 'function') {
    resultWithAddPath.addPath(path, domMatrix);
    return result;
  }
  // Fallback for environments without addPath. Modern browsers all support it;
  // returning the untransformed path is only to keep non-browser tests from
  // throwing.
  return path;
}

export function appendPath(target: Path2D, source: Path2D): void {
  // Prefer the native addPath method, which is supported in all modern
  // browsers and preserves the source geometry exactly.
  const targetWithAddPath = target as unknown as { addPath?: (p: Path2D) => void };
  if (typeof targetWithAddPath.addPath === 'function') {
    targetWithAddPath.addPath(source);
  }
}

export function trimmedEllipsePath(shape: EllipseShape, trim: TrimPath): Path2D {
  const center = shape.center as Point;
  const radius = shape.radius as Point;
  const rx = radius.x / 2;
  const ry = radius.y / 2;
  const ranges = getTrimVisibleRanges(trim);
  const path = new Path2D();
  const baseAngle = -Math.PI / 2;

  for (const [from, to] of ranges) {
    const startAngle = baseAngle + from * Math.PI * 2;
    const endAngle = baseAngle + to * Math.PI * 2;
    path.moveTo(center.x + rx * Math.cos(startAngle), center.y + ry * Math.sin(startAngle));
    path.ellipse(center.x, center.y, rx, ry, 0, startAngle, endAngle);
  }

  if (ranges.length === 1 && ranges[0][0] === 0 && ranges[0][1] === 1) {
    path.closePath();
  }

  return path;
}

export function buildPathFromPathData(data: PathData): Path2D {
  const path = new Path2D();

  if (data.vertices.length === 0) {
    return path;
  }

  const start = data.vertices[0];
  path.moveTo(start.x, start.y);

  for (let i = 0; i < data.vertices.length - 1; i++) {
    const current = data.vertices[i];
    const next = data.vertices[i + 1];
    const outTangent = data.outTangents[i] ?? { x: 0, y: 0 };
    const inTangent = data.inTangents[i + 1] ?? { x: 0, y: 0 };

    if (isZeroPoint(outTangent) && isZeroPoint(inTangent)) {
      path.lineTo(next.x, next.y);
      continue;
    }

    const cp1 = { x: current.x + outTangent.x, y: current.y + outTangent.y };
    const cp2 = { x: next.x + inTangent.x, y: next.y + inTangent.y };

    path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, next.x, next.y);
  }

  if (data.closed && data.vertices.length > 1) {
    const last = data.vertices[data.vertices.length - 1];
    const first = data.vertices[0];
    const outTangent = data.outTangents[data.vertices.length - 1] ?? { x: 0, y: 0 };
    const inTangent = data.inTangents[0] ?? { x: 0, y: 0 };

    if (isZeroPoint(outTangent) && isZeroPoint(inTangent)) {
      path.lineTo(first.x, first.y);
      path.closePath();
      return path;
    }

    const cp1 = { x: last.x + outTangent.x, y: last.y + outTangent.y };
    const cp2 = { x: first.x + inTangent.x, y: first.y + inTangent.y };

    path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, first.x, first.y);
    path.closePath();
  }

  return path;
}

function isZeroPoint(point: Point): boolean {
  return Math.abs(point.x) <= 1e-9 && Math.abs(point.y) <= 1e-9;
}

export function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function shapeToPoints(shape: Shape, segments = 64): Point[] {
  switch (shape.type) {
    case 'rect':
      return rectToPoints(shape as RectShape, segments);
    case 'ellipse':
      return ellipseToPoints(shape as EllipseShape, segments);
    case 'path':
      return pathToPoints(shape as PathShape, segments);
    case 'polystar':
      return polystarToPoints(shape as PolystarShape);
    default:
      return [];
  }
}

export function getTrimVisibleRanges(trim: TrimPath): [number, number][] {
  const start = Number(trim.start ?? 0) / 100;
  const end = Number(trim.end ?? 100) / 100;
  // Lottie trim offset is defined on a 0-360 scale, not 0-100.
  const offset = Number(trim.offset ?? 0) / 360;

  // A span of 100% or more means the entire path is visible regardless of
  // offset. This also prevents start/end from collapsing to the same value
  // after normalization.
  if (Math.abs(end - start) >= 1 - 1e-4) {
    return [[0, 1]];
  }
  if (Math.abs(end - start) <= 1e-6) {
    return [];
  }

  const normalize = (value: number, preserveOne = false): number => {
    const v = value % 1;
    if (preserveOne && Math.abs(v) <= 1e-9 && value > 0) return 1;
    return v < 0 ? v + 1 : v;
  };

  const from = normalize(start + offset);
  const to = normalize(end + offset, true);

  if (from <= to) {
    return [[from, to]];
  }
  return [
    [from, 1],
    [0, to],
  ];
}

export function isFullTrimPath(trim: TrimPath): boolean {
  const ranges = getTrimVisibleRanges(trim);
  return ranges.length === 1 && ranges[0][0] === 0 && ranges[0][1] === 1;
}

export function effectiveTrimPath(shape: Shape): TrimPath | undefined {
  if (shape.trims && shape.trims.length > 0) {
    return composeTrimPaths(shape.trims);
  }
  return shape.trim;
}

export function composeTrimPaths(trims: TrimPath[]): TrimPath | undefined {
  let start = 0;
  let end = 1;
  let lastTrim: TrimPath | undefined;

  for (const trim of trims) {
    lastTrim = trim;
    const ranges = getTrimVisibleRanges(trim);
    if (ranges.length === 0) {
      return { ...trim, start: 0, end: 0, offset: 0 };
    }
    if (ranges.length !== 1) {
      return trim;
    }
    const span = end - start;
    const [rangeStart, rangeEnd] = ranges[0];
    const nextStart = start + span * rangeStart;
    const nextEnd = start + span * rangeEnd;
    start = nextStart;
    end = nextEnd;
  }

  if (!lastTrim) return undefined;
  return {
    ...lastTrim,
    start: start * 100,
    end: end * 100,
    offset: 0,
  };
}

export function getTrimmedPath(shape: Shape, trim: TrimPath): Path2D {
  if (isFullTrimPath(trim)) {
    return shapeToPath(shape);
  }

  if (shape.type === 'ellipse') {
    return trimmedEllipsePath(shape as EllipseShape, trim);
  }

  const points = shapeToPoints(shape, 128);
  if (points.length < 2) return new Path2D();

  const lengths: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1] + distance(points[i - 1], points[i]));
  }
  const total = lengths[lengths.length - 1];
  if (total <= 0) return new Path2D();

  const ranges = getTrimVisibleRanges(trim);
  const path = new Path2D();
  for (const [from, to] of ranges) {
    appendTrimmedSegment(path, points, lengths, from * total, to * total);
  }

  // Close the path only when the trim covers the full perimeter so fills
  // behave as expected on closed shapes.
  if (shapeIsClosed(shape) && ranges.length === 1 && ranges[0][0] === 0 && ranges[0][1] === 1) {
    path.closePath();
  }

  return path;
}

export function appendTrimmedSegment(path: Path2D, points: Point[], lengths: number[], from: number, to: number): void {
  const total = lengths[lengths.length - 1];
  const clampedFrom = Math.max(0, Math.min(from, total));
  const clampedTo = Math.max(0, Math.min(to, total));
  if (clampedFrom >= clampedTo) return;

  const interpolate = (dist: number): Point => {
    const index = lengths.findIndex((len) => len >= dist);
    if (index <= 0) return points[0];
    if (index >= points.length) return points[points.length - 1];
    const prev = lengths[index - 1];
    const segmentLength = lengths[index] - prev;
    const t = segmentLength > 0 ? (dist - prev) / segmentLength : 0;
    const a = points[index - 1];
    const b = points[index];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  };

  const startPoint = interpolate(clampedFrom);
  path.moveTo(startPoint.x, startPoint.y);

  let i = lengths.findIndex((len) => len >= clampedFrom);
  if (i < 0) i = points.length;
  while (i < points.length && lengths[i] < clampedTo) {
    path.lineTo(points[i].x, points[i].y);
    i++;
  }

  const endPoint = interpolate(clampedTo);
  path.lineTo(endPoint.x, endPoint.y);
}

function buildRectPath(shape: RectShape): Path2D {
  const { x, y, width, height } = shape.rect;
  const r = Math.min(numericAnimatable(shape.cornerRadius), width / 2, height / 2);
  const path = new Path2D();
  path.moveTo(x + r, y);
  path.lineTo(x + width - r, y);
  path.arcTo(x + width, y, x + width, y + r, r);
  path.lineTo(x + width, y + height - r);
  path.arcTo(x + width, y + height, x + width - r, y + height, r);
  path.lineTo(x + r, y + height);
  path.arcTo(x, y + height, x, y + height - r, r);
  path.lineTo(x, y + r);
  path.arcTo(x, y, x + r, y, r);
  path.closePath();
  return path;
}

function buildEllipsePath(shape: EllipseShape): Path2D {
  const center = shape.center as Point;
  const radius = shape.radius as Point;
  const path = new Path2D();
  // Lottie ellipses are clockwise starting at the top-center.
  path.ellipse(center.x, center.y, radius.x / 2, radius.y / 2, 0, -Math.PI / 2, Math.PI * 1.5);
  path.closePath();
  return path;
}

function buildPathPath(shape: PathShape): Path2D {
  return buildPathFromPathData(shape.path as PathData);
}

function buildPolystarPath(shape: PolystarShape): Path2D {
  const cornerRadius = numericAnimatable(shape.cornerRadius);
  const geometryShape =
    cornerRadius > 0 && shape.starType === 'star'
      ? { ...shape, outerRadius: shape.outerRadius + cornerRadius * 0.36 }
      : shape;
  const offset = numericAnimatable(shape.offset);
  if (
    shape.offsetLineJoin === 'round' &&
    Math.abs(offset) > 1e-9 &&
    shape.starType === 'star' &&
    (shape.outerRoundness > 0 || shape.innerRoundness > 0)
  ) {
    const baseVertices = polystarVertexData({ ...geometryShape, offset: 0 });
    return closedPolylinePath(
      roundOffsetPolyline(
        baseVertices.map((vertex) => vertex.point),
        offset,
      ),
    );
  }
  const vertices = polystarVertexData(geometryShape);
  const points = vertices.map((vertex) => vertex.point);
  if (cornerRadius > 0) {
    return roundedClosedPolylinePath(points, cornerRadius);
  }
  if (vertices.some((vertex) => vertex.roundness > 0)) {
    return roundedPolystarPath(vertices);
  }

  const path = new Path2D();
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (i === 0) {
      path.moveTo(point.x, point.y);
    } else {
      path.lineTo(point.x, point.y);
    }
  }
  path.closePath();
  return path;
}

function polystarVertices(shape: PolystarShape): Point[] {
  return polystarVertexData(shape).map((vertex) => vertex.point);
}

interface PolystarVertex {
  point: Point;
  radius: number;
  roundness: number;
}

function polystarVertexData(shape: PolystarShape): PolystarVertex[] {
  const { center, starType, outerRadius, innerRadius, rotation } = shape;
  const rotationRad = (rotation * Math.PI) / 180;
  const pointCount = Math.max(2, Math.round(shape.points));
  const vertices: PolystarVertex[] = [];

  if (starType === 'polygon') {
    const pointCount = Math.max(2, Math.floor(shape.points));
    const step = (2 * Math.PI) / pointCount;
    for (let i = 0; i < pointCount; i++) {
      const angle = rotationRad + i * step - Math.PI / 2;
      const x = center.x + outerRadius * Math.cos(angle);
      const y = center.y + outerRadius * Math.sin(angle);
      vertices.push({
        point: { x, y },
        radius: outerRadius,
        roundness: Math.max(0, shape.outerRoundness),
      });
    }
    return offsetPolystarVertices(vertices, center, numericAnimatable(shape.offset));
  }

  const step = Math.PI / Math.max(2, shape.points);
  const count = pointCount * 2;
  for (let i = 0; i < count; i++) {
    const isOuter = i % 2 === 0;
    const radius = isOuter ? outerRadius : innerRadius;
    const angle = rotationRad + i * step - Math.PI / 2;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    vertices.push({
      point: { x, y },
      radius,
      roundness: Math.max(0, isOuter ? shape.outerRoundness : shape.innerRoundness),
    });
  }
  return offsetPolystarVertices(vertices, center, numericAnimatable(shape.offset));
}

function closedPolylinePath(points: Point[]): Path2D {
  const path = new Path2D();
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (i === 0) path.moveTo(point.x, point.y);
    else path.lineTo(point.x, point.y);
  }
  path.closePath();
  return path;
}

function roundOffsetPolyline(points: Point[], offset: number): Point[] {
  if (points.length < 3 || Math.abs(offset) <= 1e-9) return points;

  const sign = signedArea(points) >= 0 ? 1 : -1;
  const result: Point[] = [];
  const arcSteps = 6;
  for (let index = 0; index < points.length; index++) {
    const previous = points[(index - 1 + points.length) % points.length];
    const point = points[index];
    const next = points[(index + 1) % points.length];
    const previousNormal = edgeNormalWithSign(previous, point, sign);
    const nextNormal = edgeNormalWithSign(point, next, sign);
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

function signedArea(points: Point[]): number {
  let area = 0;
  for (let index = 0; index < points.length; index++) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current.x * next.y - next.x * current.y;
  }
  return area / 2;
}

function edgeNormalWithSign(from: Point, to: Point, sign: number): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length <= 1e-9) return { x: 0, y: 0 };
  return {
    x: (sign * dy) / length,
    y: (sign * -dx) / length,
  };
}

function offsetPolystarVertices(vertices: PolystarVertex[], center: Point, offset: number): PolystarVertex[] {
  if (vertices.length < 3 || Math.abs(offset) <= 1e-9) {
    return vertices;
  }
  const points = vertices.map((vertex) => vertex.point);
  const offsetPoints = offsetClosedPolyline(points, center, offset);
  return vertices.map((vertex, index) => ({
    ...vertex,
    point: offsetPoints[index] ?? vertex.point,
    radius: distance(offsetPoints[index] ?? vertex.point, center),
  }));
}

function offsetClosedPolyline(points: Point[], center: Point, offset: number): Point[] {
  const normals = points.map((point, index) => {
    const next = points[(index + 1) % points.length];
    return outwardEdgeNormal(point, next, center);
  });

  return points.map((point, index) => {
    const prevIndex = (index - 1 + points.length) % points.length;
    const nextIndex = index;
    const prev = points[prevIndex];
    const next = points[(index + 1) % points.length];
    const prevNormal = normals[prevIndex];
    const nextNormal = normals[nextIndex];
    const prevLineStart = {
      x: prev.x + prevNormal.x * offset,
      y: prev.y + prevNormal.y * offset,
    };
    const prevLineEnd = {
      x: point.x + prevNormal.x * offset,
      y: point.y + prevNormal.y * offset,
    };
    const nextLineStart = {
      x: point.x + nextNormal.x * offset,
      y: point.y + nextNormal.y * offset,
    };
    const nextLineEnd = {
      x: next.x + nextNormal.x * offset,
      y: next.y + nextNormal.y * offset,
    };
    const intersection = intersectLines(prevLineStart, prevLineEnd, nextLineStart, nextLineEnd);
    if (!intersection) {
      return {
        x: point.x + ((prevNormal.x + nextNormal.x) / 2) * offset,
        y: point.y + ((prevNormal.y + nextNormal.y) / 2) * offset,
      };
    }
    const distanceFromPoint = distance(point, intersection);
    const maxMiter = Math.max(1, Math.abs(offset) * 12);
    if (distanceFromPoint > maxMiter) {
      const dx = point.x - center.x;
      const dy = point.y - center.y;
      const length = Math.hypot(dx, dy);
      if (length <= 1e-9) return point;
      return {
        x: point.x + (dx / length) * maxMiter * Math.sign(offset),
        y: point.y + (dy / length) * maxMiter * Math.sign(offset),
      };
    }
    return intersection;
  });
}

function outwardEdgeNormal(from: Point, to: Point, center: Point): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length <= 1e-9) return { x: 0, y: 0 };
  const normalA = { x: -dy / length, y: dx / length };
  const normalB = { x: dy / length, y: -dx / length };
  const midpoint = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const radial = { x: midpoint.x - center.x, y: midpoint.y - center.y };
  const dotA = normalA.x * radial.x + normalA.y * radial.y;
  const dotB = normalB.x * radial.x + normalB.y * radial.y;
  return dotA >= dotB ? normalA : normalB;
}

function intersectLines(a1: Point, a2: Point, b1: Point, b2: Point): Point | undefined {
  const r = { x: a2.x - a1.x, y: a2.y - a1.y };
  const s = { x: b2.x - b1.x, y: b2.y - b1.y };
  const denominator = cross(r, s);
  if (Math.abs(denominator) <= 1e-9) {
    return undefined;
  }
  const delta = { x: b1.x - a1.x, y: b1.y - a1.y };
  const t = cross(delta, s) / denominator;
  return {
    x: a1.x + r.x * t,
    y: a1.y + r.y * t,
  };
}

function cross(a: Point, b: Point): number {
  return a.x * b.y - a.y * b.x;
}

function roundedPolystarPath(vertices: PolystarVertex[]): Path2D {
  const path = new Path2D();
  if (vertices.length === 0) return path;
  path.moveTo(vertices[0].point.x, vertices[0].point.y);

  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const segmentLength = distance(current.point, next.point);
    if (segmentLength <= 1e-6) continue;

    const currentHandle = polystarHandleLength(current, segmentLength);
    const nextHandle = polystarHandleLength(next, segmentLength);
    const ux = (next.point.x - current.point.x) / segmentLength;
    const uy = (next.point.y - current.point.y) / segmentLength;
    const cp1 = {
      x: current.point.x + ux * currentHandle,
      y: current.point.y + uy * currentHandle,
    };
    const cp2 = {
      x: next.point.x - ux * nextHandle,
      y: next.point.y - uy * nextHandle,
    };
    path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, next.point.x, next.point.y);
  }

  path.closePath();
  return path;
}

function polystarHandleLength(vertex: PolystarVertex, segmentLength: number): number {
  const roundedness = Math.max(0, vertex.roundness) / 100;
  return Math.min(segmentLength / 2, vertex.radius * roundedness * 0.47829);
}

function numericAnimatable(value: unknown): number {
  return typeof value === 'number' ? value : 0;
}

function roundedClosedPolylinePath(vertices: Point[], radius: number): Path2D {
  const path = new Path2D();
  if (vertices.length === 0) return path;
  if (vertices.length < 3 || radius <= 0) {
    for (let i = 0; i < vertices.length; i++) {
      const point = vertices[i];
      if (i === 0) path.moveTo(point.x, point.y);
      else path.lineTo(point.x, point.y);
    }
    path.closePath();
    return path;
  }

  for (let i = 0; i < vertices.length; i++) {
    const prev = vertices[(i - 1 + vertices.length) % vertices.length];
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const prevDistance = distance(prev, current);
    const nextDistance = distance(current, next);
    const cut = Math.min(radius, prevDistance / 2, nextDistance / 2);
    const start = interpolateToward(current, prev, cut);
    const end = interpolateToward(current, next, cut);

    if (i === 0) {
      path.moveTo(start.x, start.y);
    } else {
      path.lineTo(start.x, start.y);
    }
    path.quadraticCurveTo(current.x, current.y, end.x, end.y);
  }

  path.closePath();
  return path;
}

function interpolateToward(from: Point, to: Point, amount: number): Point {
  const length = distance(from, to);
  if (length <= 0) return from;
  const t = amount / length;
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}

function sampleCubicBezier(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const oneMinusT = 1 - t;
  const x =
    oneMinusT * oneMinusT * oneMinusT * p0.x +
    3 * oneMinusT * oneMinusT * t * p1.x +
    3 * oneMinusT * t * t * p2.x +
    t * t * t * p3.x;
  const y =
    oneMinusT * oneMinusT * oneMinusT * p0.y +
    3 * oneMinusT * oneMinusT * t * p1.y +
    3 * oneMinusT * t * t * p2.y +
    t * t * t * p3.y;
  return { x, y };
}

function rectToPoints(shape: RectShape, segments = 64): Point[] {
  const { x, y, width, height } = shape.rect;
  const r = Math.min(numericAnimatable(shape.cornerRadius), width / 2, height / 2);
  const arcSteps = Math.max(2, Math.floor(segments / 4));
  const points: Point[] = [];

  const addLine = (from: Point, to: Point) => {
    points.push(from, to);
  };

  const addArc = (center: Point, startAngle: number, endAngle: number) => {
    for (let i = 0; i <= arcSteps; i++) {
      const t = i / arcSteps;
      const angle = startAngle + (endAngle - startAngle) * t;
      points.push({ x: center.x + r * Math.cos(angle), y: center.y + r * Math.sin(angle) });
    }
  };

  addLine({ x: x + r, y }, { x: x + width - r, y });
  addArc({ x: x + width - r, y: y + r }, -Math.PI / 2, 0);
  addLine({ x: x + width, y: y + r }, { x: x + width, y: y + height - r });
  addArc({ x: x + width - r, y: y + height - r }, 0, Math.PI / 2);
  addLine({ x: x + width - r, y: y + height }, { x: x + r, y: y + height });
  addArc({ x: x + r, y: y + height - r }, Math.PI / 2, Math.PI);
  addLine({ x, y: y + height - r }, { x, y: y + r });
  addArc({ x: x + r, y: y + r }, Math.PI, (Math.PI * 3) / 2);

  return points;
}

function ellipseToPoints(shape: EllipseShape, segments = 64): Point[] {
  const center = shape.center as Point;
  const radius = shape.radius as Point;
  const rx = radius.x / 2;
  const ry = radius.y / 2;
  const points: Point[] = [];
  // Sample clockwise from the top-center to match the drawn ellipse.
  for (let i = 0; i <= segments; i++) {
    const angle = -Math.PI / 2 + (i / segments) * Math.PI * 2;
    points.push({ x: center.x + rx * Math.cos(angle), y: center.y + ry * Math.sin(angle) });
  }
  return points;
}

function polystarToPoints(shape: PolystarShape): Point[] {
  const points = polystarVertices(shape);
  return points.length > 0 ? [...points, points[0]] : points;
}

function pathToPoints(shape: PathShape, segments = 64): Point[] {
  const data = shape.path as unknown as PathData;
  if (data.vertices.length === 0) return [];
  const points: Point[] = [];
  const vertexCount = data.vertices.length;
  const samplesPerSegment = Math.max(2, Math.floor(segments / Math.max(1, vertexCount)));

  const sampleSegment = (fromIndex: number, toIndex: number) => {
    const current = data.vertices[fromIndex];
    const next = data.vertices[toIndex];
    const outTangent = data.outTangents[fromIndex] ?? { x: 0, y: 0 };
    const inTangent = data.inTangents[toIndex] ?? { x: 0, y: 0 };
    const cp1 = { x: current.x + outTangent.x, y: current.y + outTangent.y };
    const cp2 = { x: next.x + inTangent.x, y: next.y + inTangent.y };
    for (let s = 1; s <= samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      points.push(sampleCubicBezier(current, cp1, cp2, next, t));
    }
  };

  points.push(data.vertices[0]);
  for (let i = 0; i < vertexCount - 1; i++) {
    sampleSegment(i, i + 1);
  }

  if (data.closed && vertexCount > 1) {
    sampleSegment(vertexCount - 1, 0);
  }

  return points;
}

function shapeIsClosed(shape: Shape): boolean {
  if (shape.type === 'path') {
    return ((shape as PathShape).path as unknown as PathData).closed ?? false;
  }
  return shape.type === 'rect' || shape.type === 'ellipse' || shape.type === 'polystar';
}
