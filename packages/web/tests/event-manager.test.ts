import { describe, test, expect, vi } from 'vitest';

import { EventManager } from '../src/event-manager';
import type {
  FrameEvent,
  LoadErrorEvent,
  LoopEvent,
  StateMachineTransitionEvent,
  StateMachineBooleanInputValueChangeEvent,
  StateMachineInternalMessage,
  RenderErrorEvent,
} from '../src/event-manager';

describe('EventManager', () => {
  test('initializes with an empty event listeners map', () => {
    const eventManager = new EventManager();

    expect(eventManager['_eventListeners'].size).toBe(0);
  });

  test('adds a new event listener', () => {
    const eventManager = new EventManager();
    const listener = vi.fn();

    eventManager.addEventListener('play', listener);
    expect(eventManager['_eventListeners'].has('play')).toBe(true);
    expect(eventManager['_eventListeners'].get('play')?.size).toBe(1);
  });

  test('adds multiple listeners for the same event', () => {
    const eventManager = new EventManager();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    eventManager.addEventListener('play', listener1);
    eventManager.addEventListener('play', listener2);
    expect(eventManager['_eventListeners'].get('play')?.size).toBe(2);
  });

  test('removes a specific event listener', () => {
    const eventManager = new EventManager();

    const listener = vi.fn();

    eventManager.addEventListener('play', listener);

    eventManager.removeEventListener('play', listener);

    expect(eventManager['_eventListeners'].has('play')).toBe(false);
  });

  test('dispatches an event to the appropriate listeners', () => {
    const eventManager = new EventManager();
    const listener = vi.fn();

    eventManager.addEventListener('play', listener);

    eventManager.dispatch({ type: 'play' });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('removes all event listeners', () => {
    const eventManager = new EventManager();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    eventManager.addEventListener('play', listener1);

    eventManager.addEventListener('stop', listener2);

    eventManager.removeAllEventListeners();

    expect(eventManager['_eventListeners'].size).toBe(0);
  });

  test('removes all listeners for an event type when no specific listener is provided', () => {
    const manager = new EventManager();
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    manager.addEventListener('play', listener1);
    manager.addEventListener('play', listener2);

    expect(manager['_eventListeners'].get('play')?.size).toBe(2);

    manager.removeEventListener('play');

    expect(manager['_eventListeners'].has('play')).toBe(false);
  });

  test('does nothing when attempting to remove a non-existent event listener', () => {
    const manager = new EventManager();

    const nonExistentListener = vi.fn();

    // attempting to remove a listener that was never added
    expect(() => {
      manager.removeEventListener('play', nonExistentListener);
    }).not.toThrow();

    expect(manager['_eventListeners'].has('play')).toBe(false);
  });

  test('does nothing when attempting to add a listener that already exists', () => {
    const manager = new EventManager();

    const listener = vi.fn();

    manager.addEventListener('play', listener);
    manager.addEventListener('play', listener);

    expect(manager['_eventListeners'].get('play')?.size).toBe(1);
  });

  describe('Event Data Propagation', () => {
    test('dispatches FrameEvent with correct data', () => {
      const manager = new EventManager();
      const listener = vi.fn();

      manager.addEventListener('frame', listener);

      const frameEvent: FrameEvent = {
        type: 'frame',
        currentFrame: 42,
      };

      manager.dispatch(frameEvent);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(frameEvent);
    });

    test('dispatches LoadErrorEvent with error data', () => {
      const manager = new EventManager();
      const listener = vi.fn();

      manager.addEventListener('loadError', listener);

      const error = new Error('Test error');
      const loadErrorEvent: LoadErrorEvent = {
        type: 'loadError',
        error,
      };

      manager.dispatch(loadErrorEvent);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(loadErrorEvent);
    });

    test('dispatches LoopEvent with loop count', () => {
      const manager = new EventManager();
      const listener = vi.fn();

      manager.addEventListener('loop', listener);

      const loopEvent: LoopEvent = {
        type: 'loop',
        loopCount: 5,
      };

      manager.dispatch(loopEvent);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(loopEvent);
    });
  });

  describe('State Machine Events', () => {
    test('dispatches StateMachineTransitionEvent with state data', () => {
      const manager = new EventManager();
      const listener = vi.fn();

      manager.addEventListener('stateMachineTransition', listener);

      const transitionEvent: StateMachineTransitionEvent = {
        type: 'stateMachineTransition',
        fromState: 'idle',
        toState: 'playing',
      };

      manager.dispatch(transitionEvent);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(transitionEvent);
    });

    test('dispatches StateMachineBooleanInputValueChangeEvent with input data', () => {
      const manager = new EventManager();
      const listener = vi.fn();

      manager.addEventListener('stateMachineBooleanInputValueChange', listener);

      const inputEvent: StateMachineBooleanInputValueChangeEvent = {
        type: 'stateMachineBooleanInputValueChange',
        inputName: 'isEnabled',
        newValue: true,
        oldValue: false,
      };

      manager.dispatch(inputEvent);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(inputEvent);
    });

    test('dispatches StateMachineInternalMessage with message data', () => {
      const manager = new EventManager();
      const listener = vi.fn();

      manager.addEventListener('stateMachineInternalMessage', listener);

      const internalMessageEvent: StateMachineInternalMessage = {
        type: 'stateMachineInternalMessage',
        message: 'OpenUrl: https://example.com',
      };

      manager.dispatch(internalMessageEvent);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(internalMessageEvent);
    });

    test('handles all state machine event types', () => {
      const manager = new EventManager();
      const listeners = {
        start: vi.fn(),
        stop: vi.fn(),
        stateEntered: vi.fn(),
        stateExit: vi.fn(),
        customEvent: vi.fn(),
        error: vi.fn(),
        inputFired: vi.fn(),
        internalMessage: vi.fn(),
      };

      manager.addEventListener('stateMachineStart', listeners.start);
      manager.addEventListener('stateMachineStop', listeners.stop);
      manager.addEventListener('stateMachineStateEntered', listeners.stateEntered);
      manager.addEventListener('stateMachineStateExit', listeners.stateExit);
      manager.addEventListener('stateMachineCustomEvent', listeners.customEvent);
      manager.addEventListener('stateMachineError', listeners.error);
      manager.addEventListener('stateMachineInputFired', listeners.inputFired);
      manager.addEventListener('stateMachineInternalMessage', listeners.internalMessage);

      manager.dispatch({ type: 'stateMachineStart' });
      manager.dispatch({ type: 'stateMachineStop' });
      manager.dispatch({ type: 'stateMachineStateEntered', state: 'active' });
      manager.dispatch({ type: 'stateMachineStateExit', state: 'inactive' });
      manager.dispatch({ type: 'stateMachineCustomEvent', eventName: 'customAction' });
      manager.dispatch({ type: 'stateMachineError', error: 'Something went wrong' });
      manager.dispatch({ type: 'stateMachineInputFired', inputName: 'trigger' });
      manager.dispatch({ type: 'stateMachineInternalMessage', message: 'OpenUrl: https://test.com' });

      expect(listeners.start).toHaveBeenCalledTimes(1);
      expect(listeners.stop).toHaveBeenCalledTimes(1);
      expect(listeners.stateEntered).toHaveBeenCalledTimes(1);
      expect(listeners.stateExit).toHaveBeenCalledTimes(1);
      expect(listeners.customEvent).toHaveBeenCalledTimes(1);
      expect(listeners.error).toHaveBeenCalledTimes(1);
      expect(listeners.inputFired).toHaveBeenCalledTimes(1);
      expect(listeners.internalMessage).toHaveBeenCalledTimes(1);
    });
  });

  test.only('handles all global inputs event types', () => {
    const manager = new EventManager();
    const listeners = {
      colorChange: vi.fn(),
      gradientChange: vi.fn(),
      numericChange: vi.fn(),
      booleanChange: vi.fn(),
      stringChange: vi.fn(),
      vectorChange: vi.fn(),
    };

    manager.addEventListener('globalInputsColorChange', listeners.colorChange);
    // eslint-disable-next-line no-secrets/no-secrets
    manager.addEventListener('globalInputsGradientChange', listeners.gradientChange);
    // eslint-disable-next-line no-secrets/no-secrets
    manager.addEventListener('globalInputsNumericChange', listeners.numericChange);
    manager.addEventListener('globalInputsBooleanChange', listeners.booleanChange);
    manager.addEventListener('globalInputsStringChange', listeners.stringChange);
    // eslint-disable-next-line no-secrets/no-secrets
    manager.addEventListener('globalInputsVectorChange', listeners.vectorChange);

    // Minimal dummy event objects for each event type
    manager.dispatch({
      type: 'globalInputsColorChange',
      inputName: 'fill',
      newValue: [255, 170, 0],
      oldValue: [0, 0, 0],
    });
    manager.dispatch({
      type: 'globalInputsGradientChange',
      inputName: 'gradient',
      newValue: [255, 255, 255, 1],
      oldValue: [0, 0, 0, 1],
    });
    manager.dispatch({ type: 'globalInputsNumericChange', inputName: 'num', newValue: 1.23, oldValue: 1.0 });
    manager.dispatch({ type: 'globalInputsBooleanChange', inputName: 'toggle', newValue: true, oldValue: false });
    manager.dispatch({ type: 'globalInputsStringChange', inputName: 'caption', newValue: 'next', oldValue: 'prev' });
    manager.dispatch({ type: 'globalInputsVectorChange', inputName: 'vec', newValue: [1, 2, 3], oldValue: [0, 0, 0] });

    expect(listeners.colorChange).toHaveBeenCalledTimes(1);
    expect(listeners.gradientChange).toHaveBeenCalledTimes(1);
    expect(listeners.numericChange).toHaveBeenCalledTimes(1);
    expect(listeners.booleanChange).toHaveBeenCalledTimes(1);
    expect(listeners.stringChange).toHaveBeenCalledTimes(1);
    expect(listeners.vectorChange).toHaveBeenCalledTimes(1);

    // Check received event params using types from event-manager.ts (214-257)
    expect(listeners.colorChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'globalInputsColorChange',
        inputName: 'fill',
        newValue: [255, 170, 0],
        oldValue: [0, 0, 0],
      }),
    );
    expect(listeners.gradientChange).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line no-secrets/no-secrets
        type: 'globalInputsGradientChange',
        inputName: 'gradient',
        newValue: [255, 255, 255, 1],
        oldValue: [0, 0, 0, 1],
      }),
    );
    expect(listeners.numericChange).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line no-secrets/no-secrets
        type: 'globalInputsNumericChange',
        inputName: 'num',
        newValue: 1.23,
        oldValue: 1.0,
      }),
    );
    expect(listeners.booleanChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'globalInputsBooleanChange',
        inputName: 'toggle',
        newValue: true,
        oldValue: false,
      }),
    );
    expect(listeners.stringChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'globalInputsStringChange',
        inputName: 'caption',
        newValue: 'next',
        oldValue: 'prev',
      }),
    );
    expect(listeners.vectorChange).toHaveBeenCalledWith(
      expect.objectContaining({
        // eslint-disable-next-line no-secrets/no-secrets
        type: 'globalInputsVectorChange',
        inputName: 'vec',
        newValue: [1, 2, 3],
        oldValue: [0, 0, 0],
      }),
    );
  });

  describe('Multiple Listeners Execution', () => {
    test('calls all listeners for the same event type', () => {
      const manager = new EventManager();
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      const listener3 = vi.fn();

      manager.addEventListener('play', listener1);
      manager.addEventListener('play', listener2);
      manager.addEventListener('play', listener3);

      manager.dispatch({ type: 'play' });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener3).toHaveBeenCalledTimes(1);
    });

    test('calls listeners in the order they were added', () => {
      const manager = new EventManager();
      const callOrder: string[] = [];

      const listener1 = vi.fn(() => callOrder.push('first'));
      const listener2 = vi.fn(() => callOrder.push('second'));
      const listener3 = vi.fn(() => callOrder.push('third'));

      manager.addEventListener('play', listener1);
      manager.addEventListener('play', listener2);
      manager.addEventListener('play', listener3);

      manager.dispatch({ type: 'play' });

      expect(callOrder).toEqual(['first', 'second', 'third']);
    });
  });

  describe('Event Isolation', () => {
    test('dispatching one event type does not affect other event types', () => {
      const manager = new EventManager();
      const playListener = vi.fn();
      const stopListener = vi.fn();
      const pauseListener = vi.fn();

      manager.addEventListener('play', playListener);
      manager.addEventListener('stop', stopListener);
      manager.addEventListener('pause', pauseListener);

      manager.dispatch({ type: 'play' });

      expect(playListener).toHaveBeenCalledTimes(1);
      expect(stopListener).toHaveBeenCalledTimes(0);
      expect(pauseListener).toHaveBeenCalledTimes(0);
    });

    test('removing listeners for one event type does not affect others', () => {
      const manager = new EventManager();
      const playListener = vi.fn();
      const stopListener = vi.fn();

      manager.addEventListener('play', playListener);
      manager.addEventListener('stop', stopListener);

      manager.removeEventListener('play');

      expect(manager['_eventListeners'].has('play')).toBe(false);
      expect(manager['_eventListeners'].has('stop')).toBe(true);

      manager.dispatch({ type: 'stop' });
      expect(stopListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    test('propagates errors thrown by listeners and stops execution', () => {
      const manager = new EventManager();
      const listener1 = vi.fn();
      const listener2 = vi.fn(() => {
        throw new Error('Test error');
      });
      const listener3 = vi.fn();

      manager.addEventListener('play', listener1);
      manager.addEventListener('play', listener2);
      manager.addEventListener('play', listener3);

      expect(() => manager.dispatch({ type: 'play' })).toThrow('Test error');

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener3).toHaveBeenCalledTimes(0);
    });

    test('stops executing remaining listeners when one throws an error', () => {
      const manager = new EventManager();
      const callOrder: string[] = [];

      const listener1 = vi.fn(() => callOrder.push('listener1'));
      const listener2 = vi.fn(() => {
        callOrder.push('listener2');
        throw new Error('Second listener error');
      });
      const listener3 = vi.fn(() => callOrder.push('listener3'));

      manager.addEventListener('play', listener1);
      manager.addEventListener('play', listener2);
      manager.addEventListener('play', listener3);

      expect(() => manager.dispatch({ type: 'play' })).toThrow('Second listener error');

      expect(callOrder).toEqual(['listener1', 'listener2']);
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
      expect(listener3).toHaveBeenCalledTimes(0);
    });
  });

  describe('Edge Cases', () => {
    test('dispatching to non-existent event type does nothing', () => {
      const manager = new EventManager();

      expect(() => manager.dispatch({ type: 'play' })).not.toThrow();
    });

    test('removing listener from non-existent event type does nothing', () => {
      const manager = new EventManager();
      const listener = vi.fn();

      expect(() => manager.removeEventListener('play', listener)).not.toThrow();
      expect(() => manager.removeEventListener('stop')).not.toThrow();
    });

    test('removing specific listener that does not exist does nothing', () => {
      const manager = new EventManager();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      manager.addEventListener('play', listener1);

      expect(() => manager.removeEventListener('play', listener2)).not.toThrow();

      expect(manager['_eventListeners'].get('play')?.size).toBe(1);
    });

    test('handles complex event objects correctly', () => {
      const manager = new EventManager();
      const listener = vi.fn();

      manager.addEventListener('renderError', listener);

      const complexError = new Error('Complex error');

      complexError.stack = 'Error stack trace';

      const renderErrorEvent: RenderErrorEvent = {
        type: 'renderError',
        error: complexError,
      };

      manager.dispatch(renderErrorEvent);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(renderErrorEvent);
    });
  });

  describe('Memory and Cleanup', () => {
    test('properly cleans up when removing the last listener for an event type', () => {
      const manager = new EventManager();
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      manager.addEventListener('play', listener1);
      manager.addEventListener('play', listener2);

      expect(manager['_eventListeners'].has('play')).toBe(true);
      expect(manager['_eventListeners'].get('play')?.size).toBe(2);

      manager.removeEventListener('play', listener1);
      expect(manager['_eventListeners'].has('play')).toBe(true);
      expect(manager['_eventListeners'].get('play')?.size).toBe(1);

      manager.removeEventListener('play', listener2);
      expect(manager['_eventListeners'].has('play')).toBe(false);
    });

    test('removeAllEventListeners clears all event types and listeners', () => {
      const manager = new EventManager();
      const playListener = vi.fn();
      const stopListener = vi.fn();
      const frameListener = vi.fn();

      manager.addEventListener('play', playListener);
      manager.addEventListener('stop', stopListener);
      manager.addEventListener('frame', frameListener);

      expect(manager['_eventListeners'].size).toBe(3);

      manager.removeAllEventListeners();

      expect(manager['_eventListeners'].size).toBe(0);

      manager.dispatch({ type: 'play' });
      manager.dispatch({ type: 'stop' });
      manager.dispatch({ type: 'frame', currentFrame: 10 });

      expect(playListener).toHaveBeenCalledTimes(0);
      expect(stopListener).toHaveBeenCalledTimes(0);
      expect(frameListener).toHaveBeenCalledTimes(0);
    });
  });

  describe('Type Safety', () => {
    test('ensures type safety for different event types', () => {
      const manager = new EventManager();

      manager.addEventListener('frame', (event) => {
        expect(typeof event.currentFrame).toBe('number');
        expect(event.type).toBe('frame');
      });

      manager.addEventListener('loadError', (event) => {
        expect(event.error).toBeInstanceOf(Error);
        expect(event.type).toBe('loadError');
      });

      manager.addEventListener('stateMachineTransition', (event) => {
        expect(typeof event.fromState).toBe('string');
        expect(typeof event.toState).toBe('string');
        expect(event.type).toBe('stateMachineTransition');
      });

      manager.addEventListener('stateMachineInternalMessage', (event) => {
        expect(typeof event.message).toBe('string');
        expect(event.type).toBe('stateMachineInternalMessage');
      });

      const frameEvent: FrameEvent = { type: 'frame', currentFrame: 5 };
      const errorEvent: LoadErrorEvent = { type: 'loadError', error: new Error('test') };
      const transitionEvent: StateMachineTransitionEvent = {
        type: 'stateMachineTransition',
        fromState: 'a',
        toState: 'b',
      };
      const internalMessageEvent: StateMachineInternalMessage = {
        type: 'stateMachineInternalMessage',
        message: 'OpenUrl: https://example.com',
      };

      manager.dispatch(frameEvent);
      manager.dispatch(errorEvent);
      manager.dispatch(transitionEvent);
      manager.dispatch(internalMessageEvent);
    });
  });
});
