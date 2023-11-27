/**
 * Copyright 2023 Design Barn Inc.
 */

/* eslint-disable no-secrets/no-secrets */

import './styles.css';
import type { Mode } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';

import wasmUrl from '../../../packages/web/dist/renderer.wasm?url';

const app = document.getElementById('app') as HTMLDivElement;

app.innerHTML = `
<div class="grid">
  
</div>

<div class="container">
  <canvas id="canvas"></canvas>
  <div class="control-panel">
    <button id="playPause" class="control-button">Play</button>
    <button id="stop" class="control-button">Stop</button>
    
    <label for="frameSlider">Frame: <span id="current-frame">0</span></label>
    <input type="range" id="frameSlider" min="0" step="0.1" />

    <label for="loopToggle">Loop: </label>
    <input type="checkbox" id="loopToggle" checked />
    <label for="speed" class="speed-label">Speed: <span id="speed-value">x1</span></label>
    <input type="range" id="speed" min="0.1" max="5" step="0.1" value="1" class="speed-slider" />
    <button id="jump" class="control-button">Jump</button>
    <button id="destroy" class="control-button" style="background: #cd3434;">Destroy</button>
    <button id="reload" class="control-button">Reload</button>
    <label for="mode">Mode: </label>
    <select id="mode">
      <option value="bounce">Bounce</option>
      <option value="bounce-reverse">Bounce Reverse</option>
      <option value="reverse">Reverse</option>
      <option value="forward">Forward</option>
    </select>
    <div class="segments-control">
      <label for="startFrame">Start Frame: </label>
      <input type="number" id="startFrame" value="10" min="0" />

      <label for="endFrame">End Frame: </label>
      <input type="number" id="endFrame" value="90" min="0" />

      <button id="setSegments" class="control-button">Set Segments</button>
    </div>
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
      segments: [10, 90],
      speed: 1,
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
    const jumpButton = document.getElementById('jump') as HTMLButtonElement;
    const modeSelect = document.getElementById('mode') as HTMLSelectElement;
    const startFrameInput = document.getElementById('startFrame') as HTMLInputElement;
    const endFrameInput = document.getElementById('endFrame') as HTMLInputElement;
    const setSegmentsButton = document.getElementById('setSegments') as HTMLButtonElement;

    setSegmentsButton.addEventListener('click', () => {
      const startFrame = parseInt(startFrameInput.value, 10);
      const endFrame = parseInt(endFrameInput.value, 10);

      dotLottie.setSegments(startFrame, endFrame);
    });

    modeSelect.addEventListener('change', () => {
      dotLottie.setMode(modeSelect.value.toString() as Mode);
    });

    jumpButton.addEventListener('click', () => {
      const startFrame = parseInt(dotLottie.segments[0].toString(), 10);
      const endFrame = parseInt(dotLottie.segments[1].toString(), 10);

      const midFrame = (endFrame - startFrame) / 2 + startFrame;

      dotLottie.setFrame(midFrame);
    });

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
      if (dotLottie.isPlaying) {
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
      frameSlider.max = dotLottie.totalFrames.toString();
      playPauseButton.innerText = 'Pause';
    });

    dotLottie.addEventListener('pause', (event) => {
      console.log(event);
      playPauseButton.innerText = 'Play';
    });

    dotLottie.addEventListener('frame', (event) => {
      const frame = parseFloat(event.currentFrame.toFixed(2));

      frameSlider.value = frame.toString();
      currentFrameSpan.textContent = frame.toString();
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
