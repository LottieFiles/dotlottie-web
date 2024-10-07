/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-namespace */
// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
  let HEAPF32: unknown;
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

type EmbindString = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
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
  get(_0: number): EmbindString | undefined;
  push_back(_0: EmbindString): void;
  resize(_0: number, _1: EmbindString): void;
  set(_0: number, _1: EmbindString): boolean;
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
  getLayerBounds(_0: EmbindString): VectorFloat;
  isComplete(): boolean;
  isLoaded(): boolean;
  isPaused(): boolean;
  isPlaying(): boolean;
  isStopped(): boolean;
  loadAnimation(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimationData(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimationPath(_0: EmbindString, _1: number, _2: number): boolean;
  loadDotLottieData(_0: EmbindString, _1: number, _2: number): boolean;
  loadStateMachine(_0: EmbindString): boolean;
  loadStateMachineData(_0: EmbindString): boolean;
  loadTheme(_0: EmbindString): boolean;
  loadThemeData(_0: EmbindString): boolean;
  loopCount(): number;
  manifestString(): string;
  markers(): VectorMarker;
  pause(): boolean;
  play(): boolean;
  postBoolEvent(_0: boolean): number;
  postNumericEvent(_0: number): number;
  postPointerDownEvent(_0: number, _1: number): number;
  postPointerEnterEvent(_0: number, _1: number): number;
  postPointerExitEvent(_0: number, _1: number): number;
  postPointerMoveEvent(_0: number, _1: number): number;
  postPointerUpEvent(_0: number, _1: number): number;
  postSetNumericContext(_0: EmbindString, _1: number): number;
  postStringEvent(_0: EmbindString): number;
  render(): boolean;
  requestFrame(): number;
  resize(_0: number, _1: number): boolean;
  seek(_0: number): boolean;
  segmentDuration(): number;
  setConfig(_0: Config): void;
  setFrame(_0: number): boolean;
  setStateMachineBooleanContext(_0: EmbindString, _1: boolean): boolean;
  setStateMachineNumericContext(_0: EmbindString, _1: number): boolean;
  setStateMachineStringContext(_0: EmbindString, _1: EmbindString): boolean;
  setViewport(_0: number, _1: number, _2: number, _3: number): boolean;
  startStateMachine(): boolean;
  stateMachineFrameworkSetup(): VectorString;
  stop(): boolean;
  stopStateMachine(): boolean;
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
  marker: EmbindString;
  mode: Mode;
  segment: VectorFloat;
  speed: number;
  useFrameInterpolation: boolean;
}

interface EmbindModule {
  DotLottiePlayer: {
    new (_0: Config): DotLottiePlayer;
  };
  Fit: {
    Contain: FitValue<1>;
    Cover: FitValue<3>;
    Fill: FitValue<2>;
    FitHeight: FitValue<5>;
    FitWidth: FitValue<4>;
    None: FitValue<6>;
  };
  Mode: { Bounce: ModeValue<3>; Forward: ModeValue<1>; Reverse: ModeValue<2>; ReverseBounce: ModeValue<4> };
  VectorFloat: {
    new (): VectorFloat;
  };
  VectorMarker: {
    new (): VectorMarker;
  };
  VectorString: {
    new (): VectorString;
  };
  createDefaultConfig(): Config;
  createDefaultLayout(): Layout;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
