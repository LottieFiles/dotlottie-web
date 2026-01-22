/* eslint-disable no-plusplus */
import type {
  DotLottiePlayer,
  MainModule,
  Mode as CoreMode,
  VectorFloat,
  Marker,
  Fit as CoreFit,
} from '../software/wasm/dotlottie-player.types';

import { AnimationFrameManager } from './animation-frame-manager';
import { IS_BROWSER } from './constants';
import type { EventListener, EventType } from './event-manager';
import { EventManager } from './event-manager';
import { OffscreenObserver } from './offscreen-observer';
import { CanvasResizeObserver } from './resize-observer';
import type { Mode, Fit, Config, Layout, Manifest, RenderConfig, Data } from './types';
import { getDefaultDPR, hexStringToRGBAInt, isDotLottie, isElementInViewport, isLottie } from './utils';

// Type definition for WasmLoader
export interface WasmLoaderType {
  load(): Promise<MainModule>;
  setWasmUrl(url: string): void;
}

// Helper functions for conversion
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

// Helper function to safely check if an object is an HTMLCanvasElement
const isHTMLCanvasElement = (obj: unknown): obj is HTMLCanvasElement => {
  return typeof HTMLCanvasElement !== 'undefined' && obj instanceof HTMLCanvasElement;
};

let canvasId = 0;

export class DotLottieCommon {
  private readonly _canvas: HTMLCanvasElement | OffscreenCanvas;

  private _context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null = null;

  private readonly _eventManager: EventManager;

  private _animationFrameId: number | null = null;

  private readonly _frameManager: AnimationFrameManager;

  private _dotLottieCore: DotLottiePlayer | null = null;

  private _wasmModule: MainModule | null = null;

  private _renderConfig: RenderConfig = {};

  private _isFrozen: boolean = false;

  private _backgroundColor: string | null = null;

  private readonly _pointerUpMethod: (event: PointerEvent) => void;

  private readonly _pointerDownMethod: (event: PointerEvent) => void;

  private readonly _pointerMoveMethod: (event: PointerEvent) => void;

  private readonly _pointerEnterMethod: (event: PointerEvent) => void;

  private readonly _pointerExitMethod: (event: PointerEvent) => void;

  private readonly _wasmLoader: WasmLoaderType;

  private readonly _renderer: string;

  private _selector: string = '';

  private _swBuffer: Uint8Array | null = null;

  private _swBufferPtr: number | null = null;

  public constructor(config: Config, wasmLoader: WasmLoaderType, renderer: string = 'sw') {
    this._canvas = config.canvas;
    this._wasmLoader = wasmLoader;
    this._renderer = renderer;

    this._eventManager = new EventManager();
    this._frameManager = new AnimationFrameManager();
    this._renderConfig = {
      ...config.renderConfig,
      devicePixelRatio: config.renderConfig?.devicePixelRatio || getDefaultDPR(),
      // freezeOnOffscreen is true by default to prevent unnecessary rendering when the canvas is offscreen
      freezeOnOffscreen: config.renderConfig?.freezeOnOffscreen ?? true,
    };

    this._wasmLoader
      .load()
      .then((module) => {
        this._wasmModule = module;

        // let engine = null;

        // if (this._renderer === 'wg') {
        //   engine = module.TvgEngine.TvgEngineWg;
        // } else if (this._renderer === 'gl') {
        //   engine = module.TvgEngine.TvgEngineGl;
        // } else {
        //   engine = module.TvgEngine.TvgEngineSw;
        // }

        if (isHTMLCanvasElement(this._canvas)) {
          if (this._canvas.id) {
            this._selector = `#${this._canvas.id}`;
          } else if (this._renderer !== 'sw') {
            if (!this._canvas.getAttribute('data-dl-id')) {
              this._canvas.setAttribute('data-dl-id', `${canvasId}`);
              canvasId += 1;
            }
            this._selector = `[data-dl-id="${this._canvas.getAttribute('data-dl-id')}"]`;
          }
        }

        this._dotLottieCore = new module.DotLottiePlayer({
          ...module.createDefaultConfig(),
          themeId: config.themeId ?? '',
          autoplay: config.autoplay ?? false,
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

        // Note: Render target setup happens after animation load, not here

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
      .catch((error: Error) => {
        console.error('error', error);
        this._eventManager.dispatch({
          type: 'loadError',
          error: new Error(`Failed to load wasm module: ${error}`),
        });
      });

    this._pointerUpMethod = this._onPointerUp.bind(this);

    this._pointerDownMethod = this._onPointerDown.bind(this);

    this._pointerMoveMethod = this._onPointerMove.bind(this);

    this._pointerEnterMethod = this._onPointerEnter.bind(this);

    this._pointerExitMethod = this._onPointerLeave.bind(this);
  }

  private _dispatchError(message: string): void {
    console.error(message);
    this._eventManager.dispatch({ type: 'loadError', error: new Error(message) });
  }

  private async _setupRenderTarget(module: MainModule, selector: string): Promise<void> {
    if (!this._dotLottieCore) return;

    const width = this._canvas.width;
    const height = this._canvas.height;
    const colorSpace = module.ColorSpace.ABGR8888S;

    console.log(
      `Setting up render target for ${this._renderer} renderer, canvas: ${width}x${height}, selector: ${selector}`,
    );

    if (this._renderer === 'sw') {
      // Software renderer: allocate our own buffer and pass pointer to setSwTarget
      console.log('Software renderer: Setting up buffer target');
      try {
        const bufferSize = width * height * 4;

        // Allocate buffer in WASM heap
        const malloc = (module as unknown)._malloc as ((size: number) => number) | undefined;

        if (!malloc) {
          console.error('_malloc not found in WASM module');

          return;
        }

        // Free old buffer if it exists
        if (this._swBufferPtr !== null) {
          const free = (module as unknown)._free as ((ptr: number) => void) | undefined;

          if (free) {
            free(this._swBufferPtr);
          }
        }

        // Allocate new buffer
        this._swBufferPtr = malloc(bufferSize);
        console.log(`Allocated buffer: ${bufferSize} bytes at pointer ${this._swBufferPtr}`);

        // Create a Uint8Array view of the WASM heap memory for reading pixels
        this._swBuffer = new Uint8Array((module as unknown).HEAPU8.buffer, this._swBufferPtr, bufferSize);

        // setSwTarget expects: buffer (*mut u32), stride (u32 count), width, height
        // stride is the number of u32 values per row (typically same as width)
        const stride = width;
        const bufferPtr = BigInt(this._swBufferPtr);

        console.log(
          `Calling setSwTarget with: bufferPtr=${bufferPtr}, stride=${stride}, width=${width}, height=${height}, colorSpace=${colorSpace.value}`,
        );
        const result = this._dotLottieCore.setSwTarget(bufferPtr, stride, width, height, colorSpace);

        console.log(`setSwTarget result: ${result}`);

        if (!result) {
          console.error('setSwTarget returned false - buffer setup failed');
        }
      } catch (error) {
        console.error('Failed to set software render target:', error);
      }
    } else if (this._renderer === 'gl') {
      // WebGL renderer: let Emscripten create the context
      if (!selector) {
        console.error('No selector provided for WebGL renderer');

        return;
      }

      if (!isHTMLCanvasElement(this._canvas)) {
        console.error('WebGL requires an HTMLCanvasElement');

        return;
      }

      console.log('WebGL: Creating Emscripten WebGL context for selector:', selector);
      console.log(
        'Canvas element:',
        this._canvas,
        'ID:',
        this._canvas.id,
        'data-dl-id:',
        this._canvas.getAttribute('data-dl-id'),
      );

      try {
        // Let Emscripten create the WebGL context - don't create it ourselves first
        const contextHandle = (module as unknown).webgl_context_create(selector);

        console.log(`WebGL context handle from Emscripten: ${contextHandle}, type: ${typeof contextHandle}`);

        // Emscripten WebGL context handles start at 1 (0 means error)
        if (contextHandle && contextHandle > 0) {
          console.log('Valid context handle received, making it current...');

          // IMPORTANT: Make the context current before using it
          const makeCurrentResult = (module as unknown).webgl_context_make_current?.(contextHandle);

          console.log(`webgl_context_make_current result: ${makeCurrentResult}`);

          if (makeCurrentResult !== 0) {
            console.error('Failed to make WebGL context current');

            return;
          }

          console.log('Calling setGlTarget');
          const fbo = 0;
          // Rust signature: tvg_glcanvas_set_target(canvas, context, id, w, h, cs)
          // TypeScript: setGlTarget(context, id, w, h, cs)
          const result = this._dotLottieCore.setGlTarget(BigInt(contextHandle), fbo, width, height, colorSpace);

          console.log(`setGlTarget result: ${result}`);

          if (result) {
            console.log('✓ Successfully set WebGL target');
          } else {
            console.error('setGlTarget returned false');
          }
        } else {
          console.error('Invalid WebGL context handle from Emscripten:', contextHandle);
          console.log('Checking if canvas is in DOM:', document.contains(this._canvas));
          console.log('Trying to query canvas with selector:', document.querySelector(selector));
        }
      } catch (error) {
        console.error('Error setting up WebGL target:', error);
      }
    } else if (this._renderer === 'wg') {
      // WebGPU renderer: create context and get handles
      if (!selector) {
        console.error('No selector provided for WebGPU renderer');

        return;
      }

      if (!isHTMLCanvasElement(this._canvas)) {
        console.error('WebGPU requires an HTMLCanvasElement');

        return;
      }

      console.log('WebGPU: Setting up with Dawn - selector:', selector);

      try {
        // Poll for adapter and device initialization
        const maxAttempts = 100;
        let attempts = 0;

        console.log('Initializing WebGPU (this may take a moment)...');

        while (attempts < maxAttempts) {
          const adapterStatus = (module as unknown).webgpu_request_adapter?.();
          const deviceStatus = (module as unknown).webgpu_request_device?.();

          // Check for failure
          if (adapterStatus === 1 || deviceStatus === 1) {
            console.error('WebGPU initialization failed');

            return;
          }

          // Check if both are ready (status 0 = success)
          if (adapterStatus === 0 && deviceStatus === 0) {
            console.log(`✓ WebGPU initialized after ${attempts} attempts`);
            break;
          }

          // Still in progress (status 2), wait a bit and retry
          await new Promise((resolve) => setTimeout(resolve, 10));
          attempts++;
        }

        if (attempts >= maxAttempts) {
          console.error('WebGPU initialization timeout');

          return;
        }

        // Get handles
        const adapterHandle = (module as unknown).webgpu_get_adapter?.();
        const deviceHandle = (module as unknown).webgpu_get_device?.();
        const instanceHandle = (module as unknown).webgpu_get_instance?.();
        const surfaceHandle = (module as unknown).webgpu_get_surface?.(selector);

        console.log('WebGPU handles from WASM:');
        console.log('  Adapter:', adapterHandle, '(type:', typeof adapterHandle, ')');
        console.log('  Device:', deviceHandle, '(type:', typeof deviceHandle, ')');
        console.log('  Instance:', instanceHandle, '(type:', typeof instanceHandle, ')');
        console.log('  Surface:', surfaceHandle, '(type:', typeof surfaceHandle, ')');

        // Verify we have valid handles
        if (!adapterHandle || !deviceHandle || !instanceHandle || !surfaceHandle) {
          console.error('Failed to get valid WebGPU handles');

          return;
        }

        // Convert to BigInt pointers
        const devicePtr = BigInt(deviceHandle);
        const instancePtr = BigInt(instanceHandle);
        const surfacePtr = BigInt(surfaceHandle);
        const targetType = 0;

        console.log(
          `Calling setWgTarget - device=${devicePtr}, instance=${instancePtr}, surface=${surfacePtr}, type=${targetType}`,
        );

        const result = this._dotLottieCore.setWgTarget(
          devicePtr,
          instancePtr,
          surfacePtr,
          width,
          height,
          colorSpace,
          targetType,
        );

        console.log(`setWgTarget result: ${result}`);

        if (result) {
          console.log('✓ Successfully set WebGPU target');
        } else {
          console.error('setWgTarget failed');
        }
      } catch (error) {
        console.error('Error setting up WebGPU target:', error);
      }
    }
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

  private async _loadFromData(data: Data): Promise<void> {
    if (this._dotLottieCore === null || this._wasmModule === null) return;

    // Ensure canvas has proper dimensions before loading
    if (IS_BROWSER && isHTMLCanvasElement(this._canvas)) {
      const dpr = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1;
      const { height: clientHeight, width: clientWidth } = this._canvas.getBoundingClientRect();

      console.log('Canvas client dimensions:', clientWidth, 'x', clientHeight);

      if (clientHeight !== 0 && clientWidth !== 0) {
        this._canvas.width = clientWidth * dpr;
        this._canvas.height = clientHeight * dpr;
      }
    }

    const width = this._canvas.width;
    const height = this._canvas.height;

    console.log(`_loadFromData called - renderer: ${this._renderer}, canvas: ${width}x${height}`);

    // Set up render target BEFORE loading animation data
    // This allocates buffers for software renderer or sets up WebGL/WebGPU contexts
    console.log('Setting up render target before loading animation data');
    try {
      await this._setupRenderTarget(this._wasmModule, this._selector);
      console.log('✓ Render target setup completed');
    } catch (error) {
      console.error('Failed to setup render target:', error);
      this._dispatchError(`Failed to setup ${this._renderer} render target: ${error}`);

      return;
    }

    let loaded = false;

    if (typeof data === 'string') {
      console.log('Data type: string, length:', data.length);
      if (!isLottie(data)) {
        this._dispatchError(
          'Invalid Lottie JSON string: The provided string does not conform to the Lottie JSON format.',
        );

        return;
      }
      console.log('Calling loadAnimationData with string data, width:', width, 'height:', height);
      loaded = this._dotLottieCore.loadAnimationData(data, width, height);
      console.log('loadAnimationData returned:', loaded);
    } else if (data instanceof ArrayBuffer) {
      console.log('Data type: ArrayBuffer, byteLength:', data.byteLength);
      if (!isDotLottie(data)) {
        this._dispatchError(
          'Invalid dotLottie ArrayBuffer: The provided ArrayBuffer does not conform to the dotLottie format.',
        );

        return;
      }
      console.log('dotLottie file detected, converting to VectorChar');
      // Convert ArrayBuffer to VectorChar
      const vectorChar = new this._wasmModule.VectorChar();
      const uint8Array = new Uint8Array(data);

      for (let i = 0; i < uint8Array.length; i++) {
        vectorChar.push_back(uint8Array[i] as number);
      }

      // Try with dimensions first
      console.log(
        'Calling loadDotLottieData with VectorChar, size:',
        vectorChar.size(),
        'width:',
        width,
        'height:',
        height,
      );
      loaded = this._dotLottieCore.loadDotLottieData(vectorChar, width, height);
      console.log('loadDotLottieData returned:', loaded);

      // If that fails, try with 0,0 dimensions (let animation define its own size)
      if (!loaded) {
        console.log('Trying loadDotLottieData with 0x0 dimensions');
        loaded = this._dotLottieCore.loadDotLottieData(vectorChar, 0, 0);
        console.log('loadDotLottieData with 0x0 returned:', loaded);
      }
    } else if (typeof data === 'object') {
      console.log('Data type: object');
      if (!isLottie(data as Record<string, unknown>)) {
        this._dispatchError(
          'Invalid Lottie JSON object: The provided object does not conform to the Lottie JSON format.',
        );

        return;
      }
      const jsonStr = JSON.stringify(data);

      console.log('Calling loadAnimationData with JSON object (stringified), length:', jsonStr.length);
      loaded = this._dotLottieCore.loadAnimationData(jsonStr, width, height);
      console.log('loadAnimationData returned:', loaded);
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

    console.log(`loadAnimationData final result: ${loaded}`);

    if (loaded) {
      this._eventManager.dispatch({ type: 'load' });

      if (IS_BROWSER) {
        this.resize();
      }

      this._eventManager.dispatch({
        type: 'frame',
        currentFrame: this.currentFrame,
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
      .then(async (data) => this._loadFromData(data))
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

  public load(config: Omit<Config, 'canvas'>): void {
    if (this._dotLottieCore === null || this._wasmModule === null) return;

    if (this._animationFrameId !== null) {
      this._frameManager.cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    this._dotLottieCore.setConfig({
      ...this._wasmModule.createDefaultConfig(),
      themeId: config.themeId ?? '',
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
    if (this._dotLottieCore === null) return false;

    const rendered = this._dotLottieCore.render();

    console.log(`Render called (${this._renderer}): ${rendered}`);

    if (this._renderer === 'wg' || this._renderer === 'gl') {
      if (rendered) {
        this._eventManager.dispatch({
          type: 'render',
          currentFrame: this.currentFrame,
        });
      }

      return rendered;
    }
    if (!this._context) {
      this._context = this._canvas.getContext('2d') as
        | CanvasRenderingContext2D
        | OffscreenCanvasRenderingContext2D
        | null;
    }

    if (rendered && this._context && this._swBuffer) {
      const clampedBuffer = new Uint8ClampedArray(
        this._swBuffer.buffer,
        this._swBuffer.byteOffset,
        this._swBuffer.byteLength,
      );

      let imageData: ImageData | null = null;

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
        currentFrame: this.currentFrame,
      });

      return true;
    }

    return false;
  }

  private _draw(): void {
    if (this._dotLottieCore === null || !this._dotLottieCore.isPlaying()) return;

    const nextFrame = Math.round(this._dotLottieCore.requestFrame() * 100) / 100;

    const updated = this._dotLottieCore.setFrame(nextFrame);

    if (updated) {
      this._eventManager.dispatch({
        type: 'frame',
        currentFrame: this.currentFrame,
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

    if (ok || this._dotLottieCore.isPlaying()) {
      this._isFrozen = false;
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

    const ok = this._dotLottieCore.pause();

    if (ok || this._dotLottieCore.isPaused()) {
      this._eventManager.dispatch({ type: 'pause' });
    }
  }

  public stop(): void {
    if (this._dotLottieCore === null) return;

    const ok = this._dotLottieCore.stop();

    if (ok) {
      this._eventManager.dispatch({ type: 'frame', currentFrame: this.currentFrame });

      this._render();

      this._eventManager.dispatch({ type: 'stop' });
    }
  }

  public setFrame(frame: number): void {
    if (this._dotLottieCore === null) return;

    if (frame < 0 || frame > this._dotLottieCore.totalFrames()) return;

    const ok = this._dotLottieCore.seek(frame);

    if (ok) {
      this._eventManager.dispatch({ type: 'frame', currentFrame: this.currentFrame });

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

    if (IS_BROWSER && isHTMLCanvasElement(this._canvas)) {
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

    // Free software renderer buffer if allocated
    if (this._swBufferPtr !== null && this._wasmModule) {
      const free = (this._wasmModule as unknown)._free as ((ptr: number) => void) | undefined;

      if (free) {
        free(this._swBufferPtr);
      }
      this._swBufferPtr = null;
      this._swBuffer = null;
    }

    // Cleanup WebGPU resources if using WebGPU renderer
    if (this._renderer === 'wg' && this._wasmModule) {
      console.log('Cleaning up WebGPU resources');
      const cleanup = (this._wasmModule as unknown).webgpu_cleanup as (() => void) | undefined;

      if (cleanup) {
        cleanup();
      }
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
    if (!this._dotLottieCore || !this.isLoaded || !this._wasmModule) return;

    if (IS_BROWSER && isHTMLCanvasElement(this._canvas)) {
      const dpr = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1;

      const { height: clientHeight, width: clientWidth } = this._canvas.getBoundingClientRect();

      if (clientHeight !== 0 && clientWidth !== 0) {
        this._canvas.width = clientWidth * dpr;
        this._canvas.height = clientHeight * dpr;
      }
    }

    // Update render target before resize to reallocate buffers/contexts with new dimensions
    // this._setupRenderTarget(this._wasmModule, this._selector);

    const ok = this._dotLottieCore.resize(this._canvas.width, this._canvas.height);

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

  /**
   * Static method to set WASM URL - this should be implemented by subclasses
   * @param _url - The URL to set
   */
  public static setWasmUrl(_url: string): void {
    // This method should be implemented by subclasses that have access to their specific WasmLoader
    console.warn('setWasmUrl must be implemented by a subclass with access to its specific WasmLoader');
  }

  public loadStateMachine(stateMachineId: string): boolean {
    return this._dotLottieCore?.stateMachineLoad(stateMachineId) ?? false;
  }

  public startStateMachine(): boolean {
    // const started = this._dotLottieCore?.stateMachineStart() ?? false;

    // if (started) {
    //   this._setupStateMachineListeners();
    // }

    // return started;
    return false;
  }

  public stopStateMachine(): boolean {
    const stopped = this._dotLottieCore?.stateMachineStop() ?? false;

    if (stopped) {
      this._cleanupStateMachineListeners();
    }

    return stopped;
  }

  private _getPointerPosition(event: PointerEvent): { x: number; y: number } {
    if (!isHTMLCanvasElement(this._canvas)) {
      return { x: 0, y: 0 };
    }

    const rect = this._canvas.getBoundingClientRect();
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

    this.postPointerUpEvent(x, y);
  }

  private _onPointerDown(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.postPointerDownEvent(x, y);
  }

  private _onPointerMove(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.postPointerMoveEvent(x, y);
  }

  private _onPointerEnter(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.postPointerEnterEvent(x, y);
  }

  private _onPointerLeave(event: PointerEvent): void {
    const { x, y } = this._getPointerPosition(event);

    this.postPointerExitEvent(x, y);
  }

  public postPointerUpEvent(x: number, y: number): void | undefined {
    return this._dotLottieCore?.stateMachinePostPointerUpEvent(x, y);
  }

  public postPointerDownEvent(x: number, y: number): void | undefined {
    return this._dotLottieCore?.stateMachinePostPointerDownEvent(x, y);
  }

  public postPointerMoveEvent(x: number, y: number): void | undefined {
    return this._dotLottieCore?.stateMachinePostPointerMoveEvent(x, y);
  }

  public postPointerEnterEvent(x: number, y: number): void | undefined {
    return this._dotLottieCore?.stateMachinePostPointerEnterEvent(x, y);
  }

  public postPointerExitEvent(x: number, y: number): void | undefined {
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

  private _setupStateMachineListeners(): void {
    if (IS_BROWSER && isHTMLCanvasElement(this._canvas) && this._dotLottieCore !== null && this.isLoaded) {
      const listeners = this.getStateMachineListeners();

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
    }
  }

  private _cleanupStateMachineListeners(): void {
    if (IS_BROWSER && isHTMLCanvasElement(this._canvas)) {
      this._canvas.removeEventListener('pointerup', this._pointerUpMethod);
      this._canvas.removeEventListener('pointerdown', this._pointerDownMethod);
      this._canvas.removeEventListener('pointermove', this._pointerMoveMethod);
      this._canvas.removeEventListener('pointerenter', this._pointerEnterMethod);
      this._canvas.removeEventListener('pointerleave', this._pointerExitMethod);
    }
  }

  public loadStateMachineData(stateMachineData: string): boolean {
    return this._dotLottieCore?.stateMachineLoadData(stateMachineData) ?? false;
  }

  public animationSize(): { height: number; width: number } {
    const width = this._dotLottieCore?.animationSize().get(0) ?? 0;
    const height = this._dotLottieCore?.animationSize().get(1) ?? 0;

    return {
      width,
      height,
    };
  }

  public setStateMachineBooleanContext(name: string, value: boolean): boolean {
    return this._dotLottieCore?.stateMachineSetBooleanInput(name, value) ?? false;
  }

  public setStateMachineNumericContext(name: string, value: number): boolean {
    return this._dotLottieCore?.stateMachineSetNumericInput(name, value) ?? false;
  }

  public setStateMachineStringContext(name: string, value: string): boolean {
    return this._dotLottieCore?.stateMachineSetStringInput(name, value) ?? false;
  }

  /**
   * Get the bounds of a layer by its name
   * @param layerName - The name of the layer
   * @returns The bounds of the layer
   *
   * @example
   * ```typescript
   * // Draw a rectangle around the layer 'Layer 1'
   * dotLottie.addEventListener('render', () => {
   *   const boundingBox = dotLottie.getLayerBoundingBox('Layer 1');
   *
   *   if (boundingBox) {
   *     const { x, y, width, height } = boundingBox;
   *     context.strokeRect(x, y, width, height);
   *   }
   * });
   * ```
   */
  public getLayerBoundingBox(layerName: string):
    | {
        height: number;
        width: number;
        x: number;
        y: number;
      }
    | undefined {
    const bounds = this._dotLottieCore?.getLayerBounds(layerName);

    if (!bounds) return undefined;

    if (bounds.size() !== 4) return undefined;

    const x = bounds.get(0) as number;
    const y = bounds.get(1) as number;
    const width = bounds.get(2) as number;
    const height = bounds.get(3) as number;

    return {
      x,
      y,
      width,
      height,
    };
  }

  /**
   * Transform theme to lottie slots
   * @param theme - The theme data
   * @param slots - The slots data
   * @returns The transformed data
   */
  public transformThemeToLottieSlots(theme: string, slots: string): string {
    return this._wasmModule?.transformThemeToLottieSlots(theme, slots) ?? '';
  }
}
