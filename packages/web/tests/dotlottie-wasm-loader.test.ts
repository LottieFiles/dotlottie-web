import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { DotLottie } from '../src';
import { PACKAGE_NAME, PACKAGE_VERSION } from '../src/constants';

import { createCanvas } from './test-utils';

describe('DotLottie WASM loading', () => {
  const primaryUrl = `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/dotlottie-player.wasm`;
  const backupUrl = `https://unpkg.com/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/dotlottie-player.wasm`;
  const localWasmUrl = new URL('../src/core/dotlottie-player.wasm', import.meta.url).href;
  const src = new URL('../../../fixtures/test.lottie', import.meta.url).href;

  let originalFetch: typeof globalThis.fetch;
  let canvas: HTMLCanvasElement;

  /**
   * Collects unique WASM URLs requested via fetch, in first-seen order.
   *
   * Note: Emscripten fetches each URL twice internally (streaming compilation attempt,
   * then arraybuffer fallback). We deduplicate to focus on the URLs that
   * DotLottieWasmLoader controls.
   */
  let requestedWasmUrls: string[];

  beforeEach(() => {
    requestedWasmUrls = [];
    canvas = createCanvas();

    // Reset to default CDN URL (setup.ts sets it to local file, this change invalidates the cache)
    DotLottie.setWasmUrl(primaryUrl);

    // Stub fetch to capture requested URLs and simulate network failure
    originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      if (!requestedWasmUrls.includes(url)) {
        requestedWasmUrls.push(url);
      }

      return new Response(null, { status: 404, statusText: 'Not Found' });
    }) as typeof globalThis.fetch;

    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    DotLottie.setWasmUrl(localWasmUrl);
    canvas.remove();
    vi.restoreAllMocks();
  });

  test('loads WASM from jsdelivr CDN using the correct package name and version', async () => {
    const dotLottie = new DotLottie({ canvas, src });

    await vi.waitFor(() => {
      expect(requestedWasmUrls.length).toBeGreaterThan(0);
    });

    expect(requestedWasmUrls[0]).toBe(primaryUrl);

    dotLottie.destroy();
  });

  test('falls back to unpkg CDN when jsdelivr fails', async () => {
    const dotLottie = new DotLottie({ canvas, src });

    await vi.waitFor(() => {
      expect(requestedWasmUrls).toContain(backupUrl);
    });

    // jsdelivr is tried first, then unpkg
    expect(requestedWasmUrls).toEqual([primaryUrl, backupUrl]);

    dotLottie.destroy();
  });

  test('setWasmUrl overrides the default CDN URL', async () => {
    const customUrl = 'https://example.com/custom.wasm';

    DotLottie.setWasmUrl(customUrl);

    const dotLottie = new DotLottie({ canvas, src });

    await vi.waitFor(() => {
      expect(requestedWasmUrls.length).toBeGreaterThan(0);
    });

    expect(requestedWasmUrls).toContain(customUrl);
    expect(requestedWasmUrls).not.toContain(primaryUrl);

    dotLottie.destroy();
  });

  test('emits loadError when all WASM sources fail', async () => {
    const onLoadError = vi.fn();

    const dotLottie = new DotLottie({ canvas, src });

    dotLottie.addEventListener('loadError', onLoadError);

    await vi.waitFor(() => {
      expect(onLoadError).toHaveBeenCalled();
    });

    dotLottie.destroy();
  });
});
