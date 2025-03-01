'use client';

import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';

export * from './dotlottie';
export type * from '@lottiefiles/dotlottie-web';
export * from './dotlottie-worker';

/**
 * Set the URL for the WASM file used by the standard renderer
 * @param url - The URL of the WASM file
 */
export const setWasmUrl = (url: string): void => {
  DotLottieWorker.setWasmUrl(url);
  DotLottie.setWasmUrl(url);
};
