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
  RenderEvent,
  StopEvent,
  UnfreezeEvent,
} from '../event-manager';

import type { MethodParamsMap, RpcRequest, MethodResultMap, RpcResponse } from './types';

const instancesMap = new Map<string, DotLottie>();

const eventHandlerMap: Record<EventType, (instanceId: string) => (event: Event) => void> = {
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
};

const commands: {
  [K in keyof MethodParamsMap]: (request: RpcRequest<K>) => MethodResultMap[K];
} = {
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
    ];

    events.forEach((event) => {
      instance.addEventListener(event, eventHandlerMap[event](instanceId));
    });

    return {
      instanceId,
      success: true,
    };
  },
  destroy: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.destroy();

    instancesMap.delete(instanceId);

    return {
      success: true,
    };
  },
  freeze: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.freeze();

    return {
      success: true,
    };
  },
  load: (request) => {
    const instanceId = request.params.instanceId;
    const config = request.params.config;

    if (!instancesMap.has(instanceId)) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    const instance = instancesMap.get(instanceId);

    instance?.load(config);

    return {
      success: true,
    };
  },
  loadAnimation: (request) => {
    const instanceId = request.params.instanceId;
    const animationId = request.params.animationId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.loadAnimation(animationId);

    return {
      success: true,
    };
  },
  loadTheme: (request) => {
    const instanceId = request.params.instanceId;
    const themeId = request.params.themeId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.loadTheme(themeId);

    return {
      success: true,
    };
  },
  loadThemeData: (request) => {
    const instanceId = request.params.instanceId;
    const themeData = request.params.themeData;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.loadThemeData(themeData);

    return {
      success: true,
    };
  },
  pause: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.pause();

    return {
      success: true,
    };
  },
  play: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.play();

    return {
      success: true,
    };
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

    return {
      success: true,
    };
  },
  setFrame: (request) => {
    const instanceId = request.params.instanceId;
    const frame = request.params.frame;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setFrame(frame);

    return {
      success: true,
    };
  },
  setMode: (request) => {
    const instanceId = request.params.instanceId;
    const mode = request.params.mode;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setMode(mode);

    return {
      success: true,
    };
  },
  setRenderConfig: (request) => {
    const instanceId = request.params.instanceId;
    const renderConfig = request.params.renderConfig;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setRenderConfig(renderConfig);

    return {
      success: true,
    };
  },
  setSegment: (request) => {
    const instanceId = request.params.instanceId;
    const segment = request.params.segment;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setSegment(segment[0], segment[1]);

    return {
      success: true,
    };
  },
  setSpeed: (request) => {
    const instanceId = request.params.instanceId;
    const speed = request.params.speed;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setSpeed(speed);

    return {
      success: true,
    };
  },
  setUseFrameInterpolation: (request) => {
    const instanceId = request.params.instanceId;
    const useFrameInterpolation = request.params.useFrameInterpolation;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.setUseFrameInterpolation(useFrameInterpolation);

    return {
      success: true,
    };
  },
  setWasmUrl: (request) => {
    DotLottie.setWasmUrl(request.params.wasmUrl);

    return {
      success: true,
    };
  },
  stop: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.stop();

    return {
      success: true,
    };
  },
  unfreeze: (request) => {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    instance.unfreeze();

    return {
      success: true,
    };
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

    return {
      success: instance.setViewport(x, y, width, height),
    };
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
      error: {
        message: (error as Error).message,
      },
    };

    self.postMessage(errorResponse);
  }
};

const dummy = '';

export default dummy;
