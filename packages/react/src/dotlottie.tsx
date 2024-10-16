'use client';

import type { DotLottie, Config } from '@lottiefiles/dotlottie-web';
import type { ComponentProps, RefCallback } from 'react';
import React from 'react';

import { useDotLottie } from './use-dotlottie';
import useStableCallback from './use-stable-callback';

export type DotLottieReactProps = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> & {
    animationId?: string;
    dotLottieRefCallback?: RefCallback<DotLottie>;
    playOnHover?: boolean;
    themeData?: string;
    themeId?: string;
  };

export const DotLottieReact = ({
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
}: DotLottieReactProps): JSX.Element => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const { dotLottie } = useDotLottie({
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
    canvasRef,
  });

  const stableDotLottieRefCallback =
    typeof dotLottieRefCallback === 'function' ? useStableCallback(dotLottieRefCallback) : undefined;

  React.useEffect(() => {
    if (typeof stableDotLottieRefCallback === 'function') {
      stableDotLottieRefCallback(dotLottie);
    }
  }, [stableDotLottieRefCallback, dotLottie]);

  return <canvas ref={canvasRef} {...props} />;
};
