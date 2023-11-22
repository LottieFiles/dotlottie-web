/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable @typescript-eslint/unbound-method */

import type { EventListener, EventType } from './event-manager';
import { EventManager } from './event-manager';
import type { Renderer } from './renderer-wasm';
import { WasmLoader } from './renderer-wasm';
import { getAnimationJSONFromDotLottie, loadAnimationJSONFromURL, debounce } from './utils';

const MS_TO_SEC_FACTOR = 1000;

export type Mode = 'normal' | 'reverse' | 'bounce' | 'bounce-reverse';

export interface Config {
  /**
   * Boolean indicating if the animation should start playing automatically.
   */
  autoplay?: boolean;
  /**
   * The canvas element to render the animation on.
   */
  canvas: HTMLCanvasElement;
  /**
   * The animation data.
   * string: The JSON string of the animation data.
   * ArrayBuffer: The ArrayBuffer of the .lottie file.
   */
  data?: string | ArrayBuffer;
  /**
   * Boolean indicating if the animation should loop.
   */
  loop?: boolean;
  /**
   *  The playback mode of the animation.
   *
   * normal: The animation will play from start to end.
   * reverse: The animation will play from end to start.
   * bounce: The animation will play from start to end and then from end to start.
   * bounce-reverse: The animation will play from end to start and then from start to end.
   *
   */
  mode?: Mode;
  /**
   *  The frame boundaries of the animation.
   *
   * The animation will only play between the given start and end frames.
   *
   * e.g. [0, 10] will play the first 10 frames of the animation only.
   *
   */
  segments?: [number, number];
  /**
   * The speed of the animation.
   */
  speed?: number;
  /**
   * The source URL of the animation.
   */
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

  private _mode: Mode = 'normal';

  private _direction = 1;

  private _bounceCount = 0;

  private _animationFrameId?: number;

  private _startFrame = 0;

  private _endFrame = -1;

  private readonly _segments?: [number, number];

  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private _shouldAutoResizeCanvas = false;

  private readonly _canvasResizeObserver?: ResizeObserver | null = null;

  public constructor(config: Config) {
    this._animationLoop = this._animationLoop.bind(this);

    this._canvas = config.canvas;
    this._context = this._canvas.getContext('2d');
    if (!this._context) {
      throw new Error('2D context not supported or canvas already initialized with another context type.');
    }

    this._loop = config.loop ?? false;
    this._speed = config.speed ?? 1;
    this._autoplay = config.autoplay ?? false;
    this._mode = config.mode ?? 'normal';
    if (config.segments) {
      this._segments = config.segments;
    }

    if (!(this._canvas.hasAttribute('width') || this._canvas.hasAttribute('height'))) {
      this._shouldAutoResizeCanvas = true;

      this._canvasResizeObserver = new ResizeObserver(
        debounce(() => {
          this._resizeAnimationToCanvas();
          if (!this._playing) {
            this._render();
          }
        }, 100),
      );

      this._canvasResizeObserver.observe(this._canvas);
    }

    WasmLoader.load()
      .then((module) => {
        this._renderer = new module.Renderer();

        if (config.src) {
          this._loadAnimationFromURL(config.src);
        } else if (config.data) {
          this._initializeAnimationFromData(config.data);
        }
      })
      .catch((error) => {
        this._eventManager.dispatch({
          type: 'loadError',
          error: error as Error,
        });
      });
  }

  // #region Getters and Setters

  /**
   * Gets the animation start frame.
   *
   * @returns The animation start frame.
   */
  public get startFrame(): number {
    return this._startFrame;
  }

  /**
   * Gets the animation end frame.
   *
   * @returns The animation end frame.
   */
  public get endFrame(): number {
    return this._endFrame;
  }

  /**
   * Gets the current direction of the animation.
   *
   * @returns The current direction of the animation.
   */
  public get direction(): number {
    return this._direction;
  }

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
  // #endregion Getters and Setters

  // #region Private Methods
  /**
   * Loads and initializes the animation from a given URL.
   *
   * @public
   * @param animationURL - The source URL of the animation.
   */
  private _loadAnimationFromURL(animationURL: string): void {
    loadAnimationJSONFromURL(animationURL)
      .then((animationJSON) => {
        this._initializeAnimationFromData(animationJSON);
      })
      .catch((error) => {
        this._eventManager.dispatch({
          type: 'loadError',
          error: error as Error,
        });
      });
  }

  /**
   * Initializes the animation from the given data.
   *
   * @public
   * @param data - The animation data.
   */
  private _initializeAnimationFromData(data: string | ArrayBuffer): void {
    const loadAnimation = (animationData: string): void => {
      try {
        if (this._renderer?.load(animationData, this._canvas.width, this._canvas.height)) {
          this._setupAnimationDetails();
          this._eventManager.dispatch({ type: 'load' });
          this._resizeAnimationToCanvas();
          if (this._autoplay) {
            this.play();
          } else {
            this._render();
          }
        } else {
          this._eventManager.dispatch({
            type: 'loadError',
            error: new Error('Error encountered while initializing animation from data.'),
          });
        }
      } catch (error) {
        this._eventManager.dispatch({
          type: 'loadError',
          error: error as Error,
        });
      }
    };

    if (typeof data === 'string') {
      loadAnimation(data);
    } else if (data instanceof ArrayBuffer) {
      getAnimationJSONFromDotLottie(data)
        .then(loadAnimation)
        .catch((error) => {
          this._eventManager.dispatch({
            type: 'loadError',
            error: error as Error,
          });
        });
    } else {
      console.error('Unsupported data type for animation data. Expected a string or ArrayBuffer.');
    }
  }

  /**
   * Sets up animation details like total frames and duration.
   */
  private _setupAnimationDetails(): void {
    if (this._renderer) {
      this._totalFrames = this._renderer.totalFrames();
      this._duration = this._renderer.duration();
      if (this._segments) {
        this.setFrameBoundaries(this._segments[0], this._segments[1]);
      }
    }
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
    // animation is not loaded yet
    if (this._duration === 0) return false;

    const timeElapsed = (performance.now() / MS_TO_SEC_FACTOR - this._beginTime) * this._speed;

    // define effective start and end frames
    const effectiveStartFrame = this._startFrame;
    const effectiveEndFrame = this._endFrame >= 0 ? this._endFrame : this._totalFrames - 1;

    let frameProgress = (timeElapsed / this._duration) * this._totalFrames + effectiveStartFrame;

    if (this._mode === 'normal') {
      this._currentFrame = frameProgress;
    } else if (this._mode === 'reverse') {
      this._currentFrame = effectiveEndFrame - (frameProgress - effectiveStartFrame);
    } else if (this._mode === 'bounce') {
      if (this._direction === -1) {
        frameProgress = effectiveEndFrame - (frameProgress - effectiveStartFrame);
      }

      this._currentFrame = frameProgress;
    } else {
      // bounce-reverse mode
      if (this._direction === -1) {
        frameProgress = effectiveEndFrame - (frameProgress - effectiveStartFrame);
      }
      this._currentFrame = frameProgress;
      if (this._bounceCount === 0) {
        this._direction = -1;
      }
    }

    // ensure the frame is within the valid range
    this._currentFrame = Math.max(effectiveStartFrame, Math.min(this._currentFrame, effectiveEndFrame));

    // handle animation looping or completion
    if (this._currentFrame >= effectiveEndFrame || this._currentFrame <= effectiveStartFrame) {
      if (this._loop || this._mode === 'bounce' || this._mode === 'bounce-reverse') {
        this._beginTime = performance.now() / MS_TO_SEC_FACTOR;

        if (this._mode === 'bounce' || this._mode === 'bounce-reverse') {
          this._direction *= -1;
          this._bounceCount += 1;

          if (this._bounceCount >= 2) {
            this._bounceCount = 0;
            if (!this._loop) {
              this._playing = false;
              this._bounceCount = 0;
              this._direction = 1;
              this._eventManager.dispatch({ type: 'complete' });

              return false;
            }
            this._loopCount += 1;
            this._eventManager.dispatch({ type: 'loop', loopCount: this._loopCount });
          }
        } else {
          this._loopCount += 1;
          this._eventManager.dispatch({ type: 'loop', loopCount: this._loopCount });
        }
      } else {
        this._playing = false;
        this._eventManager.dispatch({ type: 'complete' });

        return false;
      }
    }

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
    if (this._playing && this._update()) {
      this._render();
      this._startAnimationLoop();
    }
  }

  /**
   * Adjusts the canvas size based on the device pixel ratio and the size of the canvas element.
   *
   */
  public _resizeAnimationToCanvas(): void {
    if (!this._shouldAutoResizeCanvas) return;

    const clientRects = this._canvas.getClientRects();

    if (!clientRects.length) return;

    const rect = clientRects[0] as DOMRect;

    const devicePixelRatio = window.devicePixelRatio || 1;

    const width = Math.round(rect.width * devicePixelRatio);
    const height = Math.round(rect.height * devicePixelRatio);

    const currentWidth = this._canvas.width;
    const currentHeight = this._canvas.height;

    if (width === currentWidth || height === currentHeight) return;

    this._canvas.width = width;
    this._canvas.height = height;
  }

  /**
   * Stops the animation loop.
   *
   * This is used to ensure that the animation loop is only stopped once.
   */
  public _stopAnimationLoop(): void {
    if (this._animationFrameId) {
      window.cancelAnimationFrame(this._animationFrameId);
    }
  }

  /**
   * Starts the animation loop.
   *
   * This is used to ensure that the animation loop is only started once.
   */
  public _startAnimationLoop(): void {
    if (this._animationFrameId) {
      window.cancelAnimationFrame(this._animationFrameId);
    }
    this._animationFrameId = window.requestAnimationFrame(this._animationLoop);
  }
  // #endregion

  // #region Public Methods

  /**
   * Starts the animation playback.
   */
  public play(): void {
    if (this._totalFrames === 0) {
      this._eventManager.dispatch({
        type: 'loadError',
        error: new Error('Unable to play animation.'),
      });

      return;
    }

    // Determine effective end frame
    const effectiveEndFrame = this._endFrame >= 0 ? this._endFrame : this._totalFrames - 1;

    // If the current frame is out of bounds, reset it to the start frame
    if (this._currentFrame < this._startFrame || this._currentFrame > effectiveEndFrame) {
      this._currentFrame = this._startFrame;
    }

    // Calculate the correct begin time based on the current frame and direction
    const progressRatio = (this._currentFrame - this._startFrame) / (effectiveEndFrame - this._startFrame);

    if (this._direction === -1) {
      this._beginTime = performance.now() / MS_TO_SEC_FACTOR - this._duration * (1 - progressRatio);
    } else {
      this._beginTime = performance.now() / MS_TO_SEC_FACTOR - this._duration * progressRatio;
    }

    if (!this._playing) {
      this._playing = true;
      this._eventManager.dispatch({
        type: 'play',
      });
      this._startAnimationLoop();
    }
  }

  /**
   * Stops the animation playback and resets the current frame.
   */
  public stop(): void {
    this._stopAnimationLoop();
    this._playing = false;
    this._loopCount = 0;
    this._direction = 1;
    this._currentFrame = this._startFrame;
    this._bounceCount = 0;
    this._beginTime = 0;
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
    if (speed <= 0) {
      console.error('Speed must be a positive number.');

      return;
    }
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
    if (frame < this._startFrame || frame > this._endFrame) {
      console.error(
        `Invalid frame number: ${frame}. Valid range is between ${this._startFrame} and ${this._endFrame}.`,
      );

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

  public load(config: Omit<Config, 'canvas'>): void {
    this._playing = false;
    this._stopAnimationLoop();

    this._loop = config.loop ?? false;
    this._speed = config.speed ?? 1;
    this._autoplay = config.autoplay ?? false;
    this._loopCount = 0;
    this._currentFrame = 0;
    this._beginTime = 0;
    this._totalFrames = 0;
    this._duration = 0;
    this._bounceCount = 0;
    this._direction = 1;
    this._mode = config.mode ?? 'normal';

    if (config.src) {
      this._loadAnimationFromURL(config.src);
    } else if (config.data) {
      this._initializeAnimationFromData(config.data);
    }
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

  /**
   * Sets the source URL of the WASM file to load.
   * @param url - The URL of the WASM file to load.
   */
  public static setWasmUrl(url: string): void {
    WasmLoader.setWasmUrl(url);
  }

  /**
   * Destroys the DotLottie instance.
   *
   */
  public destroy(): void {
    this._stopAnimationLoop();
    this._eventManager.removeAllEventListeners();
    this._canvasResizeObserver?.disconnect();
    this._context = null;
    this._renderer = null;
  }

  public setFrameBoundaries(startFrame: number, endFrame: number): void {
    if (startFrame < 0 || endFrame < startFrame || endFrame >= this._totalFrames) {
      console.error(`Invalid frame boundaries: startFrame=${startFrame}, endFrame=${endFrame}`);

      return;
    }
    this._startFrame = startFrame;
    this._endFrame = endFrame;
  }

  // #endregion
}
