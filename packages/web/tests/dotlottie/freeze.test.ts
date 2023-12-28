/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, afterEach, beforeEach, test, expect, vi } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas } from '../../test-utils';

DotLottie.setWasmUrl('src/wasm/renderer.wasm');

describe('freeze and unfreeze animation', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;
  const src = 'https://lottie.host/66096915-99e9-472d-ad95-591372738141/7p6YR50Nfv.lottie';

  beforeEach(() => {
    canvas = createCanvas();
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    document.body.removeChild(canvas);
    dotLottie.destroy();
  });

  test('freeze stops the animation loop without changing playback state', async () => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
    });

    // wait for the animation to load and play for a bit
    await vi.waitUntil(() => dotLottie.currentFrame >= 5, {
      timeout: 2000,
    });

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);

    dotLottie.freeze();

    expect(dotLottie.isFrozen).toBe(true);
  });

  test('unfreeze resumes the animation loop from the same state', async () => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
    });

    // wait for the animation to load and play for a bit
    await vi.waitUntil(() => dotLottie.currentFrame >= 10, {
      timeout: 2000,
    });

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);

    dotLottie.freeze();

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isFrozen).toBe(true);

    const frameAtFreeze = dotLottie.currentFrame;

    dotLottie.unfreeze();

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);

    // wait for the animation to play until the end
    await vi.waitUntil(() => dotLottie.currentFrame > frameAtFreeze);
  });
});
