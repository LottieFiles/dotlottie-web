import type {
  CompleteEvent,
  DestroyEvent,
  FrameEvent,
  FreezeEvent,
  LoadErrorEvent,
  LoadEvent,
  LoopEvent,
  PauseEvent,
  PlayEvent,
  ReadyEvent,
  RenderErrorEvent,
  RenderEvent,
  StateMachineBooleanInputValueChangeEvent,
  StateMachineCustomEvent,
  StateMachineErrorEvent,
  StateMachineInputFiredEvent,
  StateMachineInternalMessage,
  StateMachineNumericInputValueChangeEvent,
  StateMachineStartEvent,
  StateMachineStateEnteredEvent,
  StateMachineStateExitEvent,
  StateMachineStopEvent,
  StateMachineStringInputValueChangeEvent,
  StateMachineTransitionEvent,
  StopEvent,
  UnfreezeEvent,
} from '../event-manager';
import type { Config, Layout, Mode, RenderConfig, StateMachineConfig, Transform } from '../types';

import type { DotLottieInstanceState } from './dotlottie';

export interface MethodParamsMap {
  animationSize: {
    instanceId: string;
  };
  create: {
    config: Config;
    height: number;
    instanceId: string;
    width: number;
  };
  destroy: {
    instanceId: string;
  };
  freeze: {
    instanceId: string;
  };
  getDotLottieInstanceState: {
    instanceId: string;
  };
  getTransform: {
    instanceId: string;
  };
  load: {
    config: Omit<Config, 'canvas'>;
    instanceId: string;
  };
  loadAnimation: {
    animationId: string;
    instanceId: string;
  };
  pause: {
    instanceId: string;
  };
  play: {
    instanceId: string;
  };
  registerFont: {
    fontName: string;
    fontSource: string | ArrayBuffer | Uint8Array;
  };
  resize: {
    height: number;
    instanceId: string;
    width: number;
  };
  setBackgroundColor: {
    backgroundColor: string;
    instanceId: string;
  };
  setFrame: {
    frame: number;
    instanceId: string;
  };
  setLayout: {
    instanceId: string;
    layout: Layout;
  };
  setLoop: {
    instanceId: string;
    loop: boolean;
  };
  setLoopCount: {
    instanceId: string;
    loopCount: number;
  };
  setMarker: {
    instanceId: string;
    marker: string;
  };
  setMode: {
    instanceId: string;
    mode: Mode;
  };
  setRenderConfig: {
    instanceId: string;
    renderConfig: RenderConfig;
  };
  setSegment: {
    instanceId: string;
    segment: [number, number];
  };
  setSpeed: {
    instanceId: string;
    speed: number;
  };
  setTheme: {
    instanceId: string;
    themeId: string;
  };
  setThemeData: {
    instanceId: string;
    themeData: string;
  };
  setTransform: {
    instanceId: string;
    transform: Transform;
  };
  setUseFrameInterpolation: {
    instanceId: string;
    useFrameInterpolation: boolean;
  };
  setViewport: {
    height: number;
    instanceId: string;
    width: number;
    x: number;
    y: number;
  };
  setWasmUrl: {
    url: string;
  };
  stateMachineFireEvent: {
    instanceId: string;
    name: string;
  };
  stateMachineGet: {
    instanceId: string;
    stateMachineId: string;
  };
  stateMachineGetActiveId: {
    instanceId: string;
  };
  stateMachineGetBooleanInput: {
    instanceId: string;
    name: string;
  };
  stateMachineGetCurrentState: {
    instanceId: string;
  };
  stateMachineGetInputs: {
    instanceId: string;
  };
  stateMachineGetListeners: {
    instanceId: string;
  };
  stateMachineGetNumericInput: {
    instanceId: string;
    name: string;
  };
  stateMachineGetStatus: {
    instanceId: string;
  };
  stateMachineGetStringInput: {
    instanceId: string;
    name: string;
  };
  stateMachineLoad: {
    instanceId: string;
    stateMachineId: string;
  };
  stateMachineLoadData: {
    instanceId: string;
    stateMachineData: string;
  };
  stateMachineOverrideState: {
    immediate?: boolean;
    instanceId: string;
    state: string;
  };
  stateMachinePostClickEvent: {
    instanceId: string;
    x: number;
    y: number;
  };
  stateMachinePostPointerDownEvent: {
    instanceId: string;
    x: number;
    y: number;
  };
  stateMachinePostPointerEnterEvent: {
    instanceId: string;
    x: number;
    y: number;
  };
  stateMachinePostPointerExitEvent: {
    instanceId: string;
    x: number;
    y: number;
  };
  stateMachinePostPointerMoveEvent: {
    instanceId: string;
    x: number;
    y: number;
  };
  stateMachinePostPointerUpEvent: {
    instanceId: string;
    x: number;
    y: number;
  };
  stateMachineSetBooleanInput: {
    instanceId: string;
    name: string;
    value: boolean;
  };
  stateMachineSetConfig: {
    config: StateMachineConfig | null;
    instanceId: string;
  };
  stateMachineSetNumericInput: {
    instanceId: string;
    name: string;
    value: number;
  };
  stateMachineSetStringInput: {
    instanceId: string;
    name: string;
    value: string;
  };
  stateMachineStart: {
    instanceId: string;
  };
  stateMachineStop: {
    instanceId: string;
  };
  stop: {
    instanceId: string;
  };
  tween: {
    duration: number;
    frame: number;
    instanceId: string;
  };
  tweenToMarker: {
    duration: number;
    instanceId: string;
    marker: string;
  };
  unfreeze: {
    instanceId: string;
  };
}

export interface RpcRequest<T extends keyof MethodParamsMap> {
  id: string;
  method: T;
  params: MethodParamsMap[T];
}

export interface MethodResultMap {
  animationSize: {
    height: number;
    width: number;
  };
  create: {
    instanceId: string;
  };
  destroy: undefined;
  freeze: undefined;
  getDotLottieInstanceState: {
    state: DotLottieInstanceState;
  };
  getTransform: Transform | undefined;
  load: undefined;
  loadAnimation: undefined;
  onComplete: {
    event: CompleteEvent;
    instanceId: string;
  };
  onDestroy: {
    event: DestroyEvent;
    instanceId: string;
  };
  onFrame: {
    event: FrameEvent;
    instanceId: string;
  };
  onFreeze: {
    event: FreezeEvent;
    instanceId: string;
  };
  onLoad: {
    event: LoadEvent;
    instanceId: string;
  };
  onLoadError: {
    event: LoadErrorEvent;
    instanceId: string;
  };
  onLoop: {
    event: LoopEvent;
    instanceId: string;
  };
  onPause: {
    event: PauseEvent;
    instanceId: string;
  };
  onPlay: {
    event: PlayEvent;
    instanceId: string;
  };
  onReady: {
    event: ReadyEvent;
    instanceId: string;
  };
  onRender: {
    event: RenderEvent;
    instanceId: string;
  };
  onRenderError: {
    event: RenderErrorEvent;
    instanceId: string;
  };
  onStateMachineBooleanInputValueChange: {
    event: StateMachineBooleanInputValueChangeEvent;
    instanceId: string;
  };
  onStateMachineCustomEvent: {
    event: StateMachineCustomEvent;
    instanceId: string;
  };
  onStateMachineError: {
    event: StateMachineErrorEvent;
    instanceId: string;
  };
  onStateMachineInputFired: {
    event: StateMachineInputFiredEvent;
    instanceId: string;
  };
  onStateMachineInternalMessage: {
    event: StateMachineInternalMessage;
    instanceId: string;
  };
  onStateMachineNumericInputValueChange: {
    event: StateMachineNumericInputValueChangeEvent;
    instanceId: string;
  };
  onStateMachineStart: {
    event: StateMachineStartEvent;
    instanceId: string;
  };
  onStateMachineStateEntered: {
    event: StateMachineStateEnteredEvent;
    instanceId: string;
  };
  onStateMachineStateExit: {
    event: StateMachineStateExitEvent;
    instanceId: string;
  };
  onStateMachineStop: {
    event: StateMachineStopEvent;
    instanceId: string;
  };
  onStateMachineStringInputValueChange: {
    event: StateMachineStringInputValueChangeEvent;
    instanceId: string;
  };
  onStateMachineTransition: {
    event: StateMachineTransitionEvent;
    instanceId: string;
  };
  onStop: {
    event: StopEvent;
    instanceId: string;
  };
  onUnfreeze: {
    event: UnfreezeEvent;
    instanceId: string;
  };
  pause: undefined;
  play: undefined;
  registerFont: boolean;
  resize: undefined;
  setBackgroundColor: undefined;
  setFrame: undefined;
  setLayout: undefined;
  setLoop: undefined;
  setLoopCount: undefined;
  setMarker: undefined;
  setMode: undefined;
  setRenderConfig: undefined;
  setSegment: undefined;
  setSpeed: undefined;
  setTheme: boolean;
  setThemeData: boolean;
  setTransform: boolean;
  setUseFrameInterpolation: undefined;
  setViewport: boolean;
  setWasmUrl: undefined;
  stateMachineFireEvent: undefined;
  stateMachineGet: string;
  stateMachineGetActiveId: string;
  stateMachineGetBooleanInput: boolean | undefined;
  stateMachineGetCurrentState: string;
  stateMachineGetInputs: string[];
  stateMachineGetListeners: string[];
  stateMachineGetNumericInput: number | undefined;
  stateMachineGetStatus: string;
  stateMachineGetStringInput: string | undefined;
  stateMachineLoad: boolean;
  stateMachineLoadData: boolean;
  stateMachineOverrideState: boolean;
  stateMachinePostClickEvent: undefined;
  stateMachinePostPointerDownEvent: undefined;
  stateMachinePostPointerEnterEvent: undefined;
  stateMachinePostPointerExitEvent: undefined;
  stateMachinePostPointerMoveEvent: undefined;
  stateMachinePostPointerUpEvent: undefined;
  stateMachineSetBooleanInput: boolean;
  stateMachineSetConfig: undefined;
  stateMachineSetNumericInput: boolean;
  stateMachineSetStringInput: boolean;
  stateMachineStart: boolean;
  stateMachineStop: boolean;
  stop: undefined;
  tween: boolean;
  tweenToMarker: boolean;
  unfreeze: undefined;
}

export interface RpcResponse<U extends keyof MethodResultMap> {
  error?: string;
  id: string;
  method: U;
  result: MethodResultMap[U];
}
