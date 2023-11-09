/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable no-negated-condition */
/* eslint-disable no-console */

import pkg from '../../package.json';

import createRendererModule from './bin/renderer';

export interface Renderer {
  duration(): number;
  error(): string;
  frame(no: number): boolean;
  load(data: string, width: number, height: number): boolean;
  render(): Uint8Array;
  resize(width: number, height: number): void;
  size(): Float32Array;
  totalFrames(): number;
  update(): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class WasmLoader {
  private static _renderer: Renderer | null = null;

  private static _isLoading = false;

  private static _wasmURL = `https://unpkg.com/${pkg.name}@${pkg.version}/dist/renderer.wasm`;

  private constructor() {
    // Class is never instantiated
  }

  public static loadRenderer(): void {
    createRendererModule({
      locateFile: () => WasmLoader._wasmURL,
    })
      .then((module: { Renderer: new () => Renderer }) => {
        WasmLoader._renderer = new module.Renderer();
      })
      .catch(() => {
        const backupJsdelivrUrl = `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/dist/renderer.wasm`;

        if (WasmLoader._wasmURL.toLowerCase() !== backupJsdelivrUrl) {
          console.warn(`Failed to load WASM from ${WasmLoader._wasmURL}, trying jsdelivr as a backup`);
          WasmLoader.setWasmUrl(backupJsdelivrUrl);
          WasmLoader.loadRenderer();
        } else {
          console.error(
            `Could not load Rive WASM file from unpkg or jsdelivr, network connection may be down, or \
        you may need to call set a new WASM source via WasmLoader.setWasmUrl() and call \
        WasmLoader.loadRenderer() again`,
          );
        }
      });
  }

  public static getInstance(callback: (renderer: Renderer) => void): void {
    if (!WasmLoader._isLoading) {
      WasmLoader._isLoading = true;
      WasmLoader.loadRenderer();
    }

    if (WasmLoader._renderer) {
      // eslint-disable-next-line node/callback-return
      callback(WasmLoader._renderer);
    } else {
      setTimeout(() => WasmLoader.getInstance(callback), 100);
    }
  }

  public static async awaitInstance(): Promise<Renderer> {
    return new Promise<Renderer>((resolve) => WasmLoader.getInstance((renderer: Renderer): void => resolve(renderer)));
  }

  public static setWasmUrl(url: string): void {
    WasmLoader._wasmURL = url;
  }
}
