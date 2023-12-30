/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, beforeEach, test, expect, vi, afterEach } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas, sleep } from '../test-utils';

import src from './__fixtures__/test.lottie?url';

describe('freeze and unfreeze animation', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;

  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
  });

  test('freeze stops the animation loop without changing playback state', async () => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
    });

    // wait for the animation to load and play for a bit
    await vi.waitUntil(() => dotLottie.currentFrame >= 5);

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
    await vi.waitUntil(() => dotLottie.currentFrame >= 10);

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

  test('auto unfreeze animation when play() is called', async () => {
    const onUnfreeze = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('unfreeze', onUnfreeze);

    await vi.waitUntil(() => dotLottie.isPlaying);

    expect(dotLottie.isFrozen).toBe(false);

    await sleep(200);

    dotLottie.freeze();

    expect(dotLottie.isFrozen).toBe(true);

    dotLottie.play();

    expect(dotLottie.isPlaying).toBe(true);

    expect(onUnfreeze).toHaveBeenCalledTimes(1);
    expect(dotLottie.isFrozen).toBe(false);
  });

  test('freeze while animation is frozen does nothing', async () => {
    const onUnfreeze = vi.fn();
    const onFreeze = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('unfreeze', onUnfreeze);
    dotLottie.addEventListener('freeze', onFreeze);

    await vi.waitUntil(() => dotLottie.isPlaying);

    expect(dotLottie.isFrozen).toBe(false);

    dotLottie.freeze();

    expect(dotLottie.isFrozen).toBe(true);

    dotLottie.freeze();

    expect(dotLottie.isFrozen).toBe(true);

    expect(onUnfreeze).toHaveBeenCalledTimes(0);

    expect(onFreeze).toHaveBeenCalledTimes(1);
  });

  test('unfreeze while animation is not frozen does nothing', async () => {
    const onUnfreeze = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('unfreeze', onUnfreeze);

    await vi.waitUntil(() => dotLottie.isPlaying);

    expect(dotLottie.isFrozen).toBe(false);

    dotLottie.unfreeze();

    expect(dotLottie.isFrozen).toBe(false);
    expect(dotLottie.isPlaying).toBe(true);

    expect(onUnfreeze).toHaveBeenCalledTimes(0);
  });
});
