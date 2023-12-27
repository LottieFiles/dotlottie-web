/**
 * Copyright 2023 Design Barn Inc.
 */

import type { DotLottie, Config } from '@lottiefiles/dotlottie-web';
import type { ComponentProps, RefCallback } from 'react';
import React from 'react';

import { useDotLottie } from './use-dotlottie';

export type { DotLottie };

export type DotLottieComponentProps = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> & {
    dotLottieRefCallback?: RefCallback<DotLottie>;
  };

export const DotLottieReact = ({
  autoplay,
  backgroundColor,
  data,
  dotLottieRefCallback,
  loop,
  mode,
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
  });

  React.useEffect(() => {
    if (typeof dotLottieRefCallback === 'function') {
      dotLottieRefCallback(dotLottie);
    }
  }, [dotLottieRefCallback, dotLottie]);

  return <DotLottieComponent {...props} />;
};
