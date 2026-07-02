import { describe, expect, it } from 'vitest';
import { buildCommandList, buildLayerCommands } from '../../src/lite/model/commands';
import type { Animation, Layer, LayerDefinition } from '../../src/lite/model/types';

function createLayer(overrides: Partial<Layer> = {}): Layer {
  return {
    id: 'layer-1',
    name: 'Layer',
    index: 0,
    inPoint: 0,
    outPoint: 30,
    transform: {
      position: { x: 10, y: 20 },
      anchor: { x: 0, y: 0 },
      scale: { x: 100, y: 100 },
      rotation: 0,
      opacity: 80,
    },
    shapes: [
      {
        id: 'shape-1',
        type: 'rect',
        rect: { x: 0, y: 0, width: 100, height: 100 },
        position: { x: 50, y: 50 },
        size: { x: 100, y: 100 },
        cornerRadius: 0,
        fill: { type: 'solid', color: { r: 255, g: 0, b: 0, a: 1 } },
      },
    ],
    visible: true,
    ...overrides,
  } as Layer;
}

function createAnimation(layers: LayerDefinition[]): Animation {
  return {
    version: '5.7.0',
    frameRate: 30,
    inPoint: 0,
    outPoint: 30,
    duration: 30,
    width: 200,
    height: 200,
    layers,
  };
}

describe('buildLayerCommands', () => {
  it('emits save, transform, drawShape, restore for a basic layer', () => {
    const layer = createLayer();
    const commands = buildLayerCommands(layer);

    expect(commands.map((c) => c.type)).toEqual(['save', 'transform', 'drawShape', 'restore']);

    const transform = commands.find((c) => c.type === 'transform');
    expect(transform?.transform.opacity).toBe(80);

    const drawShape = commands.find((c) => c.type === 'drawShape');
    expect(drawShape?.shape.type).toBe('rect');
  });

  it('emits blendMode and filter commands when present', () => {
    const layer = createLayer({
      blendMode: 'multiply',
      effects: [{ type: 'gaussian-blur', blurriness: 4 }],
    });
    const commands = buildLayerCommands(layer);

    expect(commands.map((c) => c.type)).toEqual(['save', 'transform', 'blendMode', 'filter', 'drawShape', 'restore']);

    const filter = commands.find((c) => c.type === 'filter');
    expect(filter?.filter).toBe('blur(4.00px)');
  });

  it('emits drawImage and drawText when present', () => {
    const layer = createLayer({
      image: { src: 'image.png', width: 50, height: 50 },
      text: {
        text: 'Hi',
        fontFamily: 'Arial',
        size: 24,
        color: { r: 0, g: 0, b: 0, a: 1 },
      },
    });
    const commands = buildLayerCommands(layer);

    expect(commands.map((c) => c.type)).toEqual(['save', 'transform', 'drawShape', 'drawImage', 'drawText', 'restore']);
  });

  it('emits a tint command after drawing commands', () => {
    const layer = createLayer({
      effects: [{ type: 'tint', color: { r: 0, g: 255, b: 0, a: 1 }, amount: 0.5 }],
    });
    const commands = buildLayerCommands(layer);

    const tint = commands[commands.length - 2];
    expect(tint?.type).toBe('tint');
  });

  it('emits a fill effect command after drawing commands', () => {
    const layer = createLayer({
      effects: [
        { type: 'fill', color: { r: 255, g: 170, b: 0, a: 1 }, opacity: 1 },
        { type: 'tint', color: { r: 0, g: 255, b: 0, a: 1 }, amount: 0.5 },
      ],
    });
    const commands = buildLayerCommands(layer);

    expect(commands.map((c) => c.type)).toEqual(['save', 'transform', 'drawShape', 'fillEffect', 'tint', 'restore']);
  });

  it('can omit blendMode when includeBlendMode is false', () => {
    const layer = createLayer({ blendMode: 'screen' });
    const commands = buildLayerCommands(layer, { includeBlendMode: false });

    expect(commands.some((c) => c.type === 'blendMode')).toBe(false);
  });
});

describe('buildCommandList', () => {
  it('includes visible layers in range and skips matte layers', () => {
    const layers: LayerDefinition[] = [
      {
        ...(createLayer({ id: 'matte', isMatte: true }) as unknown as LayerDefinition),
        ind: 1,
      },
      {
        ...(createLayer({ id: 'masked', trackMatte: 'alpha' }) as unknown as LayerDefinition),
        ind: 2,
      },
      {
        ...(createLayer({ id: 'normal' }) as unknown as LayerDefinition),
        ind: 3,
      },
    ];

    const animation = createAnimation(layers);
    const commands = buildCommandList(animation, 0);

    const drawShapes = commands.filter((c) => c.type === 'drawShape');
    expect(drawShapes).toHaveLength(2);
  });

  it('skips layers outside their in/out points', () => {
    const layers: LayerDefinition[] = [
      {
        ...(createLayer({ id: 'early', inPoint: 0, outPoint: 5 }) as unknown as LayerDefinition),
        ind: 1,
      },
      {
        ...(createLayer({ id: 'late', inPoint: 10, outPoint: 30 }) as unknown as LayerDefinition),
        ind: 2,
      },
    ];

    const animation = createAnimation(layers);
    const commands = buildCommandList(animation, 7);

    const drawShapes = commands.filter((c) => c.type === 'drawShape');
    expect(drawShapes).toHaveLength(0);
  });

  it('treats layer out points as exclusive on the composition timeline', () => {
    const layers: LayerDefinition[] = [
      {
        ...(createLayer({
          id: 'ending-at-comp-start',
          inPoint: 0,
          outPoint: 100,
        }) as unknown as LayerDefinition),
        ind: 1,
      },
      {
        ...(createLayer({
          id: 'active-at-comp-start',
          inPoint: 100,
          outPoint: 110,
        }) as unknown as LayerDefinition),
        ind: 2,
      },
    ];

    const animation = {
      ...createAnimation(layers),
      inPoint: 100,
      outPoint: 110,
      duration: 10,
    };
    const commands = buildCommandList(animation, 0);

    const drawShapes = commands.filter((c) => c.type === 'drawShape');
    expect(drawShapes).toHaveLength(1);
  });
});
