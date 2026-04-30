import { DotLottie } from '@lottiefiles/dotlottie-web';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';

import DotLottieSvelte from '../src/lib/Dotlottie.svelte';

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const dotLottieSrc = new URL('../../../fixtures/test.lottie', import.meta.url).href;
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const lottieSrc = new URL('../../../fixtures/test.json', import.meta.url).href;
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const smSrc = new URL('../../../fixtures/sm.lottie', import.meta.url).href;

describe('DotLottieSvelte', () => {
  afterEach(() => {
    cleanup();
  });

  test('basic', async () => {
    const onLoad = vi.fn();
    const onDestroy = vi.fn();
    const onComplete = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { container, unmount } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    expect(container).toMatchSnapshot();

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    expect(dotLottie).toBeInstanceOf(DotLottie);

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

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const setLoop = vi.spyOn(dotLottie, 'setLoop');

    expect(dotLottie?.loop).toBe(false);

    rerender({ src: dotLottieSrc, autoplay: true, loop: true, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setLoop).toHaveBeenCalledWith(true);
    });

    await vi.waitFor(() => {
      expect(dotLottie?.loop).toBe(true);
    });

    rerender({ src: dotLottieSrc, autoplay: true, loop: false, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setLoop).toHaveBeenCalledWith(false);
    });

    await vi.waitFor(() => {
      expect(dotLottie?.loop).toBe(false);
    });
  });

  test('calls dotLottie.setSpeed when speed prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const setSpeed = vi.spyOn(dotLottie, 'setSpeed');

    expect(dotLottie?.speed).toBe(1);

    rerender({ src: dotLottieSrc, autoplay: true, speed: 2, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setSpeed).toHaveBeenCalledWith(2);
    });

    await vi.waitFor(() => {
      expect(dotLottie?.speed).toBe(2);
    });

    rerender({ src: dotLottieSrc, autoplay: true, speed: 1, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setSpeed).toHaveBeenCalledWith(1);
    });

    await vi.waitFor(() => {
      expect(dotLottie?.speed).toBe(1);
    });
  });

  test('calls dotLottie.setMode when mode prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const setMode = vi.spyOn(dotLottie, 'setMode');

    expect(dotLottie?.mode).toBe('forward');

    rerender({ src: dotLottieSrc, autoplay: true, mode: 'reverse', dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setMode).toHaveBeenCalledWith('reverse');
    });

    await vi.waitFor(() => {
      expect(dotLottie?.mode).toBe('reverse');
    });

    rerender({ src: dotLottieSrc, autoplay: true, mode: 'forward', dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setMode).toHaveBeenCalledWith('forward');
    });

    await vi.waitFor(() => {
      expect(dotLottie?.mode).toBe('forward');
    });
  });

  test('calls dotLottie.setUseFrameInterpolation when useFrameInterpolation prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

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

    rerender({ src: dotLottieSrc, autoplay: true, useFrameInterpolation: false, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setUseFrameInterpolation).toHaveBeenCalledWith(false);
    });

    await vi.waitFor(() => {
      expect(dotLottie?.useFrameInterpolation).toBe(false);
    });

    rerender({ src: dotLottieSrc, autoplay: true, useFrameInterpolation: true, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setUseFrameInterpolation).toHaveBeenCalledWith(true);
    });

    await vi.waitFor(() => {
      expect(dotLottie?.useFrameInterpolation).toBe(true);
    });
  });

  test('calls dotLottie.setBackgroundColor when backgroundColor prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

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

    rerender({ src: dotLottieSrc, autoplay: true, backgroundColor: '#00ff00ff', dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setBackgroundColor).toHaveBeenCalledWith('#00ff00ff');
    });

    rerender({ src: dotLottieSrc, autoplay: true, backgroundColor: undefined, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setBackgroundColor).toHaveBeenCalledWith('');
    });

    expect(dotLottie?.backgroundColor).toBe('');
  });

  test('calls dotLottie.setMarker when marker prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

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

    rerender({ src: dotLottieSrc, autoplay: true, marker: 'Marker_1', dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setMarker).toHaveBeenCalledWith('Marker_1');
    });

    rerender({ src: dotLottieSrc, autoplay: true, marker: '', dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setMarker).toHaveBeenCalledWith('');
    });

    expect(dotLottie?.marker).toBe('');
  });

  test('playOnHover', async () => {
    const user = userEvent.setup();
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { container, rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      playOnHover: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const play = vi.spyOn(dotLottie, 'play');
    const pause = vi.spyOn(dotLottie, 'pause');

    const canvasElement = container.querySelector('canvas') as HTMLElement;

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

    rerender({ src: dotLottieSrc, autoplay: true, playOnHover: false, dotLottieRefCallback });

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

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const loadAnimation = vi.spyOn(dotLottie, 'loadAnimation');

    rerender({ src: dotLottieSrc, autoplay: true, animationId: 'Animation_1', dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(loadAnimation).toHaveBeenCalledWith('Animation_1');
    });
  });

  test('calls dotLottie.setRenderConfig when renderConfig prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const defaultRenderConfig = dotLottie?.renderConfig;
    const setRenderConfig = vi.spyOn(dotLottie, 'setRenderConfig');

    rerender({
      src: dotLottieSrc,
      autoplay: true,
      renderConfig: { devicePixelRatio: 0.5, freezeOnOffscreen: false },
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(setRenderConfig).toHaveBeenCalledWith({ devicePixelRatio: 0.5, freezeOnOffscreen: false });
    });

    rerender({ src: dotLottieSrc, autoplay: true, renderConfig: undefined, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setRenderConfig).toHaveBeenCalledWith({});
    });

    expect(dotLottie?.renderConfig).toEqual(defaultRenderConfig);
  });

  test('calls dotLottie.load when data prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    let response = await fetch(lottieSrc);
    const animationData = await response.json();

    const { rerender } = render(DotLottieSvelte, {
      data: animationData,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const load = vi.spyOn(dotLottie, 'load');

    response = await fetch(dotLottieSrc);
    const dotLottieAnimationData = await response.arrayBuffer();

    rerender({ data: dotLottieAnimationData, autoplay: true, loop: true, speed: 2, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(load).toHaveBeenCalledTimes(1);
    });

    expect(load).toHaveBeenCalledWith(
      expect.objectContaining({
        data: dotLottieAnimationData,
        loop: true,
        autoplay: true,
        speed: 2,
      }),
    );
  });

  test('calls dotLottie.load when src prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const load = vi.spyOn(dotLottie, 'load');

    rerender({ src: lottieSrc, autoplay: true, loop: true, speed: 2, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(load).toHaveBeenCalledTimes(1);
    });

    expect(load).toHaveBeenCalledWith(
      expect.objectContaining({
        src: lottieSrc,
        loop: true,
        autoplay: true,
        speed: 2,
      }),
    );
  });

  test('calls dotLottie.setLayout when layout prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const setLayout = vi.spyOn(dotLottie, 'setLayout');

    rerender({
      src: dotLottieSrc,
      autoplay: true,
      layout: { align: [0.5, 0.5], fit: 'contain' },
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(setLayout).toHaveBeenCalledWith({ align: [0.5, 0.5], fit: 'contain' });
    });

    rerender({ src: dotLottieSrc, autoplay: true, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setLayout).toHaveBeenCalledTimes(2);
    });
  });

  test('calls dotLottie.setLayout properly when layout prop changes with fit only', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: dotLottieSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const setLayout = vi.spyOn(dotLottie, 'setLayout');

    rerender({ src: dotLottieSrc, autoplay: true, layout: { fit: 'cover' }, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(setLayout).toHaveBeenCalledWith({ fit: 'cover' });
    });
  });

  test('calls stateMachineLoad and stateMachineStart when stateMachineId prop changes', async () => {
    const onLoad = vi.fn();
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: smSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0][0];

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const stateMachineLoad = vi.spyOn(dotLottie, 'stateMachineLoad').mockReturnValue(true);
    const stateMachineStart = vi.spyOn(dotLottie, 'stateMachineStart');
    const stateMachineStop = vi.spyOn(dotLottie, 'stateMachineStop');

    rerender({ src: smSrc, autoplay: true, stateMachineId: 'testSM', dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(stateMachineLoad).toHaveBeenCalledWith('testSM');
      expect(stateMachineStart).toHaveBeenCalledTimes(1);
    });

    rerender({ src: smSrc, autoplay: true, stateMachineId: undefined, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(stateMachineStop).toHaveBeenCalledTimes(1);
    });
  });

  test('calls stateMachineSetConfig when stateMachineConfig prop changes', async () => {
    const dotLottieRefCallback = vi.fn();

    const { rerender } = render(DotLottieSvelte, {
      src: smSrc,
      autoplay: true,
      dotLottieRefCallback,
    });

    await vi.waitFor(() => {
      expect(dotLottieRefCallback).toHaveBeenCalledTimes(1);
    });

    const dotLottie = dotLottieRefCallback.mock.calls[0]?.[0];

    const stateMachineSetConfig = vi.spyOn(dotLottie, 'stateMachineSetConfig');

    const config = { openUrlPolicy: { whitelist: ['*'] } };

    rerender({ src: smSrc, autoplay: true, stateMachineConfig: config, dotLottieRefCallback });

    await vi.waitFor(() => {
      expect(stateMachineSetConfig).toHaveBeenCalledWith(config);
    });
  });
});
