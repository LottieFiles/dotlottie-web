/**
 * Represents the different types of events that can be dispatched.
 */
export type EventType =
  | 'complete'
  | 'frame'
  | 'load'
  | 'loadError'
  | 'renderError'
  | 'loop'
  | 'pause'
  | 'play'
  | 'stop'
  | 'destroy'
  | 'freeze'
  | 'unfreeze'
  | 'render'
  | 'ready'
  | 'stateMachineStart'
  | 'stateMachineStop'
  | 'stateMachineTransition'
  | 'stateMachineStateEntered'
  | 'stateMachineStateExit'
  | 'stateMachineCustomEvent'
  | 'stateMachineError'
  | 'stateMachineBooleanInputValueChange'
  | 'stateMachineNumericInputValueChange'
  | 'stateMachineStringInputValueChange'
  | 'stateMachineInputFired';

/**
 * Maps an event type string to its respective event interface.
 */
type EventByType<T extends EventType> = Extract<Event, { type: T }>;

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
 * Event fired when a loading error occurs.
 */
export interface RenderErrorEvent extends BaseEvent {
  error: Error;
  type: 'renderError';
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

export interface StateMachineStartEvent extends BaseEvent {
  type: 'stateMachineStart';
}

export interface StateMachineStopEvent extends BaseEvent {
  type: 'stateMachineStop';
}

export interface StateMachineTransitionEvent extends BaseEvent {
  fromState: string;
  toState: string;
  type: 'stateMachineTransition';
}

export interface StateMachineStateEnteredEvent extends BaseEvent {
  state: string;
  type: 'stateMachineStateEntered';
}

export interface StateMachineStateExitEvent extends BaseEvent {
  state: string;
  type: 'stateMachineStateExit';
}

export interface StateMachineCustomEvent extends BaseEvent {
  eventName: string;
  type: 'stateMachineCustomEvent';
}

export interface StateMachineErrorEvent extends BaseEvent {
  error: string;
  type: 'stateMachineError';
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
  | RenderErrorEvent
  | CompleteEvent
  | PauseEvent
  | PlayEvent
  | StopEvent
  | DestroyEvent
  | FreezeEvent
  | UnfreezeEvent
  | RenderEvent
  | ReadyEvent
  | StateMachineStartEvent
  | StateMachineStopEvent
  | StateMachineTransitionEvent
  | StateMachineStateEnteredEvent
  | StateMachineStateExitEvent
  | StateMachineCustomEvent
  | StateMachineErrorEvent
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
  private readonly _eventListeners: Map<EventType, Set<(event: Event) => void>> = new Map();

  public addEventListener<T extends EventType>(type: T, listener: EventListener<T>): void {
    let listeners = this._eventListeners.get(type);

    if (!listeners) {
      listeners = new Set<(event: Event) => void>();
      this._eventListeners.set(type, listeners);
    }

    listeners.add(listener as (event: Event) => void);
  }

  public removeEventListener<T extends EventType>(type: T, listener?: EventListener<T>): void {
    const listeners = this._eventListeners.get(type);

    if (!listeners) return;

    if (listener) {
      listeners.delete(listener as (event: Event) => void);

      if (listeners.size === 0) {
        this._eventListeners.delete(type);
      }
    } else {
      this._eventListeners.delete(type);
    }
  }

  public dispatch<T extends EventType>(event: EventByType<T>): void {
    const listeners = this._eventListeners.get(event.type);

    if (listeners) {
      for (const listener of listeners) {
        listener(event);
      }
    }
  }

  public removeAllEventListeners(): void {
    this._eventListeners.clear();
  }
}
