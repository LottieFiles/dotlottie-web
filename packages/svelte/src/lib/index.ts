import { DotLottie } from '@lottiefiles/dotlottie-web';

export type * from '@lottiefiles/dotlottie-web';
export { default as DotLottieSvelte } from './Dotlottie.svelte';

export const setWasmUrl = (url: string): void => {
  DotLottie.setWasmUrl(url);
};
