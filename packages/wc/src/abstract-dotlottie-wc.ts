import type { Config, DotLottie, DotLottieWorker, Mode } from '@lottiefiles/dotlottie-web';
import type { TemplateResult } from 'lit';
import { LitElement, html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, state } from 'lit/decorators.js';

export abstract class AbstractDotLottieWC<T extends DotLottie | DotLottieWorker> extends LitElement {
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

  public override connectedCallback(): void {
    super.connectedCallback();
    this._initializeCanvas();
    this._initializeDotLottie();
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.dotLottie) {
      this.dotLottie.destroy();
      this.dotLottie = null;
    }
  }

  public override attributeChangedCallback(name: string, old: string | null, value: string | null): void {
    super.attributeChangedCallback(name, old, value);

    if (!this.dotLottie || !this.dotLottie.isReady || old === value) {
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
        mode: this.mode,
        renderConfig: this.renderConfig,
        useFrameInterpolation: this.useFrameInterpolation,
        themeId: this.themeId,
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
        mode: this.mode,
        renderConfig: this.renderConfig,
        useFrameInterpolation: this.useFrameInterpolation,
        themeId: this.themeId,
      });
    }
  }

  private _initializeCanvas(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    if (!this.shadowRoot?.querySelector('canvas')) {
      const canvas = document.createElement('canvas');

      this.shadowRoot?.appendChild(canvas);
    }
  }

  private _initializeDotLottie(): void {
    this.dotLottie = this._createDotLottieInstance({
      canvas: this.shadowRoot?.querySelector('canvas') as HTMLCanvasElement,
      src: this.src,
      data: this.data,
      loop: this.loop,
      autoplay: this.autoplay,
      speed: this.speed,
      segment: this.segment,
      mode: this.mode,
      renderConfig: this.renderConfig,
      useFrameInterpolation: this.useFrameInterpolation,
      themeId: this.themeId,

      workerId: this.workerId,
    });
  }

  protected abstract _createDotLottieInstance(config: Config & { workerId?: string }): T;

  public override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
