/**
 * Copyright 2023 Design Barn Inc.
 */

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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static _Renderer: (new () => Renderer) | null = null;

  private static _wasmURL = `https://unpkg.com/${pkg.name}@${pkg.version}/dist/renderer.wasm`;

  private constructor() {
    throw new Error('WasmLoader is a static class and cannot be instantiated.');
  }

  private static async _tryLoad(url: string): Promise<new () => Renderer> {
    try {
      const module = await createRendererModule({ locateFile: () => url });

      return module.Renderer;
    } catch (error) {
      console.warn(`Attempt to load WASM from ${url} failed. Error: ${(error as Error).message}`);

      throw error;
    }
  }

  private static async _loadWithBackup(): Promise<new () => Renderer> {
    try {
      return await this._tryLoad(this._wasmURL);
    } catch (initialError) {
      const backupUrl = `https://cdn.jsdelivr.net/npm/${pkg.name}@${pkg.version}/dist/renderer.wasm`;

      console.warn(`Trying backup URL for WASM loading: ${backupUrl}`);
      try {
        return await this._tryLoad(backupUrl);
      } catch (backupError) {
        console.error(
          `Both primary and backup WASM URLs failed. Primary error: ${(initialError as Error).message}, Backup error: ${
            (backupError as Error).message
          }`,
        );
        throw new Error('WASM loading failed from all sources.');
      }
    }
  }

  public static async getInstance(): Promise<Renderer> {
    if (!this._Renderer) {
      try {
        this._Renderer = await this._loadWithBackup();
      } catch (error) {
        throw new Error(`WASM Renderer instantiation failed: ${(error as Error).message}`);
      }
    }

    return new this._Renderer();
  }

  public static setWasmUrl(url: string): void {
    this._wasmURL = url;
  }
}
