import { setWasmUrl } from '@lottiefiles/dotlottie-wc';
import type { DotLottieWC } from '@lottiefiles/dotlottie-wc';

import wasmUrl from '../../../packages/web/src/core/dotlottie-player.wasm?url';

setWasmUrl(wasmUrl);

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <button id="play">Play</button>
    <button id="pause">Pause</button>
    <button id="stop">Stop</button>
    <button id="create">Create</button>
    <button id="destroy">Destroy</button>
    <button id="move">Move</button>
    <div id="container"></div>
  `;
}

const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');
const stopButton = document.querySelector('#stop');
const createButton = document.querySelector('#create');
const destroyButton = document.querySelector('#destroy');
const moveButton = document.querySelector('#move');
const container = document.querySelector('#container');

if (playButton) {
  playButton.addEventListener('click', () => {
    (document.querySelector('dotlottie-wc') as DotLottieWC).dotLottie?.play();
  });
}

if (pauseButton) {
  pauseButton.addEventListener('click', () => {
    (document.querySelector('dotlottie-wc') as DotLottieWC).dotLottie?.pause();
  });
}

if (stopButton) {
  stopButton.addEventListener('click', () => {
    (document.querySelector('dotlottie-wc') as DotLottieWC).dotLottie?.stop();
  });
}

function create(): void {
  const dotlottieComponent = document.createElement('dotlottie-wc') as DotLottieWC;

  // eslint-disable-next-line no-secrets/no-secrets
  dotlottieComponent.src = 'https://lottie.host/0e2d86ab-604d-4fc4-8512-d44a30eb81a8/YFj05ZHqHA.json';
  dotlottieComponent.autoplay = true;
  dotlottieComponent.loop = true;
  container?.appendChild(dotlottieComponent);
}

function destroy(): void {
  const dotlottieComponent = document.querySelector('dotlottie-wc') as DotLottieWC;

  dotlottieComponent.remove();
}

function move(): void {
  const dotlottieComponent = document.querySelector('dotlottie-wc') as DotLottieWC;

  dotlottieComponent.remove();
  setTimeout(() => {
    container?.appendChild(dotlottieComponent);

    // delay to simulate moving the component
  }, 1000);
}

if (createButton) {
  createButton.addEventListener('click', () => {
    create();
  });
}

if (destroyButton) {
  destroyButton.addEventListener('click', () => {
    destroy();
  });
}

if (moveButton) {
  moveButton.addEventListener('click', () => {
    move();
  });
}
