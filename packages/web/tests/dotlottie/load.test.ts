/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas, sleep } from '../test-utils';

import jsonSrc from './__fixtures__/test.json?url';
import src from './__fixtures__/test.lottie?url';

describe('load animation', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;

  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
  });

  test('loads animation from a valid source', async () => {
    const fetch = vi.spyOn(window, 'fetch');

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    expect(dotLottie.isLoaded).toBe(false);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    expect(dotLottie.isLoaded).toBe(true);
    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isStopped).toBe(true);
    expect(dotLottie.totalFrames).toBeGreaterThan(0);

    expect(fetch).toHaveBeenCalledTimes(2);

    expect(fetch).toHaveBeenNthCalledWith(1, 'src/wasm/renderer.wasm', {
      credentials: 'same-origin',
    });

    expect(fetch).toHaveBeenNthCalledWith(2, src);

    fetch.mockRestore();
  });

  test('loads lottie json file', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src: jsonSrc,
    });

    dotLottie.addEventListener('load', onLoad);

    expect(dotLottie.isLoaded).toBe(false);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    expect(dotLottie.isLoaded).toBe(true);
    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isStopped).toBe(true);
    expect(dotLottie.totalFrames).toBeGreaterThan(0);
  });

  test('dispatches loadError on invalid source', async () => {
    const invalidSrc = 'https://example.com/invalid.lottie';

    const onLoadError = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src: invalidSrc,
    });

    dotLottie.addEventListener('loadError', onLoadError);

    await vi.waitFor(() => expect(onLoadError).toHaveBeenCalledTimes(1), { timeout: 2000 });

    expect(dotLottie.isLoaded).toBe(false);
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

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isStopped).toBe(true);
    expect(dotLottie.totalFrames).toBeGreaterThan(0);
  });

  test('loads a new animation src via load() method', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({
      canvas,
    });

    dotLottie.addEventListener('load', onLoad);

    await sleep(500);

    dotLottie.load({
      src,
      speed: 2,
      loop: true,
      autoplay: true,
      mode: 'reverse',
      backgroundColor: '#000000',
    });

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isStopped).toBe(false);
    expect(dotLottie.totalFrames).toBeGreaterThan(0);
    expect(dotLottie.duration).toBeGreaterThan(0);
    expect(dotLottie.speed).toBe(2);
    expect(dotLottie.loop).toBe(true);
    expect(dotLottie.autoplay).toBe(true);
    expect(dotLottie.mode).toBe('reverse');
    expect(dotLottie.backgroundColor).toBe('#000000');
    expect(dotLottie.direction).toBe(-1);
  });

  test('loads a new animation data via load() method', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({
      canvas,
    });

    dotLottie.addEventListener('load', onLoad);

    const response = await fetch(src);
    const data = await response.arrayBuffer();

    await sleep(500);

    dotLottie.load({
      speed: 2,
      loop: true,
      autoplay: true,
      mode: 'reverse',
      backgroundColor: '#000000',
      data,
    });

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isStopped).toBe(false);
    expect(dotLottie.totalFrames).toBeGreaterThan(0);
    expect(dotLottie.duration).toBeGreaterThan(0);
    expect(dotLottie.speed).toBe(2);
    expect(dotLottie.loop).toBe(true);
    expect(dotLottie.autoplay).toBe(true);
    expect(dotLottie.mode).toBe('reverse');
    expect(dotLottie.backgroundColor).toBe('#000000');
    expect(dotLottie.direction).toBe(-1);
    expect(dotLottie.useFrameInterpolation).toBe(true);
    expect(dotLottie.canvas).toBe(canvas);
  });

  test('emit loadError event when loading invalid lottie animation data', async () => {
    const onLoadError = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      data: JSON.stringify({}),
    });

    dotLottie.addEventListener('loadError', onLoadError);

    expect(dotLottie.isLoaded).toBe(false);

    await vi.waitFor(() => expect(onLoadError).toHaveBeenCalledTimes(1));

    expect(dotLottie.isLoaded).toBe(false);
  });

  test('emit loadError when loading invalid dotLottie animation data', async () => {
    const onLoadError = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      data: new ArrayBuffer(0),
    });

    dotLottie.addEventListener('loadError', onLoadError);

    expect(dotLottie.isLoaded).toBe(false);

    await vi.waitFor(() => expect(onLoadError).toHaveBeenCalledTimes(1));

    expect(dotLottie.isLoaded).toBe(false);
  });

  test('log error when loading invalid animation data of invalid type', async () => {
    const error = vi.spyOn(console, 'error');

    dotLottie = new DotLottie({
      canvas,
      data: 1 as unknown as string,
    });

    await vi.waitFor(() => expect(error).toHaveBeenCalledTimes(1));

    expect(error).toHaveBeenCalledWith('Unsupported data type for animation data. Expected a string or ArrayBuffer.');
  });

  test('emit loadError when fail to load wasm', async () => {
    const fetch = vi.spyOn(window, 'fetch');

    fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    const onLoadError = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    dotLottie.addEventListener('loadError', onLoadError);

    expect(dotLottie.isLoaded).toBe(false);

    await vi.waitFor(() => expect(onLoadError).toHaveBeenCalledTimes(1));

    expect(dotLottie.isLoaded).toBe(false);

    expect(fetch).toHaveBeenCalledTimes(1);

    fetch.mockRestore();
  });
});
