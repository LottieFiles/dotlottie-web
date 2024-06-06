/**
 * Copyright 2024 Design Barn Inc.
 */

import type { Config, DotLottie } from '@lottiefiles/dotlottie-web';
import { type ComponentProps, type JSX, createEffect, splitProps } from 'solid-js';

import { useDotLottie } from './use-dotlottie';
import useStableCallback from './use-stable-callback';

export type DotLottieSolidProps = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> &
  Partial<{
    autoResizeCanvas: boolean;
    dotLottieRefCallback: (dotLottie: DotLottie) => void;
    playOnHover: boolean;
  }>;

export const DotLottieSolid = (props: DotLottieSolidProps): JSX.Element => {
  const [dotLottieProps, restProps] = splitProps(props, [
    'src',
    'data',
    'mode',
    'loop',
    'speed',
    'marker',
    'segment',
    'autoplay',
    'playOnHover',
    'renderConfig',
    'autoResizeCanvas',
    'dotLottieRefCallback',
    'useFrameInterpolation',
  ]);
  const { DotLottieComponent, dotLottie } = useDotLottie(dotLottieProps);

  const stableDotLottieRefCallback =
    typeof dotLottieProps.dotLottieRefCallback === 'function'
      ? useStableCallback(dotLottieProps.dotLottieRefCallback)
      : undefined;

  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (typeof stableDotLottieRefCallback === 'function' && dotLottieInstance) {
      stableDotLottieRefCallback(dotLottieInstance);
    }
  });

  return <DotLottieComponent {...restProps} />;
};
