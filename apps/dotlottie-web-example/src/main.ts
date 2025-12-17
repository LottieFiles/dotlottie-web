import { DotLottie } from '@lottiefiles/dotlottie-web';
import wasmUrl from '../../../packages/web/dist/dotlottie-player.wasm?url';

const WIDTH = 512;
const HEIGHT = 512;
const ANIMATION_NAME = 'magic_wand';
const BINDING_FILE_NAME = 'magic_wand_binding';

const baseUrl = window.location.origin + import.meta.env.BASE_URL;

const app = document.getElementById('app') as HTMLDivElement;

app.innerHTML = `
<div class="container" style="display: flex; justify-content: center; align-items: center; height: 100vh;">
  <canvas id="canvas" style="width: ${WIDTH}px; height: ${HEIGHT}px;"></canvas>
</div>
`;

DotLottie.setWasmUrl(`${baseUrl}${wasmUrl}`);

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const dotLottie = new DotLottie({
    canvas,
    src: `${baseUrl}/magic-wand/${ANIMATION_NAME}.lottie`,
    loop: true,
    autoplay: true,
    backgroundColor: '#ffffffff',
  });

  // Load binding file
  const bindingResponse = await fetch(`${baseUrl}/magic-wand/${BINDING_FILE_NAME}.json`);
  const bindingData = await bindingResponse.text();

  dotLottie.addEventListener('load', () => {
    const parse = dotLottie.globalInputsLoadData(bindingData);
    console.log('[Debug]: Loaded inputs:', parse);

    const loaded = dotLottie.stateMachineLoad('wand_sm');
    console.log('[SM] Loaded?', loaded);

    const started = dotLottie.stateMachineStart();
    console.log('[SM] Started?', started);

    const st = dotLottie.setTheme('wand');
    console.log('Set theme:', st);

    const apply = dotLottie.globalInputsStart();
    console.log('[Debug]: Applied inputs:', apply);
  });

  dotLottie.addEventListener('globalInputsVectorChange', (event) => {
    console.log(event.inputName, event.oldValue, event.newValue);
  });

  dotLottie.addEventListener('loadError', console.error);

  // Track mouse state
  let mx = 0;
  let my = 0;
  // let leftDown = false;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mx = (e.clientX - rect.left) * scaleX;
    my = (e.clientY - rect.top) * scaleY;

    dotLottie.globalInputsSetVector('wand_pos', [mx, my]);
  });
}

main().catch(console.error);
