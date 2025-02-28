import { describe, test, expect, vi } from 'vitest';

import { EventManager } from '../src/common/event-manager';

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
});
