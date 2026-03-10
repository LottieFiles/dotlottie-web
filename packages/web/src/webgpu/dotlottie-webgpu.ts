import { IS_BROWSER, PACKAGE_NAME, PACKAGE_VERSION } from '../constants';
import type { DotLottiePlayerWasm as CoreDotLottiePlayerWasm } from '../core/dotlottie-player';
import { DotLottie } from '../dotlottie';
import type { WebGPUConfig } from '../types';
import { getDefaultDPR } from '../utils';
import { createWasmLoader } from '../wasm-loader';

import init, { DotLottiePlayerWasm } from './dotlottie-player';

const webGPUWasmLoader = createWasmLoader(
  init,
  `https://cdn.jsdelivr.net/npm/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/webgpu/dotlottie-player.wasm`,
  `https://unpkg.com/${PACKAGE_NAME}@${PACKAGE_VERSION}/dist/webgpu/dotlottie-player.wasm`,
);

export class DotLottieWebGPU extends DotLottie {
  private _gpuDevice: GPUDevice | null = null;

  private _gpuContext: GPUCanvasContext | null = null;

  private _deviceOwned: boolean = false;

  private readonly _userDevice: GPUDevice | undefined;

  public constructor(config: WebGPUConfig) {
    super(config);
    this._userDevice = config.device;
  }

  protected override async _initWasm(): Promise<void> {
    await webGPUWasmLoader.load();

    // Auto-initialize GPUDevice if user didn't provide one
    if (!this._userDevice) {
      if (!navigator.gpu) {
        throw new Error('WebGPU is not supported in this browser.');
      }

      const adapter = await navigator.gpu.requestAdapter();

      if (!adapter) {
        throw new Error('Failed to get WebGPU adapter.');
      }

      const device = await adapter.requestDevice();

      // Listen for device loss to aid debugging
      device.lost.then((info) => {
        console.error(`[dotlottie-web] WebGPU device lost: ${info.reason} — ${info.message}`);
      });

      this._gpuDevice = device;
      this._deviceOwned = true;
    } else {
      this._gpuDevice = this._userDevice;
      this._deviceOwned = false;
    }
  }

  protected override _createCore(): CoreDotLottiePlayerWasm {
    return new DotLottiePlayerWasm() as unknown as CoreDotLottiePlayerWasm;
  }

  protected override _onCoreCreated(): void {
    if (!this._canvas || !this._dotLottieCore || !this._gpuDevice) return;

    this._setupGpuContext();
  }

  private _setupGpuContext(): void {
    if (!this._canvas || !this._dotLottieCore || !this._gpuDevice) return;

    const canvas = this._canvas as HTMLCanvasElement;

    // Set correct pixel dimensions BEFORE creating GPU context
    if (IS_BROWSER) {
      const dpr = this._renderConfig.devicePixelRatio || getDefaultDPR();
      const { width: cssW, height: cssH } = canvas.getBoundingClientRect();

      if (cssW !== 0 && cssH !== 0) {
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
      }
    }

    const gpuCtx = canvas.getContext('webgpu') as GPUCanvasContext | null;

    if (!gpuCtx) {
      throw new Error('Failed to get WebGPU canvas context.');
    }

    const format = navigator.gpu.getPreferredCanvasFormat();

    gpuCtx.configure({
      device: this._gpuDevice,
      format,
      alphaMode: 'premultiplied',
    });

    this._gpuContext = gpuCtx;

    const core = this._dotLottieCore as unknown as DotLottiePlayerWasm;

    core.set_webgpu_device(this._gpuDevice);
    core.set_webgpu_surface(gpuCtx);
  }

  public override resize(): void {
    // Reconfigure the GPU surface after canvas dimension change
    if (this._gpuContext && this._gpuDevice && this._canvas) {
      const canvas = this._canvas as HTMLCanvasElement;
      const dpr = this._renderConfig.devicePixelRatio || getDefaultDPR();
      const { width: cssW, height: cssH } = canvas.getBoundingClientRect();

      if (cssW !== 0 && cssH !== 0) {
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
      }

      this._gpuContext.configure({
        device: this._gpuDevice,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: 'premultiplied',
      });

      if (this._dotLottieCore) {
        const resized = this._dotLottieCore.resize(canvas.width, canvas.height);

        if (resized) {
          this._dotLottieCore.render();
        }
      }

      return;
    }

    super.resize();
  }

  protected override _draw(): void {
    // No-op: tick() renders directly to the GPU surface
  }

  protected override _setupRendererOnCanvas(): void {
    // Reset 2D context ref (not used for WebGPU)
    this._context = null;

    if (this._gpuContext) {
      this._gpuContext.unconfigure();
      this._gpuContext = null;
    }

    if (!this._canvas || !this._dotLottieCore || !this._gpuDevice) return;

    this._setupGpuContext();
  }

  public override destroy(): void {
    if (this._gpuContext) {
      this._gpuContext.unconfigure();
      this._gpuContext = null;
    }

    // Free the WASM core while the GPU device is still alive, so WASM
    // cleanup code can release GPU resources without hitting a destroyed device.
    super.destroy();

    if (this._deviceOwned && this._gpuDevice) {
      this._gpuDevice.destroy();
    }

    this._gpuDevice = null;
  }

  public get device(): GPUDevice | null {
    return this._gpuDevice;
  }

  public static override setWasmUrl(url: string): void {
    webGPUWasmLoader.setWasmUrl(url);
  }
}
