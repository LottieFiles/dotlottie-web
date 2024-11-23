import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { ComponentRenderOptions, RenderResult } from 'vitest-browser-react';
import { cleanup, render as vitestRender } from 'vitest-browser-react';

import { DotLottieReact, DotLottieWorkerReact } from '../src';

import baseSrc from './__fixtures__/test.lottie?url';

const dotLottieSrc = `http://localhost:5173/${baseSrc}`;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const render = (ui: React.ReactNode, options?: ComponentRenderOptions): RenderResult =>
  vitestRender(ui, { wrapper: Wrapper, ...options });

describe.each([
  { component: DotLottieReact, instanceType: DotLottie },
  { component: DotLottieWorkerReact, instanceType: DotLottieWorker },
])('$component.name', ({ component: Component, instanceType }) => {
  afterEach(() => {
    cleanup();
  });

  test('basic', async () => {
    const onLoad = vi.fn();
    const onDestroy = vi.fn();
    const onComplete = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { unmount } = render(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    expect(dotLottie).toBeInstanceOf(instanceType);

    dotLottie?.addEventListener('load', onLoad);
    dotLottie?.addEventListener('destroy', onDestroy);
    dotLottie?.addEventListener('complete', onComplete);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(
      () => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: dotLottie?.duration * 1000 + 100 },
    );

    unmount();

    await vi.waitFor(() => {
      expect(onDestroy).toHaveBeenCalledTimes(1);
    });
  });

  test('calls dotLottie.setLoop when loop prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    const setLoop = vi.spyOn(dotLottie, 'setLoop');

    dotLottie?.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie?.loop).toBe(false);

    rerender(<Component src={dotLottieSrc} autoplay loop dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setLoop).toHaveBeenCalledTimes(1);
    });

    expect(setLoop).toHaveBeenCalledWith(true);

    await vi.waitFor(() => {
      expect(dotLottie?.loop).toBe(true);
    });

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setLoop).toHaveBeenCalledTimes(2);
    });

    expect(setLoop).toHaveBeenCalledWith(false);

    await vi.waitFor(() => {
      expect(dotLottie?.loop).toBe(false);
    });
  });

  test('calls dotLottie.setSpeed when speed prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    dotLottie?.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const setSpeed = vi.spyOn(dotLottie, 'setSpeed');

    expect(dotLottie?.speed).toBe(1);

    rerender(<Component src={dotLottieSrc} autoplay speed={2} dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setSpeed).toHaveBeenCalledTimes(1);
    });

    expect(setSpeed).toHaveBeenCalledWith(2);

    await vi.waitFor(() => {
      expect(dotLottie?.speed).toBe(2);
    });

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setSpeed).toHaveBeenCalledTimes(2);
    });

    expect(setSpeed).toHaveBeenCalledWith(1);

    await vi.waitFor(() => {
      expect(dotLottie?.speed).toBe(1);
    });
  });

  test('calls dotLottie.setMode when mode prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    dotLottie?.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const setMode = vi.spyOn(dotLottie, 'setMode');

    expect(dotLottie?.mode).toBe('forward');

    rerender(<Component src={dotLottieSrc} autoplay mode="reverse" dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setMode).toHaveBeenCalledTimes(1);
    });

    expect(setMode).toHaveBeenCalledWith('reverse');

    await vi.waitFor(() => {
      expect(dotLottie?.mode).toBe('reverse');
    });

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setMode).toHaveBeenCalledTimes(2);
    });

    expect(setMode).toHaveBeenCalledWith('forward');

    await vi.waitFor(() => {
      expect(dotLottie?.mode).toBe('forward');
    });
  });

  test('calls dotLottie.setUseFrameInterpolation when useFrameInterpolation prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    const setUseFrameInterpolation = vi.spyOn(dotLottie, 'setUseFrameInterpolation');

    dotLottie?.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie?.useFrameInterpolation).toBe(true);

    rerender(
      <Component
        src={dotLottieSrc}
        autoplay
        useFrameInterpolation={false}
        dotLottieRefCallback={dotLottieRefCallback}
      />,
    );

    await vi.waitFor(() => {
      expect(setUseFrameInterpolation).toHaveBeenCalledTimes(1);
    });

    expect(setUseFrameInterpolation).toHaveBeenCalledWith(false);

    await vi.waitFor(() => {
      expect(dotLottie?.useFrameInterpolation).toBe(false);
    });

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setUseFrameInterpolation).toHaveBeenCalledTimes(2);
    });

    expect(setUseFrameInterpolation).toHaveBeenCalledWith(true);

    await vi.waitFor(() => {
      expect(dotLottie?.useFrameInterpolation).toBe(true);
    });
  });

  test('calls dotLottie.setBackgroundColor when backgroundColor prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    const setBackgroundColor = vi.spyOn(dotLottie, 'setBackgroundColor');

    dotLottie?.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie?.backgroundColor).toBe('');

    rerender(
      <Component src={dotLottieSrc} autoplay backgroundColor="#00ff00ff" dotLottieRefCallback={dotLottieRefCallback} />,
    );

    await vi.waitFor(() => {
      expect(setBackgroundColor).toHaveBeenCalledTimes(1);
    });

    expect(setBackgroundColor).toHaveBeenCalledWith('#00ff00ff');

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setBackgroundColor).toHaveBeenCalledTimes(2);
    });

    expect(dotLottie?.backgroundColor).toBe('');
  });
});
