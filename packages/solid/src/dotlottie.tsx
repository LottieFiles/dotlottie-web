import type { Config, DotLottie } from '@lottiefiles/dotlottie-web';
import { type ComponentProps, type JSX, createEffect, splitProps } from 'solid-js';

import { useDotLottie } from './use-dotlottie';
import useStableCallback from './use-stable-callback';

export type DotLottieSolidProps = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> &
  Partial<{
    animationId?: string;
    dotLottieRefCallback: (dotLottie: DotLottie) => void;
    playOnHover: boolean;
    themeData?: string;
    themeId?: string;
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
    'themeId',
    'autoplay',
    'themeData',
    'playOnHover',
    'animationId',
    'renderConfig',
    'dotLottieRefCallback',
    'useFrameInterpolation',
  ]);

  const { DotLottieComponent, dotLottie } = useDotLottie(dotLottieProps);

  const stableDotLottieRefCallback =
    typeof dotLottieProps.dotLottieRefCallback === 'function'
      ? useStableCallback(dotLottieProps.dotLottieRefCallback)
      : undefined;

  createEffect(() => {
    if (typeof stableDotLottieRefCallback === 'function' && dotLottie()) {
      stableDotLottieRefCallback(dotLottie() as DotLottie);
    }
  });

  return <DotLottieComponent {...restProps} />;
};
