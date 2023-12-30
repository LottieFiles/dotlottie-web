/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, beforeEach, test, expect, vi, afterEach } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas } from '../test-utils';

import src from './__fixtures__/test.lottie?url';

describe('destroy', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;

  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
  });

  test('destroy removes all event listeners', async () => {
    const onPlay = vi.fn();
    const onLoad = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    dotLottie.destroy();

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onLoad).toHaveBeenCalledTimes(1);
  });
});
