/**
 * Copyright 2023 Design Barn Inc.
 */

import createRendererModule from './bin/renderer';

export interface Renderer {
  duration(): number;
  error(): string;
  frame(no: number): boolean;
  load(data: Int8Array, width: number, height: number): boolean;
  render(): Uint8Array;
  resize(width: number, height: number): void;
  size(): Float32Array;
  totalFrame(): number;
  update(): boolean;
}

export async function createRenderer(): Promise<Renderer> {
  const rendererModule = await createRendererModule();

  const renderer = new rendererModule.Renderer();

  return renderer;
}
