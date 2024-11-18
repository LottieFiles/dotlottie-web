import './styles.css';
import { DotLottie } from '@lottiefiles/dotlottie-web';

import wasmUrl from '../../../packages/web/dist/dotlottie-player.wasm?url';

const app = document.getElementById('app') as HTMLDivElement;

const baseUrl = window.location.origin + import.meta.env.BASE_URL;

app.innerHTML = `

<div class="container">
  <canvas style="width: 800px; height: 400px;" id="canvas"></canvas>
</div>
`;

/**
 * This is only required for testing the local version of the renderer
 */
DotLottie.setWasmUrl(`${baseUrl}${wasmUrl}`);

/**
 * Load all canvas elements with data-src attribute
 */

let stateMachineData: string;

fetch('./interactivity/star-hover/star_hover.json')
  .then(async (res) => res.json())
  .then((data) => {
    stateMachineData = data;
  })
  .catch(console.error);

fetch('./interactivity/star-hover/star_hover.lottie')
  .then(async (res) => res.arrayBuffer())
  .then((data): void => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    const dotLottie = new DotLottie({
      canvas,
      data,
      loop: true,
      autoplay: true,
      speed: 1,
    });

    dotLottie.addEventListener('load', () => {
      const sm = dotLottie.loadStateMachineData(stateMachineData);

      if (sm) {
        dotLottie.startStateMachine();
      }
    });

    canvas.addEventListener('mousedown', () => {
      // dotLottie.postStateMachineEvent('OnPointerDown: 0.0 0.0');
    });

    dotLottie.addEventListener('loadError', console.error);
  })
  .catch(console.error);
