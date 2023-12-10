/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, afterEach, beforeEach, test, expect, vi } from 'vitest';

import type { Mode } from '../../src';
import { DotLottie } from '../../src';
import { createCanvas, sleep } from '../../test-utils';

describe('stop animation', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;
  const src = 'https://lottie.host/66096915-99e9-472d-ad95-591372738141/7p6YR50Nfv.lottie';

  beforeEach(() => {
    canvas = createCanvas();
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    dotLottie.destroy();
    document.body.removeChild(canvas);
  });

  test('stop and reset animation', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    // wait for the animation to load
    await vi.waitUntil(() => dotLottie.duration > 0, {
      timeout: 1000,
    });

    dotLottie.play();

    await vi.waitUntil(() => dotLottie.currentFrame > 0);
  });

  test('stop event is dispatched', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    const onStop = vi.fn();
    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('stop', onStop);

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1), { timeout: 2000 });

    expect(onStop).not.toHaveBeenCalled();

    dotLottie.stop();

    await vi.waitFor(() => expect(onStop).toHaveBeenCalledTimes(1), { timeout: 2000 });

    expect(dotLottie.isStopped).toBe(true);
    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isPaused).toBe(false);
    expect(dotLottie.currentFrame).toBe(0);
  });

  test('stopping the animation shall not reset loop count', async () => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      loop: true,
      src,
    });

    const onLoad = vi.fn();
    const onLoop = vi.fn();

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('loop', onLoop);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), { timeout: 2000 });

    dotLottie.play();

    await vi.waitFor(() => expect(onLoop).toHaveBeenCalledTimes(1), {
      timeout: dotLottie.duration * 1000 + 250,
    });

    expect(dotLottie.loopCount).toBe(1);

    dotLottie.stop();

    expect(dotLottie.loopCount).toBe(1);
  });

  test.each(['forward', 'reverse', 'bounce', 'bounce-reverse'])('stop animation in %s mode', async (mode) => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
      mode: mode as Mode,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), { timeout: 2000 });

    dotLottie.play();

    await sleep(100);

    dotLottie.stop();

    const expectedFrame = mode.includes('reverse') ? dotLottie.totalFrames - 1 : 0;

    expect(dotLottie.currentFrame).toBe(expectedFrame);
  });

  test('stop animation within a segment', async () => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
      segments: [10, 20],
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), { timeout: 2000 });

    dotLottie.stop();

    // Expecting it to reset to the start of the segment
    expect(dotLottie.currentFrame).toBe(10);
  });
});
