/* eslint-disable @typescript-eslint/naming-convention */
import { PACKAGE_NAME, PACKAGE_VERSION } from '../constants';

import createDotLottiePlayerModule from './dotlottie-player';
import type { MainModule } from './dotlottie-player.types';

// Define the bridge interface
export interface DotLottieBridge {
  observer_on_complete: (dotlottie_instance_id: number) => void;
  observer_on_frame: (dotlottie_instance_id: number, frame_no: number) => void;
  observer_on_load: (dotlottie_instance_id: number) => void;
  observer_on_load_error: (dotlottie_instance_id: number) => void;
  observer_on_loop: (dotlottie_instance_id: number, loop_count: number) => void;
  observer_on_pause: (dotlottie_instance_id: number) => void;
  observer_on_play: (dotlottie_instance_id: number) => void;
  observer_on_render: (dotlottie_instance_id: number, frame_no: number) => void;
  observer_on_stop: (dotlottie_instance_id: number) => void;
  state_machine_observer_on_boolean_trigger_value_change: (
    dotlottie_instance_id: number,
    trigger_name: string,
    old_value: boolean,
    new_value: boolean,
  ) => void;
  state_machine_observer_on_custom_event: (dotlottie_instance_id: number, message: string) => void;
  state_machine_observer_on_error: (dotlottie_instance_id: number, message: string) => void;
  state_machine_observer_on_numeric_trigger_value_change: (
    dotlottie_instance_id: number,
    trigger_name: string,
    old_value: number,
    new_value: number,
  ) => void;
  state_machine_observer_on_start: (dotlottie_instance_id: number) => void;
  state_machine_observer_on_state_entered: (dotlottie_instance_id: number, entering_state: string) => void;
  state_machine_observer_on_state_exit: (dotlottie_instance_id: number, exiting_state: string) => void;
  state_machine_observer_on_stop: (dotlottie_instance_id: number) => void;
  state_machine_observer_on_string_trigger_value_change: (
    dotlottie_instance_id: number,
    trigger_name: string,
    old_value: string,
    new_value: string,
  ) => void;
  state_machine_observer_on_transition: (
    dotlottie_instance_id: number,
    previous_state: string,
    new_state: string,
  ) => void;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DotLottieWasmLoader {
  private static _ModulePromise: Promise<MainModule> | null = null;

  // URL for the WASM file, constructed using package information
  private static _wasmURL = `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/dotlottie-player.wasm`;

  private static _bridge: DotLottieBridge | null = null;

  private constructor() {
    throw new Error('RendererLoader is a static class and cannot be instantiated.');
  }

  private static async _tryLoad(url: string): Promise<MainModule> {
    const module = await createDotLottiePlayerModule({
      locateFile: () => url,
      // Pass the bridge to the module if it exists
      dotlottieBridge: this._bridge || undefined,
    });

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
        const backupUrl = `https://unpkg.com/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/dotlottie-player.wasm`;

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
   * Sets the callback bridge for the DotLottie player
   * @param bridge - The bridge object containing all callback implementations
   */
  public static setBridge(bridge: DotLottieBridge): void {
    this._bridge = bridge;
    // Invalidate current module promise to ensure next load uses new bridge
    this._ModulePromise = null;
  }

  /**
   * Public method to load the WebAssembly module.
   * @param bridge - Optional bridge object to set before loading
   * @returns Promise<Module> - A promise that resolves to the loaded module.
   */
  public static async load(bridge?: DotLottieBridge): Promise<MainModule> {
    if (bridge) {
      this.setBridge(bridge);
    }

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
