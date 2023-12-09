/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, afterEach, beforeEach, test, expect, vi } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas, sleep } from '../../test-utils';

DotLottie.setWasmUrl('src/renderer-wasm/bin/renderer.wasm');

describe('load animation', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;
  const src = 'https://lottie.host/66096915-99e9-472d-ad95-591372738141/7p6YR50Nfv.lottie';
  const invalidSrc = 'https://lottie.host/invalid-path/animation.lottie';

  beforeEach(() => {
    canvas = createCanvas();
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    dotLottie.destroy();
    document.body.removeChild(canvas);
  });

  test('loads animation from a valid source', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), { timeout: 5000 });

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isStopped).toBe(true);
    expect(dotLottie.totalFrames).toBeGreaterThan(0);
  });

  test('dispatches loadError on invalid source', async () => {
    dotLottie = new DotLottie({
      canvas,
      src: invalidSrc,
    });

    const onLoadError = vi.fn();

    dotLottie.addEventListener('loadError', onLoadError);

    await sleep(2000);

    expect(onLoadError).toHaveBeenCalledTimes(1);
  });

  test('loads animation from animation data', async () => {
    const res = await fetch(src);
    const data = await res.arrayBuffer();

    dotLottie = new DotLottie({
      canvas,
      data,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), { timeout: 5000 });

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isStopped).toBe(true);
    expect(dotLottie.totalFrames).toBeGreaterThan(0);
  });
});
