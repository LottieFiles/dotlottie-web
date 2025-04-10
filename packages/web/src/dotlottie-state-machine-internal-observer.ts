/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
import type { MainModule, StateMachineObserver } from './core';

/**
 * Internal observer for the state machine.
 * This observer is used to catch OpenUrl events and open the URL in a new tab.
 * This observer is seperate as to not pollute user's state machine observers.
 */
export class DotLottieInternalStateMachineObserver {
  private _observer: StateMachineObserver;

  // For information on how this works, you can find the emscripten documentation here:
  // https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#deriving-from-c-classes-in-javascript
  public constructor(module: MainModule) {
    const implementer = {
      on_start: (): void => {},
      on_stop: (): void => {},
      on_transition: (_previousState: string, _newState: string): void => {},
      on_state_entered: (_enteringState: string): void => {},
      on_state_exit: (_exitingState: string): void => {},
      on_custom_event: (message: string): void => {
        if (message.startsWith('OpenUrl:')) {
          const [urlPart = '', targetPart] = message.split(' | ');
          const url = urlPart.replace('OpenUrl: ', '');

          if (typeof window === 'undefined') return;

          if (targetPart) {
            const target = targetPart.replace('Target: ', '');

            window.open(url, target);
          } else {
            window.open(url, '_self');
          }
        }
      },
      on_string_input_value_change: (_inputName: string, _oldValue: string, _newValue: string): void => {},
      on_numeric_input_value_change: (_inputName: string, _oldValue: number, _newValue: number): void => {},
      on_boolean_input_value_change: (_inputName: string, _oldValue: boolean, _newValue: boolean): void => {},
      on_input_fired: (_inputName: string): void => {},
      on_error: (_message: string): void => {},
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
