/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable typescript-sort-keys/interface */
// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
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

export interface VectorString {
  delete(): void;
  get(_0: number): ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string | undefined;
  push_back(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): void;
  resize(_0: number, _1: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): void;
  set(_0: number, _1: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
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
  animationSize(): VectorFloat;
  clear(): void;
  isLoaded(): boolean;
  isPaused(): boolean;
  isPlaying(): boolean;
  isStopped(): boolean;
  pause(): boolean;
  play(): boolean;
  render(): boolean;
  stop(): boolean;
  isComplete(): boolean;
  startStateMachine(): boolean;
  stopStateMachine(): boolean;
  setViewport(_0: number, _1: number, _2: number, _3: number): boolean;
  loopCount(): number;
  resize(_0: number, _1: number): boolean;
  currentFrame(): number;
  duration(): number;
  requestFrame(): number;
  setFrame(_0: number): boolean;
  seek(_0: number): boolean;
  totalFrames(): number;
  segmentDuration(): number;
  config(): Config;
  setConfig(_0: Config): void;
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
  loadAnimation(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string, _1: number, _2: number): boolean;
  manifestString(): string;
  loadTheme(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  loadThemeData(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  markers(): VectorMarker;
  setStateMachineBooleanContext(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: boolean,
  ): boolean;
  loadStateMachine(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  postEventPayload(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): number;
  setStateMachineNumericContext(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: number,
  ): boolean;
  setStateMachineStringContext(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
  ): boolean;
  stateMachineFrameworkSetup(): VectorString;
  loadStateMachineData(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  buffer(): unknown;
  delete(): void;
}

export interface Marker {
  duration: number;
  name: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
  time: number;
}

export interface Config {
  autoplay: boolean;
  backgroundColor: number;
  layout: Layout;
  loopAnimation: boolean;
  useFrameInterpolation: boolean;
  segment: VectorFloat;
  speed: number;
  mode: Mode;
  marker: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
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
  Mode: { Forward: ModeValue<1>; Reverse: ModeValue<2>; Bounce: ModeValue<3>; ReverseBounce: ModeValue<4> };
  VectorString: { new (): VectorString };
  VectorMarker: { new (): VectorMarker };
  createDefaultLayout(): Layout;
  VectorFloat: { new (): VectorFloat };
  createDefaultConfig(): Config;
}
export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
