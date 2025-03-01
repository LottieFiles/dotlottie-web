'use client';

import type { Config } from '@lottiefiles/dotlottie-web/webgl';
import { DotLottie } from '@lottiefiles/dotlottie-web/webgl';
import type { JSX } from 'react';

import type { BaseDotLottieProps } from '../base-dotlottie-react';
import { BaseDotLottieReact } from '../base-dotlottie-react';

export type DotLottieReactProps = Omit<BaseDotLottieProps<DotLottie>, 'createDotLottie'>;

const createDotLottie = (config: Config): DotLottie => new DotLottie(config);

export const DotLottieReact = (props: DotLottieReactProps): JSX.Element => {
  return <BaseDotLottieReact {...props} createDotLottie={createDotLottie} />;
};

/**
 * Set the URL for the WASM file used by the webgl renderer
 * @param url - The URL of the WASM file
 */
export const setWasmUrl = (url: string): void => {
  DotLottie.setWasmUrl(url);
};
