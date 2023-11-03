/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/prefer-readonly */

import type { EventListener, EventType } from './event-manager';
import { EventManager } from './event-manager';
import type { Renderer } from './renderer-wasm';
import { createRenderer } from './renderer-wasm';
import { loadFromURL } from './utils';

const MS_TO_SEC_FACTOR = 1000;

interface Config {
  autoplay?: boolean;
  canvas: HTMLCanvasElement;
  loop?: boolean;
  speed?: number;
  src?: string;
}

export class DotLottie {
  private readonly _canvas: HTMLCanvasElement;

  private _context: CanvasRenderingContext2D | null;

  private readonly _eventManager = new EventManager();

  private _renderer: Renderer | null = null;

  private _playing = false;

  private _beginTime = 0;

  private _totalFrames = 0;

  private _loop = false;

  private _speed = 1;

  private _currentFrame = 0;

  private _duration = 0;

  private _loopCount = 0;

  private _autoplay = false;

  public constructor(config: Config) {
    this._animationLoop = this._animationLoop.bind(this);

    this._canvas = config.canvas;
    this._context = this._canvas.getContext('2d');
    this._loop = config.loop ?? false;
    this._speed = config.speed ?? 1;
    this._autoplay = config.autoplay ?? false;

    this._initRenderer();

    if (config.src) {
      this._load(config.src);
    }
  }

  // #region Getters and Setters
  /**
   * Gets the current frame number.
   *
   * @returns The current frame number.
   */
  public get currentFrame(): number {
    return this._currentFrame;
  }

  /**
   * Gets the duration of the animation in seconds.
   *
   * @returns The duration of the animation in seconds.
   */
  public get duration(): number {
    return this._duration;
  }

  /**
   * Gets the number of frames in the animation.
   *
   * @returns The number of frames in the animation.
   */
  public get totalFrames(): number {
    return this._totalFrames;
  }

  /**
   * Gets the loop status of the animation.
   *
   * @returns The loop status of the animation.
   */
  public get loop(): boolean {
    return this._loop;
  }

  /**
   * Gets the speed of the animation.
   *
   * @returns The speed of the animation.
   */
  public get speed(): number {
    return this._speed;
  }

  /**
   * Gets the loop count of the animation.
   *
   * @returns The loop count of the animation.
   */
  public get loopCount(): number {
    return this._loopCount;
  }

  /**
   * Gets the playing status of the animation.
   *
   * @returns The playing status of the animation.
   */
  public get playing(): boolean {
    return this._playing;
  }
  // #endregion

  // #region Private Methods
  /**
   * Initializes the renderer.
   *
   * @returns A promise that resolves when the renderer is initialized.
   */
  private async _initRenderer(): Promise<void> {
    if (this._renderer) return;
    this._renderer = await createRenderer();
  }

  /**
   * Loads and initializes the animation from a given URL.
   *
   * @public
   * @param src - The source URL of the animation.
   */
  private _load(src: string): void {
    loadFromURL(src)
      .then((data) => {
        if (this._renderer?.load(data, this._canvas.width, this._canvas.height)) {
          this._totalFrames = this._renderer.totalFrames();
          this._duration = this._renderer.duration();

          this._eventManager.dispatch({
            type: 'load',
          });

          if (this._autoplay) {
            this.play();
          }
        } else {
          throw new Error(
            this._renderer?.error() ?? 'Error encountered while loading animation data into the renderer.',
          );
        }
      })
      .catch((error) => {
        this._eventManager.dispatch({
          type: 'loadError',
          error: error as Error,
        });
      });
  }

  /**
   * Renders the animation frame on the canvas.
   */
  private _render(): void {
    if (!this._context) return;

    this._renderer?.resize(this._canvas.width, this._canvas.height);

    if (this._renderer?.update()) {
      const buffer = this._renderer.render();
      const clampedBuffer = Uint8ClampedArray.from(buffer);

      if (clampedBuffer.length === 0) return;

      const imageData = new ImageData(clampedBuffer, this._canvas.width, this._canvas.height);

      this._context.putImageData(imageData, 0, 0);
    }
  }

  /**
   * Updates the current frame and animation state.
   * @returns Boolean indicating if update was successful.
   */
  private _update(): boolean {
    if (!this._playing) return false;

    this._duration = this._renderer?.duration() ?? 0;
    this._currentFrame =
      (((performance.now() / MS_TO_SEC_FACTOR - this._beginTime) * this._speed) / this._duration) * this._totalFrames;

    if (this._currentFrame >= this._totalFrames) {
      if (this._loop) {
        this._currentFrame = 0;
        this._beginTime = performance.now() / MS_TO_SEC_FACTOR;
        this._loopCount += 1;

        this._eventManager.dispatch({
          type: 'loop',
          loopCount: this._loopCount,
        });

        return true;
      } else {
        this._playing = false;

        this._eventManager.dispatch({
          type: 'complete',
        });

        return false;
      }
    }

    this._currentFrame = Math.max(0, Math.min(this._currentFrame, this._totalFrames - 1));

    if (this._renderer?.frame(this._currentFrame)) {
      this._eventManager.dispatch({
        type: 'frame',
        currentFrame: this._currentFrame,
      });

      return true;
    }

    return false;
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
  // #endregion

  // #region Public Methods

  /**
   * Starts the animation playback.
   */
  public play(): void {
    this._totalFrames = this._renderer?.totalFrames() ?? 0;

    if (this._totalFrames === 0) {
      this._eventManager.dispatch({
        type: 'loadError',
        error: new Error('Unable to play animation.'),
      });

      return;
    }

    const progress = this._currentFrame / this._totalFrames;

    this._beginTime = performance.now() / 1000 - progress * this._duration;
    if (!this._playing) {
      this._playing = true;
      this._animationLoop();

      this._eventManager.dispatch({
        type: 'play',
      });
    }
  }

  /**
   * Stops the animation playback and resets the current frame.
   */
  public stop(): void {
    if (!this._playing && this._currentFrame === 0) return;

    this._playing = false;
    this.setFrame(0);
    this._eventManager.dispatch({
      type: 'stop',
    });
  }

  /**
   * Pauses the animation playback.
   */
  public pause(): void {
    if (!this._playing) return;

    this._playing = false;

    this._eventManager.dispatch({
      type: 'pause',
    });
  }

  /**
   * Sets the speed for animation playback.
   * @param speed - Speed multiplier for playback.
   */
  public setSpeed(speed: number): void {
    this._speed = speed;
  }

  /**
   *  Sets the loop state for animation playback.
   * @param loop - Boolean indicating if the animation should loop.
   */
  public setLoop(loop: boolean): void {
    this._loop = loop;
  }

  /**
   * Sets the current frame of the animation.
   * @param frame - Frame number to set.
   */
  public setFrame(frame: number): void {
    if (frame < 0 || frame >= this._totalFrames) {
      // eslint-disable-next-line no-console
      console.error(`Invalid frame number provided: ${frame}. Valid range is between 0 and ${this._totalFrames - 1}.`);

      return;
    }

    this._currentFrame = frame;
    this._renderer?.frame(this._currentFrame);
    this._render();

    this._eventManager.dispatch({
      type: 'frame',
      currentFrame: this._currentFrame,
    });
  }

  /**
   * Registers an event listener for a specific event type.
   *
   * @param type - The type of the event to listen for.
   * @param listener - The callback function to be called when the event is dispatched.
   */
  public addEventListener<T extends EventType>(type: T, listener: EventListener<T>): void {
    this._eventManager.addEventListener(type, listener);
  }

  /**
   * Removes an event listener for a specific event type.
   *
   * @param type - The type of the event to listen for.
   * @param listener - The callback function to be called when the event is dispatched.
   */
  public removeEventListener<T extends EventType>(type: T, listener?: EventListener<T>): void {
    this._eventManager.removeEventListener(type, listener);
  }

  // #endregion
}
