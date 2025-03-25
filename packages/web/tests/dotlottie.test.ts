/* eslint-disable node/no-unsupported-features/node-builtins */
/* eslint-disable require-atomic-updates */
import { describe, beforeEach, afterEach, test, expect, vi } from 'vitest';

import type { Config, Layout, Mode } from '../src';
import { DotLottie as DotLottieClass, DotLottieWorker as DotLottieWorkerClass } from '../src';
import { getDefaultDPR } from '../src/utils';

import { createCanvas, sleep } from './test-utils';

const wasmUrl = new URL('../src/core/dotlottie-player.wasm', import.meta.url).href;
const jsonSrc = new URL('./__fixtures__/test.json', import.meta.url).href;
const src = new URL('./__fixtures__/test.lottie', import.meta.url).href;

DotLottieClass.setWasmUrl(wasmUrl);
DotLottieWorkerClass.setWasmUrl(wasmUrl);

describe.each([
  {
    DotLottie: DotLottieClass,
    name: 'DotLottie',
  },
  {
    DotLottie: DotLottieWorkerClass,
    name: 'DotLottieWorker',
  },
])('$DotLottie.name', ({ DotLottie }) => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottieClass | DotLottieWorkerClass;
  const isWorker = DotLottie === DotLottieWorkerClass;

  type Option = Omit<Omit<Config, 'canvas'>, 'src'>;

  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
  });

  describe('play', () => {
    test('triggers loop event correctly', async () => {
      const onLoad = vi.fn();
      const onLoop = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
        loop: true,
        autoplay: true,
      });

      dotLottie.addEventListener('load', onLoad);
      dotLottie.addEventListener('loop', onLoop);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const loopCount = 4;

      await vi.waitFor(
        () => {
          expect(onLoop).toHaveBeenCalledTimes(loopCount);
        },
        { timeout: (dotLottie.duration * 1000 + 500) * loopCount },
      );

      expect(dotLottie.loopCount).toBe(loopCount);

      for (let i = 1; i <= loopCount; i += 1) {
        expect(onLoop).toHaveBeenNthCalledWith(i, {
          type: 'loop',
          loopCount: i,
        });
      }
    });
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

      await dotLottie.freeze();

      expect(dotLottie.isFrozen).toBe(true);

      await sleep(500);

      expect(dotLottie.currentFrame).toBe(currentFrameBeforeFreeze);

      await dotLottie.play();

      expect(dotLottie.isPlaying).toBe(true);
      expect(dotLottie.isFrozen).toBe(false);
    });

    test('does not play when not loaded', async () => {
      const onLoad = vi.fn();
      const onPlay = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
      });

      dotLottie.addEventListener('load', onLoad);
      dotLottie.addEventListener('play', onPlay);

      expect(onLoad).not.toHaveBeenCalled();

      await dotLottie.play();

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

      await dotLottie.play();

      expect(onPlay).toHaveBeenCalledTimes(2);
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
        segment: [10, 30],
        speed: 2,
      },
      {
        mode: 'reverse-bounce',
        segment: [5, 25],
        speed: 2,
      },
      {
        mode: 'reverse',
        segment: [1, 5],
        speed: 0.5,
      },
      {
        mode: 'forward',
        segment: [0, 10],
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

        const expectedDuration =
          ((config.mode?.includes('bounce') ? 2 : 1) * dotLottie.segmentDuration * 1000) / dotLottie.speed;

        const expectedEndFrame =
          config.mode === 'reverse' || config.mode === 'reverse-bounce'
            ? config.segment?.[0] ?? 0
            : config.segment?.[1] ?? dotLottie.totalFrames;
        const expectedStartFrame =
          config.mode === 'reverse' || config.mode === 'reverse-bounce'
            ? config.segment?.[1] ?? dotLottie.totalFrames
            : config.segment?.[0] ?? 0;

        const startFrame =
          config.mode === 'reverse' || config.mode === 'reverse-bounce'
            ? dotLottie.segment?.[1] ?? dotLottie.totalFrames
            : dotLottie.segment?.[0] ?? 0;
        const endFrame =
          config.mode === 'reverse' || config.mode === 'reverse-bounce'
            ? dotLottie.segment?.[0] ?? 0
            : dotLottie.segment?.[1] ?? dotLottie.totalFrames;

        expect(startFrame).toBe(expectedStartFrame);
        expect(endFrame).toBe(expectedEndFrame);

        expect(dotLottie.isLoaded).toBe(true);

        await vi.waitFor(() => {
          expect(onLoad).toHaveBeenCalledTimes(1);
          expect(onPlay).not.toHaveBeenCalled();
        });

        expect(onCompelete).not.toHaveBeenCalled();

        await dotLottie.play();

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

        const totalFrames = (config.segment?.[1] ?? dotLottie.totalFrames) - (config.segment?.[0] ?? 0);

        const expectedDuration =
          ((config.mode?.includes('bounce') ? 2 : 1) *
            ((dotLottie.duration * totalFrames) / dotLottie.totalFrames) *
            1000) /
          dotLottie.speed;

        const expectedEndFrame =
          config.mode === 'reverse' || config.mode === 'reverse-bounce'
            ? config.segment?.[0] ?? 0
            : config.segment?.[1] ?? dotLottie.totalFrames;
        const expectedStartFrame =
          config.mode === 'reverse' || config.mode === 'reverse-bounce'
            ? config.segment?.[1] ?? dotLottie.totalFrames
            : config.segment?.[0] ?? 0;

        const startFrame =
          config.mode === 'reverse' || config.mode === 'reverse-bounce'
            ? dotLottie.segment?.[1] ?? dotLottie.totalFrames
            : dotLottie.segment?.[0] ?? 0;
        const endFrame =
          config.mode === 'reverse' || config.mode === 'reverse-bounce'
            ? dotLottie.segment?.[0] ?? 0
            : dotLottie.segment?.[1] ?? dotLottie.totalFrames;

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

        const totalFrames = (config.segment?.[1] ?? dotLottie.totalFrames) - (config.segment?.[0] ?? 0);

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

        await dotLottie.pause();

        await sleep(1000);

        expect(onPause).toHaveBeenCalledTimes(1);

        expect(dotLottie.currentFrame).toBe(currentFrameBeforePause);

        await dotLottie.play();

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
          ? dotLottie.segment?.[1] ?? dotLottie.totalFrames
          : dotLottie.segment?.[0] ?? 0;
        const endFrame = dotLottie.mode.includes('reverse')
          ? dotLottie.segment?.[0] ?? 0
          : dotLottie.segment?.[1] ?? dotLottie.totalFrames;
        const totalFrames = (config.segment?.[1] ?? dotLottie.totalFrames) - (config.segment?.[0] ?? 0);

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

      await dotLottie.pause();

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

      await dotLottie.destroy();

      await dotLottie.play();

      expect(onPlay).toHaveBeenCalledTimes(1);
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    test('handles destroy while operations are in-flight without errors', async () => {
      if (DotLottie !== DotLottieWorkerClass) {
        return;
      }

      const onLoad = vi.fn();
      const onDestroy = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
        autoplay: true,
      });

      dotLottie.addEventListener('load', onLoad);
      dotLottie.addEventListener('destroy', onDestroy);

      await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

      dotLottie.setFrame(10);
      dotLottie.setSpeed(2);
      dotLottie.setBackgroundColor('#ff0000');
      dotLottie.setMode('bounce');
      dotLottie.resize();

      const destroyPromise = dotLottie.destroy();

      await destroyPromise;

      expect(onDestroy).toHaveBeenCalledTimes(1);

      expect(dotLottie.isPlaying).toBe(false);

      await dotLottie.play();
      expect(dotLottie.isPlaying).toBe(false);
      expect(dotLottie.isStopped).toBe(true);
    });

    test('handles multiple concurrent worker operations with destroy', async () => {
      if (DotLottie !== DotLottieWorkerClass) {
        return;
      }

      const canvas2 = createCanvas();
      const onLoadInstance1 = vi.fn();
      const onLoadInstance2 = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
        autoplay: true,
        workerId: 'instance1Worker',
      });

      const dotLottie2 = new DotLottie({
        canvas: canvas2,
        src,
        autoplay: true,
        workerId: 'instance2Worker',
      });

      dotLottie.addEventListener('load', onLoadInstance1);
      dotLottie2.addEventListener('load', onLoadInstance2);

      await vi.waitFor(() => {
        expect(onLoadInstance1).toHaveBeenCalledTimes(1);
        expect(onLoadInstance2).toHaveBeenCalledTimes(1);
      });

      dotLottie.setFrame(20);
      dotLottie2.setFrame(30);

      dotLottie.setSpeed(3);
      dotLottie.setBackgroundColor('#00ff00');
      dotLottie.setMode('reverse-bounce');

      await dotLottie.destroy();

      await dotLottie2.setFrame(40);
      expect(dotLottie2.currentFrame).toBe(40);

      await dotLottie2.destroy();
      canvas2.remove();
    });

    test('rejects operations that are initiated after instance is marked for destroy', async () => {
      if (DotLottie !== DotLottieWorkerClass) {
        return;
      }

      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
        autoplay: true,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

      dotLottie.destroy();

      expect(dotLottie.isPlaying).toBe(false);
      expect(dotLottie.isStopped).toBe(true);

      await dotLottie.play();
      await dotLottie.setFrame(50);

      expect(dotLottie.isPlaying).toBe(false);
      expect(dotLottie.isStopped).toBe(true);
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

      const originalCanvasWidth =
        canvas.getBoundingClientRect().width * (dotLottie.renderConfig.devicePixelRatio || window.devicePixelRatio);
      const originalCanvasHeight =
        canvas.getBoundingClientRect().height * (dotLottie.renderConfig.devicePixelRatio || window.devicePixelRatio);

      expect(canvas.width).toBe(originalCanvasWidth);
      expect(canvas.height).toBe(originalCanvasHeight);

      // double the size of the canvas
      canvas.style.width = `${2 * canvas.getBoundingClientRect().width}px`;
      canvas.style.height = `${2 * canvas.getBoundingClientRect().height}px`;

      expect(canvas.width).toBe(originalCanvasWidth);
      expect(canvas.height).toBe(originalCanvasHeight);

      await dotLottie.resize();

      await vi.waitFor(() => {
        expect(canvas.width).toBe(2 * originalCanvasWidth);
        expect(canvas.height).toBe(2 * originalCanvasHeight);
      });
    });
  });

  describe('load', () => {
    // Skip this test in worker environment because it's not possible to mock the fetch error in worker environment
    (isWorker ? test.skip : test)('loads animation from a valid source', async () => {
      const fetch = vi.spyOn(window, 'fetch');

      dotLottie = new DotLottie({
        canvas,
        src,
      });

      const onLoad = vi.fn();
      const onReady = vi.fn();

      dotLottie.addEventListener('ready', onReady);
      dotLottie.addEventListener('load', onLoad);

      expect(dotLottie.isReady).toBe(false);
      expect(dotLottie.isLoaded).toBe(false);

      await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));
      await vi.waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));

      expect(dotLottie.isReady).toBe(true);
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

    test('loads .lottie animation from animation data as array buffer', async () => {
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

    test('loads lottie json file from animation data as string', async () => {
      const res = await fetch(jsonSrc);
      const data = await res.text();

      dotLottie = new DotLottie({
        canvas,
        data,
      });

      const onLoad = vi.fn();

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

      expect(dotLottie.totalFrames).toBeGreaterThan(0);
    });

    test('loads lottie json file from animation data as json object', async () => {
      const res = await fetch(jsonSrc);
      const data = await res.json();

      dotLottie = new DotLottie({
        canvas,
        data,
      });

      const onLoad = vi.fn();

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

      expect(dotLottie.totalFrames).toBeGreaterThan(0);
    });

    test('loads a new animation src via load() method', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
      });

      dotLottie.addEventListener('load', onLoad);

      await sleep(500);

      await dotLottie.load({
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

      await dotLottie.load({
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

      expect(onLoadError).toHaveBeenCalledWith({
        type: 'loadError',
        error: new Error('Invalid Lottie JSON string: The provided string does not conform to the Lottie JSON format.'),
      });

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

      expect(onLoadError).toHaveBeenCalledWith({
        type: 'loadError',
        error: new Error(
          'Invalid dotLottie ArrayBuffer: The provided ArrayBuffer does not conform to the dotLottie format.',
        ),
      });

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
        error: new Error(`Unsupported data type for animation data. Expected: 
          - string (Lottie JSON),
          - ArrayBuffer (dotLottie),
          - object (Lottie JSON). 
          Received: number`),
      });
    });

    // Skip this test in worker environment because it's not possible to mock the fetch error in worker environment
    (isWorker ? test.skip : test)('emit loadError when fail to load wasm', async () => {
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

      await dotLottie.stop();

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

      await dotLottie.pause();

      expect(dotLottie.isPaused).toBe(true);
      expect(dotLottie.isPlaying).toBe(false);
      expect(dotLottie.isStopped).toBe(false);
      expect(dotLottie.isFrozen).toBe(false);

      await vi.waitFor(() => {
        expect(onPause).toHaveBeenCalledTimes(1);
      });

      await dotLottie.stop();

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
        segment: [10, 30],
        speed: 2,
      },
      {
        mode: 'reverse-bounce',
        segment: [5, 25],
        speed: 2,
      },
      {
        mode: 'reverse',
        segment: [1, 5],
        speed: 0.5,
      },
      {
        mode: 'forward',
        segment: [0, 10],
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

        const totalFrames = (config.segment?.[1] ?? dotLottie.totalFrames) - (config.segment?.[0] ?? 0);

        const startFrame =
          config.mode === 'reverse' || config.mode === 'reverse-bounce'
            ? config.segment?.[1] ?? dotLottie.totalFrames
            : config.segment?.[0] ?? 0;

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

        await dotLottie.stop();

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

      await dotLottie.setMode('forward');

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

      await dotLottie.setMode(mode);

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

      await dotLottie.freeze();

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

      await dotLottie.freeze();

      expect(dotLottie.isPlaying).toBe(true);
      expect(dotLottie.isFrozen).toBe(true);

      const currentFrameAtFreeze = dotLottie.currentFrame;

      await dotLottie.unfreeze();

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

      await dotLottie.freeze();

      expect(dotLottie.isFrozen).toBe(true);

      await dotLottie.freeze();

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

      await dotLottie.setFrame(10);

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

      await dotLottie.setFrame(10);

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

      await dotLottie.setFrame(100000);

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
    test('sets custom render config and verifies default behavior', async () => {
      const onLoad = vi.fn();
      const defaultDPR = getDefaultDPR();

      dotLottie = new DotLottie({
        canvas,
        src,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      expect(dotLottie.renderConfig.devicePixelRatio).toBe(defaultDPR);

      await dotLottie.setRenderConfig({
        devicePixelRatio: 0.2,
      });

      expect(dotLottie.renderConfig.devicePixelRatio).toBe(0.2);
    });

    test('reverts to default devicePixelRatio when set to 0 and reset', async () => {
      const onLoad = vi.fn();
      const defaultDPR = getDefaultDPR();

      dotLottie = new DotLottie({
        canvas,
        src,
        renderConfig: {
          devicePixelRatio: 0.5,
        },
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      expect(dotLottie.renderConfig.devicePixelRatio).toBe(0.5);

      await dotLottie.setRenderConfig({
        devicePixelRatio: 0.2,
      });
      expect(dotLottie.renderConfig.devicePixelRatio).toBe(0.2);

      await dotLottie.setRenderConfig({});
      expect(dotLottie.renderConfig.devicePixelRatio).toBe(defaultDPR);
    });
  });

  describe('loadAnimation', () => {
    // eslint-disable-next-line no-secrets/no-secrets
    const multiAnimationSrc = 'https://lottie.host/294b684d-d6b4-4116-ab35-85ef566d4379/VkGHcqcMUI.lottie';

    test('loads an animation in .lottie file by id', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: multiAnimationSrc,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), {
        timeout: 10000,
      });

      const animations = dotLottie.manifest?.animations ?? [];

      expect(animations.length).toBeGreaterThan(0);

      const animationId = animations[animations.length - 1]?.id ?? '';

      await dotLottie.loadAnimation(animationId);

      expect(onLoad).toHaveBeenCalledTimes(2);

      expect(dotLottie.activeAnimationId).toEqual(animationId);
    });

    test('emits loadError when loading an animation by invalid id', async () => {
      const onLoadError = vi.fn();
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: multiAnimationSrc,
      });

      dotLottie.addEventListener('loadError', onLoadError);
      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1), {
        timeout: 10000,
      });

      const animationId = 'invalid';

      await dotLottie.loadAnimation(animationId);

      expect(onLoadError).toHaveBeenCalledTimes(1);
    });

    test('do nothing when .lottie file is not loaded', async () => {
      const onLoad = vi.fn();
      const onLoadError = vi.fn();

      dotLottie = new DotLottie({
        canvas,
      });

      dotLottie.addEventListener('load', onLoad);
      dotLottie.addEventListener('loadError', onLoadError);

      await dotLottie.loadAnimation('invalid');

      expect(onLoad).not.toHaveBeenCalled();
      expect(onLoadError).not.toHaveBeenCalled();
    });

    test('manifest is null when a lottie json is loaded', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => expect(onLoad).toHaveBeenCalledTimes(1));

      expect(dotLottie.manifest).toBeNull();
    });
  });

  describe('markers', () => {
    test('return all markers in the animation', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
      });

      expect(dotLottie.marker).toBeUndefined();

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const markers = dotLottie.markers();

      expect(markers.length).toBeGreaterThan(0);
    });

    test('loads an animation and play a specific marker', async () => {
      const onPlay = vi.fn();
      const onFrame = vi.fn();
      const onCompelete = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
        autoplay: true,
        marker: 'Marker_2',
      });

      dotLottie.addEventListener('play', onPlay);
      dotLottie.addEventListener('frame', onFrame);
      dotLottie.addEventListener('complete', onCompelete);

      await vi.waitFor(() => {
        expect(onPlay).toHaveBeenCalledTimes(1);
      });

      expect(dotLottie.marker).toBe('Marker_2');

      await vi.waitFor(() => {
        expect(onCompelete).toHaveBeenCalledTimes(1);
      });

      expect(onFrame).toHaveBeenNthCalledWith(1, {
        type: 'frame',
        currentFrame: 10,
      });

      expect(onFrame).toHaveBeenLastCalledWith({
        type: 'frame',
        currentFrame: 20,
      });
    });

    test('setMarker() sets a new marker', async () => {
      const onPlay = vi.fn();
      const onFrame = vi.fn();
      const onCompelete = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
        autoplay: true,
        useFrameInterpolation: false,
      });

      dotLottie.addEventListener('play', onPlay);
      dotLottie.addEventListener('frame', onFrame);
      dotLottie.addEventListener('complete', onCompelete);

      await vi.waitFor(() => {
        expect(onPlay).toHaveBeenCalledTimes(1);
      });

      await dotLottie.setMarker('Marker_3');
      onFrame.mockClear();

      await vi.waitFor(() => {
        expect(onCompelete).toHaveBeenCalledTimes(1);
      });

      expect(onFrame).toHaveBeenLastCalledWith({
        type: 'frame',
        currentFrame: 30,
      });
    });

    test("setMarker clears the marker when the marker doesn't exist", async () => {
      const onPlay = vi.fn();
      const onFrame = vi.fn();
      const onCompelete = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
        autoplay: true,
        marker: 'Marker_2',
      });

      dotLottie.addEventListener('play', onPlay);
      dotLottie.addEventListener('frame', onFrame);
      dotLottie.addEventListener('complete', onCompelete);

      await vi.waitFor(() => {
        expect(onPlay).toHaveBeenCalledTimes(1);
      });

      await dotLottie.setMarker('invalid');
      onFrame.mockClear();

      await vi.waitFor(
        () => {
          expect(onCompelete).toHaveBeenCalledTimes(1);
        },
        {
          timeout: dotLottie.duration * 1000 + 500,
        },
      );

      expect(onFrame).toHaveBeenLastCalledWith({
        type: 'frame',
        currentFrame: dotLottie.totalFrames,
      });

      expect(dotLottie.marker).toBe('invalid');
    });
  });

  describe.skip('theming', () => {
    test('fail to load a theme', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const result = await dotLottie.setTheme('invalid');

      expect(dotLottie.activeThemeId).toBeFalsy();

      expect(result).toBe(false);
    });

    test('load a global theme', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const themeId = 'global_theme';

      const result = await dotLottie.setTheme(themeId);

      expect(dotLottie.activeThemeId).toBe(themeId);

      expect(result).toBe(true);
    });

    test("load an animation's theme", async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const themes = dotLottie.manifest?.themes ?? [];

      expect(themes).toHaveLength(2);

      const themeId = themes[0]?.id ?? '';

      const result = await dotLottie.setTheme(themeId);

      expect(dotLottie.activeThemeId).toBe(themeId);

      expect(result).toBe(true);
    });

    test('load theme data', async () => {
      const themeData = {
        c0: {
          p: {
            a: 0,
            k: [1, 0, 1],
          },
        },
      };

      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const result = await dotLottie.setThemeData(JSON.stringify(themeData));

      expect(result).toBe(true);
    });

    test('fail to load theme data', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const result = await dotLottie.setThemeData('invalid');

      expect(result).toBe(false);
    });
  });

  describe('layout', () => {
    test('default layout', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
      });

      expect(dotLottie.layout).toBeUndefined();

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      expect(dotLottie.layout?.fit).toBe('contain');
      expect(dotLottie.layout?.align).toEqual([0.5, 0.5]);
    });

    test.each<Layout>([
      {
        fit: 'cover',
        align: [0.5, 0.5],
      },
      {
        fit: 'fill',
        align: [0.5, 0],
      },
      {
        fit: 'none',
        align: [0, 0],
      },
      {
        fit: 'contain',
        align: [0, 1],
      },
      {
        fit: 'fit-height',
        align: [1, 0],
      },
      {
        fit: 'fit-width',
        align: [0, 0.5],
      },
    ])('init DotLottie with different layout: %p', async (layout) => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src,
        layout,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      expect(dotLottie.layout).toEqual(layout);
    });

    test("load a new animation with a different layout and it's applied", async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(1);
      });

      const layout: Layout = {
        fit: 'cover',
        align: [0.5, 0.5],
      };

      dotLottie.load({
        src,
        layout,
      });

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(2);
      });

      expect(dotLottie.layout).toEqual(layout);
    });
  });

  test('setViewport() sets the viewport', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src,
    });

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    const updated = await dotLottie.setViewport(0, 0, 100, 100);

    expect(updated).toBe(true);
  });

  test('freezeOnOffscreen defaults to true when not defined', async () => {
    const onFreeze = vi.fn();

    canvas.style.marginTop = '100vh';

    dotLottie = new DotLottie({
      canvas,
      src: jsonSrc,
      autoplay: true,
      // freezeOnOffscreen is not explicitly defined
    });

    dotLottie.addEventListener('freeze', onFreeze);

    await vi.waitFor(() => {
      expect(onFreeze).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isFrozen).toBe(true);
  });

  test('freeze when canvas is initially offscreen and freezeOnOffscreen is true', async () => {
    const onFreeze = vi.fn();

    canvas.style.marginTop = '100vh';

    dotLottie = new DotLottie({
      canvas,
      src: jsonSrc,
      autoplay: true,
      renderConfig: {
        freezeOnOffscreen: true,
      },
    });

    dotLottie.addEventListener('freeze', onFreeze);

    await vi.waitFor(() => {
      expect(onFreeze).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isFrozen).toBe(true);
  });

  test('do not freeze when canvas is initially offscreen and freezeOnOffscreen is false', async () => {
    const onFreeze = vi.fn();

    canvas.style.marginTop = '100vh';

    dotLottie = new DotLottie({
      canvas,
      src: jsonSrc,
      autoplay: true,
      renderConfig: {
        freezeOnOffscreen: false,
      },
    });

    dotLottie.addEventListener('freeze', onFreeze);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(onFreeze).not.toHaveBeenCalled();

    expect(dotLottie.isFrozen).toBe(false);
  });

  test('freeze when canvas goes offscreen during animation', async () => {
    const onFreeze = vi.fn();
    const onUnfreeze = vi.fn();

    dotLottie = new DotLottie({
      canvas,
      src: jsonSrc,
      autoplay: true,
      renderConfig: {
        freezeOnOffscreen: true,
      },
    });

    dotLottie.addEventListener('freeze', onFreeze);
    dotLottie.addEventListener('unfreeze', onUnfreeze);

    await vi.waitFor(() => {
      expect(dotLottie.isPlaying).toBe(true);
    });

    canvas.style.marginTop = '100vh';

    await vi.waitFor(() => {
      expect(onFreeze).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isFrozen).toBe(true);
  });

  test('unfreeze when canvas comes back into the viewport', async () => {
    const onFreeze = vi.fn();
    const onUnfreeze = vi.fn();

    canvas.style.marginTop = '100vh';

    dotLottie = new DotLottie({
      canvas,
      src: jsonSrc,
      autoplay: true,
      renderConfig: {
        freezeOnOffscreen: true,
      },
    });

    dotLottie.addEventListener('freeze', onFreeze);
    dotLottie.addEventListener('unfreeze', onUnfreeze);

    await vi.waitFor(() => {
      expect(onFreeze).toHaveBeenCalledTimes(1);
    });

    canvas.style.marginTop = '0';

    await vi.waitFor(() => {
      expect(onUnfreeze).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isPlaying).toBe(true);
    expect(dotLottie.isFrozen).toBe(false);
  });

  test('stay frozen if canvas remains offscreen and freezeOnOffscreen is true', async () => {
    const onFreeze = vi.fn();
    const onUnfreeze = vi.fn();

    canvas.style.marginTop = '100vh';

    dotLottie = new DotLottie({
      canvas,
      src: jsonSrc,
      autoplay: true,
      renderConfig: {
        freezeOnOffscreen: true,
      },
    });

    dotLottie.addEventListener('freeze', onFreeze);
    dotLottie.addEventListener('unfreeze', onUnfreeze);

    await vi.waitFor(() => {
      expect(onFreeze).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isFrozen).toBe(true);
    expect(onUnfreeze).not.toHaveBeenCalled();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(dotLottie.isFrozen).toBe(true);
  });

  test('update freezeOnOffscreen using setRenderConfig', async () => {
    const onFreeze = vi.fn();
    const onUnfreeze = vi.fn();

    canvas.style.marginTop = '100vh';

    dotLottie = new DotLottie({
      canvas,
      src: jsonSrc,
      autoplay: true,
      renderConfig: {
        freezeOnOffscreen: true,
      },
    });

    dotLottie.addEventListener('freeze', onFreeze);
    dotLottie.addEventListener('unfreeze', onUnfreeze);

    await vi.waitFor(() => {
      expect(onFreeze).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isFrozen).toBe(true);

    await dotLottie.setRenderConfig({
      freezeOnOffscreen: false,
    });

    canvas.style.marginTop = '0';

    await vi.waitFor(() => {
      expect(onUnfreeze).toHaveBeenCalledTimes(1);
    });

    canvas.style.marginTop = '100vh';

    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(onFreeze).toHaveBeenCalledTimes(1);

    expect(dotLottie.isFrozen).toBe(false);
  });

  describe('autoResize', () => {
    test('should have autoResize disabled by default', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      });

      expect(dotLottie.renderConfig.autoResize).toBeFalsy();
    });

    test('should enable autoResize when explicitly set to true', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
        renderConfig: {
          autoResize: true,
        },
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      });

      expect(dotLottie.renderConfig.autoResize).toBeTruthy();
    });

    test('should disable autoResize when explicitly set to false', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
        renderConfig: {
          autoResize: false,
        },
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      });

      expect(dotLottie.renderConfig.autoResize).toBeFalsy();
    });

    test('should automatically resize the canvas when autoResize is enabled and the canvas element size changes', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
        renderConfig: {
          autoResize: true,
        },
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      });

      const initialWidth = canvas.width;
      const initialHeight = canvas.height;

      const scale = 2;

      canvas.style.width = `${canvas.getBoundingClientRect().width * scale}px`;
      canvas.style.height = `${canvas.getBoundingClientRect().height * scale}px`;

      await vi.waitFor(() => {
        expect(canvas.width).toBe(initialWidth * scale);
        expect(canvas.height).toBe(initialHeight * scale);
      });
    });

    test('should not resize the canvas when autoResize is disabled, even if the canvas element size changes', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
        renderConfig: {
          autoResize: false,
        },
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      });

      const initialWidth = canvas.width;
      const initialHeight = canvas.height;

      const scale = 2;

      canvas.style.width = `${canvas.getBoundingClientRect().width * scale}px`;
      canvas.style.height = `${canvas.getBoundingClientRect().height * scale}px`;

      await vi.waitFor(() => {
        expect(canvas.width).toBe(initialWidth);
        expect(canvas.height).toBe(initialHeight);
      });
    });

    test('should stop resizing the canvas when autoResize is disabled dynamically after being enabled', async () => {
      const onLoad = vi.fn();

      dotLottie = new DotLottie({
        canvas,
        src: jsonSrc,
        renderConfig: {
          autoResize: true,
        },
      });

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalled();
      });

      const initialWidth = canvas.width;
      const initialHeight = canvas.height;

      const scale = 2;

      canvas.style.width = `${canvas.getBoundingClientRect().width * scale}px`;
      canvas.style.height = `${canvas.getBoundingClientRect().height * scale}px`;

      await vi.waitFor(() => {
        expect(canvas.width).toBe(initialWidth * scale);
        expect(canvas.height).toBe(initialHeight * scale);
      });

      await dotLottie.setRenderConfig({
        autoResize: false,
      });

      const updatedWidth = canvas.width;
      const updatedHeight = canvas.height;

      canvas.style.width = `${canvas.getBoundingClientRect().width * scale}px`;
      canvas.style.height = `${canvas.getBoundingClientRect().height * scale}px`;

      await vi.waitFor(() => {
        expect(canvas.width).toBe(updatedWidth);
        expect(canvas.height).toBe(updatedHeight);
      });
    });
  });

  test('doesn"t throw an error when resize is called and the canvas is not visible', async () => {
    canvas.style.display = 'none';

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

    expect(() => dotLottie.resize()).not.toThrow();

    canvas.style.display = 'block';
  });
});
