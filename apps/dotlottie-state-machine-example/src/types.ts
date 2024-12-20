export interface Guard {
  type: 'Numeric' | 'String' | 'Boolean' | 'Event';
  conditionType?: string;
  triggerName: string;
  compareTo?: string | number | boolean;
}

export interface Transition {
  type: 'Transition';
  toState: string;
  guards: Guard[];
}

export interface Action {
  type: string;
  triggerName?: string;
  value?: string | number | boolean;
}

export interface State {
  type: 'PlaybackState' | 'GlobalState';
  name: string;
  animationId?: string;
  autoplay?: boolean;
  loop?: boolean;
  transitions: Transition[];
  entryActions?: Action[];
  exitActions?: Action[];
}

export interface StateMachine {
  descriptor: {
    id: string;
    initial: string;
  };
  states: State[];
  listeners?: any[];
  triggers?: {
    type: string;
    name: string;
    value: string | number | boolean;
  }[];
}
