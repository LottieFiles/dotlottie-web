import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { DotLottie, disposeSharedCanvasRenderer } from '../../src/lite';
import { createCanvas, sleep } from '../test-utils';

const jsonSrc = new URL('../../../../fixtures/test.json', import.meta.url).href;
const src = new URL('../../../../fixtures/test.lottie', import.meta.url).href;

describe('DotLottieLite', () => {
  let canvas: HTMLCanvasElement;
  let dotLottie: DotLottie;

  beforeEach(() => {
    canvas = createCanvas();
  });

  afterEach(() => {
    dotLottie.destroy();
    canvas.remove();
  });

  test('dispatches ready and load when constructed with a JSON src', async () => {
    const onReady = vi.fn();
    const onLoad = vi.fn();

    dotLottie = new DotLottie({ canvas, src: jsonSrc });

    dotLottie.addEventListener('ready', onReady);
    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onReady).toHaveBeenCalledTimes(1);
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isReady).toBe(true);
    expect(dotLottie.isLoaded).toBe(true);
    expect(dotLottie.totalFrames).toBeGreaterThan(0);
    expect(dotLottie.duration).toBeGreaterThan(0);
  });

  test('loads a .lottie file and exposes the manifest', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({ canvas, src });

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isLoaded).toBe(true);
    expect(dotLottie.manifest).not.toBeNull();
    expect(dotLottie.activeAnimationId).toBeTruthy();
    expect(dotLottie.totalFrames).toBeGreaterThan(0);
  });

  test('autoplay starts playback and advances frames', async () => {
    const onPlay = vi.fn();
    const onFrame = vi.fn();

    dotLottie = new DotLottie({ canvas, src, autoplay: true });

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('frame', onFrame);

    await vi.waitFor(() => {
      expect(onPlay).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isPlaying).toBe(true);

    await vi.waitFor(() => {
      expect(onFrame.mock.calls.length).toBeGreaterThan(2);
    });

    expect(dotLottie.currentFrame).toBeGreaterThan(0);
  });

  test('pause preserves the current frame', async () => {
    const onPlay = vi.fn();
    const onPause = vi.fn();

    dotLottie = new DotLottie({ canvas, src, autoplay: true });

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('pause', onPause);

    await vi.waitFor(() => {
      expect(onPlay).toHaveBeenCalledTimes(1);
    });

    await vi.waitFor(() => {
      expect(dotLottie.currentFrame).toBeGreaterThan(0);
    });

    dotLottie.pause();

    await vi.waitFor(() => {
      expect(onPause).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isPaused).toBe(true);

    const frameAtPause = dotLottie.currentFrame;

    await sleep(100);

    expect(dotLottie.currentFrame).toBe(frameAtPause);
  });

  test('stop resets to the start frame and dispatches stop', async () => {
    const onStop = vi.fn();

    dotLottie = new DotLottie({ canvas, src, autoplay: true });

    dotLottie.addEventListener('stop', onStop);

    await vi.waitFor(() => {
      expect(dotLottie.currentFrame).toBeGreaterThan(0);
    });

    dotLottie.stop();

    await vi.waitFor(() => {
      expect(onStop).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isStopped).toBe(true);
    expect(dotLottie.currentFrame).toBe(0);
  });

  test('setFrame seeks and dispatches a frame event', async () => {
    const onLoad = vi.fn();
    const onFrame = vi.fn();

    dotLottie = new DotLottie({ canvas, src });

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    dotLottie.addEventListener('frame', onFrame);

    const target = Math.floor(dotLottie.totalFrames / 2);

    dotLottie.setFrame(target);

    await vi.waitFor(() => {
      expect(onFrame).toHaveBeenCalledWith(expect.objectContaining({ type: 'frame', currentFrame: target }));
    });

    expect(dotLottie.currentFrame).toBeCloseTo(target, 0);
  });

  test('dispatches loop events and tracks loopCount', async () => {
    const onLoop = vi.fn();

    dotLottie = new DotLottie({ canvas, src, autoplay: true, loop: true, speed: 20 });

    dotLottie.addEventListener('loop', onLoop);

    await vi.waitFor(
      () => {
        expect(onLoop.mock.calls.length).toBeGreaterThanOrEqual(2);
      },
      { timeout: 15000 },
    );

    expect(onLoop).toHaveBeenNthCalledWith(1, { type: 'loop', loopCount: 1 });
    expect(onLoop).toHaveBeenNthCalledWith(2, { type: 'loop', loopCount: 2 });
    expect(dotLottie.loopCount).toBeGreaterThanOrEqual(2);
  });

  test('dispatches complete and stops at the last frame when loop is false', async () => {
    const onComplete = vi.fn();

    dotLottie = new DotLottie({ canvas, src, autoplay: true, speed: 20 });

    dotLottie.addEventListener('complete', onComplete);

    await vi.waitFor(
      () => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      },
      { timeout: 15000 },
    );

    expect(dotLottie.isPlaying).toBe(false);
    expect(dotLottie.currentFrame).toBeCloseTo(dotLottie.totalFrames - 1, 0);
  });

  test('reverse mode starts at the end of the animation', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({ canvas, src, mode: 'reverse' });

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.mode).toBe('reverse');
    expect(dotLottie.currentFrame).toBeCloseTo(dotLottie.totalFrames - 1, 0);
  });

  test('segment restricts playback range', async () => {
    const onLoad = vi.fn();
    const onFrame = vi.fn();

    dotLottie = new DotLottie({ canvas, src, autoplay: true, loop: true, speed: 10, segment: [10, 20] });

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('frame', onFrame);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.segment).toEqual([10, 20]);

    await vi.waitFor(() => {
      expect(onFrame.mock.calls.length).toBeGreaterThan(5);
    });

    for (const [event] of onFrame.mock.calls as Array<[{ currentFrame: number }]>) {
      expect(event.currentFrame).toBeGreaterThanOrEqual(9.5);
      expect(event.currentFrame).toBeLessThanOrEqual(20.5);
    }
  });

  test('freeze and unfreeze dispatch events and toggle isFrozen', async () => {
    const onPlay = vi.fn();
    const onFreeze = vi.fn();
    const onUnfreeze = vi.fn();

    dotLottie = new DotLottie({ canvas, src, autoplay: true });

    dotLottie.addEventListener('play', onPlay);
    dotLottie.addEventListener('freeze', onFreeze);
    dotLottie.addEventListener('unfreeze', onUnfreeze);

    await vi.waitFor(() => {
      expect(onPlay).toHaveBeenCalledTimes(1);
    });

    dotLottie.freeze();

    expect(dotLottie.isFrozen).toBe(true);
    expect(onFreeze).toHaveBeenCalledTimes(1);

    dotLottie.unfreeze();

    expect(dotLottie.isFrozen).toBe(false);
    expect(onUnfreeze).toHaveBeenCalledTimes(1);
    expect(dotLottie.isPlaying).toBe(true);
  });

  test('dispatches loadError for invalid animation data', async () => {
    const onLoadError = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    dotLottie = new DotLottie({ canvas, data: 'not lottie json' });

    dotLottie.addEventListener('loadError', onLoadError);

    await vi.waitFor(() => {
      expect(onLoadError).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.isLoaded).toBe(false);

    consoleError.mockRestore();
  });

  test('destroy dispatches destroy and tears the player down', async () => {
    const onLoad = vi.fn();
    const onDestroy = vi.fn();

    dotLottie = new DotLottie({ canvas, src });

    dotLottie.addEventListener('load', onLoad);
    dotLottie.addEventListener('destroy', onDestroy);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    dotLottie.destroy();

    expect(onDestroy).toHaveBeenCalledTimes(1);
    expect(dotLottie.isLoaded).toBe(false);
    expect(dotLottie.isReady).toBe(false);
  });

  test('unsupported features degrade gracefully', async () => {
    const onLoad = vi.fn();

    dotLottie = new DotLottie({ canvas, src });

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.setTheme('theme')).toBe(false);
    expect(dotLottie.stateMachineStart()).toBe(false);
    expect(dotLottie.getSlotIds()).toEqual([]);
    expect(dotLottie.isStateMachineRunning).toBe(false);
    expect(dotLottie.setViewport(0, 0, 10, 10)).toBe(false);
    expect(Array.isArray(dotLottie.markers())).toBe(true);

    // Statics exist for drop-in compatibility.
    expect(DotLottie.setWasmUrl).toBeTypeOf('function');
    await expect(DotLottie.registerFont('font', new ArrayBuffer(0))).resolves.toBe(false);
  });

  test('players with the same src share one fetch and one parsed animation', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    // A unique query string keys a fresh entry in the module-level source cache.
    const dedupSrc = `${jsonSrc}?dedup-test`;
    const secondCanvas = createCanvas();
    const onLoadA = vi.fn();
    const onLoadB = vi.fn();

    dotLottie = new DotLottie({ canvas, src: dedupSrc });
    const second = new DotLottie({ canvas: secondCanvas, src: dedupSrc });

    dotLottie.addEventListener('load', onLoadA);
    second.addEventListener('load', onLoadB);

    try {
      await vi.waitFor(() => {
        expect(onLoadA).toHaveBeenCalledTimes(1);
        expect(onLoadB).toHaveBeenCalledTimes(1);
      });

      const dedupFetches = fetchSpy.mock.calls.filter(([input]) => String(input).includes('dedup-test'));

      expect(dedupFetches).toHaveLength(1);
      expect(dotLottie.totalFrames).toBe(second.totalFrames);
    } finally {
      second.destroy();
      secondCanvas.remove();
      fetchSpy.mockRestore();
    }
  });

  test('disposing the shared renderer keeps live players working', async () => {
    const onLoad = vi.fn();
    const onFrame = vi.fn();

    dotLottie = new DotLottie({ canvas, src });

    dotLottie.addEventListener('load', onLoad);

    await vi.waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    disposeSharedCanvasRenderer();

    dotLottie.addEventListener('frame', onFrame);
    dotLottie.setFrame(Math.floor(dotLottie.totalFrames / 2));

    await vi.waitFor(() => {
      expect(onFrame).toHaveBeenCalledTimes(1);
    });

    expect(dotLottie.currentFrame).toBeGreaterThan(0);
  });
});
