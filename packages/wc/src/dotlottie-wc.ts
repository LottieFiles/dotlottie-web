/**
 * Copyright 2023 Design Barn Inc.
 */

import { DotLottie } from '@lottiefiles/dotlottie-web';

export class DotLottieWC extends HTMLElement {
  private _dotLottieInstance: DotLottie | null;

  public constructor() {
    super();
    this._dotLottieInstance = null;
  }

  public get dotLottie(): DotLottie | null {
    return this._dotLottieInstance;
  }

  public connectedCallback(): void {
    this._initializeDotLottie();
  }

  public disconnectedCallback(): void {
    // eslint-disable-next-line no-warning-comments
    // TODO: this._dotLottieInstance.destroy();
  }

  private _initializeDotLottie(): void {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;

    if (this.getAttribute('width')) {
      canvas.width = Number(this.getAttribute('width'));
    }

    if (this.getAttribute('height')) {
      canvas.height = Number(this.getAttribute('height'));
    }

    const controls = this.controls();

    this.appendChild(canvas);
    this.appendChild(controls);

    const options = {
      canvas,
      autoplay: Boolean(this.hasAttribute('autoplay')),
      loop: Boolean(this.hasAttribute('loop')),
      speed: Number(this.getAttribute('speed') || 1),
      src: String(this.getAttribute('src')),
    };

    this._dotLottieInstance = new DotLottie(options);
  }

  public static get observedAttributes(): string[] {
    return ['loop', 'speed'];
  }

  public attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
    if (this._dotLottieInstance) {
      switch (name) {
        case 'loop':
          this._dotLottieInstance.setLoop(Boolean(newValue));
          break;

        case 'speed':
          this._dotLottieInstance.setSpeed(Number(newValue));
          break;

        default:
          break;
      }
    }
  }

  public controls(): HTMLDivElement {
    const container = document.createElement('div');

    container.style.position = 'absolute';

    const playButton = document.createElement('button');
    const pauseButton = document.createElement('button');

    playButton.style.display = 'none';
    pauseButton.style.display = 'none';

    playButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3.99996 2C3.26358 2 2.66663 2.59695 2.66663 3.33333V12.6667C2.66663 13.403 3.26358 14 3.99996 14H5.33329C6.06967 14 6.66663 13.403 6.66663 12.6667V3.33333C6.66663 2.59695 6.06967 2 5.33329 2H3.99996Z"
          fill="#20272C"
        />
        <path
          d="M10.6666 2C9.93025 2 9.33329 2.59695 9.33329 3.33333V12.6667C9.33329 13.403 9.93025 14 10.6666 14H12C12.7363 14 13.3333 13.403 13.3333 12.6667V3.33333C13.3333 2.59695 12.7363 2 12 2H10.6666Z"
          fill="#20272C"
        />
      </svg>
    `;

    pauseButton.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3.33337 3.46787C3.33337 2.52312 4.35948 1.93558 5.17426 2.41379L12.8961 6.94592C13.7009 7.41824 13.7009 8.58176 12.8961 9.05408L5.17426 13.5862C4.35948 14.0644 3.33337 13.4769 3.33337 12.5321V3.46787Z"
          fill="#20272C"
        />
      </svg>
    `;

    container.appendChild(playButton);
    container.appendChild(pauseButton);

    return container;
  }
}

if (!customElements.get('dotlottie-wc')) {
  customElements.define('dotlottie-wc', DotLottieWC);
}
