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
  RenderEvent,
  StopEvent,
  UnfreezeEvent,
} from '../event-manager';
import type { Config, Layout, Mode, RenderConfig } from '../types';

import type { DotLottieInstanceState } from './dotlottie';

interface CreateParams {
  config: Config;
  height: number;
  instanceId: string;
  width: number;
}

interface PlayParams {
  instanceId: string;
}

interface PauseParams {
  instanceId: string;
}

interface StopParams {
  instanceId: string;
}

interface DestroyParams {
  instanceId: string;
}

interface SetSpeedParams {
  instanceId: string;
  speed: number;
}

interface SetModeParams {
  instanceId: string;
  mode: Mode;
}

interface SetFrameParams {
  frame: number;
  instanceId: string;
}

interface SetSegmentParams {
  instanceId: string;
  segment: [number, number];
}

interface LoadParams {
  config: Omit<Config, 'canvas'>;
  instanceId: string;
}

interface ResizeParams {
  height: number;
  instanceId: string;
  width: number;
}

interface SetBackgroundColorParams {
  backgroundColor: string;
  instanceId: string;
}

interface FreezeParams {
  instanceId: string;
}

interface UnfreezeParams {
  instanceId: string;
}

interface LoadAnimationParams {
  animationId: string;
  instanceId: string;
}

interface LoadThemeParams {
  instanceId: string;
  themeId: string;
}

interface LoadThemeDataParams {
  instanceId: string;
  themeData: string;
}

interface SetUseFrameInterpolationParams {
  instanceId: string;
  useFrameInterpolation: boolean;
}

interface SetRenderConfigParams {
  instanceId: string;
  renderConfig: RenderConfig;
}

interface SetWasmUrlParams {
  wasmUrl: string;
}

interface SetViewportParams {
  height: number;
  instanceId: string;
  width: number;
  x: number;
  y: number;
}

interface SetMarkerParams {
  instanceId: string;
  marker: string;
}

export interface MethodParamsMap {
  create: CreateParams;
  destroy: DestroyParams;
  freeze: FreezeParams;
  getDotLottieInstanceState: {
    instanceId: string;
  };
  getStateMachineListeners: {
    instanceId: string;
  };
  load: LoadParams;
  loadAnimation: LoadAnimationParams;
  loadStateMachine: {
    instanceId: string;
    stateMachineId: string;
  };
  loadTheme: LoadThemeParams;
  loadThemeData: LoadThemeDataParams;
  pause: PauseParams;
  play: PlayParams;
  postStateMachineEvent: {
    event: string;
    instanceId: string;
  };
  resize: ResizeParams;
  setBackgroundColor: SetBackgroundColorParams;
  setFrame: SetFrameParams;
  setLayout: {
    instanceId: string;
    layout: Layout;
  };
  setLoop: {
    instanceId: string;
    loop: boolean;
  };
  setMarker: SetMarkerParams;
  setMode: SetModeParams;
  setRenderConfig: SetRenderConfigParams;
  setSegment: SetSegmentParams;
  setSpeed: SetSpeedParams;
  setUseFrameInterpolation: SetUseFrameInterpolationParams;
  setViewport: SetViewportParams;
  setWasmUrl: SetWasmUrlParams;
  startStateMachine: {
    instanceId: string;
  };
  stop: StopParams;
  stopStateMachine: {
    instanceId: string;
  };
  unfreeze: UnfreezeParams;
}

export interface RpcRequest<T extends keyof MethodParamsMap> {
  id: string;
  method: T;
  params: MethodParamsMap[T];
}

interface CreateResult {
  instanceId: string;
  success: boolean;
}

interface PlayResult {
  success: boolean;
}

interface PauseResult {
  success: boolean;
}

interface StopResult {
  success: boolean;
}

interface DestroyResult {
  success: boolean;
}

interface SetSpeedResult {
  success: boolean;
}

interface SetModeResult {
  success: boolean;
}

interface SetFrameResult {
  success: boolean;
}

interface SetSegmentResult {
  success: boolean;
}

interface LoadResult {
  success: boolean;
}

interface ResizeResult {
  success: boolean;
}

interface SetBackgroundColorResult {
  success: boolean;
}

interface FreezeResult {
  success: boolean;
}

interface UnfreezeResult {
  success: boolean;
}

interface LoadAnimationResult {
  success: boolean;
}

interface LoadThemeResult {
  success: boolean;
}

interface LoadThemeDataResult {
  success: boolean;
}

interface SetUseFrameInterpolationResult {
  success: boolean;
}

interface SetRenderConfigResult {
  success: boolean;
}

interface SetWasmUrlResult {
  success: boolean;
}

interface SetViewportResult {
  success: boolean;
}

interface SetMarkerResult {
  success: boolean;
}

export interface MethodResultMap {
  create: CreateResult;
  destroy: DestroyResult;
  freeze: FreezeResult;
  getDotLottieInstanceState: {
    state: DotLottieInstanceState;
  };
  getStateMachineListeners: {
    listeners: string[];
  };
  load: LoadResult;
  loadAnimation: LoadAnimationResult;
  loadStateMachine: {
    success: boolean;
  };
  loadTheme: LoadThemeResult;
  loadThemeData: LoadThemeDataResult;
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
  pause: PauseResult;
  play: PlayResult;
  postStateMachineEvent: {
    success: boolean;
  };
  resize: ResizeResult;
  setBackgroundColor: SetBackgroundColorResult;
  setFrame: SetFrameResult;
  setLayout: {
    success: boolean;
  };
  setLoop: {
    success: boolean;
  };
  setMarker: SetMarkerResult;
  setMode: SetModeResult;
  setRenderConfig: SetRenderConfigResult;
  setSegment: SetSegmentResult;
  setSpeed: SetSpeedResult;
  setUseFrameInterpolation: SetUseFrameInterpolationResult;
  setViewport: SetViewportResult;
  setWasmUrl: SetWasmUrlResult;
  startStateMachine: {
    success: boolean;
  };
  stop: StopResult;
  stopStateMachine: {
    success: boolean;
  };
  unfreeze: UnfreezeResult;
}

interface RpcError {
  code: number;
  message: string;
}

export interface RpcResponse<U extends keyof MethodResultMap> {
  error?: RpcError;
  id: string;
  method: U;
  result: MethodResultMap[U];
}
