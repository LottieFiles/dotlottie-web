import type { Config, DotLottie } from '@lottiefiles/dotlottie-web';
import { type ComponentProps, type JSX, createEffect, splitProps } from 'solid-js';

import { useDotLottie } from './use-dotlottie';

export type DotLottieSolidProps = Omit<Config, 'canvas'> &
  ComponentProps<'canvas'> &
  Partial<{
    dotLottieRefCallback: (dotLottie: DotLottie) => void;
    playOnHover: boolean;
    themeData?: string;
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

  createEffect(() => {
    if (typeof dotLottieProps.dotLottieRefCallback === 'function' && dotLottie()) {
      dotLottieProps.dotLottieRefCallback(dotLottie() as DotLottie);
    }
  });

  return <DotLottieComponent {...restProps} />;
};
