import type { MethodParamsMap, RpcRequest } from './types';

export class WorkerManager {
  private readonly _workers = new Map<string, Worker>();

  private readonly _animationWorkerMap = new Map<string, string>();

  public getWorker(workerId: string, workerUrl: string): Worker {
    if (!this._workers.has(workerId)) {
      this._workers.set(workerId, new Worker(workerUrl));
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
    const worker = this._workers.get(workerId);

    if (worker) {
      worker.postMessage(message, transfer || []);
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
