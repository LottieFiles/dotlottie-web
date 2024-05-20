<script lang="ts">
	import { DotLottieSvelte } from '../lib/index.js';
	import type { DotLottie } from '../lib/index.js';

	let dotLottie: DotLottie | undefined;
	let isLoaded = false;
	let isPlaying = false;
	let isPaused = false;
	let isStopped = false;
	let isFrozen = false;
	let loop = true;
	let backgroundColor = "#00000000";
	let speed = 1;
	let hasMultipleAnimations = false;
	let src = "https://lottie.host/e641272e-039b-4612-96de-138acfbede6e/bc0sW78EeR.lottie";
	let activeAnimationIdx = 0;

	function dotLottieRefCallback(ref: DotLottie) {
		dotLottie = ref;
	}

	const next = () => {
		const animations = dotLottie?.manifest?.animations;
		if (animations?.length) {
			activeAnimationIdx = (activeAnimationIdx + 1) % animations.length;
			const animationId = animations[activeAnimationIdx]?.id || "";
			if (animationId) dotLottie?.loadAnimation(animationId);
		}
	};

	$: {
		if (dotLottie) {
			dotLottie.addEventListener('load', () => {
				isLoaded = true;

				hasMultipleAnimations = (dotLottie?.manifest?.animations?.length ?? 0) > 1;
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
			dotLottie.addEventListener("stop", () => {
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
<input type="color" bind:value={backgroundColor} />
<ul>
	<li>Speed: {speed}</li>
	<li>Loaded: {isLoaded}</li>
	<li>Playing: {isPlaying}</li>
	<li>Paused: {isPaused}</li>
	<li>Stopped: {isStopped}</li>
	<li>Frozen: {isFrozen}</li>
</ul>
