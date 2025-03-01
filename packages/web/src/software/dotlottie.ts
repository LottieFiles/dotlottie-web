import type { Config } from '../common';
import { DotLottieCommon } from '../common';

import { WasmLoader } from './wasm-loader';

export class DotLottie extends DotLottieCommon {
  public constructor(config: Config) {
    super(config, WasmLoader, 'sw');
  }

  /**
   * Sets a new URL for the WASM file.
   * @param url - The new URL for the WASM file.
   * @override
   */
  public static override setWasmUrl(url: string): void {
    WasmLoader.setWasmUrl(url);
  }
}
