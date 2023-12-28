/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable max-classes-per-file */

import { IS_NODE } from './constants';

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
  private _lastHandleId: number = 0;

  private _lastImmediate: NodeJS.Immediate | null = null;

  public requestAnimationFrame(callback: (time: number) => void): number {
    if (this._lastHandleId >= Number.MAX_SAFE_INTEGER) {
      this._lastHandleId = 0;
    }

    this._lastHandleId += 1;

    this._lastImmediate = setImmediate(() => {
      callback(Date.now());
    });

    return this._lastHandleId;
  }

  public cancelAnimationFrame(_id: number): void {
    if (this._lastImmediate) {
      clearImmediate(this._lastImmediate);
    }
  }
}

export class AnimationFrameManager {
  private readonly _strategy: AnimationFrameStrategy;

  public constructor() {
    this._strategy = IS_NODE ? new NodeAnimationFrameStrategy() : new WebAnimationFrameStrategy();
  }

  public requestAnimationFrame(callback: (time: number) => void): number {
    return this._strategy.requestAnimationFrame(callback);
  }

  public cancelAnimationFrame(id: number): void {
    this._strategy.cancelAnimationFrame(id);
  }
}
