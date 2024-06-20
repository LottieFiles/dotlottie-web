import { AnimationFrameManager } from './animation-frame-manager';
import { IS_BROWSER } from './constants';
import type { DotLottiePlayer, MainModule, Mode as CoreMode, VectorFloat, Marker, Fit as CoreFit } from './core';
import { DotLottieWasmLoader } from './core';
import type { EventListener, EventType } from './event-manager';
import { EventManager } from './event-manager';

export interface RenderConfig {
  devicePixelRatio?: number;
}

export type Mode = 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';

export type Data = string | ArrayBuffer | Record<string, unknown>;

export type Fit = 'contain' | 'cover' | 'fill' | 'none' | 'fit-width' | 'fit-height';

export interface Layout {
  align: [number, number];
  fit: Fit;
}

export interface Config {
  autoplay?: boolean;
  backgroundColor?: string;
  canvas: HTMLCanvasElement;
  data?: Data;
  layout?: Layout;
  loop?: boolean;
  marker?: string;
  mode?: Mode;
  renderConfig?: RenderConfig;
  segment?: [number, number];
  speed?: number;
  src?: string;
  useFrameInterpolation?: boolean;
}

export interface Manifest {
  activeAnimationId?: string;
  animations: Array<{
    autoplay?: boolean;
    defaultTheme?: string;
    direction?: 1 | -1;
    hover?: boolean;
    id: string;
    intermission?: number;
    loop?: boolean | number;
    playMode?: 'bounce' | 'normal';
    speed?: number;
    themeColor?: string;
  }>;
  author?: string;
  custom?: Record<string, unknown>;
  description?: string;
  generator?: string;
  keywords?: string;
  revision?: number;
  states?: string[];
  themes?: Array<{ animations: string[]; id: string }>;
  version?: string;
}

const createCoreMode = (mode: Mode, module: MainModule): CoreMode => {
  if (mode === 'reverse') {
    return module.Mode.Reverse;
  } else if (mode === 'bounce') {
    return module.Mode.Bounce;
  } else if (mode === 'reverse-bounce') {
    return module.Mode.ReverseBounce;
  } else {
    return module.Mode.Forward;
  }
};

const createCoreFit = (fit: Fit, module: MainModule): CoreFit => {
  if (fit === 'contain') {
    return module.Fit.Contain;
  } else if (fit === 'cover') {
    return module.Fit.Cover;
  } else if (fit === 'fill') {
    return module.Fit.Fill;
  } else if (fit === 'fit-height') {
    return module.Fit.FitHeight;
  } else if (fit === 'fit-width') {
    return module.Fit.FitWidth;
  } else {
    return module.Fit.None;
  }
};

const createCoreAlign = (align: [number, number], module: MainModule): VectorFloat => {
  const coreAlign = new module.VectorFloat();

  coreAlign.push_back(align[0]);
  coreAlign.push_back(align[1]);

  return coreAlign;
};

const createCoreSegment = (segment: number[], module: MainModule): VectorFloat => {
  const coresegment = new module.VectorFloat();

  if (segment.length !== 2) return coresegment;

  coresegment.push_back(segment[0] as number);
  coresegment.push_back(segment[1] as number);

  return coresegment;
};

export class DotLottie {
  private readonly _canvas: HTMLCanvasElement | OffscreenCanvas;

  private _context: CanvasRenderingContext2D | null;

  private readonly _eventManager: EventManager;

  private _animationFrameId: number | null = null;

  private readonly _frameManager: AnimationFrameManager;

  private _dotLottieCore: DotLottiePlayer | null = null;

  private _wasmModule: MainModule | null = null;

  private _renderConfig: RenderConfig = {};

  private _isFrozen: boolean = false;

  private _backgroundColor: string | null = null;

  public constructor(config: Config) {
    this._canvas = config.canvas;
    this._context = this._canvas.getContext('2d');
    this._eventManager = new EventManager();
    this._frameManager = new AnimationFrameManager();
    this._renderConfig = config.renderConfig ?? {};

    DotLottieWasmLoader.load()
      .then((module) => {
        this._wasmModule = module;

        this._dotLottieCore = new module.DotLottiePlayer({
          autoplay: config.autoplay ?? false,
          backgroundColor: 0,
          loopAnimation: config.loop ?? false,
          mode: createCoreMode(config.mode ?? 'forward', module),
          segment: createCoreSegment(config.segment ?? [], module),
          speed: config.speed ?? 1,
          useFrameInterpolation: config.useFrameInterpolation ?? true,
          marker: config.marker ?? '',
          layout: config.layout
            ? {
                align: createCoreAlign(config.layout.align, module),
                fit: createCoreFit(config.layout.fit, module),
              }
            : module.createDefaultLayout(),
        });

        if (config.data) {
          this._loadFromData(config.data);
        } else if (config.src) {
          this._loadFromSrc(config.src);
        }

        if (config.backgroundColor) {
          this.setBackgroundColor(config.backgroundColor);
        }
      })
      .catch((error) => {
        this._eventManager.dispatch({
          type: 'loadError',
          error: new Error(`Failed to load wasm module: ${error}`),
        });
      });
  }

  private _loadFromSrc(src: string): void {
    async function load(): Promise<string | ArrayBuffer> {
      const response = await fetch(src);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch the animation data from URL: ${src}. ${response.status}: ${response.statusText}`,
        );
      }

      const contentType = (response.headers.get('content-type') ?? '').trim();

      let data: string | ArrayBuffer;

      if (['application/json', 'text/plain'].some((type) => contentType.startsWith(type))) {
        data = await response.text();
      } else {
        data = await response.arrayBuffer();
      }

      return data;
    }

    load()
      .then((data) => {
        this._loadFromData(data);
      })
      .catch((error) => {
        this._eventManager.dispatch({
          type: 'loadError',
          error: new Error(`Failed to load animation data from URL: ${src}. ${error}`),
        });
      });
  }

  private _loadFromData(data: Data): void {
    if (this._dotLottieCore === null) return;

    const width = this._canvas.width;
    const height = this._canvas.height;

    let loaded = false;

    if (typeof data === 'string') {
      loaded = this._dotLottieCore.loadAnimationData(data, width, height);
    } else if (data instanceof ArrayBuffer) {
      loaded = this._dotLottieCore.loadDotLottieData(data, width, height);
    } else if (typeof data === 'object') {
      loaded = this._dotLottieCore.loadAnimationData(JSON.stringify(data), width, height);
    } else {
      this._eventManager.dispatch({
        type: 'loadError',
        error: new Error('Unsupported data type for animation data. Expected a string or ArrayBuffer.'),
      });

      return;
    }

    if (loaded) {
      this._eventManager.dispatch({ type: 'load' });

      if (IS_BROWSER) {
        this.resize();
      }

      this._eventManager.dispatch({
        type: 'frame',
        currentFrame: this._dotLottieCore.currentFrame(),
      });

      this._render();

      if (this._dotLottieCore.config().autoplay) {
        this._dotLottieCore.play();
        if (this._dotLottieCore.isPlaying()) {
          this._eventManager.dispatch({ type: 'play' });
          this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this));
        } else {
          console.error('something went wrong, the animation was suppose to autoplay');
        }
      }
    } else {
      this._eventManager.dispatch({
        type: 'loadError',
        error: new Error('Failed to load animation data'),
      });
    }
  }

  public get activeAnimationId(): string | undefined {
    return this._dotLottieCore?.activeAnimationId();
  }

  public get activeThemeId(): string | undefined {
    return this._dotLottieCore?.activeThemeId();
  }

  public get layout(): Layout | undefined {
    const layout = this._dotLottieCore?.config().layout;

    if (layout) {
      return {
        align: [layout.align.get(0) as number, layout.align.get(1) as number],
        fit: ((): Fit => {
          switch (layout.fit) {
            case this._wasmModule?.Fit.Contain:
              return 'contain';

            case this._wasmModule?.Fit.Cover:
              return 'cover';

            case this._wasmModule?.Fit.Fill:
              return 'fill';

            case this._wasmModule?.Fit.FitHeight:
              return 'fit-height';

            case this._wasmModule?.Fit.FitWidth:
              return 'fit-width';

            case this._wasmModule?.Fit.None:
              return 'none';

            default:
              return 'contain';
          }
        })(),
      };
    }

    return undefined;
  }

  public get marker(): string | undefined {
    const marker = this._dotLottieCore?.config().marker as string | undefined;

    return marker;
  }

  public get manifest(): Manifest | null {
    try {
      const manifest = this._dotLottieCore?.manifestString();

      if (this._dotLottieCore === null || !manifest) return null;

      const manifestJson = JSON.parse(manifest);

      if (Object.keys(manifestJson).length === 0) return null;

      return manifestJson as Manifest;
    } catch (_err) {
      return null;
    }
  }

  public get renderConfig(): RenderConfig {
    return this._renderConfig;
  }

  public get segment(): [number, number] | undefined {
    const segment = this._dotLottieCore?.config().segment;

    if (segment && segment.size() === 2) {
      return [segment.get(0) as number, segment.get(1) as number];
    }

    return undefined;
  }

  public get loop(): boolean {
    return this._dotLottieCore?.config().loopAnimation ?? false;
  }

  public get mode(): Mode {
    const mode = this._dotLottieCore?.config().mode;

    if (mode === this._wasmModule?.Mode.Reverse) {
      return 'reverse';
    } else if (mode === this._wasmModule?.Mode.Bounce) {
      return 'bounce';
    } else if (mode === this._wasmModule?.Mode.ReverseBounce) {
      return 'reverse-bounce';
    } else {
      return 'forward';
    }
  }

  public get isFrozen(): boolean {
    return this._isFrozen;
  }

  public get backgroundColor(): string {
    return this._backgroundColor ?? '';
  }

  public get autoplay(): boolean {
    return this._dotLottieCore?.config().autoplay ?? false;
  }

  public get useFrameInterpolation(): boolean {
    return this._dotLottieCore?.config().useFrameInterpolation ?? false;
  }

  public get speed(): number {
    return this._dotLottieCore?.config().speed ?? 0;
  }

  public get isLoaded(): boolean {
    return this._dotLottieCore?.isLoaded() ?? false;
  }

  public get isPlaying(): boolean {
    return this._dotLottieCore?.isPlaying() ?? false;
  }

  public get isPaused(): boolean {
    return this._dotLottieCore?.isPaused() ?? false;
  }

  public get isStopped(): boolean {
    return this._dotLottieCore?.isStopped() ?? false;
  }

  public get currentFrame(): number {
    return this._dotLottieCore?.currentFrame() ?? 0;
  }

  public get loopCount(): number {
    return this._dotLottieCore?.loopCount() ?? 0;
  }

  public get totalFrames(): number {
    return this._dotLottieCore?.totalFrames() ?? 0;
  }

  public get duration(): number {
    return this._dotLottieCore?.duration() ?? 0;
  }

  public get segmentDuration(): number {
    return this._dotLottieCore?.segmentDuration() ?? 0;
  }

  public get canvas(): HTMLCanvasElement | OffscreenCanvas {
    return this._canvas;
  }

  public load(config: Omit<Config, 'canvas'>): void {
    if (this._dotLottieCore === null || this._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      autoplay: config.autoplay ?? false,
      backgroundColor: 0,
      loopAnimation: config.loop ?? false,
      mode: createCoreMode(config.mode ?? 'forward', this._wasmModule),
      segment: createCoreSegment(config.segment ?? [], this._wasmModule),
      speed: config.speed ?? 1,
      useFrameInterpolation: config.useFrameInterpolation ?? true,
      marker: config.marker ?? '',
      layout: config.layout
        ? {
            align: createCoreAlign(config.layout.align, this._wasmModule),
            fit: createCoreFit(config.layout.fit, this._wasmModule),
          }
        : this._wasmModule.createDefaultLayout(),
    });

    if (config.data) {
      this._loadFromData(config.data);
    } else if (config.src) {
      this._loadFromSrc(config.src);
    }

    this.setBackgroundColor(config.backgroundColor ?? '');
  }

  private _render(): boolean {
    if (this._dotLottieCore === null || this._context === null) return false;

    const rendered = this._dotLottieCore.render();

    if (rendered) {
      const buffer = this._dotLottieCore.buffer() as Uint8Array;
      const clampedBuffer = new Uint8ClampedArray(buffer, 0, this._canvas.width * this._canvas.height * 4);

      let imageData = null;

      /* 
        In Node.js, the ImageData constructor is not available. 
        You can use createImageData function in the canvas context to create ImageData object.
      */
      if (typeof ImageData === 'undefined') {
        imageData = this._context.createImageData(this._canvas.width, this._canvas.height);
        imageData.data.set(clampedBuffer);
      } else {
        imageData = new ImageData(clampedBuffer, this._canvas.width, this._canvas.height);
      }

      this._context.putImageData(imageData, 0, 0);

      this._eventManager.dispatch({
        type: 'render',
        currentFrame: this._dotLottieCore.currentFrame(),
      });

      return true;
    }

    return false;
  }

  private _draw(): void {
    if (this._dotLottieCore === null || this._context === null || !this._dotLottieCore.isPlaying()) return;

    const nextFrame = this._dotLottieCore.requestFrame();

    const updated = this._dotLottieCore.setFrame(nextFrame);

    if (updated) {
      this._eventManager.dispatch({
        type: 'frame',
        currentFrame: this._dotLottieCore.currentFrame(),
      });

      const rendered = this._render();

      if (rendered) {
        // handle loop or complete
        if (this._dotLottieCore.isComplete()) {
          if (this._dotLottieCore.config().loopAnimation) {
            this._eventManager.dispatch({
              type: 'loop',
              loopCount: this._dotLottieCore.loopCount(),
            });
          } else {
            this._eventManager.dispatch({ type: 'complete' });
          }
        }
      }
    }

    this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this));
  }

  public play(): void {
    if (this._dotLottieCore === null) return;

    const ok = this._dotLottieCore.play();

    this._isFrozen = false;

    if (ok) {
      this._eventManager.dispatch({ type: 'play' });
      this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this));
    }
  }

  public pause(): void {
    if (this._dotLottieCore === null) return;

    const ok = this._dotLottieCore.pause();

    if (ok) {
      this._eventManager.dispatch({ type: 'pause' });
    }
  }

  public stop(): void {
    if (this._dotLottieCore === null) return;

    const ok = this._dotLottieCore.stop();

    if (ok) {
      this._eventManager.dispatch({ type: 'frame', currentFrame: this._dotLottieCore.currentFrame() });

      this._render();

      this._eventManager.dispatch({ type: 'stop' });
    }
  }

  public setFrame(frame: number): void {
    if (this._dotLottieCore === null) return;

    if (frame < 0 || frame > this._dotLottieCore.totalFrames()) return;

    const ok = this._dotLottieCore.seek(frame);

    if (ok) {
      this._eventManager.dispatch({ type: 'frame', currentFrame: this._dotLottieCore.currentFrame() });

      this._render();
    }
  }

  public setSpeed(speed: number): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      speed,
    });
  }

  public setBackgroundColor(color: string): void {
    if (this._dotLottieCore === null) return;

    if (this._canvas instanceof HTMLCanvasElement) {
      this._canvas.style.backgroundColor = color;
    }

    this._backgroundColor = color;
  }

  public setLoop(loop: boolean): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      loopAnimation: loop,
    });
  }

  public setUseFrameInterpolation(useFrameInterpolation: boolean): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      useFrameInterpolation,
    });
  }

  public addEventListener<T extends EventType>(type: T, listener: EventListener<T>): void {
    this._eventManager.addEventListener(type, listener);
  }

  public removeEventListener<T extends EventType>(type: T, listener?: EventListener<T>): void {
    this._eventManager.removeEventListener(type, listener);
  }

  public destroy(): void {
    this._dotLottieCore?.delete();
    this._dotLottieCore = null;
    this._context = null;

    this._eventManager.dispatch({
      type: 'destroy',
    });

    this._eventManager.removeAllEventListeners();
    this._cleanupStateMachineListeners();
  }

  public freeze(): void {
    if (this._animationFrameId === null) return;

    this._frameManager.cancelAnimationFrame(this._animationFrameId);
    this._animationFrameId = null;

    this._isFrozen = true;

    this._eventManager.dispatch({ type: 'freeze' });
  }

  public unfreeze(): void {
    if (this._animationFrameId !== null) return;

    this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this));

    this._isFrozen = false;

    this._eventManager.dispatch({ type: 'unfreeze' });
  }

  public resize(): void {
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      const dpr = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1;

      const { height: clientHeight, width: clientWidth } = this._canvas.getBoundingClientRect();

      this._canvas.width = clientWidth * dpr;
      this._canvas.height = clientHeight * dpr;
    }

    const ok = this._dotLottieCore?.resize(this._canvas.width, this._canvas.height);

    if (ok) {
      this._render();
    }
  }

  public setSegment(startFrame: number, endFrame: number): void {
    if (this._dotLottieCore === null || this._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      segment: createCoreSegment([startFrame, endFrame], this._wasmModule),
    });
  }

  public setMode(mode: Mode): void {
    if (this._dotLottieCore === null || this._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      mode: createCoreMode(mode, this._wasmModule),
    });
  }

  public setRenderConfig(config: RenderConfig): void {
    this._renderConfig = config;
  }

  public loadAnimation(animationId: string): void {
    if (this._dotLottieCore === null) return;

    const loaded = this._dotLottieCore.loadAnimation(animationId, this._canvas.width, this._canvas.height);

    if (loaded) {
      this._eventManager.dispatch({ type: 'load' });
      this.resize();
    } else {
      this._eventManager.dispatch({
        type: 'loadError',
        error: new Error(`Failed to animation :${animationId}`),
      });
    }
  }

  public setMarker(marker: string): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      marker,
    });
  }

  public markers(): Marker[] {
    const markers = this._dotLottieCore?.markers();

    if (markers) {
      const result: Marker[] = [];

      for (let i = 0; i < markers.size(); i += 1) {
        const marker = markers.get(i) as Marker;

        result.push({
          name: marker.name,
          time: marker.time,
          duration: marker.duration,
        });
      }

      return result;
    }

    return [];
  }

  public loadTheme(themeId: string): boolean {
    if (this._dotLottieCore === null) return false;

    const loaded = this._dotLottieCore.loadTheme(themeId);

    this._render();

    return loaded;
  }

  public loadThemeData(themeData: string): boolean {
    if (this._dotLottieCore === null) return false;

    const loaded = this._dotLottieCore.loadThemeData(themeData);

    this._render();

    return loaded;
  }

  public setLayout(layout: Layout): void {
    if (this._dotLottieCore === null || this._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      layout: {
        align: createCoreAlign(layout.align, this._wasmModule),
        fit: createCoreFit(layout.fit, this._wasmModule),
      },
    });
  }

  public setViewport(x: number, y: number, width: number, height: number): boolean {
    if (this._dotLottieCore === null) return false;

    return this._dotLottieCore.setViewport(x, y, width, height);
  }

  public static setWasmUrl(url: string): void {
    DotLottieWasmLoader.setWasmUrl(url);
  }

  public loadStateMachine(stateMachineId: string): boolean {
    return this._dotLottieCore?.loadStateMachine(stateMachineId) ?? false;
  }

  public startStateMachine(): boolean {
    const started = this._dotLottieCore?.startStateMachine() ?? false;

    if (started) {
      this._setupStateMachineListeners();
    }

    return started;
  }

  public stopStateMachine(): boolean {
    const stopped = this._dotLottieCore?.stopStateMachine() ?? false;

    if (stopped) {
      this._cleanupStateMachineListeners();
    }

    return stopped;
  }

  private _getPointerPosition(event: PointerEvent): { x: number; y: number } {
    const rect = (this._canvas as HTMLCanvasElement).getBoundingClientRect();
    const scaleX = this._canvas.width / rect.width;
    const scaleY = this._canvas.height / rect.height;

    const devicePixelRatio = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1;
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

  /**
   * @experimental
   * @param event - The event to be posted to the state machine
   * @returns boolean - true if the event was posted successfully, false otherwise
   */
  public postStateMachineEvent(event: string): boolean {
    return this._dotLottieCore?.postEventPayload(event) ?? false;
  }

  private _setupStateMachineListeners(): void {
    if (this._canvas instanceof HTMLCanvasElement && this._dotLottieCore !== null && this.isLoaded) {
      const listenersVector = this._dotLottieCore.stateMachineFrameworkSetup();

      const listeners = [];

      for (let i = 0; i < listenersVector.size(); i += 1) {
        listeners.push(listenersVector.get(i));
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

      if (listeners.includes('Complete')) {
        this.addEventListener('complete', this._onComplete.bind(this));
      }
    }
  }

  private _cleanupStateMachineListeners(): void {
    if (this._canvas instanceof HTMLCanvasElement) {
      this._canvas.removeEventListener('pointerup', this._onPointerUp.bind(this));
      this._canvas.removeEventListener('pointerdown', this._onPointerDown.bind(this));
      this._canvas.removeEventListener('pointermove', this._onPointerMove.bind(this));
      this._canvas.removeEventListener('pointerenter', this._onPointerEnter.bind(this));
      this._canvas.removeEventListener('pointerleave', this._onPointerLeave.bind(this));
      this.removeEventListener('complete', this._onComplete.bind(this));
    }
  }
}
