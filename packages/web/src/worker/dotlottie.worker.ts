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
  RenderErrorEvent,
  LoadEvent,
  LoopEvent,
  PauseEvent,
  PlayEvent,
  ReadyEvent,
  RenderEvent,
  StopEvent,
  UnfreezeEvent,
} from '../event-manager';

import type { DotLottieInstanceState } from './dotlottie';
import type { 
  MethodParamsMap, 
  RpcRequest, 
  MethodResultMap, 
  RpcResponse, 
  BatchedFrameEvents, 
  BatchedRenderEvents, 
  StateChange, 
  StateUpdate,
  EventSubscriptionConfig 
} from './types';

const instancesMap = new Map<string, DotLottie>();

// Track event subscriptions per instance
const eventSubscriptions = new Map<string, Set<EventType>>();

// Track high-frequency event configurations
const highFrequencyConfigs = new Map<string, {
  batchFrameEvents?: boolean;
  batchRenderEvents?: boolean;
  frameEventThrottleMs?: number;
  renderEventThrottleMs?: number;
}>();

// Batching storage
const frameBatches = new Map<string, FrameEvent[]>();
const renderBatches = new Map<string, RenderEvent[]>();

// State tracking for incremental updates
const lastStates = new Map<string, DotLottieInstanceState>();
const stateTimestamps = new Map<string, number>();

// Throttling for high-frequency events
const lastFrameEventTime = new Map<string, number>();
const lastRenderEventTime = new Map<string, number>();

// Batch flush timers
const batchTimers = new Map<string, number>();

function flushBatches(instanceId: string): void {
  const frameEvents = frameBatches.get(instanceId);
  const renderEvents = renderBatches.get(instanceId);

  if (frameEvents && frameEvents.length > 0) {
    const batch: BatchedFrameEvents = {
      instanceId,
      events: frameEvents,
      lastFrame: frameEvents[frameEvents.length - 1].currentFrame,
    };

    const response: RpcResponse<'onBatchedFrames'> = {
      id: '',
      method: 'onBatchedFrames',
      result: { batch },
    };

    self.postMessage(response);
    frameBatches.set(instanceId, []);
  }

  if (renderEvents && renderEvents.length > 0) {
    const batch: BatchedRenderEvents = {
      instanceId,
      events: renderEvents,
      count: renderEvents.length,
    };

    const response: RpcResponse<'onBatchedRenders'> = {
      id: '',
      method: 'onBatchedRenders',
      result: { batch },
    };

    self.postMessage(response);
    renderBatches.set(instanceId, []);
  }
}

function shouldSendEvent(instanceId: string, eventType: EventType): boolean {
  const subscriptions = eventSubscriptions.get(instanceId);
  return subscriptions ? subscriptions.has(eventType) : false;
}

function handleHighFrequencyEvent(instanceId: string, event: Event, eventType: 'frame' | 'render'): boolean {
  const config = highFrequencyConfigs.get(instanceId);
  const now = Date.now();

  if (eventType === 'frame') {
    const shouldBatch = config?.batchFrameEvents;
    const throttleMs = config?.frameEventThrottleMs || 16; // ~60fps default
    const lastTime = lastFrameEventTime.get(instanceId) || 0;

    if (shouldBatch) {
      if (!frameBatches.has(instanceId)) {
        frameBatches.set(instanceId, []);
      }
      frameBatches.get(instanceId)!.push(event as FrameEvent);

      // Set timer to flush batch if not already set
      if (!batchTimers.has(instanceId)) {
        const timerId = self.setTimeout(() => {
          flushBatches(instanceId);
          batchTimers.delete(instanceId);
        }, 50); // Flush every 50ms
        batchTimers.set(instanceId, timerId);
      }
      return true; // Event handled
    } else if (now - lastTime < throttleMs) {
      return true; // Event throttled
    }

    lastFrameEventTime.set(instanceId, now);
  } else if (eventType === 'render') {
    const shouldBatch = config?.batchRenderEvents;
    const throttleMs = config?.renderEventThrottleMs || 16;
    const lastTime = lastRenderEventTime.get(instanceId) || 0;

    if (shouldBatch) {
      if (!renderBatches.has(instanceId)) {
        renderBatches.set(instanceId, []);
      }
      renderBatches.get(instanceId)!.push(event as RenderEvent);

      if (!batchTimers.has(instanceId)) {
        const timerId = self.setTimeout(() => {
          flushBatches(instanceId);
          batchTimers.delete(instanceId);
        }, 50);
        batchTimers.set(instanceId, timerId);
      }
      return true;
    } else if (now - lastTime < throttleMs) {
      return true;
    }

    lastRenderEventTime.set(instanceId, now);
  }

  return false; // Send event normally
}

function getStateChanges(instanceId: string): StateChange[] {
  const instance = instancesMap.get(instanceId);
  if (!instance) return [];

  const currentState: DotLottieInstanceState = {
    loopCount: instance.loopCount,
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

  const lastState = lastStates.get(instanceId);
  const changes: StateChange[] = [];

  if (!lastState) {
    // First time, send all properties
    Object.keys(currentState).forEach((key) => {
      changes.push({
        property: key as keyof DotLottieInstanceState,
        value: currentState[key as keyof DotLottieInstanceState],
      });
    });
  } else {
    // Compare with last state
    Object.keys(currentState).forEach((key) => {
      const prop = key as keyof DotLottieInstanceState;
      if (JSON.stringify(currentState[prop]) !== JSON.stringify(lastState[prop])) {
        changes.push({
          property: prop,
          value: currentState[prop],
        });
      }
    });
  }

  lastStates.set(instanceId, currentState);
  return changes;
}

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
  renderError: (instanceId: string) => (event: Event) => {
    const renderErrorEvent = event as RenderErrorEvent;
    const response: RpcResponse<'onRenderError'> = {
      id: '',
      method: 'onRenderError',
      result: {
        instanceId,
        event: renderErrorEvent,
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
    // Check if frame events are subscribed to
    if (!shouldSendEvent(instanceId, 'frame')) {
      return;
    }

    // Handle high-frequency event optimization
    if (handleHighFrequencyEvent(instanceId, event, 'frame')) {
      return; // Event was batched or throttled
    }

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
    // Check if render events are subscribed to
    if (!shouldSendEvent(instanceId, 'render')) {
      return;
    }

    // Handle high-frequency event optimization
    if (handleHighFrequencyEvent(instanceId, event, 'render')) {
      return; // Event was batched or throttled
    }

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
  getDotLottieInstanceState(request) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    const state: DotLottieInstanceState = {
      loopCount: instance.loopCount,
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
  postPointerDownEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.postPointerDownEvent(x, y);
  },
  postPointerEnterEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.postPointerEnterEvent(x, y);
  },
  postPointerExitEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.postPointerExitEvent(x, y);
  },
  postPointerMoveEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.postPointerMoveEvent(x, y);
  },
  postPointerUpEvent(request) {
    const instanceId = request.params.instanceId;
    const x = request.params.x;
    const y = request.params.y;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.postPointerUpEvent(x, y);
  },
  startStateMachine(request) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.startStateMachine();
  },
  stopStateMachine(request) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.stopStateMachine();
  },
  loadStateMachine(request) {
    const instanceId = request.params.instanceId;
    const stateMachineId = request.params.stateMachineId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.loadStateMachine(stateMachineId);
  },
  loadStateMachineData(request) {
    const instanceId = request.params.instanceId;
    const stateMachineData = request.params.stateMachineData;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    return instance.loadStateMachineData(stateMachineData);
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

    // Initialize with no event subscriptions - they will be added explicitly
    eventSubscriptions.set(instanceId, new Set());

    const events: EventType[] = [
      'complete',
      'frame',
      'load',
      'loadError',
      'renderError',
      'loop',
      'pause',
      'play',
      'stop',
      'destroy',
      'freeze',
      'unfreeze',
      'render',
      'ready',
    ];

    // Add all event listeners but only send events if subscribed
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
  animationSize(request: RpcRequest<'animationSize'>) {
    const instanceId = request.params.instanceId;

    const instance = instancesMap.get(instanceId);

    if (!instance) {
      throw new Error(`Instance with id ${instanceId} does not exist.`);
    }

    const { height, width } = instance.animationSize();

    return {
      height,
      width,
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
  subscribeToEvents(request) {
    const { instanceId, eventTypes, highFrequencyBatching } = request.params;

    if (!eventSubscriptions.has(instanceId)) {
      eventSubscriptions.set(instanceId, new Set());
    }

    const subscriptions = eventSubscriptions.get(instanceId)!;
    eventTypes.forEach(eventType => subscriptions.add(eventType));

    // Configure high-frequency batching if specified
    if (highFrequencyBatching?.enabled) {
      if (!highFrequencyConfigs.has(instanceId)) {
        highFrequencyConfigs.set(instanceId, {});
      }
      const config = highFrequencyConfigs.get(instanceId)!;
      
      if (eventTypes.includes('frame')) {
        config.batchFrameEvents = true;
        config.frameEventThrottleMs = highFrequencyBatching.throttleMs || 16;
      }
      if (eventTypes.includes('render')) {
        config.batchRenderEvents = true;
        config.renderEventThrottleMs = highFrequencyBatching.throttleMs || 16;
      }
    }
  },
  unsubscribeFromEvents(request) {
    const { instanceId, eventTypes } = request.params;

    const subscriptions = eventSubscriptions.get(instanceId);
    if (subscriptions) {
      eventTypes.forEach(eventType => subscriptions.delete(eventType));
    }

    // Clear high-frequency configs for unsubscribed events
    const config = highFrequencyConfigs.get(instanceId);
    if (config) {
      if (eventTypes.includes('frame')) {
        config.batchFrameEvents = false;
        delete config.frameEventThrottleMs;
      }
      if (eventTypes.includes('render')) {
        config.batchRenderEvents = false;
        delete config.renderEventThrottleMs;
      }
    }
  },
  getStateChanges(request) {
    const { instanceId, lastTimestamp } = request.params;
    const changes = getStateChanges(instanceId);
    const currentTimestamp = Date.now();

    stateTimestamps.set(instanceId, currentTimestamp);

    return {
      changes,
      currentTimestamp,
    };
  },
  setHighFrequencyEventConfig(request) {
    const { instanceId, config } = request.params;

    if (!highFrequencyConfigs.has(instanceId)) {
      highFrequencyConfigs.set(instanceId, {});
    }

    const existingConfig = highFrequencyConfigs.get(instanceId)!;
    Object.assign(existingConfig, config);
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
