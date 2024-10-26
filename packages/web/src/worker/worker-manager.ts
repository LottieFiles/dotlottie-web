// resolved to a Worker constructor by plugin-inline-worker
import WebWorker from './dotlottie.worker?worker&inline';
import type { MethodParamsMap, RpcRequest } from './types';

/**
 * The WorkerManager class is responsible for managing web workers for dotLottie animations.
 * It provides methods to create, retrieve, assign, unassign, send messages to, and terminate workers.
 *
 * @public
 */
export class WorkerManager {
  /**
   * A map that holds the workers, keyed by their unique worker IDs.
   */
  private readonly _workers = new Map<string, Worker>();

  /**
   * A map that associates animation IDs with worker IDs.
   */
  private readonly _animationWorkerMap = new Map<string, string>();

  /**
   * Retrieves a worker by its ID. If the worker does not exist, it creates a new one.
   * @param workerId - The unique identifier for the worker.
   * @returns The Worker instance associated with the given workerId.
   */
  public getWorker(workerId: string): Worker {
    if (!this._workers.has(workerId)) {
      this._workers.set(workerId, new WebWorker());
    }

    return this._workers.get(workerId) as Worker;
  }

  /**
   * Assigns an animation to a specific worker by their IDs.
   * @param animationId - The unique identifier for the animation.
   * @param workerId - The unique identifier for the worker.
   *
   * @public
   */
  public assignAnimationToWorker(animationId: string, workerId: string): void {
    this._animationWorkerMap.set(animationId, workerId);
  }

  /**
   * Unassigns an animation from a worker by the animation's ID.
   * @param animationId - The unique identifier for the animation.
   *
   * @public
   */
  public unassignAnimationFromWorker(animationId: string): void {
    this._animationWorkerMap.delete(animationId);
  }

  /**
   * Sends a message to a worker.
   * @param workerId - The unique identifier for the worker.
   * @param message - The message to be sent, conforming to the RpcRequest type.
   * @param transfer - Optional array of Transferable objects to be transferred.
   *
   * @public
   */
  public sendMessage(workerId: string, message: RpcRequest<keyof MethodParamsMap>, transfer?: Transferable[]): void {
    this.getWorker(workerId).postMessage(message, transfer || []);
  }

  /**
   * Terminates a worker and removes it from the internal map.
   * @param workerId - The unique identifier for the worker.
   *
   * @public
   */
  public terminateWorker(workerId: string): void {
    const worker = this._workers.get(workerId);

    if (worker) {
      worker.terminate();
      this._workers.delete(workerId);
    }
  }
}
