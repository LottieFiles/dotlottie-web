import type { Config, DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import type { TemplateResult } from 'lit';
import { css, html, LitElement } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, state } from 'lit/decorators.js';

type DeclaredConfig = Omit<Config, 'animationId' | 'canvas' | 'data' | 'src'>;

export abstract class BaseDotLottieWC<T extends DotLottie | DotLottieWorker> extends LitElement {
  private _animationId?: string;

  private _loop: Config['loop'];

  private _loopCount: Config['loopCount'];

  private _autoplay: Config['autoplay'];

  private _speed: Config['speed'];

  private _segment: Config['segment'];

  private _mode: Config['mode'];

  private _marker: Config['marker'];

  private _backgroundColor: Config['backgroundColor'];

  private _renderConfig: Config['renderConfig'];

  private _useFrameInterpolation: Config['useFrameInterpolation'];

  private _themeId: Config['themeId'];

  private _isPlayerReady(): boolean {
    return this.dotLottie?.isReady ?? false;
  }

  @property({ type: String })
  public get animationId(): string | undefined {
    return this._isPlayerReady() ? this.dotLottie?.activeAnimationId : this._animationId;
  }

  public set animationId(value: string | undefined) {
    this._animationId = value;

    if (value && this.dotLottie && this.dotLottie.activeAnimationId !== value) {
      this.dotLottie.loadAnimation(value);
    }
  }

  @property({ type: String })
  public src: Config['src'];

  @property({ type: String })
  public data: Config['data'];

  @property({ type: Boolean })
  public get loop(): Config['loop'] {
    return this._isPlayerReady() ? this.dotLottie?.loop : this._loop;
  }

  public set loop(value: Config['loop']) {
    this._loop = value;
    this.dotLottie?.setLoop(value ?? false);
  }

  // Read is not delegated: dotLottie.loopCount counts completed loops, this is the configured maximum.
  @property({ type: Number })
  public get loopCount(): Config['loopCount'] {
    return this._loopCount;
  }

  public set loopCount(value: Config['loopCount']) {
    this._loopCount = value;
    this.dotLottie?.setLoopCount(value ?? 0);
  }

  @property({ type: Boolean })
  public get autoplay(): Config['autoplay'] {
    return this._isPlayerReady() ? this.dotLottie?.autoplay : this._autoplay;
  }

  public set autoplay(value: Config['autoplay']) {
    this._autoplay = value;
  }

  @property({ type: Number })
  public get speed(): Config['speed'] {
    return this._isPlayerReady() ? this.dotLottie?.speed : this._speed;
  }

  public set speed(value: Config['speed']) {
    this._speed = value;
    this.dotLottie?.setSpeed(value ?? 1);
  }

  @property({ type: Array })
  public get segment(): Config['segment'] {
    return this._isPlayerReady() ? this.dotLottie?.segment : this._segment;
  }

  public set segment(value: Config['segment']) {
    this._segment = value;

    if (!this.dotLottie) return;

    if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
      this.dotLottie.setSegment(value[0], value[1]);
    } else {
      this.dotLottie.resetSegment();
    }
  }

  @property({ type: String })
  public get mode(): Config['mode'] {
    return this._isPlayerReady() ? this.dotLottie?.mode : this._mode;
  }

  public set mode(value: Config['mode']) {
    this._mode = value;
    this.dotLottie?.setMode(value || 'forward');
  }

  @property({ type: String })
  public get marker(): Config['marker'] {
    return this._isPlayerReady() ? this.dotLottie?.marker : this._marker;
  }

  public set marker(value: Config['marker']) {
    this._marker = value;
    this.dotLottie?.setMarker(value ?? '');
  }

  @property({ type: String })
  public get backgroundColor(): Config['backgroundColor'] {
    return this._isPlayerReady() ? this.dotLottie?.backgroundColor : this._backgroundColor;
  }

  public set backgroundColor(value: Config['backgroundColor']) {
    this._backgroundColor = value;
    this.dotLottie?.setBackgroundColor(value ?? '');
  }

  @property({ type: Object })
  public get renderConfig(): Config['renderConfig'] {
    return this._isPlayerReady() ? this.dotLottie?.renderConfig : this._renderConfig;
  }

  public set renderConfig(value: Config['renderConfig']) {
    this._renderConfig = value;
    this.dotLottie?.setRenderConfig(value ?? {});
  }

  @property({
    type: Boolean,
    converter: {
      // Removal leaves the property undeclared so the player default is restored.
      fromAttribute: (value: string | null) => (value === null ? undefined : value !== 'false'),
    },
  })
  public get useFrameInterpolation(): Config['useFrameInterpolation'] {
    return this._isPlayerReady() ? this.dotLottie?.useFrameInterpolation : this._useFrameInterpolation;
  }

  public set useFrameInterpolation(value: Config['useFrameInterpolation']) {
    this._useFrameInterpolation = value;
    this.dotLottie?.setUseFrameInterpolation(value ?? true);
  }

  @property({ type: String })
  public get themeId(): Config['themeId'] {
    return this._isPlayerReady() ? this.dotLottie?.activeThemeId : this._themeId;
  }

  public set themeId(value: Config['themeId']) {
    this._themeId = value;
    this.dotLottie?.setTheme(value ?? '');
  }

  @property({ type: String })
  public workerId?: string;

  @property({ type: String })
  public stateMachineId: Config['stateMachineId'];

  @property({ type: Object })
  public stateMachineConfig: Config['stateMachineConfig'];

  @state()
  public dotLottie: T | null = null;

  public static override styles = css`
    :host {
      display: block;
      position: relative;
    }

    :host > canvas {
      width: 100%;
      height: 100%;
    }
  `;

  private _declaredConfig(): DeclaredConfig {
    return {
      loop: this._loop,
      loopCount: this._loopCount,
      autoplay: this._autoplay,
      speed: this._speed,
      segment: this._segment,
      marker: this._marker,
      mode: this._mode,
      renderConfig: this._renderConfig,
      useFrameInterpolation: this._useFrameInterpolation,
      themeId: this._themeId,
      backgroundColor: this._backgroundColor,
      stateMachineConfig: this.stateMachineConfig,
      stateMachineId: this.stateMachineId,
    };
  }

  private _init(): void {
    const canvas = document.createElement('canvas');

    this.shadowRoot?.appendChild(canvas);

    this.dotLottie = this._createDotLottieInstance({
      ...this._declaredConfig(),
      canvas,
      src: this.src,
      data: this.data,
      animationId: this._animationId,
      workerId: this.workerId,
    });
  }

  public override connectedCallback(): void {
    super.connectedCallback();
    this._init();
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks
   */
  public adoptedCallback(): void {
    this._init();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.dotLottie?.destroy();
    this.dotLottie = null;
    this.shadowRoot?.querySelector('canvas')?.remove();
  }

  public override attributeChangedCallback(name: string, old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, old, value);

    if (!this.dotLottie || old === value) {
      return;
    }

    if (name === 'src' && value) {
      this.dotLottie.load({
        ...this._declaredConfig(),
        src: value,
        data: this.data,
      });
    }

    if (name === 'data' && value) {
      this.dotLottie.load({
        ...this._declaredConfig(),
        src: this.src,
        data: value,
        animationId: this._animationId,
      });
    }

    if (name === 'statemachineid') {
      if (this.dotLottie.isLoaded) {
        if (value) {
          const smLoaded = this.dotLottie.stateMachineLoad(value);

          if (smLoaded) {
            this.dotLottie.stateMachineStart();
          }
        } else {
          this.dotLottie.stateMachineStop();
        }
      }
    }

    if (name === 'statemachineconfig') {
      this.dotLottie.stateMachineSetConfig(value ? JSON.parse(value) : null);
    }
  }

  protected abstract _createDotLottieInstance(config: Config & { workerId?: string }): T;

  public override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
