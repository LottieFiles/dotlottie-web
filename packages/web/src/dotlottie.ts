/* eslint-disable no-secrets/no-secrets */
/* eslint-disable no-warning-comments */
import { AnimationFrameManager } from './animation-frame-manager';
import { IS_BROWSER, BYTES_PER_PIXEL } from './constants';
import type {
  DotLottiePlayer,
  MainModule,
  Mode as CoreMode,
  VectorFloat,
  Marker,
  Fit as CoreFit,
  Observer,
  StateMachineObserver,
  StateMachineInternalObserver,
  GlobalInputsObserver,
} from './core';
import { DotLottieWasmLoader } from './core';
import type { EventListener, EventType } from './event-manager';
import { EventManager } from './event-manager';
import { OffscreenObserver } from './offscreen-observer';
import { CanvasResizeObserver } from './resize-observer';
import type { Mode, Fit, Config, Layout, Manifest, RenderConfig, Data, StateMachineConfig, Transform } from './types';
import {
  getDefaultDPR,
  getPointerPosition,
  handleOpenUrl,
  hexStringToRGBAInt,
  isDotLottie,
  isElementInViewport,
  isLottie,
} from './utils';
import { toVectorChar } from './utils/vector-char';

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

export interface GradientStop {
  color: number[];
  offset: number;
}

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

const createCoreLayout = (layout: Layout | undefined, module: MainModule): { align: VectorFloat; fit: CoreFit } => {
  if (!layout) {
    return module.createDefaultLayout();
  }

  return {
    align: createCoreAlign(layout.align ?? [0.5, 0.5], module),
    fit: createCoreFit(layout.fit ?? 'contain', module),
  };
};

interface RenderSurface {
  height: number;
  width: number;
}

export class DotLottie {
  private readonly _canvas: HTMLCanvasElement | OffscreenCanvas | RenderSurface;

  private _context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

  private readonly _eventManager: EventManager;

  private _animationFrameId: number | null = null;

  private readonly _frameManager: AnimationFrameManager;

  private _dotLottieCore: DotLottiePlayer | null = null;

  private _stateMachineId: string = '';

  private _stateMachineConfig: StateMachineConfig | null = null;

  private _isStateMachineRunning: boolean = false;

  private _stateMachineObserverHandle: StateMachineObserver | null = null;

  private _stateMachineInternalMessageObserver: StateMachineInternalObserver | null = null;

  private _dotLottieObserverHandle: Observer | null = null;

  private _globalInputsObserverHandler: GlobalInputsObserver | null = null;

  private static _wasmModule: MainModule | null = null;

  private _renderConfig: RenderConfig = {};

  private _isFrozen: boolean = false;

  private _backgroundColor: string | null = null;

  // Bound event listeners for state machine
  private _boundOnClick: ((event: MouseEvent) => void) | null = null;

  private _boundOnPointerUp: ((event: PointerEvent) => void) | null = null;

  private _boundOnPointerDown: ((event: PointerEvent) => void) | null = null;

  private _boundOnPointerMove: ((event: PointerEvent) => void) | null = null;

  private _boundOnPointerEnter: ((event: PointerEvent) => void) | null = null;

  private _boundOnPointerLeave: ((event: PointerEvent) => void) | null = null;

  public constructor(
    config: Omit<Config, 'canvas'> & {
      canvas: HTMLCanvasElement | OffscreenCanvas | RenderSurface;
    },
  ) {
    this._canvas = config.canvas;

    this._eventManager = new EventManager();
    this._frameManager = new AnimationFrameManager();
    this._renderConfig = {
      ...config.renderConfig,
      devicePixelRatio: config.renderConfig?.devicePixelRatio || getDefaultDPR(),
      // freezeOnOffscreen is true by default to prevent unnecessary rendering when the canvas is offscreen
      freezeOnOffscreen: config.renderConfig?.freezeOnOffscreen ?? true,
    };

    DotLottieWasmLoader.load()
      .then((module) => {
        DotLottie._wasmModule = module;

        const callbackObserver = new module.CallbackObserver();

        callbackObserver.setOnLoad(() => {
          setTimeout(() => {
            this._eventManager.dispatch({
              type: 'load',
            });
          }, 0);
        });
        callbackObserver.setOnLoadError(() => {
          setTimeout(() => {
            this._eventManager.dispatch({
              type: 'loadError',
              error: new Error('failed to load'),
            });
          }, 0);
        });
        callbackObserver.setOnPlay(() => {
          setTimeout(() => {
            this._eventManager.dispatch({
              type: 'play',
            });
          }, 0);
        });
        callbackObserver.setOnPause(() => {
          setTimeout(() => {
            this._eventManager.dispatch({
              type: 'pause',
            });
          }, 0);
        });
        callbackObserver.setOnStop(() => {
          setTimeout(() => {
            this._eventManager.dispatch({
              type: 'stop',
            });
          }, 0);
        });
        callbackObserver.setOnLoop((loopCount: number) => {
          setTimeout(() => {
            this._eventManager.dispatch({
              type: 'loop',
              loopCount,
            });
          }, 0);
        });
        callbackObserver.setOnComplete(() => {
          setTimeout(() => {
            this._eventManager.dispatch({
              type: 'complete',
            });
          }, 0);
        });
        callbackObserver.setOnFrame((currentFrame: number) => {
          setTimeout(() => {
            this._eventManager.dispatch({
              type: 'frame',
              currentFrame,
            });
          }, 0);
        });
        callbackObserver.setOnRender((currentFrame: number) => {
          setTimeout(() => {
            this._eventManager.dispatch({
              type: 'render',
              currentFrame,
            });
          }, 0);
        });

        this._dotLottieCore = new module.DotLottiePlayer({
          animationId: config.animationId ?? '',
          themeId: config.themeId ?? '',
          // FIXME: state machine id is not useful, since the load and start of state machine require to be controlled by the framework
          stateMachineId: '',
          autoplay: config.autoplay ?? false,
          backgroundColor: 0,
          loopAnimation: config.loop ?? false,
          loopCount: config.loopCount ?? 0,
          mode: createCoreMode(config.mode ?? 'forward', module),
          segment: createCoreSegment(config.segment ?? [], module),
          speed: config.speed ?? 1,
          useFrameInterpolation: config.useFrameInterpolation ?? true,
          marker: config.marker ?? '',
          layout: createCoreLayout(config.layout, module),
        });

        this._stateMachineId = config.stateMachineId ?? '';
        this._stateMachineConfig = config.stateMachineConfig ?? null;

        this._dotLottieObserverHandle = this._dotLottieCore.subscribe(callbackObserver);

        this._eventManager.dispatch({ type: 'ready' });

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

  private _dispatchError(message: string): void {
    console.error(message);
    this._eventManager.dispatch({ type: 'loadError', error: new Error(message) });
  }

  private async _fetchData(src: string): Promise<string | ArrayBuffer> {
    const response = await fetch(src);

    if (!response.ok) {
      throw new Error(`Failed to fetch animation data from URL: ${src}. ${response.status}: ${response.statusText}`);
    }

    const data = await response.arrayBuffer();

    if (isDotLottie(data)) {
      return data;
    }

    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    return new TextDecoder().decode(data);
  }

  private _loadFromData(data: Data): void {
    if (this._dotLottieCore === null || DotLottie._wasmModule === null) return;

    const width = this._canvas.width;
    const height = this._canvas.height;

    let loaded = false;

    if (typeof data === 'string') {
      if (!isLottie(data)) {
        this._dispatchError(
          'Invalid Lottie JSON string: The provided string does not conform to the Lottie JSON format.',
        );

        return;
      }
      loaded = this._dotLottieCore.loadAnimationData(data, width, height);
    } else if (data instanceof ArrayBuffer) {
      if (!isDotLottie(data)) {
        this._dispatchError(
          'Invalid dotLottie ArrayBuffer: The provided ArrayBuffer does not conform to the dotLottie format.',
        );

        return;
      }
      loaded = this._dotLottieCore.loadDotLottieData(toVectorChar(DotLottie._wasmModule, data), width, height);
    } else if (typeof data === 'object') {
      if (!isLottie(data as Record<string, unknown>)) {
        this._dispatchError(
          'Invalid Lottie JSON object: The provided object does not conform to the Lottie JSON format.',
        );

        return;
      }
      loaded = this._dotLottieCore.loadAnimationData(JSON.stringify(data), width, height);
    } else {
      this._dispatchError(
        `Unsupported data type for animation data. Expected: 
          - string (Lottie JSON),
          - ArrayBuffer (dotLottie),
          - object (Lottie JSON). 
          Received: ${typeof data}`,
      );

      return;
    }

    if (loaded) {
      if (this._renderConfig.quality !== undefined) {
        this._dotLottieCore.setQuality(this._renderConfig.quality);
      }

      if (IS_BROWSER) {
        this.resize();
      }

      setTimeout(() => {
        // FIXME: frame is not triggered from the dotlottie-rs core
        this._eventManager.dispatch({
          type: 'frame',
          currentFrame: this.currentFrame,
        });
      }, 0);

      this._dotLottieCore.render();

      this._draw();

      if (this._stateMachineId) {
        const smLoaded = this.stateMachineLoad(this._stateMachineId);

        if (smLoaded) {
          const smStarted = this.stateMachineStart();

          if (smStarted) {
            this._startAnimationLoop();
          }
        }
      } else if (this._dotLottieCore.isPlaying()) {
        this._startAnimationLoop();
      }

      if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
        if (this._renderConfig.freezeOnOffscreen) {
          OffscreenObserver.observe(this._canvas, this);

          // Check if canvas is initially offscreen and freeze if necessary
          if (!isElementInViewport(this._canvas)) {
            this.freeze();
          }
        }

        if (this._renderConfig.autoResize) {
          CanvasResizeObserver.observe(this._canvas, this);
        }
      }
    }
  }

  private _loadFromSrc(src: string): void {
    this._fetchData(src)
      .then((data) => this._loadFromData(data))
      .catch((error) => this._dispatchError(`Failed to load animation data from URL: ${src}. ${error}`));
  }

  public get buffer(): Uint8Array | null {
    if (!this._dotLottieCore) return null;

    return this._dotLottieCore.buffer() as Uint8Array;
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
            case DotLottie._wasmModule?.Fit.Contain:
              return 'contain';

            case DotLottie._wasmModule?.Fit.Cover:
              return 'cover';

            case DotLottie._wasmModule?.Fit.Fill:
              return 'fill';

            case DotLottie._wasmModule?.Fit.FitHeight:
              return 'fit-height';

            case DotLottie._wasmModule?.Fit.FitWidth:
              return 'fit-width';

            case DotLottie._wasmModule?.Fit.None:
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

    if (mode === DotLottie._wasmModule?.Mode.Reverse) {
      return 'reverse';
    } else if (mode === DotLottie._wasmModule?.Mode.Bounce) {
      return 'bounce';
    } else if (mode === DotLottie._wasmModule?.Mode.ReverseBounce) {
      return 'reverse-bounce';
    } else {
      return 'forward';
    }
  }

  public get isFrozen(): boolean {
    return this._isFrozen;
  }

  public get isStateMachineRunning(): boolean {
    return this._isStateMachineRunning;
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

  public get isReady(): boolean {
    return this._dotLottieCore !== null;
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
    if (!this._dotLottieCore) return 0;

    return Math.round(this._dotLottieCore.currentFrame() * 100) / 100;
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

  public get canvas(): HTMLCanvasElement | OffscreenCanvas | RenderSurface {
    return this._canvas;
  }

  public load(config: Omit<Config, 'canvas'>): void {
    if (this._dotLottieCore === null || DotLottie._wasmModule === null) return;

    this._stopAnimationLoop();

    // Clean up previous observers if in browser environment
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      OffscreenObserver.unobserve(this._canvas);
      CanvasResizeObserver.unobserve(this._canvas);
      this._cleanupStateMachineListeners();
    }

    this._isFrozen = false;

    this._dotLottieCore.setConfig({
      animationId: config.animationId ?? '',
      themeId: config.themeId ?? '',
      stateMachineId: '',
      autoplay: config.autoplay ?? false,
      backgroundColor: 0,
      loopAnimation: config.loop ?? false,
      loopCount: config.loopCount ?? 0,
      mode: createCoreMode(config.mode ?? 'forward', DotLottie._wasmModule),
      segment: createCoreSegment(config.segment ?? [], DotLottie._wasmModule),
      speed: config.speed ?? 1,
      useFrameInterpolation: config.useFrameInterpolation ?? true,
      marker: config.marker ?? '',
      layout: createCoreLayout(config.layout, DotLottie._wasmModule),
    });

    if (config.data) {
      this._loadFromData(config.data);
    } else if (config.src) {
      this._loadFromSrc(config.src);
    }

    this.setBackgroundColor(config.backgroundColor ?? '');
  }

  private _draw(): void {
    if (this._dotLottieCore === null) return;

    // Only try to get context if canvas has getContext method and no context exists yet
    if (!this._context && 'getContext' in this._canvas && typeof this._canvas.getContext === 'function') {
      this._context = this._canvas.getContext('2d');
    }

    // Only process visual output if we have a canvas with a valid context
    if (this._context) {
      const buffer = this._dotLottieCore.buffer() as ArrayBuffer;

      const expectedLength = this._canvas.width * this._canvas.height * BYTES_PER_PIXEL;

      if (buffer.byteLength !== expectedLength) {
        console.warn(`Buffer size mismatch: got ${buffer.byteLength}, expected ${expectedLength}`);

        return;
      }

      let imageData = null;

      const clampedBuffer = new Uint8ClampedArray(buffer, 0, buffer.byteLength);

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
    }
  }

  private _stopAnimationLoop(): void {
    if (this._animationFrameId !== null) {
      this._frameManager.cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  private _startAnimationLoop(): void {
    // Start if we don't already have an active loop and either:
    // 1. The animation should be playing, OR
    // 2. The state machine is running
    if (
      this._animationFrameId === null &&
      this._dotLottieCore &&
      !this._isFrozen &&
      (this._dotLottieCore.isPlaying() || this._isStateMachineRunning)
    ) {
      this._animationFrameId = this._frameManager.requestAnimationFrame(this._animationLoop.bind(this));
    }
  }

  private _animationLoop(): void {
    if (this._dotLottieCore === null) {
      this._stopAnimationLoop();

      return;
    }

    // Continue the loop if either the animation is playing OR the state machine is running
    if (!this._dotLottieCore.isPlaying() && !this._isStateMachineRunning) {
      this._stopAnimationLoop();

      return;
    }

    try {
      const advanced = this._dotLottieCore.tick();

      if (advanced) {
        this._draw();
      }

      this._animationFrameId = this._frameManager.requestAnimationFrame(this._animationLoop.bind(this));
    } catch (error) {
      console.error('Error in animation frame:', error);

      this._eventManager.dispatch({ type: 'renderError', error: error as unknown as Error });

      // destroy the instance if it's a runtime error
      if (error instanceof WebAssembly.RuntimeError) {
        this.destroy();
      }
    }
  }

  public play(): void {
    if (this._dotLottieCore === null || !this.isLoaded) return;

    this._stopAnimationLoop();

    const playing = this._dotLottieCore.play();

    // Always unfreeze and start animation loop if core is playing, regardless of play() return value
    if (playing || this._dotLottieCore.isPlaying()) {
      this._isFrozen = false;
      this._startAnimationLoop();
    }

    /* 
      Check if the canvas is offscreen and freezing is enabled
      If freezeOnOffscreen is true and the canvas is currently outside the viewport,
      we immediately freeze the animation to avoid unnecessary rendering and performance overhead.
    */
    if (
      IS_BROWSER &&
      this._canvas instanceof HTMLCanvasElement &&
      this._renderConfig.freezeOnOffscreen &&
      !isElementInViewport(this._canvas)
    ) {
      this.freeze();
    }
  }

  public pause(): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.pause();

    this._stopAnimationLoop();
  }

  public stop(): void {
    if (this._dotLottieCore === null) return;

    const ok = this._dotLottieCore.stop();

    this._stopAnimationLoop();

    if (ok) {
      // FIXME: frame is not triggered from the dotlottie-rs core on stop()
      this._eventManager.dispatch({ type: 'frame', currentFrame: this.currentFrame });
      // FIXME: stop() doesn't trigger render() internally
      this._dotLottieCore.render();
      this._draw();
    }
  }

  public setFrame(frame: number): void {
    if (this._dotLottieCore === null) return;

    const frameUpdated = this._dotLottieCore.seek(frame);

    if (frameUpdated) {
      const rendered = this._dotLottieCore.render();

      if (rendered) {
        this._draw();
      }
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

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      this._canvas.style.backgroundColor = color;
    } else {
      this._dotLottieCore.setConfig({
        ...this._dotLottieCore.config(),
        backgroundColor: hexStringToRGBAInt(color),
      });
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

  public setLoopCount(loopCount: number): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      loopCount,
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
    this._stopAnimationLoop();

    // Reset state machine status
    this._isStateMachineRunning = false;

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      OffscreenObserver.unobserve(this._canvas);
      CanvasResizeObserver.unobserve(this._canvas);
    }

    if (this._stateMachineObserverHandle) {
      this._dotLottieCore?.stateMachineUnsubscribe(this._stateMachineObserverHandle);
      this._stateMachineObserverHandle.delete();
      this._stateMachineObserverHandle = null;
    }

    if (this._stateMachineInternalMessageObserver) {
      this._dotLottieCore?.stateMachineInternalUnsubscribe(this._stateMachineInternalMessageObserver);
      this._stateMachineInternalMessageObserver.delete();
      this._stateMachineInternalMessageObserver = null;
    }

    if (this._dotLottieObserverHandle) {
      this._dotLottieCore?.unsubscribe(this._dotLottieObserverHandle);
      this._dotLottieObserverHandle.delete();
      this._dotLottieObserverHandle = null;
    }

    this._dotLottieCore?.delete();
    this._dotLottieCore = null;
    this._context = null;

    this._eventManager.dispatch({
      type: 'destroy',
    });

    this._eventManager.removeAllEventListeners();
    this._cleanupStateMachineListeners();
    this._cleanupGlobalInputsListeners();
  }

  public freeze(): void {
    if (this._animationFrameId === null) return;

    this._stopAnimationLoop();

    this._isFrozen = true;

    this._eventManager.dispatch({ type: 'freeze' });
  }

  public unfreeze(): void {
    if (this._animationFrameId !== null) return;

    this._isFrozen = false;

    this._eventManager.dispatch({ type: 'unfreeze' });

    this._startAnimationLoop();
  }

  public resize(): void {
    if (!this._dotLottieCore || !this.isLoaded) return;

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      const dpr = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1;

      const { height: clientHeight, width: clientWidth } = this._canvas.getBoundingClientRect();

      if (clientHeight !== 0 && clientWidth !== 0) {
        this._canvas.width = clientWidth * dpr;
        this._canvas.height = clientHeight * dpr;
      }
    }

    const resized = this._dotLottieCore.resize(this._canvas.width, this._canvas.height);

    if (resized) {
      this._draw();
    }
  }

  public setTransform(transform: Transform): boolean {
    if (!this._dotLottieCore || !DotLottie._wasmModule) return false;

    const transformVector = new DotLottie._wasmModule.VectorFloat();

    for (const val of transform) {
      transformVector.push_back(val);
    }

    const ok = this._dotLottieCore.setTransform(transformVector);

    if (ok && this._dotLottieCore.render()) {
      this._draw();
    }

    return ok;
  }

  public getTransform(): Transform | undefined {
    if (!this._dotLottieCore) return undefined;

    const transform: Transform = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    const transformVector = this._dotLottieCore.getTransform();

    for (let i = 0; i < transformVector.size(); i += 1) {
      transform[i] = transformVector.get(i) as number;
    }

    return transform;
  }

  public setSegment(startFrame: number, endFrame: number): void {
    if (this._dotLottieCore === null || DotLottie._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      segment: createCoreSegment([startFrame, endFrame], DotLottie._wasmModule),
    });
  }

  public setMode(mode: Mode): void {
    if (this._dotLottieCore === null || DotLottie._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      mode: createCoreMode(mode, DotLottie._wasmModule),
    });
  }

  public setRenderConfig(config: RenderConfig): void {
    const { devicePixelRatio, freezeOnOffscreen, quality, ...restConfig } = config;

    this._renderConfig = {
      ...this._renderConfig,
      ...restConfig,
      // devicePixelRatio is a special case, it should be set to the default value if it's not provided
      devicePixelRatio: devicePixelRatio || getDefaultDPR(),
      freezeOnOffscreen: freezeOnOffscreen ?? true,
      ...(quality !== undefined && { quality }),
    };

    if (quality !== undefined && this._dotLottieCore) {
      this._dotLottieCore.setQuality(quality);
    }

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      if (this._renderConfig.autoResize) {
        CanvasResizeObserver.observe(this._canvas, this);
      } else {
        CanvasResizeObserver.unobserve(this._canvas);
      }

      if (this._renderConfig.freezeOnOffscreen) {
        OffscreenObserver.observe(this._canvas, this);

        // Check if canvas is currently offscreen and freeze if necessary
        if (!isElementInViewport(this._canvas)) {
          this.freeze();
        }
      } else {
        OffscreenObserver.unobserve(this._canvas);
        // If the animation was previously frozen, we need to unfreeze it now
        // to ensure it resumes rendering when the canvas is back onscreen.
        if (this._isFrozen) {
          this.unfreeze();
        }
      }
    }
  }

  public loadAnimation(animationId: string): void {
    if (this._dotLottieCore === null || this._dotLottieCore.activeAnimationId() === animationId) return;

    const loaded = this._dotLottieCore.loadAnimation(animationId, this._canvas.width, this._canvas.height);

    if (loaded) {
      if (this._renderConfig.quality !== undefined) {
        this._dotLottieCore.setQuality(this._renderConfig.quality);
      }
      this.resize();
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

  public setTheme(themeId: string): boolean {
    if (this._dotLottieCore === null) return false;

    const themeLoaded = this._dotLottieCore.setTheme(themeId);

    if (themeLoaded) {
      this._dotLottieCore.render();
      this._draw();
    }

    return themeLoaded;
  }

  public resetTheme(): boolean {
    if (this._dotLottieCore === null) return false;

    const themeReset = this._dotLottieCore.resetTheme();

    if (themeReset) {
      this._dotLottieCore.render();
      this._draw();
    }

    return themeReset;
  }

  public setThemeData(themeData: string): boolean {
    if (this._dotLottieCore === null) return false;

    const themeLoaded = this._dotLottieCore.setThemeData(themeData);

    if (themeLoaded) {
      this._dotLottieCore.render();
      this._draw();
    }

    return themeLoaded;
  }

  public setSlots(slots: string): void {
    if (this._dotLottieCore === null) return;

    if (this._dotLottieCore.setSlots(slots)) {
      this._dotLottieCore.render();
      this._draw();
    }
  }

  public setLayout(layout: Layout): void {
    if (this._dotLottieCore === null || DotLottie._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      layout: createCoreLayout(layout, DotLottie._wasmModule),
    });
  }

  public setViewport(x: number, y: number, width: number, height: number): boolean {
    if (this._dotLottieCore === null) return false;

    return this._dotLottieCore.setViewport(x, y, width, height);
  }

  public static setWasmUrl(url: string): void {
    DotLottieWasmLoader.setWasmUrl(url);
  }

  /**
   * @experimental
   * Register a custom font for use in animations
   * @param fontName - The name of the font to register
   * @param fontSource - Either a URL string to fetch the font, or ArrayBuffer/Uint8Array of font data
   * @returns Promise<boolean> - true if registration succeeded, false otherwise
   */
  public static async registerFont(fontName: string, fontSource: string | ArrayBuffer | Uint8Array): Promise<boolean> {
    try {
      const module = await DotLottieWasmLoader.load();

      let fontData: ArrayBuffer;

      if (typeof fontSource === 'string') {
        const response = await fetch(fontSource);

        if (!response.ok) {
          console.error(`Failed to fetch font from URL: ${fontSource}. Status: ${response.status}`);

          return false;
        }
        fontData = await response.arrayBuffer();
      } else if (fontSource instanceof Uint8Array) {
        const tempBuffer = fontSource.buffer.slice(
          fontSource.byteOffset,
          fontSource.byteOffset + fontSource.byteLength,
        );

        if (tempBuffer instanceof ArrayBuffer) {
          fontData = tempBuffer;
        } else {
          fontData = new ArrayBuffer(fontSource.byteLength);
          new Uint8Array(fontData).set(fontSource);
        }
      } else {
        fontData = fontSource;
      }

      const success = module.registerFont(fontName, toVectorChar(module, fontData));

      if (!success) {
        console.error(`Failed to register font "${fontName}". Font data may be invalid.`);
      }

      return success;
    } catch (error) {
      console.error(`Error registering font "${fontName}":`, error);

      return false;
    }
  }

  /**
   * @experimental
   * Start a tween animation between two frame values with custom easing
   * @param frame - Starting frame value
   * @param duration - Duration of the tween in seconds
   * @returns true if tween was started successfully
   */
  public tween(frame: number, duration: number): boolean {
    if (!DotLottie._wasmModule) return false;

    // Default easing (linear)
    const easing = [0, 0, 1, 1];

    const easingVector = new DotLottie._wasmModule.VectorFloat();

    for (const val of easing) {
      easingVector.push_back(val);
    }

    return this._dotLottieCore?.tween(frame, duration, easingVector) ?? false;
  }

  /**
   * @experimental
   * Start a tween animation to a specific marker
   * @param marker - The marker name to tween to
   * @returns true if tween was started successfully
   */
  public tweenToMarker(marker: string, duration: number): boolean {
    if (!DotLottie._wasmModule) return false;

    const easing = [0, 0, 1, 1];

    const easingVector = new DotLottie._wasmModule.VectorFloat();

    for (const val of easing) {
      easingVector.push_back(val);
    }

    return this._dotLottieCore?.tweenToMarker(marker, duration, easingVector) ?? false;
  }

  public animationSize(): { height: number; width: number } {
    const width = this._dotLottieCore?.animationSize().get(0) ?? 0;
    const height = this._dotLottieCore?.animationSize().get(1) ?? 0;

    return {
      width,
      height,
    };
  }

  /**
   * Get the Oriented Bounding Box (OBB) points of a layer by its name
   * @param layerName - The name of the layer
   * @returns An array of 8 numbers representing 4 points (x,y) of the OBB in clockwise order starting from top-left
   *          [x0, y0, x1, y1, x2, y2, x3, y3]
   *
   * @example
   * ```typescript
   * // Draw a polygon around the layer 'Layer 1'
   * dotLottie.addEventListener('render', () => {
   *   const obbPoints = dotLottie.getLayerBoundingBox('Layer 1');
   *
   *   if (obbPoints) {
   *     context.beginPath();
   *     context.moveTo(obbPoints[0], obbPoints[1]); // First point
   *     context.lineTo(obbPoints[2], obbPoints[3]); // Second point
   *     context.lineTo(obbPoints[4], obbPoints[5]); // Third point
   *     context.lineTo(obbPoints[6], obbPoints[7]); // Fourth point
   *     context.closePath();
   *     context.stroke();
   *   }
   * });
   * ```
   */
  public getLayerBoundingBox(layerName: string): number[] | undefined {
    const bounds = this._dotLottieCore?.getLayerBounds(layerName);

    if (!bounds) return undefined;

    if (bounds.size() !== 8) return undefined;

    const points: number[] = [];

    for (let i = 0; i < 8; i += 1) {
      points.push(bounds.get(i) as number);
    }

    return points;
  }

  public static transformThemeToLottieSlots(theme: string, slots: string): string {
    return DotLottie._wasmModule?.transformThemeToLottieSlots(theme, slots) ?? '';
  }

  // #region State Machine
  private _setupStateMachineObservers(): void {
    if (!this._dotLottieCore || !DotLottie._wasmModule) return;

    const smCallbackObserver = new DotLottie._wasmModule.CallbackStateMachineObserver();

    smCallbackObserver.setOnStart(() => {
      setTimeout(() => {
        this._isStateMachineRunning = true;
        this._eventManager.dispatch({ type: 'stateMachineStart' });
        this._startAnimationLoop();
      }, 0);
    });
    smCallbackObserver.setOnStop(() => {
      setTimeout(() => {
        this._isStateMachineRunning = false;
        this._eventManager.dispatch({ type: 'stateMachineStop' });

        // Stop animation loop if animation is not playing
        if (!this._dotLottieCore?.isPlaying()) {
          this._stopAnimationLoop();
        }
      }, 0);
    });
    smCallbackObserver.setOnCustomEvent((eventName: string) => {
      this._eventManager.dispatch({ type: 'stateMachineCustomEvent', eventName });
    });
    smCallbackObserver.setOnBooleanInputValueChange((inputName: string, oldValue: boolean, newValue: boolean) => {
      this._eventManager.dispatch({ type: 'stateMachineBooleanInputValueChange', inputName, newValue, oldValue });
    });
    smCallbackObserver.setOnNumericInputValueChange((inputName: string, oldValue: number, newValue: number) => {
      this._eventManager.dispatch({ type: 'stateMachineNumericInputValueChange', inputName, newValue, oldValue });
    });
    smCallbackObserver.setOnStringInputValueChange((inputName: string, oldValue: string, newValue: string) => {
      this._eventManager.dispatch({ type: 'stateMachineStringInputValueChange', inputName, newValue, oldValue });
    });
    smCallbackObserver.setOnInputFired((inputName: string) => {
      this._eventManager.dispatch({ type: 'stateMachineInputFired', inputName });
    });
    smCallbackObserver.setOnTransition((fromState: string, toState: string) => {
      this._eventManager.dispatch({ type: 'stateMachineTransition', fromState, toState });
    });
    smCallbackObserver.setOnStateEntered((state: string) => {
      this._eventManager.dispatch({ type: 'stateMachineStateEntered', state });
    });
    smCallbackObserver.setOnStateExit((state: string) => {
      this._eventManager.dispatch({ type: 'stateMachineStateExit', state });
    });
    smCallbackObserver.setOnError((error: string) => {
      this._eventManager.dispatch({ type: 'stateMachineError', error });
    });

    const smInternalMessageObserver = new DotLottie._wasmModule.CallbackStateMachineInternalObserver();

    smInternalMessageObserver.setOnMessage((message: string) => {
      if (IS_BROWSER) {
        if (message.startsWith('OpenUrl: ')) {
          handleOpenUrl(message);
        }
      } else {
        this._eventManager.dispatch({ type: 'stateMachineInternalMessage', message });
      }
    });

    this._stateMachineObserverHandle = this._dotLottieCore.stateMachineSubscribe(smCallbackObserver);
    this._stateMachineInternalMessageObserver =
      this._dotLottieCore.stateMachineInternalSubscribe(smInternalMessageObserver);
  }

  private _cleanupStateMachineObservers(): void {
    if (this._stateMachineObserverHandle) {
      this._dotLottieCore?.stateMachineUnsubscribe(this._stateMachineObserverHandle);
      this._stateMachineObserverHandle.delete();
      this._stateMachineObserverHandle = null;
    }
    if (this._stateMachineInternalMessageObserver) {
      this._dotLottieCore?.stateMachineInternalUnsubscribe(this._stateMachineInternalMessageObserver);
      this._stateMachineInternalMessageObserver.delete();
      this._stateMachineInternalMessageObserver = null;
    }
  }

  /**
   * @experimental
   * Load a state machine by ID
   * @param stateMachineId - The ID of the state machine to load
   * @returns true if the state machine was loaded successfully
   */
  public stateMachineLoad(stateMachineId: string): boolean {
    if (!this._dotLottieCore || !DotLottie._wasmModule) return false;

    this._cleanupStateMachineObservers();

    const loaded = this._dotLottieCore.stateMachineLoad(stateMachineId);

    if (loaded) {
      this._setupStateMachineObservers();
    }

    return loaded;
  }

  /**
   * @experimental
   * Load a state machine from data string
   * @param stateMachineData - The state machine data as a string
   * @returns true if the state machine was loaded successfully
   */
  public stateMachineLoadData(stateMachineData: string): boolean {
    if (!this._dotLottieCore || !DotLottie._wasmModule) return false;

    this._cleanupStateMachineObservers();

    const loaded = this._dotLottieCore.stateMachineLoadData(stateMachineData);

    if (loaded) {
      this._setupStateMachineObservers();
    }

    return loaded;
  }

  /**
   * @experimental
   * Set the state machine config
   * @param config - The state machine config
   */
  public stateMachineSetConfig(config: StateMachineConfig | null): void {
    this._stateMachineConfig = config;
  }

  /**
   * @experimental
   * Start the state machine
   * @returns true if the state machine was started successfully
   */
  public stateMachineStart(): boolean {
    if (DotLottie._wasmModule === null || this._dotLottieCore === null) return false;

    const coreOpenUrl = DotLottie._wasmModule.createDefaultOpenUrlPolicy();

    if (this._stateMachineConfig) {
      const openUrlPolicy = this._stateMachineConfig.openUrlPolicy;

      if (openUrlPolicy && typeof openUrlPolicy.requireUserInteraction === 'boolean') {
        coreOpenUrl.requireUserInteraction = openUrlPolicy.requireUserInteraction;
      }

      if (openUrlPolicy?.whitelist) {
        coreOpenUrl.whitelist = new DotLottie._wasmModule.VectorString();

        for (const url of openUrlPolicy.whitelist) {
          coreOpenUrl.whitelist.push_back(url);
        }
      }
    }

    const started = this._dotLottieCore.stateMachineStart(coreOpenUrl);

    if (started) {
      this._isStateMachineRunning = true;
      this._setupStateMachineListeners();
      this._startAnimationLoop();
    }

    return started;
  }

  /**
   * @experimental
   * Stop the state machine
   * @returns true if the state machine was stopped successfully
   */
  public stateMachineStop(): boolean {
    if (!this._dotLottieCore) return false;

    const stopped = this._dotLottieCore.stateMachineStop();

    if (stopped) {
      this._cleanupStateMachineObservers();
      this._isStateMachineRunning = false;
      this._cleanupStateMachineListeners();

      // Stop animation loop if animation is not playing
      if (!this._dotLottieCore.isPlaying()) {
        this._stopAnimationLoop();
      }
    }

    return stopped;
  }

  /**
   * @experimental
   * Get the current status of the state machine
   * @returns The current status of the state machine as a string
   */
  public stateMachineGetStatus(): string {
    return this._dotLottieCore?.stateMachineStatus() ?? '';
  }

  /**
   * @experimental
   * Get the current state of the state machine
   * @returns The current state of the state machine as a string
   */
  public stateMachineGetCurrentState(): string {
    return this._dotLottieCore?.stateMachineCurrentState() ?? '';
  }

  /**
   * @experimental
   * Get the active state machine ID
   * @returns The active state machine ID as a string
   */
  public stateMachineGetActiveId(): string {
    return this._dotLottieCore?.activeStateMachineId() ?? '';
  }

  /**
   * @experimental
   * Override the current state of the state machine
   * @param state - The state to override to
   * @param immediate - Whether to immediately transition to the state
   * @returns true if the state override was successful
   */
  public stateMachineOverrideState(state: string, immediate: boolean = false): boolean {
    return this._dotLottieCore?.stateMachineOverrideCurrentState(state, immediate) ?? false;
  }

  /**
   * @experimental
   * Get a specific state machine by ID
   * @param stateMachineId - The ID of the state machine to get
   * @returns The state machine data as a string
   */
  public stateMachineGet(stateMachineId: string): string {
    return this._dotLottieCore?.getStateMachine(stateMachineId) ?? '';
  }

  /**
   * @experimental
   * Get the list of state machine listeners
   * @returns Array of listener names
   */
  public stateMachineGetListeners(): string[] {
    if (!this._dotLottieCore) return [];

    const listenersVector = this._dotLottieCore.stateMachineFrameworkSetup();

    const listeners = [];

    for (let i = 0; i < listenersVector.size(); i += 1) {
      listeners.push(listenersVector.get(i) as string);
    }

    return listeners;
  }

  /**
   * @experimental
   * Set a boolean input value for the state machine
   * @param name - The name of the boolean input
   * @param value - The boolean value to set
   */
  public stateMachineSetBooleanInput(name: string, value: boolean): boolean {
    return this._dotLottieCore?.stateMachineSetBooleanInput(name, value) ?? false;
  }

  /**
   * @experimental
   * Set a numeric input value for the state machine
   * @param name - The name of the numeric input
   * @param value - The numeric value to set
   */
  public stateMachineSetNumericInput(name: string, value: number): boolean {
    return this._dotLottieCore?.stateMachineSetNumericInput(name, value) ?? false;
  }

  /**
   * @experimental
   * Set a string input value for the state machine
   * @param name - The name of the string input
   * @param value - The string value to set
   */
  public stateMachineSetStringInput(name: string, value: string): boolean {
    return this._dotLottieCore?.stateMachineSetStringInput(name, value) ?? false;
  }

  /**
   * @experimental
   * Get a boolean input value from the state machine
   * @param name - The name of the boolean input
   * @returns The boolean value or undefined if not found
   */
  public stateMachineGetBooleanInput(name: string): boolean | undefined {
    return this._dotLottieCore?.stateMachineGetBooleanInput(name);
  }

  /**
   * @experimental
   * Get a numeric input value from the state machine
   * @param name - The name of the numeric input
   * @returns The numeric value or undefined if not found
   */
  public stateMachineGetNumericInput(name: string): number | undefined {
    return this._dotLottieCore?.stateMachineGetNumericInput(name);
  }

  /**
   * @experimental
   * Get a string input value from the state machine
   * @param name - The name of the string input
   * @returns The string value or undefined if not found
   */
  public stateMachineGetStringInput(name: string): string | undefined {
    return this._dotLottieCore?.stateMachineGetStringInput(name);
  }

  /**
   * @experimental
   * Get all the inputs of the current state machine. Returns the key name, followed by it's type as a string.
   * @returns An array of input keys followed by it's type at n+1.
   */
  public stateMachineGetInputs(): string[] {
    if (!this._dotLottieCore) return [];

    const inputsVector = this._dotLottieCore.stateMachineGetInputs();

    const inputs = [];

    for (let i = 0; i < inputsVector.size(); i += 1) {
      inputs.push(inputsVector.get(i) as string);
    }

    return inputs;
  }

  /**
   * @experimental
   * Fire an event in the state machine
   * @param name - The name of the event to fire
   */
  public stateMachineFireEvent(name: string): void {
    this._dotLottieCore?.stateMachineFireEvent(name);
  }

  /**
   * @experimental
   * Post a click event to the state machine
   * @param x - The x coordinate of the click
   * @param y - The y coordinate of the click
   * @returns The event result or undefined
   */
  public stateMachinePostClickEvent(x: number, y: number): void {
    this._dotLottieCore?.stateMachinePostClickEvent(x, y);
  }

  /**
   * @experimental
   * Post a pointer up event to the state machine
   * @param x - The x coordinate of the pointer
   * @param y - The y coordinate of the pointer
   * @returns The event result or undefined
   */
  public stateMachinePostPointerUpEvent(x: number, y: number): void {
    this._dotLottieCore?.stateMachinePostPointerUpEvent(x, y);
  }

  /**
   * @experimental
   * Post a pointer down event to the state machine
   * @param x - The x coordinate of the pointer
   * @param y - The y coordinate of the pointer
   * @returns The event result or undefined
   */
  public stateMachinePostPointerDownEvent(x: number, y: number): void {
    this._dotLottieCore?.stateMachinePostPointerDownEvent(x, y);
  }

  /**
   * @experimental
   * Post a pointer move event to the state machine
   * @param x - The x coordinate of the pointer
   * @param y - The y coordinate of the pointer
   * @returns The event result or undefined
   */
  public stateMachinePostPointerMoveEvent(x: number, y: number): void {
    this._dotLottieCore?.stateMachinePostPointerMoveEvent(x, y);
  }

  /**
   * @experimental
   * Post a pointer enter event to the state machine
   * @param x - The x coordinate of the pointer
   * @param y - The y coordinate of the pointer
   * @returns The event result or undefined
   */
  public stateMachinePostPointerEnterEvent(x: number, y: number): void {
    this._dotLottieCore?.stateMachinePostPointerEnterEvent(x, y);
  }

  /**
   * @experimental
   * Post a pointer exit event to the state machine
   * @param x - The x coordinate of the pointer
   * @param y - The y coordinate of the pointer
   * @returns The event result or undefined
   */
  public stateMachinePostPointerExitEvent(x: number, y: number): void {
    this._dotLottieCore?.stateMachinePostPointerExitEvent(x, y);
  }

  private _onClick(event: MouseEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this.stateMachinePostClickEvent(position.x, position.y);
    }
  }

  private _onPointerUp(event: PointerEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this.stateMachinePostPointerUpEvent(position.x, position.y);
    }
  }

  private _onPointerDown(event: PointerEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this.stateMachinePostPointerDownEvent(position.x, position.y);
    }
  }

  private _onPointerMove(event: PointerEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this.stateMachinePostPointerMoveEvent(position.x, position.y);
    }
  }

  private _onPointerEnter(event: PointerEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this.stateMachinePostPointerEnterEvent(position.x, position.y);
    }
  }

  private _onPointerLeave(event: PointerEvent): void {
    const position = getPointerPosition(event);

    if (position) {
      this.stateMachinePostPointerExitEvent(position.x, position.y);
    }
  }

  private _setupStateMachineListeners(): void {
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement && this._dotLottieCore !== null && this.isLoaded) {
      const listeners = this.stateMachineGetListeners();

      // Clean up any existing listeners first
      this._cleanupStateMachineListeners();

      if (listeners.includes('Click')) {
        this._boundOnClick = this._onClick.bind(this);
        this._canvas.addEventListener('click', this._boundOnClick);
      }
      if (listeners.includes('PointerUp')) {
        this._boundOnPointerUp = this._onPointerUp.bind(this);
        this._canvas.addEventListener('pointerup', this._boundOnPointerUp);
      }
      if (listeners.includes('PointerDown')) {
        this._boundOnPointerDown = this._onPointerDown.bind(this);
        this._canvas.addEventListener('pointerdown', this._boundOnPointerDown);
      }
      if (listeners.includes('PointerMove')) {
        this._boundOnPointerMove = this._onPointerMove.bind(this);
        this._canvas.addEventListener('pointermove', this._boundOnPointerMove);
      }
      if (listeners.includes('PointerEnter')) {
        this._boundOnPointerEnter = this._onPointerEnter.bind(this);
        this._canvas.addEventListener('pointerenter', this._boundOnPointerEnter);
      }
      if (listeners.includes('PointerExit')) {
        this._boundOnPointerLeave = this._onPointerLeave.bind(this);
        this._canvas.addEventListener('pointerleave', this._boundOnPointerLeave);
      }
    }
  }

  private _cleanupStateMachineListeners(): void {
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      if (this._boundOnClick) {
        this._canvas.removeEventListener('click', this._boundOnClick);
        this._boundOnClick = null;
      }
      if (this._boundOnPointerUp) {
        this._canvas.removeEventListener('pointerup', this._boundOnPointerUp);
        this._boundOnPointerUp = null;
      }
      if (this._boundOnPointerDown) {
        this._canvas.removeEventListener('pointerdown', this._boundOnPointerDown);
        this._boundOnPointerDown = null;
      }
      if (this._boundOnPointerMove) {
        this._canvas.removeEventListener('pointermove', this._boundOnPointerMove);
        this._boundOnPointerMove = null;
      }
      if (this._boundOnPointerEnter) {
        this._canvas.removeEventListener('pointerenter', this._boundOnPointerEnter);
        this._boundOnPointerEnter = null;
      }
      if (this._boundOnPointerLeave) {
        this._canvas.removeEventListener('pointerleave', this._boundOnPointerLeave);
        this._boundOnPointerLeave = null;
      }
    }
  }
  // #endregion

  // #region global inputs
  private _setupGlobalInputsListeners(): void {
    if (!this._dotLottieCore || !DotLottie._wasmModule) return;

    const globalInputsCallbackObserver = new DotLottie._wasmModule.CallbackGlobalInputsObserver();

    globalInputsCallbackObserver.setOnBooleanGlobalInputValueChange(
      (inputName: string, oldValue: boolean, newValue: boolean) => {
        this._eventManager.dispatch({ type: 'globalInputsBooleanChange', inputName, oldValue, newValue });
      },
    );

    globalInputsCallbackObserver.setOnColorGlobalInputValueChange(
      (inputName: string, oldValue: VectorFloat, newValue: VectorFloat) => {
        this._eventManager.dispatch({
          type: 'globalInputsColorChange',
          inputName,
          oldValue: this._wasmVectorToArray(oldValue),
          newValue: this._wasmVectorToArray(newValue),
        });
      },
    );

    globalInputsCallbackObserver.setOnGradientGlobalInputValueChange(
      (inputName: string, oldValue: VectorFloat, newValue: VectorFloat) => {
        this._eventManager.dispatch({
          type: 'globalInputsGradientChange',
          inputName,
          oldValue: this._wasmVectorToArray(oldValue),
          newValue: this._wasmVectorToArray(newValue),
        });
      },
    );

    globalInputsCallbackObserver.setOnNumericGlobalInputValueChange(
      (inputName: string, oldValue: number, newValue: number) => {
        this._eventManager.dispatch({ type: 'globalInputsNumericChange', inputName, oldValue, newValue });
      },
    );

    globalInputsCallbackObserver.setOnStringGlobalInputValueChange(
      (inputName: string, oldValue: string, newValue: string) => {
        this._eventManager.dispatch({ type: 'globalInputsStringChange', inputName, oldValue, newValue });
      },
    );

    globalInputsCallbackObserver.setOnVectorGlobalInputValueChange(
      (inputName: string, oldValue: VectorFloat, newValue: VectorFloat) => {
        this._eventManager.dispatch({
          type: 'globalInputsVectorChange',
          inputName,
          oldValue: this._wasmVectorToArray(oldValue),
          newValue: this._wasmVectorToArray(newValue),
        });
      },
    );

    this._globalInputsObserverHandler = this._dotLottieCore.globalInputsSubscribe(globalInputsCallbackObserver);
  }

  private _wasmVectorToArray(wasmVector: VectorFloat): number[] {
    const result: number[] = [];

    for (let i = 0; i < wasmVector.size(); i += 1) {
      const number = wasmVector.get(i);

      if (number) {
        result.push(number);
      }
    }

    return result;
  }

  private _cleanupGlobalInputsListeners(): void {
    if (this._globalInputsObserverHandler) {
      this._dotLottieCore?.globalInputsUnsubscribe(this._globalInputsObserverHandler);
      this._globalInputsObserverHandler.delete();
      this._stateMachineObserverHandle = null;
    }
  }

  /**
   * @experimental
   * Load global inputs by ID from the dotLottie file
   * @param id - The ID of the global inputs to load
   * @returns True if loaded successfully
   */
  public globalInputsLoad(id: string): boolean {
    const ret = this._dotLottieCore?.globalInputsLoad(id) ?? false;

    if (ret) {
      this._setupGlobalInputsListeners();
    }

    return ret;
  }

  /**
   * @experimental
   * Load global inputs from JSON data
   * @param data - The JSON string containing global inputs data
   * @returns True if loaded successfully
   */
  public globalInputsLoadData(data: string): boolean {
    const ret = this._dotLottieCore?.globalInputsLoadData(data) ?? false;

    if (ret) {
      this._setupGlobalInputsListeners();
    }

    return ret;
  }

  /**
   * @experimental
   * Start applying the loaded global inputs to the animation
   * @returns True if applied successfully
   */
  public globalInputsStart(): boolean {
    return this._dotLottieCore?.globalInputsStart() ?? false;
  }

  /**
   * @experimental
   * Stop applying the loaded global inputs to the animation. Global inputs can still be modifed, but won't affect the current theme or state machine.
   * @returns True if applied successfully
   */
  public globalInputsStop(): boolean {
    return this._dotLottieCore?.globalInputsStop() ?? false;
  }

  /**
   * @experimental
   * Remove/clear the global inputs
   * @returns True if removed successfully
   */
  public globalInputsRemove(): boolean {
    const ret = this._dotLottieCore?.globalInputsRemove() ?? false;

    if (ret) {
      this._cleanupGlobalInputsListeners();
    }

    return ret;
  }

  /**
   * @experimental
   * Set a string global input value
   * @param bindingName - The name of the binding
   * @param newValue - The new string value
   * @returns True if set successfully
   */
  public globalInputsSetString(bindingName: string, newValue: string): boolean {
    return this._dotLottieCore?.globalInputsSetString(bindingName, newValue) ?? false;
  }

  /**
   * @experimental
   * Set a color global input value
   * @param bindingName - The name of the binding
   * @param newValue - The new color value as [r, g, b, a] (0-1 range)
   * @returns True if set successfully
   */
  public globalInputsSetColor(bindingName: string, newValue: number[]): boolean {
    if (DotLottie._wasmModule === null || this._dotLottieCore === null) return false;

    const colorVector = new DotLottie._wasmModule.VectorFloat();

    for (const value of newValue) {
      colorVector.push_back(value);
    }

    const result = this._dotLottieCore.globalInputsSetColor(bindingName, colorVector);

    colorVector.delete();

    return result;
  }

  /**
   * @experimental
   * Set a vector global input value
   * @param bindingName - The name of the binding
   * @param newValue - The new vector value as [x, y]
   * @returns True if set successfully
   */
  public globalInputsSetVector(bindingName: string, newValue: number[]): boolean {
    if (DotLottie._wasmModule === null || this._dotLottieCore === null) return false;

    const vectorValue = new DotLottie._wasmModule.VectorFloat();

    for (const value of newValue) {
      vectorValue.push_back(value);
    }

    const result = this._dotLottieCore.globalInputsSetVector(bindingName, vectorValue);

    vectorValue.delete();

    return result;
  }

  /**
   * @experimental
   * Set a numeric global input value
   * @param bindingName - The name of the binding
   * @param newValue - The new numeric value
   * @returns True if set successfully
   */
  public globalInputsSetNumeric(bindingName: string, newValue: number): boolean {
    return this._dotLottieCore?.globalInputsSetNumeric(bindingName, newValue) ?? false;
  }

  /**
   * @experimental
   * Set a boolean global input value
   * @param bindingName - The name of the binding
   * @param newValue - The new boolean value
   * @returns True if set successfully
   */
  public globalInputsSetBoolean(bindingName: string, newValue: boolean): boolean {
    return this._dotLottieCore?.globalInputsSetBoolean(bindingName, newValue) ?? false;
  }

  /**
   * @experimental
   * Set a gradient global input value
   * @param bindingName - The name of the binding
   * @param newValue - The new gradient stops
   * @returns True if set successfully
   */
  public globalInputsSetGradient(bindingName: string, newValue: GradientStop[]): boolean {
    if (DotLottie._wasmModule === null || this._dotLottieCore === null) return false;

    const gradientVector = new DotLottie._wasmModule.VectorGradientStop();

    for (const stop of newValue) {
      const colorVector = new DotLottie._wasmModule.VectorFloat();

      for (const colorStop of stop.color) {
        colorVector.push_back(colorStop);
      }
      gradientVector.push_back({ offset: stop.offset, color: colorVector });
      colorVector.delete();
    }

    const result = this._dotLottieCore.globalInputsSetGradient(bindingName, gradientVector);

    gradientVector.delete();

    return result;
  }

  /**
   * @experimental
   * Get a string global input value
   * @param bindingName - The name of the binding
   * @returns The string value or undefined
   */
  public globalInputsGetString(bindingName: string): string | undefined {
    return this._dotLottieCore?.globalInputsGetString(bindingName)?.toString() ?? undefined;
  }

  /**
   * @experimental
   * Get a color global input value
   * @param bindingName - The name of the binding
   * @returns The color value as [r, g, b, a] or empty array
   */
  public globalInputsGetColor(bindingName: string): number[] {
    if (!this._dotLottieCore) return [];

    const colorVector = this._dotLottieCore.globalInputsGetColor(bindingName);
    const color: number[] = [];

    for (let i = 0; i < colorVector.size(); i += 1) {
      color.push(colorVector.get(i) as number);
    }

    return color;
  }

  /**
   * @experimental
   * Get a boolean global input value
   * @param bindingName - The name of the binding
   * @returns The value as a boolean
   */
  public globalInputsGetBoolean(bindingName: string): boolean | undefined {
    if (!this._dotLottieCore) return undefined;

    const value = this._dotLottieCore.globalInputsGetBoolean(bindingName);

    return value;
  }

  /**
   * @experimental
   * Get a vector global input value
   * @param bindingName - The name of the binding
   * @returns The vector value as [x, y] or empty array
   */
  public globalInputsGetVector(bindingName: string): number[] {
    if (!this._dotLottieCore) return [];

    const vectorValue = this._dotLottieCore.globalInputsGetVector(bindingName);
    const vector: number[] = [];

    for (let i = 0; i < vectorValue.size(); i += 1) {
      vector.push(vectorValue.get(i) as number);
    }

    return vector;
  }

  /**
   * @experimental
   * Get a numeric global input value
   * @param bindingName - The name of the binding
   * @returns The numeric value or undefined
   */
  public globalInputsGetNumeric(bindingName: string): number | undefined {
    return this._dotLottieCore?.globalInputsGetNumeric(bindingName) ?? undefined;
  }

  /**
   * @experimental
   * Get a gradient global input value
   * @param bindingName - The name of the binding
   * @returns The gradient stops or empty array
   */
  public globalInputsGetGradient(bindingName: string): GradientStop[] {
    if (!this._dotLottieCore) return [];

    const gradientVector = this._dotLottieCore.globalInputsGetGradient(bindingName);
    const gradient: GradientStop[] = [];

    for (let i = 0; i < gradientVector.size(); i += 1) {
      const stop = gradientVector.get(i);

      if (!stop) continue;

      const colorVector = stop.color;
      const color: number[] = [];

      for (let j = 0; j < colorVector.size(); j += 1) {
        color.push(colorVector.get(j) as number);
      }

      gradient.push({ offset: stop.offset, color });
    }

    return gradient;
  }
}
