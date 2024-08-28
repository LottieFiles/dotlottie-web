'use client';

import type { DotLottieWorker, Config } from '@lottiefiles/dotlottie-web';
import type { ComponentProps, RefCallback } from 'react';
import React from 'react';

import { useDotLottieWorker } from './use-dotlottie-worker';
import useStableCallback from './use-stable-callback';

export type DotLottieWorkerReactProps = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> & {
    animationId?: string;
    dotLottieRefCallback?: RefCallback<DotLottieWorker | null>;
    playOnHover?: boolean;
    themeData?: string;
    themeId?: string;
    workerId?: string;
  };

export const DotLottieWorkerReact = ({
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
}: DotLottieWorkerReactProps): JSX.Element => {
  const { DotLottieComponent, dotLottie } = useDotLottieWorker({
    workerId,
    data,
    mode,
    speed,
    src,
    autoplay,
    loop,
    segment,
    renderConfig,
    backgroundColor,
    useFrameInterpolation,
    playOnHover,
    marker,
    themeId,
    animationId,
    themeData,
  });

  const stableDotLottieRefCallback =
    typeof dotLottieRefCallback === 'function' ? useStableCallback(dotLottieRefCallback) : undefined;

  React.useEffect(() => {
    if (typeof stableDotLottieRefCallback === 'function') {
      stableDotLottieRefCallback(dotLottie);
    }
  }, [stableDotLottieRefCallback, dotLottie]);

  return <DotLottieComponent {...props} />;
};
