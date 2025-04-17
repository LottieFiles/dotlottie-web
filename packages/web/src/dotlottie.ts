/* eslint-disable @typescript-eslint/naming-convention */
import { AnimationFrameManager } from './animation-frame-manager';
import { IS_BROWSER } from './constants';
import type { DotLottiePlayer, MainModule, Mode as CoreMode, VectorFloat, Marker, Fit as CoreFit } from './core';
import { DotLottieWasmLoader } from './core';
import { DotLottieObserver } from './dotlottie-observer';
import { DotLottieInternalStateMachineObserver } from './dotlottie-state-machine-internal-observer';
import { DotLottieStateMachineObserver } from './dotlottie-state-machine-observer';
import type { EventListener, EventType } from './event-manager';
import { EventManager } from './event-manager';
import { OffscreenObserver } from './offscreen-observer';
import { CanvasResizeObserver } from './resize-observer';
import type { Mode, Fit, Config, Layout, Manifest, RenderConfig, Data, OpenUrl } from './types';
import { getDefaultDPR, hexStringToRGBAInt, isDotLottie, isElementInViewport, isLottie } from './utils';

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

interface DebouncedFunction<T extends (...args: any[]) => unknown> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

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

const createCoreObserver = (module: MainModule, eventManager: EventManager): DotLottieObserver | undefined => {
  return new DotLottieObserver(module, eventManager);
};

const createStateMachineObserver = (module: MainModule, eventManager: EventManager): DotLottieStateMachineObserver => {
  return new DotLottieStateMachineObserver(module, eventManager);
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

export class DotLottie {
  private readonly _canvas: HTMLCanvasElement | OffscreenCanvas;

  private _context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

  private readonly _eventManager: EventManager;

  private _animationFrameId: number | null = null;

  private readonly _frameManager: AnimationFrameManager;

  private _dotLottieCore: DotLottiePlayer | null = null;

  private static _wasmModule: MainModule | null = null;

  private _renderConfig: RenderConfig = {};

  private _isFrozen: boolean = false;

  private _backgroundColor: string | null = null;

  private _stateMachineIsActive: boolean = false;

  private _previousFrameNb: number = -1;

  private _stateMachineId: string = '';

  private readonly _pointerUpMethod: (event: PointerEvent) => void;

  private readonly _clickMethod: (event: MouseEvent) => void;

  private readonly _pointerDownMethod: (event: PointerEvent) => void;

  private readonly _pointerMoveMethod: (event: PointerEvent) => void;

  private readonly _pointerEnterMethod: (event: PointerEvent) => void;

  private readonly _pointerExitMethod: (event: PointerEvent) => void;

  private _observer: DotLottieObserver | undefined;

  private _isSubscribed: boolean = false;

  private _stateMachineObserver: DotLottieStateMachineObserver | undefined;

  private _internalStateMachineObserver: DotLottieInternalStateMachineObserver | undefined;

  public constructor(config: Config) {
    this._canvas = config.canvas;
    this._context = this._canvas.getContext('2d');

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

        this._dotLottieCore = new module.DotLottiePlayer({
          themeId: config.themeId ?? '',
          stateMachineId: '',
          autoplay: config.autoplay ?? false,
          backgroundColor: 0,
          loopAnimation: config.loop ?? false,
          mode: createCoreMode(config.mode ?? 'forward', module),
          segment: createCoreSegment(config.segment ?? [], module),
          speed: config.speed ?? 1,
          useFrameInterpolation: config.useFrameInterpolation ?? true,
          marker: config.marker ?? '',
          layout: createCoreLayout(config.layout, module),
        });

        // Event Management
        this._eventManager.dispatch({ type: 'ready' });

        this._observer = createCoreObserver(module, this._eventManager);

        if (this._observer && !this._isSubscribed) {
          // Subscribe returns the shared pointer
          const tmp = this._dotLottieCore.subscribe(this._observer.observer);

          this._isSubscribed = true;

          if (tmp !== null) {
            this._observer.observer = tmp;
          }
        }

        // The state machine is active if a state machine id is provided
        if (config.stateMachineId) {
          this._stateMachineId = config.stateMachineId;
        }

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

    this._pointerUpMethod = this._onPointerUp.bind(this);

    this._clickMethod = this._onClick.bind(this);

    this._pointerDownMethod = this._onPointerDown.bind(this);

    this._pointerMoveMethod = this._createCountedDebounce(this._onPointerMove.bind(this), 50, 10);

    this._pointerEnterMethod = this._onPointerEnter.bind(this);

    this._pointerExitMethod = this._onPointerLeave.bind(this);
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
    if (this._dotLottieCore === null) return;

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
      loaded = this._dotLottieCore.loadDotLottieData(data, width, height);
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
      if (IS_BROWSER) {
        this.resize();
      }

      // Match previous behavior of dispatching frame event on load
      // The Core emits load event but no frame, so we manually dispatch it here.
      this._eventManager.dispatch({
        type: 'frame',
        currentFrame: this.currentFrame,
      });

      this._render();

      if (this._dotLottieCore.config().autoplay) {
        this._dotLottieCore.play();
        if (this._dotLottieCore.isPlaying()) {
          this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this));
        } else {
          console.error('something went wrong, the animation was suppose to autoplay');
        }
      }

      /**
       * DotLottie was created with state machine id.
       *
       * Load and start the state machine. We manually perform this rather than pass it to the DotLottieCore to
       * prevent rendering discrepancies.
       */
      if (this._stateMachineId) {
        this.stateMachineLoad(this._stateMachineId);
        this.stateMachineStart();
      }

      if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
        if (this._renderConfig.freezeOnOffscreen) {
          OffscreenObserver.observe(this._canvas, this);
        }

        if (this._renderConfig.autoResize) {
          CanvasResizeObserver.observe(this._canvas, this);
        }
      }
    } else {
      this._dispatchError('Failed to load animation data');
    }
  }

  private _loadFromSrc(src: string): void {
    this._fetchData(src)
      .then((data) => this._loadFromData(data))
      .catch((error) => this._dispatchError(`Failed to load animation data from URL: ${src}. ${error}`));
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

  public get canvas(): HTMLCanvasElement | OffscreenCanvas {
    return this._canvas;
  }

  public get isStateMachineActive(): boolean {
    return this._stateMachineIsActive;
  }

  public load(config: Omit<Config, 'canvas'>): void {
    if (this._dotLottieCore === null || DotLottie._wasmModule === null) return;

    if (this._animationFrameId !== null) {
      this._frameManager.cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    this._dotLottieCore.setConfig({
      themeId: config.themeId ?? '',
      stateMachineId: '',
      autoplay: config.autoplay ?? false,
      backgroundColor: 0,
      loopAnimation: config.loop ?? false,
      mode: createCoreMode(config.mode ?? 'forward', DotLottie._wasmModule),
      segment: createCoreSegment(config.segment ?? [], DotLottie._wasmModule),
      speed: config.speed ?? 1,
      useFrameInterpolation: config.useFrameInterpolation ?? true,
      marker: config.marker ?? '',
      layout: createCoreLayout(config.layout, DotLottie._wasmModule),
    });

    if (config.stateMachineId) {
      this._stateMachineId = config.stateMachineId;
    }

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
      const buffer = this._dotLottieCore.buffer() as ArrayBuffer;
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

      return true;
    }

    return false;
  }

  private _draw(): void {
    if (
      this._dotLottieCore === null ||
      this._context === null ||
      (!this._dotLottieCore.isPlaying() && !this._stateMachineIsActive)
    ) {
      // If the animation is not playing, we don't need to draw the frame.
      if (this._animationFrameId !== null) {
        this._frameManager.cancelAnimationFrame(this._animationFrameId);
        this._animationFrameId = null;
      }

      return;
    }

    const updated = this._dotLottieCore.tick();

    /**
     * When a state machine has "setFrame" or "setProgress" it will set a frame, causing updated to be false, thus not drawing.
     * We can keep track of the previous frame, if it doesn't match the next frame dotlottie-web is out of date and we render the frame.
     */
    if (updated || (this.currentFrame !== this._previousFrameNb && this._stateMachineIsActive)) {
      this._previousFrameNb = this.currentFrame;

      // Inside the Core tick() has already called render.
      // So we can update the canvas directly here.
      const buffer = this._dotLottieCore.buffer() as ArrayBuffer;
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
    }

    this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this));
  }

  public play(): void {
    if (this._dotLottieCore === null) return;

    const ok = this._dotLottieCore.play();

    if (ok || this._dotLottieCore.isPlaying()) {
      this._isFrozen = false;
      // Core doesn't fire play event when the animation is already playing
      // So we dispatch it manually
      this._eventManager.dispatch({ type: 'play' });
      this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this));
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
  }

  public stop(): void {
    if (this._dotLottieCore === null) return;

    const ok = this._dotLottieCore.stop();

    if (ok) {
      this._render();

      // The Core emits stop event but no frame, so we manually dispat it here.
      this._eventManager.dispatch({ type: 'frame', currentFrame: this.currentFrame });
    }
  }

  public setFrame(frame: number): void {
    if (this._dotLottieCore === null) return;

    if (frame < 0 || frame > this._dotLottieCore.totalFrames()) return;

    const ok = this._dotLottieCore.seek(frame);

    if (ok) {
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
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      OffscreenObserver.unobserve(this._canvas);
      CanvasResizeObserver.unobserve(this._canvas);
    }

    if (this._observer?.observer) {
      this._dotLottieCore?.unsubscribe(this._observer.observer);
    }
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
    if (!this._dotLottieCore || !this.isLoaded) return;

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      const dpr = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1;

      const { height: clientHeight, width: clientWidth } = this._canvas.getBoundingClientRect();

      if (clientHeight !== 0 && clientWidth !== 0) {
        this._canvas.width = clientWidth * dpr;
        this._canvas.height = clientHeight * dpr;
      }
    }

    const ok = this._dotLottieCore.resize(this._canvas.width, this._canvas.height);

    if (ok) {
      this._render();
    }
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
    const { devicePixelRatio, freezeOnOffscreen, ...restConfig } = config;

    this._renderConfig = {
      ...this._renderConfig,
      ...restConfig,
      // devicePixelRatio is a special case, it should be set to the default value if it's not provided
      devicePixelRatio: devicePixelRatio || getDefaultDPR(),
      freezeOnOffscreen: freezeOnOffscreen ?? true,
    };

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      if (this._renderConfig.autoResize) {
        CanvasResizeObserver.observe(this._canvas, this);
      } else {
        CanvasResizeObserver.unobserve(this._canvas);
      }

      if (this._renderConfig.freezeOnOffscreen) {
        OffscreenObserver.observe(this._canvas, this);
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
      if (this._observer && !this._isSubscribed) {
        // Subscribe returns the shared pointer
        const tmp = this._dotLottieCore.subscribe(this._observer.observer);

        this._isSubscribed = true;

        if (tmp !== null) {
          this._observer.observer = tmp;
        }
      }
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

  public setTheme(themeId: string): boolean {
    if (this._dotLottieCore === null) return false;

    const loaded = this._dotLottieCore.setTheme(themeId);

    this._render();

    return loaded;
  }

  public resetTheme(): boolean {
    if (this._dotLottieCore === null) return false;

    return this._dotLottieCore.resetTheme();
  }

  public setThemeData(themeData: string): boolean {
    if (this._dotLottieCore === null) return false;

    const loaded = this._dotLottieCore.setThemeData(themeData);

    this._render();

    return loaded;
  }

  public setSlots(slots: string): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setSlots(slots);
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

  public stateMachineLoadData(stateMachineData: string): boolean {
    if (this._stateMachineIsActive) {
      this.stateMachineStop();
    }

    if (DotLottie._wasmModule) {
      // Create observer that will fire events for user listeners
      this._stateMachineObserver = createStateMachineObserver(DotLottie._wasmModule, this._eventManager);

      const returnedObserver = this._dotLottieCore?.stateMachineSubscribe(this._stateMachineObserver.observer);

      if (returnedObserver) {
        this._stateMachineObserver.observer = returnedObserver;
      }

      // Create internal observer
      this._internalStateMachineObserver = new DotLottieInternalStateMachineObserver(DotLottie._wasmModule);

      const returnedInternalObserver = this._dotLottieCore?.stateMachineFrameworkSubscribe(
        this._internalStateMachineObserver.observer,
      );

      if (returnedInternalObserver) {
        this._internalStateMachineObserver.observer = returnedInternalObserver;
      }
    }

    return this._dotLottieCore?.stateMachineLoadData(stateMachineData) ?? false;
  }

  public stateMachineLoad(stateMachineId: string): boolean {
    if (this._stateMachineIsActive) {
      this.stateMachineStop();
    }

    if (DotLottie._wasmModule) {
      // Create observer that will fire events for user listeners
      this._stateMachineObserver = createStateMachineObserver(DotLottie._wasmModule, this._eventManager);

      const returnedObserver = this._dotLottieCore?.stateMachineSubscribe(this._stateMachineObserver.observer);

      if (returnedObserver) {
        this._stateMachineObserver.observer = returnedObserver;
      }

      // Create internal observer
      this._internalStateMachineObserver = new DotLottieInternalStateMachineObserver(DotLottie._wasmModule);

      const returnedInternalObserver = this._dotLottieCore?.stateMachineFrameworkSubscribe(
        this._internalStateMachineObserver.observer,
      );

      if (returnedInternalObserver) {
        this._internalStateMachineObserver.observer = returnedInternalObserver;
      }
    }

    return this._dotLottieCore?.stateMachineLoad(stateMachineId) ?? false;
  }

  public stateMachineStart(openUrl?: OpenUrl): boolean {
    if (DotLottie._wasmModule === null) return false;

    const cf = DotLottie._wasmModule.createDefaultOpenURL();

    if (openUrl) {
      if (openUrl.mode === 'allow') {
        cf.mode = DotLottie._wasmModule.OpenUrlMode.Allow;
      } else if (openUrl.mode === 'deny') {
        cf.mode = DotLottie._wasmModule.OpenUrlMode.Deny;
      } else {
        cf.mode = DotLottie._wasmModule.OpenUrlMode.Interaction;
      }

      // Push back an empty string so that it at least has a single element.
      // This helps resolve emscripten issues where the vector is empty.
      cf.whitelist.push_back('');

      if (openUrl.whitelist.length > 0) {
        for (const entry of openUrl.whitelist) {
          cf.whitelist.push_back(entry);
        }
      }
    }

    const started = this._dotLottieCore?.stateMachineStart(cf) ?? false;

    if (started) {
      this._stateMachineIsActive = true;
      this.setupStateMachineListeners();

      if (this._animationFrameId === null) {
        this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this));
      }
    } else {
      console.error('Failed to start the state machine: ', this._stateMachineId);
    }

    return started;
  }

  public stateMachineStop(): boolean {
    const stopped = this._dotLottieCore?.stateMachineStop() ?? false;

    if (stopped) {
      if (this._stateMachineObserver) {
        this._dotLottieCore?.stateMachineUnsubscribe(this._stateMachineObserver.observer);
      }
      this._stateMachineIsActive = false;
      this._cleanupStateMachineListeners();
    }

    return stopped;
  }

  private _getPointerPosition(event: MouseEvent | PointerEvent): { x: number; y: number } {
    const rect = (this._canvas as HTMLCanvasElement).getBoundingClientRect();
    const scaleX = this._canvas.width / rect.width;
    const scaleY = this._canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return { x, y };
  }

  private _onClick(event: MouseEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.stateMachinePostClickEvent(x, y);
  }

  private _onPointerUp(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.stateMachinePostPointerUpEvent(x, y);
  }

  private _onPointerDown(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.stateMachinePostPointerDownEvent(x, y);
  }

  private _createCountedDebounce<T extends (...args: any[]) => unknown>(
    callback: T,
    delay: number = 100,
    maxSkipped: number = 50,
  ): DebouncedFunction<T> {
    let timeoutId: NodeJS.Timeout | undefined;
    let skipCounter = 0;

    const debouncedFn = (...args: Parameters<T>): void => {
      skipCounter += 1;

      // If we've skipped too many events, force the callback to fire
      if (skipCounter >= maxSkipped) {
        skipCounter = 0;
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = undefined;
        }
        callback.apply(this, args);

        return;
      }

      // Normal debounce behavior
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        skipCounter = 0;
        callback.apply(this, args);
        timeoutId = undefined;
      }, delay);
    };

    // Add cancel method to allow manual cleanup
    debouncedFn.cancel = (): void => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = undefined;
      }
      skipCounter = 0;
    };

    return debouncedFn;
  }

  private _onPointerMove(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.stateMachinePostPointerMoveEvent(x, y);
  }

  private _onPointerEnter(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.stateMachinePostPointerEnterEvent(x, y);
  }

  private _onPointerLeave(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.stateMachinePostPointerExitEvent(x, y);
  }

  public stateMachinePostClickEvent(x: number, y: number): number | undefined {
    return this._dotLottieCore?.stateMachinePostClickEvent(x, y);
  }

  public stateMachinePostPointerDownEvent(x: number, y: number): number | undefined {
    return this._dotLottieCore?.stateMachinePostPointerDownEvent(x, y);
  }

  public stateMachinePostPointerUpEvent(x: number, y: number): number | undefined {
    return this._dotLottieCore?.stateMachinePostPointerUpEvent(x, y);
  }

  public stateMachinePostPointerMoveEvent(x: number, y: number): number | undefined {
    return this._dotLottieCore?.stateMachinePostPointerMoveEvent(x, y);
  }

  public stateMachinePostPointerEnterEvent(x: number, y: number): number | undefined {
    return this._dotLottieCore?.stateMachinePostPointerEnterEvent(x, y);
  }

  public stateMachinePostPointerExitEvent(x: number, y: number): number | undefined {
    return this._dotLottieCore?.stateMachinePostPointerExitEvent(x, y);
  }

  public getStateMachineListeners(): string[] {
    if (!this._dotLottieCore) return [];

    const listenersVector = this._dotLottieCore.stateMachineFrameworkSetup();

    const listeners = [];

    for (let i = 0; i < listenersVector.size(); i += 1) {
      listeners.push(listenersVector.get(i) as string);
    }

    return listeners;
  }

  public setupStateMachineListeners(): void {
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement && this._dotLottieCore !== null && this.isLoaded) {
      const listeners = this.getStateMachineListeners();

      if (listeners.includes('Click')) {
        this._canvas.addEventListener('click', this._clickMethod);
      }

      if (listeners.includes('PointerUp')) {
        this._canvas.addEventListener('pointerup', this._pointerUpMethod);
      }

      if (listeners.includes('PointerDown')) {
        this._canvas.addEventListener('pointerdown', this._pointerDownMethod);
      }

      if (listeners.includes('PointerMove')) {
        this._canvas.addEventListener('pointermove', this._pointerMoveMethod);
      }

      if (listeners.includes('PointerEnter')) {
        this._canvas.addEventListener('pointerenter', this._pointerEnterMethod);
      }

      if (listeners.includes('PointerExit')) {
        this._canvas.addEventListener('pointerleave', this._pointerExitMethod);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error("Error setting up state machine listeners: The canvas element doesn't exist.");
    }
  }

  private _cleanupStateMachineListeners(): void {
    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      this._canvas.removeEventListener('click', this._clickMethod);
      this._canvas.removeEventListener('pointerup', this._pointerUpMethod);
      this._canvas.removeEventListener('pointerdown', this._pointerDownMethod);
      this._canvas.removeEventListener('pointermove', this._pointerMoveMethod);
      this._canvas.removeEventListener('pointerenter', this._pointerEnterMethod);
      this._canvas.removeEventListener('pointerleave', this._pointerExitMethod);
    }
  }

  public getStateMachine(stateMachineId: string): string {
    return this._dotLottieCore?.getStateMachine(stateMachineId) ?? '';
  }

  public activeStateMachineId(): string {
    return this._dotLottieCore?.activeStateMachineId() ?? '';
  }

  public animationSize(): { height: number; width: number } {
    const width = this._dotLottieCore?.animationSize().get(0) ?? 0;
    const height = this._dotLottieCore?.animationSize().get(1) ?? 0;

    return {
      width,
      height,
    };
  }

  public stateMachineOverrideCurrentState(state: string, do_tick: boolean): boolean {
    return this._dotLottieCore?.stateMachineOverrideCurrentState(state, do_tick) ?? false;
  }

  public stateMachineSetBooleanInput(name: string, value: boolean): boolean {
    return this._dotLottieCore?.stateMachineSetBooleanInput(name, value) ?? false;
  }

  public stateMachineSetNumericInput(name: string, value: number): boolean {
    return this._dotLottieCore?.stateMachineSetNumericInput(name, value) ?? false;
  }

  public stateMachineSetStringInput(name: string, value: string): boolean {
    return this._dotLottieCore?.stateMachineSetStringInput(name, value) ?? false;
  }

  public stateMachineGetStringInput(name: string): string | undefined {
    return this._dotLottieCore?.stateMachineGetStringInput(name);
  }

  public stateMachineGetNumericInput(name: string): number | undefined {
    return this._dotLottieCore?.stateMachineGetNumericInput(name);
  }

  public stateMachineGetBooleanInput(name: string): boolean | undefined {
    return this._dotLottieCore?.stateMachineGetBooleanInput(name);
  }

  public stateMachineFire(eventName: string): void {
    this._dotLottieCore?.stateMachineFireEvent(eventName);
  }

  public stateMachineCurrentState(): string {
    return this._dotLottieCore?.stateMachineCurrentState() ?? '';
  }

  /**
   * Get the bounds of a layer by its name
   * @param layerName - The name of the layer
   * @returns The bounds of the layer
   *
   * @example
   * ```typescript
   * // Draw a red rectangle around the layer 'Layer 1'
    dotLottie.addEventListener('render', () => {
      const ctx = canvas.getContext('2d');
      const points = dotLottie.getLayerBoundingBox('Layer ');

      if (!points) return;
      if (!ctx) return;

      const ax = points.x1;
      const ay = points.y1;
      const cx = points.x3;
      const cy = points.y3;
      const dx = points.x4;
      const dy = points.y4;

      const width = Math.sqrt((dx - cx) ** 2 + (dy - cy) ** 2);
      const height = Math.sqrt((ax - dx) ** 2 + (ay - dy) ** 2);

      ctx.strokeStyle = 'red';
      ctx.strokeRect(ax, ay, width, height);
    });
   * ```
   */
  public getLayerBoundingBox(layerName: string):
    | {
        x1: number;
        x2: number;
        x3: number;
        x4: number;
        y1: number;
        y2: number;
        y3: number;
        y4: number;
      }
    | undefined {
    const bounds = this._dotLottieCore?.getLayerBounds(layerName);

    if (!bounds) return undefined;

    if (bounds.size() !== 8) return undefined;

    const x1 = bounds.get(0) as number;
    const y1 = bounds.get(1) as number;
    const x2 = bounds.get(2) as number;
    const y2 = bounds.get(3) as number;
    const x3 = bounds.get(4) as number;
    const y3 = bounds.get(5) as number;
    const x4 = bounds.get(6) as number;
    const y4 = bounds.get(7) as number;

    return {
      x1,
      x2,
      x3,
      x4,
      y1,
      y2,
      y3,
      y4,
    };
  }

  public static transformThemeToLottieSlots(theme: string, slots: string): string {
    return DotLottie._wasmModule?.transformThemeToLottieSlots(theme, slots) ?? '';
  }
}
