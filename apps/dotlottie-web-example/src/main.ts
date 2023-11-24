/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable no-secrets/no-secrets */

import './styles.css';
import { DotLottie } from '@lottiefiles/dotlottie-web';

import wasmUrl from '../../../packages/web/dist/renderer.wasm?url';

const app = document.getElementById('app') as HTMLDivElement;

app.innerHTML = `
<div class="grid">
  <canvas data-bg-color="green" data-src="https://lottie.host/1cf72a35-6d88-4d9a-9961-f1bb88087f2c/miJIHiyH4Q.lottie"></canvas>
  <canvas data-src="https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json"></canvas>
  <canvas data-src="https://lottie.host/a7421582-4733-49e5-9f77-e8d4cd792239/WZQjpo4uZR.lottie"></canvas>
  <canvas data-src="https://lottie.host/e2a24b6f-df7f-4fc5-94ea-30f0846f85dc/1RLOR2g0m3.lottie"></canvas>
  <canvas data-src="https://lottie.host/35326116-a8ca-4219-81ca-df9ce56a3f22/zCGFevEA23.lottie"></canvas>
  <canvas data-src="https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie"></canvas>
  <canvas data-src="/down.json"></canvas>
  <canvas data-src="/dragon.json"></canvas>
  <canvas data-src="/editor.json"></canvas>
  <canvas data-src="/growup.json"></canvas>
  <canvas data-src="/hamster.lottie"></canvas>
  <canvas data-src="/like.json"></canvas>
  <canvas data-src="/lolo.json"></canvas>
  <canvas data-src="/walker.json"></canvas>
  <canvas data-src="/waves.json"></canvas>
  <canvas data-src="/woman.json"></canvas>
</div>

<div class="container">
  <canvas id="canvas"></canvas>
  <div class="control-panel">
    <button id="playPause" class="control-button">Play</button>
    <button id="stop" class="control-button">Stop</button>
    
    <label for="frameSlider">Frame: <span id="current-frame">0</span></label>
    <input type="range" id="frameSlider" min="0" step="1" />

    <label for="loopToggle">Loop: </label>
    <input type="checkbox" id="loopToggle" checked />
    <label for="speed" class="speed-label">Speed: <span id="speed-value">x1</span></label>
    <input type="range" id="speed" min="0.1" max="5" step="0.1" value="1" class="speed-slider" />
    <button id="destroy" class="control-button" style="background: #cd3434;">Destroy</button>
    <button id="reload" class="control-button">Reload</button>
  </div>
</div>
`;

/**
 * This is only required for testing the local version of the renderer
 */
DotLottie.setWasmUrl(wasmUrl);

/**
 * Load all canvas elements with data-src attribute
 */
const allCanvas = document.querySelectorAll('canvas[data-src]') as NodeListOf<HTMLCanvasElement>;

allCanvas.forEach((canvas) => {
  const src = canvas.getAttribute('data-src') as string;
  const backgroundColor = canvas.getAttribute('data-bg-color') as string;

  // eslint-disable-next-line no-new
  new DotLottie({
    canvas,
    src,
    loop: true,
    autoplay: true,
    backgroundColor,
  });
});

fetch('/hamster.lottie')
  .then(async (res) => res.arrayBuffer())
  .then((data): void => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    const dotLottie = new DotLottie({
      canvas,
      // src: 'https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie',
      // src: '/lolo.json',
      data,
      loop: true,
      autoplay: true,
      mode: 'bounce',
      backgroundColor: 'purple',
    });

    const playPauseButton = document.getElementById('playPause') as HTMLButtonElement;
    const stopButton = document.getElementById('stop') as HTMLButtonElement;
    const currentFrameSpan = document.getElementById('current-frame') as HTMLSpanElement;
    const frameSlider = document.getElementById('frameSlider') as HTMLInputElement;
    const loopToggle = document.getElementById('loopToggle') as HTMLInputElement;
    const speedSlider = document.getElementById('speed') as HTMLInputElement;
    const speedValueSpan = document.getElementById('speed-value') as HTMLSpanElement;
    const destroyButton = document.getElementById('destroy') as HTMLButtonElement;
    const reloadButton = document.getElementById('reload') as HTMLButtonElement;

    destroyButton.addEventListener('click', () => {
      canvas.remove();

      dotLottie.destroy();
    });

    reloadButton.addEventListener('click', () => {
      dotLottie.load({
        src: 'https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie',
        loop: true,
        autoplay: true,
        mode: 'bounce-reverse',
      });
    });

    playPauseButton.addEventListener('click', () => {
      if (dotLottie.playing) {
        dotLottie.pause();
      } else {
        dotLottie.play();
      }
    });

    stopButton.addEventListener('click', () => {
      dotLottie.stop();
    });

    frameSlider.addEventListener('mousedown', () => {
      dotLottie.pause();
    });

    frameSlider.addEventListener('input', () => {
      const frame = frameSlider.valueAsNumber;

      dotLottie.setFrame(frame);
    });

    frameSlider.addEventListener('mouseup', () => {
      dotLottie.play();
    });

    loopToggle.addEventListener('change', () => {
      dotLottie.setLoop(!dotLottie.loop);
    });

    // Speed control
    speedSlider.addEventListener('input', () => {
      speedValueSpan.textContent = `x${parseFloat(speedSlider.value).toFixed(2)}`;

      dotLottie.setSpeed(parseFloat(speedSlider.value));
    });

    dotLottie.addEventListener('load', (event) => {
      console.log(event);
    });

    dotLottie.addEventListener('loadError', (event) => {
      console.log(event);
    });

    dotLottie.addEventListener('play', (event) => {
      console.log(event);
      frameSlider.max = (dotLottie.totalFrames - 1).toString();
      playPauseButton.innerText = 'Pause';
    });

    dotLottie.addEventListener('pause', (event) => {
      console.log(event);
      playPauseButton.innerText = 'Play';
    });

    dotLottie.addEventListener('frame', (event) => {
      const roundedFrame = Math.round(event.currentFrame);

      frameSlider.value = roundedFrame.toString();
      currentFrameSpan.textContent = roundedFrame.toString();
    });

    dotLottie.addEventListener('loop', (event) => {
      console.log(event);
    });

    // Handle complete events
    dotLottie.addEventListener('complete', (event) => {
      console.log(event);

      playPauseButton.innerText = 'Play';
    });

    dotLottie.addEventListener('stop', (event) => {
      console.log(event);

      playPauseButton.innerText = 'Play';
    });
  })
  .catch((error) => {
    console.log(error);
  });
