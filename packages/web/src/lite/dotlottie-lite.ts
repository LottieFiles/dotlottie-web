import { AnimationFrameManager } from '../animation-frame-manager';
import { IS_BROWSER } from '../constants';
import type { EventListener, EventType } from '../event-manager';
import { EventManager } from '../event-manager';
import { OffscreenObserver } from '../offscreen-observer';
import { CanvasResizeObserver } from '../resize-observer';
import type {
  ColorSlotValue,
  Config,
  Data,
  GradientSlotValue,
  Layout,
  Manifest,
  Marker,
  Mode,
  RenderConfig,
  RenderSurface,
  ScalarSlotValue,
  SlotType,
  StateMachineConfig,
  TextSlotValue,
  Theme,
  Transform,
  VectorSlotValue,
} from '../types';
import { getDefaultDPR, isDotLottie, isElementInViewport, isLottie } from '../utils';
import type { DotLottieAPI, DotLottieStatics } from './api';
import type { Animation } from './model';
import { registerPackagedFonts, resolvePackagedImageAssets, unregisterPackagedFonts } from './parser/assets';
import type { DotLottieAnimation, ParsedDotLottie } from './parser/dotlottie';
import { parseDotLottie, resolveDotLottieAnimation } from './parser/dotlottie';
import { parseLottie } from './parser/lottie';
import { Canvas2DRenderer } from './renderer/renderer';

type PlaybackState = 'playing' | 'paused' | 'stopped';

interface PendingLoad {
  data?: Data;
  src?: string;
}

/**
 * Pure-TypeScript dotLottie player (experimental).
 *
 * Drop-in replacement for the WASM-backed DotLottie player targeting
 * micro-interactions: no WASM download, no runtime network fetches, Canvas2D
 * rendering only. Implements the full DotLottie public API; features outside
 * the lite scope (state machines, theming, slots) degrade gracefully by
 * returning false/empty values.
 */
export class DotLottieLite implements DotLottieAPI {
  private readonly _eventManager = new EventManager();

  private readonly _frameManager = new AnimationFrameManager();

  private readonly _renderer = new Canvas2DRenderer();

  private readonly _boundAnimationLoop: (time: number) => void;

  private _canvas: HTMLCanvasElement | OffscreenCanvas | RenderSurface | null = null;

  private _layoutBuffer: HTMLCanvasElement | OffscreenCanvas | null = null;

  private _renderConfig: RenderConfig = {};

  private _animation: Animation | null = null;

  private _dotLottie: ParsedDotLottie | null = null;

  private _activeAnimationId: string | undefined = undefined;

  private _requestedAnimationId: string | undefined = undefined;

  private _fonts: FontFace[] = [];

  private _pendingLoad: PendingLoad | null = null;

  private _ready = false;

  private _destroyed = false;

  private _state: PlaybackState = 'stopped';

  private _completed = false;

  private _rawFrame = 0;

  private _lastRenderedFrame: number | null = null;

  private _direction: 1 | -1 = 1;

  private _mode: Mode = 'forward';

  private _speed = 1;

  private _loop = false;

  private _loopCount = 0;

  private _completedLoops = 0;

  private _autoplay = false;

  private _useFrameInterpolation = true;

  private _segment: [number, number] | null = null;

  private _marker = '';

  private _backgroundColor = '';

  private _layout: Layout | null = null;

  private _isFrozen = false;

  private _animationFrameId: number | null = null;

  private _lastFrameTime: number | null = null;

  public constructor(config: Config) {
    this._canvas = config.canvas ?? null;
    this._boundAnimationLoop = this._animationLoop.bind(this);
    this._renderConfig = {
      ...config.renderConfig,
      devicePixelRatio: config.renderConfig?.devicePixelRatio || getDefaultDPR(),
      freezeOnOffscreen: config.renderConfig?.freezeOnOffscreen ?? true,
    };

    // Initialization is asynchronous to match the WASM player's lifecycle:
    // listeners attached right after construction still receive 'ready'.
    queueMicrotask(() => {
      if (this._destroyed) return;

      this._ready = true;
      this._applyConfig(config);

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
    });
  }

  // ── Statics (parity no-ops: the lite player ships no WASM) ─────────────

  public static setWasmUrl(_url: string): void {
    // No-op: the lite player is pure TypeScript and loads no WASM module.
  }

  public static async registerFont(
    _fontName: string,
    _fontSource: string | ArrayBuffer | Uint8Array,
  ): Promise<boolean> {
    // Fonts packaged in .lottie files register automatically via the FontFace API.
    return false;
  }

  // ── Getters ─────────────────────────────────────────────────────────────

  public get buffer(): Uint8Array | null {
    const context = this._get2dContext();

    if (!context || !this._canvas || this._canvas.width <= 0 || this._canvas.height <= 0) return null;

    try {
      const imageData = context.getImageData(0, 0, this._canvas.width, this._canvas.height);

      return new Uint8Array(imageData.data.buffer, imageData.data.byteOffset, imageData.data.byteLength);
    } catch (_err) {
      return null;
    }
  }

  public get activeAnimationId(): string | undefined {
    return this._activeAnimationId;
  }

  public get activeThemeId(): string | undefined {
    return undefined;
  }

  public get layout(): Layout | undefined {
    if (!this.isReady) return undefined;

    return {
      align: this._layout?.align ?? [0.5, 0.5],
      fit: this._layout?.fit ?? 'contain',
    };
  }

  public get marker(): string | undefined {
    return this._marker;
  }

  public get manifest(): Manifest | null {
    if (!this._dotLottie) return null;

    return this._dotLottie.manifest as unknown as Manifest;
  }

  public get renderConfig(): RenderConfig {
    return this._renderConfig;
  }

  public get segment(): [number, number] | undefined {
    if (!this.isReady) return undefined;
    if (!this._animation) return [0, 0];

    return this._playbackRange();
  }

  public get loop(): boolean {
    return this.isReady ? this._loop : false;
  }

  public get mode(): Mode {
    return this.isReady ? this._mode : 'forward';
  }

  public get isFrozen(): boolean {
    return this._isFrozen;
  }

  public get isStateMachineRunning(): boolean {
    return false;
  }

  public get backgroundColor(): string {
    return this._backgroundColor;
  }

  public get autoplay(): boolean {
    return this.isReady ? this._autoplay : false;
  }

  public get useFrameInterpolation(): boolean {
    return this.isReady ? this._useFrameInterpolation : false;
  }

  public get speed(): number {
    return this.isReady ? this._speed : 0;
  }

  public get isReady(): boolean {
    return this._ready && !this._destroyed;
  }

  public get isLoaded(): boolean {
    return this._animation !== null && !this._destroyed;
  }

  public get isPlaying(): boolean {
    return this.isLoaded && this._state === 'playing';
  }

  public get isPaused(): boolean {
    return this.isLoaded && this._state === 'paused';
  }

  public get isStopped(): boolean {
    return this.isLoaded && this._state === 'stopped';
  }

  public get currentFrame(): number {
    if (!this.isLoaded) return 0;

    return Math.round(this._effectiveFrame() * 100) / 100;
  }

  public get loopCount(): number {
    return this._completedLoops;
  }

  public get totalFrames(): number {
    return this._animation?.duration ?? 0;
  }

  public get duration(): number {
    if (!this._animation || this._animation.frameRate === 0) return 0;

    return this._animation.duration / this._animation.frameRate;
  }

  public get canvas(): HTMLCanvasElement | OffscreenCanvas | RenderSurface | null {
    return this._canvas;
  }

  // ── Loading ─────────────────────────────────────────────────────────────

  public load(config: Omit<Config, 'canvas'>): void {
    if (!this.isReady) return;

    this._stopAnimationLoop();
    this._cleanupCanvas();
    this._isFrozen = false;

    this._applyConfig(config);

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
  }

  public loadAnimation(animationId: string): void {
    if (!this.isReady || this._activeAnimationId === animationId || !this._canvas) return;

    const container = this._dotLottie;
    const entry = container?.animations.find((animation) => animation.id === animationId);

    if (!container || !entry) {
      this._dispatchError(`Failed to load animation with id: ${animationId}`);

      return;
    }

    try {
      const data = resolvePackagedImageAssets(entry.data, container.files);

      this._setAnimation(parseLottie(data), animationId, { applyAutoplay: false });
    } catch (error) {
      this._dispatchError(`Failed to load animation with id: ${animationId}. ${error}`);
    }
  }

  public setCanvas(canvas: HTMLCanvasElement | OffscreenCanvas | RenderSurface): void {
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

  // ── Playback ────────────────────────────────────────────────────────────

  public play(): void {
    if (!this.isLoaded) return;

    if (this._state !== 'playing') {
      if (this._completed) {
        this._completed = false;
        this._completedLoops = 0;
        this._direction = this._initialDirection();
        this._rawFrame = this._logicalStartFrame();
      }

      this._state = 'playing';
      queueMicrotask(() => this._eventManager.dispatch({ type: 'play' }));
    }

    this._isFrozen = false;
    this._startAnimationLoop();

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

  public pause(): void {
    if (!this.isLoaded || this._state !== 'playing') return;

    this._state = 'paused';

    queueMicrotask(() => this._eventManager.dispatch({ type: 'pause' }));

    this._stopAnimationLoop();
  }

  public stop(): void {
    if (!this.isLoaded) return;

    const startFrame = this._logicalStartFrame();

    if (this._state === 'stopped' && this._rawFrame === startFrame) return;

    this._state = 'stopped';
    this._completed = false;
    this._completedLoops = 0;
    this._direction = this._initialDirection();
    this._rawFrame = startFrame;

    queueMicrotask(() => this._eventManager.dispatch({ type: 'stop' }));

    this._stopAnimationLoop();

    this._eventManager.dispatch({ type: 'frame', currentFrame: this.currentFrame });
    this._renderCurrentFrame({ frameEvent: false, renderEvent: false });
  }

  public setFrame(frame: number): void {
    if (!this.isLoaded) return;

    const [start, end] = this._playbackRange();
    const clamped = Math.max(start, Math.min(frame, end));

    if (clamped === this._rawFrame) return;

    this._rawFrame = clamped;
    this._completed = false;

    this._renderCurrentFrame({ frameEvent: true, renderEvent: true });
  }

  public setSpeed(speed: number): void {
    if (!this.isReady) return;

    this._speed = speed;
  }

  public setLoop(loop: boolean): void {
    if (!this.isReady) return;

    this._loop = loop;
  }

  public setLoopCount(loopCount: number): void {
    if (!this.isReady) return;

    this._loopCount = loopCount;
  }

  public setUseFrameInterpolation(useFrameInterpolation: boolean): void {
    if (!this.isReady) return;

    this._useFrameInterpolation = useFrameInterpolation;
  }

  public setMode(mode: Mode): void {
    if (!this.isReady) return;

    this._mode = mode;

    if (this._state !== 'playing') {
      this._direction = this._initialDirection();
    } else if (mode === 'forward' || mode === 'reverse') {
      this._direction = this._initialDirection();
    }
  }

  public freeze(): void {
    if (this._animationFrameId === null) return;

    this._stopAnimationLoop();

    this._isFrozen = true;

    this._eventManager.dispatch({ type: 'freeze' });
  }

  public unfreeze(): void {
    if (this._animationFrameId !== null) return;

    this._isFrozen = false;

    this._eventManager.dispatch({ type: 'unfreeze' });

    this._startAnimationLoop();
  }

  // ── Segments, markers, layout ───────────────────────────────────────────

  public setSegment(startFrame: number, endFrame: number): void {
    if (!this.isReady) return;

    this._segment = [startFrame, endFrame];
  }

  public resetSegment(): void {
    if (!this.isReady) return;

    this._segment = null;
  }

  public setMarker(marker: string): void {
    if (!this.isReady) return;

    const exists = this.markers().some((m) => m.name === marker);

    if (exists) {
      this._marker = marker;
    } else {
      this._marker = '';
      this._segment = null;
    }
  }

  public markers(): Marker[] {
    return [...(this._animation?.markers ?? [])];
  }

  public setLayout(layout: Layout): void {
    if (!this.isReady) return;

    this._layout = layout;

    if (this.isLoaded) {
      this._renderCurrentFrame({ frameEvent: false, renderEvent: false });
    }
  }

  public animationSize(): { height: number; width: number } {
    return {
      height: this._animation?.height ?? 0,
      width: this._animation?.width ?? 0,
    };
  }

  // ── Rendering config ────────────────────────────────────────────────────

  public setBackgroundColor(color: string): void {
    if (!this.isReady) return;

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      this._canvas.style.backgroundColor = color;
    }

    this._backgroundColor = color;
  }

  public setRenderConfig(config: RenderConfig): void {
    const { devicePixelRatio, freezeOnOffscreen, quality, ...restConfig } = config;

    this._renderConfig = {
      ...this._renderConfig,
      ...restConfig,
      devicePixelRatio: devicePixelRatio || getDefaultDPR(),
      freezeOnOffscreen: freezeOnOffscreen ?? true,
      ...(quality !== undefined && { quality }),
    };

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      if (this._renderConfig.autoResize) {
        CanvasResizeObserver.observe(this._canvas, this);
      } else {
        CanvasResizeObserver.unobserve(this._canvas);
      }

      if (this._renderConfig.freezeOnOffscreen) {
        OffscreenObserver.observe(this._canvas, this);

        if (!isElementInViewport(this._canvas)) {
          this.freeze();
        }
      } else {
        OffscreenObserver.unobserve(this._canvas);

        if (this._isFrozen) {
          this.unfreeze();
        }
      }
    }
  }

  public resize(): void {
    if (!this.isLoaded || !this._canvas) return;

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      const dpr = this._renderConfig.devicePixelRatio || window.devicePixelRatio || 1;

      const { height: clientHeight, width: clientWidth } = this._canvas.getBoundingClientRect();

      if (clientHeight !== 0 && clientWidth !== 0) {
        this._canvas.width = clientWidth * dpr;
        this._canvas.height = clientHeight * dpr;
      }
    }

    this._renderCurrentFrame({ frameEvent: false, renderEvent: false });
  }

  // ── Events ──────────────────────────────────────────────────────────────

  public addEventListener<T extends EventType>(type: T, listener: EventListener<T>): void {
    this._eventManager.addEventListener(type, listener);
  }

  public removeEventListener<T extends EventType>(type: T, listener?: EventListener<T>): void {
    this._eventManager.removeEventListener(type, listener);
  }

  public destroy(): void {
    this._stopAnimationLoop();

    this._cleanupCanvas();

    unregisterPackagedFonts(this._fonts);
    this._fonts = [];

    this._renderer.dispose();

    this._animation = null;
    this._dotLottie = null;
    this._layoutBuffer = null;
    this._destroyed = true;

    this._eventManager.dispatch({ type: 'destroy' });

    this._eventManager.removeAllEventListeners();
  }

  // ── Transform / viewport (unsupported in the lite renderer) ────────────

  public setTransform(_transform: Transform): boolean {
    return false;
  }

  public getTransform(): Transform | undefined {
    return undefined;
  }

  public setViewport(_x: number, _y: number, _width: number, _height: number): boolean {
    return false;
  }

  // ── Theming and slots (not supported in the experimental release) ──────

  public setTheme(_themeId: string): boolean {
    return false;
  }

  public resetTheme(): boolean {
    return false;
  }

  public setThemeData(_themeData: Theme | string): boolean {
    return false;
  }

  public setSlots(_slots: Record<string, unknown>): void {
    // Not supported in the experimental lite release.
  }

  public getSlotIds(): string[] {
    return [];
  }

  public getSlotType(_slotId: string): SlotType | undefined {
    return undefined;
  }

  public getSlot(_slotId: string): unknown {
    return undefined;
  }

  public getSlots(): Record<string, unknown> {
    return {};
  }

  public setColorSlot(_slotId: string, _value: ColorSlotValue): boolean {
    return false;
  }

  public setScalarSlot(_slotId: string, _value: ScalarSlotValue): boolean {
    return false;
  }

  public setVectorSlot(_slotId: string, _value: VectorSlotValue): boolean {
    return false;
  }

  public setGradientSlot(_slotId: string, _value: GradientSlotValue, _colorStopCount: number): boolean {
    return false;
  }

  public setTextSlot(_slotId: string, _value: TextSlotValue): boolean {
    return false;
  }

  public resetSlot(_slotId: string): boolean {
    return false;
  }

  public clearSlot(_slotId: string): boolean {
    return false;
  }

  public resetSlots(): boolean {
    return false;
  }

  public clearSlots(): boolean {
    return false;
  }

  // ── State machines (not supported in the experimental release) ─────────

  public stateMachineLoad(_stateMachineId: string): boolean {
    return false;
  }

  public stateMachineLoadData(_stateMachineData: string): boolean {
    return false;
  }

  public stateMachineSetConfig(_config: StateMachineConfig | null): void {
    // Not supported in the experimental lite release.
  }

  public stateMachineStart(): boolean {
    return false;
  }

  public stateMachineStop(): boolean {
    return false;
  }

  public stateMachineGetStatus(): string {
    return '';
  }

  public stateMachineGetCurrentState(): string {
    return '';
  }

  public stateMachineGetActiveId(): string {
    return '';
  }

  public stateMachineOverrideState(_state: string, _immediate: boolean = false): boolean {
    return false;
  }

  public stateMachineGet(_stateMachineId: string): string {
    return '';
  }

  public stateMachineGetListeners(): string[] {
    return [];
  }

  public stateMachineSetBooleanInput(_name: string, _value: boolean): boolean {
    return false;
  }

  public stateMachineSetNumericInput(_name: string, _value: number): boolean {
    return false;
  }

  public stateMachineSetStringInput(_name: string, _value: string): boolean {
    return false;
  }

  public stateMachineGetBooleanInput(_name: string): boolean | undefined {
    return undefined;
  }

  public stateMachineGetNumericInput(_name: string): number | undefined {
    return undefined;
  }

  public stateMachineGetStringInput(_name: string): string | undefined {
    return undefined;
  }

  public stateMachineGetInputs(): string[] {
    return [];
  }

  public stateMachineFireEvent(_name: string): void {
    // Not supported in the experimental lite release.
  }

  public stateMachinePostClickEvent(_x: number, _y: number): void {
    // Not supported in the experimental lite release.
  }

  public stateMachinePostPointerUpEvent(_x: number, _y: number): void {
    // Not supported in the experimental lite release.
  }

  public stateMachinePostPointerDownEvent(_x: number, _y: number): void {
    // Not supported in the experimental lite release.
  }

  public stateMachinePostPointerMoveEvent(_x: number, _y: number): void {
    // Not supported in the experimental lite release.
  }

  public stateMachinePostPointerEnterEvent(_x: number, _y: number): void {
    // Not supported in the experimental lite release.
  }

  public stateMachinePostPointerExitEvent(_x: number, _y: number): void {
    // Not supported in the experimental lite release.
  }

  // ── Private: config and loading ─────────────────────────────────────────

  private _applyConfig(config: Omit<Config, 'canvas'>): void {
    this._autoplay = config.autoplay ?? false;
    this._loop = config.loop ?? false;
    this._loopCount = config.loopCount ?? 0;
    this._mode = config.mode ?? 'forward';
    this._speed = config.speed ?? 1;
    this._useFrameInterpolation = config.useFrameInterpolation ?? true;
    this._segment = config.segment && config.segment.length === 2 ? [config.segment[0], config.segment[1]] : null;
    this._marker = config.marker ?? '';
    this._layout = config.layout ?? null;
    this._requestedAnimationId = config.animationId;
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

    return new TextDecoder().decode(data);
  }

  private _loadFromSrc(src: string): void {
    this._fetchData(src)
      .then((data) => this._loadFromData(data))
      .catch((error) => this._dispatchError(`Failed to load animation data from URL: ${src}. ${error}`));
  }

  private _loadFromData(data: Data): void {
    if (!this.isReady) return;

    if (!this._canvas) {
      console.warn('[dotlottie-web] Cannot load animation without canvas. Call setCanvas() first.');

      return;
    }

    try {
      if (typeof data === 'string') {
        if (!isLottie(data)) {
          this._dispatchError(
            'Invalid Lottie JSON string: The provided string does not conform to the Lottie JSON format.',
          );

          return;
        }
        this._dotLottie = null;
        this._setAnimation(parseLottie(JSON.parse(data) as Record<string, unknown>), undefined, {
          applyAutoplay: true,
        });
      } else if (data instanceof ArrayBuffer) {
        if (!isDotLottie(data)) {
          this._dispatchError(
            'Invalid dotLottie ArrayBuffer: The provided ArrayBuffer does not conform to the dotLottie format.',
          );

          return;
        }
        this._loadDotLottie(data);
      } else if (typeof data === 'object') {
        if (!isLottie(data)) {
          this._dispatchError(
            'Invalid Lottie JSON object: The provided object does not conform to the Lottie JSON format.',
          );

          return;
        }
        this._dotLottie = null;
        this._setAnimation(parseLottie(data), undefined, { applyAutoplay: true });
      } else {
        this._dispatchError(
          `Unsupported data type for animation data. Expected:
          - string (Lottie JSON),
          - ArrayBuffer (dotLottie),
          - object (Lottie JSON).
          Received: ${typeof data}`,
        );
      }
    } catch (error) {
      this._dispatchError(`Failed to load animation data. ${error}`);
    }
  }

  private _loadDotLottie(buffer: ArrayBuffer): void {
    const container = parseDotLottie(buffer);

    let entry: DotLottieAnimation;

    try {
      entry = resolveDotLottieAnimation(container, this._requestedAnimationId);
    } catch (error) {
      // The WASM player tolerates an unknown animationId and plays the default
      // animation; match that instead of failing the whole load.
      if (!this._requestedAnimationId) throw error;

      console.warn(`[dotlottie-web] ${error}. Falling back to the default animation.`);
      entry = resolveDotLottieAnimation(container);
    }

    const data = resolvePackagedImageAssets(entry.data, container.files);
    const animation = parseLottie(data);

    this._dotLottie = container;

    registerPackagedFonts(container).then((fonts) => {
      if (this._destroyed) {
        unregisterPackagedFonts(fonts);

        return;
      }

      this._fonts.push(...fonts);

      // Re-render the current frame so text picks up the packaged fonts.
      if (fonts.length > 0 && this.isLoaded) {
        this._renderCurrentFrame({ frameEvent: false, renderEvent: false });
      }
    });

    this._setAnimation(animation, entry.id, { applyAutoplay: true });
  }

  private _setAnimation(
    animation: Animation,
    activeAnimationId: string | undefined,
    { applyAutoplay }: { applyAutoplay: boolean },
  ): void {
    this._animation = animation;
    this._activeAnimationId = activeAnimationId;
    this._completed = false;
    this._completedLoops = 0;
    this._lastRenderedFrame = null;
    this._direction = this._initialDirection();
    this._rawFrame = this._logicalStartFrame();

    if (IS_BROWSER) {
      this.resize();
    }

    setTimeout(() => this._eventManager.dispatch({ type: 'load' }), 0);
    setTimeout(() => this._eventManager.dispatch({ type: 'frame', currentFrame: this.currentFrame }), 0);

    this._renderCurrentFrame({ frameEvent: false, renderEvent: true });

    if (applyAutoplay) {
      this._state = 'stopped';

      if (this._autoplay) {
        this._state = 'playing';
        queueMicrotask(() => this._eventManager.dispatch({ type: 'play' }));
        this._startAnimationLoop();
      }
    } else if (this._state === 'playing') {
      this._startAnimationLoop();
    }

    if (IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      if (this._renderConfig.freezeOnOffscreen) {
        OffscreenObserver.observe(this._canvas, this);

        if (!isElementInViewport(this._canvas)) {
          this.freeze();
        }
      }

      if (this._renderConfig.autoResize) {
        CanvasResizeObserver.observe(this._canvas, this);
      }
    }
  }

  private _cleanupCanvas(): void {
    if (this._canvas && IS_BROWSER && this._canvas instanceof HTMLCanvasElement) {
      OffscreenObserver.unobserve(this._canvas);
      CanvasResizeObserver.unobserve(this._canvas);
    }
  }

  private _initializeCanvas(): void {
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
    }

    if (this.isLoaded) {
      this._renderCurrentFrame({ frameEvent: false, renderEvent: false });
    }
  }

  // ── Private: playback engine ────────────────────────────────────────────

  private _isBounceMode(): boolean {
    return this._mode === 'bounce' || this._mode === 'reverse-bounce';
  }

  private _initialDirection(): 1 | -1 {
    return this._mode === 'forward' || this._mode === 'bounce' ? 1 : -1;
  }

  private _playbackRange(): [number, number] {
    const total = this._animation?.duration ?? 0;
    const maxFrame = Math.max(0, total - 1);

    let start = 0;
    let end = maxFrame;

    const markerDef = this._marker ? this._animation?.markers?.find((m) => m.name === this._marker) : undefined;

    if (markerDef && this._animation) {
      start = markerDef.time - this._animation.inPoint;
      end = start + markerDef.duration;
    } else if (this._segment) {
      [start, end] = this._segment;
    }

    start = Math.max(0, Math.min(start, maxFrame));
    end = Math.max(0, Math.min(end, maxFrame));

    return start <= end ? [start, end] : [end, start];
  }

  private _logicalStartFrame(): number {
    const [start, end] = this._playbackRange();

    return this._initialDirection() === 1 ? start : end;
  }

  private _effectiveFrame(): number {
    return this._useFrameInterpolation ? this._rawFrame : Math.floor(this._rawFrame);
  }

  private _startAnimationLoop(): void {
    if (this._animationFrameId === null && this._animation && !this._isFrozen && this._state === 'playing') {
      this._animationFrameId = this._frameManager.requestAnimationFrame(this._boundAnimationLoop);
    }
  }

  private _stopAnimationLoop(): void {
    if (this._animationFrameId !== null) {
      this._frameManager.cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }
    this._lastFrameTime = null;
  }

  private _animationLoop(time: number): void {
    if (this._destroyed || this._state !== 'playing') {
      this._stopAnimationLoop();

      return;
    }

    try {
      const dt = this._lastFrameTime !== null ? time - this._lastFrameTime : 0;

      this._lastFrameTime = time;

      this._tick(dt);

      if (this._state === 'playing') {
        this._animationFrameId = this._frameManager.requestAnimationFrame(this._boundAnimationLoop);
      } else {
        this._stopAnimationLoop();
      }
    } catch (error) {
      console.error('Error in animation frame:', error);

      this._eventManager.dispatch({ type: 'renderError', error: error as unknown as Error });
    }
  }

  private _tick(deltaMs: number): void {
    const animation = this._animation;

    if (!animation || this._state !== 'playing') return;

    const [start, end] = this._playbackRange();
    const frameDelta = (deltaMs / 1000) * animation.frameRate * this._speed * this._direction;

    let frame = Math.max(start, Math.min(this._rawFrame, end)) + frameDelta;

    if (this._direction === 1 && frame >= end) {
      frame = this._handleBoundary(frame, start, end, 'upper');
    } else if (this._direction === -1 && frame <= start) {
      frame = this._handleBoundary(frame, start, end, 'lower');
    }

    this._rawFrame = Math.max(start, Math.min(frame, end));

    const effective = this._effectiveFrame();

    if (effective !== this._lastRenderedFrame) {
      this._renderCurrentFrame({ frameEvent: true, renderEvent: true });
    }
  }

  private _handleBoundary(frame: number, start: number, end: number, boundary: 'upper' | 'lower'): number {
    const overflow = boundary === 'upper' ? frame - end : start - frame;

    if (this._isBounceMode()) {
      // A bounce cycle completes when playback returns to its starting boundary.
      const completesCycle =
        (this._mode === 'bounce' && boundary === 'lower') || (this._mode === 'reverse-bounce' && boundary === 'upper');

      if (completesCycle && !this._tryLoop()) {
        return boundary === 'upper' ? end : start;
      }

      this._direction = this._direction === 1 ? -1 : 1;

      return boundary === 'upper' ? end - overflow : start + overflow;
    }

    if (!this._tryLoop()) {
      return boundary === 'upper' ? end : start;
    }

    return boundary === 'upper' ? start + overflow : end - overflow;
  }

  /**
   * Consumes one loop iteration. Returns true when playback wraps, false when
   * the animation completes (dispatching 'complete' and stopping playback).
   */
  private _tryLoop(): boolean {
    const canLoop = this._loop && (this._loopCount === 0 || this._completedLoops < this._loopCount);

    if (canLoop) {
      this._completedLoops += 1;

      const completedLoops = this._completedLoops;

      queueMicrotask(() => this._eventManager.dispatch({ type: 'loop', loopCount: completedLoops }));

      return true;
    }

    this._state = 'stopped';
    this._completed = true;

    queueMicrotask(() => this._eventManager.dispatch({ type: 'complete' }));

    return false;
  }

  // ── Private: drawing ────────────────────────────────────────────────────

  private _renderCurrentFrame({ frameEvent, renderEvent }: { frameEvent: boolean; renderEvent: boolean }): void {
    const animation = this._animation;
    const canvas = this._canvas;

    if (!animation || !canvas) return;

    const effective = this._effectiveFrame();

    this._lastRenderedFrame = effective;

    // RenderSurface targets have no drawing context; the lite renderer needs a real canvas.
    if (!('getContext' in canvas) || typeof canvas.getContext !== 'function') return;

    try {
      this._draw(animation, effective, canvas);
    } catch (error) {
      this._eventManager.dispatch({ type: 'renderError', error: error as unknown as Error });

      return;
    }

    if (frameEvent) {
      queueMicrotask(() => this._eventManager.dispatch({ type: 'frame', currentFrame: effective }));
    }

    if (renderEvent) {
      queueMicrotask(() => this._eventManager.dispatch({ type: 'render', currentFrame: effective }));
    }
  }

  private _draw(animation: Animation, frame: number, canvas: HTMLCanvasElement | OffscreenCanvas): void {
    const fit = this._layout?.fit ?? 'contain';
    const align = this._layout?.align ?? [0.5, 0.5];

    if (canvas.width <= 0 || canvas.height <= 0) {
      this._renderer.render(animation, frame, canvas);

      return;
    }

    const [destWidth, destHeight] = this._fitSize(fit, animation, canvas.width, canvas.height);

    // Fast path: the destination rect covers the whole canvas, render directly.
    if (Math.abs(destWidth - canvas.width) < 1 && Math.abs(destHeight - canvas.height) < 1) {
      this._renderer.render(animation, frame, canvas);

      return;
    }

    const buffer = this._getLayoutBuffer(Math.max(1, Math.round(destWidth)), Math.max(1, Math.round(destHeight)));

    if (!buffer) {
      // No offscreen surface available (e.g. Node without OffscreenCanvas): stretch-render.
      this._renderer.render(animation, frame, canvas);

      return;
    }

    this._renderer.render(animation, frame, buffer);

    const context = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;

    if (!context) return;

    const dx = (canvas.width - destWidth) * (align[0] ?? 0.5);
    const dy = (canvas.height - destHeight) * (align[1] ?? 0.5);

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (this._backgroundColor && !(IS_BROWSER && canvas instanceof HTMLCanvasElement)) {
      context.fillStyle = this._backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.drawImage(buffer as CanvasImageSource, dx, dy, destWidth, destHeight);
  }

  private _fitSize(
    fit: Layout['fit'],
    animation: Animation,
    canvasWidth: number,
    canvasHeight: number,
  ): [number, number] {
    const { height, width } = animation;

    if (width <= 0 || height <= 0) return [canvasWidth, canvasHeight];

    switch (fit) {
      case 'fill':
        return [canvasWidth, canvasHeight];
      case 'cover': {
        const scale = Math.max(canvasWidth / width, canvasHeight / height);

        return [width * scale, height * scale];
      }
      case 'none':
        return [width, height];
      case 'fit-width':
        return [canvasWidth, (height * canvasWidth) / width];
      case 'fit-height':
        return [(width * canvasHeight) / height, canvasHeight];
      default: {
        const scale = Math.min(canvasWidth / width, canvasHeight / height);

        return [width * scale, height * scale];
      }
    }
  }

  private _getLayoutBuffer(width: number, height: number): HTMLCanvasElement | OffscreenCanvas | null {
    if (this._layoutBuffer === null) {
      if (typeof OffscreenCanvas !== 'undefined') {
        this._layoutBuffer = new OffscreenCanvas(width, height);
      } else if (typeof document !== 'undefined') {
        this._layoutBuffer = document.createElement('canvas');
      } else {
        return null;
      }
    }

    if (this._layoutBuffer.width !== width) this._layoutBuffer.width = width;
    if (this._layoutBuffer.height !== height) this._layoutBuffer.height = height;

    return this._layoutBuffer;
  }

  private _get2dContext(): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null {
    const canvas = this._canvas;

    if (!canvas || !('getContext' in canvas) || typeof canvas.getContext !== 'function') return null;

    return canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
  }
}

// Compile-time check that the class also matches the DotLottie static surface.
const _staticsCheck: DotLottieStatics = DotLottieLite;

void _staticsCheck;
