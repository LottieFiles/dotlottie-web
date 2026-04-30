import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { createWasmLoader } from '../src/wasm-loader';

const PRIMARY = 'https://primary.example.com/player.wasm';
const BACKUP = 'https://backup.example.com/player.wasm';

type WasmInitFn = Parameters<typeof createWasmLoader>[0];

describe('createWasmLoader', () => {
  let initFn: Mock<WasmInitFn>;

  beforeEach(() => {
    initFn = vi.fn<WasmInitFn>();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves when primary URL succeeds', async () => {
    initFn.mockResolvedValue(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).resolves.toBeUndefined();
    expect(initFn).toHaveBeenCalledTimes(1);
    expect(initFn).toHaveBeenCalledWith({ module_or_path: PRIMARY });
  });

  it('deduplicates concurrent load() calls', async () => {
    initFn.mockResolvedValue(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await Promise.all([loader.load(), loader.load(), loader.load()]);
    expect(initFn).toHaveBeenCalledTimes(1);
  });

  it('falls back to backup URL when primary fails', async () => {
    initFn.mockRejectedValueOnce(new Error('primary-fail'));
    initFn.mockResolvedValueOnce(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).resolves.toBeUndefined();
    expect(initFn).toHaveBeenCalledTimes(2);
    expect(initFn).toHaveBeenNthCalledWith(1, { module_or_path: PRIMARY });
    expect(initFn).toHaveBeenNthCalledWith(2, { module_or_path: BACKUP });
    expect(console.warn).toHaveBeenCalled();
  });

  it('rejects when both URLs fail', async () => {
    initFn.mockRejectedValue(new Error('fail'));
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).rejects.toThrow('WASM loading failed from all sources.');
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  it('resets initPromise after total failure so next load() retries', async () => {
    initFn.mockRejectedValue(new Error('fail'));
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).rejects.toThrow();
    // Second call must invoke initFn again (not return stale rejection)
    initFn.mockResolvedValue(undefined);
    await expect(loader.load()).resolves.toBeUndefined();
    // initFn: 2 calls for first attempt (primary + backup) + 1 for second attempt
    expect(initFn).toHaveBeenCalledTimes(3);
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

  it('setWasmUrl() with the same URL is a no-op', async () => {
    initFn.mockResolvedValue(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await loader.load();
    loader.setWasmUrl(PRIMARY); // same URL — should not reset
    await loader.load();
    expect(initFn).toHaveBeenCalledTimes(1); // still uses cached promise
  });

  it('logs warn with primary URL and backup notice on primary failure', async () => {
    initFn.mockRejectedValueOnce(new Error('primary-fail'));
    initFn.mockResolvedValueOnce(undefined);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await loader.load();
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(PRIMARY));
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(BACKUP));
  });

  it('logs error for both primary and backup failures on total failure', async () => {
    const primaryError = new Error('primary-err');
    const backupError = new Error('backup-err');
    initFn.mockRejectedValueOnce(primaryError);
    initFn.mockRejectedValueOnce(backupError);
    const loader = createWasmLoader(initFn, PRIMARY, BACKUP);
    await expect(loader.load()).rejects.toThrow();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('primary-err'));
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('backup-err'));
  });
});
