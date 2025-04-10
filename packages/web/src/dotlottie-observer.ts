/* eslint-disable @typescript-eslint/naming-convention */
import type { Observer, MainModule } from './core';
import type { EventManager } from './event-manager';

// Create a class that implements the Observer interface
export class DotLottieObserver {
  private _observer: Observer;

  private readonly _eventManager: EventManager;

  // For information on how this works, you can find the emscripten documentation here:
  // https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#deriving-from-c-classes-in-javascript
  public constructor(module: MainModule, eventManager: EventManager) {
    this._eventManager = eventManager;

    const implementer = {
      on_load: (): void => {
        if (eventManager.hasEvent('load')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'load' });
          }, 0);
        }
      },
      on_load_error: (): void => {
        if (eventManager.hasEvent('loadError')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'loadError', error: new Error('An error ocurred.') });
          }, 0);
        }
      },
      on_play: (): void => {
        if (eventManager.hasEvent('play')) {
          setTimeout(() => {
            this._eventManager.dispatch({ type: 'play' });
          }, 0);
        }
      },
      on_pause: (): void => {
        if (eventManager.hasEvent('pause')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'pause' });
          }, 0);
        }
      },
      on_stop: (): void => {
        if (eventManager.hasEvent('stop')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'stop' });
          }, 0);
        }
      },
      on_complete: (): void => {
        if (eventManager.hasEvent('complete')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'complete' });
          }, 0);
        }
      },
      on_loop: (loopCount: number): void => {
        if (eventManager.hasEvent('loop')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'loop', loopCount });
          }, 0);
        }
      },
      on_frame: (currentFrame: number): void => {
        if (eventManager.hasEvent('frame')) {
          const roundedFrame = Math.round(currentFrame * 100) / 100;

          eventManager.dispatch({ type: 'frame', currentFrame: roundedFrame });
        }
      },
      on_render: (currentFrame: number): void => {
        if (eventManager.hasEvent('render')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'render', currentFrame });
          }, 0);
        }
      },
    };

    this._observer = module.Observer.implement(implementer);
  }

  public get observer(): Observer {
    return this._observer;
  }

  public set observer(observer: Observer) {
    this._observer = observer;
  }
}
