/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable typescript-sort-keys/interface */
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

export interface ObserverWrapper extends Observer {
  notifyOnDestruction(): void;
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

export interface StateMachineObserverWrapper extends StateMachineObserver {
  notifyOnDestruction(): void;
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
  stateMachineFrameworkSubscribe(_0: StateMachineObserver | null): boolean;
  stateMachineFrameworkUnsubscribe(_0: StateMachineObserver | null): boolean;
  setViewport(_0: number, _1: number, _2: number, _3: number): boolean;
  loopCount(): number;
  resize(_0: number, _1: number): boolean;
  instanceId(): number;
  tweenUpdate(_0?: number): boolean;
  stateMachineUnsubscribe(_0: StateMachineObserver | null): void;
  isLoaded(): boolean;
  seek(_0: number): boolean;
  segmentDuration(): number;
  requestFrame(): number;
  totalFrames(): number;
  setSlots(_0: EmbindString): boolean;
  tween(_0: number, _1?: number, _2?: VectorFloat): boolean;
  stateMachinePostClickEvent(_0: number, _1: number): number;
  stateMachinePostPointerDownEvent(_0: number, _1: number): number;
  stateMachinePostPointerUpEvent(_0: number, _1: number): number;
  stateMachinePostPointerMoveEvent(_0: number, _1: number): number;
  stateMachinePostPointerEnterEvent(_0: number, _1: number): number;
  stateMachinePostPointerExitEvent(_0: number, _1: number): number;
  unsubscribe(_0: Observer | null): void;
  stateMachineGetBooleanInput(_0: EmbindString): boolean;
  loadAnimationData(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimationPath(_0: EmbindString, _1: number, _2: number): boolean;
  loadDotLottieData(_0: EmbindString, _1: number, _2: number): boolean;
  loadAnimation(_0: EmbindString, _1: number, _2: number): boolean;
  manifestString(): string;
  setTheme(_0: EmbindString): boolean;
  setThemeData(_0: EmbindString): boolean;
  setFrame(_0: number): boolean;
  markers(): VectorMarker;
  subscribe(_0: Observer | null): Observer | null;
  stateMachineLoad(_0: EmbindString): boolean;
  stateMachineSetBooleanInput(_0: EmbindString, _1: boolean): boolean;
  stateMachineFireEvent(_0: EmbindString): void;
  stateMachineSetNumericInput(_0: EmbindString, _1: number): boolean;
  stateMachineSetStringInput(_0: EmbindString, _1: EmbindString): boolean;
  stateMachineLoadData(_0: EmbindString): boolean;
  stateMachineGetNumericInput(_0: EmbindString): number;
  stateMachineGetStringInput(_0: EmbindString): string;
  setConfig(_0: Config): void;
  intersect(_0: number, _1: number, _2: EmbindString): boolean;
  isPaused(): boolean;
  tweenToMarker(_0: EmbindString, _1?: number, _2?: VectorFloat): boolean;
  getStateMachine(_0: EmbindString): string;
  stateMachineFrameworkSetup(): VectorString;
  stateMachineCurrentState(): string;
  stateMachineOverrideCurrentState(_0: EmbindString, _1: boolean): boolean;
  stateMachineStatus(): string;
  stateMachineSubscribe(_0: StateMachineObserver | null): StateMachineObserver | null;
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
  mode: Mode;
  segment: VectorFloat;
  speed: number;
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
  Mode: { Bounce: ModeValue<3>; Forward: ModeValue<1>; Reverse: ModeValue<2>; ReverseBounce: ModeValue<4> };
  Observer: {
    extend(_0: EmbindString, _1: unknown): unknown;
    implement(_0: unknown): ObserverWrapper;
  };
  ObserverWrapper: {};
  OpenUrlMode: { Allow: OpenUrlModeValue<3>; Deny: OpenUrlModeValue<1>; Interaction: OpenUrlModeValue<2> };
  StateMachineObserver: {
    extend(_0: EmbindString, _1: unknown): unknown;
    implement(_0: unknown): StateMachineObserverWrapper;
  };
  StateMachineObserverWrapper: {};
  VectorFloat: {
    new (): VectorFloat;
  };
  VectorMarker: {
    new (): VectorMarker;
  };
  VectorString: {
    new (): VectorString;
  };
  createDefaultOpenURL(): OpenUrl;
  createDefaultLayout(): Layout;
  createDefaultConfig(): Config;
  transformThemeToLottieSlots(_0: EmbindString, _1: EmbindString): string;
}

export type MainModule = WasmModule & typeof RuntimeExports & EmbindModule;
