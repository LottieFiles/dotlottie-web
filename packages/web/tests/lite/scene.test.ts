import { describe, expect, it } from 'vitest';
import { buildScene, evaluateAnimatable, multiplyMatrices, transformToMatrix } from '../../src/lite/model/scene';
import type {
  Animatable,
  Animation,
  ColorStop,
  GroupShape,
  LayerDefinition,
  PathData,
  PathShape,
  Point,
  PolystarShape,
  RectShape,
  Shape,
  Transform,
} from '../../src/lite/model/types';

describe('scene', () => {
  it('returns a static value directly', () => {
    const value: Point = { x: 10, y: 20 };
    expect(evaluateAnimatable(value, 0)).toEqual(value);
  });

  it('evaluates animated stroke dash patterns and offsets', () => {
    const animation: Animation = {
      version: 'test',
      width: 100,
      height: 100,
      frameRate: 60,
      duration: 60,
      inPoint: 0,
      outPoint: 60,
      layers: [
        {
          id: 'layer',
          name: 'Layer',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 60,
          startTime: 0,
          transform: {
            position: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [
            {
              id: 'shape',
              type: 'path',
              path: { vertices: [], inTangents: [], outTangents: [], closed: false },
              stroke: {
                type: 'solid',
                color: { r: 255, g: 255, b: 255, a: 1 },
                width: 1,
                opacity: 100,
                lineCap: 'butt',
                lineJoin: 'miter',
                miterLimit: 4,
                dash: [
                  {
                    keyframes: [
                      { time: 0, value: 10 },
                      { time: 60, value: 20 },
                    ],
                  },
                  5,
                ],
                dashOffset: {
                  keyframes: [
                    { time: 0, value: 0 },
                    { time: 60, value: 30 },
                  ],
                },
              },
            } as PathShape,
          ],
          visible: true,
        },
      ],
    };

    const stroke = buildScene(animation, 30)[0]!.shapes[0]!.stroke;
    const resolved = Array.isArray(stroke) ? stroke[0] : stroke;

    expect(resolved?.dash).toEqual([15, 5]);
    expect(resolved?.dashOffset).toBe(15);
  });

  it('interpolates separate dimension animated positions', () => {
    const value = {
      x: {
        keyframes: [
          { time: 55, value: 132.5 },
          { time: 268, value: 132.5 },
        ],
      },
      y: {
        keyframes: [
          { time: 55, value: 230.5, outTangent: { x: 0.167, y: 0 }, inTangent: { x: 0.833, y: 1 } },
          { time: 268, value: 72.5, outTangent: { x: 0.167, y: 0 }, inTangent: { x: 0.833, y: 1 } },
        ],
      },
    };
    const atStart = evaluateAnimatable(value as unknown as Animatable<Point>, 55);
    const atEnd = evaluateAnimatable(value as unknown as Animatable<Point>, 268);
    const atMid = evaluateAnimatable(value as unknown as Animatable<Point>, 119);
    expect(atStart).toEqual({ x: 132.5, y: 230.5 });
    expect(atEnd).toEqual({ x: 132.5, y: 72.5 });
    expect(atMid.y).toBeLessThan(230.5);
    expect(atMid.y).toBeGreaterThan(72.5);
  });

  it('uses temporal easing when point keyframes have zero spatial handles', () => {
    const value: Animatable<Point> = {
      keyframes: [
        {
          time: 34,
          value: { x: 15.569, y: 16.341 },
          outTangent: { x: 0.041, y: 1 },
          to: { x: 0, y: 0 },
        },
        {
          time: 75,
          value: { x: 59.546, y: 41.148 },
          inTangent: { x: 0.66, y: 1 },
          ti: { x: 0, y: 0 },
        },
      ],
    };

    const eased = evaluateAnimatable(value, 44);

    expect(eased.x).toBeGreaterThan(40);
    expect(eased.y).toBeGreaterThan(30);
  });

  it('maps temporal bezier progress onto spatial point paths', () => {
    const value: Animatable<Point> = {
      keyframes: [
        {
          time: 0,
          value: { x: 0, y: 0 },
          outTangent: { x: 0, y: 0 },
          to: { x: 100, y: 0 },
        },
        {
          time: 35,
          value: { x: 0, y: 10 },
          inTangent: { x: 0.145, y: 1 },
          ti: { x: 100, y: 0 },
        },
      ],
    };

    const eased = evaluateAnimatable(value, 15);

    expect(eased.x).toBeLessThan(40);
    expect(eased.y).toBeGreaterThan(9);
  });

  it('uses temporal bezier progress when interpolating path vertices', () => {
    const start: PathData = {
      vertices: [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
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
    };
    const end: PathData = {
      vertices: [
        { x: 0, y: 10 },
        { x: 10, y: 10 },
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
    };
    const value: Animatable<PathData> = {
      keyframes: [
        {
          time: 0,
          value: start,
          outTangent: { x: 0, y: 0 },
        },
        {
          time: 35,
          value: end,
          inTangent: { x: 0.145, y: 1 },
        },
      ],
    };

    const eased = evaluateAnimatable(value, 15);

    expect(eased.vertices[0]!.y).toBeGreaterThan(8);
  });

  it('includes skew and skew axis in transform matrices', () => {
    const matrix = transformToMatrix({
      position: { x: 0, y: 0 },
      anchor: { x: 0, y: 0 },
      scale: { x: 100, y: 100 },
      rotation: 0,
      opacity: 100,
      skew: 45,
      skewAxis: 0,
    });

    expect(matrix.a).toBeCloseTo(1);
    expect(matrix.b).toBeCloseTo(0);
    expect(matrix.c).toBeCloseTo(-1);
    expect(matrix.d).toBeCloseTo(1);
  });

  it('evaluates animated polystar geometry', () => {
    const polygon: PolystarShape = {
      id: 'polygon',
      type: 'polystar',
      starType: 'polygon',
      center: { x: 0, y: 0 },
      points: 3,
      outerRadius: 40,
      innerRadius: 0,
      outerRoundness: 0,
      innerRoundness: 0,
      rotation: 0,
      cornerRadius: 0,
      animatedProperties: {
        points: {
          keyframes: [
            { time: 0, value: 3 },
            { time: 60, value: 8 },
          ],
        },
        outerRadius: {
          keyframes: [
            { time: 0, value: 40 },
            { time: 60, value: 80 },
          ],
        },
        cornerRadius: {
          keyframes: [
            { time: 0, value: 0 },
            { time: 60, value: 20 },
          ],
        },
      },
    };
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 61,
      duration: 61,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'shape',
          name: 'Shape',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 61,
          transform: {
            position: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [polygon],
          visible: true,
        },
      ],
    };

    const scene = buildScene(animation, 60);
    const evaluated = scene[0]!.shapes[0] as PolystarShape;

    expect(evaluated.points).toBe(8);
    expect(evaluated.outerRadius).toBe(80);
    expect(evaluated.cornerRadius).toBe(20);
  });

  it('applies primitive offset paths during scene evaluation', () => {
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 61,
      duration: 61,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'shape',
          name: 'Shape',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 61,
          transform: {
            position: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [
            {
              id: 'rect',
              type: 'rect',
              rect: { x: -25, y: -25, width: 50, height: 50 },
              position: { x: 0, y: 0 },
              size: { x: 50, y: 50 },
              cornerRadius: 5,
              offset: {
                keyframes: [
                  { time: 0, value: 0 },
                  { time: 60, value: 10 },
                ],
              },
            } as RectShape,
            {
              id: 'polygon',
              type: 'polystar',
              starType: 'polygon',
              center: { x: 0, y: 0 },
              points: 5,
              outerRadius: 40,
              innerRadius: 0,
              outerRoundness: 0,
              innerRoundness: 0,
              rotation: 0,
              offset: 10,
            } as PolystarShape,
            {
              id: 'path',
              type: 'path',
              path: {
                vertices: [
                  { x: -10, y: 0 },
                  { x: 0, y: -10 },
                  { x: 10, y: 0 },
                  { x: 0, y: 10 },
                ],
                inTangents: [
                  { x: 0, y: 0 },
                  { x: 0, y: 0 },
                  { x: 0, y: 0 },
                  { x: 0, y: 0 },
                ],
                outTangents: [
                  { x: 0, y: 0 },
                  { x: 0, y: 0 },
                  { x: 0, y: 0 },
                  { x: 0, y: 0 },
                ],
                closed: true,
              },
              offset: 5,
            } as PathShape,
          ],
          visible: true,
        },
      ],
    };

    const scene = buildScene(animation, 60);
    const rect = scene[0]!.shapes[0] as RectShape;
    const polygon = scene[0]!.shapes[1] as PolystarShape;
    const path = scene[0]!.shapes[2] as PathShape;

    expect(rect.size).toEqual({ x: 70, y: 70 });
    expect(rect.cornerRadius).toBe(15);
    expect(polygon.outerRadius).toBe(40);
    expect(polygon.offset).toBe(10);
    const offsetPath = path.path as PathData;
    expect(offsetPath.vertices.length).toBeGreaterThan(1000);
    expect(offsetPath.inTangents.every((point) => point.x === 0 && point.y === 0)).toBe(true);
    expect(offsetPath.outTangents.every((point) => point.x === 0 && point.y === 0)).toBe(true);
    expect(Math.min(...offsetPath.vertices.map((point) => point.x))).toBeLessThan(-10);
    expect(Math.max(...offsetPath.vertices.map((point) => point.x))).toBeGreaterThan(10);
    expect(Math.min(...offsetPath.vertices.map((point) => point.y))).toBeLessThan(-10);
    expect(Math.max(...offsetPath.vertices.map((point) => point.y))).toBeGreaterThan(10);
  });

  it('evaluates animated rectangle corner radius during scene evaluation', () => {
    const rect: RectShape = {
      id: 'rect',
      type: 'rect',
      rect: { x: -40, y: -30, width: 80, height: 60 },
      position: { x: 0, y: 0 },
      size: { x: 80, y: 60 },
      cornerRadius: {
        keyframes: [
          { time: 0, value: 2 },
          { time: 30, value: 30 },
        ],
      },
    };
    const animation: Animation = {
      version: '5.7.4',
      frameRate: 30,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 400,
      height: 400,
      layers: [
        {
          id: 'shape',
          name: 'Shape',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 60,
          transform: {
            position: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [rect],
          visible: true,
        },
      ],
    };

    const scene = buildScene(animation, 15);
    const evaluated = scene[0]!.shapes[0] as RectShape;

    expect(evaluated.cornerRadius).toBeGreaterThan(2);
    expect(evaluated.cornerRadius).toBeLessThan(30);
  });

  it('applies temporal bezier easing to animated gradient stops', () => {
    const value: Animatable<ColorStop[]> = {
      keyframes: [
        {
          time: 0,
          value: [{ offset: 0, color: { r: 0, g: 0, b: 0, a: 1 } }],
          outTangent: { x: 1, y: 0 },
        },
        {
          time: 100,
          value: [{ offset: 1, color: { r: 100, g: 100, b: 100, a: 0 } }],
          inTangent: { x: 1, y: 0 },
        },
      ],
    };

    const atMid = evaluateAnimatable(value, 50);

    expect(atMid[0]!.offset).toBeGreaterThan(0);
    expect(atMid[0]!.offset).toBeLessThan(0.5);
    expect(atMid[0]!.color.r).toBeGreaterThan(0);
    expect(atMid[0]!.color.r).toBeLessThan(50);
    expect(atMid[0]!.color.a).toBeLessThan(1);
    expect(atMid[0]!.color.a).toBeGreaterThan(0.5);
  });

  it('composes parent transforms', () => {
    const parent: Transform = {
      position: { x: 100, y: 100 },
      anchor: { x: 0, y: 0 },
      scale: { x: 50, y: 50 },
      rotation: 0,
      opacity: 100,
    };

    const childLayer: LayerDefinition = {
      id: 'child',
      name: 'Child',
      type: 'shape',
      index: 1,
      ind: 2,
      inPoint: 0,
      outPoint: 60,
      parentId: 1,
      transform: {
        position: { x: 50, y: 0 },
        anchor: { x: 0, y: 0 },
        scale: { x: 100, y: 100 },
        rotation: 0,
        opacity: 100,
      },
      shapes: [],
      visible: true,
    };

    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'parent',
          name: 'Parent',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 60,
          transform: parent,
          shapes: [],
          visible: false,
        },
        childLayer,
      ],
    };

    const scene = buildScene(animation, 0);
    const child = scene.find((l) => l.name === 'Child');
    expect(child).toBeDefined();
    expect(child?.transform.position).toEqual({ x: 125, y: 100 });
    expect(child?.transform.scale).toEqual({ x: 50, y: 50 });
  });

  it('preserves exact matrices for nested parent transforms', () => {
    const parent: Transform = {
      position: { x: 100, y: 50 },
      anchor: { x: 10, y: 20 },
      scale: { x: 150, y: 75 },
      rotation: 30,
      opacity: 100,
    };
    const child: Transform = {
      position: { x: 25, y: -10 },
      anchor: { x: 5, y: 8 },
      scale: { x: 80, y: 120 },
      rotation: -45,
      opacity: 100,
    };

    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'parent',
          name: 'Parent',
          type: 'null',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 60,
          transform: parent,
          shapes: [],
          visible: false,
        },
        {
          id: 'child',
          name: 'Child',
          type: 'shape',
          index: 1,
          ind: 2,
          inPoint: 0,
          outPoint: 60,
          parentId: 1,
          transform: child,
          shapes: [],
          visible: true,
        },
      ],
    };

    const scene = buildScene(animation, 0);
    const resolved = scene.find((layer) => layer.name === 'Child')?.transform;
    const expected = multiplyMatrices(transformToMatrix(parent), transformToMatrix(child));

    expect(resolved?.matrix).toEqual(expected);
    expect(transformToMatrix(resolved as Transform)).toEqual(expected);
  });

  it('evaluates layer content at the local frame offset by startTime', () => {
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'layer',
          name: 'Layer',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 60,
          startTime: 30,
          transform: {
            position: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [],
          visible: true,
        },
      ],
    };

    const scene = buildScene(animation, 30);
    const layer = scene[0];
    expect(layer!.transform.opacity).toBe(100);
  });

  it('evaluates layer content at the time-remapped frame', () => {
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'layer',
          name: 'Layer',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 60,
          timeRemap: 0.5,
          transform: {
            position: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [],
          visible: true,
        },
      ],
    };

    const scene = buildScene(animation, 0);
    const layer = scene[0];
    expect(layer!.transform.opacity).toBe(100);
  });

  it('checks parent-remapped precomp child visibility on the source comp timeline', () => {
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 10,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'child',
          name: 'Child',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 15,
          outPoint: 25,
          startTime: 10,
          transformStartTime: 0,
          parentTimeRemap: 2,
          remappedSourceWindow: true,
          transform: {
            position: {
              keyframes: [
                { time: 0, value: { x: 0, y: 0 } },
                { time: 10, value: { x: 100, y: 0 } },
              ],
            },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [],
          visible: true,
          isPrecompChildContent: true,
        },
      ],
    };

    const scene = buildScene(animation, 0);
    const layer = scene[0];
    expect(layer!.timelineFrame).toBe(20);
    expect(layer!.inPoint).toBe(15);
    expect(layer!.outPoint).toBe(25);
    expect(layer!.transform.position).toEqual({ x: 100, y: 0 });
  });

  it('honors numeric zero parent time-remap values', () => {
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 10,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'zero-remapped-child',
          name: 'Zero remapped child',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 30,
          startTime: 0,
          transformStartTime: 0,
          parentTimeRemap: 0,
          remappedSourceWindow: true,
          transform: {
            position: {
              keyframes: [
                { time: 0, value: { x: 0, y: 0 } },
                { time: 1, value: { x: 10, y: 0 } },
                { time: 20, value: { x: 200, y: 0 } },
              ],
            },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [],
          visible: true,
          isPrecompChildContent: true,
        },
      ],
    };

    const layer = buildScene(animation, 20)[0];

    expect(layer!.timelineFrame).toBe(1);
    expect(layer!.transform.position).toEqual({ x: 10, y: 0 });
  });

  it('offsets inherited parent remapping by the owning precomp start time', () => {
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 10,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'nested-child',
          name: 'Nested child',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 15,
          startTime: 10,
          transformStartTime: 10,
          parentStartTime: 10,
          parentTimeRemap: 2,
          remappedSourceWindow: true,
          transform: {
            position: {
              keyframes: [
                { time: 0, value: { x: 0, y: 0 } },
                { time: 10, value: { x: 100, y: 0 } },
              ],
            },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [],
          visible: true,
          isPrecompChildContent: true,
        },
      ],
    };

    const scene = buildScene(animation, 0);
    const layer = scene[0];
    expect(layer!.timelineFrame).toBe(10);
    expect(layer!.transform.position).toEqual({ x: 100, y: 0 });
  });

  it('does not subtract child start time from source-window transform frames', () => {
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 10,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'source-window-child',
          name: 'Source window child',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 30,
          startTime: 10,
          transformStartTime: 0,
          parentStartTime: 0,
          parentTimeRemap: 2,
          remappedSourceWindow: true,
          transform: {
            position: {
              keyframes: [
                { time: 10, value: { x: 10, y: 0 } },
                { time: 20, value: { x: 20, y: 0 } },
              ],
            },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [],
          visible: true,
          isPrecompChildContent: true,
        },
      ],
    };

    const scene = buildScene(animation, 0);
    const layer = scene[0];
    expect(layer!.timelineFrame).toBe(20);
    expect(layer!.transform.position).toEqual({ x: 20, y: 0 });
  });

  it('honors parent comp visibility for top-level time-remapped source-window children', () => {
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 10,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'source-window-child',
          name: 'Source window child',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 30,
          startTime: 20,
          transformStartTime: 20,
          parentTimeRemap: 2,
          remappedSourceWindow: true,
          sourceWindowParentInPoint: 20,
          sourceWindowParentOutPoint: 40,
          transform: {
            position: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [],
          visible: true,
          isPrecompChildContent: true,
        },
      ],
    };

    expect(buildScene(animation, 0)[0]!.visible).toBe(false);
    const activeLayer = buildScene(animation, 20)[0];
    expect(activeLayer!.visible).toBe(true);
    expect(activeLayer!.timelineFrame).toBe(20);
  });

  it('can evaluate synthetic precomp masks on the nested source timeline', () => {
    const earlyMask: PathData = {
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ],
      inTangents: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      outTangents: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      closed: true,
    };
    const lateMask: PathData = {
      ...earlyMask,
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 900 },
        { x: 0, y: 900 },
      ],
    };
    const transform: Transform = {
      position: { x: 0, y: 0 },
      anchor: { x: 0, y: 0 },
      scale: { x: 100, y: 100 },
      rotation: 0,
      opacity: 100,
    };
    const layer: LayerDefinition = {
      id: 'nested-precomp-mask',
      name: 'Nested precomp mask',
      type: 'precomp',
      index: 0,
      ind: 1,
      inPoint: 0,
      outPoint: 120,
      startTime: -70,
      transformStartTime: -70,
      masksUseContentFrame: true,
      transform,
      shapes: [],
      masks: [
        {
          mode: 'add',
          inverted: false,
          opacity: 100,
          path: {
            keyframes: [
              { time: 20, value: earlyMask },
              { time: 90, value: lateMask },
            ],
          },
        },
      ],
      visible: true,
    };
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 120,
      duration: 120,
      width: 512,
      height: 512,
      layers: [layer],
    };

    const scene = buildScene(animation, 20);

    expect(scene[0]!.timelineFrame).toBe(20);
    expect(scene[0]!.masks?.[0]?.path.vertices[2]?.y).toBe(900);
  });

  it('keeps ordinary precomp masks on the parent composition timeline', () => {
    const earlyMask: PathData = {
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ],
      inTangents: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      outTangents: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      closed: true,
    };
    const lateMask: PathData = {
      ...earlyMask,
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 900 },
        { x: 0, y: 900 },
      ],
    };
    const layer: LayerDefinition = {
      id: 'ordinary-precomp-mask',
      name: 'Ordinary precomp mask',
      type: 'precomp',
      index: 0,
      ind: 1,
      inPoint: 0,
      outPoint: 120,
      startTime: -70,
      transformStartTime: -70,
      transform: {
        position: { x: 0, y: 0 },
        anchor: { x: 0, y: 0 },
        scale: { x: 100, y: 100 },
        rotation: 0,
        opacity: 100,
      },
      shapes: [],
      masks: [
        {
          mode: 'add',
          inverted: false,
          opacity: 100,
          path: {
            keyframes: [
              { time: 20, value: earlyMask },
              { time: 90, value: lateMask },
            ],
          },
        },
      ],
      visible: true,
    };
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 120,
      duration: 120,
      width: 512,
      height: 512,
      layers: [layer],
    };

    const scene = buildScene(animation, 20);

    expect(scene[0]!.timelineFrame).toBe(20);
    expect(scene[0]!.masks?.[0]?.path.vertices[2]?.y).toBe(100);
  });

  it('hides track-matted precomps when a flattened zero-opacity null parent moves from rest', () => {
    const controllerTransform: Transform = {
      position: {
        keyframes: [
          { time: 0, value: { x: 0, y: 0 } },
          { time: 10, value: { x: 10, y: 0 } },
        ],
      },
      anchor: { x: 0, y: 0 },
      scale: { x: 100, y: 100 },
      rotation: 0,
      opacity: 0,
    } as unknown as Transform;
    const visibleTransform: Transform = {
      position: { x: 0, y: 0 },
      anchor: { x: 0, y: 0 },
      scale: { x: 100, y: 100 },
      rotation: 0,
      opacity: 100,
    };
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'controller',
          name: 'Controller',
          type: 'null',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 60,
          transform: controllerTransform,
          shapes: [],
          isPrecompChildContent: true,
          visible: true,
        },
        {
          id: 'matted-precomp',
          name: 'Matted precomp',
          type: 'precomp',
          index: 1,
          ind: 2,
          parentId: 1,
          inPoint: 0,
          outPoint: 60,
          transform: visibleTransform,
          shapes: [],
          trackMatte: 'alpha',
          visible: true,
        },
        {
          id: 'plain-precomp',
          name: 'Plain precomp',
          type: 'precomp',
          index: 2,
          ind: 3,
          parentId: 1,
          inPoint: 0,
          outPoint: 60,
          transform: visibleTransform,
          shapes: [],
          visible: true,
        },
      ],
    };

    expect(buildScene(animation, 0)[1]!.visible).toBe(true);
    const movedScene = buildScene(animation, 10);
    expect(movedScene[1]!.visible).toBe(false);
    expect(movedScene[2]!.visible).toBe(true);
  });

  it('keeps track-matted precomps visible under top-level zero-opacity controller nulls', () => {
    const controllerTransform: Transform = {
      position: {
        keyframes: [
          { time: 0, value: { x: 0, y: 0 } },
          { time: 10, value: { x: 10, y: 0 } },
        ],
      },
      anchor: { x: 0, y: 0 },
      scale: { x: 100, y: 100 },
      rotation: 0,
      opacity: 0,
    } as unknown as Transform;
    const visibleTransform: Transform = {
      position: { x: 0, y: 0 },
      anchor: { x: 0, y: 0 },
      scale: { x: 100, y: 100 },
      rotation: 0,
      opacity: 100,
    };
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'controller',
          name: 'Controller',
          type: 'null',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 60,
          transform: controllerTransform,
          shapes: [],
          visible: false,
        },
        {
          id: 'matted-precomp',
          name: 'Matted precomp',
          type: 'precomp',
          index: 1,
          ind: 2,
          parentId: 1,
          inPoint: 0,
          outPoint: 60,
          transform: visibleTransform,
          shapes: [],
          trackMatte: 'alpha',
          visible: true,
        },
      ],
    };

    const movedScene = buildScene(animation, 10);

    expect(movedScene[1]!.visible).toBe(true);
  });

  it('does not apply precomp group opacity twice through the transform cache', () => {
    const child: LayerDefinition = {
      id: 'child',
      name: 'Child',
      type: 'shape',
      index: 1,
      ind: 2,
      parentId: 1,
      inPoint: 0,
      outPoint: 60,
      transform: {
        position: { x: 0, y: 0 },
        anchor: { x: 0, y: 0 },
        scale: { x: 100, y: 100 },
        rotation: 0,
        opacity: 100,
      },
      shapes: [],
      groupOpacity: [{ opacity: 50, startTime: 0, stretch: 1 }],
      visible: false,
    };
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'precomp',
          name: 'Precomp',
          type: 'precomp',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 60,
          transform: {
            position: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [],
          matteChildren: [{ ...child, visible: true }],
          visible: true,
        },
        child,
      ],
    };

    const scene = buildScene(animation, 0);

    expect(scene[0]!.matteChildren?.[0]?.transform.opacity).toBe(50);
    expect(scene[1]!.transform.opacity).toBe(50);
  });

  it('evaluates animated group shape transforms per frame', () => {
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [
        {
          id: 'layer',
          name: 'Layer',
          type: 'shape',
          index: 0,
          ind: 1,
          inPoint: 0,
          outPoint: 60,
          transform: {
            position: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: { x: 100, y: 100 },
            rotation: 0,
            opacity: 100,
          },
          shapes: [
            {
              id: 'group',
              type: 'group',
              children: [
                {
                  id: 'rect',
                  type: 'rect',
                  rect: { x: -25, y: -25, width: 50, height: 50 },
                  position: { x: 0, y: 0 },
                  size: { x: 50, y: 50 },
                  cornerRadius: 0,
                } as Shape,
              ],
              animatedTransform: {
                position: {
                  keyframes: [
                    { time: 0, value: { x: 0, y: 0 } },
                    { time: 60, value: { x: 100, y: 0 } },
                  ],
                },
                anchor: { x: 0, y: 0 },
                scale: { x: 100, y: 100 },
                rotation: 0,
                opacity: 100,
              },
            } as Shape,
          ],
          visible: true,
        },
      ],
    };

    const scene0 = buildScene(animation, 0);
    const group0 = scene0[0]!.shapes[0] as GroupShape;
    expect(group0.transform?.position).toEqual({ x: 0, y: 0 });

    const scene30 = buildScene(animation, 30);
    const group30 = scene30[0]!.shapes[0] as GroupShape;
    expect(group30.transform?.position).toEqual({ x: 50, y: 0 });
  });

  it('hides nearly edge-on 3D layers instead of flattening them as full 2D planes', () => {
    const layer: LayerDefinition = {
      id: 'three-d',
      name: '3D Layer',
      type: 'shape',
      index: 0,
      ind: 1,
      inPoint: 0,
      outPoint: 60,
      transform: {
        position: { x: 0, y: 0 },
        anchor: { x: 0, y: 0 },
        scale: { x: 100, y: 100 },
        rotation: 0,
        opacity: 100,
      },
      threeDRotation: {
        x: {
          keyframes: [
            { time: 0, value: 0 },
            { time: 30, value: 90 },
          ],
        },
        y: 0,
      },
      shapes: [],
      visible: true,
    };
    const animation: Animation = {
      version: '5.5.0',
      frameRate: 60,
      inPoint: 0,
      outPoint: 60,
      duration: 60,
      width: 512,
      height: 512,
      layers: [layer],
    };

    expect(buildScene(animation, 0)[0]!.visible).toBe(true);
    expect(buildScene(animation, 30)[0]!.visible).toBe(false);
  });
});
