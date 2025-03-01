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
  | 'ready';

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
  | RenderEvent
  | ReadyEvent;

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
