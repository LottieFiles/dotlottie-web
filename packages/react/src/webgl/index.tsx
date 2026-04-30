'use client';

import type { Config, DotLottie } from '@lottiefiles/dotlottie-web';
import type { WebGLConfig } from '@lottiefiles/dotlottie-web/webgl';
import { DotLottie as DotLottieWebGL } from '@lottiefiles/dotlottie-web/webgl';
import type { ReactNode } from 'react';

import type { BaseDotLottieProps } from '../base-dotlottie-react';
import { BaseDotLottieReact } from '../base-dotlottie-react';

export type DotLottieReactProps = Omit<BaseDotLottieProps<DotLottie>, 'createDotLottie'>;

const createDotLottie = (config: Config): DotLottie =>
  new DotLottieWebGL(config as unknown as WebGLConfig) as unknown as DotLottie;

export const DotLottieReact = (props: DotLottieReactProps): ReactNode => {
  return <BaseDotLottieReact {...props} createDotLottie={createDotLottie} />;
};

export type * from '@lottiefiles/dotlottie-web';
export type { WebGLConfig } from '@lottiefiles/dotlottie-web/webgl';

export const setWasmUrl = (url: string): void => {
  DotLottieWebGL.setWasmUrl(url);
};
