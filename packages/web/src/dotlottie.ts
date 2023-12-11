/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable @typescript-eslint/unbound-method */

import { AnimationFrameManager } from './animation-frame-manager';
import { IS_BROWSER, MS_TO_SEC_FACTOR, DEFAULT_BG_COLOR } from './constants';
import type { EventListener, EventType } from './event-manager';
import { EventManager } from './event-manager';
import type { Renderer } from './renderer-wasm';
import { WasmLoader } from './renderer-wasm';
import { getAnimationJSONFromDotLottie, loadAnimationJSONFromURL, hexStringToRGBAInt } from './utils';

export type Mode = 'forward' | 'reverse' | 'bounce' | 'bounce-reverse';

type PlaybackState = 'playing' | 'paused' | 'stopped';

interface RenderConfig {
  /**
   * The device pixel ratio to use when resizing the canvas.
   *
   * Default is window.devicePixelRatio or 1.
   */
  devicePixelRatio?: number;
}

export interface Config {
  /**
   * Boolean indicating if the animation should start playing automatically.
   */
  autoplay?: boolean;
  /**
   * Animation canvas background color.
   *
   * Default is #00000000.
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
   *
   * If the data is an ArrayBuffer, the JSON string will be extracted from the .lottie file.
   */
  data?: string | ArrayBuffer;
  /**
   * Boolean indicating if the animation should loop.
   */
  loop?: boolean;
  /**
   *  The playback mode of the animation.
   *
   * forward: The animation will play from start to end.
   * reverse: The animation will play from end to start.
   * bounce: The animation will play from start to end and then from end to start.
   * bounce-reverse: The animation will play from end to start and then from start to end.
   *
   */
  mode?: Mode;
  /**
   * The render configuration.
   */
  renderConfig?: RenderConfig;
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
   *
   * If the data is provided, the src will be ignored.
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

  private _animationFrameId?: number | null = null;

  private _segments: [number, number] | null = null;

  private _playbackState: PlaybackState = 'stopped';

  private _backgroundColor: string = DEFAULT_BG_COLOR;

  private _renderConfig: RenderConfig = {};

  private _isFrozen = false;

  private _isLoaded = false;

  private readonly _animationFrameManager = new AnimationFrameManager();

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
    this._backgroundColor = config.backgroundColor ?? DEFAULT_BG_COLOR;
    this._renderConfig = config.renderConfig ?? {};

    WasmLoader.load()
      .then((module) => {
        this._renderer = new module.Renderer();

        this.setBackgroundColor(this._backgroundColor);

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

  public get mode(): Mode {
    return this._mode;
  }

  /**
   * Gets the autoplay status of the animation.
   *
   * @returns The autoplay status of the animation.
   */
  public get autoplay(): boolean {
    return this._autoplay;
  }

  /**
   * Gets the background color of the canvas.
   *
   * @returns The background color of the canvas.
   */
  public get backgroundColor(): string {
    return this._backgroundColor;
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
   *  Gets the segments of the animation if any are set.
   *  Default is 0 to total frames. but if segments are set, it will be the start and end frames.
   *
   */
  public get segments(): [number, number] | null {
    return this._segments;
  }

  public get isPlaying(): boolean {
    return this._playbackState === 'playing';
  }

  public get isPaused(): boolean {
    return this._playbackState === 'paused';
  }

  public get isStopped(): boolean {
    return this._playbackState === 'stopped';
  }

  public get isFrozen(): boolean {
    return this._isFrozen;
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
          this._isLoaded = true;
          this._eventManager.dispatch({ type: 'load' });
          this.resize();

          // render the first frame of the animation
          this._currentFrame = this._mode.includes('reverse')
            ? this._getEffectiveEndFrame()
            : this._getEffectiveStartFrame();

          this._renderer.frame(this._currentFrame);
          this._render();

          if (this._autoplay) {
            this.play();
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
    if (!this._context || !this._renderer) {
      return;
    }

    const width = this._canvas.width;
    const height = this._canvas.height;

    this._renderer.resize(width, height);

    if (this._renderer.update()) {
      const buffer = this._renderer.render();

      if (buffer.length === 0) {
        console.warn('Empty buffer received from renderer.');

        return;
      }

      const clampedBuffer = new Uint8ClampedArray(buffer);

      const imageData = this._context.createImageData(width, height);

      imageData.data.set(clampedBuffer);

      this._context.putImageData(imageData, 0, 0);
    }
  }

  /**
   * Updates the current frame and animation state.
   * @returns Boolean indicating if the frame was updated.
   */
  private _update(): boolean {
    // animation is not loaded yet
    if (this._duration === 0 || this._totalFrames === 0) return false;

    const effectiveStartFrame = this._getEffectiveStartFrame();
    const effectiveEndFrame = this._getEffectiveEndFrame();
    const effectiveDuration = this._getEffectiveDuration();
    const frameDuration = effectiveDuration / (effectiveEndFrame - effectiveStartFrame);

    this._elapsedTime = (Date.now() / MS_TO_SEC_FACTOR - this._beginTime) * this._speed;
    const frameProgress = this._elapsedTime / frameDuration;

    // determine the current frame based on the animation mode and progress
    if (this._mode === 'forward') {
      this._currentFrame = effectiveStartFrame + frameProgress;
    } else if (this._mode === 'reverse') {
      this._currentFrame = effectiveEndFrame - frameProgress;
    } else {
      // handle bounce or bounce-reverse mode
      const isForward = this._direction === 1;

      if (isForward) {
        this._currentFrame = effectiveStartFrame + frameProgress;
      } else {
        this._currentFrame = effectiveEndFrame - frameProgress;
      }
    }

    // clamp the current frame within the effective range and round it
    this._currentFrame = Math.max(effectiveStartFrame, Math.min(this._currentFrame, effectiveEndFrame));

    let shouldUpdate = false;

    if (this._renderer?.frame(this._currentFrame)) {
      this._eventManager.dispatch({
        type: 'frame',
        currentFrame: this._currentFrame,
      });

      shouldUpdate = true;
    }

    // check if the animation should loop or complete
    if (
      (this._mode === 'forward' && this._currentFrame >= effectiveEndFrame) ||
      (this._mode === 'reverse' && this._currentFrame <= effectiveStartFrame)
    ) {
      this._handleLoopOrCompletion();
    } else if (
      this._mode.includes('bounce') &&
      (this._currentFrame <= effectiveStartFrame || this._currentFrame >= effectiveEndFrame)
    ) {
      // change the direction if the animation reaches the start or end frame
      this._direction *= -1;

      // increment the bounce cycle count, 2 cycles means 1 loop
      this._bounceCount += 1;

      if (this._bounceCount % 2 === 0) {
        this._bounceCount = 0;
        this._handleLoopOrCompletion();
      } else {
        this._beginTime = Date.now() / MS_TO_SEC_FACTOR;
      }
    }

    return shouldUpdate;
  }

  /**
   * Handles the loop or completion logic for the animation.
   */
  private _handleLoopOrCompletion(): void {
    if (this._loop) {
      this._loopCount += 1;
      this._eventManager.dispatch({ type: 'loop', loopCount: this._loopCount });
      this._beginTime = Date.now() / MS_TO_SEC_FACTOR;
    } else {
      this._playbackState = 'stopped';
      this._eventManager.dispatch({ type: 'complete' });
      this._stopAnimationLoop();
    }
  }

  /**
   * Loop that handles the animation playback.
   */
  private _animationLoop(): void {
    const updated = this._update();

    if (updated) {
      this._render();
    }

    // check if the animation is still playing before requesting the next frame
    if (this.isPlaying) {
      this._animationFrameId = this._animationFrameManager.requestAnimationFrame(this._animationLoop);
    }
  }

  /**
   * Stops the animation loop.
   *
   * This is used to ensure that the animation loop is only stopped once.
   */
  private _stopAnimationLoop(): void {
    if (this._animationFrameId) {
      this._animationFrameManager.cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
  }

  /**
   * Starts the animation loop.
   *
   * This is used to ensure that the animation loop is only started once.
   */
  private _startAnimationLoop(): void {
    if (!this._animationFrameId) {
      this._animationFrameId = this._animationFrameManager.requestAnimationFrame(this._animationLoop);
    }
  }

  private _getEffectiveStartFrame(): number {
    return this._segments ? this._segments[0] : 0;
  }

  private _getEffectiveEndFrame(): number {
    return this._segments ? this._segments[1] : this._totalFrames - 1;
  }

  private _getEffectiveTotalFrames(): number {
    return this._segments ? this._segments[1] - this._segments[0] : this._totalFrames;
  }

  private _getEffectiveDuration(): number {
    return this._segments
      ? this._duration * ((this._segments[1] - this._segments[0]) / this._totalFrames)
      : this._duration;
  }

  /**
   * Synchronizes the animation timing based on the current frame, direction, and speed settings.
   * This method calculates the appropriate begin time for the animation loop, ensuring that the
   * animation's playback is consistent with the specified parameters.
   *
   * @param frame - The current frame number from which the animation timing will be synchronized.
   *                This frame number is used to calculate the correct position in the animation timeline.
   *
   * Usage:
   *  - This function should be called whenever there is a change in the frame, speed, or direction
   *    of the animation to maintain the correct timing.
   *  - It is used internally in methods like `play`, `setFrame`, and `setMode` to ensure that the
   *    animation's playback remains smooth and accurate.
   */
  private _synchronizeAnimationTiming(frame: number): void {
    const effectiveDuration = this._getEffectiveDuration();
    const effectiveTotalFrames = this._getEffectiveTotalFrames();
    const frameDuration = effectiveDuration / effectiveTotalFrames;
    let frameTime = (frame - this._getEffectiveStartFrame()) * frameDuration;

    if (this._direction === -1) {
      frameTime = effectiveDuration - frameTime;
    }

    this._beginTime = Date.now() / MS_TO_SEC_FACTOR - frameTime / this._speed;
  }

  // #endregion

  // #region Public Methods

  /**
   * Starts the animation playback.
   */
  public play(): void {
    if (!this._isLoaded || this.isPlaying) return;

    const effectiveStartFrame = this._getEffectiveStartFrame();
    const effectiveEndFrame = this._getEffectiveEndFrame();

    // reset begin time and loop count if starting from the beginning
    // eslint-disable-next-line no-negated-condition
    if (this._playbackState !== 'paused') {
      this._currentFrame =
        this._mode === 'reverse' || this._mode === 'bounce-reverse' ? effectiveEndFrame : effectiveStartFrame;
      this._beginTime = Date.now() / MS_TO_SEC_FACTOR;
    } else {
      this._synchronizeAnimationTiming(this._currentFrame);
    }

    this._playbackState = 'playing';

    // auto unfreeze if the animation on play
    if (this._isFrozen) {
      this._isFrozen = false;

      this._eventManager.dispatch({ type: 'unfreeze' });
    }

    this._eventManager.dispatch({
      type: 'play',
    });

    this._animationFrameId = this._animationFrameManager.requestAnimationFrame(this._animationLoop);
  }

  /**
   * Stops the animation playback and resets the current frame.
   */
  public stop(): void {
    if (!this._isLoaded || this.isStopped) return;

    this._stopAnimationLoop();
    this._playbackState = 'stopped';
    this._bounceCount = 0;

    if (this._mode === 'reverse' || this._mode === 'bounce-reverse') {
      this._currentFrame = this._getEffectiveEndFrame();
      this._direction = -1;
    } else {
      this._currentFrame = this._getEffectiveStartFrame();
      this._direction = 1;
    }

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
    if (!this._isLoaded || !this.isPlaying) return;

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
    if (!this._isLoaded || speed <= 0 || speed >= Number.MAX_SAFE_INTEGER) return;

    if (this._speed === speed) return;

    if (this.isPlaying) {
      // recalculate the begin time based on the new speed to maintain the current position
      const currentTime = Date.now() / MS_TO_SEC_FACTOR;

      this._beginTime = currentTime - this._elapsedTime / speed;
    }

    this._speed = speed;
  }

  /**
   *  Sets the loop state for animation playback.
   * @param loop - Boolean indicating if the animation should loop.
   */
  public setLoop(loop: boolean): void {
    if (!this._isLoaded) return;

    this._loop = loop;
  }

  /**
   * Sets the current frame of the animation.
   * @param frame - Frame number to set.
   */
  public setFrame(frame: number): void {
    if (!this._isLoaded) return;

    const effectiveStartFrame = this._getEffectiveStartFrame();
    const effectiveEndFrame = this._getEffectiveEndFrame();

    // validate the frame number within the effective frame range
    if (frame < effectiveStartFrame || frame > effectiveEndFrame) {
      console.error(
        `Invalid frame number: ${frame}. It should be between ${effectiveStartFrame} and ${effectiveEndFrame}.`,
      );

      return;
    }

    this._currentFrame = frame;

    if (this.isPlaying) {
      this._synchronizeAnimationTiming(frame);
    }

    if (this._renderer?.frame(this._currentFrame)) {
      this._render();
    }

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
    if (!this._isLoaded || this._mode === mode) {
      return;
    }

    this._mode = mode;
    this._bounceCount = 0;
    this._direction = mode.includes('reverse') ? -1 : 1;

    if (this.isPlaying) {
      this._synchronizeAnimationTiming(this._currentFrame);
    }
  }

  public load(config: Omit<Config, 'canvas'>): void {
    if (!this._renderer || !this._context) {
      return;
    }

    if (!config.src && !config.data) {
      console.error('Either "src" or "data" must be provided.');

      return;
    }

    this._stopAnimationLoop();
    this._playbackState = 'stopped';
    this._isLoaded = false;

    this._loop = config.loop ?? false;
    this._speed = config.speed ?? 1;
    this._autoplay = config.autoplay ?? false;
    this._mode = config.mode ?? 'forward';
    this._segments = config.segments ?? null;
    this._loopCount = 0;
    this._bounceCount = 0;
    this._direction = this._mode.includes('reverse') ? -1 : 1;
    this._renderConfig = config.renderConfig ?? {};

    const effectiveStartFrame = this._getEffectiveStartFrame();
    const effectiveEndFrame = this._getEffectiveEndFrame();

    this._currentFrame =
      this._mode === 'reverse' || this._mode === 'bounce-reverse' ? effectiveEndFrame : effectiveStartFrame;

    this._beginTime = 0;
    this._totalFrames = 0;
    this._duration = 0;
    this._backgroundColor = config.backgroundColor ?? DEFAULT_BG_COLOR;

    this.setBackgroundColor(this._backgroundColor);

    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

    if (config.src) {
      this._loadAnimationFromURL(config.src);
    } else if (config.data) {
      this._initializeAnimationFromData(config.data);
    }
  }

  public setSegments(startFrame: number, endFrame: number): void {
    if (!this._isLoaded) return;

    // Validate the frame range
    if (startFrame < 0 || endFrame >= this._totalFrames || startFrame > endFrame) {
      console.error('Invalid frame range.');

      return;
    }

    this._segments = [startFrame, endFrame];

    if (this._currentFrame < startFrame || this._currentFrame > endFrame) {
      this._currentFrame = this._direction === 1 ? startFrame : endFrame;

      // render the current frame
      if (this._renderer?.frame(this._currentFrame)) {
        this._render();
        this._eventManager.dispatch({
          type: 'frame',
          currentFrame: this._currentFrame,
        });
      }
    }

    // If playing, adjust the animation timing
    if (this.isPlaying) {
      this._synchronizeAnimationTiming(this._currentFrame);
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
    this._playbackState = 'stopped';

    this._context = null;
    this._renderer = null;

    this._eventManager.dispatch({
      type: 'destroy',
    });

    this._eventManager.removeAllEventListeners();
  }

  /**
   * Freezes the animation by stopping the animation loop.
   *
   */
  public freeze(): void {
    if (this._isFrozen) return;

    this._stopAnimationLoop();

    this._isFrozen = true;

    this._eventManager.dispatch({
      type: 'freeze',
    });
  }

  /**
   * Unfreezes the animation by resuming the animation loop.
   *
   */
  public unfreeze(): void {
    if (!this.isFrozen) return;

    this._isFrozen = false;
    this._eventManager.dispatch({ type: 'unfreeze' });

    // resume the animation loop only if the playback state is 'playing'
    if (this.isPlaying) {
      this._synchronizeAnimationTiming(this._currentFrame);
      this._startAnimationLoop();
    }
  }

  /**
   * Sets the background color of the canvas.
   *
   * @param color - The background color of the canvas.
   */
  public setBackgroundColor(color: string): void {
    this._backgroundColor = color;

    const rgbaInt = hexStringToRGBAInt(color);

    this._renderer?.setBgColor(rgbaInt);
  }

  /**
   * Adjusts the canvas size to match the size of its bounding box, considering the device's pixel ratio.
   * This method ensures that the canvas is correctly scaled for high-density displays, maintaining
   * the clarity and quality of the rendered animation.
   *
   * Call this method whenever the size of the canvas element changes (e.g., due to window resizing,
   * orientation changes, or dynamic layout updates) to ensure that the canvas is always properly scaled.
   *
   */
  public resize(): void {
    if (!IS_BROWSER) return;

    const { height, width } = this._canvas.getBoundingClientRect();

    const dpr = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1;

    this._canvas.width = width * dpr;
    this._canvas.height = height * dpr;

    // resize the renderer and render the current frame
    this._render();
  }

  // #endregion
}
