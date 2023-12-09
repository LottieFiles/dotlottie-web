/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, afterEach, beforeEach, test, expect, vi } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas, sleep } from '../../test-utils';

// to use the local wasm file
DotLottie.setWasmUrl('src/renderer-wasm/bin/renderer.wasm');

describe.skip('play animation', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;
  const src = 'https://lottie.host/66096915-99e9-472d-ad95-591372738141/7p6YR50Nfv.lottie';

  beforeEach(() => {
    canvas = createCanvas();
    document.body.appendChild(canvas);
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  afterEach(() => {
    dotLottie.destroy();
    document.body.removeChild(canvas);
  });

  test('automatically play animation with `autoplay` set to true', async () => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
    });

    const onPlay = vi.fn();
    const onComplete = vi.fn();
    const onFrame = vi.fn();

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('complete', onComplete);
    dotLottie.addEventListener('frame', onFrame);

    // wait for the animation to load and start playing
    await vi.waitFor(() => expect(dotLottie.isPlaying).toBe(true), {
      timeout: 2000,
    });

    expect(onPlay).toHaveBeenCalledTimes(1);

    // wait until current frame is half way through the animation
    await vi.waitFor(() => expect(dotLottie.currentFrame).toBeGreaterThan(dotLottie.totalFrames / 2));

    expect(dotLottie.isPlaying).toBe(true);

    // wait until the animation is complete
    await vi.waitFor(() => expect(dotLottie.currentFrame).toBe(dotLottie.totalFrames - 1));

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isStopped).toBe(true);

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onFrame.mock.calls.length).toBeGreaterThan(0);

    // eslint-disable-next-line no-warning-comments
    // TODO: fix: auto play doesn't render frame 0
    // expect(onFrame.mock.calls[0]).toEqual([
    //   {
    //     type: 'frame',
    //     currentFrame: 0,
    //   },
    // ]);
    expect(onFrame.mock.calls[onFrame.mock.calls.length - 1]).toEqual([
      {
        type: 'frame',
        currentFrame: dotLottie.totalFrames - 1,
      },
    ]);
  });

  test('play animation with `autoplay` set to false, verify it does not play', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    // wait briefly to see if the animation starts
    await sleep(500);

    expect(onPlay).not.toHaveBeenCalled();
    expect(dotLottie.isPlaying).toBe(false);
  });

  test('manually play animation using `play()` method', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    dotLottie.play();

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    expect(dotLottie.isPlaying).toBe(true);
  });

  test('manually play animation using `play()` method, verify it does not restart if already playing', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(1);

    expect(dotLottie.isPlaying).toBe(true);

    dotLottie.play();

    // wait to verify if the animation restarts
    await sleep(100);

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  test('play animation using `play()` and pause using `pause()` method and verify it resumes when played again', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    const onPause = vi.fn();

    dotLottie.addEventListener('pause', onPause);

    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(1);

    dotLottie.pause();

    expect(onPause).toHaveBeenCalledTimes(1);

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isPaused).toBe(true);
    expect(dotLottie.isStopped).toBe(false);
    expect(dotLottie.isFrozen).toBe(false);

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(2);

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isPaused).toBe(false);
    expect(dotLottie.isStopped).toBe(false);
    expect(dotLottie.isFrozen).toBe(false);
  });

  test('play animation using `play()` and stop using `stop()`', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    const onStop = vi.fn();

    dotLottie.addEventListener('stop', onStop);

    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), {
      timeout: 2000,
    });

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(1);

    dotLottie.stop();

    expect(onStop).toHaveBeenCalledTimes(1);

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isPaused).toBe(false);
    expect(dotLottie.isStopped).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);
  });
});
