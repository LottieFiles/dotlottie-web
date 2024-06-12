import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import type { TemplateResult } from 'lit';
import { LitElement, html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, state } from 'lit/decorators.js';

export class DotLottieWC extends LitElement {
  @property({ type: String }) public src: Config['src'];

  @property({ type: String }) public data: Config['data'];

  @property({ type: Boolean }) public loop: Config['loop'];

  @property({ type: Boolean }) public autoplay: Config['autoplay'];

  @property({ type: Number }) public speed: Config['speed'];

  @property({ type: Array }) public segment: Config['segment'];

  @property({ type: String }) public mode: Config['mode'];

  @property({ type: String }) public backgroundColor: Config['backgroundColor'];

  @property({ type: Object }) public renderConfig: Config['renderConfig'];

  @property({ type: Boolean }) public useFrameInterpolation: Config['useFrameInterpolation'];

  @state() public dotLottie: DotLottie | null = null;

  private readonly _intersectionObserver: IntersectionObserver;

  private readonly _resizeObserver: ResizeObserver;

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
    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (this.dotLottie) {
            if (entry.isIntersecting) {
              this.dotLottie.unfreeze();
            } else {
              this.dotLottie.freeze();
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    this._resizeObserver = new ResizeObserver((entries) => {
      if (this.dotLottie && entries[0]) {
        this.dotLottie.resize();
      }
    });

    window.addEventListener('visibilitychange', () => {
      if (this.dotLottie) {
        if (document.visibilityState === 'visible') {
          this.dotLottie.unfreeze();
        } else {
          this.dotLottie.freeze();
        }
      }
    });
  }

  public override firstUpdated(): void {
    if (this.dotLottie) {
      this.dotLottie.destroy();
      this.dotLottie = null;
    }

    const canvas = this.shadowRoot?.querySelector('canvas');

    if (canvas) {
      this.dotLottie = new DotLottie({
        canvas: canvas as HTMLCanvasElement,
        src: this.src,
        data: this.data,
        loop: this.loop,
        autoplay: this.autoplay,
        speed: this.speed,
        segment: this.segment,
        mode: this.mode,
        renderConfig: this.renderConfig,
        useFrameInterpolation: this.useFrameInterpolation,
      });
      this._intersectionObserver.observe(canvas);
      this._resizeObserver.observe(canvas);
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.dotLottie) {
      this.dotLottie.destroy();
      this.dotLottie = null;
    }

    this._intersectionObserver.disconnect();
    this._resizeObserver.disconnect();
  }

  public override render(): TemplateResult {
    return html`<canvas part="canvas"></canvas>`;
  }
}

/*
  Define the custom element if it hasn't been defined already.
  This is to prevent errors when using multiple versions of the dotlottie-wc on the same page.
*/
if (!customElements.get('dotlottie-wc')) {
  customElements.define('dotlottie-wc', DotLottieWC);
}

export const setWasmUrl = (url: string): void => {
  DotLottie.setWasmUrl(url);
};
