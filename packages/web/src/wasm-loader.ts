type WasmInitInput = string | BufferSource;
type WasmInitFn = (options: { module_or_path: WasmInitInput }) => Promise<unknown>;

export function createWasmLoader(initFn: WasmInitFn, primaryUrl: string, backupUrl: string) {
  let initPromise: Promise<void> | null = null;
  let wasmUrl = primaryUrl;
  // null once setWasmUrl() opts out of the CDN fallback.
  let fallbackUrl: string | null = backupUrl;

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

  async function attempt(load: (url: string) => Promise<void>, url: string): Promise<Error | null> {
    try {
      await load(url);

      return null;
    } catch (err) {
      return err as Error;
    }
  }

  return {
    load(): Promise<void> {
      if (!initPromise) {
        // Primary is snapshotted so a concurrent setWasmUrl() can't redirect this attempt;
        // fallbackUrl is read live so it can still block a CDN step that hasn't started.
        const primary = wasmUrl;

        let thisAttempt: Promise<void> | null = null;

        thisAttempt = (async () => {
          const primaryError = await attempt(initFromUrl, primary);

          if (!primaryError) return;

          console.warn(`Primary WASM load failed from ${primary}: ${primaryError.message}`);

          let backupError: Error | null = null;

          if (fallbackUrl !== null) {
            console.warn(`Attempting to load WASM from backup URL: ${fallbackUrl}`);
            backupError = await attempt(initFromUrl, fallbackUrl);

            if (!backupError) return;

            console.warn(`Backup WASM load failed from ${fallbackUrl}: ${backupError.message}`);
          }

          console.warn('Retrying WASM load with buffered instantiation');

          let bufferedError = await attempt(initFromBytes, primary);

          if (!bufferedError) return;

          console.warn(`Buffered WASM load from ${primary} failed: ${bufferedError.message}`);

          if (fallbackUrl !== null) {
            bufferedError = await attempt(initFromBytes, fallbackUrl);

            if (!bufferedError) return;
          }

          console.error(`Primary WASM URL failed: ${primaryError.message}`);

          if (backupError) {
            console.error(`Backup WASM URL failed: ${backupError.message}`);
          }

          console.error(`Buffered fallback failed: ${bufferedError.message}`);

          // A setWasmUrl() may already have started a successor; don't clear that one.
          if (initPromise === thisAttempt) {
            initPromise = null;
          }

          throw new Error('WASM loading failed from all sources.');
        })();

        initPromise = thisAttempt;
      }

      return initPromise;
    },

    setWasmUrl(url: string): void {
      if (typeof url !== 'string' || url.trim() === '') {
        throw new TypeError('setWasmUrl() expects a non-empty URL string');
      }

      // Opting in is what disables the fallback, not the URL differing from the default.
      fallbackUrl = null;

      if (url === wasmUrl) return;

      wasmUrl = url;
      initPromise = null;
    },
  };
}
