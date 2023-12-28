/**
 * Copyright 2023 Design Barn Inc.
 */

import pkg from '../package.json';

import type { Module } from './wasm';
import { createRendererModule } from './wasm';

/**
 * RendererLoader is a utility class for loading WebAssembly modules.
 * It provides methods to load modules with a primary URL and a backup URL.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class RendererLoader {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static _ModulePromise: Promise<Module> | null = null;

  // URL for the WASM file, constructed using package information
  private static _wasmURL = `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/dist/wasm/renderer.wasm`;

  private constructor() {
    throw new Error('RendererLoader is a static class and cannot be instantiated.');
  }

  private static async _tryLoad(url: string): Promise<Module> {
    const module = await createRendererModule({ locateFile: () => url });

    return module;
  }

  /**
   * Tries to load the WASM module from the primary URL, falling back to a backup URL if necessary.
   * Throws an error if both URLs fail to load the module.
   * @returns Promise<Module> - A promise that resolves to the loaded module.
   */
  private static async _loadWithBackup(): Promise<Module> {
    if (!this._ModulePromise) {
      this._ModulePromise = this._tryLoad(this._wasmURL).catch(async (initialError): Promise<Module> => {
        const backupUrl = `https://unpkg.com/${pkg.name}@${pkg.version}/dist/wasm/renderer.wasm`;

        console.warn(`Trying backup URL for WASM loading: ${backupUrl}`);
        try {
          return await this._tryLoad(backupUrl);
        } catch (backupError) {
          console.error(
            `Both primary and backup WASM URLs failed. Primary error: ${
              (initialError as Error).message
            }, Backup error: ${(backupError as Error).message}`,
          );
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
  public static async load(): Promise<Module> {
    return this._loadWithBackup();
  }

  /**
   * Sets a new URL for the WASM file and invalidates the current module promise.
   *
   * @param string -  The new URL for the WASM file.
   */
  public static setWasmUrl(url: string): void {
    this._wasmURL = url;
    // Invalidate current module promise
    this._ModulePromise = null;
  }
}
