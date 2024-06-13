import type { Config, Mode } from '../dotlottie';
import type { EventType, EventListener } from '../event-manager';
import { EventManager } from '../event-manager';

import { WorkerManager } from './worker-manager';
import type { WorkerMessage, WorkerParams, WorkerResponse } from './worker-manager';

function getCanvasSize(canvas: HTMLCanvasElement): { height: number; width: number } {
  const { height, width } = canvas.getBoundingClientRect();

  return { width: width * window.devicePixelRatio, height: height * window.devicePixelRatio };
}

export class DotLottieWorker {
  private static readonly _workerManager = new WorkerManager();

  private readonly _eventManager = new EventManager();

  private readonly _id: string;

  private readonly _canvas: HTMLCanvasElement | null;

  public constructor(config: Config & { workerId?: string }) {
    this._canvas = null;
    let offscreen: OffscreenCanvas;

    if (config.canvas instanceof HTMLCanvasElement) {
      offscreen = config.canvas.transferControlToOffscreen();
      this._canvas = config.canvas;
    } else {
      offscreen = config.canvas;
    }

    this._id = this._generateUniqueId();

    const workerId = config.workerId || 'defaultWorker';

    const worker = DotLottieWorker._workerManager.getWorker(workerId);

    DotLottieWorker._workerManager.assignAnimationToWorker(this._id, workerId);

    const message: WorkerMessage = {
      method: 'create',
      params: { id: this._id, config: { ...config, canvas: offscreen } },
      id: this._generateUniqueId(),
    };

    DotLottieWorker._workerManager.sendMessage(workerId, message, [offscreen]);

    worker.addEventListener('message', this._handleWorkerEvent.bind(this));
  }

  private _generateUniqueId(): string {
    return `dotlottie_animation_${Math.random().toString(36).substr(2, 9)}`;
  }

  public play(): void {
    this._sendMessage('play');
  }

  public pause(): void {
    this._sendMessage('pause');
  }

  public stop(): void {
    this._sendMessage('stop');
  }

  public setSpeed(speed: number): void {
    this._sendMessage('setSpeed', { speed });
  }

  public setMode(mode: Mode): void {
    this._sendMessage('setMode', { mode });
  }

  public setFrame(frame: number): void {
    this._sendMessage('setFrame', { frame });
  }

  public load(_config: Omit<Config, 'canvas'>): void {
    // this._sendMessage('load', { config });
  }

  public resize(): void {
    const canvasElement = this._canvas;

    if (!canvasElement) return;

    const { height, width } = getCanvasSize(canvasElement);

    this._sendMessage('resize', { width, height });
  }

  public destroy(): void {
    this._sendMessage('destroy');
    DotLottieWorker._workerManager.unassignAnimationFromWorker(this._id);
  }

  private _sendMessage(method: WorkerMessage['method'], params?: WorkerParams): void {
    const message: WorkerMessage = {
      method,
      params: { ...params, id: this._id },
      id: this._generateUniqueId(),
    };

    DotLottieWorker._workerManager.sendMessageToAnimation(this._id, message);
  }

  private _handleWorkerEvent(event: MessageEvent<WorkerResponse>): void {
    const { data } = event;

    if (data.id !== this._id) return;

    console.log(event);
  }

  public addEventListener<T extends EventType>(type: T, listener: EventListener<T>): void {
    this._eventManager.addEventListener(type, listener);
  }

  public removeEventListener<T extends EventType>(type: T, listener?: EventListener<T>): void {
    this._eventManager.removeEventListener(type, listener);
  }
}
