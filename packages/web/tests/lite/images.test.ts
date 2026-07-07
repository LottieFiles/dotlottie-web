import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCachedImage, loadImageSource } from '../../src/lite/renderer/images';

describe('images', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not refetch a source whose decode failed', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('404'));
    vi.stubGlobal('fetch', fetchMock);
    const cache = new Map<string, ImageBitmap>();

    await loadImageSource(cache, 'missing.png');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Render-time misses and repeated loads must not spawn new fetches --
    // without the failed-source set this loops one fetch per rendered frame.
    expect(getCachedImage(cache, 'missing.png')).toBeUndefined();
    await loadImageSource(cache, 'missing.png');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('shares the in-flight decode promise instead of resolving early', async () => {
    let resolveFetch: ((value: { blob: () => Promise<unknown> }) => void) | undefined;
    const fetchMock = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const bitmap = { close() {} } as unknown as ImageBitmap;
    vi.stubGlobal('createImageBitmap', vi.fn().mockResolvedValue(bitmap));
    const cache = new Map<string, ImageBitmap>();

    // First load kicked off by a render; second is preload() awaiting it.
    const first = loadImageSource(cache, 'a.png');
    let settled = false;
    const second = loadImageSource(cache, 'a.png').then(() => {
      settled = true;
    });
    await Promise.resolve();
    // preload() must not resolve while the decode is still in flight.
    expect(settled).toBe(false);

    resolveFetch?.({ blob: async () => ({}) });
    await Promise.all([first, second]);
    expect(settled).toBe(true);
    expect(cache.get('a.png')).toBe(bitmap);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
