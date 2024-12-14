'use client';

import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

import { BaseDotLottieReact } from './base-dotlottie-react';
import type { BaseDotLottieProps } from './base-dotlottie-react';

export type DotLottieWorkerReactProps = Omit<BaseDotLottieProps<DotLottieWorker>, 'createDotLottie'>;

const createDotLottieWorker = (config: Config & { workerId?: string }): DotLottieWorker => new DotLottieWorker(config);

export const DotLottieWorkerReact = (props: DotLottieWorkerReactProps): JSX.Element => {
  return <BaseDotLottieReact {...props} createDotLottie={createDotLottieWorker} />;
};
