/**
 * Copyright 2023 Design Barn Inc.
 */

import type { DotLottie, Config } from '@lottiefiles/dotlottie-web';
import type { ComponentProps, RefCallback } from 'react';
import React from 'react';

import { useDotLottie } from './use-dotlottie';
import useStableCallback from './use-stable-callback';

export type DotLottieComponentProps = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> & {
    dotLottieRefCallback?: RefCallback<DotLottie>;
    playOnHover?: boolean;
  };

export const DotLottieReact = ({
  autoplay,
  backgroundColor,
  data,
  dotLottieRefCallback,
  loop,
  mode,
  playOnHover,
  renderConfig,
  segments,
  speed,
  src,
  useFrameInterpolation,
  ...props
}: DotLottieComponentProps): JSX.Element => {
  const { DotLottieComponent, dotLottie } = useDotLottie({
    data,
    mode,
    speed,
    src,
    autoplay,
    loop,
    segments,
    renderConfig,
    backgroundColor,
    useFrameInterpolation,
    playOnHover,
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
