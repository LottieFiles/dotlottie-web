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
  StopEvent,
  UnfreezeEvent,
} from '../event-manager';
import type { Config, Layout, Mode, RenderConfig } from '../types';

import type { DotLottieInstanceState } from './dotlottie';

export interface MethodParamsMap {
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
  loadStateMachine: {
    instanceId: string;
    stateMachineId: string;
  };
  loadStateMachineData: {
    instanceId: string;
    stateMachineData: string;
  };
  loadTheme: {
    instanceId: string;
    themeId: string;
  };
  loadThemeData: {
    instanceId: string;
    themeData: string;
  };
  pause: {
    instanceId: string;
  };
  play: {
    instanceId: string;
  };
  postStateMachineEvent: {
    event: string;
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
  startStateMachine: {
    instanceId: string;
  };
  stop: {
    instanceId: string;
  };
  stopStateMachine: {
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
  create: {
    instanceId: string;
  };
  destroy: void;
  freeze: void;
  getDotLottieInstanceState: {
    state: DotLottieInstanceState;
  };
  getStateMachineListeners: string[];
  load: void;
  loadAnimation: void;
  loadStateMachine: boolean;
  loadStateMachineData: boolean;
  loadTheme: boolean;
  loadThemeData: boolean;
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
  postStateMachineEvent: number;
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
  setUseFrameInterpolation: void;
  setViewport: boolean;
  setWasmUrl: void;
  startStateMachine: boolean;
  stop: void;
  stopStateMachine: boolean;
  unfreeze: void;
}

export interface RpcResponse<U extends keyof MethodResultMap> {
  error?: string;
  id: string;
  method: U;
  result: MethodResultMap[U];
}
