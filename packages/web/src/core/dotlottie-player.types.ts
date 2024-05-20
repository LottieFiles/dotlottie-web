/**
 * Copyright 2024 Design Barn Inc.
 */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */

declare namespace RuntimeExports {
  let HEAPF64: unknown;
  let HEAP_DATA_VIEW: unknown;
  let HEAP8: unknown;
  let HEAPU8: unknown;
  let HEAP16: unknown;
  let HEAPU16: unknown;
  let HEAP32: unknown;
  let HEAPU32: unknown;
  let HEAP64: unknown;
  let HEAPU64: unknown;
}
interface WasmModule {}

export interface VectorFloat {
  delete(): void;
  get(_0: number): number | undefined;
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  set(_0: number, _1: number): boolean;
  size(): number;
}

export interface VectorMarker {
  delete(): void;
  get(_0: number): Marker | undefined;
  push_back(_0: Marker): void;
  resize(_0: number, _1: Marker): void;
  set(_0: number, _1: Marker): boolean;
  size(): number;
}

export interface ModeValue<T extends number> {
  value: T;
}
export type Mode = ModeValue<1> | ModeValue<2> | ModeValue<3> | ModeValue<4>;

export interface FitValue<T extends number> {
  value: T;
}
export type Fit = FitValue<1> | FitValue<3> | FitValue<2> | FitValue<4> | FitValue<5> | FitValue<6>;

export interface Layout {
  align: VectorFloat;
  fit: Fit;
}

export interface DotLottiePlayer {
  activeAnimationId(): string;
  activeThemeId(): string;
  buffer(): unknown;
  clear(): void;
  config(): Config;
  currentFrame(): number;
  delete(): void;
  duration(): number;
  isComplete(): boolean;
  isLoaded(): boolean;
  isPaused(): boolean;
  isPlaying(): boolean;
  isStopped(): boolean;
  loadAnimation(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string, _1: number, _2: number): boolean;
  loadAnimationData(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: number,
    _2: number,
  ): boolean;
  loadAnimationPath(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: number,
    _2: number,
  ): boolean;
  loadDotLottieData(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: number,
    _2: number,
  ): boolean;
  loadTheme(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  loadThemeData(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  loopCount(): number;
  manifestString(): string;
  markers(): VectorMarker;
  pause(): boolean;
  play(): boolean;
  render(): boolean;
  requestFrame(): number;
  resize(_0: number, _1: number): boolean;
  seek(_0: number): boolean;
  setConfig(_0: Config): void;
  setFrame(_0: number): boolean;
  stop(): boolean;
  totalFrames(): number;
}

export interface Marker {
  duration: number;
  name: string;
  time: number;
}

export interface Config {
  autoplay: boolean;
  backgroundColor: number;
  layout: Layout;
  loopAnimation: boolean;
  marker: string;
  mode: Mode;
  segment: VectorFloat;
  speed: number;
  useFrameInterpolation: boolean;
}

interface EmbindModule {
  DotLottiePlayer: { new (_0: Config): DotLottiePlayer };
  Fit: {
    Contain: FitValue<1>;
    Cover: FitValue<3>;
    Fill: FitValue<2>;
    FitHeight: FitValue<5>;
    FitWidth: FitValue<4>;
    None: FitValue<6>;
  };
  Mode: { Bounce: ModeValue<3>; Forward: ModeValue<1>; Reverse: ModeValue<2>; ReverseBounce: ModeValue<4> };
  VectorFloat: { new (): VectorFloat };
  VectorMarker: { new (): VectorMarker };
  createDefaultConfig(): Config;
  createDefaultLayout(): Layout;
}
export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
