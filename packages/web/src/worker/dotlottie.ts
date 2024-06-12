import type { Config } from '../dotlottie';

import workerString from './dist/dotlottie.worker.js';
import type { WorkerMessage } from './dotlottie.worker.types';

function getCanvasSize(canvas: HTMLCanvasElement): { height: number; width: number } {
  const { height, width } = canvas.getBoundingClientRect();

  return { width: width * window.devicePixelRatio, height: height * window.devicePixelRatio };
}

export class DotLottieWorker {
  private readonly _worker: Worker;

  private readonly _id: string = '';

  private readonly _canvas: HTMLCanvasElement | null = null;

  public constructor(config: Config) {
    this._canvas = null;

    const blob = new Blob([workerString], { type: 'application/javascript' });

    let offscreen: OffscreenCanvas;

    if (config.canvas instanceof HTMLCanvasElement) {
      offscreen = config.canvas.transferControlToOffscreen();
      this._canvas = config.canvas;
    } else {
      offscreen = config.canvas;
    }

    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    this._worker = new Worker(URL.createObjectURL(blob), {
      type: 'module',
    });

    this._worker.onmessage = this._handleWorkerMessage.bind(this);

    this._id = Date.now().toString();

    this._worker.postMessage(
      {
        type: 'create',
        payload: {
          id: this._id,
          config: {
            ...config,
            canvas: offscreen,
          },
        },
      } as WorkerMessage,
      [offscreen],
    );
  }

  private _handleWorkerMessage(event: MessageEvent): void {
    // const data = event.data as WorkerMessage;
    if (event.data.type === 'load') {
      if (this._canvas instanceof HTMLCanvasElement) {
        const size = getCanvasSize(this._canvas);

        this.resizeTo(size.width, size.height);
      }
    }
  }

  public play(): void {
    this._worker.postMessage({
      type: 'play',
      payload: {
        id: this._id,
      },
    });
  }

  public pause(): void {
    this._worker.postMessage({
      type: 'pause',
      payload: { id: this._id },
    });
  }

  public stop(): void {
    this._worker.postMessage({ type: 'stop', payload: { id: this._id } });
  }

  public resizeTo(width: number, height: number): void {
    this._worker.postMessage({ type: 'resize', payload: { width, height, id: this._id } });
  }
}
