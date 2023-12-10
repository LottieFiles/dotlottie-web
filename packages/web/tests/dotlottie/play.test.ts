/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, afterEach, beforeEach, test, expect, vi } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas, sleep } from '../../test-utils';

// to use the local wasm file
DotLottie.setWasmUrl('src/renderer-wasm/bin/renderer.wasm');

describe('play animation', () => {
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

    expect(dotLottie.isStopped).toBe(true);

    // wait until the animation load and play
    await vi.waitUntil(() => dotLottie.isPlaying, {
      timeout: 2000,
    });
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
