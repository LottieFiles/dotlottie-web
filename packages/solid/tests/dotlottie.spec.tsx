import type { Config } from '@lottiefiles/dotlottie-web';
import { createRoot } from 'solid-js';
import { describe, expect, it, vi } from 'vitest';
import type { DotLottieSolidProps } from '../src/dotlottie';

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
