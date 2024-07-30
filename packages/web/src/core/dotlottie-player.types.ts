/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */
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
  loadStateMachine(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  loadStateMachineData(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  loadTheme(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  loadThemeData(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): boolean;
  loopCount(): number;
  manifestString(): string;
  markers(): VectorMarker;
  pause(): boolean;
  play(): boolean;
  postEventPayload(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string): number;
  render(): boolean;
  requestFrame(): number;
  resize(_0: number, _1: number): boolean;
  seek(_0: number): boolean;
  segmentDuration(): number;
  setConfig(_0: Config): void;
  setFrame(_0: number): boolean;
  setStateMachineBooleanContext(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: boolean,
  ): boolean;
  setStateMachineNumericContext(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: number,
  ): boolean;
  setStateMachineStringContext(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
  ): boolean;
  setViewport(_0: number, _1: number, _2: number, _3: number): boolean;
  startStateMachine(): boolean;
  stateMachineFrameworkSetup(): VectorString;
  stop(): boolean;
  stopStateMachine(): boolean;
  totalFrames(): number;
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
  marker: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
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
  VectorString: { new (): VectorString };
  createDefaultConfig(): Config;
  createDefaultLayout(): Layout;
}
export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
