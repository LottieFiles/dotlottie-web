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
} from './core';
import { DotLottieWasmLoader } from './core';
import type { EventListener, EventType } from './event-manager';
import { EventManager } from './event-manager';
import { OffscreenObserver } from './offscreen-observer';
import { CanvasResizeObserver } from './resize-observer';
import type {
  Mode,
  Fit,
  Config,
  Layout,
  Manifest,
  RenderConfig,
  Data,
  StateMachineConfig,
  Transform,
  RenderSurface,
} from './types';
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

export class DotLottie {
  private _canvas: HTMLCanvasElement | OffscreenCanvas | RenderSurface | null = null;

  private _pendingLoad: { data?: Data; src?: string } | null = null;

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

  private _bufferMismatchCount = 0;

  private _lastExpectedBufferSize = 0;

  /**
   * Creates a new DotLottie player instance for rendering Lottie animations.
   * Initializes the WASM module, event system, and loads animation if src or data is provided in config.
   * @param config - Configuration object specifying animation source, playback settings, and rendering options
   */
  public constructor(config: Config) {
    this._canvas = config.canvas ?? null;

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
          if (this._canvas) {
            this._loadFromData(config.data);
          } else {
            this._pendingLoad = { data: config.data };
          }
        } else if (config.src) {
          if (this._canvas) {
            this._loadFromSrc(config.src);
          } else {
            this._pendingLoad = { src: config.src };
          }
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

    if (!this._canvas) {
      console.warn('[dotlottie-web] Cannot load animation without canvas. Call setCanvas() first.');

      return;
    }

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

  /**
   * Gets the raw pixel buffer containing the rendered animation frame.
   * Returns RGBA pixel data as a Uint8Array for advanced image processing or custom rendering.
   */
  public get buffer(): Uint8Array | null {
    if (!this._dotLottieCore) return null;

    return this._dotLottieCore.buffer() as Uint8Array;
  }

  /**
   * Gets the ID of the currently active animation from a multi-animation dotLottie file.
   * Returns undefined if no specific animation is active or for single-animation files.
   */
  public get activeAnimationId(): string | undefined {
    return this._dotLottieCore?.activeAnimationId();
  }

  /**
   * Gets the ID of the currently active theme applied to the animation.
   * Returns undefined if no theme is active. Themes modify colors and visual properties.
   */
  public get activeThemeId(): string | undefined {
    return this._dotLottieCore?.activeThemeId();
  }

  /**
   * Gets the current layout configuration for positioning and scaling the animation.
   * Includes fit mode (contain, cover, fill, etc.) and alignment [x, y] values (0-1 range).
   */
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

  /**
   * Gets the currently active marker name if a marker-based segment is set.
   * Returns undefined if no marker is active. Use setMarker() to activate a named segment.
   */
  public get marker(): string | undefined {
    const marker = this._dotLottieCore?.config().marker as string | undefined;

    return marker;
  }

  /**
   * Gets the animation manifest containing metadata about animations, themes, and states.
   * Returns null if no manifest is available or if the loaded animation doesn't include one.
   */
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

  /**
   * Gets the current rendering configuration.
   * Includes settings like devicePixelRatio, autoResize, and freezeOnOffscreen.
   */
  public get renderConfig(): RenderConfig {
    return this._renderConfig;
  }

  /**
   * Gets the currently active playback segment as [startFrame, endFrame].
   * If no segment is set, returns undefined and the full animation plays.
   */
  public get segment(): [number, number] | undefined {
    const segment = this._dotLottieCore?.config().segment;

    if (segment && segment.size() === 2) {
      return [segment.get(0) as number, segment.get(1) as number];
    }

    return undefined;
  }

  /**
   * Gets the current loop configuration.
   * Returns true if the animation is set to loop continuously.
   */
  public get loop(): boolean {
    return this._dotLottieCore?.config().loopAnimation ?? false;
  }

  /**
   * Gets the current playback mode.
   * Determines playback direction: 'forward', 'reverse', 'bounce' (forward then reverse), or 'reverse-bounce'.
   */
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

  /**
   * Indicates whether rendering is currently frozen.
   * True when freeze() has been called and the rendering loop is paused to save resources.
   */
  public get isFrozen(): boolean {
    return this._isFrozen;
  }

  /**
   * Indicates whether a state machine is currently active and running.
   * True after stateMachineStart() is called and until stateMachineStop() is called.
   */
  public get isStateMachineRunning(): boolean {
    return this._isStateMachineRunning;
  }

  /**
   * Gets the current background color.
   * Returns the background color as a string (e.g., '#FFFFFF' or 'transparent').
   */
  public get backgroundColor(): string {
    return this._backgroundColor ?? '';
  }

  /**
   * Gets the autoplay configuration.
   * Returns true if the animation is configured to start playing automatically when loaded.
   */
  public get autoplay(): boolean {
    return this._dotLottieCore?.config().autoplay ?? false;
  }

  /**
   * Gets the frame interpolation setting.
   * Returns true if frame interpolation is enabled for smoother animation playback.
   */
  public get useFrameInterpolation(): boolean {
    return this._dotLottieCore?.config().useFrameInterpolation ?? false;
  }

  /**
   * Gets the current playback speed.
   * Returns the speed multiplier (1 = normal speed, 2 = double speed, 0.5 = half speed).
   */
  public get speed(): number {
    return this._dotLottieCore?.config().speed ?? 0;
  }

  /**
   * Indicates whether the WASM module and core player have been initialized.
   * Check this before performing operations that require the player to be ready.
   */
  public get isReady(): boolean {
    return this._dotLottieCore !== null;
  }

  /**
   * Indicates whether an animation has been successfully loaded and is ready for playback.
   * Check this before calling play() or other playback methods to ensure the animation is ready.
   */
  public get isLoaded(): boolean {
    return this._dotLottieCore?.isLoaded() ?? false;
  }

  /**
   * Indicates whether the animation is currently playing.
   * True when animation is actively playing, false when paused, stopped, or not started.
   */
  public get isPlaying(): boolean {
    return this._dotLottieCore?.isPlaying() ?? false;
  }

  /**
   * Indicates whether the animation is currently paused.
   * True when pause() has been called and animation is not playing or stopped.
   */
  public get isPaused(): boolean {
    return this._dotLottieCore?.isPaused() ?? false;
  }

  /**
   * Indicates whether the animation is currently stopped.
   * True when stop() has been called or animation hasn't started yet.
   */
  public get isStopped(): boolean {
    return this._dotLottieCore?.isStopped() ?? false;
  }

  /**
   * Gets the current frame number of the animation.
   * Useful for tracking playback position or implementing custom frame displays. Rounded to 2 decimal places.
   */
  public get currentFrame(): number {
    if (!this._dotLottieCore) return 0;

    return Math.round(this._dotLottieCore.currentFrame() * 100) / 100;
  }

  /**
   * Gets the number of times the animation has completed a loop during the current playback.
   * Increments each time the animation completes one full cycle.
   */
  public get loopCount(): number {
    return this._dotLottieCore?.loopCount() ?? 0;
  }

  /**
   * Gets the total number of frames in the animation.
   * Use with currentFrame to calculate playback progress as a percentage.
   */
  public get totalFrames(): number {
    return this._dotLottieCore?.totalFrames() ?? 0;
  }

  /**
   * Gets the total duration of the animation in seconds.
   * Represents the time to play from the first frame to the last at normal speed (speed = 1).
   */
  public get duration(): number {
    return this._dotLottieCore?.duration() ?? 0;
  }

  /**
   * Gets the duration of the currently active segment in seconds.
   * If no segment is set, returns the full animation duration.
   */
  public get segmentDuration(): number {
    return this._dotLottieCore?.segmentDuration() ?? 0;
  }

  /**
   * Gets the canvas element used for rendering the animation.
   * Returns the HTMLCanvasElement, OffscreenCanvas, or RenderSurface set during initialization.
   */
  public get canvas(): HTMLCanvasElement | OffscreenCanvas | RenderSurface | null {
    return this._canvas;
  }

  /**
   * Dynamically loads a new animation, replacing the current one if any.
   * Stops current playback, cleans up resources, and loads from the provided src or data.
   * @param config - Configuration for the new animation (all Config properties except canvas)
   */
  public load(config: Omit<Config, 'canvas'>): void {
    if (this._dotLottieCore === null || DotLottie._wasmModule === null) return;

    this._stopAnimationLoop();

    this._cleanupCanvas();

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
      if (this._canvas) {
        this._loadFromData(config.data);
      } else {
        this._pendingLoad = { data: config.data };
      }
    } else if (config.src) {
      if (this._canvas) {
        this._loadFromSrc(config.src);
      } else {
        this._pendingLoad = { src: config.src };
      }
    }

    this.setBackgroundColor(config.backgroundColor ?? '');
  }

  private _draw(): void {
    if (this._dotLottieCore === null || this._canvas === null) return;

    // Only try to get context if canvas has getContext method and no context exists yet
    if (
      !this._context &&
      'getContext' in this._canvas &&
      typeof this._canvas.getContext === 'function' &&
      ((typeof HTMLCanvasElement !== 'undefined' && this._canvas instanceof HTMLCanvasElement) ||
        (typeof OffscreenCanvas !== 'undefined' && this._canvas instanceof OffscreenCanvas))
    ) {
      this._context = this._canvas.getContext('2d') as
        | CanvasRenderingContext2D
        | OffscreenCanvasRenderingContext2D
        | null;
    }

    // Only process visual output if we have a canvas with a valid context
    if (this._context) {
      const buffer = this._dotLottieCore.buffer() as ArrayBuffer;

      const expectedLength = this._canvas.width * this._canvas.height * BYTES_PER_PIXEL;

      /* 
        frame buffer size mismatch can occur temporarily during resize operations when the WASM buffer allocation hasn't completed yet
      */
      if (buffer.byteLength !== expectedLength) {
        if (this._lastExpectedBufferSize === expectedLength) {
          this._bufferMismatchCount += 1;
        } else {
          this._bufferMismatchCount = 1;
          this._lastExpectedBufferSize = expectedLength;
        }

        if (this._bufferMismatchCount === 10) {
          console.warn(
            `[dotlottie-web] Persistent buffer size mismatch detected. ` +
              `Expected ${expectedLength} bytes for canvas ${this._canvas.width}x${this._canvas.height}, ` +
              `but got ${buffer.byteLength} bytes. ` +
              `This may indicate a WASM memory allocation issue or invalid canvas dimensions.`,
          );
        }

        return;
      }

      this._bufferMismatchCount = 0;
      this._lastExpectedBufferSize = expectedLength;

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

  private _cleanupCanvas(): void {
    if (this._canvas && IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      OffscreenObserver.unobserve(this._canvas);
      CanvasResizeObserver.unobserve(this._canvas);
      this._cleanupStateMachineListeners();
    }
  }

  private _initializeCanvas(): void {
    this._context = null;

    if (this._canvas && IS_BROWSER && this._canvas instanceof HTMLCanvasElement && this.isLoaded) {
      if (this._renderConfig.freezeOnOffscreen) {
        OffscreenObserver.observe(this._canvas, this);

        if (!isElementInViewport(this._canvas)) {
          this.freeze();
        }
      }

      if (this._renderConfig.autoResize) {
        CanvasResizeObserver.observe(this._canvas, this);
      }

      if (this._isStateMachineRunning) {
        this._setupStateMachineListeners();
      }
    }

    if (this._canvas && this._dotLottieCore && this.isLoaded) {
      const resized = this._dotLottieCore.resize(this._canvas.width, this._canvas.height);

      if (resized) {
        this._dotLottieCore.render();
        this._draw();
      }
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

  /**
   * Starts or resumes animation playback from the current frame.
   * Unfreezes rendering if frozen and starts the animation loop. Updates isPlaying state to true.
   */
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
      this._canvas &&
      IS_BROWSER &&
      this._canvas instanceof HTMLCanvasElement &&
      this._renderConfig.freezeOnOffscreen &&
      !isElementInViewport(this._canvas)
    ) {
      this.freeze();
    }
  }

  /**
   * Pauses animation playback at the current frame.
   * Stops the animation loop while preserving the current frame position. Updates isPaused state to true.
   */
  public pause(): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.pause();

    this._stopAnimationLoop();
  }

  /**
   * Stops animation playback and resets to the start frame.
   * Halts the animation loop and returns to the beginning. Updates isStopped state to true.
   */
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

  /**
   * Seeks to a specific frame in the animation and renders it.
   * Useful for implementing custom scrubbing controls or precise frame positioning.
   * @param frame - The target frame number to seek to
   */
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

  /**
   * Changes the animation playback speed.
   * Values above 1 speed up playback, below 1 slow it down.
   * @param speed - Playback speed multiplier (e.g., 2 for 2x speed, 0.5 for half speed)
   */
  public setSpeed(speed: number): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      speed,
    });
  }

  /**
   * Changes the background color of the canvas or animation.
   * For HTMLCanvasElement, sets the CSS background. For other surfaces, renders behind the animation.
   * @param color - CSS color string (e.g., '#FFFFFF', 'rgba(0,0,0,0.5)', 'transparent')
   */
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

  /**
   * Enables or disables continuous looping of the animation.
   * When enabled with loopCount set to 0, animation repeats indefinitely.
   * @param loop - True to enable looping, false to play once
   */
  public setLoop(loop: boolean): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      loopAnimation: loop,
    });
  }

  /**
   * Sets the number of additional times to replay the animation after the first play.
   * Requires loop to be true. A value of 0 means infinite replays; a positive value n means
   * the animation plays a total of n + 1 times (initial play + n replays).
   * @param loopCount - Number of additional replays (0 = infinite, 1 = plays twice, 2 = plays three times, etc.)
   */
  public setLoopCount(loopCount: number): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      loopCount,
    });
  }

  /**
   * Enables or disables frame interpolation for smoother playback.
   * When enabled, interpolates between frames. When disabled, shows exact frame-by-frame animation.
   * @param useFrameInterpolation - True for smooth interpolation, false for exact frames
   */
  public setUseFrameInterpolation(useFrameInterpolation: boolean): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      useFrameInterpolation,
    });
  }

  /**
   * Subscribes to animation events like play, pause, frame, complete, etc.
   * Use this to react to animation state changes and playback progress.
   * @param type - Event type to listen for (e.g., 'play', 'frame', 'complete')
   * @param listener - Callback function invoked when the event occurs
   */
  public addEventListener<T extends EventType>(type: T, listener: EventListener<T>): void {
    this._eventManager.addEventListener(type, listener);
  }

  /**
   * Unsubscribes from animation events.
   * If no listener is provided, removes all listeners for the given event type.
   * @param type - Event type to stop listening for
   * @param listener - Specific callback to remove, or undefined to remove all
   */
  public removeEventListener<T extends EventType>(type: T, listener?: EventListener<T>): void {
    this._eventManager.removeEventListener(type, listener);
  }

  /**
   * Cleans up and destroys the player instance, releasing all resources.
   * Stops playback, removes event listeners, and frees WASM memory. Call when the player is no longer needed.
   */
  public destroy(): void {
    this._stopAnimationLoop();

    // Reset state machine status
    this._isStateMachineRunning = false;

    this._cleanupCanvas();

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
  }

  /**
   * Pauses the rendering loop without changing playback state.
   * Useful for reducing CPU/GPU usage when the animation is offscreen or hidden. Dispatches 'freeze' event.
   */
  public freeze(): void {
    if (this._animationFrameId === null) return;

    this._stopAnimationLoop();

    this._isFrozen = true;

    this._eventManager.dispatch({ type: 'freeze' });
  }

  /**
   * Resumes the rendering loop after being frozen.
   * Restarts frame rendering while maintaining the current playback state. Dispatches 'unfreeze' event.
   */
  public unfreeze(): void {
    if (this._animationFrameId !== null) return;

    this._isFrozen = false;

    this._eventManager.dispatch({ type: 'unfreeze' });

    this._startAnimationLoop();
  }

  /**
   * Recalculates and updates canvas dimensions based on current size.
   * Call this when the canvas container size changes to maintain proper rendering. Usually handled by autoResize.
   */
  public resize(): void {
    if (!this._dotLottieCore || !this.isLoaded || !this._canvas) return;

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
      this._dotLottieCore.render();
      this._draw();
    }
  }

  /**
   * Changes the canvas element used for rendering.
   * Useful for moving the animation to a different canvas without recreating the player instance.
   * @param canvas - New HTMLCanvasElement, OffscreenCanvas, or RenderSurface to render to
   */
  public setCanvas(canvas: HTMLCanvasElement | OffscreenCanvas | RenderSurface): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!canvas || this._canvas === canvas) return;

    if (this._canvas) {
      this._cleanupCanvas();
    }

    this._canvas = canvas;

    this._initializeCanvas();

    if (this._pendingLoad) {
      const pending = this._pendingLoad;

      this._pendingLoad = null;

      if (pending.data) {
        this._loadFromData(pending.data);
      } else if (pending.src) {
        this._loadFromSrc(pending.src);
      }
    }
  }

  /**
   * Applies a 3x3 transformation matrix to the entire animation on the canvas.
   * Use this to translate, rotate, scale, or skew the animation rendering.
   * @param transform - 9-element array representing the transformation matrix in row-major order
   * @returns True if transformation was applied successfully, false otherwise
   */
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

  /**
   * Gets the 3x3 transformation matrix applied to the animation.
   * Returns a 9-element array representing affine transformations (translation, rotation, scale, skew).
   * @returns Transform array of 9 numbers, or undefined if not available
   */
  public getTransform(): Transform | undefined {
    if (!this._dotLottieCore) return undefined;

    const transform: Transform = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    const transformVector = this._dotLottieCore.getTransform();

    for (let i = 0; i < transformVector.size(); i += 1) {
      transform[i] = transformVector.get(i) as number;
    }

    return transform;
  }

  /**
   * Sets a frame range to play instead of the full animation.
   * Useful for playing specific sections or creating animation sequences from subsections.
   * @param startFrame - Starting frame number (inclusive)
   * @param endFrame - Ending frame number (inclusive)
   */
  public setSegment(startFrame: number, endFrame: number): void {
    if (this._dotLottieCore === null || DotLottie._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      segment: createCoreSegment([startFrame, endFrame], DotLottie._wasmModule),
    });
  }

  /**
   * Changes the playback direction mode.
   * Controls whether animation plays forward, in reverse, or alternates (bounce).
   * @param mode - Playback mode: 'forward', 'reverse', 'bounce', or 'reverse-bounce'
   */
  public setMode(mode: Mode): void {
    if (this._dotLottieCore === null || DotLottie._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      mode: createCoreMode(mode, DotLottie._wasmModule),
    });
  }

  /**
   * Updates rendering configuration like autoResize, devicePixelRatio, and freezeOnOffscreen.
   * Dynamically changes how the canvas behaves without reloading the animation.
   * @param config - Partial RenderConfig with properties to update
   */
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

  /**
   * Switches to a different animation within a multi-animation dotLottie file.
   * Use this to load a different animation by its ID without creating a new player instance.
   * @param animationId - ID of the animation to load (must exist in the manifest)
   */
  public loadAnimation(animationId: string): void {
    if (this._dotLottieCore === null || this._dotLottieCore.activeAnimationId() === animationId || !this._canvas)
      return;

    const loaded = this._dotLottieCore.loadAnimation(animationId, this._canvas.width, this._canvas.height);

    if (loaded) {
      if (this._renderConfig.quality !== undefined) {
        this._dotLottieCore.setQuality(this._renderConfig.quality);
      }
      this.resize();
    }
  }

  /**
   * Activates a named marker to play only that marked segment.
   * Markers define named sections within an animation. Use markers() to list available markers.
   * @param marker - Name of the marker to activate
   */
  public setMarker(marker: string): void {
    if (this._dotLottieCore === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      marker,
    });
  }

  /**
   * Gets all markers defined in the animation with their time and duration.
   * Markers represent named sections that can be played using setMarker().
   * @returns Array of marker objects with name, time, and duration properties
   */
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

  /**
   * Applies a theme to the animation, modifying colors and visual properties.
   * Themes are predefined in the dotLottie manifest. Returns true if theme was successfully loaded.
   * @param themeId - ID of the theme to apply (must exist in manifest)
   * @returns True if theme loaded successfully, false otherwise
   */
  public setTheme(themeId: string): boolean {
    if (this._dotLottieCore === null) return false;

    const themeLoaded = this._dotLottieCore.setTheme(themeId);

    if (themeLoaded) {
      this._dotLottieCore.render();
      this._draw();
    }

    return themeLoaded;
  }

  /**
   * Removes the currently applied theme and restores original animation colors.
   * Use this to revert to the default appearance after applying a theme.
   * @returns True if theme was reset successfully, false otherwise
   */
  public resetTheme(): boolean {
    if (this._dotLottieCore === null) return false;

    const themeReset = this._dotLottieCore.resetTheme();

    if (themeReset) {
      this._dotLottieCore.render();
      this._draw();
    }

    return themeReset;
  }

  /**
   * Applies a custom theme from raw theme data instead of manifest theme ID.
   * Useful for dynamically generated or user-created themes not in the manifest.
   * @param themeData - Theme data as a JSON string
   * @returns True if theme loaded successfully, false otherwise
   */
  public setThemeData(themeData: string): boolean {
    if (this._dotLottieCore === null) return false;

    const themeLoaded = this._dotLottieCore.setThemeData(themeData);

    if (themeLoaded) {
      this._dotLottieCore.render();
      this._draw();
    }

    return themeLoaded;
  }

  /**
   * Sets slot values for parameterized animations with named slots.
   * Slots allow runtime customization of text, images, or colors in the animation.
   * @param slots - Slot values as a JSON string mapping slot names to values
   */
  public setSlots(slots: string): void {
    if (this._dotLottieCore === null) return;

    if (this._dotLottieCore.setSlots(slots)) {
      this._dotLottieCore.render();
      this._draw();
    }
  }

  /**
   * Updates the layout configuration for positioning and scaling the animation.
   * Changes how the animation fits and aligns within the canvas without requiring a reload.
   * @param layout - New layout configuration with fit mode and alignment values
   */
  public setLayout(layout: Layout): void {
    if (this._dotLottieCore === null || DotLottie._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      layout: createCoreLayout(layout, DotLottie._wasmModule),
    });
  }

  /**
   * Sets a custom viewport region for rendering a portion of the animation.
   * Defines a rectangular area to render, useful for implementing animation clipping or panning effects.
   * @param x - X coordinate of the viewport's top-left corner
   * @param y - Y coordinate of the viewport's top-left corner
   * @param width - Width of the viewport in pixels
   * @param height - Height of the viewport in pixels
   * @returns True if viewport was set successfully, false otherwise
   */
  public setViewport(x: number, y: number, width: number, height: number): boolean {
    if (this._dotLottieCore === null) return false;

    return this._dotLottieCore.setViewport(x, y, width, height);
  }

  /**
   * Configures the URL for loading the WASM module.
   * Call this before creating any player instances to load the WASM from a custom CDN or local path.
   * @param url - URL pointing to the dotlottie WASM file
   */
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
   * Animates smoothly to a specific frame over a duration using linear easing.
   * Creates a tween animation transitioning from the current frame to the target frame.
   * @param frame - Target frame number to tween to
   * @param duration - Duration of the tween animation in seconds
   * @returns True if tween started successfully, false otherwise
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
   * @param duration - Duration of the tween animation in seconds
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

  /**
   * Gets the original dimensions of the animation as defined in the source file.
   * Returns width and height in pixels representing the animation's intrinsic size.
   * @returns Object with width and height properties in pixels
   */
  public animationSize(): { height: number; width: number } {
    const width = this._dotLottieCore?.animationSize().get(0) ?? 0;
    const height = this._dotLottieCore?.animationSize().get(1) ?? 0;

    return {
      width,
      height,
    };
  }

  /**
   * Gets the Oriented Bounding Box (OBB) points of a layer by its name.
   * Returns 8 numbers representing 4 corner points (x,y) in clockwise order from top-left: [x0, y0, x1, y1, x2, y2, x3, y3].
   * @param layerName - Name of the layer to get bounds for
   * @returns Array of 8 numbers representing the bounding box corners, or undefined if layer not found
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

  /**
   * Converts theme data into Lottie slot format for dynamic content replacement.
   * Utility function for transforming theme definitions into slot-compatible data structures.
   * @param theme - Theme data as a JSON string
   * @param slots - Slot definitions as a JSON string
   * @returns Transformed slots data as a JSON string
   */
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
   * Loads a state machine by its ID from the dotLottie manifest.
   * State machines enable interactive, event-driven animation behaviors.
   * @param stateMachineId - The ID of the state machine to load (must exist in manifest)
   * @returns True if the state machine was loaded successfully, false otherwise
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
}
