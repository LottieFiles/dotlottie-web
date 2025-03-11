/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable typescript-sort-keys/interface */
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
export interface ClassHandle {
  clone(): this;
  delete(): void;
  deleteLater(): this;
  isAliasOf(other: ClassHandle): boolean;
  isDeleted(): boolean;
}
export interface VectorFloat extends ClassHandle {
  get(_0: number): number | undefined;
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  set(_0: number, _1: number): boolean;
  size(): number;
}

export interface VectorMarker extends ClassHandle {
  get(_0: number): Marker | undefined;
  push_back(_0: Marker): void;
  resize(_0: number, _1: Marker): void;
  set(_0: number, _1: Marker): boolean;
  size(): number;
}

export interface VectorString extends ClassHandle {
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

export interface OpenUrlModeValue<T extends number> {
  value: T;
}
export type OpenUrlMode = OpenUrlModeValue<1> | OpenUrlModeValue<2> | OpenUrlModeValue<3>;

export interface OpenUrl {
  mode: OpenUrlMode;
  whitelist: VectorString;
}

export interface DotLottiePlayer extends ClassHandle {
  activeAnimationId(): string;
  activeStateMachineId(): string;
  activeThemeId(): string;
  animationSize(): VectorFloat;
  isLoaded(): boolean;
  isPaused(): boolean;
  isPlaying(): boolean;
  isStopped(): boolean;
  pause(): boolean;
  play(): boolean;
  render(): boolean;
  stop(): boolean;
  isComplete(): boolean;
  resetTheme(): boolean;
  stateMachineStart(_0: OpenUrl): boolean;
  stateMachineStop(): boolean;
  tick(): boolean;
  tweenStop(): boolean;
  isTweening(): boolean;
  setViewport(_0: number, _1: number, _2: number, _3: number): boolean;
  loopCount(): number;
  resize(_0: number, _1: number): boolean;
  instanceId(): number;
  tweenUpdate(_0?: number): boolean;
  currentFrame(): number;
  duration(): number;
  requestFrame(): number;
  setFrame(_0: number): boolean;
  seek(_0: number): boolean;
  totalFrames(): number;
  segmentDuration(): number;
  tween(_0: number, _1?: number, _2?: VectorFloat): boolean;
  stateMachinePostClickEvent(_0: number, _1: number): number;
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
  setTheme(_0: EmbindString): boolean;
  setThemeData(_0: EmbindString): boolean;
  setSlots(_0: EmbindString): boolean;
  markers(): VectorMarker;
  stateMachineFrameworkSetup(): VectorString;
  stateMachineLoad(_0: EmbindString): boolean;
  stateMachineLoadData(_0: EmbindString): boolean;
  stateMachineFireEvent(_0: EmbindString): void;
  stateMachineSetNumericInput(_0: EmbindString, _1: number): boolean;
  stateMachineSetBooleanInput(_0: EmbindString, _1: boolean): boolean;
  stateMachineSetStringInput(_0: EmbindString, _1: EmbindString): boolean;
  stateMachineGetNumericInput(_0: EmbindString): number;
  stateMachineGetStringInput(_0: EmbindString): string;
  stateMachineGetBooleanInput(_0: EmbindString): boolean;
  getLayerBounds(_0: EmbindString): VectorFloat;
  tweenToMarker(_0: EmbindString, _1?: number, _2?: VectorFloat): boolean;
  getStateMachine(_0: EmbindString): string;
  clear(): void;
  stateMachineCurrentState(): string;
  stateMachineOverrideCurrentState(_0: EmbindString, _1: boolean): boolean;
  stateMachineStatus(): string;
  buffer(): unknown;
}

export interface Marker {
  duration: number;
  name: EmbindString;
  time: number;
}

export interface Config {
  autoplay: boolean;
  backgroundColor: number;
  layout: Layout;
  loopAnimation: boolean;
  marker: EmbindString;
  segment: VectorFloat;
  speed: number;
  mode: Mode;
  stateMachineId: EmbindString;
  themeId: EmbindString;
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
  Mode: { Bounce: ModeValue<3>; Reverse: ModeValue<2>; Forward: ModeValue<1>; ReverseBounce: ModeValue<4> };
  OpenUrlMode: { Allow: OpenUrlModeValue<3>; Interaction: OpenUrlModeValue<2>; Deny: OpenUrlModeValue<1> };
  VectorFloat: {
    new (): VectorFloat;
  };
  createDefaultLayout(): Layout;
  VectorString: {
    new (): VectorString;
  };
  createDefaultOpenURL(): OpenUrl;
  VectorMarker: {
    new (): VectorMarker;
  };
  createDefaultConfig(): Config;
  transformThemeToLottieSlots(_0: EmbindString, _1: EmbindString): string;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
