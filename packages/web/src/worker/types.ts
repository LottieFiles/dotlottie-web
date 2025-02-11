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
  RenderEvent,
  StateMachineOnCustomEvent,
  StateMachineOnErrorEvent,
  StateMachineOnStateEnteredEvent,
  StateMachineOnStateExitEvent,
  StateMachineOnTransitionEvent,
  StopEvent,
  UnfreezeEvent,
} from '../event-manager';
import type { Config, Layout, Mode, RenderConfig } from '../types';

import type { DotLottieInstanceState } from './dotlottie';

export interface MethodParamsMap {
  activeStateMachineId: {
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
  getStateMachine: {
    instanceId: string;
    stateMachineId: string;
  };
  getStateMachineListeners: {
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
  stateMachineCurrentState: {
    instanceId: string;
  };
  stateMachineFire: {
    eventName: string;
    instanceId: string;
  };
  stateMachineGetBooleanTrigger: {
    instanceId: string;
    triggerId: string;
  };
  stateMachineGetNumericTrigger: {
    instanceId: string;
    triggerId: string;
  };
  stateMachineGetStringTrigger: {
    instanceId: string;
    triggerId: string;
  };
  stateMachineLoad: {
    instanceId: string;
    stateMachineId: string;
  };
  stateMachineLoadData: {
    instanceId: string;
    stateMachineData: string;
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
  stateMachineSetBooleanTrigger: {
    instanceId: string;
    triggerId: string;
    value: boolean;
  };
  stateMachineSetNumericTrigger: {
    instanceId: string;
    triggerId: string;
    value: number;
  };
  stateMachineSetStringTrigger: {
    instanceId: string;
    triggerId: string;
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
  activeStateMachineId: string;
  create: {
    instanceId: string;
  };
  destroy: void;
  freeze: void;
  getDotLottieInstanceState: {
    state: DotLottieInstanceState;
  };
  getStateMachine: string;
  getStateMachineListeners: string[];
  load: void;
  loadAnimation: void;
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
  onStateMachineCustomEvent: {
    event: StateMachineOnCustomEvent;
    instanceId: string;
  };
  onStateMachineErrorEvent: {
    event: StateMachineOnErrorEvent;
    instanceId: string;
  };
  onStateMachineStateEnteredEvent: {
    event: StateMachineOnStateEnteredEvent;
    instanceId: string;
  };
  onStateMachineStateExitEvent: {
    event: StateMachineOnStateExitEvent;
    instanceId: string;
  };
  onStateMachineTransitionEvent: {
    event: StateMachineOnTransitionEvent;
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
  pause: void;
  play: void;
  resize: void;
  setBackgroundColor: void;
  setFrame: void;
  setLayout: void;
  setLoop: void;
  setMarker: void;
  setMode: void;
  setRenderConfig: void;
  setSegment: void;
  setSpeed: void;
  setTheme: boolean;
  setThemeData: boolean;
  setUseFrameInterpolation: void;
  setViewport: boolean;
  setWasmUrl: void;
  stateMachineCurrentState: string | undefined;
  stateMachineFire: void;
  stateMachineGetBooleanTrigger: boolean | undefined;
  stateMachineGetNumericTrigger: number | undefined;
  stateMachineGetStringTrigger: string | undefined;
  stateMachineLoad: boolean;
  stateMachineLoadData: boolean;
  stateMachinePostClickEvent: number | undefined;
  stateMachinePostPointerDownEvent: number | undefined;
  stateMachinePostPointerEnterEvent: number | undefined;
  stateMachinePostPointerExitEvent: number | undefined;
  stateMachinePostPointerMoveEvent: number | undefined;
  stateMachinePostPointerUpEvent: number | undefined;
  stateMachineSetBooleanTrigger: boolean | undefined;
  stateMachineSetNumericTrigger: boolean | undefined;
  stateMachineSetStringTrigger: boolean | undefined;
  stateMachineStart: boolean;
  stateMachineStop: boolean;
  stop: void;
  unfreeze: void;
}

export interface RpcResponse<U extends keyof MethodResultMap> {
  error?: string;
  id: string;
  method: U;
  result: MethodResultMap[U];
}
