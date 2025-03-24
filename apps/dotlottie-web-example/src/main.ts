/* eslint-disable no-secrets/no-secrets */

import './styles.css';
import type { Fit, Mode } from '@lottiefiles/dotlottie-web';
// import { DotLottieWorker as DotLottie } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';

import wasmUrl from '../../../packages/web/dist/dotlottie-player.wasm?url';

const app = document.getElementById('app') as HTMLDivElement;

const baseUrl = window.location.origin + import.meta.env.BASE_URL;

app.innerHTML = `
<div class="grid" style="margin-top: 1000px">
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

    <div>
      <button id="resize" class="control-button">Resize</button>
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
    renderConfig: {
      autoResize: true,
    },
    useFrameInterpolation: false,
  });

  dotLottie.addEventListener('loadError', console.error);
  dotLottie.addEventListener('freeze', console.log);
  dotLottie.addEventListener('unfreeze', console.log);

  // window.addEventListener('resize', () => {
  //   dotLottie.resize();
  // });
});

fetch(
  // '/theming_example.lottie',
  // '/layout_example.lottie',
  // '/multi.lottie',
  // '/markers_example.lottie',
  // './toggle.lottie',
  // './exploding_pigeon.lottie',
  // './lolo.json',
  // './multi_themes.lottie',
  'https://assets.codepen.io/11716235/sm_smiley_slider.lottie',
)
  .then(async (res) => res.arrayBuffer())
  .then((data): void => {
    // const allLayers: string[] = data.layers.map((layer: { nm: string }) => layer.nm);

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
      themeId: 'animated_light',
      // useFrameInterpolation: false,
    });

    // dotLottie.addEventListener('render', () => {
    // allLayers.forEach((layer) => {
    //   const bounds = dotLottie.getLayerBoundingBox(layer);
    //   if (!bounds) return;
    //   const { height, width, x, y } = bounds;
    //   const context = canvas.getContext('2d');
    //   context?.strokeRect(x, y, width, height);
    // });
    // });

    canvas.addEventListener('mousedown', () => {
      // dotLottie.postStateMachineEvent('OnPointerDown: 0.0 0.0');
      dotLottie.stateMachinePostPointerDownEvent(0, 0);
    });

    dotLottie.addEventListener('loadError', console.error);

    dotLottie.addEventListener('render', () => {
      const ctx = canvas.getContext('2d');

      const points = dotLottie.getLayerBoundingBox('wink');

      if (!points) return;
      if (!ctx) return;

      const ax = points.x1;
      const ay = points.y1;
      const cx = points.x3;
      const cy = points.y3;
      const dx = points.x4;
      const dy = points.y4;

      const width = Math.sqrt((dx - cx) ** 2 + (dy - cy) ** 2);
      const height = Math.sqrt((ax - dx) ** 2 + (ay - dy) ** 2);

      ctx.strokeStyle = 'red';
      ctx.strokeRect(ax, ay, width, height);
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

    // const resizeButton = document.getElementById('resize') as HTMLButtonElement;

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

    // resizeButton.addEventListener('click', () => {
    //   dotLottie.resize();
    // });

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
      dotLottie.stateMachineLoad('smiley_slider');
    });

    markerSelect.addEventListener('change', () => {
      dotLottie.setMarker(markerSelect.value);
    });

    themeSelect.addEventListener('change', () => {
      if (themeSelect.value) {
        console.log(dotLottie.setTheme(themeSelect.value));
      } else {
        console.log(dotLottie.resetTheme());
      }
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
      dotLottie.stateMachineStart();
    });

    endStateMachineButton.addEventListener('click', () => {
      dotLottie.stateMachineStop();
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
      const stateMachines = dotLottie.manifest?.stateMachines || [];

      for (const stateMachine of stateMachines) {
        const id = stateMachine.id;

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

        option.value = String(marker.name);

        option.textContent = String(marker.name);

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
