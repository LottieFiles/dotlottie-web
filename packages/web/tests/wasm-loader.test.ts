import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { createWasmLoader } from '../src/wasm-loader';

const PRIMARY = 'https://primary.example.com/player.wasm';
const BACKUP = 'https://backup.example.com/player.wasm';

type WasmInitFn = Parameters<typeof createWasmLoader>[0];

const wasmBytes = () => new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0]).buffer;

const okResponse = (): Response => new Response(wasmBytes(), { status: 200, statusText: 'OK' });
const notOkResponse = (status = 404, statusText = 'Not Found'): Response => new Response(null, { status, statusText });

describe('createWasmLoader', () => {
  let initFn: Mock<WasmInitFn>;
  let fetchMock: Mock<typeof fetch>;

  beforeEach(() => {
    initFn = vi.fn<WasmInitFn>();
    fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new Error('fetch not stubbed'));
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('resolves when primary URL succeeds', async () => {
    initFn.mockResolvedValue(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).resolves.toBeUndefined();
    expect(initFn).toHaveBeenCalledTimes(1);
    expect(initFn).toHaveBeenCalledWith({ module_or_path: PRIMARY });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('deduplicates concurrent load() calls', async () => {
    initFn.mockResolvedValue(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await Promise.all([loader.load(), loader.load(), loader.load()]);
    expect(initFn).toHaveBeenCalledTimes(1);
  });

  it('falls back to backup URL when primary streaming fails', async () => {
    initFn.mockRejectedValueOnce(new Error('primary-fail'));
    initFn.mockResolvedValueOnce(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).resolves.toBeUndefined();
    expect(initFn).toHaveBeenCalledTimes(2);
    expect(initFn).toHaveBeenNthCalledWith(1, { module_or_path: PRIMARY });
    expect(initFn).toHaveBeenNthCalledWith(2, { module_or_path: BACKUP });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it('falls back to buffered primary load when both streaming attempts fail', async () => {
    initFn.mockRejectedValueOnce(new Error('primary-stream'));
    initFn.mockRejectedValueOnce(new Error('backup-stream'));
    initFn.mockResolvedValueOnce(undefined);
    fetchMock.mockResolvedValueOnce(okResponse());

    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).resolves.toBeUndefined();

    expect(initFn).toHaveBeenCalledTimes(3);
    expect(initFn).toHaveBeenNthCalledWith(1, { module_or_path: PRIMARY });
    expect(initFn).toHaveBeenNthCalledWith(2, { module_or_path: BACKUP });
    expect(initFn).toHaveBeenNthCalledWith(3, { module_or_path: expect.any(ArrayBuffer) });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(PRIMARY);
  });

  it('falls back to buffered backup load when buffered primary also fails', async () => {
    initFn.mockRejectedValueOnce(new Error('primary-stream'));
    initFn.mockRejectedValueOnce(new Error('backup-stream'));
    initFn.mockRejectedValueOnce(new Error('primary-buffer-instantiate'));
    initFn.mockResolvedValueOnce(undefined);
    fetchMock.mockResolvedValueOnce(okResponse());
    fetchMock.mockResolvedValueOnce(okResponse());

    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).resolves.toBeUndefined();

    expect(initFn).toHaveBeenCalledTimes(4);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(1, PRIMARY);
    expect(fetchMock).toHaveBeenNthCalledWith(2, BACKUP);
  });

  it('treats non-ok HTTP responses as buffer fetch failures', async () => {
    initFn.mockRejectedValueOnce(new Error('primary-stream'));
    initFn.mockRejectedValueOnce(new Error('backup-stream'));
    initFn.mockResolvedValueOnce(undefined);
    fetchMock.mockResolvedValueOnce(notOkResponse(404));
    fetchMock.mockResolvedValueOnce(okResponse());

    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).resolves.toBeUndefined();

    expect(initFn).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    // initFn was only called for streaming primary, streaming backup, and buffered backup
    // — buffered primary was rejected at the fetch layer before reaching initFn
    expect(initFn).toHaveBeenNthCalledWith(3, { module_or_path: expect.any(ArrayBuffer) });
  });

  it('rejects when streaming and buffered loads all fail', async () => {
    initFn.mockRejectedValue(new Error('init-fail'));
    fetchMock.mockRejectedValue(new Error('network-fail'));

    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).rejects.toThrow('WASM loading failed from all sources.');

    expect(initFn).toHaveBeenCalledTimes(2); // streaming primary + backup; buffer paths fail at fetch
    expect(fetchMock).toHaveBeenCalledTimes(2);
    // 3 errors at the final-failure path: primary streaming + backup streaming + last buffered attempt
    expect(console.error).toHaveBeenCalledTimes(3);
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('init-fail'));
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('network-fail'));
  });

  it('resets initPromise after total failure so next load() retries', async () => {
    initFn.mockRejectedValue(new Error('fail'));
    fetchMock.mockRejectedValue(new Error('network-fail'));

    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).rejects.toThrow();

    initFn.mockReset();
    fetchMock.mockReset();
    initFn.mockResolvedValue(undefined);

    await expect(loader.load()).resolves.toBeUndefined();
    expect(initFn).toHaveBeenCalledTimes(1); // streaming primary succeeds on retry
  });

  it('mid-flight setWasmUrl keeps the in-flight primary but blocks CDN attempts not yet started', async () => {
    initFn.mockRejectedValueOnce(new Error('primary-stream'));
    initFn.mockResolvedValueOnce(undefined);
    fetchMock.mockResolvedValueOnce(okResponse());

    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    const loadPromise = loader.load();

    loader.setWasmUrl('https://changed.example.com/player.wasm');

    await expect(loadPromise).resolves.toBeUndefined();

    // Primary is snapshotted: the buffered retry still targets it.
    expect(fetchMock).toHaveBeenCalledWith(PRIMARY);
    expect(fetchMock).not.toHaveBeenCalledWith(expect.stringContaining('changed'));
    // The backup is read live, so the streaming-backup step was skipped.
    expect(initFn).toHaveBeenCalledTimes(2);
    expect(initFn).not.toHaveBeenCalledWith({ module_or_path: BACKUP });
  });

  it('setWasmUrl() with a new URL resets the loader', async () => {
    initFn.mockResolvedValue(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await loader.load();
    const NEW_URL = 'https://other.example.com/player.wasm';
    loader.setWasmUrl(NEW_URL);
    await loader.load();
    expect(initFn).toHaveBeenCalledTimes(2);
    expect(initFn).toHaveBeenNthCalledWith(2, { module_or_path: NEW_URL });
  });

  it('setWasmUrl() with the same URL keeps the resolved load instead of re-initializing', async () => {
    initFn.mockResolvedValue(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await loader.load();
    loader.setWasmUrl(PRIMARY);
    await loader.load();
    expect(initFn).toHaveBeenCalledTimes(1);
  });

  describe('setWasmUrl() opts out of the CDN backup', () => {
    const SELF_HOSTED = '/assets/player.wasm';

    it('never streams from the backup once an explicit URL is set', async () => {
      initFn.mockRejectedValueOnce(new Error('self-hosted-fail'));
      fetchMock.mockResolvedValueOnce(okResponse());
      initFn.mockResolvedValueOnce(undefined);

      const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
      loader.setWasmUrl(SELF_HOSTED);
      await expect(loader.load()).resolves.toBeUndefined();

      // streaming (fails) → buffered (succeeds); backup skipped.
      expect(initFn).toHaveBeenCalledTimes(2);
      expect(initFn).toHaveBeenNthCalledWith(1, { module_or_path: SELF_HOSTED });
      expect(initFn).not.toHaveBeenCalledWith({ module_or_path: BACKUP });
      expect(console.warn).not.toHaveBeenCalledWith(expect.stringContaining(BACKUP));
    });

    it('never fetches the backup in the buffered path either', async () => {
      initFn.mockRejectedValue(new Error('init-fail'));
      fetchMock.mockResolvedValue(okResponse());

      const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
      loader.setWasmUrl(SELF_HOSTED);
      await expect(loader.load()).rejects.toThrow('WASM loading failed from all sources.');

      expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([SELF_HOSTED]);
    });

    it('drops the backup even when the explicit URL equals the current primary', async () => {
      initFn.mockRejectedValueOnce(new Error('primary-fail'));
      fetchMock.mockRejectedValue(new Error('offline'));

      const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
      loader.setWasmUrl(PRIMARY);
      await expect(loader.load()).rejects.toThrow('WASM loading failed from all sources.');

      expect(initFn).not.toHaveBeenCalledWith({ module_or_path: BACKUP });
      expect(fetchMock).not.toHaveBeenCalledWith(BACKUP);
    });

    it('rejects empty and non-string URLs without touching the loader', async () => {
      initFn.mockRejectedValueOnce(new Error('primary-fail'));
      initFn.mockResolvedValueOnce(undefined);
      const loader = createWasmLoader(initFn, PRIMARY, BACKUP);

      expect(() => loader.setWasmUrl('')).toThrow(TypeError);
      expect(() => loader.setWasmUrl('   ')).toThrow(TypeError);
      expect(() => loader.setWasmUrl(undefined as unknown as string)).toThrow(TypeError);

      // Fallback still armed — the rejected calls must not have opted out.
      await expect(loader.load()).resolves.toBeUndefined();
      expect(initFn).toHaveBeenNthCalledWith(2, { module_or_path: BACKUP });
    });

    it("a stale attempt's failure does not clear a successor started after setWasmUrl()", async () => {
      const deferred = <T>() => {
        let resolve!: (value: T) => void;
        let reject!: (reason: unknown) => void;
        const promise = new Promise<T>((res, rej) => {
          resolve = res;
          reject = rej;
        });

        return { promise, resolve, reject };
      };

      const first = deferred<void>();
      const second = deferred<void>();

      initFn.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
      fetchMock.mockRejectedValue(new Error('offline'));

      const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
      const stale = loader.load();

      loader.setWasmUrl(SELF_HOSTED); // resets initPromise; `stale` keeps running
      const successor = loader.load();

      expect(successor).not.toBe(stale);

      // Stale attempt exhausts its ladder.
      first.reject(new Error('stale-primary'));
      await expect(stale).rejects.toThrow('WASM loading failed from all sources.');

      // The successor must still be the cached promise, not a third concurrent init.
      expect(loader.load()).toBe(successor);

      second.resolve();
      await expect(successor).resolves.toBeUndefined();
      expect(initFn).toHaveBeenCalledTimes(2);
    });

    it('omits the backup line from the final error report', async () => {
      initFn.mockRejectedValue(new Error('init-fail'));
      fetchMock.mockRejectedValue(new Error('network-fail'));

      const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
      loader.setWasmUrl(SELF_HOSTED);
      await expect(loader.load()).rejects.toThrow();

      expect(console.error).toHaveBeenCalledTimes(2);
      expect(console.error).not.toHaveBeenCalledWith(expect.stringContaining('Backup WASM URL failed'));
    });
  });

  it('logs warn with primary URL and backup notice on primary failure', async () => {
    initFn.mockRejectedValueOnce(new Error('primary-fail'));
    initFn.mockResolvedValueOnce(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await loader.load();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(PRIMARY));
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(BACKUP));
  });

  it('logs final errors for primary, backup, and buffered failure', async () => {
    initFn.mockRejectedValueOnce(new Error('primary-err'));
    initFn.mockRejectedValueOnce(new Error('backup-err'));
    fetchMock.mockRejectedValue(new Error('buffered-err'));

    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).rejects.toThrow();

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('primary-err'));
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('backup-err'));
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('buffered-err'));
  });
});
