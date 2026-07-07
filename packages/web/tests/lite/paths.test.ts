import { describe, expect, it } from 'vitest';
import type { PathData, PolystarShape, RectShape } from '../../src/lite/model';
import {
  composeTrimPaths,
  getTrimVisibleRanges,
  reversePathData,
  shapeToPath,
  shapeToPoints,
} from '../../src/lite/renderer/paths';

describe('paths', () => {
  it('treats floating point near-full trim spans as full paths', () => {
    expect(
      getTrimVisibleRanges({
        start: 100,
        end: 0.000003,
        offset: 0,
        mode: 'simultaneous',
      }),
    ).toEqual([[0, 1]]);
  });

  it('composes multiple trim paths sequentially', () => {
    const trim = composeTrimPaths([
      {
        start: 25,
        end: 75,
        offset: 0,
        mode: 'individual',
      },
      {
        start: 50,
        end: 100,
        offset: 0,
        mode: 'individual',
      },
    ]);

    expect(trim?.start).toBe(50);
    expect(trim?.end).toBe(75);
  });

  it('uses cubic segments for intrinsic polystar roundness', () => {
    const originalPath2D = globalThis.Path2D;
    const commands: string[] = [];
    class RecordingPath2D {
      moveTo() {
        commands.push('moveTo');
      }
      lineTo() {
        commands.push('lineTo');
      }
      bezierCurveTo() {
        commands.push('bezierCurveTo');
      }
      closePath() {
        commands.push('closePath');
      }
    }
    globalThis.Path2D = RecordingPath2D as unknown as typeof Path2D;
    try {
      shapeToPath({
        id: 'rounded-star',
        type: 'polystar',
        starType: 'star',
        center: { x: 0, y: 0 },
        points: 5,
        outerRadius: 50,
        innerRadius: 20,
        outerRoundness: 10,
        innerRoundness: 5,
        rotation: 0,
      } as PolystarShape);
    } finally {
      globalThis.Path2D = originalPath2D;
    }

    expect(commands).toContain('bezierCurveTo');
    expect(commands).not.toContain('lineTo');
  });

  it('expands rounded-corner star outer vertices before drawing rounded corners', () => {
    const originalPath2D = globalThis.Path2D;
    const commands: Array<[string, number, number]> = [];
    class RecordingPath2D {
      moveTo(x: number, y: number) {
        commands.push(['moveTo', x, y]);
      }
      lineTo(x: number, y: number) {
        commands.push(['lineTo', x, y]);
      }
      quadraticCurveTo(_cx: number, _cy: number, x: number, y: number) {
        commands.push(['quadraticCurveTo', x, y]);
      }
      closePath() {
        commands.push(['closePath', 0, 0]);
      }
    }
    globalThis.Path2D = RecordingPath2D as unknown as typeof Path2D;
    try {
      shapeToPath({
        id: 'rounded-corner-star',
        type: 'polystar',
        starType: 'star',
        center: { x: 0, y: 0 },
        points: 5,
        outerRadius: 50,
        innerRadius: 20,
        outerRoundness: 0,
        innerRoundness: 0,
        rotation: 0,
        cornerRadius: 25,
      } as PolystarShape);
    } finally {
      globalThis.Path2D = originalPath2D;
    }

    const minY = Math.min(...commands.map(([, , y]) => y));
    expect(minY).toBeLessThan(-35);
  });

  it('uses circular arcs for rounded rectangle corners', () => {
    const originalPath2D = globalThis.Path2D;
    const commands: string[] = [];
    class RecordingPath2D {
      moveTo() {
        commands.push('moveTo');
      }
      lineTo() {
        commands.push('lineTo');
      }
      arcTo() {
        commands.push('arcTo');
      }
      quadraticCurveTo() {
        commands.push('quadraticCurveTo');
      }
      closePath() {
        commands.push('closePath');
      }
    }
    globalThis.Path2D = RecordingPath2D as unknown as typeof Path2D;
    try {
      shapeToPath({
        id: 'rounded-rect',
        type: 'rect',
        rect: { x: -50, y: -50, width: 100, height: 100 },
        position: { x: 0, y: 0 },
        size: { x: 100, y: 100 },
        cornerRadius: 50,
      } as RectShape);
    } finally {
      globalThis.Path2D = originalPath2D;
    }

    expect(commands.filter((command) => command === 'arcTo')).toHaveLength(4);
    expect(commands).not.toContain('quadraticCurveTo');
  });

  it('offsets star vertices from polygon edge normals', () => {
    const points = shapeToPoints({
      id: 'offset-star',
      type: 'polystar',
      starType: 'star',
      center: { x: 0, y: 0 },
      points: 5,
      outerRadius: 50,
      innerRadius: 20,
      outerRoundness: 0,
      innerRoundness: 0,
      rotation: 0,
      offset: 10,
    } as PolystarShape);

    const innerPoint = points[1]!;
    const innerRadius = Math.hypot(innerPoint.x, innerPoint.y);

    expect(innerRadius).toBeGreaterThan(30);
  });

  it('uses offset vertex radii for rounded polystar handles', () => {
    const originalPath2D = globalThis.Path2D;
    const commands: Array<[string, ...number[]]> = [];
    class RecordingPath2D {
      moveTo(x: number, y: number) {
        commands.push(['moveTo', x, y]);
      }
      lineTo(x: number, y: number) {
        commands.push(['lineTo', x, y]);
      }
      bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number) {
        commands.push(['bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y]);
      }
      closePath() {
        commands.push(['closePath']);
      }
    }
    globalThis.Path2D = RecordingPath2D as unknown as typeof Path2D;
    try {
      shapeToPath({
        id: 'offset-rounded-star',
        type: 'polystar',
        starType: 'star',
        center: { x: 0, y: 0 },
        points: 5,
        outerRadius: 50,
        innerRadius: 20,
        outerRoundness: 20,
        innerRoundness: 0,
        rotation: 0,
        offset: 10,
      } as PolystarShape);
    } finally {
      globalThis.Path2D = originalPath2D;
    }

    const move = commands.find((command) => command[0] === 'moveTo');
    const curve = commands.find((command) => command[0] === 'bezierCurveTo');
    expect(move).toBeDefined();
    expect(curve).toBeDefined();
    const handleLength = Math.hypot(Number(curve?.[1]) - Number(move?.[1]), Number(curve?.[2]) - Number(move?.[2]));

    // Must exceed the handle computed from the UN-offset outer radius
    // (star perimSegment = step*r/2), proving the offset radius was used.
    expect(handleLength).toBeGreaterThan(((Math.PI / 5) * 50 * 0.2) / 2);
  });

  it('uses round offset joins for rounded polystars when requested by Offset Paths', () => {
    const originalPath2D = globalThis.Path2D;
    const commands: Array<[string, ...number[]]> = [];
    class RecordingPath2D {
      moveTo(x: number, y: number) {
        commands.push(['moveTo', x, y]);
      }
      lineTo(x: number, y: number) {
        commands.push(['lineTo', x, y]);
      }
      bezierCurveTo(...args: number[]) {
        commands.push(['bezierCurveTo', ...args]);
      }
      closePath() {
        commands.push(['closePath']);
      }
    }
    globalThis.Path2D = RecordingPath2D as unknown as typeof Path2D;
    try {
      shapeToPath({
        id: 'round-offset-rounded-star',
        type: 'polystar',
        starType: 'star',
        center: { x: 0, y: 0 },
        points: 5,
        outerRadius: 50,
        innerRadius: 20,
        outerRoundness: 20,
        innerRoundness: 5,
        rotation: 0,
        offset: 10,
        offsetLineJoin: 'round',
      } as PolystarShape);
    } finally {
      globalThis.Path2D = originalPath2D;
    }

    expect(commands.filter((command) => command[0] === 'lineTo').length).toBeGreaterThan(20);
    expect(commands.some((command) => command[0] === 'bezierCurveTo')).toBe(false);
  });

  it('uses fractional star point counts for angular spacing', () => {
    const points = shapeToPoints({
      id: 'fractional-star',
      type: 'polystar',
      starType: 'star',
      center: { x: 0, y: 0 },
      points: 5.3,
      outerRadius: 50,
      innerRadius: 20,
      outerRoundness: 0,
      innerRoundness: 0,
      rotation: 0,
    } as PolystarShape);

    expect(points).toHaveLength(11);
    expect(points[1]!.x).toBeCloseTo(20 * Math.cos(-Math.PI / 2 + Math.PI / 5.3));
    expect(points[1]!.y).toBeCloseTo(20 * Math.sin(-Math.PI / 2 + Math.PI / 5.3));
  });

  it('floors fractional polygon point counts to match ThorVG', () => {
    const points = shapeToPoints({
      id: 'fractional-polygon',
      type: 'polystar',
      starType: 'polygon',
      center: { x: 0, y: 0 },
      points: 5.5,
      outerRadius: 35,
      innerRadius: 0,
      outerRoundness: 20,
      innerRoundness: 0,
      rotation: 0,
    } as PolystarShape);

    expect(points).toHaveLength(6);
    expect(points[0]).toEqual(points[5]);
  });

  it('reverses a path contour winding (Lottie direction d=3)', () => {
    const data: PathData = {
      vertices: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
      ],
      inTangents: [
        { x: -1, y: 0 },
        { x: -2, y: 0 },
        { x: -3, y: 0 },
      ],
      outTangents: [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
      ],
      closed: true,
    };

    const reversed = reversePathData(data);

    // Vertices traverse in reverse order.
    expect(reversed.vertices).toEqual([
      { x: 10, y: 10 },
      { x: 10, y: 0 },
      { x: 0, y: 0 },
    ]);
    // The tangent leaving a vertex in the reversed traversal is its original
    // arriving (in) tangent, and vice-versa.
    expect(reversed.outTangents).toEqual([
      { x: -3, y: 0 },
      { x: -2, y: 0 },
      { x: -1, y: 0 },
    ]);
    expect(reversed.inTangents).toEqual([
      { x: 3, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 0 },
    ]);
    expect(reversed.closed).toBe(true);
    // Original data is not mutated.
    expect(data.vertices[0]).toEqual({ x: 0, y: 0 });
  });

  it('rounds polystar points with radius-perpendicular tangents (lottie-web formula)', () => {
    const previousPath2D = globalThis.Path2D;
    const beziers: number[][] = [];
    class MockPath2D {
      moveTo() {}
      lineTo() {}
      closePath() {}
      bezierCurveTo(...args: number[]) {
        beziers.push(args);
      }
    }
    globalThis.Path2D = MockPath2D as unknown as typeof Path2D;
    try {
      // Square polygon, radius 100, 100% roundness. First vertex is at the top
      // (0,-100); its outgoing tangent must be horizontal (perpendicular to the
      // vertical radius), length = perimSegment * 1 where lottie-web's polygon
      // perimSegment = 2πr/(numPts*4) = (2π*100)/(4*4) ≈ 39.27.
      shapeToPath({
        id: 'rounded-square',
        type: 'polystar',
        starType: 'polygon',
        center: { x: 0, y: 0 },
        points: 4,
        outerRadius: 100,
        innerRadius: 0,
        outerRoundness: 100,
        innerRoundness: 0,
        rotation: 0,
      } as PolystarShape);
    } finally {
      globalThis.Path2D = previousPath2D;
    }
    expect(beziers.length).toBeGreaterThan(0);
    // cp1 of the first segment leaves the top vertex (0,-100) horizontally.
    const [cp1x, cp1y] = beziers[0]!;
    expect(cp1x).toBeCloseTo((2 * Math.PI * 100) / (4 * 4), 1);
    expect(cp1y).toBeCloseTo(-100, 5);
  });
});
