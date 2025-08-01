import { IS_BROWSER } from '../constants';
import type { Marker } from '../core';
import type { EventType, EventListener, FrameEvent, StateMachineOpenUrlEvent } from '../event-manager';
import { EventManager } from '../event-manager';
import { OffscreenObserver } from '../offscreen-observer';
import { CanvasResizeObserver } from '../resize-observer';
import type { Config, Layout, Manifest, Mode, RenderConfig } from '../types';
import { getDefaultDPR, getPointerPosition, isElementInViewport } from '../utils';

import type { MethodParamsMap, MethodResultMap, RpcRequest, RpcResponse } from './types';
import { WorkerManager } from './worker-manager';

function getCanvasSize(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  devicePixelRatio: number,
): { height: number; width: number } {
  if (canvas instanceof HTMLCanvasElement) {
    const { height: clientHeight, width: clientWidth } = canvas.getBoundingClientRect();

    if (clientHeight !== 0 && clientWidth !== 0) {
      return { width: clientWidth * devicePixelRatio, height: clientHeight * devicePixelRatio };
    }
  }

  return { width: canvas.width, height: canvas.height };
}

function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export interface DotLottieInstanceState {
  activeAnimationId: string | undefined;
  activeThemeId: string | undefined;
  autoplay: boolean;
  backgroundColor: string;
  currentFrame: number;
  duration: number;
  isFrozen: boolean;
  isLoaded: boolean;
  isPaused: boolean;
  isPlaying: boolean;
  isReady: boolean;
  isStopped: boolean;
  layout: Layout | undefined;
  loop: boolean;
  loopCount: number;
  manifest: Manifest | null;
  marker: string | undefined;
  markers: Marker[];
  mode: Mode;
  renderConfig: RenderConfig;
  segment: [number, number] | undefined;
  segmentDuration: number;
  speed: number;
  totalFrames: number;
  useFrameInterpolation: boolean;
}

export class DotLottieWorker {
  private static readonly _workerManager = new WorkerManager();

  private readonly _eventManager = new EventManager();

  private readonly _id: string;

  private readonly _worker: Worker;

  private readonly _canvas: HTMLCanvasElement | OffscreenCanvas;

  private _dotLottieInstanceState: DotLottieInstanceState = {
    loopCount: 0,
    markers: [],
    autoplay: false,
    backgroundColor: '',
    currentFrame: 0,
    duration: 0,
    loop: false,
    mode: 'forward',
    segment: [0, 0],
    segmentDuration: 0,
    speed: 1,
    totalFrames: 0,
    isLoaded: false,
    isPlaying: false,
    isPaused: false,
    isStopped: true,
    isFrozen: false,
    useFrameInterpolation: false,
    renderConfig: {
      devicePixelRatio: getDefaultDPR(),
    },
    activeAnimationId: '',
    activeThemeId: '',
    layout: undefined,
    marker: undefined,
    isReady: false,
    manifest: null,
  };

  private static _wasmUrl: string = '';

  private _created: boolean = false;

  public constructor(config: Config & { workerId?: string }) {
    this._canvas = config.canvas;

    this._id = `dotlottie-${generateUniqueId()}`;
    const workerId = config.workerId || 'defaultWorker';

    // creates or gets the worker
    this._worker = DotLottieWorker._workerManager.getWorker(workerId);

    DotLottieWorker._workerManager.assignAnimationToWorker(this._id, workerId);

    if (DotLottieWorker._wasmUrl) {
      this._sendMessage('setWasmUrl', { url: DotLottieWorker._wasmUrl });
    }

    this._create({
      ...config,
      renderConfig: {
        ...config.renderConfig,
        devicePixelRatio: config.renderConfig?.devicePixelRatio || getDefaultDPR(),
        // freezeOnOffscreen is true by default to prevent unnecessary rendering when the canvas is offscreen
        freezeOnOffscreen: config.renderConfig?.freezeOnOffscreen ?? true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this._worker.addEventListener('message', this._handleWorkerEvent.bind(this));
  }

  private async _handleWorkerEvent(event: MessageEvent): Promise<void> {
    const rpcResponse: RpcResponse<
      | 'onComplete'
      | 'onLoad'
      | 'onDestroy'
      | 'onUnfreeze'
      | 'onFrame'
      | 'onRender'
      | 'onFreeze'
      | 'onPause'
      | 'onPlay'
      | 'onStop'
      | 'onLoadError'
      | 'onRenderError'
      | 'onReady'
      | 'onLoop'
      | 'onStateMachineStart'
      | 'onStateMachineStop'
      | 'onStateMachineTransition'
      | 'onStateMachineStateEntered'
      | 'onStateMachineStateExit'
      | 'onStateMachineCustomEvent'
      | 'onStateMachineError'
      | 'onStateMachineBooleanInputValueChange'
      // eslint-disable-next-line no-secrets/no-secrets
      | 'onStateMachineNumericInputValueChange'
      | 'onStateMachineStringInputValueChange'
      | 'onStateMachineInputFired'
      | 'onStateMachineOpenUrl'
    > = event.data;

    if (!rpcResponse.id) {
      if (rpcResponse.method === 'onLoad' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);

        if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
          if (this._dotLottieInstanceState.renderConfig.freezeOnOffscreen) {
            OffscreenObserver.observe(this._canvas, this);

            // Check if canvas is initially offscreen and freeze if necessary
            if (!isElementInViewport(this._canvas)) {
              await this.freeze();
            }
          }

          if (this._dotLottieInstanceState.renderConfig.autoResize) {
            CanvasResizeObserver.observe(this._canvas, this);
          }
        }
      }

      if (rpcResponse.method === 'onComplete' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onDestroy' && rpcResponse.result.instanceId === this._id) {
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onUnfreeze' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._dotLottieInstanceState.isFrozen = false;
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onFrame' && rpcResponse.result.instanceId === this._id) {
        this._dotLottieInstanceState.currentFrame = (rpcResponse.result.event as FrameEvent).currentFrame;
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onRender' && rpcResponse.result.instanceId === this._id) {
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onFreeze' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onPause' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onPlay' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStop' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onLoadError' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onRenderError' && rpcResponse.result.instanceId === this._id) {
        // Dont update the instance, since the Core crashed its no long accessible. Calling _updateDotLottieInstanceState will cause it to hang indefinitely.
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onReady' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onLoop' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStateMachineStart' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._setupStateMachineListeners();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStateMachineStop' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._cleanupStateMachineListeners();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStateMachineTransition' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStateMachineStateEntered' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStateMachineStateExit' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStateMachineCustomEvent' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStateMachineError' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (
        rpcResponse.method === 'onStateMachineBooleanInputValueChange' &&
        rpcResponse.result.instanceId === this._id
      ) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (
        // eslint-disable-next-line no-secrets/no-secrets
        rpcResponse.method === 'onStateMachineNumericInputValueChange' &&
        rpcResponse.result.instanceId === this._id
      ) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStateMachineStringInputValueChange' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStateMachineInputFired' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStateMachineOpenUrl' && rpcResponse.result.instanceId === this._id) {
        await this._updateDotLottieInstanceState();

        const { event: urlEvent } = rpcResponse.result;

        this._eventManager.dispatch(urlEvent);

        const openUrlEvent = urlEvent as unknown as StateMachineOpenUrlEvent;

        if (IS_BROWSER) {
          window.open(openUrlEvent.url, openUrlEvent.target);
        }
      }
    }
  }

  private async _create(config: Config): Promise<void> {
    let offscreen: OffscreenCanvas;

    if (this._canvas instanceof HTMLCanvasElement) {
      offscreen = this._canvas.transferControlToOffscreen();
    } else {
      offscreen = this._canvas;
    }

    const { instanceId } = await this._sendMessage(
      'create',
      {
        instanceId: this._id,
        config: {
          ...config,
          // @ts-ignore
          canvas: offscreen,
        },
        ...getCanvasSize(this._canvas, config.renderConfig?.devicePixelRatio || getDefaultDPR()),
      },
      [offscreen],
    );

    if (instanceId !== this._id) {
      throw new Error('Instance ID mismatch');
    }

    this._created = true;

    await this._updateDotLottieInstanceState();
  }

  public get loopCount(): number {
    return this._dotLottieInstanceState.loopCount;
  }

  public get isLoaded(): boolean {
    return this._dotLottieInstanceState.isLoaded;
  }

  public get isPlaying(): boolean {
    return this._dotLottieInstanceState.isPlaying;
  }

  public get isPaused(): boolean {
    return this._dotLottieInstanceState.isPaused;
  }

  public get isStopped(): boolean {
    return this._dotLottieInstanceState.isStopped;
  }

  public get currentFrame(): number {
    return this._dotLottieInstanceState.currentFrame;
  }

  public get isFrozen(): boolean {
    return this._dotLottieInstanceState.isFrozen;
  }

  public get segmentDuration(): number {
    return this._dotLottieInstanceState.segmentDuration;
  }

  public get totalFrames(): number {
    return this._dotLottieInstanceState.totalFrames;
  }

  public get segment(): [number, number] | undefined {
    return this._dotLottieInstanceState.segment;
  }

  public get speed(): number {
    return this._dotLottieInstanceState.speed;
  }

  public get duration(): number {
    return this._dotLottieInstanceState.duration;
  }

  public get isReady(): boolean {
    return this._dotLottieInstanceState.isReady;
  }

  public get mode(): Mode {
    return this._dotLottieInstanceState.mode;
  }

  public get canvas(): HTMLCanvasElement | OffscreenCanvas | null {
    return this._canvas;
  }

  public get autoplay(): boolean {
    return this._dotLottieInstanceState.autoplay;
  }

  public get backgroundColor(): string {
    return this._dotLottieInstanceState.backgroundColor;
  }

  public get loop(): boolean {
    return this._dotLottieInstanceState.loop;
  }

  public get useFrameInterpolation(): boolean {
    return this._dotLottieInstanceState.useFrameInterpolation;
  }

  public get renderConfig(): RenderConfig {
    return this._dotLottieInstanceState.renderConfig;
  }

  public get manifest(): Manifest | null {
    return this._dotLottieInstanceState.manifest;
  }

  public get activeAnimationId(): string | undefined {
    return this._dotLottieInstanceState.activeAnimationId;
  }

  public get marker(): string | undefined {
    return this._dotLottieInstanceState.marker;
  }

  public get activeThemeId(): string | undefined {
    return this._dotLottieInstanceState.activeThemeId;
  }

  public get layout(): Layout | undefined {
    return this._dotLottieInstanceState.layout;
  }

  public async play(): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('play', { instanceId: this._id });
    await this._updateDotLottieInstanceState();

    /* 
      Check if the canvas is offscreen and freezing is enabled
      If freezeOnOffscreen is true and the canvas is currently outside the viewport,
      we immediately freeze the animation to avoid unnecessary rendering and performance overhead.
    */
    if (
      IS_BROWSER &&
      this._canvas instanceof HTMLCanvasElement &&
      this._dotLottieInstanceState.renderConfig.freezeOnOffscreen &&
      !isElementInViewport(this._canvas)
    ) {
      await this.freeze();
    }
  }

  public async pause(): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('pause', { instanceId: this._id });
    await this._updateDotLottieInstanceState();
  }

  public async stop(): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('stop', { instanceId: this._id });
    await this._updateDotLottieInstanceState();
  }

  public async setSpeed(speed: number): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('setSpeed', { instanceId: this._id, speed });
    await this._updateDotLottieInstanceState();
  }

  public async setMode(mode: Mode): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('setMode', { instanceId: this._id, mode });
    await this._updateDotLottieInstanceState();
  }

  public async setFrame(frame: number): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('setFrame', { frame, instanceId: this._id });
    await this._updateDotLottieInstanceState();
  }

  public async setSegment(start: number, end: number): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('setSegment', { instanceId: this._id, segment: [start, end] });
    await this._updateDotLottieInstanceState();
  }

  public async setRenderConfig(renderConfig: RenderConfig): Promise<void> {
    if (!this._created) return;

    const { devicePixelRatio, freezeOnOffscreen, ...restConfig } = renderConfig;

    await this._sendMessage('setRenderConfig', {
      instanceId: this._id,
      renderConfig: {
        ...this._dotLottieInstanceState.renderConfig,
        ...restConfig,
        // devicePixelRatio is a special case, it should be set to the default value if it's not provided
        devicePixelRatio: devicePixelRatio || getDefaultDPR(),
        freezeOnOffscreen: freezeOnOffscreen ?? true,
      },
    });

    await this._updateDotLottieInstanceState();

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      if (this._dotLottieInstanceState.renderConfig.autoResize) {
        CanvasResizeObserver.observe(this._canvas, this);
      } else {
        CanvasResizeObserver.unobserve(this._canvas);
      }

      if (this._dotLottieInstanceState.renderConfig.freezeOnOffscreen) {
        OffscreenObserver.observe(this._canvas, this);

        // Check if canvas is currently offscreen and freeze if necessary
        if (!isElementInViewport(this._canvas)) {
          await this.freeze();
        }
      } else {
        OffscreenObserver.unobserve(this._canvas);
        // If the animation was previously frozen, we need to unfreeze it now
        // to ensure it resumes rendering when the canvas is back onscreen.
        if (this._dotLottieInstanceState.isFrozen) {
          await this.unfreeze();
        }
      }
    }
  }

  public async setUseFrameInterpolation(useFrameInterpolation: boolean): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('setUseFrameInterpolation', { instanceId: this._id, useFrameInterpolation });
    await this._updateDotLottieInstanceState();
  }

  public async setTheme(themeId: string): Promise<boolean> {
    if (!this._created) return false;

    const result = this._sendMessage('setTheme', { instanceId: this._id, themeId });

    await this._updateDotLottieInstanceState();

    return result;
  }

  public async load(config: Omit<Config, 'canvas'>): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('load', { config, instanceId: this._id });
    await this._updateDotLottieInstanceState();
  }

  public async setLoop(loop: boolean): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('setLoop', { instanceId: this._id, loop });
    await this._updateDotLottieInstanceState();
  }

  public async resize(): Promise<void> {
    if (!this._created) return;

    const { height, width } = getCanvasSize(
      this._canvas,
      this._dotLottieInstanceState.renderConfig.devicePixelRatio || getDefaultDPR(),
    );

    await this._sendMessage('resize', { height, instanceId: this._id, width });
    await this._updateDotLottieInstanceState();
  }

  public async destroy(): Promise<void> {
    if (!this._created) return;

    this._created = false;

    await this._sendMessage('destroy', { instanceId: this._id });

    this._cleanupStateMachineListeners();

    DotLottieWorker._workerManager.unassignAnimationFromWorker(this._id);
    this._eventManager.removeAllEventListeners();

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      OffscreenObserver.unobserve(this._canvas);
      CanvasResizeObserver.unobserve(this._canvas);
    }
  }

  public async freeze(): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('freeze', { instanceId: this._id });
    await this._updateDotLottieInstanceState();
  }

  public async unfreeze(): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('unfreeze', { instanceId: this._id });
    await this._updateDotLottieInstanceState();
  }

  public async setBackgroundColor(backgroundColor: string): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('setBackgroundColor', { instanceId: this._id, backgroundColor });
    await this._updateDotLottieInstanceState();
  }

  public async loadAnimation(animationId: string): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('loadAnimation', { animationId, instanceId: this._id });
    await this._updateDotLottieInstanceState();
  }

  public async setLayout(layout: Layout): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('setLayout', { instanceId: this._id, layout });
    await this._updateDotLottieInstanceState();
  }

  private async _updateDotLottieInstanceState(): Promise<void> {
    if (!this._created) return;

    const result = await this._sendMessage('getDotLottieInstanceState', { instanceId: this._id });

    this._dotLottieInstanceState = result.state;
  }

  public markers(): Marker[] {
    return this._dotLottieInstanceState.markers;
  }

  public async setMarker(marker: string): Promise<void> {
    if (!this._created) return;

    await this._sendMessage('setMarker', { instanceId: this._id, marker });
    await this._updateDotLottieInstanceState();
  }

  public async setThemeData(themeData: string): Promise<boolean> {
    if (!this._created) return false;

    const loaded = await this._sendMessage('setThemeData', { instanceId: this._id, themeData });

    await this._updateDotLottieInstanceState();

    return loaded;
  }

  public async setViewport(x: number, y: number, width: number, height: number): Promise<boolean> {
    if (!this._created) return false;

    return this._sendMessage('setViewport', { x, y, width, height, instanceId: this._id });
  }

  public async animationSize(): Promise<{ height: number; width: number }> {
    if (!this._created) return { height: 0, width: 0 };

    return this._sendMessage('animationSize', { instanceId: this._id });
  }

  /**
   * @experimental
   * Start a tween animation between two frame values with custom easing
   * @param frame - Starting frame value
   * @param duration - Duration of the tween in seconds
   * @returns true if tween was started successfully
   */
  public async tween(frame: number, duration: number): Promise<boolean> {
    if (!this._created) return false;

    return this._sendMessage('tween', { instanceId: this._id, frame, duration });
  }

  /**
   * @experimental
   * Start a tween animation to a specific marker
   * @param marker - The marker name to tween to
   * @param duration - Duration of the tween in seconds
   * @returns true if tween was started successfully
   */
  public async tweenToMarker(marker: string, duration: number): Promise<boolean> {
    if (!this._created) return false;

    return this._sendMessage('tweenToMarker', { instanceId: this._id, marker, duration });
  }

  private async _sendMessage<T extends keyof MethodParamsMap>(
    method: T,
    params: MethodParamsMap[T],
    transfer?: Transferable[],
  ): Promise<MethodResultMap[T]> {
    const rpcRequest: RpcRequest<T> = {
      id: `dotlottie-request-${generateUniqueId()}`,
      method,
      params,
    };

    this._worker.postMessage(rpcRequest, transfer || []);

    return new Promise((resolve, reject) => {
      const onMessage = (event: MessageEvent): void => {
        const rpcResponse: RpcResponse<T> = event.data;

        // Check if the response corresponds to the request
        if (rpcResponse.id === rpcRequest.id) {
          this._worker.removeEventListener('message', onMessage);

          if (rpcResponse.error) {
            reject(new Error(`Failed to execute method ${method}: ${rpcResponse.error}`));
          } else {
            resolve(rpcResponse.result);
          }
        }
      };

      this._worker.addEventListener('message', onMessage);
    });
  }

  public addEventListener<T extends EventType>(type: T, listener: EventListener<T>): void {
    this._eventManager.addEventListener(type, listener);
  }

  public removeEventListener<T extends EventType>(type: T, listener?: EventListener<T>): void {
    this._eventManager.removeEventListener(type, listener);
  }

  public static setWasmUrl(url: string): void {
    DotLottieWorker._wasmUrl = url;
  }

  /**
   * @experimental
   * Load a state machine by ID
   * @param stateMachineId - The ID of the state machine to load
   * @returns true if the state machine was loaded successfully
   */
  public async stateMachineLoad(stateMachineId: string): Promise<boolean> {
    if (!this._created) return false;

    const result = await this._sendMessage('stateMachineLoad', { instanceId: this._id, stateMachineId });

    await this._updateDotLottieInstanceState();

    return result;
  }

  /**
   * @experimental
   * Load a state machine from data string
   * @param stateMachineData - The state machine data as a string
   * @returns true if the state machine was loaded successfully
   */
  public async stateMachineLoadData(stateMachineData: string): Promise<boolean> {
    if (!this._created) return false;

    const result = await this._sendMessage('stateMachineLoadData', { instanceId: this._id, stateMachineData });

    await this._updateDotLottieInstanceState();

    return result;
  }

  /**
   * @experimental
   * Start the state machine
   * @returns true if the state machine was started successfully
   */
  public async stateMachineStart(): Promise<boolean> {
    if (!this._created) return false;

    const started = await this._sendMessage('stateMachineStart', { instanceId: this._id });

    if (started) {
      this._setupStateMachineListeners();
      await this._updateDotLottieInstanceState();
    }

    return started;
  }

  /**
   * @experimental
   * Stop the state machine
   * @returns true if the state machine was stopped successfully
   */
  public async stateMachineStop(): Promise<boolean> {
    if (!this._created) return false;

    this._cleanupStateMachineListeners();

    return this._sendMessage('stateMachineStop', { instanceId: this._id });
  }

  /**
   * @experimental
   * Set a numeric input value for the state machine
   * @param name - The name of the numeric input
   * @param value - The numeric value to set
   * @returns true if the input was set successfully
   */
  public async stateMachineSetNumericInput(name: string, value: number): Promise<boolean> {
    if (!this._created) return false;

    return this._sendMessage('stateMachineSetNumericInput', { instanceId: this._id, name, value });
  }

  /**
   * @experimental
   * Set a boolean input value for the state machine
   * @param name - The name of the boolean input
   * @param value - The boolean value to set
   * @returns true if the input was set successfully
   */
  public async stateMachineSetBooleanInput(name: string, value: boolean): Promise<boolean> {
    if (!this._created) return false;

    return this._sendMessage('stateMachineSetBooleanInput', { instanceId: this._id, name, value });
  }

  /**
   * @experimental
   * Set a string input value for the state machine
   * @param name - The name of the string input
   * @param value - The string value to set
   * @returns true if the input was set successfully
   */
  public async stateMachineSetStringInput(name: string, value: string): Promise<boolean> {
    if (!this._created) return false;

    return this._sendMessage('stateMachineSetStringInput', { instanceId: this._id, name, value });
  }

  /**
   * @experimental
   * Get a numeric input value from the state machine
   * @param name - The name of the numeric input
   * @returns The numeric value or undefined if not found
   */
  public async stateMachineGetNumericInput(name: string): Promise<number | undefined> {
    if (!this._created) return undefined;

    return this._sendMessage('stateMachineGetNumericInput', { instanceId: this._id, name });
  }

  /**
   * @experimental
   * Get a boolean input value from the state machine
   * @param name - The name of the boolean input
   * @returns The boolean value or undefined if not found
   */
  public async stateMachineGetBooleanInput(name: string): Promise<boolean | undefined> {
    if (!this._created) return undefined;

    return this._sendMessage('stateMachineGetBooleanInput', { instanceId: this._id, name });
  }

  /**
   * @experimental
   * Get a string input value from the state machine
   * @param name - The name of the string input
   * @returns The string value or undefined if not found
   */
  public async stateMachineGetStringInput(name: string): Promise<string | undefined> {
    if (!this._created) return undefined;

    return this._sendMessage('stateMachineGetStringInput', { instanceId: this._id, name });
  }

  /**
   * @experimental
   * Fire an event in the state machine
   * @param name - The name of the event to fire
   */
  public async stateMachineFireEvent(name: string): Promise<void> {
    if (!this._created) return;

    this._sendMessage('stateMachineFireEvent', { instanceId: this._id, name });
  }

  /**
   * @experimental
   * Get the current status of the state machine
   * @returns The current status of the state machine as a string
   */
  public async stateMachineGetStatus(): Promise<string> {
    if (!this._created) return '';

    return this._sendMessage('stateMachineGetStatus', { instanceId: this._id });
  }

  /**
   * @experimental
   * Get the current state of the state machine
   * @returns The current state of the state machine as a string
   */
  public async stateMachineGetCurrentState(): Promise<string> {
    if (!this._created) return '';

    return this._sendMessage('stateMachineGetCurrentState', { instanceId: this._id });
  }

  /**
   * @experimental
   * Get the active state machine ID
   * @returns The active state machine ID as a string
   */
  public async stateMachineGetActiveId(): Promise<string> {
    if (!this._created) return '';

    return this._sendMessage('stateMachineGetActiveId', { instanceId: this._id });
  }

  /**
   * @experimental
   * Override the current state of the state machine
   * @param state - The state to override to
   * @param immediate - Whether to immediately transition to the state
   * @returns true if the state override was successful
   */
  public async stateMachineOverrideState(state: string, immediate: boolean = false): Promise<boolean> {
    if (!this._created) return false;

    return this._sendMessage('stateMachineOverrideState', { instanceId: this._id, state, immediate });
  }

  /**
   * @experimental
   * Get a specific state machine by ID
   * @param stateMachineId - The ID of the state machine to get
   * @returns The state machine data as a string
   */
  public async stateMachineGet(stateMachineId: string): Promise<string> {
    if (!this._created) return '';

    return this._sendMessage('stateMachineGet', { instanceId: this._id, stateMachineId });
  }

  /**
   * @experimental
   * Get the list of state machine listeners
   * @returns Array of listener names
   */
  public async stateMachineGetListeners(): Promise<string[]> {
    if (!this._created) return [];

    return this._sendMessage('stateMachineGetListeners', { instanceId: this._id });
  }

  /**
   * @experimental
   * Post a click event to the state machine
   * @param x - The x coordinate of the click
   * @param y - The y coordinate of the click
   * @returns The event result or undefined
   */
  public async stateMachinePostClickEvent(x: number, y: number): Promise<number | undefined> {
    if (!this._created) return undefined;

    return this._sendMessage('stateMachinePostClickEvent', { instanceId: this._id, x, y });
  }

  /**
   * @experimental
   * Post a pointer up event to the state machine
   * @param x - The x coordinate of the pointer
   * @param y - The y coordinate of the pointer
   * @returns The event result or undefined
   */
  public async stateMachinePostPointerUpEvent(x: number, y: number): Promise<number | undefined> {
    if (!this._created) return undefined;

    return this._sendMessage('stateMachinePostPointerUpEvent', { instanceId: this._id, x, y });
  }

  /**
   * @experimental
   * Post a pointer down event to the state machine
   * @param x - The x coordinate of the pointer
   * @param y - The y coordinate of the pointer
   * @returns The event result or undefined
   */
  public async stateMachinePostPointerDownEvent(x: number, y: number): Promise<number | undefined> {
    if (!this._created) return undefined;

    return this._sendMessage('stateMachinePostPointerDownEvent', { instanceId: this._id, x, y });
  }

  /**
   * @experimental
   * Post a pointer move event to the state machine
   * @param x - The x coordinate of the pointer
   * @param y - The y coordinate of the pointer
   * @returns The event result or undefined
   */
  public async stateMachinePostPointerMoveEvent(x: number, y: number): Promise<number | undefined> {
    if (!this._created) return undefined;

    return this._sendMessage('stateMachinePostPointerMoveEvent', { instanceId: this._id, x, y });
  }

  /**
   * @experimental
   * Post a pointer enter event to the state machine
   * @param x - The x coordinate of the pointer
   * @param y - The y coordinate of the pointer
   * @returns The event result or undefined
   */
  public async stateMachinePostPointerEnterEvent(x: number, y: number): Promise<number | undefined> {
    if (!this._created) return undefined;

    return this._sendMessage('stateMachinePostPointerEnterEvent', { instanceId: this._id, x, y });
  }

  /**
   * @experimental
   * Post a pointer exit event to the state machine
   * @param x - The x coordinate of the pointer
   * @param y - The y coordinate of the pointer
   * @returns The event result or undefined
   */
  public async stateMachinePostPointerExitEvent(x: number, y: number): Promise<number | undefined> {
    if (!this._created) return undefined;

    return this._sendMessage('stateMachinePostPointerExitEvent', { instanceId: this._id, x, y });
  }

  private _onClick(event: MouseEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this._sendMessage('stateMachinePostClickEvent', { instanceId: this._id, x: position.x, y: position.y });
    }
  }

  private _onPointerUp(event: PointerEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this._sendMessage('stateMachinePostPointerUpEvent', { instanceId: this._id, x: position.x, y: position.y });
    }
  }

  private _onPointerDown(event: PointerEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this._sendMessage('stateMachinePostPointerDownEvent', { instanceId: this._id, x: position.x, y: position.y });
    }
  }

  private _onPointerMove(event: PointerEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this._sendMessage('stateMachinePostPointerMoveEvent', { instanceId: this._id, x: position.x, y: position.y });
    }
  }

  private _onPointerEnter(event: PointerEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this._sendMessage('stateMachinePostPointerEnterEvent', { instanceId: this._id, x: position.x, y: position.y });
    }
  }

  private _onPointerLeave(event: PointerEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this._sendMessage('stateMachinePostPointerExitEvent', { instanceId: this._id, x: position.x, y: position.y });
    }
  }

  private async _setupStateMachineListeners(): Promise<void> {
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement && this.isLoaded) {
      const listeners = await this._sendMessage('stateMachineGetListeners', { instanceId: this._id });

      if (listeners.length === 0) {
        return;
      }

      if (listeners.includes('Click')) {
        this._canvas.addEventListener('click', this._onClick.bind(this));
      }

      if (listeners.includes('PointerUp')) {
        this._canvas.addEventListener('pointerup', this._onPointerUp.bind(this));
      }

      if (listeners.includes('PointerDown')) {
        this._canvas.addEventListener('pointerdown', this._onPointerDown.bind(this));
      }

      if (listeners.includes('PointerMove')) {
        this._canvas.addEventListener('pointermove', this._onPointerMove.bind(this));
      }

      if (listeners.includes('PointerEnter')) {
        this._canvas.addEventListener('pointerenter', this._onPointerEnter.bind(this));
      }

      if (listeners.includes('PointerExit')) {
        this._canvas.addEventListener('pointerleave', this._onPointerLeave.bind(this));
      }
    }
  }

  private _cleanupStateMachineListeners(): void {
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      this._canvas.removeEventListener('click', this._onClick.bind(this));
      this._canvas.removeEventListener('pointerup', this._onPointerUp.bind(this));
      this._canvas.removeEventListener('pointerdown', this._onPointerDown.bind(this));
      this._canvas.removeEventListener('pointermove', this._onPointerMove.bind(this));
      this._canvas.removeEventListener('pointerenter', this._onPointerEnter.bind(this));
      this._canvas.removeEventListener('pointerleave', this._onPointerLeave.bind(this));
    }
  }
}
