import type { Config, DotLottie, DotLottieWorker, Mode } from '@lottiefiles/dotlottie-web';
import type { TemplateResult } from 'lit';
import { LitElement, html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, state } from 'lit/decorators.js';

export abstract class BaseDotLottieWC<T extends DotLottie | DotLottieWorker> extends LitElement {
  @property({ type: String })
  public animationId?: string;

  @property({ type: String })
  public src: Config['src'];

  @property({ type: String })
  public data: Config['data'];

  @property({ type: Boolean })
  public loop: Config['loop'];

  @property({ type: Boolean })
  public autoplay: Config['autoplay'];

  @property({ type: Number })
  public speed: Config['speed'];

  @property({ type: Array })
  public segment: Config['segment'];

  @property({ type: String })
  public mode: Config['mode'];

  @property({ type: String })
  public marker: Config['marker'];

  @property({ type: String })
  public backgroundColor: Config['backgroundColor'];

  @property({ type: Object })
  public renderConfig: Config['renderConfig'];

  @property({ type: Boolean })
  public useFrameInterpolation: Config['useFrameInterpolation'];

  @property({ type: String })
  public themeId: Config['themeId'];

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

  public constructor() {
    super();
  }

  private _init(): void {
    const canvas = document.createElement('canvas');

    this.shadowRoot?.appendChild(canvas);

    this.dotLottie = this._createDotLottieInstance({
      canvas,
      src: this.src,
      data: this.data,
      loop: this.loop,
      autoplay: this.autoplay,
      speed: this.speed,
      segment: this.segment,
      marker: this.marker,
      mode: this.mode,
      renderConfig: this.renderConfig,
      useFrameInterpolation: this.useFrameInterpolation,
      themeId: this.themeId,
      animationId: this.animationId,
      stateMachineConfig: this.stateMachineConfig,
      stateMachineId: this.stateMachineId,
      backgroundColor: this.backgroundColor,
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

    if (name === 'segment') {
      const segment = JSON.parse(value ?? '[]');

      if (
        Array.isArray(segment) &&
        segment.length === 2 &&
        typeof segment[0] === 'number' &&
        typeof segment[1] === 'number'
      ) {
        this.dotLottie.setSegment(segment[0], segment[1]);
      } else {
        // reset segment
        // Consider adding this function to the core dotlottie-web library
        this.dotLottie.setSegment(0, this.dotLottie.totalFrames);
      }
    }

    if (name === 'mode') {
      this.dotLottie.setMode(value ? (value as Mode) : 'forward');
    }

    if (name === 'speed') {
      this.dotLottie.setSpeed(value ? Number(value) : 1);
    }

    if (name === 'loop') {
      this.dotLottie.setLoop(Boolean(value));
    }

    if (name === 'useframeinterpolation') {
      this.dotLottie.setUseFrameInterpolation(typeof value === 'string' ? JSON.parse(value) : true);
    }

    if (name === 'themeid') {
      this.dotLottie.setTheme(value ?? '');
    }

    if (name === 'backgroundcolor') {
      this.dotLottie.setBackgroundColor(value ?? '');
    }

    if (name === 'renderconfig') {
      this.dotLottie.setRenderConfig(JSON.parse(value ?? '{}'));
    }

    if (name === 'animationid' && value) {
      this.dotLottie.loadAnimation(value);
    }

    if (name === 'marker') {
      this.dotLottie.setMarker(value ?? '');
    }

    if (name === 'src' && value) {
      this.dotLottie.load({
        src: value,
        data: this.data,
        loop: this.loop,
        autoplay: this.autoplay,
        speed: this.speed,
        segment: this.segment,
        marker: this.marker,
        mode: this.mode,
        renderConfig: this.renderConfig,
        useFrameInterpolation: this.useFrameInterpolation,
        themeId: this.themeId,
        stateMachineConfig: this.stateMachineConfig,
        stateMachineId: this.stateMachineId,
        backgroundColor: this.backgroundColor,
      });
    }

    if (name === 'data' && value) {
      this.dotLottie.load({
        src: this.src,
        data: value,
        loop: this.loop,
        autoplay: this.autoplay,
        speed: this.speed,
        segment: this.segment,
        marker: this.marker,
        mode: this.mode,
        renderConfig: this.renderConfig,
        useFrameInterpolation: this.useFrameInterpolation,
        themeId: this.themeId,
        animationId: this.animationId,
        stateMachineConfig: this.stateMachineConfig,
        stateMachineId: this.stateMachineId,
        backgroundColor: this.backgroundColor,
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
