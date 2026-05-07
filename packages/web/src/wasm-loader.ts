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
        initPromise = (async () => {
          let primaryError: unknown;
          let backupError: unknown;

          try {
            await initFromUrl(wasmUrl);
            return;
          } catch (err) {
            primaryError = err;
            console.warn(`Primary WASM load failed from ${wasmUrl}: ${(err as Error).message}`);
            console.warn(`Attempting to load WASM from backup URL: ${backupUrl}`);
          }

          try {
            await initFromUrl(backupUrl);
            return;
          } catch (err) {
            backupError = err;
            console.warn(`Backup WASM load failed from ${backupUrl}: ${(err as Error).message}`);
          }

          console.warn('Retrying WASM load with buffered instantiation');

          try {
            await initFromBytes(wasmUrl);
            return;
          } catch (err) {
            console.warn(`Buffered WASM load from ${wasmUrl} failed: ${(err as Error).message}`);
          }

          try {
            await initFromBytes(backupUrl);
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
