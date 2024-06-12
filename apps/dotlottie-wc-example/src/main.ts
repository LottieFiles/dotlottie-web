import { setWasmUrl } from '@lottiefiles/dotlottie-wc';
import type { DotLottieWC } from '@lottiefiles/dotlottie-wc';

import wasmUrl from '../../../packages/web/src/core/dotlottie-player.wasm?url';

setWasmUrl(wasmUrl);

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <button id="play">play</button>
    <button id="pause">pause</button>
    <button id="stop">stop</button>
  `;
}

const dotlottieComponent = document.querySelector('dotlottie-wc') as DotLottieWC;

const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');
const stopButton = document.querySelector('#stop');

if (playButton) {
  playButton.addEventListener('click', () => {
    dotlottieComponent.dotLottie?.play();
  });
}

if (pauseButton) {
  pauseButton.addEventListener('click', () => {
    dotlottieComponent.dotLottie?.pause();
  });
}

if (stopButton) {
  stopButton.addEventListener('click', () => {
    dotlottieComponent.dotLottie?.stop();
  });
}
