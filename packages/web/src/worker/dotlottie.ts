import { IS_BROWSER } from '../constants';
import type { EventType, EventListener, FrameEvent } from '../event-manager';
import { EventManager } from '../event-manager';
import type { Config, Layout, Manifest, Mode, RenderConfig } from '../types';

import type { MethodParamsMap, MethodResultMap, RpcRequest, RpcResponse } from './types';
import { WorkerManager } from './worker-manager';

function getCanvasSize(canvas: HTMLCanvasElement | OffscreenCanvas): { height: number; width: number } {
  if (canvas instanceof OffscreenCanvas) {
    return { width: canvas.width, height: canvas.height };
  }

  const { height, width } = canvas.getBoundingClientRect();

  return { width: width * window.devicePixelRatio, height: height * window.devicePixelRatio };
}

function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

interface DotLottieInstanceState {
  activeAnimationId: string;
  activeThemeId: string;
  autoplay: boolean;
  backgroundColor: string;
  currentFrame: number;
  duration: number;
  isFrozen: boolean;
  isLoaded: boolean;
  isPaused: boolean;
  isPlaying: boolean;
  isStopped: boolean;
  layout: Layout;
  loop: boolean;
  marker: string;
  mode: Mode;
  renderConfig: RenderConfig;
  segment: [number, number];
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

  private readonly _canvas: HTMLCanvasElement;

  private readonly _dotLottieInstanceState: DotLottieInstanceState = {
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
      devicePixelRatio: window.devicePixelRatio,
    },
    activeAnimationId: '',
    activeThemeId: '',
    layout: {
      fit: 'contain',
      align: [0.5, 0.5],
    },
    marker: '',
  };

  private static _wasmUrl: string = '';

  public constructor(config: Config & { workerId?: string }) {
    this._canvas = config.canvas;

    this._id = `dotlottie-${generateUniqueId()}`;
    const workerId = config.workerId || 'defaultWorker';

    // creates or gets the worker
    this._worker = DotLottieWorker._workerManager.getWorker(workerId);

    DotLottieWorker._workerManager.assignAnimationToWorker(this._id, workerId);
    if (DotLottieWorker._wasmUrl) {
      this._sendMessage('setWasmUrl', { wasmUrl: DotLottieWorker._wasmUrl });
    }

    this._create(config);

    this._worker.addEventListener('message', this._handleWorkerEvent.bind(this));
  }

  private _handleWorkerEvent(event: MessageEvent): void {
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
    > = event.data;

    if (!rpcResponse.id) {
      if (rpcResponse.method === 'onLoad' && rpcResponse.result.instanceId === this._id) {
        this._dotLottieInstanceState.isLoaded = true;
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onComplete' && rpcResponse.result.instanceId === this._id) {
        this._dotLottieInstanceState.isStopped = true;
        this._dotLottieInstanceState.isPlaying = false;
        this._dotLottieInstanceState.isPaused = false;

        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onDestroy' && rpcResponse.result.instanceId === this._id) {
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onUnfreeze' && rpcResponse.result.instanceId === this._id) {
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
        this._dotLottieInstanceState.isFrozen = true;
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onPause' && rpcResponse.result.instanceId === this._id) {
        this._dotLottieInstanceState.isPaused = true;
        this._dotLottieInstanceState.isPlaying = false;
        this._dotLottieInstanceState.isStopped = false;
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onPlay' && rpcResponse.result.instanceId === this._id) {
        this._dotLottieInstanceState.isPaused = false;
        this._dotLottieInstanceState.isPlaying = true;
        this._dotLottieInstanceState.isStopped = false;
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onStop' && rpcResponse.result.instanceId === this._id) {
        this._dotLottieInstanceState.isPaused = false;
        this._dotLottieInstanceState.isPlaying = false;
        this._dotLottieInstanceState.isStopped = true;
        this._eventManager.dispatch(rpcResponse.result.event);
      }

      if (rpcResponse.method === 'onLoadError' && rpcResponse.result.instanceId === this._id) {
        this._dotLottieInstanceState.isLoaded = false;
        this._eventManager.dispatch(rpcResponse.result.event);
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

    await this._sendMessage(
      'create',
      {
        instanceId: this._id,
        config: {
          ...config,
          // @ts-ignore
          canvas: offscreen,
        },
        ...getCanvasSize(this._canvas),
      },
      [offscreen],
    );
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

  public get segment(): [number, number] {
    return [0, 0];
  }

  public get speed(): number {
    return this._dotLottieInstanceState.speed;
  }

  public get duration(): number {
    return this._dotLottieInstanceState.duration;
  }

  public get mode(): Mode {
    return this._dotLottieInstanceState.mode;
  }

  public get canvas(): HTMLCanvasElement | null {
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
    return null;
  }

  public get activeAnimationId(): string {
    return this._dotLottieInstanceState.activeAnimationId;
  }

  public get marker(): string {
    return this._dotLottieInstanceState.marker;
  }

  public get activeThemeId(): string {
    return this._dotLottieInstanceState.activeThemeId;
  }

  public get layout(): Layout {
    return this._dotLottieInstanceState.layout;
  }

  public async play(): Promise<void> {
    await this._sendMessage('play', { instanceId: this._id });
  }

  public async pause(): Promise<void> {
    await this._sendMessage('pause', { instanceId: this._id });
  }

  public async stop(): Promise<void> {
    await this._sendMessage('stop', { instanceId: this._id });
  }

  public async setSpeed(speed: number): Promise<void> {
    await this._sendMessage('setSpeed', { instanceId: this._id, speed });
  }

  public async setMode(mode: Mode): Promise<void> {
    await this._sendMessage('setMode', { instanceId: this._id, mode });
  }

  public async setFrame(frame: number): Promise<void> {
    await this._sendMessage('setFrame', { frame, instanceId: this._id });
  }

  public async setSegment(start: number, end: number): Promise<void> {
    await this._sendMessage('setSegment', { instanceId: this._id, segment: [start, end] });
  }

  public async setRenderConfig(renderConfig: RenderConfig): Promise<void> {
    await this._sendMessage('setRenderConfig', { instanceId: this._id, renderConfig });
  }

  public async setUseFrameInterpolation(useFrameInterpolation: boolean): Promise<void> {
    await this._sendMessage('setUseFrameInterpolation', { instanceId: this._id, useFrameInterpolation });
  }

  public async loadTheme(themeId: string): Promise<boolean> {
    const result = await this._sendMessage('loadTheme', { instanceId: this._id, themeId });

    return result.success;
  }

  public async load(config: Omit<Config, 'canvas'>): Promise<void> {
    await this._sendMessage('load', { config, instanceId: this._id });
  }

  public async setLoop(loop: boolean): Promise<void> {
    await this._sendMessage('setLoop', { instanceId: this._id, loop });
  }

  public async resize(): Promise<void> {
    const { height, width } = getCanvasSize(this._canvas);

    await this._sendMessage('resize', { height, instanceId: this._id, width });
  }

  public async destroy(): Promise<void> {
    const result = await this._sendMessage('destroy', { instanceId: this._id });

    if (result.success) {
      this._cleanupStateMachineListeners();

      DotLottieWorker._workerManager.unassignAnimationFromWorker(this._id);
      this._eventManager.removeAllEventListeners();
    }
  }

  public async freeze(): Promise<void> {
    await this._sendMessage('freeze', { instanceId: this._id });
  }

  public async unfreeze(): Promise<void> {
    await this._sendMessage('unfreeze', { instanceId: this._id });
  }

  public async setBackgroundColor(backgroundColor: string): Promise<void> {
    await this._sendMessage('setBackgroundColor', { instanceId: this._id, backgroundColor });
  }

  public async loadAnimation(animationId: string): Promise<void> {
    await this._sendMessage('loadAnimation', { animationId, instanceId: this._id });
  }

  public markers(): string[] {
    return [];
  }

  public async setMarker(marker: string): Promise<void> {
    await this._sendMessage('setMarker', { instanceId: this._id, marker });
  }

  public async loadThemeData(themeData: string): Promise<boolean> {
    const result = await this._sendMessage('loadThemeData', { instanceId: this._id, themeData });

    return result.success;
  }

  public async setViewport(x: number, y: number, width: number, height: number): Promise<void> {
    await this._sendMessage('setViewport', { x, y, width, height, instanceId: this._id });
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
            reject(rpcResponse.error);
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
    this._wasmUrl = url;
  }

  public async loadStateMachine(stateMachineId: string): Promise<boolean> {
    const result = await this._sendMessage('loadStateMachine', { instanceId: this._id, stateMachineId });

    return result.success;
  }

  public async startStateMachine(): Promise<boolean> {
    this._setupStateMachineListeners();

    const result = await this._sendMessage('startStateMachine', { instanceId: this._id });

    return result.success;
  }

  public async stopStateMachine(): Promise<boolean> {
    this._cleanupStateMachineListeners();

    const result = await this._sendMessage('stopStateMachine', { instanceId: this._id });

    return result.success;
  }

  public async postStateMachineEvent(event: string): Promise<boolean> {
    const result = await this._sendMessage('postStateMachineEvent', { event, instanceId: this._id });

    return result.success;
  }

  public async getStateMachineListeners(): Promise<string[]> {
    const { listeners } = await this._sendMessage('getStateMachineListeners', { instanceId: this._id });

    return listeners;
  }

  private _getPointerPosition(event: PointerEvent): { x: number; y: number } {
    const rect = (this._canvas as HTMLCanvasElement).getBoundingClientRect();
    const scaleX = this._canvas.width / rect.width;
    const scaleY = this._canvas.height / rect.height;

    const devicePixelRatio = this._dotLottieInstanceState.renderConfig.devicePixelRatio || window.devicePixelRatio || 1;
    const x = ((event.clientX - rect.left) * scaleX) / devicePixelRatio;
    const y = ((event.clientY - rect.top) * scaleY) / devicePixelRatio;

    return {
      x,
      y,
    };
  }

  private _onPointerUp(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.postStateMachineEvent(`OnPointerUp: ${x} ${y}`);
  }

  private _onPointerDown(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.postStateMachineEvent(`OnPointerDown: ${x} ${y}`);
  }

  private _onPointerMove(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.postStateMachineEvent(`OnPointerMove: ${x} ${y}`);
  }

  private _onPointerEnter(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.postStateMachineEvent(`OnPointerEnter: ${x} ${y}`);
  }

  private _onPointerLeave(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.postStateMachineEvent(`OnPointerExit: ${x} ${y}`);
  }

  private _onComplete(): void {
    this.postStateMachineEvent('OnComplete');
  }

  private async _setupStateMachineListeners(): Promise<void> {
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement && this.isLoaded) {
      const { listeners } = await this._sendMessage('getStateMachineListeners', { instanceId: this._id });

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

      if (listeners.includes('Complete')) {
        this.addEventListener('complete', this._onComplete.bind(this));
      }
    }
  }

  private _cleanupStateMachineListeners(): void {
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      this._canvas.removeEventListener('pointerup', this._onPointerUp.bind(this));
      this._canvas.removeEventListener('pointerdown', this._onPointerDown.bind(this));
      this._canvas.removeEventListener('pointermove', this._onPointerMove.bind(this));
      this._canvas.removeEventListener('pointerenter', this._onPointerEnter.bind(this));
      this._canvas.removeEventListener('pointerleave', this._onPointerLeave.bind(this));
      this.removeEventListener('complete', this._onComplete.bind(this));
    }
  }
}
