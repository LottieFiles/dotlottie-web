/* eslint-disable no-restricted-globals */
import { DotLottie } from '../dotlottie';
import type {
  CompleteEvent,
  DestroyEvent,
  Event,
  EventType,
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
  StateMachineOnCustomEvent,
  StateMachineOnStateEnteredEvent,
  StateMachineOnErrorEvent,
  StateMachineOnStateExitEvent,
  StateMachineOnTransitionEvent,
} from '../event-manager';

import type { DotLottieInstanceState } from './dotlottie';
import type { MethodParamsMap, RpcRequest, MethodResultMap, RpcResponse } from './types';

const instancesMap = new Map<string, DotLottie>();

const eventHandlerMap: Record<EventType, (instanceId: string) => (event: Event) => void> = {
  ready: (instanceId: string) => (event) => {
    const response: RpcResponse<'onReady'> = {
      id: '',
      method: 'onReady',
      result: {
        instanceId,
        event: event as ReadyEvent,
      },
    };

    self.postMessage(response);
  },
  complete: (instanceId: string) => (event: Event) => {
    const response: RpcResponse<'onComplete'> = {
      id: '',
      method: 'onComplete',
      result: {
        instanceId,
        event: event as CompleteEvent,
      },
    };

    self.postMessage(response);
  },
  load: (instanceId: string) => (event: Event) => {
    const loadEvent = event as LoadEvent;
    const response: RpcResponse<'onLoad'> = {
      id: '',
      method: 'onLoad',
      result: {
        instanceId,
        event: loadEvent,
      },
    };

    self.postMessage(response);
  },
  loadError: (instanceId: string) => (event: Event) => {
    const loadErrorEvent = event as LoadErrorEvent;
    const response: RpcResponse<'onLoadError'> = {
      id: '',
      method: 'onLoadError',
      result: {
        instanceId,
        event: loadErrorEvent,
      },
    };

    self.postMessage(response);
  },
  loop: (instanceId: string) => (event: Event) => {
    const loopEvent = event as LoopEvent;
    const response: RpcResponse<'onLoop'> = {
      id: '',
      method: 'onLoop',
      result: {
        instanceId,
        event: loopEvent,
      },
    };

    self.postMessage(response);
  },
  play: (instanceId: string) => (event: Event) => {
    const playEvent = event as PlayEvent;
    const response: RpcResponse<'onPlay'> = {
      id: '',
      method: 'onPlay',
      result: {
        instanceId,
        event: playEvent,
      },
    };

    self.postMessage(response);
  },
  pause: (instanceId: string) => (event: Event) => {
    const pauseEvent = event as PauseEvent;
    const response: RpcResponse<'onPause'> = {
      id: '',
      method: 'onPause',
      result: {
        instanceId,
        event: pauseEvent,
      },
    };

    self.postMessage(response);
  },
  stop: (instanceId: string) => (event: Event) => {
    const stopEvent = event as StopEvent;
    const response: RpcResponse<'onStop'> = {
      id: '',
      method: 'onStop',
      result: {
        instanceId,
        event: stopEvent,
      },
    };

    self.postMessage(response);
  },
  frame: (instanceId: string) => (event: Event) => {
    const frameEvent = event as FrameEvent;
    const response: RpcResponse<'onFrame'> = {
      id: '',
      method: 'onFrame',
      result: {
        instanceId,
        event: frameEvent,
      },
    };

    self.postMessage(response);
  },
  render: (instanceId: string) => (event: Event) => {
    const renderEvent = event as RenderEvent;
    const response: RpcResponse<'onRender'> = {
      id: '',
      method: 'onRender',
      result: {
        instanceId,
        event: renderEvent,
      },
    };

    self.postMessage(response);
  },
  freeze: (instanceId: string) => (event: Event) => {
    const freezeEvent = event as FreezeEvent;
    const response: RpcResponse<'onFreeze'> = {
      id: '',
      method: 'onFreeze',
      result: {
        instanceId,
        event: freezeEvent,
      },
    };

    self.postMessage(response);
  },
  unfreeze: (instanceId: string) => (event: Event) => {
    const unfreezeEvent = event as UnfreezeEvent;
    const response: RpcResponse<'onUnfreeze'> = {
      id: '',
      method: 'onUnfreeze',
      result: {
        instanceId,
        event: unfreezeEvent,
      },
    };

    self.postMessage(response);
  },
  destroy: (instanceId: string) => (event: Event) => {
    const destroyEvent = event as DestroyEvent;
    const response: RpcResponse<'onDestroy'> = {
      id: '',
      method: 'onDestroy',
      result: {
        instanceId,
        event: destroyEvent,
      },
    };

    self.postMessage(response);
  },
  stateMachineOnCustomEvent: (instanceId: string) => (event: Event) => {
    const stateMachineOnCustomEvent = event as StateMachineOnCustomEvent;
    const response: RpcResponse<'onStateMachineCustomEvent'> = {
      id: '',
      method: 'onStateMachineCustomEvent',
      result: {
        instanceId,
        event: stateMachineOnCustomEvent,
      },
    };

    self.postMessage(response);
  },
  stateMachineOnError: (instanceId: string) => (event: Event) => {
    const stateMachineOnErrorEvent = event as StateMachineOnErrorEvent;
    const response: RpcResponse<'onStateMachineErrorEvent'> = {
      id: '',
      method: 'onStateMachineErrorEvent',
      result: {
        instanceId,
        event: stateMachineOnErrorEvent,
      },
    };

    self.postMessage(response);
  },
  stateMachineOnStateEntered: (instanceId: string) => (event: Event) => {
    const stateMachineOnStateEntered = event as StateMachineOnStateEnteredEvent;
    const response: RpcResponse<'onStateMachineStateEnteredEvent'> = {
      id: '',
      method: 'onStateMachineStateEnteredEvent',
      result: {
        instanceId,
        event: stateMachineOnStateEntered,
      },
    };

    self.postMessage(response);
  },
  stateMachineOnStateExit: (instanceId: string) => (event: Event) => {
    const stateMachineOnStateExitEvent = event as StateMachineOnStateExitEvent;
    const response: RpcResponse<'onStateMachineStateExitEvent'> = {
      id: '',
      method: 'onStateMachineStateExitEvent',
      result: {
        instanceId,
        event: stateMachineOnStateExitEvent,
      },
    };

    self.postMessage(response);
  },
  stateMachineOnTransition: (instanceId: string) => (event: Event) => {
    const stateMachineOnTransitionEvent = event as StateMachineOnTransitionEvent;
    const response: RpcResponse<'onStateMachineTransitionEvent'> = {
      id: '',
      method: 'onStateMachineTransitionEvent',
      result: {
        instanceId,
        event: stateMachineOnTransitionEvent,
      },
    };

    self.postMessage(response);
  },
};

const commands: {
  [K in keyof MethodParamsMap]: (request: RpcRequest<K>) => MethodResultMap[K];
} = {
  getDotLottieInstanceState(request) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    const state: DotLottieInstanceState = {
      isLoaded: instance.isLoaded,
      isPaused: instance.isPaused,
      isPlaying: instance.isPlaying,
      isStopped: instance.isStopped,
      isFrozen: instance.isFrozen,
      loop: instance.loop,
      mode: instance.mode,
      speed: instance.speed,
      currentFrame: instance.currentFrame,
      totalFrames: instance.totalFrames,
      duration: instance.duration,
      useFrameInterpolation: instance.useFrameInterpolation,
      renderConfig: instance.renderConfig,
      marker: instance.marker,
      backgroundColor: instance.backgroundColor,
      markers: instance.markers(),
      activeAnimationId: instance.activeAnimationId,
      activeThemeId: instance.activeThemeId,
      autoplay: instance.autoplay,
      segment: instance.segment,
      layout: instance.layout,
      segmentDuration: instance.segmentDuration,
      isReady: instance.isReady,
      manifest: instance.manifest,
    };

    return {
      state,
    };
  },
  setLayout(request) {
    const instanceId = request.params.instanceId;
    const layout = request.params.layout;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setLayout(layout);

    return {
      success: true,
    };
  },
  getStateMachineListeners(request) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.getStateMachineListeners();
  },
  create: (request) => {
    const instanceId = request.params.instanceId;
    const config = request.params.config;
    const width = request.params.width;
    const height = request.params.height;

    if (instancesMap.has(instanceId)) {
      throw new Error(`Instance with id ${instanceId} already exists.`);
    }

    const instance = new DotLottie(config);

    instance.canvas.height = height;
    instance.canvas.width = width;

    instancesMap.set(instanceId, instance);

    const events: EventType[] = [
      'complete',
      'frame',
      'load',
      'loadError',
      'loop',
      'pause',
      'play',
      'stop',
      'destroy',
      'freeze',
      'unfreeze',
      'render',
      'ready',
      'stateMachineOnCustomEvent',
      'stateMachineOnError',
      'stateMachineOnStateEntered',
      'stateMachineOnStateExit',
      'stateMachineOnTransition',
    ];

    events.forEach((event) => {
      instance.addEventListener(event, eventHandlerMap[event](instanceId));
    });

    return {
      instanceId,
    };
  },
  destroy: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) return;

    instance.destroy();

    instancesMap.delete(instanceId);
  },
  freeze: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.freeze();
  },
  load: (request) => {
    const instanceId = request.params.instanceId;
    const config = request.params.config;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.load(config);
  },
  loadAnimation: (request) => {
    const instanceId = request.params.instanceId;
    const animationId = request.params.animationId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.loadAnimation(animationId);
  },
  setTheme: (request) => {
    const instanceId = request.params.instanceId;
    const themeId = request.params.themeId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.setTheme(themeId);
  },
  setThemeData: (request) => {
    const instanceId = request.params.instanceId;
    const themeData = request.params.themeData;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.setThemeData(themeData);
  },
  pause: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.pause();
  },
  play: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.play();
  },
  resize: (request) => {
    const instanceId = request.params.instanceId;
    const width = request.params.width;
    const height = request.params.height;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.canvas.height = height;
    instance.canvas.width = width;

    instance.resize();

    return {
      success: true,
    };
  },
  setBackgroundColor: (request) => {
    const instanceId = request.params.instanceId;
    const backgroundColor = request.params.backgroundColor;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setBackgroundColor(backgroundColor);
  },
  setFrame: (request) => {
    const instanceId = request.params.instanceId;
    const frame = request.params.frame;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setFrame(frame);
  },
  setMode: (request) => {
    const instanceId = request.params.instanceId;
    const mode = request.params.mode;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setMode(mode);
  },
  setRenderConfig: (request) => {
    const instanceId = request.params.instanceId;
    const renderConfig = request.params.renderConfig;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setRenderConfig(renderConfig);
  },
  setSegment: (request) => {
    const instanceId = request.params.instanceId;
    const segment = request.params.segment;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setSegment(segment[0], segment[1]);
  },
  setSpeed: (request) => {
    const instanceId = request.params.instanceId;
    const speed = request.params.speed;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setSpeed(speed);
  },
  setUseFrameInterpolation: (request) => {
    const instanceId = request.params.instanceId;
    const useFrameInterpolation = request.params.useFrameInterpolation;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setUseFrameInterpolation(useFrameInterpolation);
  },
  setWasmUrl: (request) => {
    DotLottie.setWasmUrl(request.params.url);
  },
  stop: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.stop();
  },
  unfreeze: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.unfreeze();
  },
  setViewport(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;
    const width = request.params.width;
    const height = request.params.height;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.setViewport(x, y, width, height);
  },
  setMarker(request) {
    const instanceId = request.params.instanceId;
    const marker = request.params.marker;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setMarker(marker);

    return {
      success: true,
    };
  },
  setLoop(request) {
    const instanceId = request.params.instanceId;
    const loop = request.params.loop;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setLoop(loop);

    return {
      success: true,
    };
  },
  getStateMachine(request) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.getStateMachine(request.params.stateMachineId);
  },
  activeStateMachineId(request) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.activeStateMachineId();
  },
  stateMachineCurrentState(request) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineCurrentState();
  },
  stateMachineFire(request) {
    const instanceId = request.params.instanceId;
    const eventName = request.params.eventName;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineFire(eventName);
  },
  stateMachineGetBooleanTrigger(request) {
    const instanceId = request.params.instanceId;
    const triggerId = request.params.triggerId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineGetBooleanTrigger(triggerId);
  },
  stateMachineGetNumericTrigger(request) {
    const instanceId = request.params.instanceId;
    const triggerId = request.params.triggerId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineGetNumericTrigger(triggerId);
  },
  stateMachineGetStringTrigger(request) {
    const instanceId = request.params.instanceId;
    const triggerId = request.params.triggerId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineGetStringTrigger(triggerId);
  },
  stateMachineLoad(request) {
    const instanceId = request.params.instanceId;
    const stateMachineId = request.params.stateMachineId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineLoad(stateMachineId);
  },
  stateMachineLoadData(request) {
    const instanceId = request.params.instanceId;
    const stateMachineData = request.params.stateMachineData;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineLoadData(stateMachineData);
  },
  stateMachinePostClickEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachinePostClickEvent(x, y);
  },
  stateMachinePostPointerDownEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachinePostPointerDownEvent(x, y);
  },
  stateMachinePostPointerEnterEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachinePostPointerEnterEvent(x, y);
  },
  stateMachinePostPointerExitEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachinePostPointerExitEvent(x, y);
  },
  stateMachinePostPointerMoveEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachinePostPointerMoveEvent(x, y);
  },
  stateMachinePostPointerUpEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachinePostPointerUpEvent(x, y);
  },
  stateMachineSetBooleanTrigger(request) {
    const instanceId = request.params.instanceId;
    const triggerId = request.params.triggerId;
    const value = request.params.value;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineSetBooleanTrigger(triggerId, value);
  },
  stateMachineSetNumericTrigger(request) {
    const instanceId = request.params.instanceId;
    const triggerId = request.params.triggerId;
    const value = request.params.value;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineSetNumericTrigger(triggerId, value);
  },
  stateMachineSetStringTrigger(request) {
    const instanceId = request.params.instanceId;
    const triggerId = request.params.triggerId;
    const value = request.params.value;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineSetStringTrigger(triggerId, value);
  },
  stateMachineStart(request) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineStart();
  },
  stateMachineStop(request) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stateMachineStop();
  },
};

function executeCommand<T extends keyof MethodParamsMap>(rpcRequest: RpcRequest<T>): MethodResultMap[T] {
  const method = rpcRequest.method;

  if (typeof commands[method] === 'function') {
    return commands[method](rpcRequest as RpcRequest<typeof method>);
  } else {
    throw new Error(`Method ${method} is not implemented in commands.`);
  }
}

self.onmessage = (event: { data: RpcRequest<keyof MethodParamsMap> }): void => {
  try {
    const result = executeCommand(event.data);

    const response: RpcResponse<keyof MethodResultMap> = {
      id: event.data.id,
      method: event.data.method,
      result,
    };

    self.postMessage(response);
  } catch (error) {
    const errorResponse = {
      id: event.data.id,
      method: event.data.method,
      error: (error as Error).message,
    };

    self.postMessage(errorResponse);
  }
};

const dummy = '';

export default dummy;
