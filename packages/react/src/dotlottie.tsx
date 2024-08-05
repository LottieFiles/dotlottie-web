'use client';

import type { DotLottie, Config } from '@lottiefiles/dotlottie-web';
import type { ComponentProps, RefCallback } from 'react';
import React from 'react';

import { useDotLottie } from './use-dotlottie';
import useStableCallback from './use-stable-callback';

export type DotLottieReactProps = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> & {
    animationId?: string;
    autoResizeCanvas?: boolean;
    dotLottieRefCallback?: RefCallback<DotLottie>;
    playOnHover?: boolean;
    themeData?: string;
    themeId?: string;
  };

export const DotLottieReact = ({
  animationId,
  autoResizeCanvas = true,
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
}: DotLottieReactProps): JSX.Element => {
  const { DotLottieComponent, dotLottie } = useDotLottie({
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
    autoResizeCanvas,
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
