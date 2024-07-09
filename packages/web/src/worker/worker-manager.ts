// This file would be inlined as a string, checkout the tsup config in the root of the project
import MyWorker from './dotlottie.worker?worker&inline';
import type { MethodParamsMap, RpcRequest } from './types.js';

export class WorkerManager {
  private readonly _workers: Map<string, Worker> = new Map();

  private readonly _animationWorkerMap: Map<string, string> = new Map();

  private _createWorker(_workerName: string): Worker {
    return new MyWorker();
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
