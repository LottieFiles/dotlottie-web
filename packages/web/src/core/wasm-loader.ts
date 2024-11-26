import { BACKUP_WASM_URL, DEFAULT_WASM_URL } from '../constants';

import createDotLottiePlayerModule from './dotlottie-player';
import type { MainModule } from './dotlottie-player.types';

let modulePromise: Promise<MainModule> | null = null;
let wasmURL = DEFAULT_WASM_URL;

/**
 * Sets a new URL for the WASM file and invalidates the current module promise.
 * @param url - The new URL for the WASM file.
 */
export function setWasmUrl(url: string): void {
  wasmURL = url;
  modulePromise = null;
}

/**
 * Loads the WASM module, using a backup URL if the primary fails.
 * @returns Promise<MainModule> - A promise that resolves to the loaded module.
 */
export async function loadWasmModule(): Promise<MainModule> {
  if (!modulePromise) {
    modulePromise = (async (): Promise<MainModule> => {
      try {
        return createDotLottiePlayerModule({ locateFile: () => wasmURL });
      } catch {
        return createDotLottiePlayerModule({ locateFile: () => BACKUP_WASM_URL });
      }
    })();
  }

  return modulePromise;
}
