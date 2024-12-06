import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';

export * from './dotlottie-wc';
export * from './dotlottie-worker-wc';

export const setWasmUrl = (url: string): void => {
  // Consider refactoring setWasmUrl to a named export for improved tree-shaking efficiency
  DotLottie.setWasmUrl(url);
  DotLottieWorker.setWasmUrl(url);
};
