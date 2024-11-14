/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable typescript-sort-keys/interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace RuntimeExports {
  let HEAPF32: any;
  let HEAPF64: any;
  let HEAP_DATA_VIEW: any;
  let HEAP8: any;
  let HEAPU8: any;
  let HEAP16: any;
  let HEAPU16: any;
  let HEAP32: any;
  let HEAPU32: any;
  let HEAP64: any;
  let HEAPU64: any;
}
interface WasmModule {}

type EmbindString = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
export interface VectorFloat {
  size(): number;
  get(_0: number): number | undefined;
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  set(_0: number, _1: number): boolean;
  delete(): void;
}

export interface VectorMarker {
  size(): number;
  get(_0: number): Marker | undefined;
  push_back(_0: Marker): void;
  resize(_0: number, _1: Marker): void;
  set(_0: number, _1: Marker): boolean;
  delete(): void;
}

export interface VectorString {
  size(): number;
  get(_0: number): EmbindString | undefined;
  push_back(_0: EmbindString): void;
  resize(_0: number, _1: EmbindString): void;
  set(_0: number, _1: EmbindString): boolean;
  delete(): void;
}

export interface ModeValue<T extends number> {
  value: T;
}
export type Mode = ModeValue<1> | ModeValue<2> | ModeValue<3> | ModeValue<4>;

export interface FitValue<T extends number> {
  value: T;
}
export type Fit = FitValue<1> | FitValue<3> | FitValue<2> | FitValue<4> | FitValue<5> | FitValue<6>;

export type Layout = {
  fit: Fit;
  align: VectorFloat;
};

export interface DotLottiePlayer {
  markers(): VectorMarker;
  animationSize(): VectorFloat;
  stateMachineFrameworkSetup(): VectorString;
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
  stateMachineStart(): boolean;
  stateMachineStop(): boolean;
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
  stateMachinePostPointerDownEvent(_0: number, _1: number): number;
  stateMachinePostPointerUpEvent(_0: number, _1: number): number;
  stateMachinePostPointerMoveEvent(_0: number, _1: number): number;
  stateMachinePostPointerEnterEvent(_0: number, _1: number): number;
  stateMachinePostPointerExitEvent(_0: number, _1: number): number;
  config(): Config;
  setConfig(_0: Config): void;
  loadAnimationData(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimationPath(_0: EmbindString, _1: number, _2: number): boolean;
  loadDotLottieData(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimation(_0: EmbindString, _1: number, _2: number): boolean;
  manifestString(): string;
  loadTheme(_0: EmbindString): boolean;
  loadThemeData(_0: EmbindString): boolean;
  activeAnimationId(): string;
  activeThemeId(): string;
  stateMachineLoad(_0: EmbindString): boolean;
  stateMachineLoadData(_0: EmbindString): boolean;
  stateMachineFireEvent(_0: EmbindString): void;
  stateMachineSetNumericTrigger(_0: EmbindString, _1: number): boolean;
  stateMachineSetStringTrigger(_0: EmbindString, _1: EmbindString): boolean;
  stateMachineSetBooleanTrigger(_0: EmbindString, _1: boolean): boolean;
  getLayerBounds(_0: EmbindString): VectorFloat;
  buffer(): any;
  delete(): void;
}

export type Marker = {
  name: EmbindString;
  time: number;
  duration: number;
};

export type Config = {
  autoplay: boolean;
  loopAnimation: boolean;
  mode: Mode;
  speed: number;
  useFrameInterpolation: boolean;
  segment: VectorFloat;
  backgroundColor: number;
  layout: Layout;
  marker: EmbindString;
};

interface EmbindModule {
  VectorFloat: {
    new (): VectorFloat;
  };
  VectorMarker: {
    new (): VectorMarker;
  };
  VectorString: {
    new (): VectorString;
  };
  Mode: { Forward: ModeValue<1>; Reverse: ModeValue<2>; Bounce: ModeValue<3>; ReverseBounce: ModeValue<4> };
  Fit: {
    Contain: FitValue<1>;
    Cover: FitValue<3>;
    Fill: FitValue<2>;
    FitWidth: FitValue<4>;
    FitHeight: FitValue<5>;
    None: FitValue<6>;
  };
  createDefaultLayout(): Layout;
  DotLottiePlayer: {
    new (_0: Config): DotLottiePlayer;
  };
  createDefaultConfig(): Config;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
