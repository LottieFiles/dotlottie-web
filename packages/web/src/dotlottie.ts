/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable @typescript-eslint/unbound-method */

import type { Renderer } from './renderer-wasm';
import { createRenderer } from './renderer-wasm';

interface Config {
  autoplay?: boolean;
  canvas: HTMLCanvasElement;
  loop?: boolean;
  speed?: number;
  src?: string;
}

export class DotLottie {
  private readonly _canvas: HTMLCanvasElement;

  private _renderer: Renderer | null = null;

  private _playing = false;

  private _beginTime = 0;

  private _totalFrame = 0;

  private _loop = false;

  private _speed = 1;

  private _imageData: ImageData | null = null;

  private _currentFrame = 0;

  private _duration = 0;

  /**
   * Creates an instance of DotLottie.
   * @param config - Configuration object for DotLottie.
   */
  public constructor(config: Config) {
    this._animationLoop = this._animationLoop.bind(this);
    this._initRenderer();
    this._canvas = config.canvas;
    this._loop = config.loop ?? false;
    this._speed = config.speed ?? 1;

    if (config.src) {
      this._loadFromURL(config.src)
        .then(() => {
          if (config.autoplay) {
            this.play();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  public get currentFrame(): number {
    return this._currentFrame;
  }

  public get duration(): number {
    return this._duration;
  }

  public get totalFrame(): number {
    return this._totalFrame;
  }

  public get loop(): boolean {
    return this._loop;
  }

  /**
   * Initializes the renderer.
   */
  private async _initRenderer(): Promise<void> {
    if (this._renderer) return;

    this._renderer = await createRenderer();
  }

  /**
   * Load animation data from a URL.
   * @param src - Source URL of the animation data.
   */
  private async _loadFromURL(src: string): Promise<void> {
    const response = await fetch(src);

    if (response.ok) {
      const data = await response.text();

      if (!this._renderer?.load(data, this._canvas.width, this._canvas.height)) {
        console.error(`Unable to load an image. Error: ${this._renderer?.error()}`);
      }
    } else {
      console.error(`Failed to fetch ${src}`);
    }
  }

  /**
   * Renders the animation frame on the canvas.
   */
  private _render(): void {
    this._renderer?.resize(this._canvas.width, this._canvas.height);

    if (this._renderer?.update()) {
      const buffer = this._renderer.render();
      const clampedBuffer = Uint8ClampedArray.from(buffer);

      if (clampedBuffer.length === 0) return;
      this._imageData = new ImageData(clampedBuffer, this._canvas.width, this._canvas.height);
      const context = this._canvas.getContext('2d');

      context?.putImageData(this._imageData, 0, 0);
    }
  }

  /**
   * Updates the current frame and animation state.
   * @returns Boolean indicating if update was successful.
   */
  private _update(): boolean {
    if (!this._playing) return false;

    this._duration = this._renderer?.duration() ?? 0;
    this._currentFrame = (((Date.now() / 1000 - this._beginTime) * this._speed) / this._duration) * this._totalFrame;

    if (this._currentFrame >= this._totalFrame) {
      if (this._loop) {
        this._currentFrame = 0;
        this._beginTime = Date.now() / 1000;

        return true;
      } else {
        this._playing = false;

        return false;
      }
    }

    this._currentFrame = Math.max(0, Math.min(this._currentFrame, this._totalFrame - 1));

    return this._renderer?.frame(this._currentFrame) ?? false;
  }

  /**
   * Loop that handles the animation playback.
   */
  private _animationLoop(): void {
    if (this._update()) {
      this._render();
      window.requestAnimationFrame(this._animationLoop);
    }
  }

  /**
   * Starts the animation playback.
   */
  public play(): void {
    this._totalFrame = this._renderer?.totalFrame() ?? 0;

    if (this._totalFrame === 0) {
      console.error('Unable to play animation. No frames found.');

      return;
    }

    const progress = this._currentFrame / this._totalFrame;

    this._beginTime = Date.now() / 1000 - progress * this._duration;
    if (!this._playing) {
      this._playing = true;
      this._animationLoop();
    }
  }

  /**
   * Stops the animation playback and resets the current frame.
   */
  public stop(): void {
    if (!this._playing && this._currentFrame === 0) return;

    this._playing = false;
    this._currentFrame = 0;
    this._renderer?.frame(0);
    this._render();
  }

  /**
   * Pauses the animation playback.
   */
  public pause(): void {
    if (!this._playing) return;

    this._playing = false;
  }

  /**
   * Sets the speed for animation playback.
   * @param speed - Speed multiplier for playback.
   */
  public speed(speed: number): void {
    this._speed = speed;
  }
}
