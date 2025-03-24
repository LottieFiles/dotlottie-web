import { Config, DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
export * from '@lottiefiles/dotlottie-web';
import { ComponentProps, RefCallback } from 'react';

type DotLottieReactProps = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> & {
    animationId?: string;
    dotLottieRefCallback?: RefCallback<DotLottie>;
    playOnHover?: boolean;
    themeData?: string;
    themeId?: string;
  };
declare const DotLottieReact: ({
  animationId,
  autoplay,
  backgroundColor,
  data,
  dotLottieRefCallback,
  loop,
  marker,
  mode,
  playOnHover,
  renderConfig,
  segment,
  speed,
  src,
  themeData,
  themeId,
  useFrameInterpolation,
  ...props
}: DotLottieReactProps) => JSX.Element;

type DotLottieConfig = Omit<Config, 'canvas'> & {
  animationId?: string;
  playOnHover?: boolean;
  themeData?: string;
  themeId?: string;
};
interface UseDotLottieResult {
  DotLottieComponent: (props: ComponentProps<'canvas'>) => JSX.Element;
  canvas: HTMLCanvasElement | null;
  container: HTMLDivElement | null;
  dotLottie: DotLottie | null;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLDivElement>;
}
declare const useDotLottie: (config?: DotLottieConfig) => UseDotLottieResult;

type DotLottieWorkerConfig = Omit<Config, 'canvas'> & {
  animationId?: string;
  playOnHover?: boolean;
  themeData?: string;
  themeId?: string;
  workerId?: string;
};
interface UseDotLottieWorkerResult {
  DotLottieComponent: (props: ComponentProps<'canvas'>) => JSX.Element;
  canvas: HTMLCanvasElement | null;
  container: HTMLDivElement | null;
  dotLottie: DotLottieWorker | null;
  setCanvasRef: RefCallback<HTMLCanvasElement>;
  setContainerRef: RefCallback<HTMLDivElement>;
}
declare const useDotLottieWorker: (config?: DotLottieWorkerConfig) => UseDotLottieWorkerResult;

type DotLottieWorkerReactProps = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> & {
    animationId?: string;
    dotLottieRefCallback?: RefCallback<DotLottieWorker | null>;
    playOnHover?: boolean;
    themeData?: string;
    themeId?: string;
    workerId?: string;
  };
declare const DotLottieWorkerReact: ({
  animationId,
  autoplay,
  backgroundColor,
  data,
  dotLottieRefCallback,
  loop,
  marker,
  mode,
  playOnHover,
  renderConfig,
  segment,
  speed,
  src,
  themeData,
  themeId,
  useFrameInterpolation,
  workerId,
  ...props
}: DotLottieWorkerReactProps) => JSX.Element;

declare const setWasmUrl: (url: string) => void;

export {
  type DotLottieConfig,
  DotLottieReact,
  type DotLottieReactProps,
  type DotLottieWorkerConfig,
  DotLottieWorkerReact,
  type DotLottieWorkerReactProps,
  type UseDotLottieResult,
  type UseDotLottieWorkerResult,
  setWasmUrl,
  useDotLottie,
  useDotLottieWorker,
};
