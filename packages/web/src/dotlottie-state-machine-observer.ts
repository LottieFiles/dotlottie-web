/* eslint-disable @typescript-eslint/naming-convention */
import type { MainModule, StateMachineObserver } from './core';
import type { EventManager } from './event-manager';

// Create a class that implements the Observer interface
export class DotLottieStateMachineObserver {
  private _observer: StateMachineObserver;

  // For information on how this works, you can find the emscripten documentation here:
  // https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#deriving-from-c-classes-in-javascript
  public constructor(module: MainModule, eventManager: EventManager) {
    const implementer = {
      on_start: (): void => {
        if (eventManager.hasEvent('stateMachineStart')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'stateMachineStart' });
          }, 0);
        }
      },
      on_stop: (): void => {
        if (eventManager.hasEvent('stateMachineStop')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'stateMachineStop' });
          }, 0);
        }
      },
      on_transition: (previousState: string, newState: string): void => {
        if (eventManager.hasEvent('stateMachineTransition')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'stateMachineTransition', newState, previousState });
          }, 0);
        }
      },
      on_state_entered: (enteringState: string): void => {
        if (eventManager.hasEvent('stateMachineStateEntered')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'stateMachineStateEntered', enteringState });
          }, 0);
        }
      },
      on_state_exit: (exitingState: string): void => {
        if (eventManager.hasEvent('stateMachineStateExit')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'stateMachineStateExit', exitingState });
          }, 0);
        }
      },
      on_custom_event: (message: string): void => {
        if (eventManager.hasEvent('stateMachineCustomEvent')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'stateMachineCustomEvent', message });
          }, 0);
        }
      },
      on_string_input_value_change: (inputName: string, oldValue: string, newValue: string): void => {
        if (eventManager.hasEvent('stateMachineStringInputValueChange')) {
          setTimeout(() => {
            eventManager.dispatch({
              type: 'stateMachineStringInputValueChange',
              inputName,
              oldValue,
              newValue,
            });
          }, 0);
        }
      },
      on_numeric_input_value_change: (inputName: string, oldValue: number, newValue: number): void => {
        if (eventManager.hasEvent('stateMachineNumericInputValueChange')) {
          setTimeout(() => {
            eventManager.dispatch({
              type: 'stateMachineNumericInputValueChange',
              inputName,
              oldValue,
              newValue,
            });
          }, 0);
        }
      },
      on_boolean_input_value_change: (inputName: string, oldValue: boolean, newValue: boolean): void => {
        if (eventManager.hasEvent('stateMachineBooleanInputValueChange')) {
          setTimeout(() => {
            eventManager.dispatch({
              type: 'stateMachineBooleanInputValueChange',
              inputName,
              oldValue,
              newValue,
            });
          }, 0);
        }
      },
      on_input_fired: (inputName: string): void => {
        if (eventManager.hasEvent('stateMachineInputFired')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'stateMachineInputFired', inputName });
          }, 0);
        }
      },
      on_error: (message: string): void => {
        if (eventManager.hasEvent('stateMachineError')) {
          setTimeout(() => {
            eventManager.dispatch({ type: 'stateMachineError', message });
          }, 0);
        }
      },
    };

    this._observer = module.StateMachineObserver.implement(implementer);
  }

  public get observer(): StateMachineObserver {
    return this._observer;
  }

  public set observer(observer: StateMachineObserver) {
    this._observer = observer;
  }
}
