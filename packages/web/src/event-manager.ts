/**
 * Represents the different types of events that can be dispatched.
 */
export type EventType =
  | 'complete'
  | 'frame'
  | 'load'
  | 'loadError'
  | 'loop'
  | 'pause'
  | 'play'
  | 'stop'
  | 'destroy'
  | 'freeze'
  | 'unfreeze'
  | 'render'
  | 'ready'
  | 'stateMachineCustomEvent'
  | 'stateMachineError'
  | 'stateMachineStateEntered'
  | 'stateMachineStateExit'
  | 'stateMachineTransition'
  | 'stateMachineStart'
  | 'stateMachineStop'
  | 'stateMachineBooleanInputValueChange'
  | 'stateMachineNumericInputValueChange'
  | 'stateMachineStringInputValueChange'
  | 'stateMachineInputFired';

/**
 * Maps an event type string to its respective event interface.
 */
type EventByType<T> = T extends 'complete'
  ? CompleteEvent
  : T extends 'frame'
  ? FrameEvent
  : T extends 'load'
  ? LoadEvent
  : T extends 'loadError'
  ? LoadErrorEvent
  : T extends 'loop'
  ? LoopEvent
  : T extends 'pause'
  ? PauseEvent
  : T extends 'play'
  ? PlayEvent
  : T extends 'stop'
  ? StopEvent
  : T extends 'destroy'
  ? DestroyEvent
  : T extends 'freeze'
  ? FreezeEvent
  : T extends 'unfreeze'
  ? UnfreezeEvent
  : T extends 'render'
  ? RenderEvent
  : T extends 'ready'
  ? ReadyEvent
  : T extends 'stateMachineCustomEvent'
  ? StateMachineCustomEvent
  : T extends 'stateMachineError'
  ? StateMachineErrorEvent
  : T extends 'stateMachineStateEntered'
  ? StateMachineStateEnteredEvent
  : T extends 'stateMachineStateExit'
  ? StateMachineStateExitEvent
  : T extends 'stateMachineTransition'
  ? StateMachineTransitionEvent
  : T extends 'stateMachineStart'
  ? StateMachineStartEvent
  : T extends 'stateMachineStop'
  ? StateMachineStopEvent
  : T extends 'stateMachineBooleanInputValueChange'
  ? StateMachineBooleanInputValueChangeEvent
  : T extends 'stateMachineNumericInputValueChange'
  ? StateMachineNumericInputValueChangeEvent
  : T extends 'stateMachineStringInputValueChange'
  ? StateMachineStringInputValueChangeEvent
  : T extends 'stateMachineInputFired'
  ? StateMachineInputFiredEvent
  : never;

/**
 * Base interface for all events.
 */
export interface BaseEvent {
  type: EventType;
}

export interface RenderEvent extends BaseEvent {
  currentFrame: number;
  type: 'render';
}

export interface FreezeEvent extends BaseEvent {
  type: 'freeze';
}

export interface UnfreezeEvent extends BaseEvent {
  type: 'unfreeze';
}

/*
 * Event fired when a destroy action occurs.
 */
export interface DestroyEvent extends BaseEvent {
  type: 'destroy';
}

/**
 * Event fired when a loop action occurs.
 */
export interface LoopEvent extends BaseEvent {
  loopCount: number;
  type: 'loop';
}

/**
 * Event fired during frame changes.
 */
export interface FrameEvent extends BaseEvent {
  currentFrame: number;
  type: 'frame';
}

/**
 * Event fired when a load action occurs.
 */
export interface LoadEvent extends BaseEvent {
  type: 'load';
}

/**
 * Event fired when a loading error occurs.
 */
export interface LoadErrorEvent extends BaseEvent {
  error: Error;
  type: 'loadError';
}

/**
 * Event fired when a completion action occurs.
 */
export interface CompleteEvent extends BaseEvent {
  type: 'complete';
}

/**
 * Event fired when a pause action occurs.
 */
export interface PauseEvent extends BaseEvent {
  type: 'pause';
}

/**
 * Event fired when a play action occurs.
 */
export interface PlayEvent extends BaseEvent {
  type: 'play';
}

/**
 * Event fired when a stop action occurs.
 */
export interface StopEvent extends BaseEvent {
  type: 'stop';
}

/**
 * Event fired when a WASM module is initialized and ready.
 */
export interface ReadyEvent extends BaseEvent {
  type: 'ready';
}
export interface StateMachineCustomEvent extends BaseEvent {
  message: string;
  type: 'stateMachineCustomEvent';
}
export interface StateMachineErrorEvent extends BaseEvent {
  message: string;
  type: 'stateMachineError';
}

export interface StateMachineStateEnteredEvent extends BaseEvent {
  enteringState: string;
  type: 'stateMachineStateEntered';
}

export interface StateMachineStateExitEvent extends BaseEvent {
  exitingState: string;
  type: 'stateMachineStateExit';
}

export interface StateMachineTransitionEvent extends BaseEvent {
  newState: string;
  previousState: string;
  type: 'stateMachineTransition';
}

export interface StateMachineStartEvent extends BaseEvent {
  type: 'stateMachineStart';
}

export interface StateMachineStopEvent extends BaseEvent {
  type: 'stateMachineStop';
}

export interface StateMachineBooleanInputValueChangeEvent extends BaseEvent {
  inputName: string;
  newValue: boolean;
  oldValue: boolean;
  type: 'stateMachineBooleanInputValueChange';
}

export interface StateMachineNumericInputValueChangeEvent extends BaseEvent {
  inputName: string;
  newValue: number;
  oldValue: number;
  type: 'stateMachineNumericInputValueChange';
}

export interface StateMachineStringInputValueChangeEvent extends BaseEvent {
  inputName: string;
  newValue: string;
  oldValue: string;
  type: 'stateMachineStringInputValueChange';
}

export interface StateMachineInputFiredEvent extends BaseEvent {
  inputName: string;
  type: 'stateMachineInputFired';
}

/**
 * Type representing all possible event types.
 */
export type Event =
  | LoopEvent
  | FrameEvent
  | LoadEvent
  | LoadErrorEvent
  | CompleteEvent
  | PauseEvent
  | PlayEvent
  | StopEvent
  | DestroyEvent
  | FreezeEvent
  | UnfreezeEvent
  | ReadyEvent
  | RenderEvent
  | StateMachineCustomEvent
  | StateMachineErrorEvent
  | StateMachineStateEnteredEvent
  | StateMachineStateExitEvent
  | StateMachineTransitionEvent
  | StateMachineStartEvent
  | StateMachineStopEvent
  | StateMachineBooleanInputValueChangeEvent
  | StateMachineNumericInputValueChangeEvent
  | StateMachineStringInputValueChangeEvent
  | StateMachineInputFiredEvent;

export interface EventListener<T extends EventType> {
  (event: EventByType<T>): void;
}

/**
 * Manages registration and dispatching of event listeners.
 */
export class EventManager {
  private readonly _eventListeners: Map<EventType, Set<EventListener<EventType>>> = new Map();

  public addEventListener<T extends EventType>(type: T, listener: EventListener<T>): void {
    let listeners = this._eventListeners.get(type);

    if (!listeners) {
      listeners = new Set<EventListener<T>>();
      this._eventListeners.set(type, listeners);
    }

    listeners.add(listener);
  }

  public removeEventListener<T extends EventType>(type: T, listener?: EventListener<T>): void {
    const listeners = this._eventListeners.get(type);

    if (!listeners) return;

    if (listener) {
      listeners.delete(listener);

      if (listeners.size === 0) {
        this._eventListeners.delete(type);
      }
    } else {
      this._eventListeners.delete(type);
    }
  }

  public dispatch<T extends EventType>(event: EventByType<T>): void {
    const listeners = this._eventListeners.get(event.type);

    listeners?.forEach((listener) => listener(event));
  }

  public removeAllEventListeners(): void {
    this._eventListeners.clear();
  }
}
