import type { EventType, EventListener } from '../event-manager';
import { EventManager } from '../event-manager';
import type { Config, Layout, Manifest, Mode, RenderConfig } from '../types';

import type { MethodParamsMap, MethodResultMap, RpcRequest } from './types';
import { WorkerManager } from './worker-manager';

function getCanvasSize(canvas: HTMLCanvasElement | OffscreenCanvas): { height: number; width: number } {
  if (canvas instanceof OffscreenCanvas) {
    return { width: canvas.width, height: canvas.height };
  }

  const { height, width } = canvas.getBoundingClientRect();

  return { width: width * window.devicePixelRatio, height: height * window.devicePixelRatio };
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

  private readonly _isLoaded: boolean = false;

  private readonly _state: 'playing' | 'paused' | 'stopped' = 'stopped';

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

    let offscreen: OffscreenCanvas;

    if (config.canvas instanceof HTMLCanvasElement) {
      offscreen = config.canvas.transferControlToOffscreen();
    } else {
      offscreen = config.canvas;
    }

    this._id = this._generateUniqueId();
    const workerId = config.workerId || 'defaultWorker';
    const worker = DotLottieWorker._workerManager.getWorker(workerId);

    DotLottieWorker._workerManager.assignAnimationToWorker(this._id, workerId);
    if (DotLottieWorker._wasmUrl) this._sendMessage('setWasmUrl', { wasmUrl: DotLottieWorker._wasmUrl });

    this._sendMessage(
      'create',
      {
        config: {
          ...config,
          canvas: offscreen,
        },
        ...getCanvasSize(this._canvas),
      },
      [offscreen],
    );
  }

  private _generateUniqueId(): string {
    return `dotlottie_animation_${Math.random().toString(36).substr(2, 9)}`;
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

  public async play(): Promise<void> {}

  public async pause(): Promise<void> {}

  public async stop(): Promise<void> {}

  public async setSpeed(speed: number): Promise<void> {}

  public async setMode(mode: Mode): Promise<void> {}

  public async setFrame(frame: number): Promise<void> {}

  public async setSegment(start: number, end: number): Promise<void> {}

  public async setRenderConfig(renderConfig: RenderConfig): Promise<void> {}

  public async setUseFrameInterpolation(useFrameInterpolation: boolean): Promise<void> {}

  public async loadTheme(themeId: string): Promise<boolean> {}

  public async load(config: Omit<Config, 'canvas'>): Promise<void> {}

  public async resize(): Promise<void> {}

  public async destroy(): Promise<void> {}

  public async freeze(): Promise<void> {}

  public async unfreeze(): Promise<void> {}

  public async setBackgroundColor(backgroundColor: string): Promise<void> {}

  public async loadAnimation(animationId: string): Promise<void> {}

  public markers(): string[] {
    return [];
  }

  public async setMarker(marker: string): Promise<void> {}

  public async loadThemeData(themeData: string): Promise<boolean> {}

  public async setViewport(x: number, y: number, width: number, height: number): Promise<void> {}

  private async _sendMessage(
    method: RpcRequest<keyof MethodParamsMap>['method'],
    params: RpcRequest<keyof MethodParamsMap>['params'],
    transfer?: Transferable[],
  ): Promise<keyof MethodResultMap> {
    // TODO: implement
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
}
