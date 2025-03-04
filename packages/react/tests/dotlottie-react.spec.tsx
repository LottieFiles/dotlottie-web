/* eslint-disable node/no-unsupported-features/node-builtins */
import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { DotLottie as DotLottieWebGL } from '@lottiefiles/dotlottie-web/webgl';
import { DotLottie as DotLottieWebGPU } from '@lottiefiles/dotlottie-web/webgpu';
import { userEvent } from '@testing-library/user-event';
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { ComponentRenderOptions, RenderResult } from 'vitest-browser-react';
import { cleanup, render as vitestRender } from 'vitest-browser-react';

import { DotLottieReact, DotLottieWorkerReact, setWasmUrl } from '../src';
import { DotLottieReact as DotLottieWebGLReact, setWasmUrl as setWebGLWasmUrl } from '../src/webgl';
import { DotLottieReact as DotLottieWebGPUReact, setWasmUrl as setWebGPUWasmUrl } from '../src/webgpu';

setWasmUrl(new URL('../../web/src/software/wasm/dotlottie-player.wasm?url', import.meta.url).href);
setWebGLWasmUrl(new URL('../../web/src/webgl/wasm/dotlottie-player.wasm?url', import.meta.url).href);
setWebGPUWasmUrl(new URL('../../web/src/webgpu/wasm/dotlottie-player.wasm?url', import.meta.url).href);

const dotLottieSrc = new URL('./__fixtures__/test.lottie', import.meta.url).href;
const lottieSrc = new URL('./__fixtures__/test.json', import.meta.url).href;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const render = (ui: React.ReactNode, options?: ComponentRenderOptions): RenderResult =>
  vitestRender(ui, { wrapper: Wrapper, ...options });

describe.each([
  { name: 'DotLottieReact', component: DotLottieReact, instanceType: DotLottie },
  { name: 'DotLottieWorkerReact', component: DotLottieWorkerReact, instanceType: DotLottieWorker },
  { name: 'DotLottieWebGPUReact', component: DotLottieWebGPUReact, instanceType: DotLottieWebGPU },
  { name: 'DotLottieWebGLReact', component: DotLottieWebGLReact, instanceType: DotLottieWebGL },
])('$name', ({ component: Component, instanceType }) => {
  afterEach(() => {
    cleanup();
  });

  test('basic', async () => {
    const onLoad = vi.fn();
    const onDestroy = vi.fn();
    const onComplete = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { container, unmount } = render(
      <Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />,
    );

    expect(container).toMatchSnapshot();

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

  test('calls dotLottie.setMarker when marker prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    const setMarker = vi.spyOn(dotLottie, 'setMarker');

    dotLottie?.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie?.marker).toBe('');

    rerender(<Component src={dotLottieSrc} autoplay marker="Marker_1" dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setMarker).toHaveBeenCalledTimes(1);
    });

    expect(setMarker).toHaveBeenCalledWith('Marker_1');

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setMarker).toHaveBeenCalledTimes(2);
    });

    expect(dotLottie?.marker).toBe('');
  });

  test.todo('calls dotLottie.setSegment & dotLottie.resetSegment when segment prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    const setSegment = vi.spyOn(dotLottie, 'setSegment');
    const resetSegment = vi.spyOn(dotLottie, 'resetSegment');

    dotLottie?.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie?.segment).toBeUndefined();

    rerender(<Component src={dotLottieSrc} autoplay segment={[0, 10]} dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setSegment).toHaveBeenCalledTimes(1);
    });

    expect(setSegment).toHaveBeenCalledWith(0, 10);

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(resetSegment).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie?.segment).toBeUndefined();
  });

  test.todo('calls dotLottie.setTheme & dotLottie.resetTheme when themeId prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    const setTheme = vi.spyOn(dotLottie, 'setTheme');
    const resetTheme = vi.spyOn(dotLottie, 'resetTheme');

    dotLottie?.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie?.themeId).toBeUndefined();

    rerender(<Component src={dotLottieSrc} autoplay themeId="Theme_1" dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setTheme).toHaveBeenCalledTimes(1);
    });

    expect(setTheme).toHaveBeenCalledWith('Theme_1');

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(resetTheme).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie?.themeId).toBeUndefined();
  });

  test('playOnHover', async () => {
    const user = userEvent.setup();

    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const screen = render(
      <Component
        data-testid="dotLottie-canvas"
        src={dotLottieSrc}
        autoplay
        playOnHover
        dotLottieRefCallback={dotLottieRefCallback}
      />,
    );

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    dotLottie?.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const play = vi.spyOn(dotLottie, 'play');
    const pause = vi.spyOn(dotLottie, 'pause');

    let canvasElement = screen.getByTestId('dotLottie-canvas').element();

    await user.hover(canvasElement);

    await vi.waitFor(() => {
      expect(play).toHaveBeenCalledTimes(1);
    });

    await user.unhover(canvasElement);

    await vi.waitFor(() => {
      expect(pause).toHaveBeenCalledTimes(1);
    });

    play.mockClear();
    pause.mockClear();

    // shouldn't call play/pause again as the playOnHover prop is undefined
    screen.rerender(
      <Component
        data-testid="dotLottie-canvas"
        src={dotLottieSrc}
        autoplay
        dotLottieRefCallback={dotLottieRefCallback}
      />,
    );

    canvasElement = screen.getByTestId('dotLottie-canvas').element();

    let mouseEnterCount = 0;
    let mouseLeaveCount = 0;

    canvasElement.addEventListener('mouseenter', () => {
      mouseEnterCount += 1;
    });
    canvasElement.addEventListener('mouseleave', () => {
      mouseLeaveCount += 1;
    });

    await user.hover(canvasElement);

    await vi.waitFor(() => {
      expect(mouseEnterCount).toBe(1);
      expect(mouseLeaveCount).toBe(0);
    });

    expect(play).not.toHaveBeenCalled();

    await user.unhover(canvasElement);

    await vi.waitFor(() => {
      expect(mouseEnterCount).toBe(1);
      expect(mouseLeaveCount).toBe(1);
    });

    expect(pause).not.toHaveBeenCalled();
  });

  test('calls dotLottie.loadAnimation when animationId prop changes', async () => {
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

    const loadAnimation = vi.spyOn(dotLottie, 'loadAnimation');

    rerender(
      <Component src={dotLottieSrc} autoplay animationId="Animation_1" dotLottieRefCallback={dotLottieRefCallback} />,
    );

    await vi.waitFor(() => {
      expect(loadAnimation).toHaveBeenCalledTimes(1);
    });

    expect(loadAnimation).toHaveBeenCalledWith('Animation_1');

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(loadAnimation).toHaveBeenCalledTimes(2);
    });

    expect(loadAnimation).toHaveBeenCalledWith('');

    await vi.waitFor(() => {
      expect(dotLottie?.activeAnimationId).toBe('');
    });
  });

  test('calls dotLottie.setRenderConfig when renderConfig prop changes', async () => {
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

    const defaultRenderConfig = dotLottie?.renderConfig;

    const setRenderConfig = vi.spyOn(dotLottie, 'setRenderConfig');

    rerender(
      <Component
        src={dotLottieSrc}
        autoplay
        renderConfig={{
          devicePixelRatio: 0.5,
          freezeOnOffscreen: false,
        }}
        dotLottieRefCallback={dotLottieRefCallback}
      />,
    );

    await vi.waitFor(() => {
      expect(setRenderConfig).toHaveBeenCalledTimes(1);
    });

    expect(setRenderConfig).toHaveBeenCalledWith({
      devicePixelRatio: 0.5,
      freezeOnOffscreen: false,
    });

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setRenderConfig).toHaveBeenCalledTimes(2);
    });

    expect(setRenderConfig).toHaveBeenCalledWith({});

    // Falls back to the default values
    expect(dotLottie?.renderConfig).toEqual(defaultRenderConfig);
  });

  test('calls dotLottie.load when data prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    let response = await fetch(lottieSrc);
    const animationData = await response.json();

    const { rerender } = render(
      <Component data={animationData} autoplay dotLottieRefCallback={dotLottieRefCallback} />,
    );

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    dotLottie?.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const load = vi.spyOn(dotLottie, 'load');

    response = await fetch(dotLottieSrc);
    const dotLottieAnimationData = await response.arrayBuffer();

    rerender(
      <Component data={dotLottieAnimationData} autoplay loop speed={2} dotLottieRefCallback={dotLottieRefCallback} />,
    );

    await vi.waitFor(() => {
      expect(load).toHaveBeenCalledTimes(1);
    });

    expect(load).toHaveBeenCalledWith({
      data: dotLottieAnimationData,
      loop: true,
      autoplay: true,
      speed: 2,
    });
  });

  test('calls dotLottie.load when src prop changes', async () => {
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

    const load = vi.spyOn(dotLottie, 'load');

    rerender(<Component src={lottieSrc} autoplay loop speed={2} dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(load).toHaveBeenCalledTimes(1);
    });

    expect(load).toHaveBeenCalledWith({
      src: lottieSrc,
      loop: true,
      autoplay: true,
      speed: 2,
    });
  });

  test('calls dotLottie.setLayout when layout prop changes', async () => {
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

    const setLayout = vi.spyOn(dotLottie, 'setLayout');

    rerender(
      <Component
        src={dotLottieSrc}
        autoplay
        layout={{ align: [0.5, 0.5], fit: 'contain' }}
        dotLottieRefCallback={dotLottieRefCallback}
      />,
    );

    await vi.waitFor(() => {
      expect(setLayout).toHaveBeenCalledTimes(1);
    });

    expect(setLayout).toHaveBeenCalledWith({ align: [0.5, 0.5], fit: 'contain' });

    rerender(<Component src={dotLottieSrc} autoplay dotLottieRefCallback={dotLottieRefCallback} />);

    await vi.waitFor(() => {
      expect(setLayout).toHaveBeenCalledTimes(2);
    });

    expect(setLayout).toHaveBeenCalledWith({ align: [0.5, 0.5], fit: 'contain' });
  });
});
