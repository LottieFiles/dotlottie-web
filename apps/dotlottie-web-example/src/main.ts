/**
 * Copyright 2023 Design Barn Inc.
 */

import './styles.css';
import { DotLottie } from '@lottiefiles/dotlottie-web';

const app = document.getElementById('app') as HTMLDivElement;

app.innerHTML = `
<canvas id="canvas" width="400" height="400"></canvas>
<div class="control-panel">
  <button id="playPause" class="control-button">Play</button>
  <button id="stop" class="control-button">Stop</button>
  
  <label for="frameSlider">Frame: <span id="current-frame">0</span></label>
  <input type="range" id="frameSlider" min="0" step="1" />

  <label for="loopToggle">Loop: </label>
  <input type="checkbox" id="loopToggle" checked />
  <label for="speed" class="speed-label">Speed: <span id="speed-value">x1</span></label>
  <input type="range" id="speed" min="0.1" max="5" step="0.1" value="1" class="speed-slider" />
</div>
`;

fetch('/hamster.lottie')
  .then(async (res) => res.arrayBuffer())
  .then((data): void => {
    const dotLottie = new DotLottie({
      canvas: document.getElementById('canvas') as HTMLCanvasElement,
      // eslint-disable-next-line no-secrets/no-secrets
      // src: 'https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie',
      // src: '/lolo.json',
      data,
      loop: true,
      autoplay: true,
    });

    const playPauseButton = document.getElementById('playPause') as HTMLButtonElement;
    const stopButton = document.getElementById('stop') as HTMLButtonElement;
    const currentFrameSpan = document.getElementById('current-frame') as HTMLSpanElement;
    const frameSlider = document.getElementById('frameSlider') as HTMLInputElement;
    const loopToggle = document.getElementById('loopToggle') as HTMLInputElement;
    const speedSlider = document.getElementById('speed') as HTMLInputElement;
    const speedValueSpan = document.getElementById('speed-value') as HTMLSpanElement;

    playPauseButton.addEventListener('click', () => {
      if (dotLottie.playing) {
        dotLottie.pause();
      } else {
        dotLottie.play();
      }
    });

    stopButton.addEventListener('click', () => {
      dotLottie.stop();
      playPauseButton.innerText = 'Play';
      frameSlider.value = '0';
    });

    frameSlider.addEventListener('input', () => {
      const frame = frameSlider.valueAsNumber;

      dotLottie.pause();
      dotLottie.setFrame(frame);
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
    });
  })
  .catch((error) => {
    console.log(error);
  });
