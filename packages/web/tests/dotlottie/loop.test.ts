/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, beforeEach, test, expect, vi, afterEach } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas } from '../test-utils';

import src from './__fixtures__/test.lottie?url';

describe('loop animation', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;

  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
  });

  test('loops', async () => {
    const onLoop = vi.fn();
    const onPlay = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      loop: true,
      src,
    });

    dotLottie.addEventListener('loop', onLoop);
    dotLottie.addEventListener('play', onPlay);

    expect(dotLottie.loop).toBe(true);
    expect(dotLottie.loopCount).toBe(0);

    await vi.waitUntil(() => dotLottie.isPlaying, {
      timeout: 2000,
    });

    await vi.waitFor(
      () => {
        expect(dotLottie.loopCount).toBe(1);
      },
      {
        timeout: dotLottie.duration * 1000 + 250,
      },
    );

    expect(onLoop).toHaveBeenCalledTimes(1);
    expect(onLoop).toHaveBeenCalledWith({
      type: 'loop',
      loopCount: 1,
    });
  });
});
