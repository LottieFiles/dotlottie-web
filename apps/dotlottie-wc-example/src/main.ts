import { setWasmUrl } from '@lottiefiles/dotlottie-wc';
import type { DotLottieWC } from '@lottiefiles/dotlottie-wc';

// eslint-disable-next-line node/no-unsupported-features/node-builtins
setWasmUrl(new URL('../../../packages/web/src/core/dotlottie-player.wasm', import.meta.url).href);

const elementName = 'dotlottie-wc';

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  app.innerHTML = `
    <button id="play">Play</button>
    <button id="pause">Pause</button>
    <button id="stop">Stop</button>
    <button id="create">Create</button>
    <button id="destroy">Destroy</button>
    <button id="sm">Load SM</button>
    <button id="move">Move</button>
    <div id="container"></div>
  `;
}

const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');
const stopButton = document.querySelector('#stop');
const createButton = document.querySelector('#create');
const destroyButton = document.querySelector('#destroy');
const loadSmButton = document.querySelector('#sm');
const moveButton = document.querySelector('#move');
const container = document.querySelector('#container');

if (playButton) {
  playButton.addEventListener('click', () => {
    (document.querySelector(elementName) as DotLottieWC).dotLottie?.play();
  });
}

if (pauseButton) {
  pauseButton.addEventListener('click', () => {
    (document.querySelector(elementName) as DotLottieWC).dotLottie?.pause();
  });
}

if (stopButton) {
  stopButton.addEventListener('click', () => {
    (document.querySelector(elementName) as DotLottieWC).dotLottie?.stop();
  });
}

function create(): void {
  const dotlottieComponent = document.createElement(elementName) as DotLottieWC;

  dotlottieComponent.src = '/sm_star_rating.lottie';
  dotlottieComponent.loop = true;
  dotlottieComponent.autoplay = true;
  container?.appendChild(dotlottieComponent);
}

function loadSM(): void {
  const dotlottieComponent = document.querySelector(elementName) as DotLottieWC;

  dotlottieComponent.dotLottie?.pause();
  dotlottieComponent.setAttribute('stateMachineId', 'starRating');
}

function destroy(): void {
  const dotlottieComponent = document.querySelector(elementName) as DotLottieWC;

  dotlottieComponent.remove();
}

function move(): void {
  const dotlottieComponent = document.querySelector(elementName) as DotLottieWC;

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

if (loadSmButton) {
  loadSmButton.addEventListener('click', () => {
    loadSM();
  });
}

if (moveButton) {
  moveButton.addEventListener('click', () => {
    move();
  });
}
