/**
 * Copyright 2023 Design Barn Inc.
 */

import { describe, beforeEach, test, expect, vi, afterEach } from 'vitest';

import { DotLottie } from '../../src';
import { createCanvas } from '../test-utils';

import src from './__fixtures__/test.lottie?url';

describe('mode', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;

  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
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
