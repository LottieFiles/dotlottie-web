import { PACKAGE_NAME, PACKAGE_VERSION } from '../constants';

import init from './dotlottie-player';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DotLottieWasmLoader {
  private static _initPromise: Promise<void> | null = null;

  // URL for the WASM file, constructed using package information
  private static _wasmURL =
    `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/dotlottie-player.wasm`;

  private constructor() {
    throw new Error('RendererLoader is a static class and cannot be instantiated.');
  }

  /**
   * Initializes the WASM module. After this resolves, wasm-bindgen classes
   * and enums can be imported directly from './dotlottie-player'.
   * Uses a primary and backup URL for robustness.
   * @returns Promise<void>
   */
  public static async load(): Promise<void> {
    if (!DotLottieWasmLoader._initPromise) {
      DotLottieWasmLoader._initPromise = init(DotLottieWasmLoader._wasmURL)
        .then(() => {
          // Discard InitOutput — we only care that init succeeded
        })
        .catch(async (initialError): Promise<void> => {
          const backupUrl = `https://unpkg.com/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/dotlottie-player.wasm`;

          console.warn(
            `Primary WASM load failed from ${DotLottieWasmLoader._wasmURL}. Error: ${(initialError as Error).message}`,
          );
          console.warn(`Attempting to load WASM from backup URL: ${backupUrl}`);

          try {
            await init(backupUrl);
          } catch (backupError) {
            console.error(`Primary WASM URL failed: ${(initialError as Error).message}`);
            console.error(`Backup WASM URL failed: ${(backupError as Error).message}`);
            throw new Error('WASM loading failed from all sources.');
          }
        });
    }

    return DotLottieWasmLoader._initPromise;
  }

  /**
   * Sets a new URL for the WASM file and invalidates the current module promise.
   *
   * @param url -  The new URL for the WASM file.
   */
  public static setWasmUrl(url: string): void {
    if (url === DotLottieWasmLoader._wasmURL) return;

    DotLottieWasmLoader._wasmURL = url;
    // Invalidate current init promise
    DotLottieWasmLoader._initPromise = null;
  }
}
