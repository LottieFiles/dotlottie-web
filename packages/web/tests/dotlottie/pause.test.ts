/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, afterEach, beforeEach, test, expect, vi } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas, sleep } from '../../test-utils';

// to use the local wasm file
DotLottie.setWasmUrl('src/renderer-wasm/bin/renderer.wasm');

describe('pause animation', () => {
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

  test('pause and resume animation', async () => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
    });

    await vi.waitFor(() => expect(dotLottie.currentFrame).toBeGreaterThan(dotLottie.totalFrames / 2), {
      timeout: 2000,
    });
    expect(dotLottie.isPaused).toBe(false);

    dotLottie.pause();

    expect(dotLottie.isPaused).toBe(true);
  });

  test('animation frame remains constant during pause', async () => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
    });

    const onPlay = vi.fn();
    const onFrame = vi.fn();

    dotLottie.addEventListener('frame', onFrame);
    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1), { timeout: 2000 });

    onPlay.mockClear();
    onFrame.mockClear();
    dotLottie.pause();

    const frameAtPause = dotLottie.currentFrame;

    // Wait to see if the frame changes
    await sleep(500);

    expect(dotLottie.currentFrame).toBe(frameAtPause);
    expect(onPlay).not.toHaveBeenCalled();
    expect(onFrame).not.toHaveBeenCalled();
  });

  test('pause event is dispatched when animation is playing', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onPause = vi.fn();

    dotLottie.addEventListener('pause', onPause);

    await vi.waitUntil(() => dotLottie.totalFrames > 0, { timeout: 2000 });

    dotLottie.pause();

    expect(onPause).not.toHaveBeenCalled();

    dotLottie.play();

    await vi.waitUntil(() => dotLottie.isPlaying);

    dotLottie.pause();

    expect(dotLottie.isPlaying).toBe(false);

    expect(onPause).toHaveBeenCalledTimes(1);
  });
});
