/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, beforeEach, test, expect, vi, afterEach } from 'vitest';

import type { Mode } from '../../src';
import { DotLottie } from '../../src';
import { createCanvas, sleep } from '../test-utils';

import src from './__fixtures__/test.lottie?url';

describe('stop animation', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;

  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
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
