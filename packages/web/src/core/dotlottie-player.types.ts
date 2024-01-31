/**
 * Copyright 2024 Design Barn Inc.
 */

export interface VectorFloat {
  delete(): void;
  get(_0: number): unknown;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  push_back(_0: number): void;
  resize(_0: number, _1: number): void;
  set(_0: number, _1: number): boolean;
  size(): number;
}

export interface ModeValue<T extends number> {
  value: T;
}
export type Mode = ModeValue<1> | ModeValue<2> | ModeValue<3> | ModeValue<4>;

export interface DotLottiePlayer {
  buffer(): unknown;
  clear(): void;
  config(): Config;
  currentFrame(): number;
  delete(): void;
  duration(): number;
  isComplete(): boolean;
  isLoaded(): boolean;
  isPaused(): boolean;
  isPlaying(): boolean;
  isStopped(): boolean;
  loadAnimation(_0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string, _1: number, _2: number): boolean;
  loadAnimationData(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: number,
    _2: number,
  ): boolean;
  loadAnimationPath(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: number,
    _2: number,
  ): boolean;
  loadDotLottieData(
    _0: ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string,
    _1: number,
    _2: number,
  ): boolean;
  loopCount(): number;
  manifestString(): string;
  pause(): boolean;
  play(): boolean;
  render(): boolean;
  requestFrame(): number;
  resize(_0: number, _1: number): boolean;
  setConfig(_0: Config): void;
  setFrame(_0: number): boolean;
  stop(): boolean;
  totalFrames(): number;
}

export interface Config {
  autoplay: boolean;
  backgroundColor: number;
  loopAnimation: boolean;
  mode: Mode;
  segments: VectorFloat;
  speed: number;
  useFrameInterpolation: boolean;
}

export interface MainModule {
  DotLottiePlayer: { new (_0: Config): DotLottiePlayer };
  Mode: { Bounce: ModeValue<3>; Forward: ModeValue<1>; Reverse: ModeValue<2>; ReverseBounce: ModeValue<4> };
  VectorFloat: { new (): VectorFloat };
}
