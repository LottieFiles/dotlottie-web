type WasmInitFn = (options: { module_or_path: string }) => Promise<unknown>;

export function createWasmLoader(initFn: WasmInitFn, primaryUrl: string, backupUrl: string) {
  let initPromise: Promise<void> | null = null;
  let wasmUrl = primaryUrl;

  return {
    load(): Promise<void> {
      if (!initPromise) {
        initPromise = initFn({ module_or_path: wasmUrl })
          .then(() => undefined)
          .catch(async (initialError: unknown): Promise<void> => {
            console.warn(`Primary WASM load failed from ${wasmUrl}: ${(initialError as Error).message}`);
            console.warn(`Attempting to load WASM from backup URL: ${backupUrl}`);

            try {
              await initFn({ module_or_path: backupUrl });
            } catch (backupError) {
              console.error(`Primary WASM URL failed: ${(initialError as Error).message}`);
              console.error(`Backup WASM URL failed: ${(backupError as Error).message}`);
              initPromise = null;
              throw new Error('WASM loading failed from all sources.');
            }
          });
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
