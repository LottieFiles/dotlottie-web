/* eslint-disable no-console */
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
        console.log('[Observer] on_load');
        eventManager.dispatch({ type: 'load' });
      },
      on_load_error: (): void => {
        console.log('[Observer] on_load_error');
        eventManager.dispatch({ type: 'loadError', error: new Error('An error ocurred.') });
      },
      on_play: (): void => {
        console.log('[Observer] on_play');

        this._eventManager.dispatch({ type: 'play' });

        console.log('[Observer] DISPATCHED on_play');
      },
      on_pause: (): void => {
        console.log('[Observer] on_pause');

        eventManager.dispatch({ type: 'pause' });
      },
      on_stop: (): void => {
        console.log('[Observer] on_stop');

        eventManager.dispatch({ type: 'stop' });
      },
      on_complete: (): void => {
        console.log('[Observer] on_complete');

        eventManager.dispatch({ type: 'complete' });
      },
      on_loop: (loopCount: number): void => {
        console.log('[Observer] on_loop');

        eventManager.dispatch({ type: 'loop', loopCount });
      },
      on_frame: (currentFrame: number): void => {
        console.log('[Observer] on_frame');

        eventManager.dispatch({ type: 'frame', currentFrame });
      },
      on_render: (currentFrame: number): void => {
        console.log('[Observer] on_render');

        eventManager.dispatch({ type: 'render', currentFrame });
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
