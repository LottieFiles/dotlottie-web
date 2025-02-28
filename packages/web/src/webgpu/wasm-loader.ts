import { PACKAGE_NAME, PACKAGE_VERSION } from '../common/constants';

import createDotLottiePlayerModule from './wasm/dotlottie-player';
import type { MainModule } from './wasm/dotlottie-player.types';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class WasmLoader {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static _ModulePromise: Promise<MainModule> | null = null;

  // URL for the WASM file, constructed using package information
  private static _wasmURL = `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/dotlottie-player.webgpu.wasm`;

  private constructor() {
    throw new Error('RendererLoader is a static class and cannot be instantiated.');
  }

  private static async _tryLoad(url: string): Promise<MainModule> {
    const module = await createDotLottiePlayerModule({ locateFile: () => url });

    return module;
  }

  /**
   * Tries to load the WASM module from the primary URL, falling back to a backup URL if necessary.
   * Throws an error if both URLs fail to load the module.
   * @returns Promise<Module> - A promise that resolves to the loaded module.
   */
  private static async _loadWithBackup(): Promise<MainModule> {
    if (!this._ModulePromise) {
      this._ModulePromise = this._tryLoad(this._wasmURL).catch(async (initialError): Promise<MainModule> => {
        const backupUrl = `https://unpkg.com/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/dotlottie-player.webgpu.wasm`;

        console.warn(`Primary WASM load failed from ${this._wasmURL}. Error: ${(initialError as Error).message}`);
        console.warn(`Attempting to load WASM from backup URL: ${backupUrl}`);

        try {
          return await this._tryLoad(backupUrl);
        } catch (backupError) {
          console.error(`Primary WASM URL failed: ${(initialError as Error).message}`);
          console.error(`Backup WASM URL failed: ${(backupError as Error).message}`);
          throw new Error('WASM loading failed from all sources.');
        }
      });
    }

    return this._ModulePromise;
  }

  /**
   * Public method to load the WebAssembly module.
   * Utilizes a primary and backup URL for robustness.
   * @returns Promise<Module> - A promise that resolves to the loaded module.
   */
  public static async load(): Promise<MainModule> {
    return this._loadWithBackup();
  }

  /**
   * Sets a new URL for the WASM file and invalidates the current module promise.
   *
   * @param string -  The new URL for the WASM file.
   */
  public static setWasmUrl(url: string): void {
    if (url === this._wasmURL) return;

    this._wasmURL = url;
    // Invalidate current module promise
    this._ModulePromise = null;
  }
}
