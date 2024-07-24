/* eslint-disable no-secrets/no-secrets */

import './styles.css';
import type { Fit, Mode } from '@lottiefiles/dotlottie-web';
import { DotLottieWorker as DotLottie } from '@lottiefiles/dotlottie-web';

import wasmUrl from '../../../packages/web/dist/dotlottie-player.wasm?url';

const app = document.getElementById('app') as HTMLDivElement;

const baseUrl = window.location.origin + import.meta.env.BASE_URL;

app.innerHTML = `
<div class="grid">
  <canvas data-src="https://lottie.host/b2d44b82-fd7e-401f-a4fa-77999147c0be/vqNwJryGBp.lottie"></canvas>
  <canvas data-bg-color="green" data-src="https://lottie.host/1cf72a35-6d88-4d9a-9961-f1bb88087f2c/miJIHiyH4Q.lottie"></canvas>
  <canvas data-src="https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json"></canvas>
  <canvas data-src="https://lottie.host/a7421582-4733-49e5-9f77-e8d4cd792239/WZQjpo4uZR.lottie"></canvas>
  <canvas data-src="https://lottie.host/e2a24b6f-df7f-4fc5-94ea-30f0846f85dc/1RLOR2g0m3.lottie"></canvas>
  <canvas data-src="https://lottie.host/35326116-a8ca-4219-81ca-df9ce56a3f22/zCGFevEA23.lottie"></canvas>
  <canvas data-src="https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie"></canvas>
  <canvas data-src="${baseUrl}/down.json"></canvas>
  <canvas data-src="${baseUrl}/editor.json"></canvas>
  <canvas data-src="${baseUrl}/growup.json"></canvas>
  <canvas data-src="${baseUrl}/hamster.lottie"></canvas>
  <canvas data-src="${baseUrl}/like.json"></canvas>
  <canvas data-src="${baseUrl}/lolo.json"></canvas>
  <canvas data-src="${baseUrl}/walker.json"></canvas>
  <canvas data-src="${baseUrl}/waves.json"></canvas>
  <canvas data-src="${baseUrl}/woman.json"></canvas>
</div>

<div class="container">
  <canvas style="width: 800px; height: 400px;" id="canvas"></canvas>
  <div class="control-panel">
    <div class="status-panel">
      <div id="playbackStatus">Playback State: <span id="playback-state">Stopped</span></div>
      <div id="freezeStatus">Is Frozen: <span id="is-frozen">No</span></div>
      <div>Active Animation ID: <span id="active-animation">None</span></div>
    </div>
    <div>
      <button id="playPause" class="control-button">Play</button>
      <button id="stop" class="control-button">Stop</button>
      <button id="jump" class="control-button">Jump</button>
      <button id="destroy" class="control-button" style="background: #cd3434;">Destroy</button>
      <button id="reload" class="control-button">Reload</button>
      <button id="next" class="control-button">Next</button>
      
      <label for="loopToggle">Loop: </label>
      <input type="checkbox" id="loopToggle" checked />
    </div>

    <div>
      <button id="freeze" class="control-button">Freeze</button>
      <button id="unfreeze" class="control-button">Unfreeze</button>
    </div>
    
    <label for="frameSlider">Frame: <span id="current-frame">0</span></label>
    <input type="range" id="frameSlider" min="0" step="0.1" />
    
    <label for="speed" class="speed-label">Speed: <span id="speed-value">x1</span></label>
    <input type="range" id="speed" min="0.1" max="5" step="0.1" value="1" class="speed-slider" />
    <div>
      <label for="mode">Mode: </label>
      <select id="mode">
        <option value="bounce">Bounce</option>
        <option value="reverse-bounce">Bounce Reverse</option>
        <option value="reverse">Reverse</option>
        <option value="forward">Forward</option>
      </select>
      <label for="bg-color">Background Color: </label>
      <input type="color" id="bg-color" />
    </div>

    <div>
      <label for="marker">Marker: </label>
      <select id="marker">
        <option value="">None</option>
      </select>
    </div>

    <div>
      <label for="theme">Theme: </label>
      <select id="theme">
        <option value="">None</option>
      </select>
    </div>

    <div>
      <label for="fit">Fit: </label>
      <select id="fit">
        <option value="contain" selected>Contain</option>
        <option value="cover">Cover</option>
        <option value="fill">Fill</option>
        <option value="fit-height">Fit Height</option>
        <option value="fit-width">Fit Width</option>
        <option value="none">None</option>
      </select>
    </div>

    <div>
      <label for="align">Align: </label>
      <select id="align">
        <option value="0,0">Top Left</option>
        <option value="0.5,0">Top Center</option>
        <option value="1,0">Top Right</option>

        <option value="0,0.5">Center Left</option>
        <option value="0.5,0.5" selected>Center</option>
        <option value="1,0.5">Center Right</option>

        <option value="0,1">Bottom Left</option>
        <option value="0.5,1">Bottom Center</option>
        <option value="1,1">Bottom Right</option>
      </select>
    </div>

    <div class="segment-control">
      <label for="startFrame">Start Frame: </label>
      <input type="number" id="startFrame" value="10" min="0" />

      <label for="endFrame">End Frame: </label>
      <input type="number" id="endFrame" value="90" min="0" />

      <button id="setSegment" class="control-button">Set segment</button>
    </div>

    <div>
      <label for="states">State Machines: </label>
      <select id="states">
        <option value="none">None</option>
      </select>
      <button id="start_sm">Start State Machine</button>
      <button id="end_sm">End State Machine</button>
    </div>
  </div>
</div>
`;

/**
 * This is only required for testing the local version of the renderer
 */
DotLottie.setWasmUrl(`${baseUrl}${wasmUrl}`);

/**
 * Load all canvas elements with data-src attribute
 */
const allCanvas = document.querySelectorAll('canvas[data-src]') as NodeListOf<HTMLCanvasElement>;

allCanvas.forEach((canvas) => {
  const src = canvas.getAttribute('data-src') as string;
  const backgroundColor = canvas.getAttribute('data-bg-color') as string;

  const dotLottie = new DotLottie({
    canvas,
    src,
    loop: true,
    autoplay: true,
    backgroundColor,
    // useFrameInterpolation: false,
  });

  dotLottie.addEventListener('loadError', console.error);

  window.addEventListener('resize', () => {
    dotLottie.resize();
  });
});

async function handleMouseDown(dotLottie: unknown): Promise<void> {
  const r = await dotLottie.postStateMachineEvent('OnPointerDown: 0.0 0.0');
  // const r = await dotLottie.postStateMachineEvent('SetNumericContext: sync_key 10');

  if (r === 0) {
    console.log('Success');
  } else if (r === 1) {
    console.error('Error');
  } else if (r === 2) {
    console.log('R 2');
    // const p = dotLottie.play();

    // console.log(p);
  } else if (r === 3) {
    console.log('R 3');
    // dotLottie.pause();
  } else if (r === 4) {
    console.log('R 4');
    // dotLottie.pause();
    console.log('Set frame');
  } else {
    console.log('R >> ', r);
  }
  // if (r === 4) {

  // }
}

fetch(
  // '/theming_example.lottie',
  // '/layout_example.lottie',
  // '/multi.lottie',
  // '/markers_example.lottie',
  './toggle.lottie',
  // './exploding_pigeon.lottie',
)
  .then(async (res) => res.arrayBuffer())
  .then((data): void => {
    console.log(data);
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    const dotLottie = new DotLottie({
      canvas,
      // src: 'https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie',
      // src: '/lolo.json',
      data,
      loop: true,
      autoplay: true,
      mode: 'bounce',
      segment: [10, 90],
      speed: 1,
      backgroundColor: '#800080ff',
      // useFrameInterpolation: false,
    });

    canvas.addEventListener('mousedown', () => {
      handleMouseDown(dotLottie);
    });

    dotLottie.addEventListener('loadError', console.error);

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
    const setSegmentButton = document.getElementById('setSegment') as HTMLButtonElement;
    const freezeButton = document.getElementById('freeze') as HTMLButtonElement;
    const unfreezeButton = document.getElementById('unfreeze') as HTMLButtonElement;
    const freezeStateSpan = document.getElementById('is-frozen') as HTMLSpanElement;
    const playbackStateSpan = document.getElementById('playback-state') as HTMLSpanElement;
    const nextAnimationButton = document.getElementById('next') as HTMLButtonElement;
    const activeAnimationSpan = document.getElementById('active-animation') as HTMLSpanElement;
    const startStateMachineButton = document.getElementById('start_sm') as HTMLButtonElement;
    const endStateMachineButton = document.getElementById('end_sm') as HTMLButtonElement;

    const markerSelect = document.getElementById('marker') as HTMLSelectElement;
    const themeSelect = document.getElementById('theme') as HTMLSelectElement;
    const fitSelect = document.getElementById('fit') as HTMLSelectElement;
    const alignSelect = document.getElementById('align') as HTMLSelectElement;
    const stateMachinesSelect = document.getElementById('states') as HTMLSelectElement;

    let animationIdx = 0;

    nextAnimationButton.addEventListener('click', () => {
      const manifest = dotLottie.manifest;

      if (manifest) {
        const animations = manifest.animations;

        animationIdx = (animationIdx + 1) % animations.length;

        const animationId = animations[animationIdx]?.id || '';

        if (animationId) {
          dotLottie.loadAnimation(animationId);
        }
      }
    });

    freezeButton.addEventListener('click', () => {
      dotLottie.freeze();
    });

    unfreezeButton.addEventListener('click', () => {
      dotLottie.unfreeze();
    });

    const bgColorInput = document.getElementById('bg-color') as HTMLInputElement;

    bgColorInput.addEventListener('change', () => {
      dotLottie.setBackgroundColor(bgColorInput.value);
    });

    setSegmentButton.addEventListener('click', () => {
      const startFrame = parseInt(startFrameInput.value, 10);
      const endFrame = parseInt(endFrameInput.value, 10);

      dotLottie.setSegment(startFrame, endFrame);
    });

    modeSelect.addEventListener('change', () => {
      dotLottie.setMode(modeSelect.value.toString() as Mode);
    });

    jumpButton.addEventListener('click', () => {
      if (!dotLottie.segment) return;

      const startFrame = parseInt(dotLottie.segment[0].toString(), 10);
      const endFrame = parseInt(dotLottie.segment[1].toString(), 10);

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
        mode: 'reverse-bounce',
        renderConfig: {
          devicePixelRatio: 0.2,
        },
      });
    });

    stateMachinesSelect.addEventListener('change', () => {
      // const stateMachineId = stateMachinesSelect.value;

      // dotLottie.loadStateMachine(stateMachineId);
      //       const stateMachine = `{
      //     "descriptor": {
      //         "id": "multi_animation_slideshow",
      //         "initial": 0
      //     },
      //     "states": [
      //         {
      //             "name": "SyncTest",
      //             "type": "SyncState",
      //             "frame_context_key": "sync_key"
      //         }
      //     ],
      //     "transitions": [
      //     ],
      //     "listeners": [
      //         {
      //             "type": "PointerDown"
      //         }
      //     ],
      //     "context_variables": [
      //         {
      //             "key": "sync_key",
      //             "type": "Numeric",
      //             "value": 30
      //         }
      //     ]
      // }
      //       `;

      const stateMachine = `
{"descriptor":{"id":"state_toggle","initial":0},"states":[{"name":"wait","type":"PlaybackState","autoplay":false,"loop":false,"segments":[0,1]},{"name":"play_forward","type":"PlaybackState","autoplay":true,"loop":false,"segments":[0,30]},{"name":"play_reverse","type":"PlaybackState","autoplay":true,"loop":false,"mode":"Reverse","segments":[30,0]}],"transitions":[{"type":"Transition","from_state":0,"to_state":1,"on_pointer_down_event":{}},{"type":"Transition","from_state":1,"to_state":2,"on_pointer_down_event":{}},{"type":"Transition","from_state":2,"to_state":1,"on_pointer_down_event":{}}],"context_variables":[],"listeners":[{"type":"PointerDown"}]}
    `;

      console.log('stateMachine', stateMachine);
      dotLottie.loadStateMachineData(stateMachine);
    });

    markerSelect.addEventListener('change', () => {
      dotLottie.setMarker(markerSelect.value);
    });

    themeSelect.addEventListener('change', () => {
      dotLottie.loadTheme(themeSelect.value);
    });

    fitSelect.addEventListener('change', () => {
      const fit = fitSelect.value as Fit;
      const align = dotLottie.layout?.align || [0.5, 0.5];

      dotLottie.setLayout({
        align,
        fit,
      });
    });

    alignSelect.addEventListener('change', () => {
      const [x, y] = alignSelect.value.split(',');

      if (x && y) {
        const fit = dotLottie.layout?.fit || 'contain';

        dotLottie.setLayout({
          fit,
          align: [parseFloat(x), parseFloat(y)],
        });
      }
    });

    startStateMachineButton.addEventListener('click', () => {
      dotLottie.startStateMachine();
    });

    endStateMachineButton.addEventListener('click', () => {
      dotLottie.stopStateMachine();
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

    dotLottie.addEventListener('ready', (event) => {
      console.log(event, dotLottie.isReady);
    });

    dotLottie.addEventListener('load', (event) => {
      bgColorInput.value = dotLottie.backgroundColor || '#ffffff';

      const themes = dotLottie.manifest?.themes || [];
      const states = dotLottie.manifest?.states || [];

      for (const state of states) {
        const id = state;

        const option = document.createElement('option');

        option.value = id;
        option.textContent = id;

        stateMachinesSelect.appendChild(option);
      }

      for (const theme of themes) {
        const id = theme.id;

        const option = document.createElement('option');

        option.value = id;
        option.textContent = id;

        themeSelect.appendChild(option);
      }

      const markers = dotLottie.markers();

      for (const marker of markers) {
        const option = document.createElement('option');

        option.value = marker.name;

        option.textContent = marker.name;

        markerSelect.appendChild(option);
      }

      activeAnimationSpan.textContent = dotLottie.activeAnimationId ?? 'None';

      console.log(event);
    });

    dotLottie.addEventListener('loadError', (event) => {
      console.log(event);
    });

    dotLottie.addEventListener('play', (event) => {
      console.log(event);
      frameSlider.max = dotLottie.totalFrames.toString();
      playPauseButton.innerText = 'Pause';

      playbackStateSpan.textContent = `▶️ Playing`;
    });

    dotLottie.addEventListener('pause', (event) => {
      console.log(event);
      playPauseButton.innerText = 'Play';

      playbackStateSpan.textContent = `⏸ Paused`;
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

      playbackStateSpan.textContent = `⏹ Stopped`;
    });

    dotLottie.addEventListener('stop', (event) => {
      console.log(event);

      playPauseButton.innerText = 'Play';

      playbackStateSpan.textContent = `⏹ Stopped`;
    });

    dotLottie.addEventListener('destroy', (event) => {
      console.log(event);
    });

    dotLottie.addEventListener('freeze', (event) => {
      console.log(event);

      freezeStateSpan.textContent = dotLottie.isFrozen ? `✅` : `❌`;
    });

    dotLottie.addEventListener('unfreeze', (event) => {
      console.log(event);

      freezeStateSpan.textContent = dotLottie.isFrozen ? `✅` : `❌`;
    });
  })
  .catch((error) => {
    console.log(error);
  });
