/* eslint-disable max-classes-per-file */

interface AnimationFrameStrategy {
  cancelAnimationFrame(id: number): void;
  requestAnimationFrame(callback: (time: number) => void): number;
}

class WebAnimationFrameStrategy implements AnimationFrameStrategy {
  public requestAnimationFrame(callback: (time: number) => void): number {
    return requestAnimationFrame(callback);
  }

  public cancelAnimationFrame(id: number): void {
    cancelAnimationFrame(id);
  }
}

class NodeAnimationFrameStrategy implements AnimationFrameStrategy {
  private _handleIdCounter: number = 0;

  private readonly _activeImmediates: Map<number, NodeJS.Immediate> = new Map();

  public requestAnimationFrame(callback: (time: number) => void): number {
    if (this._handleIdCounter >= Number.MAX_SAFE_INTEGER) {
      this._handleIdCounter = 0;
    }

    this._handleIdCounter += 1;
    const id = this._handleIdCounter;

    const immediate = setImmediate(() => {
      this._activeImmediates.delete(id);
      callback(Date.now());
    });

    this._activeImmediates.set(id, immediate);

    return id;
  }

  public cancelAnimationFrame(id: number): void {
    const immediate = this._activeImmediates.get(id);

    if (immediate) {
      clearImmediate(immediate);
      this._activeImmediates.delete(id);
    }
  }
}

export class AnimationFrameManager {
  private readonly _strategy: AnimationFrameStrategy;

  public constructor() {
    this._strategy =
      typeof requestAnimationFrame === 'function' ? new WebAnimationFrameStrategy() : new NodeAnimationFrameStrategy();
  }

  public requestAnimationFrame(callback: (time: number) => void): number {
    return this._strategy.requestAnimationFrame(callback);
  }

  public cancelAnimationFrame(id: number): void {
    this._strategy.cancelAnimationFrame(id);
  }
}
