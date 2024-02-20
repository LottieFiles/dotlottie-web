<script lang="ts">
	import { onMount } from 'svelte';
	import debounce from 'debounce';
	import { DotLottie, type Config } from '@lottiefiles/dotlottie-web';

	export let autoplay: Config['autoplay'] = false;
	export let backgroundColor: Config['backgroundColor'] = undefined;
	export let data: Config['data'] = undefined;
	export let loop: Config['loop'] = false;
	export let mode: Config['mode'] = 'forward';
	export let renderConfig: Config['renderConfig'] = undefined;
	export let segments: Config['segments'] = undefined;
	export let speed: Config['speed'] = 1;
	export let src: Config['src'] = undefined;
	export let useFrameInterpolation: Config['useFrameInterpolation'] = true;

	export let autoResizeCanvas: boolean = false;
	export let dotLottieRefCallback: (dotLottie: DotLottie) => void = () => {};

	let dotLottie: DotLottie;
	let canvas: HTMLCanvasElement;
	let prevSrc: string | undefined = undefined;
	let prevData: Config['data'] = undefined;

	onMount(() => {
		dotLottie = new DotLottie({
			canvas,
			src,
			autoplay,
			loop,
			speed,
			data,
			renderConfig,
			segments,
			useFrameInterpolation,
			backgroundColor,
			mode
		});

		if (dotLottieRefCallback) {
			dotLottieRefCallback(dotLottie);
		}

		const resizeObserver = new ResizeObserver(debounce(() => {
			if (autoResizeCanvas) {
				dotLottie.resize();
			}
		}, 150));

		const intersectionObserver = new IntersectionObserver(debounce((entries: IntersectionObserverEntry[]) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					dotLottie.unfreeze();
				} else {
					dotLottie.freeze();
				}
			});
		}, 150), { threshold: 0 });

		if (autoResizeCanvas) {
			resizeObserver.observe(canvas);
		}
		intersectionObserver.observe(canvas);

		return () => {
			resizeObserver.disconnect();
			intersectionObserver.disconnect();
			dotLottie.destroy();
		};
	});

	$: {
		if (dotLottie &&  dotLottie.isLoaded && typeof speed == 'number') {
			dotLottie.setSpeed(speed);
		}
	}

	$: {
		if (dotLottie && dotLottie.isLoaded && typeof useFrameInterpolation == 'boolean') {
			dotLottie.setUseFrameInterpolation(useFrameInterpolation);
		}
	}

	$: {
		if (dotLottie && dotLottie.isLoaded && Array.isArray(segments) && segments.length === 2 && typeof segments[0] === 'number' && typeof segments[1] === 'number') {
			let [start, end] = segments;
			dotLottie.setSegments(start, end);
		}
	}

	$: {
		if (dotLottie && dotLottie.isLoaded && typeof loop == 'boolean') {
			dotLottie.setLoop(loop);
		}
	}

	$: {
		if (dotLottie) {
			dotLottie.setBackgroundColor(backgroundColor || "");
		}
	}

	$: {
		if (dotLottie && dotLottie.isLoaded && typeof mode == 'string') {
			dotLottie.setMode(mode);
		}
	}


    $: if (dotLottie && src !== prevSrc) {
        dotLottie.load({
            src,
            autoplay,
            loop,
            speed,
            data,
            renderConfig,
            segments,
            useFrameInterpolation,
            backgroundColor,
            mode
        });
        prevSrc = src; 
    }

	$: if (dotLottie && data !== prevData) {
		dotLottie.load({
			src,
			autoplay,
			loop,
			speed,
			data,
			renderConfig,
			segments,
			useFrameInterpolation,
			backgroundColor,
			mode
		});
		prevData = data;
	}
</script>

<div>
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	div {
		width: 100%;
		height: 100%;
	}
	canvas {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
