/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable typescript-sort-keys/interface */
/* eslint-disable @typescript-eslint/no-namespace */
// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare namespace RuntimeExports {
  let HEAPF32: unknown;
  let HEAPF64: unknown;
  let HEAP8: unknown;
  let HEAPU8: unknown;
  let HEAP16: unknown;
  let HEAPU16: unknown;
  let HEAP32: unknown;
  let HEAPU32: unknown;
  let HEAP64: unknown;
  let HEAPU64: unknown;
  let HEAP_DATA_VIEW: unknown;
}
interface WasmModule {
  _free(_0: number): void;
  _malloc(_0: number): number;
}

type EmbindString = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  [Symbol.dispose](): void;
  clone(): this;
}
export interface VectorFloat extends ClassHandle {
  get(_0: number): number | undefined;
  size(): number;
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  set(_0: number, _1: number): boolean;
}

export interface VectorString extends ClassHandle {
  get(_0: number): EmbindString | undefined;
  size(): number;
  push_back(_0: EmbindString): void;
  resize(_0: number, _1: EmbindString): void;
  set(_0: number, _1: EmbindString): boolean;
}

export interface VectorMarker extends ClassHandle {
  get(_0: number): Marker | undefined;
  size(): number;
  push_back(_0: Marker): void;
  resize(_0: number, _1: Marker): void;
  set(_0: number, _1: Marker): boolean;
}

export interface VectorChar extends ClassHandle {
  get(_0: number): number | undefined;
  resize(_0: number, _1: number): void;
  size(): number;
  push_back(_0: number): void;
  set(_0: number, _1: number): boolean;
}

export interface ModeValue<T extends number> {
  value: T;
}
export type Mode = ModeValue<1> | ModeValue<2> | ModeValue<3> | ModeValue<4>;

export interface FitValue<T extends number> {
  value: T;
}
export type Fit = FitValue<1> | FitValue<3> | FitValue<2> | FitValue<4> | FitValue<5> | FitValue<6>;

export interface ColorSpaceValue<T extends number> {
  value: T;
}
export type ColorSpace = ColorSpaceValue<1> | ColorSpaceValue<2> | ColorSpaceValue<3> | ColorSpaceValue<4>;

export interface Layout {
  align: VectorFloat;
  fit: Fit;
}

export interface Observer extends ClassHandle {
  on_complete(): void;
  on_load_error(): void;
  on_play(): void;
  on_pause(): void;
  on_stop(): void;
  on_load(): void;
  on_loop(_0: number): void;
  on_frame(_0: number): void;
  on_render(_0: number): void;
}

export interface CallbackObserver extends Observer {
  setOnComplete(_0: unknown): void;
  setOnFrame(_0: unknown): void;
  setOnLoadError(_0: unknown): void;
  setOnPlay(_0: unknown): void;
  setOnPause(_0: unknown): void;
  setOnStop(_0: unknown): void;
  setOnLoad(_0: unknown): void;
  setOnRender(_0: unknown): void;
  setOnLoop(_0: unknown): void;
}

export interface StateMachineObserver extends ClassHandle {
  on_boolean_input_value_change(_0: EmbindString, _1: boolean, _2: boolean): void;
  on_stop(): void;
  on_transition(_0: EmbindString, _1: EmbindString): void;
  on_state_entered(_0: EmbindString): void;
  on_state_exit(_0: EmbindString): void;
  on_custom_event(_0: EmbindString): void;
  on_string_input_value_change(_0: EmbindString, _1: EmbindString, _2: EmbindString): void;
  on_numeric_input_value_change(_0: EmbindString, _1: number, _2: number): void;
  on_start(): void;
  on_input_fired(_0: EmbindString): void;
  on_error(_0: EmbindString): void;
}

export interface CallbackStateMachineObserver extends StateMachineObserver {
  setOnBooleanInputValueChange(_0: unknown): void;
  setOnStop(_0: unknown): void;
  setOnTransition(_0: unknown): void;
  setOnStateEntered(_0: unknown): void;
  setOnStateExit(_0: unknown): void;
  setOnCustomEvent(_0: unknown): void;
  setOnStringInputValueChange(_0: unknown): void;
  setOnNumericInputValueChange(_0: unknown): void;
  setOnStart(_0: unknown): void;
  setOnInputFired(_0: unknown): void;
  setOnError(_0: unknown): void;
}

export interface StateMachineInternalObserver extends ClassHandle {
  on_message(_0: EmbindString): void;
}

export interface CallbackStateMachineInternalObserver extends StateMachineInternalObserver {
  setOnMessage(_0: unknown): void;
}

export interface DotLottiePlayer extends ClassHandle {
  activeAnimationId(): string;
  animationSize(): VectorFloat;
  subscribe(_0: Observer | null): Observer | null;
  stateMachineFrameworkSetup(): VectorString;
  stateMachineGetInputs(): VectorString;
  getTransform(): VectorFloat;
  stateMachineSubscribe(_0: StateMachineObserver | null): StateMachineObserver | null;
  stateMachineInternalSubscribe(_0: StateMachineInternalObserver | null): StateMachineInternalObserver | null;
  unsubscribe(_0: Observer | null): void;
  stateMachineUnsubscribe(_0: StateMachineObserver | null): void;
  stateMachineInternalUnsubscribe(_0: StateMachineInternalObserver | null): void;
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
  stateMachineStart(_0: OpenUrlPolicy): boolean;
  stateMachineStop(): boolean;
  tick(): boolean;
  tweenStop(): boolean;
  isTweening(): boolean;
  setTransform(_0: VectorFloat): boolean;
  setQuality(_0: number): boolean;
  setViewport(_0: number, _1: number, _2: number, _3: number): boolean;
  loadDotLottieData(_0: VectorChar, _1: number, _2: number): boolean;
  loopCount(): number;
  resize(_0: number, _1: number): boolean;
  setSwTarget(_0: bigint, _1: number, _2: number, _3: number, _4: ColorSpace): boolean;
  setGlTarget(_0: bigint, _1: number, _2: number, _3: number, _4: ColorSpace): boolean;
  setWgTarget(_0: bigint, _1: bigint, _2: bigint, _3: number, _4: number, _5: ColorSpace, _6: number): boolean;
  tweenUpdate(_0?: number): boolean;
  currentFrame(): number;
  duration(): number;
  requestFrame(): number;
  setFrame(_0: number): boolean;
  seek(_0: number): boolean;
  totalFrames(): number;
  segmentDuration(): number;
  tween(_0: number, _1?: number, _2?: VectorFloat): boolean;
  stateMachinePostClickEvent(_0: number, _1: number): void;
  stateMachinePostPointerDownEvent(_0: number, _1: number): void;
  stateMachinePostPointerUpEvent(_0: number, _1: number): void;
  stateMachinePostPointerMoveEvent(_0: number, _1: number): void;
  stateMachinePostPointerEnterEvent(_0: number, _1: number): void;
  stateMachinePostPointerExitEvent(_0: number, _1: number): void;
  config(): Config;
  setConfig(_0: Config): void;
  loadAnimationData(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimationPath(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimation(_0: EmbindString, _1: number, _2: number): boolean;
  manifestString(): string;
  setTheme(_0: EmbindString): boolean;
  setThemeData(_0: EmbindString): boolean;
  setSlots(_0: EmbindString): boolean;
  markers(): VectorMarker;
  activeThemeId(): string;
  stateMachineSetBooleanInput(_0: EmbindString, _1: boolean): boolean;
  stateMachineLoadData(_0: EmbindString): boolean;
  stateMachineFireEvent(_0: EmbindString): void;
  stateMachineSetNumericInput(_0: EmbindString, _1: number): boolean;
  stateMachineSetStringInput(_0: EmbindString, _1: EmbindString): boolean;
  stateMachineLoad(_0: EmbindString): boolean;
  stateMachineGetNumericInput(_0: EmbindString): number;
  stateMachineGetStringInput(_0: EmbindString): string;
  stateMachineGetBooleanInput(_0: EmbindString): boolean;
  intersect(_0: number, _1: number, _2: EmbindString): boolean;
  getLayerBounds(_0: EmbindString): VectorFloat;
  tweenToMarker(_0: EmbindString, _1?: number, _2?: VectorFloat): boolean;
  getStateMachine(_0: EmbindString): string;
  activeStateMachineId(): string;
  stateMachineCurrentState(): string;
  stateMachineOverrideCurrentState(_0: EmbindString, _1: boolean): boolean;
  stateMachineStatus(): string;
}

export interface OpenUrlPolicy {
  requireUserInteraction: boolean;
  whitelist: VectorString;
}

export interface Marker {
  duration: number;
  time: number;
  name: EmbindString;
}

export interface Config {
  animationId: EmbindString;
  loopAnimation: boolean;
  loopCount: number;
  mode: Mode;
  speed: number;
  useFrameInterpolation: boolean;
  segment: VectorFloat;
  backgroundColor: number;
  layout: Layout;
  marker: EmbindString;
  themeId: EmbindString;
  stateMachineId: EmbindString;
  autoplay: boolean;
}

interface EmbindModule {
  CallbackObserver: {
    new (): CallbackObserver;
  };
  VectorString: {
    new (): VectorString;
  };
  VectorMarker: {
    new (): VectorMarker;
  };
  VectorChar: {
    new (): VectorChar;
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
  ColorSpace: {
    ABGR8888: ColorSpaceValue<1>;
    ABGR8888S: ColorSpaceValue<2>;
    ARGB8888: ColorSpaceValue<3>;
    ARGB8888S: ColorSpaceValue<4>;
  };
  createDefaultLayout(): Layout;
  Observer: {};
  VectorFloat: {
    new (): VectorFloat;
  };
  StateMachineObserver: {};
  CallbackStateMachineObserver: {
    new (): CallbackStateMachineObserver;
  };
  StateMachineInternalObserver: {};
  CallbackStateMachineInternalObserver: {
    new (): CallbackStateMachineInternalObserver;
  };
  createDefaultConfig(): Config;
  createDefaultOpenUrlPolicy(): OpenUrlPolicy;
  webgl_context_make_current(_0: number): number;
  is_webgl_context_lost(_0: number): boolean;
  webgl_context_destroy(_0: number): void;
  DotLottiePlayer: {
    new (_0: Config): DotLottiePlayer;
  };
  transformThemeToLottieSlots(_0: EmbindString, _1: EmbindString): string;
  registerFont(_0: EmbindString, _1: VectorChar): boolean;
  webgl_context_create(_0: EmbindString): number;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
