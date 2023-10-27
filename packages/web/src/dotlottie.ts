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

  private async _initRenderer(): Promise<void> {
    if (this._renderer) return;

    this._renderer = await createRenderer();
  }

  private async _loadFromURL(src: string): Promise<void> {
    const response = await fetch(src);

    if (response.ok) {
      const buffer = await response.arrayBuffer();

      this.loadData(buffer);
    } else {
      console.error(`Failed to fetch ${src}`);
    }
  }

  public flush(): void {
    const context = this._canvas.getContext('2d');

    if (context && this._imageData) {
      context.putImageData(this._imageData, 0, 0);
    }
  }

  public render(): void {
    this._renderer?.resize(this._canvas.width, this._canvas.height);

    if (this._renderer?.update()) {
      const buffer = this._renderer.render();
      const clampedBuffer = Uint8ClampedArray.from(buffer);

      if (clampedBuffer.length === 0) return;
      this._imageData = new ImageData(clampedBuffer, this._canvas.width, this._canvas.height);
      this.flush();
    }
  }

  public setSpeed(speed: number): void {
    this._speed = speed;
  }

  public update(): boolean {
    if (!this._playing) return false;

    this._duration = this._renderer?.duration() ?? 0;
    this._currentFrame = Math.round(
      (((Date.now() / 1000 - this._beginTime) * this._speed) / this._duration) * this._totalFrame,
    );

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

  public stop(): void {
    this._playing = false;
    this._currentFrame = 0;
    this._renderer?.frame(0);
  }

  public frame(frameNo: number): void {
    this.pause();
    this._currentFrame = frameNo;
    this._renderer?.frame(this._currentFrame);
  }

  public pause(): void {
    this._playing = false;
  }

  private _animationLoop(): void {
    if (this.update() && this._playing) {
      this.render();
      window.requestAnimationFrame(this._animationLoop);
    }
  }

  private get progressFraction(): number {
    return this._currentFrame / this._totalFrame;
  }

  public play(): void {
    this._totalFrame = this._renderer?.totalFrame() ?? 0;

    if (this._totalFrame === 0) return;

    this._beginTime = Date.now() / 1000 - this.progressFraction * this._duration;

    if (!this._playing) {
      this._playing = true;
      window.requestAnimationFrame(this._animationLoop);
    }
  }

  public loadData(data: ArrayBuffer): void {
    if (!this._renderer?.load(new Int8Array(data), this._canvas.width, this._canvas.height)) {
      console.error(`Unable to load an image. Error: ${this._renderer?.error()}`);
    }
  }
}
