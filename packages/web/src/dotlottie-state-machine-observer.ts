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
        eventManager.dispatch({ type: 'stateMachineStart' });
      },
      on_stop: (): void => {
        eventManager.dispatch({ type: 'stateMachineStop' });
      },
      on_transition: (previousState: string, newState: string): void => {
        eventManager.dispatch({ type: 'stateMachineTransition', newState, previousState });
      },
      on_state_entered: (enteringState: string): void => {
        eventManager.dispatch({ type: 'stateMachineStateEntered', enteringState });
      },
      on_state_exit: (exitingState: string): void => {
        eventManager.dispatch({ type: 'stateMachineStateExit', exitingState });
      },
      on_custom_event: (message: string): void => {
        eventManager.dispatch({ type: 'stateMachineCustomEvent', message });
      },
      on_string_input_value_change: (inputName: string, oldValue: string, newValue: string): void => {
        eventManager.dispatch({
          type: 'stateMachineStringInputValueChange',
          inputName,
          oldValue,
          newValue,
        });
      },
      on_numeric_input_value_change: (inputName: string, oldValue: number, newValue: number): void => {
        eventManager.dispatch({
          type: 'stateMachineNumericInputValueChange',
          inputName,
          oldValue,
          newValue,
        });
      },
      on_boolean_input_value_change: (inputName: string, oldValue: boolean, newValue: boolean): void => {
        eventManager.dispatch({
          type: 'stateMachineBooleanInputValueChange',
          inputName,
          oldValue,
          newValue,
        });
      },
      on_input_fired: (inputName: string): void => {
        eventManager.dispatch({ type: 'stateMachineInputFired', inputName });
      },
      on_error: (message: string): void => {
        eventManager.dispatch({ type: 'stateMachineError', message });
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
