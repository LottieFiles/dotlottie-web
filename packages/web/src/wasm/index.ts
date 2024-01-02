/**
 * Copyright 2023 Design Barn Inc.
 */

export { default as createRendererModule } from './renderer';

// Interface describing the Renderer class
export interface Renderer {
  duration(): number;
  error(): string;
  frame(no: number): boolean;
  load(data: string, width: number, height: number): boolean;
  render(): Uint8ClampedArray;
  resize(width: number, height: number): void;
  setBgColor(color: number): void;
  size(): Float32Array;
  totalFrames(): number;
  update(): boolean;
}

// Interface representing the module structure with Renderer class
export interface Module {
  Renderer: new () => Renderer;
}
