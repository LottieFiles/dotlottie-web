import type { Config } from '@lottiefiles/dotlottie-web';
import { createRoot, createSignal } from 'solid-js';
import { expect, it, vi } from 'vitest';
import { useDotLottie } from '../src/use-dotlottie';

// Exercise client-side effects in the Solid package's Node test environment.
vi.mock('solid-js', () => vi.importActual<typeof import('solid-js')>('solid-js/dist/solid.js'));

vi.mock('@lottiefiles/dotlottie-web', () => ({
  DotLottie: class {
    isLoaded = true;
    setSegment = vi.fn();
    resetSegment = vi.fn();
    destroy = vi.fn();
    setThemeData = vi.fn();
    stateMachineStop = vi.fn();
    stateMachineSetConfig = vi.fn();
  },
}));

it('resets the segment when the segment prop is cleared', () => {
  const { dispose, dotLottie, setSegment } = createRoot((dispose) => {
    const [segment, setSegment] = createSignal<Config['segment']>();
    const { dotLottie, setCanvasRef } = useDotLottie({
      get segment() {
        return segment();
      },
    });

    setCanvasRef({ addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as HTMLCanvasElement);

    return { dispose, dotLottie, setSegment };
  });

  try {
    const player = dotLottie();
    if (!player) throw new Error('expected a player instance');

    const resetSegment = vi.mocked(player.resetSegment);
    resetSegment.mockClear();

    setSegment([0, 10]);
    expect(player.setSegment).toHaveBeenCalledWith(0, 10);
    expect(resetSegment).not.toHaveBeenCalled();

    setSegment(undefined);
    expect(resetSegment).toHaveBeenCalledTimes(1);
  } finally {
    dispose();
  }
});
