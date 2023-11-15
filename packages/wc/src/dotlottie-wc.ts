/**
 * Copyright 2023 Design Barn Inc.
 */

// @ts-nocheck

import { DotLottie } from '@lottiefiles/dotlottie-web';
import type { CSSResult, PropertyDeclarations, TemplateResult, PropertyValues } from 'lit';
import { LitElement, html, css } from 'lit';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { property, state } from 'lit/decorators.js';

import { PlayIcon, PauseIcon, ToggleLoopIcon } from './assets/icons';

export class DotLottieWC extends LitElement {
  private _dotLottie: DotLottie | null = null;

  public get dotLottie(): DotLottie | null {
    return this._dotLottie;
  }

  public static override get styles(): CSSResult {
    return css`
      @font-face {
        font-family: 'Karla';
        font-weight: regular;
        src: url('./assets/Karla-regular.woff') format('woff');
      }

      * {
        box-sizing: border-box;
      }

      :host {
        --dotlottie-wc-controls-height: 35px;
        --dotlottie-wc-controls-background-color: transparent;
        --dotlottie-wc-controls-hover-background-color: #f3f6f8;
        --dotlottie-wc-controls-icon-color: #20272c;
        --dotlottie-wc-controls-icon-hover-color: #f3f6f8;
        --dotlottie-wc-controls-icon-active-color: #00ddb3;
        --dotlottie-wc-controls-seeker-track-color: #00ddb3;
        --dotlottie-wc-seeker-accent-color: #00c1a2;
        ----dotlottie-wc-controls-seeker-thumb-color: #00c1a2;

        --dotlottie-wc-controls-seeker-background-color: var(--dotlottie-wc-controls-seeker-track-color);
        --dotlottie-wc-controls-seeker-thumb-background-color: var(----dotlottie-wc-controls-seeker-thumb-color);
        --dotlottie-wc-controls-seeker-thumb-hover-background-color: var(--dotlottie-wc-seeker-accent-color);

        display: block;
        width: 100%;
        height: 100%;

        font-family: 'Karla', sans-serif;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      canvas {
        width: 100%;
        height: 100%;
      }

      .dotlottie-wc__controls {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--dotlottie-wc-controls-height);
        background-color: var(--dotlottie-wc-controls-background-color);
      }

      .dotlottie-wc__controls__button {
        color: var(--dotlottie-wc-controls-icon-color);
        cursor: pointer;
        background: none;
        border: 0px;
        border-radius: 4px;
        padding: 4px;
        outline: none;
        width: 24px;
        height: 24px;
        align-items: center;
        display: flex;
      }

      .dotlottie-wc__controls__button:hover {
        background-color: var(--dotlottie-wc-controls-icon-hover-color) !important;
        border-style: solid;
        border-radius: 2px;
      }

      .dotlottie-wc__controls__button--play {
        margin-right: 8px;
      }

      .dotlottie-wc__controls__button--loop {
        margin-left: 8px;
      }

      .dotlottie-wc__controls__button--loop--active {
        color: var(--dotlottie-wc-controls-icon-active-color) !important;
      }

      .dotlottie-wc__controls__button:focus-visible {
        outline: 2px solid var(--dotlottie-wc-controls-icon-active-color);
        border-radius: 4px;
        box-sizing: border-box;
      }

      .dotlottie-wc__controls__button svg {
        width: 16px;
        height: 16px;
      }

      .dotlottie-wc__controls__seeker {
        height: 4px;
        width: 95%;
        outline: none;
        appearance: none;
        -moz-apperance: none;
        border-radius: 9999px;
        cursor: pointer;
        background-image: linear-gradient(
          to right,
          rgb(0, 221, 179) calc(var(--seeker) * 1%),
          rgb(217, 224, 230) calc(var(--seeker) * 1%)
        );
      }

      .dotlottie-wc__controls__seeker:focus-visible {
        outline: 2px solid var(--dotlottie-wc-controls-seeker-track-color);
        border-radius: 4px;
        box-sizing: border-box;
      }

      .dotlottie-wc__controls__seeker::-webkit-slider-runnable-track {
        width: 100%;
        height: 5px;
        cursor: pointer;
        background-color: transparent;
      }

      .dotlottie-wc__controls__seeker::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: var(--dotlottie-wc-controls-seeker-thumb-background-color);
        cursor: pointer;
        margin-top: -5px;
      }

      .dotlottie-wc__controls__seeker:focus-visible::-webkit-slider-thumb {
        background: var(--dotlottie-wc-controls-seeker-thumb-background-color);
        outline: 2px solid var(--dotlottie-wc-controls-seeker-track-color);
        border: 1.5px solid #ffffff;
      }

      .dotlottie-wc__controls__seeker:hover::-webkit-slider-thumb {
        background: var(--dotlottie-wc-controls-seeker-thumb-hover-background-color);
      }

      .dotlottie-wc__controls__seeker::-moz-range-thumb {
        appearance: none;
        height: 16px;
        width: 16px;
        border-radius: 50%;
        background: var(--dotlottie-wc-controls-seeker-thumb-background-color);
        cursor: pointer;
        margin-top: -5px;
        border-color: transparent;
      }

      .dotlottie-wc__error {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
      }
    `;
  }

  public static override get properties(): PropertyDeclarations {
    return {
      // props
      src: { type: String },
      loop: { type: Boolean },
      autoplay: { type: Boolean },
      speed: { type: Number },
      controls: { type: Boolean },
      width: { type: Number },
      height: { type: Number },

      // state
      _seeker: { type: Number, state: true },
      _error: { type: String, state: true },
      _playerState: { type: String, state: true },
    };
  }

  public override firstUpdated(): void {
    this.width = this.width || 300;
    this.height = this.height || 300;
    this._seeker = 0;

    const canvas = this.shadowRoot?.querySelector('canvas');

    if (canvas) {
      this._dotLottie = new DotLottie({
        canvas,
        loop: this.loop,
        autoplay: this.autoplay,
        speed: this.speed,
        src: this.src,
      });

      this._dotLottie.addEventListener('loadError', ({ error }) => {
        this._error = error;
      });

      this._dotLottie.addEventListener('load', () => {
        this._error = null;
      });

      this._dotLottie.addEventListener('frame', ({ currentFrame }) => {
        const totalFrames = this._dotLottie?.totalFrames;

        if (totalFrames) {
          this._seeker = (currentFrame / totalFrames) * 100;
        }
      });

      this._dotLottie.addEventListener('play', () => {
        this._playerState = 'playing';
      });

      this._dotLottie.addEventListener('pause', () => {
        this._playerState = 'paused';
      });

      this._dotLottie.addEventListener('stop', () => {
        this._playerState = 'stopped';
      });

      this._dotLottie.addEventListener('complete', () => {
        this._playerState = 'stopped';
      });
    }
  }

  public override disconnectedCallback(): void {
    if (this._dotLottie) {
      this._dotLottie.destroy();
      this._dotLottie = null;
    }
  }

  public override updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('loop')) {
      this._dotLottie?.setLoop(this.loop);
    }

    if (changedProperties.has('speed')) {
      this._dotLottie?.setSpeed(this.speed);
    }
  }

  private _onSeekValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    const totalFrames = this._dotLottie?.totalFrames;

    if (totalFrames) {
      this._dotLottie?.setFrame((totalFrames / 100) * value);
    }
  }

  private _onSeekMouseDown(): void {
    this._dotLottie?.pause();
  }

  protected override renderControls(): TemplateResult {
    const isPlaying = this._playerState === 'playing';

    return html`<div class="dotlottie-wc__controls">
      <button
        aria-label="Play animation"
        @click="${(): void => {
          if (isPlaying) {
            this._dotLottie?.pause();
          } else {
            this._dotLottie?.play();
          }
        }}"
        class="dotlottie-wc__controls__button dotlottie-wc__controls__button--play"
      >
        ${isPlaying ? PauseIcon : PlayIcon}
      </button>
      <input
        class="dotlottie-wc__controls__seeker"
        type="range"
        min="0"
        max="100"
        .value=${this._seeker}
        @input=${(event: Event): void => this._onSeekValueChange(event)}
        @mousedown=${(): void => this._onSeekMouseDown()}
        aria-valuemin="1"
        aria-valuemax="100"
        role="slider"
        aria-valuenow=${this._seeker}
        aria-label="Seeker control"
        style="--seeker: ${this._seeker}"
      />
      <button
        aria-label="Toggle loop"
        @click="${(): void => (this.loop = !this.loop)}"
        class="dotlottie-wc__controls__button dotlottie-wc__controls__button--loop ${this.loop
          ? 'dotlottie-wc__controls__button--loop--active'
          : ''}"
      >
        ${ToggleLoopIcon}
      </button>
    </div>`;
  }

  private _renderError(): TemplateResult {
    return html`<div role="alert" class="dotlottie-wc__error" aria-label="Error loading animation">
      ${this._error}
    </div>`;
  }

  private _renderCanvas(): TemplateResult {
    return html`<canvas width="${this.width}" height="${this.height}"></canvas>`;
  }

  protected override render(): TemplateResult {
    if (this._error) {
      return this._renderError();
    }

    return html` ${this._renderCanvas()} ${this.controls ? this.renderControls() : ''}`;
  }
}

if (!customElements.get('dotlottie-wc')) {
  customElements.define('dotlottie-wc', DotLottieWC);
}
