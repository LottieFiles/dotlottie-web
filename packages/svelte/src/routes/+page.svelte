<script lang="ts">
import wasmUrl from '../../../web/src/core/dotlottie-player.wasm?url';
import type { DotLottie } from '../lib/index.js';
import { DotLottieSvelte, setWasmUrl } from '../lib/index.js';

setWasmUrl(wasmUrl);

let dotLottie: DotLottie | undefined;
let isLoaded = false;
let isPlaying = false;
let isPaused = false;
let isStopped = false;
let isFrozen = false;
let loop = true;
let backgroundColor = '#00000000';
let speed = 1;
let hasMultipleAnimations = false;
let src = 'https://lottie.host/b06d1336-2c08-4156-aa6f-96f08ff511e0/4itF1pXb1i.lottie';
let activeAnimationIdx = 0;
let animations: string[] = [];
let themes: string[] = [];
let activeAnimationId = '';
let activeThemeId = '';

function dotLottieRefCallback(ref: DotLottie) {
  dotLottie = ref;
}

const next = () => {
  const animations = dotLottie?.manifest?.animations;
  if (animations?.length) {
    activeAnimationIdx = (activeAnimationIdx + 1) % animations.length;
    const animationId = animations[activeAnimationIdx]?.id || '';
    if (animationId) dotLottie?.loadAnimation(animationId);
  }
};

$: {
  if (dotLottie) {
    dotLottie.addEventListener('load', () => {
      isLoaded = true;

      hasMultipleAnimations = (dotLottie?.manifest?.animations?.length ?? 0) > 1;
      animations = dotLottie?.manifest?.animations?.map((animation) => animation.id) ?? [];
      themes = dotLottie?.manifest?.themes?.map((theme) => theme.id) ?? [];
    });
    dotLottie.addEventListener('play', () => {
      isPlaying = true;
      isPaused = false;
      isStopped = false;
    });
    dotLottie.addEventListener('pause', () => {
      isPlaying = false;
      isPaused = true;
      isStopped = false;
    });
    dotLottie.addEventListener('complete', () => {
      isPlaying = false;
      isPaused = false;
      isStopped = true;
    });
    dotLottie.addEventListener('stop', () => {
      isPlaying = false;
      isPaused = false;
      isStopped = true;
    });
    dotLottie.addEventListener('freeze', () => {
      isFrozen = true;
    });
    dotLottie.addEventListener('unfreeze', () => {
      isFrozen = false;
    });
  }
}
</script>
<DotLottieSvelte
	{dotLottieRefCallback}
	autoplay
	backgroundColor={backgroundColor}
	animationId={activeAnimationId}
	themeId={activeThemeId}
	src={src}
	loop={loop}
	speed={speed}
/>
<button on:click={() => {
	src = "https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json"
}}>Switch src</button>
<button on:click={() => dotLottie?.play()}>Play</button>
<button on:click={() => dotLottie?.pause()}>Pause</button>
<button on:click={() => dotLottie?.stop()}>Stop</button>
<button on:click={() => dotLottie?.freeze()}>Freeze</button>
<button on:click={() => dotLottie?.unfreeze()}>Unfreeze</button>
<button on:click={() => speed += 0.5}>Increase speed</button>
<button on:click={() => speed -= 0.5}>Decrease speed</button>
<button on:click={next} disabled={!hasMultipleAnimations}>Next animation</button>
<select on:change={(event) => {
  activeAnimationId = event.currentTarget.value || '';
}}>
	<option value="">Default animation</option>
	{#each animations as animation}
		<option value={animation}>{animation}</option>
	{/each}
</select>
<select on:change={(event) => {
	activeThemeId = event.currentTarget.value || '';
}}>
	<option value="">Default theme</option>
	{#each themes as theme}
		<option value={theme}>{theme}</option>
	{/each}
</select>
<input type="color" bind:value={backgroundColor} />
<ul>
	<li>Speed: {speed}</li>
	<li>Loaded: {isLoaded}</li>
	<li>Playing: {isPlaying}</li>
	<li>Paused: {isPaused}</li>
	<li>Stopped: {isStopped}</li>
	<li>Frozen: {isFrozen}</li>
</ul>
