import { StateMachine } from '../types';

export function validateStateMachine(data: any): data is StateMachine {
  if (!data?.descriptor?.initial || !Array.isArray(data?.states)) {
    return false;
  }

  // Check if all states have required properties
  return data.states.every(
    (state: any) =>
      state.name &&
      (state.type === 'PlaybackState' || state.type === 'GlobalState') &&
      Array.isArray(state.transitions),
  );
}
