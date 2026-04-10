'use client';

import type { Config, DotLottie } from '@lottiefiles/dotlottie-web';
import type { WebGPUConfig } from '@lottiefiles/dotlottie-web/webgpu';
import { DotLottie as DotLottieWebGPU } from '@lottiefiles/dotlottie-web/webgpu';
import type { ReactNode } from 'react';

import type { BaseDotLottieProps } from '../base-dotlottie-react';
import { BaseDotLottieReact } from '../base-dotlottie-react';

export type DotLottieReactProps = Omit<BaseDotLottieProps<DotLottie>, 'createDotLottie'> & {
  device?: GPUDevice;
};

export const DotLottieReact = ({ device, ...props }: DotLottieReactProps): ReactNode => {
  const createDotLottie = (config: Config): DotLottie =>
    new DotLottieWebGPU({ ...config, device } as unknown as WebGPUConfig) as unknown as DotLottie;

  return <BaseDotLottieReact {...props} createDotLottie={createDotLottie} />;
};

export type * from '@lottiefiles/dotlottie-web';
export type { WebGPUConfig } from '@lottiefiles/dotlottie-web/webgpu';

export const setWasmUrl = (url: string): void => {
  DotLottieWebGPU.setWasmUrl(url);
};
