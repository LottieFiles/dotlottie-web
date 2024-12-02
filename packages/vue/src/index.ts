import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';

export * from './dotlottie-vue';
export * from './dotlottie-worker-vue';

export const setWasmUrl = (url: string): void => {
  DotLottie.setWasmUrl(url);
  DotLottieWorker.setWasmUrl(url);
};
