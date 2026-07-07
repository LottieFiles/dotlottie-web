import { describe, expect, it } from 'vitest';
import type {
  Animatable,
  Color,
  DropShadowEffect,
  FillEffect,
  GaussianBlurEffect,
  GradientFill,
  GroupShape,
  MergeShape,
  PathShape,
  PolystarShape,
  RectShape,
  Shape,
  Slots,
  Stroke,
  TintEffect,
} from '../../src/lite/model';
import { evaluateAnimatable, isAnimated } from '../../src/lite/model';
import { parseLottie } from '../../src/lite/parser/lottie';

describe('parseLottie', () => {
  it('keeps a plain shape layer unchanged', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [200, 200, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [50, 50] }, r: { a: 0, k: 0 } },
                { ty: 'fl', c: { a: 0, k: [1, 0, 0, 1] }, o: { a: 0, k: 100 } },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    expect(animation.layers).toHaveLength(1);
    expect(animation.layers[0]!.name).toBe('Shape');
    expect(animation.layers[0]!.shapes).toHaveLength(1);
  });

  it('preserves vendor-prefixed top-level extensions', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [],
      'com.lottiefiles.shaders': {
        overlays: [{ shader: 'grain', opacity: 0.2 }],
      },
      'com.example.custom': { enabled: true },
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    expect(animation.extensions).toEqual({
      'com.lottiefiles.shaders': {
        overlays: [{ shader: 'grain', opacity: 0.2 }],
      },
      'com.example.custom': { enabled: true },
    });
  });

  it('omits extensions when no vendor-prefixed top-level keys exist', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    expect(animation.extensions).toBeUndefined();
  });

  it('normalizes animated group skew axes for scene evaluation', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [0, 0, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [50, 50] }, r: { a: 0, k: 0 } },
                { ty: 'st', c: { a: 0, k: [0, 0, 1, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 4 } },
                {
                  ty: 'tr',
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                  sk: {
                    a: 1,
                    k: [
                      { t: 0, s: [0], e: [45] },
                      { t: 60, s: [45] },
                    ],
                  },
                  sa: { a: 0, k: 90 },
                },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const group = animation.layers[0]!.shapes[0] as GroupShape;

    expect(group.type).toBe('group');
    expect(group.animatedTransform?.skew).toMatchObject({
      keyframes: [
        { time: 0, value: 0 },
        { time: 60, value: 45 },
      ],
    });
    expect(group.animatedTransform?.skewAxis).toBe(-90);
  });

  it('negates layer skew axis while preserving layer skew', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Layer Skew',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [0, 0, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
            sk: {
              a: 1,
              k: [
                { t: 0, s: [0], e: [30] },
                { t: 60, s: [30] },
              ],
            },
            sa: {
              a: 1,
              k: [
                { t: 0, s: [0], e: [90] },
                { t: 60, s: [90] },
              ],
            },
          },
          shapes: [
            { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [50, 50] }, r: { a: 0, k: 0 } },
            { ty: 'fl', c: { a: 0, k: [0, 0, 1, 1] }, o: { a: 0, k: 100 } },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);

    expect(animation.layers[0]!.transform.skew).toMatchObject({
      keyframes: [
        { time: 0, value: 0 },
        { time: 60, value: 30 },
      ],
    });
    expect(animation.layers[0]!.transform.skewAxis).toMatchObject({
      keyframes: [
        { time: 0, value: -0 },
        { time: 60, value: -90 },
      ],
    });
  });

  it('parses a solid layer as a top-left anchored rectangle shape', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 1,
          nm: 'Solid',
          ip: 0,
          op: 60,
          st: 0,
          sw: 200,
          sh: 100,
          sc: '#4caf50',
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [100, 50, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);

    expect(animation.layers).toHaveLength(1);
    const layer = animation.layers[0]!;
    expect(layer.shapes).toHaveLength(1);

    const shape = layer.shapes[0]!;
    expect(shape.type).toBe('rect');

    const rectShape = shape as RectShape;
    expect(rectShape.rect).toEqual({
      x: 0,
      y: 0,
      width: 200,
      height: 100,
    });

    expect(shape.fill?.type).toBe('solid');
  });

  it('marks a rect with reversed direction (d=3) so it cuts holes under non-zero fill', () => {
    const makeLottie = (d: number) => ({
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'rc',
                  d,
                  p: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [50, 50] },
                  r: { a: 0, k: 0 },
                },
                { ty: 'fl', c: { a: 0, k: [1, 0, 0, 1] }, o: { a: 0, k: 100 } },
              ],
            },
          ],
        },
      ],
    });

    const groupChild = (shape: unknown): RectShape => (shape as { children: RectShape[] }).children[0]!;

    const reversed = parseLottie(makeLottie(3) as unknown as Record<string, unknown>);
    expect(groupChild(reversed.layers[0]!.shapes[0]).reversed).toBe(true);

    const normal = parseLottie(makeLottie(1) as unknown as Record<string, unknown>);
    expect(groupChild(normal.layers[0]!.shapes[0]).reversed).toBe(false);
  });

  it('preserves animated rectangle corner radius for scene evaluation', () => {
    const lottie = {
      v: '5.5.0',
      fr: 30,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Animated radius rect',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'rc',
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: {
                a: 1,
                k: [
                  { t: 0, s: [10], e: [50], o: { x: [0.333], y: [0] }, i: { x: [0.667], y: [1] } },
                  { t: 30, s: [50] },
                ],
              },
            },
            { ty: 'fl', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 } },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const rect = animation.layers[0]!.shapes[0] as RectShape;

    expect(typeof rect.cornerRadius).toBe('object');
    expect(rect.cornerRadius).toHaveProperty('keyframes');
  });

  it('parses a polystar shape', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Star',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [200, 200, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'sr',
                  sy: 1,
                  pt: { a: 0, k: 5 },
                  p: { a: 0, k: [0, 0] },
                  or: { a: 0, k: 150 },
                  os: { a: 0, k: 0 },
                  ir: { a: 0, k: 60 },
                  is: { a: 0, k: 0 },
                  r: { a: 0, k: 0 },
                },
                { ty: 'fl', c: { a: 0, k: [1, 0.5, 0, 1] }, o: { a: 0, k: 100 } },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);

    expect(animation.layers[0]!.shapes).toHaveLength(1);
    const group = animation.layers[0]!.shapes[0] as GroupShape;
    expect(group.type).toBe('group');
    expect(group.children).toHaveLength(1);
    const shape = group.children[0]!;
    expect(shape.type).toBe('polystar');

    const star = shape as PolystarShape;
    expect(star.starType).toBe('star');
    expect(star.points).toBe(5);
    expect(star.outerRadius).toBe(150);
    expect(star.innerRadius).toBe(60);
  });

  it('preserves Offset Paths join style metadata on affected shapes', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Offset Star',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'sr',
                  sy: 1,
                  pt: { a: 0, k: 5 },
                  p: { a: 0, k: [0, 0] },
                  or: { a: 0, k: 80 },
                  os: { a: 0, k: 10 },
                  ir: { a: 0, k: 40 },
                  is: { a: 0, k: 5 },
                  r: { a: 0, k: 0 },
                },
                { ty: 'op', a: { a: 0, k: 8 }, lj: 2, ml: 4 },
                { ty: 'fl', c: { a: 0, k: [1, 0, 0, 1] }, o: { a: 0, k: 100 } },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const group = animation.layers[0]!.shapes[0] as GroupShape;
    const star = group.children[0] as PolystarShape;

    expect(star.offset).toBe(8);
    expect(star.offsetLineJoin).toBe('round');
    expect(star.offsetMiterLimit).toBe(4);
  });

  it('preserves animated polystar geometry and round corners for scene evaluation', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Animated Polygon',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'sr',
                  sy: 2,
                  pt: {
                    a: 1,
                    k: [
                      { t: 0, s: [3], e: [8] },
                      { t: 60, s: [8] },
                    ],
                  },
                  p: { a: 0, k: [0, 0] },
                  or: {
                    a: 1,
                    k: [
                      { t: 0, s: [40], e: [80] },
                      { t: 60, s: [80] },
                    ],
                  },
                  os: { a: 0, k: 0 },
                  r: { a: 0, k: 0 },
                },
                {
                  ty: 'rd',
                  r: {
                    a: 1,
                    k: [
                      { t: 0, s: [0], e: [20] },
                      { t: 60, s: [20] },
                    ],
                  },
                },
                { ty: 'fl', c: { a: 0, k: [1, 0.5, 0, 1] }, o: { a: 0, k: 100 } },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const initialGroup = animation.layers[0]!.shapes[0] as GroupShape;
    const initialPolygon = initialGroup.children[0] as PolystarShape;

    expect(initialPolygon.points).toBe(3);
    expect(initialPolygon.outerRadius).toBe(40);
    expect(initialPolygon.cornerRadius).toBeDefined();

    expect(initialPolygon.animatedProperties?.points).toBeDefined();
    expect(initialPolygon.animatedProperties?.outerRadius).toBeDefined();
    expect(initialPolygon.animatedProperties?.cornerRadius).toBeDefined();
  });

  it('maps Lottie text justification codes', () => {
    const baseLayer = {
      ddd: 0,
      ind: 1,
      ty: 5,
      nm: 'Text',
      ip: 0,
      op: 60,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [0, 0, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
    };
    const text = (j: number) => ({
      d: {
        k: [
          {
            s: {
              s: 24,
              f: 'sans-serif',
              t: 'Text',
              j,
              fc: [1, 1, 1],
            },
            t: 0,
          },
        ],
      },
    });
    const animation = parseLottie({
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        { ...baseLayer, ind: 1, t: text(0) },
        { ...baseLayer, ind: 2, t: text(1) },
        { ...baseLayer, ind: 3, t: text(2) },
      ],
    } as unknown as Record<string, unknown>);

    expect(animation.layers[0]!.text?.justification).toBe('left');
    expect(animation.layers[1]!.text?.justification).toBe('right');
    expect(animation.layers[2]!.text?.justification).toBe('center');
  });

  it('parses a gradient stroke', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'el', s: { a: 0, k: [100, 100] }, p: { a: 0, k: [0, 0] } },
                {
                  ty: 'gs',
                  w: { a: 0, k: 10 },
                  g: { p: 2, k: { a: 0, k: [0, 1, 0, 0, 1, 0, 0, 1] } },
                  s: { a: 0, k: [0, 0] },
                  e: { a: 0, k: [100, 0] },
                },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const group = animation.layers[0]!.shapes[0] as GroupShape;
    expect(group.type).toBe('group');
    expect(group.children).toHaveLength(1);
    const shape = group.children[0]!;
    expect(Array.isArray(shape.stroke)).toBe(true);
    expect((shape.stroke as Stroke[])[0]!.type).toBe('gradient');
  });

  it('preserves animated stroke dash and offset properties', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            { ty: 'rc', s: { a: 0, k: [70, 70] }, p: { a: 0, k: [0, 0] } },
            {
              ty: 'st',
              c: { a: 0, k: [0, 1, 0, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 8 },
              d: [
                {
                  n: 'd',
                  v: {
                    a: 1,
                    k: [
                      { t: 0, s: [10], e: [20] },
                      { t: 60, s: [20] },
                    ],
                  },
                },
                { n: 'g', v: { a: 0, k: 5 } },
                {
                  n: 'o',
                  v: {
                    a: 1,
                    k: [
                      { t: 0, s: [0], e: [50] },
                      { t: 60, s: [50] },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const shapeStroke = animation.layers[0]!.shapes[0]!.stroke as Stroke | Stroke[];
    const stroke = Array.isArray(shapeStroke) ? shapeStroke[0]! : shapeStroke;

    expect(stroke.dash).toHaveLength(2);
    expect(typeof stroke.dash?.[0]).toBe('object');
    expect(stroke.dash?.[1]).toBe(5);
    expect(typeof stroke.dashOffset).toBe('object');
  });

  it('applies parent-level strokes to preceding shape groups', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'sh', ks: { a: 0, k: { i: [[0, 0]], o: [[0, 0]], v: [[0, 0]], c: false } } },
                { ty: 'fl', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 } },
                {
                  ty: 'tr',
                  p: { a: 0, k: [10, 20] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                },
              ],
            },
            {
              ty: 'st',
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: {
                a: 1,
                k: [
                  { t: 0, s: [0] },
                  { t: 30, s: [12] },
                ],
              },
              lc: 1,
              lj: 1,
            },
            {
              ty: 'st',
              c: { a: 0, k: [0, 0.5, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 16 },
              lc: 2,
              lj: 2,
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const group = animation.layers[0]!.shapes[0] as GroupShape;
    const path = group.children[0]!;

    expect(group.type).toBe('group');
    expect(path.fill?.type).toBe('solid');
    expect(Array.isArray(path.stroke)).toBe(true);
    const strokes = path.stroke as Stroke[];
    expect(strokes).toHaveLength(2);
    expect(strokes[0]!.lineCap).toBe('butt');
    expect(strokes[1]!.lineCap).toBe('round');
    const animatedWidth = strokes[0]!.width;
    expect(typeof animatedWidth).toBe('object');
    if (typeof animatedWidth === 'object' && animatedWidth !== null && 'keyframes' in animatedWidth) {
      expect(animatedWidth.keyframes[1]!.value).toBe(12);
    }
    expect(strokes[1]!.width).toBe(16);
  });

  it('preserves paint order when a local stroke precedes a solid fill', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 } },
                { ty: 'st', c: { a: 0, k: [1, 0, 0, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 8 } },
                { ty: 'fl', c: { a: 0, k: [0, 0, 1, 1] }, o: { a: 0, k: 100 } },
                {
                  ty: 'tr',
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                },
              ],
            },
            {
              ty: 'gr',
              it: [
                { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 } },
                { ty: 'fl', c: { a: 0, k: [0, 1, 0, 1] }, o: { a: 0, k: 100 } },
                { ty: 'st', c: { a: 0, k: [1, 0, 0, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 8 } },
                {
                  ty: 'tr',
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const strokeThenFill = animation.layers[0]!.shapes[0] as GroupShape;
    const fillThenStroke = animation.layers[0]!.shapes[1] as GroupShape;

    expect(strokeThenFill.children[0]!.paintOrder).toBe('fill-stroke');
    expect(fillThenStroke.children[0]!.paintOrder).toBeUndefined();
  });

  it('applies parent-level fills to unfilled shape groups without overwriting child fills', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'sh', ks: { a: 0, k: { i: [[0, 0]], o: [[0, 0]], v: [[0, 0]], c: false } } },
                {
                  ty: 'tr',
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                },
              ],
            },
            { ty: 'fl', c: { a: 0, k: [0, 1, 0, 1] }, o: { a: 0, k: 100 } },
            {
              ty: 'gr',
              it: [
                { ty: 'sh', ks: { a: 0, k: { i: [[0, 0]], o: [[0, 0]], v: [[10, 0]], c: false } } },
                { ty: 'fl', c: { a: 0, k: [1, 0, 0, 1] }, o: { a: 0, k: 100 } },
                {
                  ty: 'tr',
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                },
              ],
            },
            { ty: 'fl', c: { a: 0, k: [0, 0, 1, 1] }, o: { a: 0, k: 100 } },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const firstGroup = animation.layers[0]!.shapes[0] as GroupShape;
    const firstPath = firstGroup.children[0]!;
    const firstFill = firstPath.fill as Extract<typeof firstPath.fill, { type: 'solid' }>;
    expect(firstFill.color).toEqual({ r: 0, g: 255, b: 0, a: 1 });

    const secondGroup = animation.layers[0]!.shapes[1] as GroupShape;
    const secondPath = secondGroup.children[0]!;
    const secondFill = secondPath.fill as Extract<typeof secondPath.fill, { type: 'solid' }>;
    expect(secondFill.color).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('ignores alpha embedded in solid shape colors and preserves separate opacity', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 } },
                { ty: 'fl', c: { a: 0, k: [0.25, 0.5, 1, 0.25] }, o: { a: 0, k: 30 } },
                { ty: 'st', c: { a: 0, k: [1, 0, 0, 0.4] }, o: { a: 0, k: 60 }, w: { a: 0, k: 8 } },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const group = animation.layers[0]!.shapes[0] as GroupShape;
    const shape = group.children[0]!;
    const fill = shape.fill as Extract<typeof shape.fill, { type: 'solid' }>;
    const strokes = Array.isArray(shape.stroke) ? shape.stroke : [shape.stroke as Stroke];
    const stroke = strokes[0];

    expect(fill.color).toEqual({ r: 63.75, g: 127.5, b: 255, a: 1 });
    expect(fill.opacity).toBe(30);
    if (!stroke || stroke.type !== 'solid') {
      throw new Error('Expected a solid stroke');
    }
    expect(stroke.color).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(stroke.opacity).toBe(60);
  });

  it('applies parent-level strokes to gradient-filled shape groups', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [200, 200, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'sh',
                  ks: { a: 0, k: { i: [[0, 0]], o: [[0, 0]], v: [[0, 0]], c: false } },
                },
                {
                  ty: 'gf',
                  g: { p: 2, k: { a: 0, k: [0, 1, 0, 0, 1, 0, 0, 1] } },
                  s: { a: 0, k: [0, 0] },
                  e: { a: 0, k: [100, 0] },
                },
                {
                  ty: 'tr',
                  p: { a: 0, k: [10, 20] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                },
              ],
            },
            {
              ty: 'st',
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 16 },
              lc: 2,
              lj: 2,
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const group = animation.layers[0]!.shapes[0] as GroupShape;
    const path = group.children[0]!;

    expect(group.type).toBe('group');
    expect(path.fill?.type).toBe('gradient');
    expect(Array.isArray(path.stroke)).toBe(true);
    const strokes = path.stroke as Stroke[];
    expect(strokes).toHaveLength(1);
    expect(strokes[0]!.type).toBe('solid');
    expect(strokes[0]!.width).toBe(16);
    expect(path.strokeWidthScale).toBe(2);
  });

  it('uses group scale for extreme parent-level gradient stroke compensation', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [8186, 8186, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'sh',
                  ks: { a: 0, k: { i: [[0, 0]], o: [[0, 0]], v: [[0, 0]], c: false } },
                },
                {
                  ty: 'gf',
                  g: { p: 2, k: { a: 0, k: [0, 1, 0, 0, 1, 0, 0, 1] } },
                  s: { a: 0, k: [0, 0] },
                  e: { a: 0, k: [100, 0] },
                },
                {
                  ty: 'tr',
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [512, 512] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                },
              ],
            },
            {
              ty: 'st',
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 30 },
              lc: 1,
              lj: 1,
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const group = animation.layers[0]!.shapes[0] as GroupShape;
    const path = group.children[0]!;

    expect(path.fill?.type).toBe('gradient');
    expect(path.strokeWidthScale).toBeCloseTo(5.12);
  });

  it('uses group scale for moderate parent-level gradient stroke compensation', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [704, 704, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'sh',
                  ks: { a: 0, k: { i: [[0, 0]], o: [[0, 0]], v: [[0, 0]], c: false } },
                },
                {
                  ty: 'gf',
                  g: { p: 2, k: { a: 0, k: [0, 1, 0, 0, 1, 0, 0, 1] } },
                  s: { a: 0, k: [0, 0] },
                  e: { a: 0, k: [100, 0] },
                },
                {
                  ty: 'tr',
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [512, 512] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                },
              ],
            },
            {
              ty: 'st',
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 30 },
              lc: 1,
              lj: 1,
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const group = animation.layers[0]!.shapes[0] as GroupShape;
    const path = group.children[0]!;

    expect(path.fill?.type).toBe('gradient');
    expect(path.strokeWidthScale).toBeCloseTo(5.12);
  });

  it('compensates parent-level strokes applied to scaled shape groups', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'sh',
                  ks: {
                    a: 0,
                    k: {
                      i: [
                        [0, 0],
                        [0, 0],
                      ],
                      o: [
                        [0, 0],
                        [0, 0],
                      ],
                      v: [
                        [0, 0],
                        [10, 0],
                      ],
                      c: false,
                    },
                  },
                },
                {
                  ty: 'tr',
                  p: { a: 0, k: [0, 0] },
                  a: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [400, 400] },
                  r: { a: 0, k: 0 },
                  o: { a: 0, k: 100 },
                },
              ],
            },
            {
              ty: 'st',
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 140 },
              lc: 2,
              lj: 1,
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const group = animation.layers[0]!.shapes[0] as GroupShape;
    const path = group.children[0]!;

    expect(group.type).toBe('group');
    expect(path.strokeWidthScale).toBe(4);
  });

  it('preserves animated gradient timing metadata', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 } },
                {
                  ty: 'gf',
                  g: {
                    p: 2,
                    k: {
                      a: 1,
                      k: [
                        {
                          t: 0,
                          s: [0, 1, 0, 0, 1, 0, 0, 1],
                          e: [0, 0, 1, 0, 1, 0, 0, 1],
                          o: { x: 0.167, y: 0 },
                          i: { x: 0.833, y: 1 },
                        },
                        {
                          t: 30,
                          s: [0, 0, 1, 0, 1, 0, 0, 1],
                          e: [0, 0, 1, 0, 1, 0, 0, 1],
                        },
                        {
                          t: 60,
                        },
                      ],
                    },
                  },
                  s: { a: 0, k: [0, 0] },
                  e: { a: 0, k: [100, 0] },
                },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const group = animation.layers[0]!.shapes[0] as GroupShape;
    const shape = group.children[0]!;
    const fill = shape.fill as GradientFill;
    expect(fill.type).toBe('gradient');
    expect('keyframes' in fill.colors).toBe(true);
    if (!('keyframes' in fill.colors)) return;

    expect(fill.colors.keyframes).toHaveLength(3);
    expect(fill.colors.keyframes[0]!.outTangent).toEqual({ x: 0.167, y: 0 });
    expect(fill.colors.keyframes[1]!.inTangent).toEqual({ x: 0.833, y: 1 });
    expect(fill.colors.keyframes[2]!.value[0]!.color).toEqual({ r: 0, g: 255, b: 0, a: 1 });
  });

  it('uses the segment-start incoming tangent for separated dimensions', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 90,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 90,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: {
              a: 1,
              k: [
                {
                  t: 10,
                  s: [80, 120, 100],
                  o: { x: [0.472, 0.452, 0.158], y: [0, 0, 0] },
                  i: { x: [0.78, 0.768, 0.63], y: [0.698, 0.649, 1] },
                },
                {
                  t: 20,
                  s: [104.379, 98.331, 100],
                  o: { x: [0.448, 0.44, 0.437], y: [-1.799, -3.981, 0] },
                  i: { x: [0.741, 0.751, 0.813], y: [1, 1, 1] },
                },
              ],
            },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [50, 50] }, r: { a: 0, k: 0 } },
                { ty: 'fl', c: { a: 0, k: [1, 0, 0, 1] }, o: { a: 0, k: 100 } },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const scale = animation.layers[0]!.transform.scale as {
      x: { keyframes: { inTangent?: { x: number; y: number } }[] };
      y: { keyframes: { inTangent?: { x: number; y: number } }[] };
    };

    expect(scale.x.keyframes[1]!.inTangent).toEqual({ x: 0.78, y: 0.698 });
    expect(scale.y.keyframes[1]!.inTangent).toEqual({ x: 0.768, y: 0.649 });
  });

  it('uses destination incoming tangents for solid layer opacity only', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 300,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 1,
          nm: 'White Solid',
          sw: 512,
          sh: 512,
          sc: '#ffffff',
          ip: 0,
          op: 300,
          ks: {
            o: {
              a: 1,
              k: [
                { t: 50, s: [0], h: 1 },
                {
                  t: 200,
                  s: [100],
                  e: [86.804],
                  i: { x: [0.724], y: [0.052] },
                  o: { x: [0.397], y: [0] },
                },
                {
                  t: 226,
                  s: [86.804],
                  e: [0],
                  i: { x: [0.311], y: [1] },
                  o: { x: [0.415], y: [0.409] },
                },
                { t: 275 },
              ],
            },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [256, 256, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
        },
        {
          ddd: 0,
          ind: 2,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 300,
          ks: {
            o: {
              a: 1,
              k: [
                { t: 50, s: [0], h: 1 },
                {
                  t: 200,
                  s: [100],
                  e: [86.804],
                  i: { x: [0.724], y: [0.052] },
                  o: { x: [0.397], y: [0] },
                },
                {
                  t: 226,
                  s: [86.804],
                  e: [0],
                  i: { x: [0.311], y: [1] },
                  o: { x: [0.415], y: [0.409] },
                },
                { t: 275 },
              ],
            },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                { ty: 'rc', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [50, 50] }, r: { a: 0, k: 0 } },
                { ty: 'fl', c: { a: 0, k: [1, 0, 0, 1] }, o: { a: 0, k: 100 } },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const solidOpacity = animation.layers[0]!.transform.opacity as {
      keyframes: { inTangent?: { x: number; y: number } }[];
    };
    const shapeOpacity = animation.layers[1]!.transform.opacity as {
      keyframes: { inTangent?: { x: number; y: number } }[];
    };

    expect(solidOpacity.keyframes[1]!.inTangent).toEqual({ x: 0.724, y: 0.052 });
    expect(solidOpacity.keyframes[2]!.inTangent).toEqual({ x: 0.311, y: 1 });
    expect(shapeOpacity.keyframes[1]!.inTangent).toEqual({ x: 0.724, y: 0.052 });
    expect(shapeOpacity.keyframes[2]!.inTangent).toEqual({ x: 0.724, y: 0.052 });
  });

  it('uses shape groups as merge-path operands', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'gr',
                  it: [
                    {
                      ty: 'sh',
                      ks: { a: 0, k: { i: [[0, 0]], o: [[0, 0]], v: [[0, 0]], c: false } },
                    },
                    {
                      ty: 'sh',
                      ks: { a: 0, k: { i: [[0, 0]], o: [[0, 0]], v: [[10, 0]], c: false } },
                    },
                    {
                      ty: 'tr',
                      p: { a: 0, k: [5, 0] },
                      a: { a: 0, k: [0, 0] },
                      s: { a: 0, k: [100, 100] },
                      r: { a: 0, k: 0 },
                      o: { a: 0, k: 100 },
                    },
                  ],
                },
                { ty: 'mm', mm: 2 },
                { ty: 'fl', c: { a: 0, k: [1, 0, 0, 1] }, o: { a: 0, k: 100 } },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const outerGroup = animation.layers[0]!.shapes[0] as GroupShape;
    const merge = outerGroup.children[0] as MergeShape;

    expect(merge.type).toBe('merge');
    expect(merge.mode).toBe('add');
    expect(merge.fill?.type).toBe('solid');
    expect(merge.shapes).toHaveLength(1);
    expect(merge.shapes[0]!.type).toBe('group');
    expect((merge.shapes[0] as GroupShape).children).toHaveLength(2);
  });

  it('does not let identity parent trims overwrite nested trims', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'gr',
                  it: [
                    {
                      ty: 'sh',
                      ks: {
                        a: 0,
                        k: {
                          i: [
                            [0, 0],
                            [0, 0],
                          ],
                          o: [
                            [0, 0],
                            [0, 0],
                          ],
                          v: [
                            [0, 0],
                            [10, 0],
                          ],
                          c: false,
                        },
                      },
                    },
                    {
                      ty: 'tm',
                      s: { a: 0, k: 0 },
                      e: { a: 0, k: 0 },
                      o: { a: 0, k: 0 },
                      m: 1,
                    },
                    {
                      ty: 'st',
                      c: { a: 0, k: [1, 0, 0, 1] },
                      o: { a: 0, k: 100 },
                      w: { a: 0, k: 8 },
                      lc: 2,
                      lj: 1,
                    },
                    {
                      ty: 'tr',
                      p: { a: 0, k: [0, 0] },
                      a: { a: 0, k: [0, 0] },
                      s: { a: 0, k: [100, 100] },
                      r: { a: 0, k: 0 },
                      o: { a: 0, k: 100 },
                    },
                  ],
                },
                {
                  ty: 'tm',
                  s: { a: 0, k: 0 },
                  e: { a: 0, k: 100 },
                  o: { a: 0, k: 0 },
                  m: 1,
                },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const paths: PathShape[] = [];
    const collectPaths = (shape: Shape): void => {
      if (shape.type === 'path') {
        paths.push(shape as PathShape);
      }
      if (shape.type === 'group') {
        for (const child of (shape as GroupShape).children) {
          collectPaths(child);
        }
      }
      if (shape.type === 'merge') {
        for (const child of (shape as MergeShape).shapes) {
          collectPaths(child);
        }
      }
    };
    for (const shape of animation.layers[0]!.shapes) {
      collectPaths(shape);
    }

    expect(paths).toHaveLength(1);
    expect(paths[0]!.trim?.end).toBe(0);
  });

  it('parses a text layer', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 5,
          nm: 'Text',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          t: {
            d: {
              k: [
                {
                  s: {
                    s: 48,
                    f: 'ArialMT',
                    t: 'Hi',
                    j: 1,
                    tr: 0,
                    lh: 57.6,
                    ls: 0,
                    fc: [0.2, 0.2, 0.2],
                  },
                  t: 0,
                },
              ],
            },
          },
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    expect(animation.layers[0]!.text).toBeDefined();
    expect(animation.layers[0]!.text?.text).toBe('Hi');
    expect(animation.layers[0]!.text?.size).toBe(48);
    expect(animation.layers[0]!.text?.justification).toBe('right');
  });

  it('parses non-rendering text-path masks without adding layer masks', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ind: 1,
          ty: 5,
          nm: 'Text Path',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [0, 0, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          masksProperties: [
            {
              mode: 'n',
              pt: {
                a: 0,
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [0, 0],
                    [100, 0],
                  ],
                  c: false,
                },
              },
            },
          ],
          t: {
            d: {
              k: [
                {
                  s: {
                    s: 48,
                    f: 'ArialMT',
                    t: 'Hi',
                    j: 0,
                    tr: 0,
                    fc: [1, 1, 1],
                  },
                  t: 0,
                },
              ],
            },
            p: {
              m: 0,
              f: { a: 0, k: 12 },
            },
          },
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const textLayer = animation.layers[0]!;

    expect(textLayer.masks).toEqual([]);
    expect(textLayer.text?.textPath?.firstMargin).toBe(12);
    expect(textLayer.text?.textPath?.path).toMatchObject({
      vertices: [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ],
      closed: false,
    });
  });

  it('attaches embedded glyph outlines to text documents', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ind: 1,
          ty: 5,
          nm: 'Text',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [0, 0, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          t: {
            d: {
              k: [
                {
                  s: {
                    s: 48,
                    f: 'AvertaStd-Black',
                    t: 'A',
                    j: 0,
                    tr: 0,
                    fc: [1, 1, 1],
                  },
                  t: 0,
                },
              ],
            },
          },
        },
      ],
      chars: [
        {
          ch: 'A',
          size: 48,
          w: 50,
          data: {
            shapes: [
              {
                ty: 'gr',
                it: [
                  {
                    ty: 'sh',
                    ks: {
                      k: {
                        i: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        o: [
                          [0, 0],
                          [0, 0],
                          [0, 0],
                        ],
                        v: [
                          [0, 0],
                          [10, 0],
                          [5, -10],
                        ],
                        c: true,
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const glyph = animation.layers[0]!.text?.glyphs?.['A'];

    expect(glyph?.width).toBe(50);
    expect(glyph?.size).toBe(48);
    expect(glyph?.paths[0]?.vertices).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: -10 },
    ]);
  });

  it('parses layer blend modes', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Layer',
          ip: 0,
          op: 60,
          bm: 1,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    expect(animation.layers[0]!.blendMode).toBe('multiply');
  });

  it('preserves 3D layer x and y rotations for scene projection checks', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 1,
          ind: 1,
          ty: 4,
          nm: '3D Layer',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            rx: { a: 0, k: 90 },
            ry: { a: 0, k: 45 },
            rz: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);

    expect(animation.layers[0]!.threeDRotation?.x).toBe(90);
    expect(animation.layers[0]!.threeDRotation?.y).toBe(45);
  });

  it('composites non-default precomp blend modes as a group', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'blended',
          layers: [
            {
              ddd: 0,
              ind: 2,
              ty: 4,
              nm: 'Default Blend Child',
              ip: 0,
              op: 60,
              st: 0,
              bm: 0,
              ks: transform,
              shapes: [],
            },
          ],
        },
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 0,
          nm: 'Difference Precomp',
          refId: 'blended',
          ip: 0,
          op: 60,
          st: 0,
          bm: 10,
          ks: transform,
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const precomp = animation.layers[0]!;
    const child = animation.layers.find((layer) => layer.name === 'Difference Precomp > Default Blend Child');

    expect(precomp.blendMode).toBe('difference');
    expect(precomp.matteChildren?.[0]?.blendMode).toBe('source-over');
    expect(child?.blendMode).toBe('source-over');
    expect(child?.visible).toBe(false);
    expect(child?.hiddenByPrecompComposite).toBe(true);
  });

  it('parses layer effects', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'rc',
                  p: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                },
              ],
            },
          ],
          ef: [
            {
              ty: 21,
              nm: 'Fill',
              mn: 'ADBE Fill',
              ef: [
                {
                  ty: 2,
                  nm: 'Color',
                  mn: 'ADBE Fill-0002',
                  v: { a: 0, k: [0, 0, 1, 1] },
                },
                {
                  ty: 0,
                  nm: 'Opacity',
                  mn: 'ADBE Fill-0005',
                  v: { a: 0, k: 80 },
                },
              ],
            },
            {
              ty: 25,
              nm: 'Drop Shadow',
              mn: 'ADBE Drop Shadow',
              ef: [
                {
                  ty: 2,
                  nm: 'Shadow Color',
                  mn: 'ADBE Drop Shadow-0001',
                  v: { a: 0, k: [0, 0, 0, 1] },
                },
                {
                  ty: 0,
                  nm: 'Opacity',
                  mn: 'ADBE Drop Shadow-0002',
                  v: { a: 0, k: 191.25 },
                },
                {
                  ty: 0,
                  nm: 'Direction',
                  mn: 'ADBE Drop Shadow-0003',
                  v: { a: 0, k: 135 },
                },
                {
                  ty: 0,
                  nm: 'Distance',
                  mn: 'ADBE Drop Shadow-0004',
                  v: { a: 0, k: 10 },
                },
                {
                  ty: 0,
                  nm: 'Softness',
                  mn: 'ADBE Drop Shadow-0005',
                  v: { a: 0, k: 8 },
                },
              ],
            },
            {
              ty: 29,
              nm: 'Gaussian Blur',
              mn: 'ADBE Gaussian Blur 2',
              ef: [
                {
                  ty: 0,
                  nm: 'Blurriness',
                  mn: 'ADBE Gaussian Blur 2-0001',
                  v: { a: 0, k: 12 },
                },
              ],
            },
            {
              ty: 20,
              nm: 'Tint',
              mn: 'ADBE Tint',
              ef: [
                {
                  ty: 2,
                  nm: 'Map Black To',
                  mn: 'ADBE Tint-0001',
                  v: { a: 0, k: [1, 0, 0, 1] },
                },
                {
                  ty: 0,
                  nm: 'Amount to Tint',
                  mn: 'ADBE Tint-0003',
                  v: { a: 0, k: 0.6 },
                },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const layer = animation.layers[0]!;
    expect(layer.effects).toHaveLength(4);

    const fill = layer.effects?.[0] as FillEffect;
    expect(fill.type).toBe('fill');
    expect(fill.color).toEqual({ r: 0, g: 0, b: 255, a: 1 });
    expect(fill.opacity).toBeCloseTo(175 / 255);

    const shadow = layer.effects?.[1] as DropShadowEffect;
    expect(shadow.type).toBe('drop-shadow');
    expect(shadow.color).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    expect(shadow.opacity).toBe(0.75);
    expect(shadow.angle).toBe(135);
    expect(shadow.distance).toBe(10);
    expect(shadow.softness).toBe(8);

    const blur = layer.effects?.[2] as GaussianBlurEffect;
    expect(blur.type).toBe('gaussian-blur');
    expect(blur.blurriness).toBe(12);

    const tint = layer.effects?.[3] as TintEffect;
    expect(tint.type).toBe('tint');
    expect(tint.color).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(tint.whiteColor).toBeUndefined();
    expect(tint.amount).toBe(0.6);

    const group = layer.shapes[0] as GroupShape;
    const shape = group.children[0]!;
    expect(shape.fill).toBeDefined();
    const solidFill = shape.fill as Extract<typeof shape.fill, { type: 'solid' }>;
    const effectColor = solidFill.color as Color;
    expect(effectColor.b).toBe(255);
    expect(solidFill.opacity).toBeCloseTo((175 / 255) * 100);
  });

  it('resolves slotted color values and applies overrides', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      slots: {
        primary: { p: { a: 0, k: [1, 0, 0, 1] } },
      },
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'rc',
                  p: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                },
                { ty: 'fl', c: { sid: 'primary' }, o: { a: 0, k: 100 } },
              ],
            },
          ],
        },
      ],
    };

    const defaultAnimation = parseLottie(lottie as unknown as Record<string, unknown>);
    expect(defaultAnimation.slots?.['primary']).toBeDefined();
    const defaultGroup = defaultAnimation.layers[0]!.shapes[0] as GroupShape;
    expect(defaultGroup.type).toBe('group');
    const defaultShape = defaultGroup.children[0]!;
    const defaultFill = defaultShape.fill as Extract<typeof defaultShape.fill, { type: 'solid' }>;
    const defaultColor = defaultFill.color as Color;
    expect(defaultColor.r).toBe(255);

    const overrides: Slots = {
      primary: { p: { a: 0, k: [0, 1, 0, 1] } },
    };
    const themedAnimation = parseLottie(lottie as unknown as Record<string, unknown>, overrides);
    const themedGroup = themedAnimation.layers[0]!.shapes[0] as GroupShape;
    expect(themedGroup.type).toBe('group');
    const themedShape = themedGroup.children[0]!;
    const themedFill = themedShape.fill as Extract<typeof themedShape.fill, { type: 'solid' }>;
    const themedColor = themedFill.color as Color;
    expect(themedColor.g).toBe(255);
  });

  it('keeps time-remapped precomp child visibility on the source comp timeline', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const lottie = {
      v: '5.5.0',
      fr: 10,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'comp_0',
          layers: [
            {
              ddd: 0,
              ind: 3,
              ty: 0,
              nm: 'Nested',
              refId: 'comp_1',
              ip: 20,
              op: 30,
              st: 20,
              ks: transform,
            },
          ],
        },
        {
          id: 'comp_1',
          layers: [
            {
              ddd: 0,
              ind: 4,
              ty: 4,
              nm: 'Leaf',
              ip: 0,
              op: 10,
              st: 0,
              ks: transform,
              shapes: [],
            },
          ],
        },
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 0,
          nm: 'Root',
          refId: 'comp_0',
          ip: 0,
          op: 60,
          st: 0,
          tm: { a: 0, k: 2 },
          ks: transform,
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const nested = animation.layers.find((layer) => layer.name === 'Root > Nested');

    expect(nested).toBeDefined();
    expect(nested?.inPoint).toBe(20);
    expect(nested?.outPoint).toBe(30);
    expect(nested?.parentTimeRemap).toBeDefined();
    expect(nested?.remappedSourceWindow).toBeDefined();

    const leaf = animation.layers.find((layer) => layer.name === 'Root > Nested > Leaf');
    expect(leaf).toBeDefined();
    expect(leaf?.inPoint).toBe(0);
    expect(leaf?.outPoint).toBe(10);
    expect(leaf?.parentStartTime).toBe(20);
    expect(leaf?.remappedSourceWindow).toBeDefined();
    expect(leaf?.sourceWindowParentInPoint).toBe(0);
    expect(leaf?.sourceWindowParentOutPoint).toBe(60);
  });

  it('does not subtract top-level time-remapped precomp start time from child source frames', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const lottie = {
      v: '5.5.0',
      fr: 10,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'loop',
          layers: [
            {
              ddd: 0,
              ind: 2,
              ty: 4,
              nm: 'Leaf',
              ip: 0,
              op: 25,
              st: 0,
              ks: transform,
              shapes: [],
            },
          ],
        },
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 0,
          nm: 'Time Remapped Loop',
          refId: 'loop',
          ip: 20,
          op: 40,
          st: 20,
          tm: { a: 0, k: 2 },
          ks: transform,
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const leaf = animation.layers.find((layer) => layer.name === 'Time Remapped Loop > Leaf');

    expect(leaf).toBeDefined();
    expect(leaf?.parentTimeRemap).toBeDefined();
    expect(leaf?.parentStartTime).toBeUndefined();
    expect(leaf?.remappedSourceWindow).toBe(true);
    expect(leaf?.sourceWindowParentInPoint).toBe(20);
    expect(leaf?.sourceWindowParentOutPoint).toBe(40);
  });

  it('uses source-local nested precomp start time under an offset time-remapped parent', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const lottie = {
      v: '5.5.0',
      fr: 10,
      ip: 0,
      op: 80,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'outer',
          layers: [
            {
              ddd: 0,
              ind: 2,
              ty: 0,
              nm: 'Inner Precomp',
              refId: 'inner',
              ip: 0,
              op: 40,
              st: 0,
              ks: transform,
            },
          ],
        },
        {
          id: 'inner',
          layers: [
            {
              ddd: 0,
              ind: 3,
              ty: 4,
              nm: 'Leaf',
              ip: 0,
              op: 40,
              st: 0,
              ks: transform,
              shapes: [],
            },
          ],
        },
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 0,
          nm: 'Offset Remapped Root',
          refId: 'outer',
          ip: 20,
          op: 60,
          st: 20,
          tm: { a: 0, k: 2 },
          ks: transform,
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const inner = animation.layers.find((layer) => layer.name === 'Offset Remapped Root > Inner Precomp');
    const leaf = animation.layers.find((layer) => layer.name === 'Offset Remapped Root > Inner Precomp > Leaf');

    expect(inner?.startTime).toBe(20);
    expect(inner?.transformStartTime).toBe(20);
    expect(inner?.remappedSourceWindow).toBe(true);
    expect(leaf?.parentStartTime).toBe(0);
    expect(leaf?.remappedSourceWindow).toBe(true);
  });

  it('clips nested source-window precomp descendants to the parent source duration', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const lottie = {
      v: '5.5.0',
      fr: 10,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'root-source',
          layers: [
            {
              ddd: 0,
              ind: 2,
              ty: 0,
              nm: 'Repeated Loop Window',
              refId: 'loop',
              ip: 20,
              op: 30,
              st: 20,
              ks: transform,
            },
          ],
        },
        {
          id: 'loop',
          layers: [
            {
              ddd: 0,
              ind: 3,
              ty: 4,
              nm: 'Long Leaf',
              ip: 0,
              op: 100,
              st: 0,
              ks: transform,
              shapes: [],
            },
          ],
        },
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 0,
          nm: 'Time Remapped Root',
          refId: 'root-source',
          ip: 0,
          op: 60,
          st: 0,
          tm: { a: 0, k: 2 },
          ks: transform,
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const loop = animation.layers.find((layer) => layer.name === 'Time Remapped Root > Repeated Loop Window');
    const leaf = animation.layers.find(
      (layer) => layer.name === 'Time Remapped Root > Repeated Loop Window > Long Leaf',
    );

    expect(loop?.inPoint).toBe(20);
    expect(loop?.outPoint).toBe(30);
    expect(leaf?.inPoint).toBe(0);
    expect(leaf?.outPoint).toBe(10);
    expect(leaf?.remappedSourceWindow).toBe(true);
  });

  it('preserves hidden descendants inside nested masked precomp composites', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const mask = {
      mode: 'a',
      inv: false,
      o: { a: 0, k: 100 },
      x: { a: 0, k: 0 },
      pt: {
        a: 0,
        k: {
          i: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          o: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
          v: [
            [0, 0],
            [10, 0],
            [10, 10],
            [0, 10],
          ],
          c: true,
        },
      },
    };
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'outer',
          layers: [
            {
              ddd: 0,
              ind: 2,
              ty: 0,
              nm: 'Inner Masked',
              refId: 'inner',
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
              masksProperties: [mask],
            },
          ],
        },
        {
          id: 'inner',
          layers: [
            {
              ddd: 0,
              ind: 3,
              ty: 4,
              nm: 'Leaf',
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
              shapes: [],
            },
          ],
        },
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 0,
          nm: 'Outer Masked',
          refId: 'outer',
          ip: 0,
          op: 60,
          st: 0,
          ks: transform,
          masksProperties: [mask],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const outer = animation.layers.find((layer) => layer.name === 'Outer Masked');
    const outerInner = outer?.matteChildren?.find((layer) => layer.name === 'Outer Masked > Inner Masked');
    const outerLeaf = outer?.matteChildren?.find((layer) => layer.name === 'Outer Masked > Inner Masked > Leaf');

    expect(outer?.matteChildren).toBeDefined();
    expect(outerInner?.visible).toBe(true);
    expect(outerInner?.matteChildren?.[0]?.visible).toBe(true);
    expect(outerLeaf?.visible).toBe(true);
    expect(outerLeaf?.hiddenByPrecompComposite).toBe(true);
  });

  it('remaps parents to synthetic layers for matte precomps', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'outer',
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 0,
              nm: 'Matte Precomp',
              refId: 'matte-source',
              td: 1,
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
            },
            {
              ddd: 0,
              ind: 2,
              ty: 4,
              nm: 'Shadow',
              parent: 1,
              tt: 1,
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
              shapes: [],
            },
          ],
        },
        {
          id: 'matte-source',
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: 'Matte Leaf',
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
              shapes: [],
            },
          ],
        },
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 0,
          nm: 'Outer',
          refId: 'outer',
          ip: 0,
          op: 60,
          st: 0,
          ks: transform,
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const matte = animation.layers.find((layer) => layer.name === 'Outer > Matte Precomp');
    const matteLeaf = animation.layers.find((layer) => layer.name === 'Outer > Matte Precomp > Matte Leaf');
    const shadow = animation.layers.find((layer) => layer.name === 'Outer > Shadow');

    expect(matte).toBeDefined();
    expect(matteLeaf).toBeDefined();
    expect(shadow?.parentId).toBe(matte?.ind);
    expect(shadow?.parentId).not.toBe(matteLeaf?.ind);
  });

  it('parses and remaps explicit matte references (tp) through flattening', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const baseLayer = { ddd: 0, ty: 4, ip: 0, op: 60, st: 0, ks: transform, shapes: [] };
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'glasses',
          layers: [
            // Two consumers share one non-adjacent matte source, with an
            // unrelated layer in between (the modern Creator export shape).
            { ...baseLayer, ind: 1, nm: 'Lens A', tt: 1, tp: 3 },
            { ...baseLayer, ind: 2, nm: 'Frame' },
            { ...baseLayer, ind: 3, nm: 'Eye Matte', td: 1 },
            { ...baseLayer, ind: 4, nm: 'Lens B', tt: 1, tp: 3 },
          ],
        },
      ],
      layers: [
        { ...baseLayer, ind: 10, nm: 'Root Matte', td: 1 },
        { ...baseLayer, ind: 11, nm: 'Root Plain' },
        { ...baseLayer, ind: 12, nm: 'Root Consumer', tt: 1, tp: 10 },
        {
          ddd: 0,
          ind: 13,
          ty: 0,
          nm: 'Glasses',
          refId: 'glasses',
          ip: 0,
          op: 60,
          st: 0,
          ks: transform,
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const rootMatte = animation.layers.find((layer) => layer.name === 'Root Matte');
    const rootConsumer = animation.layers.find((layer) => layer.name === 'Root Consumer');
    expect(rootConsumer?.trackMatte).toBe('alpha');
    expect(rootConsumer?.matteParentInd).toBe(rootMatte?.ind);

    const eyeMatte = animation.layers.find((layer) => layer.name === 'Glasses > Eye Matte');
    const lensA = animation.layers.find((layer) => layer.name === 'Glasses > Lens A');
    const lensB = animation.layers.find((layer) => layer.name === 'Glasses > Lens B');
    expect(eyeMatte?.isMatte).toBe(true);
    expect(lensA?.matteParentInd).toBe(eyeMatte?.ind);
    expect(lensB?.matteParentInd).toBe(eyeMatte?.ind);
  });

  it('parses an animated property with no keyframes to its static default', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 1, k: [] },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const opacity = animation.layers[0]!.transform.opacity;
    expect(isAnimated(opacity)).toBe(false);
    expect(opacity).toBe(100);
    expect(evaluateAnimatable(opacity, 0)).toBe(100);
  });

  it('parses an animated property whose keyframes all fail to parse to its static default', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 1, k: [{ t: 0 }] },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [100, 100, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    const opacity = animation.layers[0]!.transform.opacity;
    expect(isAnimated(opacity)).toBe(false);
    expect(opacity).toBe(100);
  });

  it('evaluates a hand-built animated property with no keyframes without throwing', () => {
    // Guards the parser<->scene contract: even if an empty animated property
    // slips past parsing, evaluation must not throw inside the render loop.
    const value = { keyframes: [] } as unknown as Animatable<number>;
    expect(() => evaluateAnimatable(value, 0)).not.toThrow();
    expect(evaluateAnimatable(value, 0)).toBeUndefined();
  });

  it('does not overflow on a self-referential precomp asset', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'comp_0',
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 0,
              nm: 'Self',
              refId: 'comp_0',
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
            },
          ],
        },
      ],
      layers: [{ ddd: 0, ind: 1, ty: 0, nm: 'Root', refId: 'comp_0', ip: 0, op: 60, st: 0, ks: transform }],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    expect(animation.layers).toHaveLength(2);
    expect(animation.layers.map((layer) => layer.name)).toContain('Root > Self');
  });

  it('does not overflow on mutually referencing precomp assets', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'comp_a',
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 0,
              nm: 'ToB',
              refId: 'comp_b',
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
            },
          ],
        },
        {
          id: 'comp_b',
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 0,
              nm: 'ToA',
              refId: 'comp_a',
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
            },
          ],
        },
      ],
      layers: [{ ddd: 0, ind: 1, ty: 0, nm: 'Root', refId: 'comp_a', ip: 0, op: 60, st: 0, ks: transform }],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    expect(animation.layers).toHaveLength(3);
    expect(animation.layers.map((layer) => layer.name)).toContain('Root > ToB > ToA');
  });

  it('does not overflow on a self-referential slot', () => {
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      slots: {
        primary: { p: { a: 0, k: { sid: 'primary' } } },
      },
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 4,
          nm: 'Shape',
          ip: 0,
          op: 60,
          ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [256, 256, 0] },
            a: { a: 0, k: [0, 0, 0] },
            s: { a: 0, k: [100, 100, 100] },
          },
          shapes: [
            {
              ty: 'gr',
              it: [
                {
                  ty: 'rc',
                  p: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [100, 100] },
                  r: { a: 0, k: 0 },
                },
                { ty: 'fl', c: { sid: 'primary' }, o: { a: 0, k: 100 } },
              ],
            },
          ],
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    expect(animation.layers).toHaveLength(1);
    expect(animation.slots?.['primary']).toBeDefined();
  });

  it('still expands an acyclic asset referenced by two sibling layers', () => {
    const transform = {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [0, 0, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    };
    const lottie = {
      v: '5.5.0',
      fr: 60,
      ip: 0,
      op: 60,
      w: 512,
      h: 512,
      assets: [
        {
          id: 'leaf',
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: 'LeafShape',
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
              shapes: [],
            },
          ],
        },
        {
          id: 'comp_root',
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 0,
              nm: 'UseA',
              refId: 'leaf',
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
            },
            {
              ddd: 0,
              ind: 2,
              ty: 0,
              nm: 'UseB',
              refId: 'leaf',
              ip: 0,
              op: 60,
              st: 0,
              ks: transform,
            },
          ],
        },
      ],
      layers: [
        {
          ddd: 0,
          ind: 1,
          ty: 0,
          nm: 'Root',
          refId: 'comp_root',
          ip: 0,
          op: 60,
          st: 0,
          ks: transform,
        },
      ],
    };

    const animation = parseLottie(lottie as unknown as Record<string, unknown>);
    expect(animation.layers).toHaveLength(5);
    const names = animation.layers.map((layer) => layer.name);
    expect(names).toContain('Root > UseA > LeafShape');
    expect(names).toContain('Root > UseB > LeafShape');
  });
});
