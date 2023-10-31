/**
 * Copyright 2023 Design Barn Inc.
 */

import './styles.css';

import { DotLottie } from '@lottiefiles/dotlottie-web';

const app = document.getElementById('app') as HTMLDivElement;

app.innerHTML = `
<canvas id="canvas" width="400" height="400"></canvas>
<div class="control-panel">
  <button class="control-button" id="play">Play</button>
  <button class="control-button" id="pause">Pause</button>
  <button class="control-button" id="stop">Stop</button>
  <label for="speed" class="speed-label">Speed: <span id="speed-value">x1</span></label>
  <input type="range" id="speed" min="0" max="5" step="0.1" value="1" class="speed-slider" />
</div>
`;

const speedSlider = document.getElementById('speed') as HTMLInputElement;
const speedValueSpan = document.getElementById('speed-value') as HTMLSpanElement;

speedSlider.addEventListener('input', () => {
  speedValueSpan.textContent = `x${parseFloat(speedSlider.value).toFixed(2)}`;
});

const dotLottie = new DotLottie({
  autoplay: true,
  loop: true,
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  src: './lolo.json',
});

document.getElementById('play')?.addEventListener('click', () => {
  dotLottie.play();
});

document.getElementById('pause')?.addEventListener('click', () => {
  dotLottie.pause();
});

document.getElementById('stop')?.addEventListener('click', () => {
  dotLottie.stop();
});

document.getElementById('speed')?.addEventListener('input', (event) => {
  dotLottie.speed(Number((event.target as HTMLInputElement).valueAsNumber));
});
