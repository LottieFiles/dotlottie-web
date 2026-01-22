/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable typescript-sort-keys/interface */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
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
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  set(_0: number, _1: number): boolean;
  size(): number;
}

export interface VectorString extends ClassHandle {
  get(_0: number): EmbindString | undefined;
  push_back(_0: EmbindString): void;
  resize(_0: number, _1: EmbindString): void;
  set(_0: number, _1: EmbindString): boolean;
  size(): number;
}

export interface VectorMarker extends ClassHandle {
  get(_0: number): Marker | undefined;
  push_back(_0: Marker): void;
  resize(_0: number, _1: Marker): void;
  set(_0: number, _1: Marker): boolean;
  size(): number;
}

export interface VectorChar extends ClassHandle {
  get(_0: number): number | undefined;
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  set(_0: number, _1: number): boolean;
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
  on_frame(_0: number): void;
  on_load(): void;
  on_load_error(): void;
  on_loop(_0: number): void;
  on_pause(): void;
  on_play(): void;
  on_render(_0: number): void;
  on_stop(): void;
}

export interface CallbackObserver extends Observer {
  setOnComplete(_0: unknown): void;
  setOnFrame(_0: unknown): void;
  setOnLoad(_0: unknown): void;
  setOnLoadError(_0: unknown): void;
  setOnLoop(_0: unknown): void;
  setOnPause(_0: unknown): void;
  setOnPlay(_0: unknown): void;
  setOnRender(_0: unknown): void;
  setOnStop(_0: unknown): void;
}

export interface StateMachineObserver extends ClassHandle {
  on_boolean_input_value_change(_0: EmbindString, _1: boolean, _2: boolean): void;
  on_custom_event(_0: EmbindString): void;
  on_error(_0: EmbindString): void;
  on_input_fired(_0: EmbindString): void;
  on_numeric_input_value_change(_0: EmbindString, _1: number, _2: number): void;
  on_start(): void;
  on_state_entered(_0: EmbindString): void;
  on_state_exit(_0: EmbindString): void;
  on_stop(): void;
  on_string_input_value_change(_0: EmbindString, _1: EmbindString, _2: EmbindString): void;
  on_transition(_0: EmbindString, _1: EmbindString): void;
}

export interface CallbackStateMachineObserver extends StateMachineObserver {
  setOnBooleanInputValueChange(_0: unknown): void;
  setOnCustomEvent(_0: unknown): void;
  setOnError(_0: unknown): void;
  setOnInputFired(_0: unknown): void;
  setOnNumericInputValueChange(_0: unknown): void;
  setOnStart(_0: unknown): void;
  setOnStateEntered(_0: unknown): void;
  setOnStateExit(_0: unknown): void;
  setOnStop(_0: unknown): void;
  setOnStringInputValueChange(_0: unknown): void;
  setOnTransition(_0: unknown): void;
}

export interface StateMachineInternalObserver extends ClassHandle {
  on_message(_0: EmbindString): void;
}

export interface CallbackStateMachineInternalObserver extends StateMachineInternalObserver {
  setOnMessage(_0: unknown): void;
}

export interface DotLottiePlayer extends ClassHandle {
  activeAnimationId(): string;
  activeStateMachineId(): string;
  activeThemeId(): string;
  animationSize(): VectorFloat;
  config(): Config;
  currentFrame(): number;
  duration(): number;
  getLayerBounds(_0: EmbindString): VectorFloat;
  getStateMachine(_0: EmbindString): string;
  getTransform(): VectorFloat;
  intersect(_0: number, _1: number, _2: EmbindString): boolean;
  isComplete(): boolean;
  isLoaded(): boolean;
  isPaused(): boolean;
  isPlaying(): boolean;
  isStopped(): boolean;
  isTweening(): boolean;
  loadAnimation(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimationData(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimationPath(_0: EmbindString, _1: number, _2: number): boolean;
  loadDotLottieData(_0: VectorChar, _1: number, _2: number): boolean;
  loopCount(): number;
  manifestString(): string;
  markers(): VectorMarker;
  pause(): boolean;
  play(): boolean;
  render(): boolean;
  requestFrame(): number;
  resetTheme(): boolean;
  resize(_0: number, _1: number): boolean;
  seek(_0: number): boolean;
  segmentDuration(): number;
  setConfig(_0: Config): void;
  setFrame(_0: number): boolean;
  setGlTarget(_0: bigint, _1: number, _2: number, _3: number, _4: ColorSpace): boolean;
  setQuality(_0: number): boolean;
  setSlots(_0: EmbindString): boolean;
  setSwTarget(_0: bigint, _1: number, _2: number, _3: number, _4: ColorSpace): boolean;
  setTheme(_0: EmbindString): boolean;
  setThemeData(_0: EmbindString): boolean;
  setTransform(_0: VectorFloat): boolean;
  setViewport(_0: number, _1: number, _2: number, _3: number): boolean;
  setWgTarget(_0: bigint, _1: bigint, _2: bigint, _3: number, _4: number, _5: ColorSpace, _6: number): boolean;
  stateMachineCurrentState(): string;
  stateMachineFireEvent(_0: EmbindString): void;
  stateMachineFrameworkSetup(): VectorString;
  stateMachineGetBooleanInput(_0: EmbindString): boolean;
  stateMachineGetInputs(): VectorString;
  stateMachineGetNumericInput(_0: EmbindString): number;
  stateMachineGetStringInput(_0: EmbindString): string;
  stateMachineInternalSubscribe(_0: StateMachineInternalObserver | null): StateMachineInternalObserver | null;
  stateMachineInternalUnsubscribe(_0: StateMachineInternalObserver | null): void;
  stateMachineLoad(_0: EmbindString): boolean;
  stateMachineLoadData(_0: EmbindString): boolean;
  stateMachineOverrideCurrentState(_0: EmbindString, _1: boolean): boolean;
  stateMachinePostClickEvent(_0: number, _1: number): void;
  stateMachinePostPointerDownEvent(_0: number, _1: number): void;
  stateMachinePostPointerEnterEvent(_0: number, _1: number): void;
  stateMachinePostPointerExitEvent(_0: number, _1: number): void;
  stateMachinePostPointerMoveEvent(_0: number, _1: number): void;
  stateMachinePostPointerUpEvent(_0: number, _1: number): void;
  stateMachineSetBooleanInput(_0: EmbindString, _1: boolean): boolean;
  stateMachineSetNumericInput(_0: EmbindString, _1: number): boolean;
  stateMachineSetStringInput(_0: EmbindString, _1: EmbindString): boolean;
  stateMachineStart(_0: OpenUrlPolicy): boolean;
  stateMachineStatus(): string;
  stateMachineStop(): boolean;
  stateMachineSubscribe(_0: StateMachineObserver | null): StateMachineObserver | null;
  stateMachineUnsubscribe(_0: StateMachineObserver | null): void;
  totalFrames(): number;
  subscribe(_0: Observer | null): Observer | null;
  tick(): boolean;
  tweenToMarker(_0: EmbindString, _1?: number, _2?: VectorFloat): boolean;
  tween(_0: number, _1?: number, _2?: VectorFloat): boolean;
  tweenStop(): boolean;
  unsubscribe(_0: Observer | null): void;
  tweenUpdate(_0?: number): boolean;
  stop(): boolean;
}

export interface OpenUrlPolicy {
  requireUserInteraction: boolean;
  whitelist: VectorString;
}

export interface Marker {
  duration: number;
  name: EmbindString;
  time: number;
}

export interface Config {
  animationId: EmbindString;
  autoplay: boolean;
  backgroundColor: number;
  layout: Layout;
  loopAnimation: boolean;
  loopCount: number;
  marker: EmbindString;
  mode: Mode;
  segment: VectorFloat;
  speed: number;
  stateMachineId: EmbindString;
  themeId: EmbindString;
  useFrameInterpolation: boolean;
}

interface EmbindModule {
  CallbackObserver: {
    new (): CallbackObserver;
  };
  CallbackStateMachineInternalObserver: {
    new (): CallbackStateMachineInternalObserver;
  };
  CallbackStateMachineObserver: {
    new (): CallbackStateMachineObserver;
  };
  ColorSpace: {
    ABGR8888: ColorSpaceValue<1>;
    ABGR8888S: ColorSpaceValue<2>;
    ARGB8888: ColorSpaceValue<3>;
    ARGB8888S: ColorSpaceValue<4>;
  };
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
  Observer: {};
  StateMachineInternalObserver: {};
  StateMachineObserver: {};
  VectorChar: {
    new (): VectorChar;
  };
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
  createDefaultOpenUrlPolicy(): OpenUrlPolicy;
  registerFont(_0: EmbindString, _1: VectorChar): boolean;
  transformThemeToLottieSlots(_0: EmbindString, _1: EmbindString): string;
  webgpu_cleanup(): void;
  webgpu_get_adapter(): number;
  webgpu_get_device(): number;
  webgpu_get_instance(): number;
  webgpu_get_surface(_0: EmbindString): number;
  webgpu_request_adapter(): number;
  webgpu_request_device(): number;
  wgpu_adapter_release(_0: number): void;
  wgpu_device_release(_0: number): void;
  wgpu_instance_release(_0: number): void;
  wgpu_surface_release(_0: number): void;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
