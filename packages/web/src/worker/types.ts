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
  StateMachineBooleanInputValueChangeEvent,
  StateMachineCustomEvent,
  StateMachineErrorEvent,
  StateMachineNumericInputValueChangeEvent,
  StateMachineStartEvent,
  StateMachineStateEnteredEvent,
  StateMachineStateExitEvent,
  StateMachineStopEvent,
  StateMachineStringInputValueChangeEvent,
  StateMachineTransitionEvent,
  StateMachineInputFiredEvent,
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
  getLayerBoundingBox: {
    instanceId: string;
    layerName: string;
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
  stateMachineGetBooleanInput: {
    instanceId: string;
    triggerId: string;
  };
  stateMachineGetNumericInput: {
    instanceId: string;
    triggerId: string;
  };
  stateMachineGetStringInput: {
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
  stateMachineSetBooleanInput: {
    instanceId: string;
    triggerId: string;
    value: boolean;
  };
  stateMachineSetNumericInput: {
    instanceId: string;
    triggerId: string;
    value: number;
  };
  stateMachineSetStringInput: {
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
  getLayerBoundingBox:
    | {
        x1: number;
        x2: number;
        x3: number;
        x4: number;
        y1: number;
        y2: number;
        y3: number;
        y4: number;
      }
    | undefined;
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
  onStateMachineBooleanInputValueChange: {
    event: StateMachineBooleanInputValueChangeEvent;
    inputName: string;
    instanceId: string;
    newValue: boolean;
    oldValue: boolean;
  };
  onStateMachineCustomEvent: {
    event: StateMachineCustomEvent;
    instanceId: string;
  };
  onStateMachineError: {
    event: StateMachineErrorEvent;
    instanceId: string;
    message: string;
  };
  onStateMachineInputFired: {
    event: StateMachineInputFiredEvent;
    inputName: string;
    instanceId: string;
  };
  onStateMachineNumericInputValueChange: {
    event: StateMachineNumericInputValueChangeEvent;
    inputName: string;
    instanceId: string;
    newValue: number;
    oldValue: number;
  };
  onStateMachineStart: {
    event: StateMachineStartEvent;
    instanceId: string;
  };
  onStateMachineStateEntered: {
    enteringState: string;
    event: StateMachineStateEnteredEvent;
    instanceId: string;
  };
  onStateMachineStateExit: {
    event: StateMachineStateExitEvent;
    exitingState: string;
    instanceId: string;
  };
  onStateMachineStop: {
    event: StateMachineStopEvent;
    instanceId: string;
  };
  onStateMachineStringInputValueChange: {
    event: StateMachineStringInputValueChangeEvent;
    inputName: string;
    instanceId: string;
    newValue: string;
    oldValue: string;
  };
  onStateMachineTransition: {
    event: StateMachineTransitionEvent;
    instanceId: string;
    newState: string;
    previousState: string;
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
  stateMachineGetBooleanInput: boolean | undefined;
  stateMachineGetNumericInput: number | undefined;
  stateMachineGetStringInput: string | undefined;
  stateMachineLoad: boolean;
  stateMachineLoadData: boolean;
  stateMachinePostClickEvent: number | undefined;
  stateMachinePostPointerDownEvent: number | undefined;
  stateMachinePostPointerEnterEvent: number | undefined;
  stateMachinePostPointerExitEvent: number | undefined;
  stateMachinePostPointerMoveEvent: number | undefined;
  stateMachinePostPointerUpEvent: number | undefined;
  stateMachineSetBooleanInput: boolean | undefined;
  stateMachineSetNumericInput: boolean | undefined;
  stateMachineSetStringInput: boolean | undefined;
  stateMachineSetupListeners: void;
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
