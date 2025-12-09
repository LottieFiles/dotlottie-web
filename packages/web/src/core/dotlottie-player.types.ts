/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable typescript-sort-keys/interface */
/* eslint-disable @typescript-eslint/naming-convention */
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

export interface VectorGradientStop extends ClassHandle {
  get(_0: number): GradientStop | undefined;
  push_back(_0: GradientStop): void;
  resize(_0: number, _1: GradientStop): void;
  set(_0: number, _1: GradientStop): boolean;
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

export interface GlobalInputsObserver extends ClassHandle {
  on_boolean_global_input_value_change(_0: EmbindString, _1: boolean, _2: boolean): void;
  on_color_global_input_value_change(_0: EmbindString, _1: VectorFloat, _2: VectorFloat): void;
  on_gradient_global_input_value_change(_0: EmbindString, _1: VectorFloat, _2: VectorFloat): void;
  on_numeric_global_input_value_change(_0: EmbindString, _1: number, _2: number): void;
  on_string_global_input_value_change(_0: EmbindString, _1: EmbindString, _2: EmbindString): void;
  on_vector_global_input_value_change(_0: EmbindString, _1: VectorFloat, _2: VectorFloat): void;
}

export interface CallbackGlobalInputsObserver extends GlobalInputsObserver {
  setOnBooleanGlobalInputValueChange(_0: unknown): void;
  setOnColorGlobalInputValueChange(_0: unknown): void;
  setOnGradientGlobalInputValueChange(_0: unknown): void;
  setOnNumericGlobalInputValueChange(_0: unknown): void;
  setOnStringGlobalInputValueChange(_0: unknown): void;
  setOnVectorGlobalInputValueChange(_0: unknown): void;
}

export interface DotLottiePlayer extends ClassHandle {
  activeAnimationId(): string;
  activeStateMachineId(): string;
  activeThemeId(): string;
  animationSize(): VectorFloat;
  buffer(): unknown;
  clear(): void;
  config(): Config;
  currentFrame(): number;
  duration(): number;
  getLayerBounds(_0: EmbindString): VectorFloat;
  getStateMachine(_0: EmbindString): string;
  getTransform(): VectorFloat;
  globalInputsApply(): boolean;
  globalInputsUnsubscribe(_0: GlobalInputsObserver | null): void;
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
  stateMachineInternalUnsubscribe(_0: StateMachineInternalObserver | null): void;
  globalInputsRemove(): boolean;
  setQuality(_0: number): boolean;
  setViewport(_0: number, _1: number, _2: number, _3: number): boolean;
  stateMachineInternalSubscribe(_0: StateMachineInternalObserver | null): StateMachineInternalObserver | null;
  loopCount(): number;
  resize(_0: number, _1: number): boolean;
  tweenUpdate(_0?: number): boolean;
  loadDotLottieData(_0: VectorChar, _1: number, _2: number): boolean;
  globalInputsSubscribe(_0: GlobalInputsObserver | null): GlobalInputsObserver | null;
  requestFrame(): number;
  markers(): VectorMarker;
  seek(_0: number): boolean;
  totalFrames(): number;
  tweenToMarker(_0: EmbindString, _1?: number, _2?: VectorFloat): boolean;
  tween(_0: number, _1?: number, _2?: VectorFloat): boolean;
  stateMachinePostClickEvent(_0: number, _1: number): void;
  stateMachinePostPointerDownEvent(_0: number, _1: number): void;
  stateMachinePostPointerUpEvent(_0: number, _1: number): void;
  segmentDuration(): number;
  setConfig(_0: Config): void;
  stateMachinePostPointerExitEvent(_0: number, _1: number): void;
  stateMachineSubscribe(_0: StateMachineObserver | null): StateMachineObserver | null;
  setSlots(_0: EmbindString): boolean;
  loadAnimationData(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimationPath(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimation(_0: EmbindString, _1: number, _2: number): boolean;
  manifestString(): string;
  setTheme(_0: EmbindString): boolean;
  setThemeData(_0: EmbindString): boolean;
  stateMachinePostPointerEnterEvent(_0: number, _1: number): void;
  stateMachineGetBooleanInput(_0: EmbindString): boolean;
  subscribe(_0: Observer | null): Observer | null;
  stateMachineGetNumericInput(_0: EmbindString): number;
  stateMachineGetStringInput(_0: EmbindString): string;
  stateMachineFireEvent(_0: EmbindString): void;
  stateMachineSetNumericInput(_0: EmbindString, _1: number): boolean;
  stateMachineLoad(_0: EmbindString): boolean;
  stateMachineSetBooleanInput(_0: EmbindString, _1: boolean): boolean;
  stateMachineSetStringInput(_0: EmbindString, _1: EmbindString): boolean;
  stateMachineLoadData(_0: EmbindString): boolean;
  setFrame(_0: number): boolean;
  intersect(_0: number, _1: number, _2: EmbindString): boolean;
  stateMachineUnsubscribe(_0: StateMachineObserver | null): void;
  stateMachinePostPointerMoveEvent(_0: number, _1: number): void;
  unsubscribe(_0: Observer | null): void;
  stateMachineFrameworkSetup(): VectorString;
  stateMachineCurrentState(): string;
  stateMachineOverrideCurrentState(_0: EmbindString, _1: boolean): boolean;
  stateMachineStatus(): string;
  globalInputsLoad(_0: EmbindString): boolean;
  globalInputsLoadData(_0: EmbindString): boolean;
  globalInputsSetString(_0: EmbindString, _1: EmbindString): boolean;
  globalInputsSetColor(_0: EmbindString, _1: VectorFloat): boolean;
  globalInputsSetVector(_0: EmbindString, _1: VectorFloat): boolean;
  globalInputsSetNumeric(_0: EmbindString, _1: number): boolean;
  globalInputsSetBoolean(_0: EmbindString, _1: boolean): boolean;
  globalInputsSetGradient(_0: EmbindString, _1: VectorGradientStop): boolean;
  globalInputsGetString(_0: EmbindString): EmbindString | undefined;
  globalInputsGetColor(_0: EmbindString): VectorFloat;
  globalInputsGetVector(_0: EmbindString): VectorFloat;
  globalInputsGetNumeric(_0: EmbindString): number | undefined;
  globalInputsGetGradient(_0: EmbindString): VectorGradientStop;
  stateMachineGetInputs(): VectorString;
}

export interface OpenUrlPolicy {
  requireUserInteraction: boolean;
  whitelist: VectorString;
}

export interface GradientStop {
  color: VectorFloat;
  offset: number;
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
  CallbackGlobalInputsObserver: {
    new (): CallbackGlobalInputsObserver;
  };
  CallbackObserver: {
    new (): CallbackObserver;
  };
  CallbackStateMachineInternalObserver: {
    new (): CallbackStateMachineInternalObserver;
  };
  CallbackStateMachineObserver: {
    new (): CallbackStateMachineObserver;
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
  GlobalInputsObserver: {};
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
  VectorGradientStop: {
    new (): VectorGradientStop;
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
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
