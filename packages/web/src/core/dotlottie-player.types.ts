/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable typescript-sort-keys/interface */
// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.

interface WasmModule {}

type EmbindString = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string;
export interface ClassHandle {
  isAliasOf(other: ClassHandle): boolean;
  delete(): void;
  deleteLater(): this;
  isDeleted(): boolean;
  clone(): this;
}
export interface VectorFloat extends ClassHandle {
  size(): number;
  get(_0: number): number | undefined;
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  set(_0: number, _1: number): boolean;
}

export interface VectorMarker extends ClassHandle {
  size(): number;
  get(_0: number): Marker | undefined;
  push_back(_0: Marker): void;
  resize(_0: number, _1: Marker): void;
  set(_0: number, _1: Marker): boolean;
}

export interface VectorString extends ClassHandle {
  size(): number;
  get(_0: number): EmbindString | undefined;
  push_back(_0: EmbindString): void;
  resize(_0: number, _1: EmbindString): void;
  set(_0: number, _1: EmbindString): boolean;
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
  fit: Fit;
  align: VectorFloat;
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
  on_load(): void;
  on_load_error(): void;
  on_play(): void;
  on_pause(): void;
  on_stop(): void;
  on_complete(): void;
  on_loop(_0: number): void;
  on_frame(_0: number): void;
  on_render(_0: number): void;
}

export interface CallbackObserver extends Observer {
  setOnComplete(_0: unknown): void;
  setOnLoad(_0: unknown): void;
  setOnLoadError(_0: unknown): void;
  setOnPlay(_0: unknown): void;
  setOnPause(_0: unknown): void;
  setOnStop(_0: unknown): void;
  setOnFrame(_0: unknown): void;
  setOnRender(_0: unknown): void;
  setOnLoop(_0: unknown): void;
}

export interface StateMachineObserver extends ClassHandle {
  on_start(): void;
  on_stop(): void;
  on_transition(_0: EmbindString, _1: EmbindString): void;
  on_state_entered(_0: EmbindString): void;
  on_state_exit(_0: EmbindString): void;
  on_custom_event(_0: EmbindString): void;
  on_string_input_value_change(_0: EmbindString, _1: EmbindString, _2: EmbindString): void;
  on_numeric_input_value_change(_0: EmbindString, _1: number, _2: number): void;
  on_boolean_input_value_change(_0: EmbindString, _1: boolean, _2: boolean): void;
  on_input_fired(_0: EmbindString): void;
  on_error(_0: EmbindString): void;
}

export interface CallbackStateMachineObserver extends StateMachineObserver {
  setOnStart(_0: unknown): void;
  setOnStop(_0: unknown): void;
  setOnTransition(_0: unknown): void;
  setOnStateEntered(_0: unknown): void;
  setOnStateExit(_0: unknown): void;
  setOnCustomEvent(_0: unknown): void;
  setOnStringInputValueChange(_0: unknown): void;
  setOnNumericInputValueChange(_0: unknown): void;
  setOnBooleanInputValueChange(_0: unknown): void;
  setOnInputFired(_0: unknown): void;
  setOnError(_0: unknown): void;
}

export interface DotLottiePlayer extends ClassHandle {
  markers(): VectorMarker;
  animationSize(): VectorFloat;
  subscribe(_0: Observer | null): Observer | null;
  stateMachineFrameworkSetup(): VectorString;
  stateMachineSubscribe(_0: StateMachineObserver | null): StateMachineObserver | null;
  stateMachineFrameworkSubscribe(_0: StateMachineObserver | null): StateMachineObserver | null;
  clear(): void;
  unsubscribe(_0: Observer | null): void;
  stateMachineUnsubscribe(_0: StateMachineObserver | null): void;
  stateMachineFrameworkUnsubscribe(_0: StateMachineObserver | null): void;
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
  activeAnimationId(): string;
  activeThemeId(): string;
  stateMachineLoad(_0: EmbindString): boolean;
  stateMachineLoadData(_0: EmbindString): boolean;
  stateMachineFireEvent(_0: EmbindString): void;
  stateMachineSetNumericInput(_0: EmbindString, _1: number): boolean;
  stateMachineSetStringInput(_0: EmbindString, _1: EmbindString): boolean;
  stateMachineSetBooleanInput(_0: EmbindString, _1: boolean): boolean;
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
  buffer(): unknown;
}

export interface Marker {
  name: string;
  time: number;
  duration: number;
}

export interface Config {
  autoplay: boolean;
  loopAnimation: boolean;
  mode: Mode;
  speed: number;
  useFrameInterpolation: boolean;
  segment: VectorFloat;
  backgroundColor: number;
  layout: Layout;
  marker: EmbindString;
  themeId: EmbindString;
  stateMachineId: EmbindString;
  animationId: EmbindString;
}

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
  OpenUrlMode: { Deny: OpenUrlModeValue<1>; Interaction: OpenUrlModeValue<2>; Allow: OpenUrlModeValue<3> };
  createDefaultOpenURL(): OpenUrl;
  Observer: {};
  CallbackObserver: {
    new (): CallbackObserver;
  };
  StateMachineObserver: {};
  CallbackStateMachineObserver: {
    new (): CallbackStateMachineObserver;
  };
  DotLottiePlayer: {
    new (_0: Config): DotLottiePlayer;
  };
  createDefaultConfig(): Config;
  transformThemeToLottieSlots(_0: EmbindString, _1: EmbindString): string;
}

export type MainModule = WasmModule & EmbindModule;
