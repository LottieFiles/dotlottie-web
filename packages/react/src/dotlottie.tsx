'use client';

import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import type { JSX } from 'react';

import type { BaseDotLottieProps } from './base-dotlottie-react';
import { BaseDotLottieReact } from './base-dotlottie-react';

export type DotLottieReactProps = Omit<BaseDotLottieProps<DotLottie>, 'createDotLottie'>;

const createDotLottie = (config: Config): DotLottie => new DotLottie(config);

export const DotLottieReact = (props: DotLottieReactProps): JSX.Element => {
  return <BaseDotLottieReact {...props} createDotLottie={createDotLottie} />;
};
