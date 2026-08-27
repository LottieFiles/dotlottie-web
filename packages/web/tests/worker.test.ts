/* eslint-disable node/no-unsupported-features/node-builtins */
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

import { DotLottieWorker } from '../src';

import { addWasmCSPPolicy, createCanvas, sleep } from './test-utils';

const wasmUrl = new URL('../src/core/dotlottie-player.wasm', import.meta.url).href;
const src = new URL('../../../fixtures/test.lottie', import.meta.url).href;
const UNREACHABLE = 'https://127.0.0.1:1/does-not-exist.wasm';

DotLottieWorker.setWasmUrl(wasmUrl);

let cleanupWasmCSPPolicy: () => void;

beforeAll(() => {
  cleanupWasmCSPPolicy = addWasmCSPPolicy();
});

afterAll(() => {
  cleanupWasmCSPPolicy();
});

afterEach(() => {
  vi.restoreAllMocks();
  // setWasmUrl is process-global.
  DotLottieWorker.setWasmUrl(wasmUrl);
});

type PostMessageSpy = { mock: { calls: Array<[unknown, ...unknown[]]> } };

const setWasmUrlPosts = (spy: PostMessageSpy): Array<{ params: { url: string } }> =>
  spy.mock.calls
    .map((call) => call[0] as { method?: string; params: { url: string } })
    .filter((msg) => msg.method === 'setWasmUrl');

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

describe('DotLottieWorker.setWasmUrl', () => {
  // A canvas-less facade spins the worker up but defers the WASM load until setCanvas() —
  // the window the broadcast has to cover.
  test('reaches a worker that exists but has not started loading yet', async () => {
    const facade = new DotLottieWorker({ src, workerId: 'late-url' });
    const errors: string[] = [];

    facade.addEventListener('loadError', (event) => {
      errors.push(event.error.message);
    });

    DotLottieWorker.setWasmUrl(UNREACHABLE);

    await facade.setCanvas(createCanvas());

    await vi.waitFor(
      () => {
        expect(errors).toHaveLength(1);
      },
      { timeout: 10000 },
    );

    expect(errors[0]).toContain('WASM loading failed from all sources');
  });

  test('resolves a relative path against the page so the blob worker can fetch it', async () => {
    const facade = new DotLottieWorker({ src, workerId: 'relative-url' });
    const postSpy = vi.spyOn(Worker.prototype, 'postMessage');
    const relative = new URL(wasmUrl).pathname;

    DotLottieWorker.setWasmUrl(relative);

    const posts = setWasmUrlPosts(postSpy);

    expect(posts.length).toBeGreaterThan(0);

    for (const post of posts) {
      expect(post.params.url).toBe(new URL(relative, document.baseURI).href);
    }

    // Without resolution this would be loadError: `fetch('/…')` throws in a blob: worker.
    await facade.setCanvas(createCanvas());

    await vi.waitFor(
      () => {
        expect(facade.isLoaded).toBe(true);
      },
      { timeout: 10000 },
    );
  });

  test('rejects empty and non-string URLs without touching existing workers', () => {
    // A worker must exist for an erroneous broadcast to be observable.
    void new DotLottieWorker({ src, workerId: 'validation' });
    const postSpy = vi.spyOn(Worker.prototype, 'postMessage');

    expect(() => DotLottieWorker.setWasmUrl('')).toThrow(TypeError);
    expect(() => DotLottieWorker.setWasmUrl('   ')).toThrow(TypeError);
    expect(() => DotLottieWorker.setWasmUrl(undefined as unknown as string)).toThrow(TypeError);

    expect(setWasmUrlPosts(postSpy)).toHaveLength(0);
  });
});
