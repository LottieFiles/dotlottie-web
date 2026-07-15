import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';

export const setWasmUrl = (url: string): void => {
  DotLottie.setWasmUrl(url);
  DotLottieWorker.setWasmUrl(url);
};
