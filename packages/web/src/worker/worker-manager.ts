// resolved to a Worker constructor by plugin-inline-worker
import DotLottieWebWorker from './dotlottie.worker?worker&inline';
import type { MethodParamsMap, RpcRequest } from './types';

type WorkerMessageHandler = (event: MessageEvent) => void;

export class WorkerManager {
  private readonly _workers = new Map<string, Worker>();

  private readonly _animationWorkerMap = new Map<string, string>();

  // instanceId → handler for broadcast events from the worker (id is empty string)
  private readonly _eventHandlers = new Map<string, WorkerMessageHandler>();

  // RPC request id → handler for the matching reply
  private readonly _rpcHandlers = new Map<string, WorkerMessageHandler>();

  public getWorker(workerId: string): Worker {
    let worker = this._workers.get(workerId);

    if (!worker) {
      worker = new DotLottieWebWorker();
      worker.addEventListener('message', this._routeMessage);
      this._workers.set(workerId, worker);
    }

    return worker;
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

  public broadcastMessage(message: RpcRequest<keyof MethodParamsMap>, transfer?: Transferable[]): void {
    this._workers.forEach((worker) => {
      worker.postMessage(message, transfer || []);
    });
  }

  public terminateWorker(workerId: string): void {
    const worker = this._workers.get(workerId);

    if (worker) {
      worker.removeEventListener('message', this._routeMessage);
      worker.terminate();
      this._workers.delete(workerId);
    }
  }

  public registerEventHandler(instanceId: string, handler: WorkerMessageHandler): void {
    this._eventHandlers.set(instanceId, handler);
  }

  public unregisterEventHandler(instanceId: string): void {
    this._eventHandlers.delete(instanceId);
  }

  public registerRpcReplyHandler(requestId: string, handler: WorkerMessageHandler): void {
    this._rpcHandlers.set(requestId, handler);
  }

  public unregisterRpcReplyHandler(requestId: string): void {
    this._rpcHandlers.delete(requestId);
  }

  /*
    Single per-worker listener that routes each message to the right consumer.
    Replies have a non-empty `id` matching an in-flight RPC; broadcast events
    use an empty `id` and carry `result.instanceId` for routing.
  */
  private readonly _routeMessage = (event: MessageEvent): void => {
    const data = event.data as { id?: string; result?: { instanceId?: string } };

    if (data.id) {
      const handler = this._rpcHandlers.get(data.id);

      if (handler) handler(event);

      return;
    }

    const instanceId = data.result?.instanceId;

    if (instanceId) {
      const handler = this._eventHandlers.get(instanceId);

      if (handler) handler(event);
    }
  };
}
