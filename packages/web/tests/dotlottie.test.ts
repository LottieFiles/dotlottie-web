/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';

import type { Mode } from '../src';
import { DotLottie } from '../src';

import jsonSrc from './__fixtures__/test.json?url';
import src from './__fixtures__/test.lottie?url';
import { createCanvas, sleep } from './test-utils';

let canvas: HTMLCanvasElement;
let dotLottie: DotLottie;

describe('load animation', () => {
  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
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

describe('play animation', () => {
  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
  });

  test('play animation with `autoplay` set to false, verify it does not play', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    await sleep(500);

    expect(onPlay).not.toHaveBeenCalled();
    expect(dotLottie.isPlaying).toBe(false);
  });

  test('manually play animation using `play()` method', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    dotLottie.play();

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    expect(dotLottie.isPlaying).toBe(true);
  });

  test('manually play animation using `play()` method, verify it does not restart if already playing', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(1);

    expect(dotLottie.isPlaying).toBe(true);

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  test('play animation using `play()` and pause using `pause()` method and verify it resumes when played again', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    const onPause = vi.fn();

    dotLottie.addEventListener('pause', onPause);

    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(1);

    dotLottie.pause();

    expect(onPause).toHaveBeenCalledTimes(1);

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isPaused).toBe(true);
    expect(dotLottie.isStopped).toBe(false);
    expect(dotLottie.isFrozen).toBe(false);

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(2);

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isPaused).toBe(false);
    expect(dotLottie.isStopped).toBe(false);
    expect(dotLottie.isFrozen).toBe(false);
  });

  test('play animation using `play()` and stop using `stop()`', async () => {
    dotLottie = new DotLottie({
      canvas,
      src,
    });

    const onLoad = vi.fn();

    dotLottie.addEventListener('load', onLoad);

    const onStop = vi.fn();

    dotLottie.addEventListener('stop', onStop);

    const onPlay = vi.fn();

    dotLottie.addEventListener('play', onPlay);

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(1);

    dotLottie.stop();

    expect(onStop).toHaveBeenCalledTimes(1);

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isPaused).toBe(false);
    expect(dotLottie.isStopped).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);
  });

  test('animation duration and frame rate accuracy with frame interpolation disabled', async () => {
    const onFrame = vi.fn();
    const onCompleted = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
      useFrameInterpolation: false,
    });

    let playTime = 0;
    let completedTime = 0;

    // 50 milliseconds as timing tolerance
    const timingTolerance = 50;

    dotLottie.addEventListener('play', () => {
      playTime = performance.now();
    });
    dotLottie.addEventListener('complete', () => {
      completedTime = performance.now();
    });

    dotLottie.addEventListener('frame', onFrame);
    dotLottie.addEventListener('complete', onCompleted);

    await vi.waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1), {
      // wait for the animation to complete
      timeout: dotLottie.duration * 1000 + 2000,
    });

    expect(onFrame).toHaveBeenNthCalledWith(1, {
      type: 'frame',
      currentFrame: 0,
    });
    expect(onFrame).toHaveBeenLastCalledWith({
      type: 'frame',
      currentFrame: dotLottie.totalFrames - 1,
    });
    expect(onFrame).toHaveBeenCalledTimes(dotLottie.totalFrames);

    const actualDuration = completedTime - playTime;
    const expectedDuration = dotLottie.duration * 1000;
    const durationDiff = Math.abs(actualDuration - expectedDuration);

    expect(durationDiff).toBeLessThanOrEqual(timingTolerance);
  });

  test('animation duration and frame rate accuracy with frame interpolation enabled', async () => {
    const onFrame = vi.fn();
    const onCompleted = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
      // enabled by default
      // useFrameInterpolation: true,
    });

    let playTime = 0;
    let completedTime = 0;

    // 50 milliseconds as timing tolerance
    const timingTolerance = 50;

    dotLottie.addEventListener('play', () => {
      playTime = performance.now();
    });
    dotLottie.addEventListener('complete', () => {
      completedTime = performance.now();
    });

    dotLottie.addEventListener('frame', onFrame);
    dotLottie.addEventListener('complete', onCompleted);

    await vi.waitFor(() => expect(onCompleted).toHaveBeenCalledTimes(1), {
      // wait for the animation to complete
      timeout: dotLottie.duration * 1000 + 2000,
    });

    expect(onFrame).toHaveBeenNthCalledWith(1, {
      type: 'frame',
      currentFrame: 0,
    });
    expect(onFrame).toHaveBeenLastCalledWith({
      type: 'frame',
      currentFrame: dotLottie.totalFrames - 1,
    });
    expect(onFrame.mock.calls.length).toBeGreaterThan(dotLottie.totalFrames);

    const actualDuration = completedTime - playTime;
    const expectedDuration = dotLottie.duration * 1000;
    const durationDiff = Math.abs(actualDuration - expectedDuration);

    expect(durationDiff).toBeLessThanOrEqual(timingTolerance);
  });

  test('remove event listeners', async () => {
    const onPlay = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
    });

    dotLottie.addEventListener('play', onPlay);

    await vi.waitUntil(() => dotLottie.isPlaying);

    expect(onPlay).toHaveBeenCalledTimes(1);

    dotLottie.stop();

    dotLottie.removeEventListener('play', onPlay);

    dotLottie.play();

    expect(onPlay).toHaveBeenCalledTimes(1);
  });
});

describe('pause animation', () => {
  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
  });

  test('pause and resume animation', async () => {
    const onComplete = vi.fn();
    const onPause = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
      useFrameInterpolation: false,
    });

    dotLottie.addEventListener('complete', onComplete);
    dotLottie.addEventListener('pause', onPause);

    await vi.waitUntil(() => dotLottie.isPlaying);

    await vi.waitUntil(() => dotLottie.currentFrame >= (dotLottie.totalFrames - 1) / 2, {
      timeout: dotLottie.duration * 2000,
    });

    expect(dotLottie.isPaused).toBe(false);

    const currentFrameBeforePause = dotLottie.currentFrame;

    dotLottie.pause();

    expect(dotLottie.isPaused).toBe(true);

    expect(dotLottie.currentFrame).toBe(currentFrameBeforePause);

    expect(onComplete).not.toHaveBeenCalled();
    expect(onPause).toHaveBeenCalledTimes(1);
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

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    onPlay.mockClear();
    onFrame.mockClear();
    dotLottie.pause();

    const frameAtPause = dotLottie.currentFrame;

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

    await vi.waitUntil(() => dotLottie.totalFrames > 0);

    dotLottie.pause();

    expect(onPause).not.toHaveBeenCalled();

    dotLottie.play();

    await vi.waitUntil(() => dotLottie.isPlaying);

    dotLottie.pause();

    expect(dotLottie.isPlaying).toBe(false);

    expect(onPause).toHaveBeenCalledTimes(1);
  });
});

describe('destroy', () => {
  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
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

describe('stop animation', () => {
  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
  });

  test('stop and reset animation', async () => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
    });

    await vi.waitUntil(() => dotLottie.isPlaying, {
      timeout: 2000,
    });

    dotLottie.stop();

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.isStopped).toBe(true);

    expect(dotLottie.currentFrame).toBe(0);
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

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    expect(onStop).not.toHaveBeenCalled();

    dotLottie.stop();

    await vi.waitFor(() => expect(onStop).toHaveBeenCalledTimes(1));

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

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    dotLottie.play();

    await vi.waitFor(() => expect(onLoop).toHaveBeenCalledTimes(1), {
      timeout: dotLottie.duration * 1000 + 250,
    });

    expect(dotLottie.loopCount).toBe(1);

    dotLottie.stop();

    expect(dotLottie.loopCount).toBe(1);
  });

  test.each(['forward', 'reverse', 'bounce', 'bounce-reverse'])('stop animation in %s mode', async (mode) => {
    const onFrame = vi.fn();
    const onPlay = vi.fn();
    const onCompelete = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
      mode: mode as Mode,
    });

    dotLottie.addEventListener('frame', onFrame);
    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('complete', onCompelete);

    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    await sleep(dotLottie.duration * 1000 * 0.25);

    dotLottie.stop();

    expect(onCompelete).not.toHaveBeenCalled();

    const expectedFrame = mode.includes('reverse') ? dotLottie.totalFrames - 1 : 0;

    expect(dotLottie.currentFrame).toBe(expectedFrame);

    expect(onFrame).toHaveBeenNthCalledWith(1, {
      type: 'frame',
      currentFrame: expectedFrame,
    });
    expect(onFrame).toHaveBeenLastCalledWith({
      type: 'frame',
      currentFrame: expectedFrame,
    });
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

    await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

    dotLottie.stop();

    // Ex pecting it to reset to the start of the segment
    expect(dotLottie.currentFrame).toBe(10);
  });

  test('changing mode while playing', async () => {
    dotLottie = new DotLottie({
      canvas,
      autoplay: true,
      src,
    });

    await vi.waitUntil(() => dotLottie.isPlaying, {
      timeout: 2000,
    });

    expect(dotLottie.mode).toBe('forward');

    dotLottie.setMode('reverse');

    expect(dotLottie.mode).toBe('reverse');

    dotLottie.stop();

    expect(dotLottie.currentFrame).toBe(dotLottie.totalFrames - 1);
  });
});

describe('resize', () => {
  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
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

describe('loop animation', () => {
  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
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

describe('freeze and unfreeze animation', () => {
  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
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

describe('mode', () => {
  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
  });

  test('forward bounce mode', async () => {
    const onPlay = vi.fn();
    const onComplete = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
      mode: 'bounce',
    });

    let playTime = 0;
    let completedTime = 0;

    const timingTolerance = 100;

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('play', () => {
      playTime = Date.now();
    });
    dotLottie.addEventListener('complete', onComplete);
    dotLottie.addEventListener('complete', () => {
      completedTime = Date.now();
    });

    // Wait for the animation to play
    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    const expectedDuration = Math.round(dotLottie.duration * 1000 * 2);

    expect(dotLottie.direction).toBe(1);

    await vi.waitFor(() => expect(dotLottie.direction).toBe(-1), {
      timeout: dotLottie.duration * 1000 + 50,
    });

    // Wait for the animation to complete
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), {
      timeout: expectedDuration + 50,
    });

    const actualDuration = completedTime - playTime;
    const durationDiff = Math.abs(actualDuration - expectedDuration);

    expect(durationDiff).toBeLessThanOrEqual(timingTolerance);

    expect(durationDiff).toBeLessThanOrEqual(timingTolerance);

    expect(dotLottie.isPlaying).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test('reverse bounce mode', async () => {
    const onPlay = vi.fn();
    const onComplete = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
      mode: 'bounce-reverse',
    });

    let playTime = 0;
    let completedTime = 0;

    const timingTolerance = 100;

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('play', () => {
      playTime = Date.now();
    });
    dotLottie.addEventListener('complete', onComplete);
    dotLottie.addEventListener('complete', () => {
      completedTime = Date.now();
    });

    // Wait for the animation to play
    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    const expectedDuration = Math.round(dotLottie.duration * 1000 * 2);

    expect(dotLottie.direction).toBe(-1);

    await vi.waitFor(() => expect(dotLottie.direction).toBe(1), {
      timeout: dotLottie.duration * 1000 + 50,
    });

    // Wait for the animation to complete
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), {
      timeout: expectedDuration + 50,
    });

    const actualDuration = completedTime - playTime;
    const durationDiff = Math.abs(actualDuration - expectedDuration);

    expect(durationDiff).toBeLessThanOrEqual(timingTolerance);

    expect(dotLottie.isPlaying).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test('set speed to 2x and bounce mode', async () => {
    const onPlay = vi.fn();
    const onComplete = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
      mode: 'bounce',
    });

    let playTime = 0;
    let completedTime = 0;

    const timingTolerance = 50;

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('play', () => {
      playTime = Date.now();
    });
    dotLottie.addEventListener('complete', onComplete);
    dotLottie.addEventListener('complete', () => {
      completedTime = Date.now();
    });

    // Wait for the animation to play
    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    dotLottie.setSpeed(2);

    const expectedDuration = Math.round(dotLottie.duration * 1000);

    expect(dotLottie.direction).toBe(1);

    await vi.waitFor(() => expect(dotLottie.direction).toBe(-1), {
      timeout: dotLottie.duration * 1000 + 50,
    });

    // Wait for the animation to complete
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), {
      timeout: expectedDuration + 50,
    });

    const actualDuration = completedTime - playTime;
    const durationDiff = Math.abs(actualDuration - expectedDuration);

    expect(durationDiff).toBeLessThanOrEqual(timingTolerance);

    expect(dotLottie.isPlaying).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test('set speed to 2x and reverse bounce mode', async () => {
    const onPlay = vi.fn();
    const onComplete = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
      mode: 'bounce-reverse',
    });

    let playTime = 0;
    let completedTime = 0;

    const timingTolerance = 50;

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('play', () => {
      playTime = Date.now();
    });
    dotLottie.addEventListener('complete', onComplete);
    dotLottie.addEventListener('complete', () => {
      completedTime = Date.now();
    });

    // Wait for the animation to play
    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    dotLottie.setSpeed(2);
    dotLottie.setUseFrameInterpolation(false);

    const expectedDuration = Math.round(dotLottie.duration * 1000);

    expect(dotLottie.direction).toBe(-1);

    await vi.waitFor(() => expect(dotLottie.direction).toBe(1), {
      timeout: dotLottie.duration * 1000 + 50,
    });

    // Wait for the animation to complete
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), {
      timeout: expectedDuration + 50,
    });

    const actualDuration = completedTime - playTime;
    const durationDiff = Math.abs(actualDuration - expectedDuration);

    expect(durationDiff).toBeLessThanOrEqual(timingTolerance);

    expect(dotLottie.isPlaying).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test('bounce mode with segments', async () => {
    const onPlay = vi.fn();
    const onComplete = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
      mode: 'bounce',
    });

    let playTime = 0;
    let completedTime = 0;

    const timingTolerance = 100;

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('play', () => {
      playTime = Date.now();
    });
    dotLottie.addEventListener('complete', onComplete);
    dotLottie.addEventListener('complete', () => {
      completedTime = Date.now();
    });

    // Wait for the animation to play
    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    const startFrame = dotLottie.totalFrames / 2;
    const endFrame = dotLottie.totalFrames - 1;

    dotLottie.setSegments(startFrame, endFrame);

    const expectedDuration = Math.round(dotLottie.duration * 1000);

    expect(dotLottie.direction).toBe(1);

    await vi.waitFor(() => expect(dotLottie.direction).toBe(-1), {
      timeout: dotLottie.duration * 1000 + 50,
    });

    // Wait for the animation to complete
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), {
      timeout: expectedDuration + 50,
    });

    const actualDuration = completedTime - playTime;
    const durationDiff = Math.abs(actualDuration - expectedDuration);

    expect(durationDiff).toBeLessThanOrEqual(timingTolerance);

    expect(dotLottie.isPlaying).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test('reverse bounce mode with segments', async () => {
    const onPlay = vi.fn();
    const onComplete = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
      mode: 'bounce-reverse',
    });

    let playTime = 0;
    let completedTime = 0;

    const timingTolerance = 100;

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('play', () => {
      playTime = Date.now();
    });
    dotLottie.addEventListener('complete', onComplete);
    dotLottie.addEventListener('complete', () => {
      completedTime = Date.now();
    });

    // Wait for the animation to play
    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    const startFrame = dotLottie.totalFrames / 2;
    const endFrame = dotLottie.totalFrames - 1;

    dotLottie.setSegments(startFrame, endFrame);

    const expectedDuration = Math.round(dotLottie.duration * 1000);

    expect(dotLottie.direction).toBe(-1);

    await vi.waitFor(() => expect(dotLottie.direction).toBe(1), {
      timeout: dotLottie.duration * 1000 + 50,
    });

    // Wait for the animation to complete
    await vi.waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1), {
      timeout: expectedDuration + 50,
    });

    const actualDuration = completedTime - playTime;
    const durationDiff = Math.abs(actualDuration - expectedDuration);

    expect(durationDiff).toBeLessThanOrEqual(timingTolerance);

    expect(dotLottie.isPlaying).toBe(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test('set loop to true and bounce mode', async () => {
    const onPlay = vi.fn();
    const onLoop = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
      autoplay: true,
      mode: 'bounce',
    });

    const expectedLoopCount = 2;

    let playTime = 0;
    let loopCompleteTime = 0;

    const timingTolerance = 150;

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('play', () => {
      playTime = Date.now();
    });
    dotLottie.addEventListener('loop', onLoop);
    dotLottie.addEventListener('loop', (event) => {
      loopCompleteTime = Date.now();

      // stop after the expected loop count
      if (event.loopCount === 2) {
        dotLottie.stop();
      }
    });

    // Wait for the animation to play
    await vi.waitFor(() => expect(onPlay).toHaveBeenCalledTimes(1));

    dotLottie.setLoop(true);

    const expectedDuration = Math.round(dotLottie.duration * 1000 * expectedLoopCount * 2);

    // Wait for the animation to loop
    await vi.waitFor(() => expect(onLoop).toHaveBeenCalledTimes(2), {
      timeout: expectedDuration + 100,
    });

    const actualDuration = loopCompleteTime - playTime;

    const durationDiff = Math.abs(actualDuration - expectedDuration);

    expect(durationDiff).toBeLessThanOrEqual(timingTolerance);
  });
});
