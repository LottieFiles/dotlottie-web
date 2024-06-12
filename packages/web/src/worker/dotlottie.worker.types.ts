import type { Config, Mode } from '../dotlottie';

export interface CreateMessage {
  payload: {
    config: Config;
    id: string;
  };
  type: 'create';
}

export interface PlayMessage {
  payload: {
    id: string;
  };
  type: 'play';
}

export interface PauseMessage {
  payload: {
    id: string;
  };
  type: 'pause';
}

export interface StopMessage {
  payload: {
    id: string;
  };
  type: 'stop';
}

export interface DestroyMessage {
  payload: {
    id: string;
  };
  type: 'destroy';
}

export interface SetFrameMessage {
  payload: {
    frame: number;
    id: string;
  };
  type: 'setFrame';
}

export interface SetSpeedMessage {
  payload: {
    id: string;
    speed: number;
  };
  type: 'setSpeed';
}

export interface LoadMessage {
  payload: {
    config: Omit<Config, 'canvas'>;
    id: string;
  };
  type: 'load';
}

export interface SetModeMessage {
  payload: {
    id: string;
    mode: Mode;
  };
  type: 'setMode';
}

export interface LoadEventMessage {
  payload: {
    config: Omit<Config, 'canvas'>;
    id: string;
  };
  type: 'load';
}

export interface ResizeMessage {
  payload: {
    height: number;
    id: string;
    width: number;
  };
  type: 'resize';
}

export type WorkerMessage =
  | LoadEventMessage
  | CreateMessage
  | PlayMessage
  | PauseMessage
  | StopMessage
  | DestroyMessage
  | SetFrameMessage
  | SetSpeedMessage
  | LoadMessage
  | SetModeMessage
  | ResizeMessage;
