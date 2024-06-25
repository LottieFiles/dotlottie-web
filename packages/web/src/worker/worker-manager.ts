// This file would be inlined as a string, checkout the tsup config in the root of the project
import workerString from './dotlottie.worker.js';
import type { MethodParamsMap, RpcRequest } from './types.js';

export class WorkerManager {
  private readonly _workers: Map<string, Worker> = new Map();

  private readonly _animationWorkerMap: Map<string, string> = new Map();

  private _createWorker(workerName: string): Worker {
    const blob = new Blob([workerString], { type: 'application/javascript' });

    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    return new Worker(URL.createObjectURL(blob), { type: 'module', name: workerName });
  }

  public getWorker(workerId: string): Worker {
    if (!this._workers.has(workerId)) {
      this._workers.set(workerId, this._createWorker(workerId));
    }

    return this._workers.get(workerId) as Worker;
  }

  public assignAnimationToWorker(animationId: string, workerId: string): void {
    this._animationWorkerMap.set(animationId, workerId);
  }

  public unassignAnimationFromWorker(animationId: string): void {
    this._animationWorkerMap.delete(animationId);
  }

  public sendMessage(workerId: string, message: RpcRequest<keyof MethodParamsMap>, transfer?: Transferable[]): void {
    this.getWorker(workerId).postMessage(message, transfer || []);
  }

  public terminateWorker(workerId: string): void {
    const worker = this._workers.get(workerId);

    if (worker) {
      worker.terminate();
      this._workers.delete(workerId);
    }
  }
}
