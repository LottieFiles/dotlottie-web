/* eslint-disable node/no-unsupported-features/node-builtins */
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { DotLottieWorker } from '../src';

import { addWasmCSPPolicy, createCanvas, sleep } from './test-utils';

const wasmUrl = new URL('../src/core/dotlottie-player.wasm', import.meta.url).href;
const src = new URL('../../../fixtures/test.lottie', import.meta.url).href;

DotLottieWorker.setWasmUrl(wasmUrl);

let cleanupWasmCSPPolicy: () => void;

beforeAll(() => {
  cleanupWasmCSPPolicy = addWasmCSPPolicy();
});

afterAll(() => {
  cleanupWasmCSPPolicy();
});

describe('DotLottieWorker canvas adoption (React StrictMode pattern)', () => {
  test('destroy → immediate re-create on the same canvas adopts the worker-side instance', async () => {
    const canvas = createCanvas();
    const transferSpy = vi.spyOn(canvas, 'transferControlToOffscreen');

    // StrictMode's cleanup + re-run happen back-to-back, synchronously:
    const first = new DotLottieWorker({ canvas, src, autoplay: true });

    void first.destroy();

    const second = new DotLottieWorker({ canvas, src, autoplay: true });

    // the canvas was only transferred once — the second facade adopted
    expect(transferSpy).toHaveBeenCalledTimes(1);

    await vi.waitFor(
      () => {
        expect(second.isLoaded).toBe(true);
      },
      { timeout: 10000 },
    );

    await vi.waitFor(() => {
      expect(second.isPlaying).toBe(true);
    });

    await second.pause();

    expect(second.isPlaying).toBe(false);

    await second.destroy();
    canvas.remove();
  });

  test('destroy after load → immediate re-create cancels the pending teardown and adopts', async () => {
    const canvas = createCanvas();
    const transferSpy = vi.spyOn(canvas, 'transferControlToOffscreen');

    const first = new DotLottieWorker({ canvas, src, autoplay: true });

    // first must be fully created before destroy() so destroy() actually runs (not a no-op)
    // and schedules the pending-destroy grace timer that _adopt must cancel.
    await vi.waitFor(
      () => {
        expect(first.isLoaded).toBe(true);
      },
      { timeout: 10000 },
    );

    const onFirstDestroy = vi.fn();

    first.addEventListener('destroy', onFirstDestroy);

    // destroy()'s synchronous prefix dispatches the 'destroy' event and schedules the grace timer
    void first.destroy();

    expect(onFirstDestroy).toHaveBeenCalledTimes(1);

    const second = new DotLottieWorker({ canvas, src, autoplay: true });

    expect(transferSpy).toHaveBeenCalledTimes(1);

    // let the (cancelled) grace window elapse. If the timer wasn't cancelled, the
    // registry entry would be deleted and the worker-side instance destroyed here.
    await sleep(50);

    await vi.waitFor(
      () => {
        expect(second.isLoaded).toBe(true);
      },
      { timeout: 10000 },
    );

    await second.play();

    await vi.waitFor(() => {
      expect(second.isPlaying).toBe(true);
    });

    await second.pause();

    expect(second.isPlaying).toBe(false);

    await second.destroy();
    canvas.remove();
  });

  test('double construct without destroy retires the first facade instead of throwing', async () => {
    const canvas = createCanvas();
    const transferSpy = vi.spyOn(canvas, 'transferControlToOffscreen');

    // React 19 StrictMode double-attach path: no detach between the two creates
    const first = new DotLottieWorker({ canvas, src, autoplay: true });
    const second = new DotLottieWorker({ canvas, src, autoplay: true });

    expect(transferSpy).toHaveBeenCalledTimes(1);

    await vi.waitFor(
      () => {
        expect(second.isLoaded).toBe(true);
      },
      { timeout: 10000 },
    );

    // the first facade is inert: it no longer drives the shared worker-side instance
    await first.play();

    expect(first.isPlaying).toBe(false);

    await second.destroy();
    canvas.remove();
  });

  test('after the grace window the registry entry is cleared (no stale adoption)', async () => {
    const canvas = createCanvas();
    const transferSpy = vi.spyOn(canvas, 'transferControlToOffscreen');

    const first = new DotLottieWorker({ canvas, src });

    await vi.waitFor(
      () => {
        expect(first.isLoaded).toBe(true);
      },
      { timeout: 10000 },
    );

    await first.destroy();
    await sleep(50); // grace window (one macrotask) has expired

    // A late re-create must NOT adopt a destroyed worker-side instance: it attempts a
    // fresh transfer, which throws asynchronously — unchanged, documented behavior.
    const suppressRejection = (event: PromiseRejectionEvent): void => {
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', suppressRejection);

    try {
      // eslint-disable-next-line no-new
      new DotLottieWorker({ canvas, src });

      // the second transfer attempt proves the registry entry was cleared
      expect(transferSpy).toHaveBeenCalledTimes(2);
      await sleep(50); // let the rejected _create settle while the suppressor is attached
    } finally {
      window.removeEventListener('unhandledrejection', suppressRejection);
      canvas.remove();
    }
  });
});
