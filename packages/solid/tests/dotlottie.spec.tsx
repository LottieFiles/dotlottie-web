import type { Config } from '@lottiefiles/dotlottie-web';
import { createRoot, createSignal } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import type { DotLottieSolidProps } from '../src/dotlottie';

const { load } = vi.hoisted(() => ({ load: vi.fn() }));

vi.mock('@lottiefiles/dotlottie-web', () => ({
  DotLottie: class {
    load = load;
    destroy = vi.fn();
    stateMachineSetConfig = vi.fn();
  },
}));

const captured: { canvasProps?: DotLottieSolidProps; playerProps?: DotLottieSolidProps } = {};

vi.mock('../src/use-dotlottie', () => ({
  useDotLottie: (props: DotLottieSolidProps) => {
    captured.playerProps = { ...props };

    return {
      DotLottieComponent: (canvasProps: DotLottieSolidProps) => {
        captured.canvasProps = { ...canvasProps };

        return null;
      },
      dotLottie: () => undefined,
    };
  },
}));

const { DotLottieSolid } = await import('../src/dotlottie');
const { useDotLottie } = await vi.importActual<typeof import('../src/use-dotlottie')>('../src/use-dotlottie');

describe('DotLottieSolid', () => {
  it('passes backgroundColor and layout to the player instead of the canvas', () => {
    const layout: NonNullable<Config['layout']> = { fit: 'cover', align: [0, 0] };

    createRoot((dispose) => {
      DotLottieSolid({ src: 'animation.lottie', backgroundColor: '#ff0000', layout, id: 'player' });
      dispose();
    });

    expect(captured.playerProps?.backgroundColor).toBe('#ff0000');
    expect(captured.playerProps?.layout).toEqual(layout);
    expect(captured.canvasProps).not.toHaveProperty('backgroundColor');
    expect(captured.canvasProps).not.toHaveProperty('layout');
    expect(captured.canvasProps?.id).toBe('player');
  });
});

describe('useDotLottie', () => {
  it('reloads reactive data when it changes from a string to a buffer and then to a JSON object', () => {
    const initialData = '{"layers":[]}';
    const buffer = new ArrayBuffer(8);
    const animation = { layers: [] };
    const [data, setData] = createSignal<Config['data']>(initialData);
    load.mockClear();

    const dispose = createRoot((dispose) => {
      const player = useDotLottie({
        get data() {
          return data();
        },
      });

      player.setCanvasRef(new EventTarget() as HTMLCanvasElement);
      return dispose;
    });

    try {
      expect(load).toHaveBeenNthCalledWith(1, { data: initialData });
      setData(buffer);
      expect.soft(load).toHaveBeenNthCalledWith(2, { data: buffer });
      setData(animation);
      expect.soft(load).toHaveBeenNthCalledWith(3, { data: animation });
    } finally {
      dispose();
    }
  });
});
