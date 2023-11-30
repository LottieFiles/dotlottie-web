/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable max-classes-per-file */

import { ENVIRONMENT_IS_WEB } from './constants';

interface AnimationFrameStrategy {
  cancelAnimationFrame(id: number): void;
  requestAnimationFrame(callback: (time: number) => void): number;
}

class WebAnimationFrameStrategy implements AnimationFrameStrategy {
  public requestAnimationFrame(callback: (time: number) => void): number {
    return window.requestAnimationFrame(callback);
  }

  public cancelAnimationFrame(id: number): void {
    window.cancelAnimationFrame(id);
  }
}

class NodeAnimationFrameStrategy implements AnimationFrameStrategy {
  private _lastFrame: number = 0;

  private readonly _frameDuration: number = 1000 / 60;

  public requestAnimationFrame(callback: (time: number) => void): number {
    const currentTime = Date.now();
    const timeToCall = Math.max(0, this._frameDuration - (currentTime - this._lastFrame));

    this._lastFrame = currentTime + timeToCall;

    // eslint-disable-next-line node/no-callback-literal
    return setTimeout(() => callback(currentTime + timeToCall), timeToCall) as unknown as number;
  }

  public cancelAnimationFrame(id: number): void {
    clearTimeout(id);
  }
}

export class AnimationFrameManager {
  private readonly _strategy: AnimationFrameStrategy;

  public constructor() {
    this._strategy = ENVIRONMENT_IS_WEB ? new WebAnimationFrameStrategy() : new NodeAnimationFrameStrategy();
  }

  public requestAnimationFrame(callback: (time: number) => void): number {
    return this._strategy.requestAnimationFrame(callback);
  }

  public cancelAnimationFrame(id: number): void {
    this._strategy.cancelAnimationFrame(id);
  }
}
