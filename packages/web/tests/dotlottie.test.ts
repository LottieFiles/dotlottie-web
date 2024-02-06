/**
 * Copyright 2024 Design Barn Inc.
 */

import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';

import type { Config, Mode } from '../src';
import { DotLottie } from '../src';

import jsonSrc from './__fixtures__/test.json?url';
import src from './__fixtures__/test.lottie?url';
import { createCanvas, sleep } from './test-utils';

let canvas: HTMLCanvasElement;
let dotLottie: DotLottie;

type Option = Omit<Omit<Config, 'canvas'>, 'src'>;

beforeEach(() => {
  canvas = createCanvas();
});

afterEach(() => {
  dotLottie.destroy();
  canvas.remove();
});

describe('play', () => {
  test('unfreeze the animation on play()', async () => {
    const onLoad = vi.fn();
    const onPlay = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
      expect(onPlay).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isFrozen).toBe(false);

    const currentFrameBeforeFreeze = dotLottie.currentFrame;

    dotLottie.freeze();

    expect(dotLottie.isFrozen).toBe(true);

    await sleep(500);

    expect(dotLottie.currentFrame).toBe(currentFrameBeforeFreeze);

    dotLottie.play();

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);
  });

  test('does not play when not loaded', () => {
    const onLoad = vi.fn();
    const onPlay = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('play', onPlay);

    expect(onLoad).not.toHaveBeenCalled();

    dotLottie.play();

    expect(onPlay).not.toHaveBeenCalled();
  });

  test('play() does nothing when already playing', async () => {
    const onLoad = vi.fn();
    const onPlay = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
      expect(onPlay).toHaveBeenCalledTimes(1);
    });

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  describe.each<Option>([
    {
      mode: 'forward',
    },
    {
      mode: 'reverse',
    },
    {
      mode: 'reverse-bounce',
    },
    {
      mode: 'bounce',
    },
    {
      mode: 'bounce',
      segments: [10, 30],
      speed: 2,
    },
    {
      mode: 'reverse-bounce',
      segments: [5, 25],
      speed: 2,
    },
    {
      mode: 'reverse',
      segments: [1, 5],
      speed: 0.5,
    },
    {
      mode: 'forward',
      segments: [0, 10],
      speed: 0.5,
    },
  ])('config: %s', (config) => {
    test('on play()', async () => {
      const onLoad = vi.fn();
      const onPlay = vi.fn();
      const onCompelete = vi.fn();
      const onFrame = vi.fn();

      dotLottie = new DotLottie({
        ...config,
        canvas,
        src,
      });

      let playTime = 0;
      let completeTime = 0;

      dotLottie.addEventListener('play', () => (playTime = Date.now()));
      dotLottie.addEventListener('complete', () => (completeTime = Date.now()));

      dotLottie.addEventListener('load', onLoad);
      dotLottie.addEventListener('play', onPlay);
      dotLottie.addEventListener('complete', onCompelete);
      dotLottie.addEventListener('frame', onFrame);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const totalFrames = (config.segments?.[1] ?? dotLottie.totalFrames) - (config.segments?.[0] ?? 0);

      const expectedDuration =
        ((config.mode?.includes('bounce') ? 2 : 1) *
          ((dotLottie.duration * totalFrames) / dotLottie.totalFrames) *
          1000) /
        dotLottie.speed;

      const expectedEndFrame =
        config.mode === 'reverse' || config.mode === 'reverse-bounce'
          ? config.segments?.[0] ?? 0
          : config.segments?.[1] ?? dotLottie.totalFrames;
      const expectedStartFrame =
        config.mode === 'reverse' || config.mode === 'reverse-bounce'
          ? config.segments?.[1] ?? dotLottie.totalFrames
          : config.segments?.[0] ?? 0;

      const startFrame =
        config.mode === 'reverse' || config.mode === 'reverse-bounce'
          ? dotLottie.segments?.[1] ?? dotLottie.totalFrames
          : dotLottie.segments?.[0] ?? 0;
      const endFrame =
        config.mode === 'reverse' || config.mode === 'reverse-bounce'
          ? dotLottie.segments?.[0] ?? 0
          : dotLottie.segments?.[1] ?? dotLottie.totalFrames;

      expect(startFrame).toBe(expectedStartFrame);
      expect(endFrame).toBe(expectedEndFrame);

      expect(dotLottie.isLoaded).toBe(true);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
        expect(onPlay).not.toHaveBeenCalled();
      });

      expect(onCompelete).not.toHaveBeenCalled();

      dotLottie.play();

      expect(onPlay).toHaveBeenCalledTimes(1);

      expect(onFrame).toHaveBeenNthCalledWith(1, {
        type: 'frame',
        currentFrame: expectedStartFrame,
      });

      await vi.waitFor(
        () => {
          expect(onCompelete).toHaveBeenCalledTimes(1);
        },
        {
          timeout: expectedDuration + 250,
        },
      );

      expect(onFrame).toHaveBeenLastCalledWith({
        type: 'frame',
        currentFrame: config.mode?.includes('bounce') ? expectedStartFrame : expectedEndFrame,
      });

      const actualDuration = completeTime - playTime;

      const durationAccuracy = expectedDuration / actualDuration;

      expect(durationAccuracy).toBeGreaterThan(0.9);
    });

    test('autoplay animation', async () => {
      const onLoad = vi.fn();
      const onPlay = vi.fn();
      const onCompelete = vi.fn();
      const onFrame = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
        autoplay: true,
        ...config,
      });

      let playTime = 0;
      let completeTime = 0;

      dotLottie.addEventListener('play', () => (playTime = Date.now()));
      dotLottie.addEventListener('complete', () => (completeTime = Date.now()));

      dotLottie.addEventListener('load', onLoad);
      dotLottie.addEventListener('play', onPlay);
      dotLottie.addEventListener('complete', onCompelete);
      dotLottie.addEventListener('frame', onFrame);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const totalFrames = (config.segments?.[1] ?? dotLottie.totalFrames) - (config.segments?.[0] ?? 0);

      const expectedDuration =
        ((config.mode?.includes('bounce') ? 2 : 1) *
          ((dotLottie.duration * totalFrames) / dotLottie.totalFrames) *
          1000) /
        dotLottie.speed;

      const expectedEndFrame =
        config.mode === 'reverse' || config.mode === 'reverse-bounce'
          ? config.segments?.[0] ?? 0
          : config.segments?.[1] ?? dotLottie.totalFrames;
      const expectedStartFrame =
        config.mode === 'reverse' || config.mode === 'reverse-bounce'
          ? config.segments?.[1] ?? dotLottie.totalFrames
          : config.segments?.[0] ?? 0;

      const startFrame =
        config.mode === 'reverse' || config.mode === 'reverse-bounce'
          ? dotLottie.segments?.[1] ?? dotLottie.totalFrames
          : dotLottie.segments?.[0] ?? 0;
      const endFrame =
        config.mode === 'reverse' || config.mode === 'reverse-bounce'
          ? dotLottie.segments?.[0] ?? 0
          : dotLottie.segments?.[1] ?? dotLottie.totalFrames;

      expect(startFrame).toBe(expectedStartFrame);
      expect(endFrame).toBe(expectedEndFrame);

      expect(dotLottie.isLoaded).toBe(true);

      await vi.waitFor(() => {
        expect(onPlay).toHaveBeenCalledTimes(1);
      });

      expect(onCompelete).not.toHaveBeenCalled();

      expect(onFrame).toHaveBeenNthCalledWith(1, {
        type: 'frame',
        currentFrame: expectedStartFrame,
      });

      await vi.waitFor(
        () => {
          expect(onCompelete).toHaveBeenCalledTimes(1);
        },
        {
          timeout: expectedDuration + 250,
        },
      );

      expect(onFrame).toHaveBeenLastCalledWith({
        type: 'frame',
        currentFrame: config.mode?.includes('bounce') ? expectedStartFrame : expectedEndFrame,
      });

      const actualDuration = completeTime - playTime;

      const durationAccuracy = expectedDuration / actualDuration;

      expect(durationAccuracy).toBeGreaterThan(0.9);
    });

    test('play() after pause()', async () => {
      const onLoad = vi.fn();
      const onPlay = vi.fn();
      const onCompelete = vi.fn();
      const onPause = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
        autoplay: true,
        ...config,
      });

      let playTime = 0;
      let completeTime = 0;
      let pauseTime = 0;
      let resumeTime = 0;

      dotLottie.addEventListener('play', () => {
        if (playTime === 0) {
          playTime = Date.now();
        } else {
          resumeTime = Date.now();
        }
      });
      dotLottie.addEventListener('complete', () => (completeTime = Date.now()));
      dotLottie.addEventListener('pause', () => (pauseTime = Date.now()));

      dotLottie.addEventListener('load', onLoad);
      dotLottie.addEventListener('play', onPlay);
      dotLottie.addEventListener('pause', onPause);
      dotLottie.addEventListener('complete', onCompelete);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const totalFrames = (config.segments?.[1] ?? dotLottie.totalFrames) - (config.segments?.[0] ?? 0);

      const expectedDuration =
        ((config.mode?.includes('bounce') ? 2 : 1) *
          ((dotLottie.duration * totalFrames) / dotLottie.totalFrames) *
          1000) /
        dotLottie.speed;

      await vi.waitFor(() => {
        expect(onPlay).toHaveBeenCalledTimes(1);
      });

      // wait until the animation is 20% complete
      await vi.waitUntil(() => {
        if (dotLottie.mode.includes('reverse')) {
          return dotLottie.currentFrame <= totalFrames * 0.8;
        } else {
          return dotLottie.currentFrame >= totalFrames * 0.2;
        }
      });
      const currentFrameBeforePause = dotLottie.currentFrame;

      dotLottie.pause();

      await sleep(1000);

      expect(onPause).toHaveBeenCalledTimes(1);

      expect(dotLottie.currentFrame).toBe(currentFrameBeforePause);

      dotLottie.play();

      expect(onPlay).toHaveBeenCalledTimes(2);

      await vi.waitFor(
        () => {
          expect(onCompelete).toHaveBeenCalledTimes(1);
        },
        {
          timeout: expectedDuration + 250,
        },
      );

      const actualDuration = pauseTime - playTime + (completeTime - resumeTime);

      const durationAccuracy = expectedDuration / actualDuration;

      expect(durationAccuracy).toBeGreaterThan(0.9);
    });

    test('frame rate accuracy with frame interpolation disabled', async () => {
      const onFrame = vi.fn();
      const onCompleted = vi.fn();
      const onPlay = vi.fn();

      dotLottie = new DotLottie({
        ...config,
        canvas,
        src,
        autoplay: true,
        useFrameInterpolation: false,
      });

      dotLottie.addEventListener('play', onPlay);
      dotLottie.addEventListener('frame', onFrame);
      dotLottie.addEventListener('complete', onCompleted);

      await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

      await vi.waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1), {
        timeout: dotLottie.duration * 1000 * 2,
      });

      const startFrame = dotLottie.mode.includes('reverse')
        ? dotLottie.segments?.[1] ?? dotLottie.totalFrames
        : dotLottie.segments?.[0] ?? 0;
      const endFrame = dotLottie.mode.includes('reverse')
        ? dotLottie.segments?.[0] ?? 0
        : dotLottie.segments?.[1] ?? dotLottie.totalFrames;
      const totalFrames = (config.segments?.[1] ?? dotLottie.totalFrames) - (config.segments?.[0] ?? 0);

      expect(onFrame).toHaveBeenNthCalledWith(1, {
        type: 'frame',
        currentFrame: startFrame,
      });
      expect(onFrame).toHaveBeenLastCalledWith({
        type: 'frame',
        currentFrame: dotLottie.mode.includes('bounce') ? startFrame : endFrame,
      });

      expect(onFrame).toHaveBeenCalledTimes(totalFrames * (dotLottie.mode.includes('bounce') ? 2 : 1) + 1);
    });
  });
});

describe('pause', () => {
  test('does not pause if it is not playing', async () => {
    const onLoad = vi.fn();
    const onPause = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('pause', onPause);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    dotLottie.pause();

    expect(onPause).not.toHaveBeenCalled();
  });
});

describe('destroy', () => {
  test('destroy() clears all event listeners', async () => {
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

describe('resize', () => {
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

describe('load', () => {
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

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenNthCalledWith(1, src);
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
      backgroundColor: '#ff00ff',
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
    expect(dotLottie.backgroundColor).toBe('#ff00ff');
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
    expect(dotLottie.useFrameInterpolation).toBe(true);
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
    const onLoadError = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      data: 1 as unknown as string,
    });

    dotLottie.addEventListener('loadError', onLoadError);

    await vi.waitFor(() => expect(onLoadError).toHaveBeenCalledTimes(1));

    expect(onLoadError).toHaveBeenCalledWith({
      type: 'loadError',
      error: new Error('Unsupported data type for animation data. Expected a string or ArrayBuffer.'),
    });
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

describe('stop', () => {
  test('stop() does nothing when not playing', async () => {
    const onLoad = vi.fn();
    const onStop = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('stop', onStop);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    dotLottie.stop();

    expect(onStop).not.toHaveBeenCalled();

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isStopped).toBe(true);
  });

  test('stop() after pause()', async () => {
    const onPlay = vi.fn();
    const onStop = vi.fn();
    const onPause = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('stop', onStop);
    dotLottie.addEventListener('pause', onPause);

    await vi.waitFor(() => {
      expect(onPlay).toHaveBeenCalledTimes(1);
    });

    dotLottie.pause();

    expect(dotLottie.isPaused).toBe(true);
    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isStopped).toBe(false);
    expect(dotLottie.isFrozen).toBe(false);

    await vi.waitFor(() => {
      expect(onPause).toHaveBeenCalledTimes(1);
    });

    dotLottie.stop();

    expect(onStop).toHaveBeenCalledTimes(1);

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isStopped).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);
    expect(dotLottie.isPaused).toBe(false);
  });

  describe.each<Option>([
    {
      mode: 'forward',
    },
    {
      mode: 'reverse',
    },
    {
      mode: 'reverse-bounce',
    },
    {
      mode: 'bounce',
    },
    {
      mode: 'bounce',
      segments: [10, 30],
      speed: 2,
    },
    {
      mode: 'reverse-bounce',
      segments: [5, 25],
      speed: 2,
    },
    {
      mode: 'reverse',
      segments: [1, 5],
      speed: 0.5,
    },
    {
      mode: 'forward',
      segments: [0, 10],
      speed: 0.5,
    },
  ])('config: %s', (config) => {
    test('on stop()', async () => {
      const onPlay = vi.fn();
      const onStop = vi.fn();
      const onFrame = vi.fn();

      dotLottie = new DotLottie({
        ...config,
        canvas,
        src,
        autoplay: true,
      });

      dotLottie.addEventListener('play', onPlay);
      dotLottie.addEventListener('stop', onStop);
      dotLottie.addEventListener('frame', onFrame);

      await vi.waitFor(() => {
        expect(onPlay).toHaveBeenCalledTimes(1);
      });

      const totalFrames = (config.segments?.[1] ?? dotLottie.totalFrames) - (config.segments?.[0] ?? 0);

      const startFrame =
        config.mode === 'reverse' || config.mode === 'reverse-bounce'
          ? config.segments?.[1] ?? dotLottie.totalFrames
          : config.segments?.[0] ?? 0;

      expect(onFrame).toHaveBeenNthCalledWith(1, {
        type: 'frame',
        currentFrame: startFrame,
      });

      await vi.waitUntil(() => {
        if (dotLottie.mode.includes('reverse')) {
          return dotLottie.currentFrame <= totalFrames * 0.8;
        } else {
          return dotLottie.currentFrame >= totalFrames * 0.2;
        }
      });

      const currentFrameBeforeStop = dotLottie.currentFrame;

      dotLottie.stop();

      expect(onStop).toHaveBeenCalledTimes(1);
      expect(dotLottie.isStopped).toBe(true);
      expect(dotLottie.isPlaying).toBe(false);
      expect(dotLottie.isFrozen).toBe(false);
      expect(dotLottie.isPaused).toBe(false);

      await sleep(500);

      expect(dotLottie.currentFrame).not.toBe(currentFrameBeforeStop);
      expect(dotLottie.currentFrame).toBe(startFrame);

      expect(onFrame).toHaveBeenLastCalledWith({
        type: 'frame',
        currentFrame: startFrame,
      });
    });
  });
});

describe('setMode', () => {
  test('setMode() does nothing when the current mode is the same', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    dotLottie.setMode('forward');

    expect(dotLottie.mode).toBe('forward');
  });

  test.each<Mode>(['reverse', 'bounce', 'reverse-bounce'])('setMode(%s)', async (mode) => {
    const onPlay = vi.fn();
    const onFrame = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('frame', onFrame);

    await vi.waitFor(() => {
      expect(onPlay).toHaveBeenCalledTimes(1);
    });

    dotLottie.setMode(mode);

    expect(dotLottie.mode).toBe(mode);
  });
});

describe('freeze/unfreeze', () => {
  test('freeze stops the animation loop without changing playback state', async () => {
    const onPlay = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
    });

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);

    dotLottie.freeze();

    expect(dotLottie.isFrozen).toBe(true);
    expect(dotLottie.isPlaying).toBe(true);
  });

  test('unfreeze resumes the animation loop from the same playback state', async () => {
    const onPlay = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
    });

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);

    dotLottie.freeze();

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isFrozen).toBe(true);

    const currentFrameAtFreeze = dotLottie.currentFrame;

    dotLottie.unfreeze();

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);

    // wait for the animation to play until the end
    await vi.waitUntil(() => dotLottie.currentFrame > currentFrameAtFreeze);
  });

  test('freeze while animation is frozen does nothing', async () => {
    const onUnfreeze = vi.fn();
    const onFreeze = vi.fn();
    const onPlay = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('unfreeze', onUnfreeze);
    dotLottie.addEventListener('freeze', onFreeze);

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

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
    const onPlay = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('unfreeze', onUnfreeze);

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    expect(dotLottie.isFrozen).toBe(false);

    dotLottie.unfreeze();

    expect(dotLottie.isFrozen).toBe(false);
    expect(dotLottie.isPlaying).toBe(true);

    expect(onUnfreeze).toHaveBeenCalledTimes(0);
  });
});

describe('setFrame', () => {
  test('setFrame() does nothing when the animation is not loaded', async () => {
    const onFrame = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    dotLottie.addEventListener('frame', onFrame);

    dotLottie.setFrame(10);

    expect(onFrame).not.toHaveBeenCalled();
  });

  test('setFrame() updates and renders a new frame without changing the playback state', async () => {
    const onPlay = vi.fn();
    const onFrame = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('frame', onFrame);

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    onFrame.mockClear();

    dotLottie.setFrame(10);

    expect(onFrame).toHaveBeenNthCalledWith(1, {
      type: 'frame',
      currentFrame: 10,
    });

    expect(dotLottie.currentFrame).toBe(10);

    expect(dotLottie.isPlaying).toBe(true);
  });

  test('setFrame() does nothing when the new frame is out of range', async () => {
    const onLoad = vi.fn();
    const onFrame = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      mode: 'reverse',
    });

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('frame', onFrame);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    onFrame.mockClear();

    const currentFrameBeforeSetFrame = dotLottie.currentFrame;

    dotLottie.setFrame(100000);

    expect(onFrame).not.toHaveBeenCalled();

    expect(dotLottie.currentFrame).toBe(currentFrameBeforeSetFrame);
  });
});

describe('removeEventListener', () => {
  test('removeEventListener() removes an event listener', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    dotLottie.removeEventListener('load', onLoad);

    dotLottie.load({
      src,
    });

    expect(onLoad).toHaveBeenCalledTimes(1);
  });
});

describe('addEventListener', () => {
  test('addEventListener() adds a new event listener', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  test('registers the same handler only once', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });
});

describe('setRenderConfig', () => {
  test('setRenderConfig() sets the render config', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    dotLottie.setRenderConfig({
      devicePixelRatio: 0.2,
    });

    expect(dotLottie.renderConfig.devicePixelRatio).toBe(0.2);
  });
});
