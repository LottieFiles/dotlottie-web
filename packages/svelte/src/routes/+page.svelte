<script lang="ts">
	import { DotLottieSvelte, setWasmUrl } from '../lib/index.js';
	import type { DotLottie } from '../lib/index.js';
	import wasmUrl from '../../../web/src/core/dotlottie-player.wasm?url';
	import { onMount } from 'svelte';

	setWasmUrl(wasmUrl);

	let dotLottie: DotLottie | undefined = $state();
	let isLoaded = $state(false);
	let isPlaying = $state(false);
	let isPaused = $state(false);
	let isStopped = $state(false);
	let isFrozen = $state(false);
	let loop = true;
	let backgroundColor = $state('#00000000');
	let speed = $state(1);
	let hasMultipleAnimations = $state(false);
	let src = $state('https://lottie.host/b06d1336-2c08-4156-aa6f-96f08ff511e0/4itF1pXb1i.lottie');
	let activeAnimationIdx = 0;
	let animations: string[] = $state([]);
	let themes: string[] = $state([]);
	let activeAnimationId = $state('');
	let activeThemeId = $state('');

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

	onMount(() => {
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
	});
</script>

<DotLottieSvelte
	{dotLottieRefCallback}
	autoplay
	{backgroundColor}
	animationId={activeAnimationId}
	themeId={activeThemeId}
	{src}
	{loop}
	{speed}
/>

<button
	onclick={() => {
		src = 'https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json';
	}}>Switch src</button
>
<button onclick={() => dotLottie?.play()}>Play</button>
<button onclick={() => dotLottie?.pause()}>Pause</button>
<button onclick={() => dotLottie?.stop()}>Stop</button>
<button onclick={() => dotLottie?.freeze()}>Freeze</button>
<button onclick={() => dotLottie?.unfreeze()}>Unfreeze</button>
<button onclick={() => (speed += 0.5)}>Increase speed</button>
<button onclick={() => (speed -= 0.5)}>Decrease speed</button>
<button onclick={next} disabled={!hasMultipleAnimations}>Next animation</button>
<select
	onchange={(event) => {
		activeAnimationId = event.currentTarget.value || '';
	}}
>
	<option value="">Default animation</option>
	{#each animations as animation}
		<option value={animation}>{animation}</option>
	{/each}
</select>
<select
	onchange={(event) => {
		activeThemeId = event.currentTarget.value || '';
	}}
>
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
