import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';

export * from './dotlottie';
export type * from '@lottiefiles/dotlottie-web';
export * from './dotlottie-worker';

export const setWasmUrl = (url: string): void => {
  DotLottieWorker.setWasmUrl(url);
  DotLottie.setWasmUrl(url);
};
