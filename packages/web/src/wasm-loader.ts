type WasmInitInput = string | BufferSource;
type WasmInitFn = (options: { module_or_path: WasmInitInput }) => Promise<unknown>;

export function createWasmLoader(initFn: WasmInitFn, primaryUrl: string, backupUrl: string) {
  let initPromise: Promise<void> | null = null;
  let wasmUrl = primaryUrl;

  async function initFromUrl(url: string): Promise<void> {
    await initFn({ module_or_path: url });
  }

  // Some environments (notably certain iOS WKWebView builds) reject
  // WebAssembly.instantiateStreaming even for otherwise valid Response objects.
  // Fetching bytes ourselves and passing a BufferSource to wasm-bindgen's init
  // skips its streaming code path entirely.
  async function initFromBytes(url: string): Promise<void> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`fetch ${url} responded with ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();

    await initFn({ module_or_path: buffer });
  }

  return {
    load(): Promise<void> {
      if (!initPromise) {
        // Snapshot URLs so a concurrent setWasmUrl() can't shift them mid-attempt.
        const primary = wasmUrl;
        const backup = backupUrl;

        initPromise = (async () => {
          let primaryError: unknown;
          let backupError: unknown;

          try {
            await initFromUrl(primary);
            return;
          } catch (err) {
            primaryError = err;
            console.warn(`Primary WASM load failed from ${primary}: ${(err as Error).message}`);
            console.warn(`Attempting to load WASM from backup URL: ${backup}`);
          }

          try {
            await initFromUrl(backup);
            return;
          } catch (err) {
            backupError = err;
            console.warn(`Backup WASM load failed from ${backup}: ${(err as Error).message}`);
          }

          console.warn('Retrying WASM load with buffered instantiation');

          try {
            await initFromBytes(primary);
            return;
          } catch (err) {
            console.warn(`Buffered WASM load from ${primary} failed: ${(err as Error).message}`);
          }

          try {
            await initFromBytes(backup);
            return;
          } catch (err) {
            console.error(`Primary WASM URL failed: ${(primaryError as Error).message}`);
            console.error(`Backup WASM URL failed: ${(backupError as Error).message}`);
            console.error(`Buffered fallback failed: ${(err as Error).message}`);
            initPromise = null;
            throw new Error('WASM loading failed from all sources.');
          }
        })();
      }

      return initPromise;
    },

    setWasmUrl(url: string): void {
      if (url === wasmUrl) return;

      wasmUrl = url;
      initPromise = null;
    },
  };
}
