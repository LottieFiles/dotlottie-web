/**
 * Copyright 2024 Design Barn Inc.
 */

import { AnimationFrameManager } from './animation-frame-manager';
import { IS_BROWSER } from './constants';
import type { DotLottiePlayer } from './core';
import { DotLottieWasmLoader } from './core';
import type { EventListener, EventType } from './event-manager';
import { EventManager } from './event-manager';
import { hexStringToRGBAInt } from './utils';

interface RenderConfig {
  devicePixelRatio?: number;
}

type Mode = 'forward' | 'reverse' | 'bounce' | 'reverse-bounce';

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

export class DotLottie {
  private readonly _canvas: HTMLCanvasElement;

  private _context: CanvasRenderingContext2D | null;

  private readonly _eventManager: EventManager;

  private _animationFrameId: number | null = null;

  private readonly _frameManager: AnimationFrameManager;

  private _dotLottieCore: DotLottiePlayer | null = null;

  public constructor(config: Config) {
    this._canvas = config.canvas;
    this._context = this._canvas.getContext('2d');
    this._eventManager = new EventManager();
    this._frameManager = new AnimationFrameManager();

    DotLottieWasmLoader.load()
      .then((module) => {
        this._dotLottieCore = new module.DotLottiePlayer({
          autoplay: config.autoplay ?? true,
          backgroundColor: 0,
          loopAnimation: config.loop ?? true,
          mode: module.Mode.Forward,
          segments: new module.VectorFloat(),
          speed: config.speed ?? 1,
          useFrameInterpolation: config.useFrameInterpolation ?? false,
        });

        const width = this._canvas.width;
        const height = this._canvas.height;

        if (config.data) {
          const ok = this._dotLottieCore.loadAnimationData(config.data, width, height);

          if (ok) {
            this._eventManager.dispatch({ type: 'load' });

            if (config.autoplay) {
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
      })
      .catch((error) => {
        this._eventManager.dispatch({
          type: 'loadError',
          error: new Error(`Failed to load wasm module: ${error}`),
        });
      });
  }

  public get autoplay(): boolean {
    return this._dotLottieCore?.config().autoplay ?? false;
  }

  public get backgroundColor(): number {
    return this._dotLottieCore?.config().backgroundColor ?? 0;
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

  private _draw(): void {
    if (this._dotLottieCore === null || this._context === null || !this._dotLottieCore.isPlaying()) return;

    const nextFrame = this._dotLottieCore.requestFrame();

    const updated = this._dotLottieCore.setFrame(nextFrame);

    if (updated) {
      // trigger frame event here
      this._eventManager.dispatch({
        type: 'frame',
        currentFrame: nextFrame,
      });

      const rendered = this._dotLottieCore.render();

      if (rendered) {
        // update the canvas
        const buffer = this._dotLottieCore.buffer() as Uint8ClampedArray;
        const imageData = this._context.createImageData(this._canvas.width, this._canvas.height);

        imageData.data.set(buffer);
        this._context.putImageData(imageData, 0, 0);

        // trigger render event here
        this._eventManager.dispatch({
          type: 'render',
          currentFrame: nextFrame,
        });
      }
    }

    this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this));
  }

  public play(): void {
    if (this._dotLottieCore === null) return;

    const ok = this._dotLottieCore.play();

    if (ok) {
      // trigger play event here
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

    let ok = this._dotLottieCore.stop();

    if (ok) {
      this._eventManager.dispatch({ type: 'frame', currentFrame: this.currentFrame });

      ok = this._dotLottieCore.render();

      if (ok) {
        const buffer = this._dotLottieCore.buffer() as Uint8ClampedArray;

        if (this._context === null) return;

        const imageData = this._context.createImageData(this._canvas.width, this._canvas.height);

        imageData.data.set(buffer);

        this._context.putImageData(imageData, 0, 0);

        this._eventManager.dispatch({ type: 'render', currentFrame: this.currentFrame });
      }

      this._eventManager.dispatch({ type: 'stop' });
    }
  }

  public setFrame(frame: number): void {
    if (this._dotLottieCore === null) return;

    let ok = this._dotLottieCore.setFrame(frame);

    if (ok) {
      // trigger frame event here
      this._eventManager.dispatch({ type: 'frame', currentFrame: frame });

      ok = this._dotLottieCore.render();

      if (ok) {
        const buffer = this._dotLottieCore.buffer() as Uint8ClampedArray;

        if (this._context === null) return;

        const imageData = this._context.createImageData(this._canvas.width, this._canvas.height);

        imageData.data.set(buffer);

        this._context.putImageData(imageData, 0, 0);

        // trigger render event here
        this._eventManager.dispatch({ type: 'render', currentFrame: frame });
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

    this._dotLottieCore.setConfig({
      ...this._dotLottieCore.config(),
      backgroundColor: hexStringToRGBAInt(color),
    });
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
  }

  public unfreeze(): void {
    this._animationFrameId = this._frameManager.requestAnimationFrame(this._draw.bind(this));
  }

  public resize(): void {
    if (!IS_BROWSER) return;

    let ok = this._dotLottieCore?.resize(this._canvas.width, this._canvas.height);

    if (ok) {
      ok = this._dotLottieCore?.render();

      if (ok) {
        const buffer = this._dotLottieCore?.buffer() as Uint8ClampedArray;

        if (this._context === null) return;

        const imageData = this._context.createImageData(this._canvas.width, this._canvas.height);

        imageData.data.set(buffer);

        this._context.putImageData(imageData, 0, 0);
      }
    }
  }

  public static setWasmUrl(url: string): void {
    DotLottieWasmLoader.setWasmUrl(url);
  }
}
