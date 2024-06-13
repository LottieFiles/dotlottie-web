import type { Config } from '../dotlottie';
import type { Event as DotLottieEvent } from '../event-manager';

import workerString from './dotlottie.worker.js';

export interface WorkerMessage {
  id: string;
  method: WorkerMethod;
  params?: WorkerParams;
}

export type WorkerMethod =
  | 'create'
  | 'play'
  | 'pause'
  | 'stop'
  | 'destroy'
  | 'setSpeed'
  | 'setMode'
  | 'setFrame'
  | 'load'
  | 'resize'
  | 'setWasmUrl';

export interface WorkerParams {
  config?: Config;
  event?: { event: DotLottieEvent; id: string };
  frame?: number;
  height?: number;
  id?: string;
  mode?: string;
  speed?: number;
  url?: string;
  width?: number;
}

export interface WorkerResponse {
  error?: WorkerError;
  id: string;
  result?: unknown;
}

export interface WorkerError {
  code: number;
  data?: unknown;
  message: string;
}

export class WorkerManager {
  private readonly _workers: Map<string, Worker> = new Map();

  private readonly _animationWorkerMap: Map<string, string> = new Map();

  private _createWorker(): Worker {
    const blob = new Blob([workerString], { type: 'application/javascript' });

    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    return new Worker(URL.createObjectURL(blob), { type: 'module' });
  }

  public getWorker(workerId: string): Worker {
    if (!this._workers.has(workerId)) {
      this._workers.set(workerId, this._createWorker());
    }

    return this._workers.get(workerId) as Worker;
  }

  public assignAnimationToWorker(animationId: string, workerId: string): void {
    this._animationWorkerMap.set(animationId, workerId);
  }

  public unassignAnimationFromWorker(animationId: string): void {
    this._animationWorkerMap.delete(animationId);
  }

  public getWorkerForAnimation(animationId: string): Worker | undefined {
    const workerId = this._animationWorkerMap.get(animationId);

    return workerId ? this.getWorker(workerId) : undefined;
  }

  public sendMessage(workerId: string, message: WorkerMessage, transfer?: Transferable[]): void {
    this.getWorker(workerId).postMessage(message, transfer || []);
  }

  public sendMessageToAnimation(animationId: string, message: WorkerMessage): void {
    const worker = this.getWorkerForAnimation(animationId);

    if (worker) {
      worker.postMessage({ ...message, params: { ...message.params, id: animationId } });
    }
  }

  public terminateWorker(workerId: string): void {
    const worker = this._workers.get(workerId);

    if (worker) {
      worker.terminate();
      this._workers.delete(workerId);
    }
  }
}
