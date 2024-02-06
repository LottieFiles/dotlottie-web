/**
 * Copyright 2024 Design Barn Inc.
 */

import { AnimationFrameManager } from './animation-frame-manager';
import { IS_BROWSER } from './constants';
import type { DotLottiePlayer, MainModule, Mode as CoreMode, VectorFloat } from './core';
import { DotLottieWasmLoader } from './core';
import type { EventListener, EventType } from './event-manager';
import { EventManager } from './event-manager';

interface RenderConfig {
  devicePixelRatio?: number;
}

export type Mode = 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';

export interface Manifest {
  animations: Array<{
    id: string;
    speed: number;
  }>;
  author: string;
  generator: string;
  revision: number;
  version: number;
}

export interface Config {
  autoplay?: boolean;
  backgroundColor?: string;
  canvas: HTMLCanvasElement;
  data?: string | ArrayBuffer;
  loop?: boolean;
  mode?: Mode;
  renderConfig?: RenderConfig;
  segments?: [number, number];
  speed?: number;
  src?: string;
  useFrameInterpolation?: boolean;
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

const createCoreSegments = (segments: number[], module: MainModule): VectorFloat => {
  const coreSegments = new module.VectorFloat();

  if (segments.length !== 2) return coreSegments;

  coreSegments.push_back(segments[0] as number);
  coreSegments.push_back(segments[1] as number);

  return coreSegments;
};

export class DotLottie {
  private readonly _canvas: HTMLCanvasElement;

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
          segments: createCoreSegments(config.segments ?? [], module),
          speed: config.speed ?? 1,
          useFrameInterpolation: config.useFrameInterpolation ?? true,
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

      const contentType = response.headers.get('content-type');

      let data: string | ArrayBuffer;

      if (contentType?.includes('application/json')) {
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

  private _loadFromData(data: string | ArrayBuffer): void {
    if (this._dotLottieCore === null) return;

    try {
      const width = this._canvas.width;
      const height = this._canvas.height;

      let loaded = false;

      // clear the buffer
      this._dotLottieCore.clear();

      if (typeof data === 'string') {
        loaded = this._dotLottieCore.loadAnimationData(data, width, height);
      } else if (data instanceof ArrayBuffer) {
        loaded = this._dotLottieCore.loadDotLottieData(data, width, height);
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
    } catch (error) {
      this._eventManager.dispatch({
        type: 'loadError',
        error: error as Error,
      });
    }
  }

  public get manifest(): Manifest | null {
    if (this._dotLottieCore === null || !this._dotLottieCore.manifestString()) return null;

    return JSON.parse(this._dotLottieCore.manifestString()) as Manifest;
  }

  public get renderConfig(): RenderConfig {
    return this._renderConfig;
  }

  public get segments(): [number, number] | undefined {
    const segments = this._dotLottieCore?.config().segments;

    if (segments && segments.size() === 2) {
      return [segments.get(0) as number, segments.get(1) as number];
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

  public load(config: Omit<Config, 'canvas'>): void {
    if (this._dotLottieCore === null || this._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      autoplay: config.autoplay ?? false,
      backgroundColor: 0,
      loopAnimation: config.loop ?? false,
      mode: createCoreMode(config.mode ?? 'forward', this._wasmModule),
      segments: createCoreSegments(config.segments ?? [], this._wasmModule),
      speed: config.speed ?? 1,
      useFrameInterpolation: config.useFrameInterpolation ?? true,
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
      const buffer = this._dotLottieCore.buffer() as Uint8ClampedArray;

      const imageData = this._context.createImageData(this._canvas.width, this._canvas.height);

      imageData.data.set(buffer);

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
    if (!IS_BROWSER) return;

    const dpr = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1;

    const { height: clientHeight, width: clientWidth } = this._canvas.getBoundingClientRect();

    this._canvas.width = clientWidth * dpr;
    this._canvas.height = clientHeight * dpr;

    const ok = this._dotLottieCore?.resize(this._canvas.width, this._canvas.height);

    if (ok) {
      this._render();
    }
  }

  public setSegments(startFrame: number, endFrame: number): void {
    if (this._dotLottieCore === null || this._wasmModule === null) return;

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      segments: createCoreSegments([startFrame, endFrame], this._wasmModule),
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

  public static setWasmUrl(url: string): void {
    DotLottieWasmLoader.setWasmUrl(url);
  }
}
