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

export type Mode = 'forward' | 'reverse' | 'bounce' | 'bounce-reverse';
export type PlaybackState = 'playing' | 'paused' | 'stopped';

export interface Config {
  /**
   * Boolean indicating if the animation should start playing automatically.
   */
  autoplay?: boolean;
  /**
   * Animation canvas background color.
   */
  backgroundColor?: string;
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

  private _beginTime = 0;

  private _elapsedTime = 0;

  private _totalFrames = 0;

  private _loop = false;

  private _speed = 1;

  private _currentFrame = 0;

  private _duration = 0;

  private _loopCount = 0;

  private _autoplay = false;

  private _mode: Mode = 'forward';

  private _direction = 1;

  private _bounceCount = 0;

  private _animationFrameId?: number;

  private _segments: [number, number] | null = null;

  private _playbackState: PlaybackState = 'stopped';

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
    this._mode = config.mode ?? 'forward';
    this._segments = config.segments ?? null;

    if (config.backgroundColor) {
      this._canvas.style.backgroundColor = config.backgroundColor;
    }

    if (!(this._canvas.hasAttribute('width') || this._canvas.hasAttribute('height'))) {
      this._shouldAutoResizeCanvas = true;

      this._canvasResizeObserver = new ResizeObserver(
        debounce(() => {
          this._resizeAnimationToCanvas();
          if (!this.isPlaying) {
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
   *  Gets the segments of the animation if any are set.
   *  Default is 0 to total frames. but if segments are set, it will be the start and end frames.
   *
   */
  public get segments(): [number, number] | null {
    return this._segments;
  }

  /**
   * Gets the playing status of the animation.
   *
   * @returns The playing status of the animation.
   */
  public get isPlaying(): boolean {
    return this._playbackState === 'playing';
  }

  public get isPaused(): boolean {
    return this._playbackState === 'paused';
  }

  public get isStopped(): boolean {
    return this._playbackState === 'stopped';
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
      this._segments = [
        Math.max(0, this._segments?.[0] ?? 0),
        Math.min(this._totalFrames - 1, this.segments?.[1] ?? this._totalFrames - 1),
      ];
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
    if (this._duration === 0 || this._totalFrames === 0) return false;

    const effectiveStartFrame = this._getEffectiveStartFrame();
    const effectiveEndFrame = this._getEffectiveEndFrame();
    const effectiveDuration = this._getEffectiveDuration();
    const frameDuration = effectiveDuration / (effectiveEndFrame - effectiveStartFrame);

    this._elapsedTime = (performance.now() / MS_TO_SEC_FACTOR - this._beginTime) * this._speed;
    const frameProgress = this._elapsedTime / frameDuration;

    if (this._mode === 'forward' || this._mode === 'reverse') {
      this._currentFrame =
        this._mode === 'forward' ? effectiveStartFrame + frameProgress : effectiveEndFrame - frameProgress;

      if (this._currentFrame >= effectiveEndFrame || this._currentFrame <= effectiveStartFrame) {
        if (this._loop) {
          this._beginTime = performance.now() / MS_TO_SEC_FACTOR;
          this._loopCount += 1;
          this._eventManager.dispatch({ type: 'loop', loopCount: this._loopCount });
        } else {
          this._playbackState = 'stopped';
          this._eventManager.dispatch({ type: 'complete' });

          return false;
        }
      }
    } else {
      // bounce or bounce-reverse
      if (this._direction === 1) {
        this._currentFrame = effectiveStartFrame + frameProgress;
        if (this._currentFrame >= effectiveEndFrame) {
          this._currentFrame = effectiveEndFrame;
          this._direction = -1;
          this._beginTime = performance.now() / MS_TO_SEC_FACTOR;
        }
      } else {
        this._currentFrame = effectiveEndFrame - frameProgress;
        if (this._currentFrame <= effectiveStartFrame) {
          this._currentFrame = effectiveStartFrame;
          this._direction = 1;
          this._beginTime = performance.now() / MS_TO_SEC_FACTOR;
        }
      }

      if (this._currentFrame <= effectiveStartFrame || this._currentFrame >= effectiveEndFrame) {
        this._bounceCount += 1;
        if (this._bounceCount % 2 === 0) {
          // A full bounce completed
          // eslint-disable-next-line no-negated-condition
          if (!this._loop) {
            this._playbackState = 'stopped';
            this._eventManager.dispatch({ type: 'complete' });

            return false;
          } else {
            this._loopCount += 1;
            this._eventManager.dispatch({ type: 'loop', loopCount: this._loopCount });
          }
        }
      }
    }

    this._currentFrame = Math.max(effectiveStartFrame, Math.min(this._currentFrame, effectiveEndFrame));

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
    if (this.isPlaying && this._update()) {
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

  public _getEffectiveStartFrame(): number {
    // If segments are defined, use the first value as the start frame.
    return this._segments ? this._segments[0] : 0;
  }

  public _getEffectiveEndFrame(): number {
    // If segments are defined, use the second value as the end frame.
    return this._segments ? this._segments[1] : this._totalFrames - 1;
  }

  public _getEffectiveTotalFrames(): number {
    // If segments are defined, use the difference between the start and end frames as the total frames.
    return this._segments ? this._segments[1] - this._segments[0] : this._totalFrames;
  }

  public _getEffectiveDuration(): number {
    // If segments are defined, use the difference between the start and end frames as the duration.
    return this._segments
      ? this._duration * ((this._segments[1] - this._segments[0]) / this._totalFrames)
      : this._duration;
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

    if (this.isPlaying) return;

    const effectiveStartFrame = this._getEffectiveStartFrame();
    const effectiveEndFrame = this._getEffectiveEndFrame();
    const effectiveDuration = this._getEffectiveDuration();
    const effectiveTotalFrames = this._getEffectiveTotalFrames();

    // if the current frame is at the end, start from the beginning
    if (this._currentFrame >= effectiveEndFrame) {
      this._currentFrame = effectiveStartFrame;
    }

    // calculate the elapsed time based on the current frame and direction
    const frameDuration = effectiveDuration / effectiveTotalFrames;

    let frameTime = this._currentFrame * frameDuration;

    // adjust frame time based on the current direction
    if (this._direction === -1) {
      frameTime = effectiveDuration - frameTime;
    }

    // set the begin time based on the current frame position
    this._beginTime = performance.now() / MS_TO_SEC_FACTOR - frameTime / this._speed;

    this._playbackState = 'playing';

    this._eventManager.dispatch({
      type: 'play',
    });
    this._startAnimationLoop();
  }

  /**
   * Stops the animation playback and resets the current frame.
   */
  public stop(): void {
    if (this.isStopped) return;

    this._stopAnimationLoop();
    this._playbackState = 'stopped';
    // based on the mode, set the current frame to the start or end frame

    if (this._mode === 'reverse' || this._mode === 'bounce-reverse') {
      this._currentFrame = this._getEffectiveEndFrame();
    } else {
      this._currentFrame = this._getEffectiveStartFrame();
    }

    console.log(this._currentFrame);

    this.setFrame(this._currentFrame);
    this._render();

    this._eventManager.dispatch({
      type: 'stop',
    });
  }

  /**
   * Pauses the animation playback.
   */
  public pause(): void {
    if (this.isPaused) return;

    this._stopAnimationLoop();

    this._playbackState = 'paused';

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

    if (this._speed === speed) return;

    if (this.isPlaying) {
      // recalculate the begin time based on the new speed to maintain the current position
      const currentTime = performance.now() / MS_TO_SEC_FACTOR;

      this._beginTime = currentTime - this._elapsedTime / speed;
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
    const startFrame = this._getEffectiveStartFrame();
    const endFrame = this._getEffectiveEndFrame();

    if (frame < startFrame || frame > endFrame) {
      console.error(`Invalid frame number: ${frame}`);

      return;
    }

    this._currentFrame = frame;

    // if the animation is playing, adjust the begin time to maintain continuity
    if (this.isPlaying) {
      const frameDuration = this._duration / this._totalFrames;
      let frameTime = frame * frameDuration;

      // adjust frame time based on the current direction
      if (this._direction === -1) {
        frameTime = this._duration - frameTime;
      }

      this._beginTime = performance.now() / MS_TO_SEC_FACTOR - frameTime / this._speed;
    }

    this._renderer?.frame(this._currentFrame);

    this._eventManager.dispatch({
      type: 'frame',
      currentFrame: this._currentFrame,
    });
  }

  /**
   *
   * Sets the playback mode of the animation.
   *
   */
  public setMode(mode: Mode): void {
    if (this._mode === mode) {
      return;
    }

    this._mode = mode;
    this._bounceCount = 0;
    this._direction = mode.includes('reverse') ? -1 : 1;

    const frameDuration = this._duration / this._totalFrames;
    let frameTime = this._currentFrame * frameDuration;

    // Adjust frame time based on the current direction
    if (this._direction === -1) {
      frameTime = this._duration - frameTime;
    }

    // Set the begin time based on the current frame position
    this._beginTime = performance.now() / MS_TO_SEC_FACTOR - frameTime / this._speed;
  }

  public load(config: Omit<Config, 'canvas'>): void {
    this._playbackState = 'stopped';
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
    this._mode = config.mode ?? 'forward';
    this._canvas.style.backgroundColor = '';

    if (config.backgroundColor) {
      this._canvas.style.backgroundColor = config.backgroundColor;
    }

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
    this._playbackState = 'stopped';
  }

  // #endregion
}
