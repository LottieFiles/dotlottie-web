/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, beforeEach, test, expect, vi, afterEach } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas } from '../test-utils';

import src from './__fixtures__/test.lottie?url';

describe('resize', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;

  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
  });

  test('resize the canvas drawing surface to maintain high quality animation', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    await vi.waitFor(() => expect(dotLottie.isPlaying).toBe(true));

    const originalCanvasWidth = canvas.getBoundingClientRect().width * window.devicePixelRatio;
    const originalCanvasHeight = canvas.getBoundingClientRect().height * window.devicePixelRatio;

    expect(canvas.width).toBe(originalCanvasWidth);
    expect(canvas.height).toBe(originalCanvasHeight);

    // double the size of the canvas
    canvas.style.width = `${2 * canvas.getBoundingClientRect().width}px`;
    canvas.style.height = `${2 * canvas.getBoundingClientRect().height}px`;

    expect(canvas.width).toBe(originalCanvasWidth);
    expect(canvas.height).toBe(originalCanvasHeight);

    dotLottie.resize();

    expect(canvas.width).toBe(2 * originalCanvasWidth);
    expect(canvas.height).toBe(2 * originalCanvasHeight);
  });
});
