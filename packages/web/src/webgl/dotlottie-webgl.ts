import { IS_BROWSER, PACKAGE_NAME, PACKAGE_VERSION } from '../constants';
import type { DotLottiePlayerWasm as CoreDotLottiePlayerWasm } from '../core/dotlottie-player';
import { DotLottie } from '../dotlottie';
import type { WebGLConfig } from '../types';
import { getDefaultDPR } from '../utils';
import { createWasmLoader } from '../wasm-loader';

import init, { DotLottiePlayerWasm } from './dotlottie-player';

const webGLWasmLoader = createWasmLoader(
  init,
  `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/webgl/dotlottie-player.wasm`,
  `https://unpkg.com/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/webgl/dotlottie-player.wasm`,
);

export class DotLottieWebGL extends DotLottie {
  // biome-ignore lint/complexity/noUselessConstructor: narrows canvas to HTMLCanvasElement (WebGLConfig vs Config)
  public constructor(config: WebGLConfig) {
    super(config);
  }

  protected override async _initWasm(): Promise<void> {
    return webGLWasmLoader.load();
  }

  protected override _createCore(): CoreDotLottiePlayerWasm {
    return new DotLottiePlayerWasm() as unknown as CoreDotLottiePlayerWasm;
  }

  protected override _onCoreCreated(): void {
    if (!this._canvas || !this._dotLottieCore) return;

    const canvas = this._canvas as HTMLCanvasElement;

    // Set correct pixel dimensions BEFORE creating GL context,
    // matching the reference implementation pattern.
    if (IS_BROWSER) {
      const dpr = this._renderConfig.devicePixelRatio || getDefaultDPR();
      const { width: cssW, height: cssH } = canvas.getBoundingClientRect();

      if (cssW !== 0 && cssH !== 0) {
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
      }
    }

    const gl = canvas.getContext('webgl2');

    if (!gl) {
      throw new Error('Failed to get WebGL2 context. Ensure the browser supports WebGL2.');
    }

    (this._dotLottieCore as unknown as DotLottiePlayerWasm).set_webgl_context(gl);
  }

  protected override _draw(): void {
    // No-op: tick() renders directly to the GL framebuffer
  }

  protected override _setupRendererOnCanvas(): void {
    this._context = null;

    if (!this._canvas || !this._dotLottieCore) return;

    const canvas = this._canvas as HTMLCanvasElement;

    if (IS_BROWSER) {
      const dpr = this._renderConfig.devicePixelRatio || getDefaultDPR();
      const { width: cssW, height: cssH } = canvas.getBoundingClientRect();

      if (cssW !== 0 && cssH !== 0) {
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
      }
    }

    const gl = canvas.getContext('webgl2');

    if (gl) {
      (this._dotLottieCore as unknown as DotLottiePlayerWasm).set_webgl_context(gl);
    }
  }

  public static override setWasmUrl(url: string): void {
    webGLWasmLoader.setWasmUrl(url);
  }
}
