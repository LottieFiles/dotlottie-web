<svelte:options runes={false} />

<script lang="ts">
	import { onMount } from 'svelte';
	import debounce from 'debounce';
	import { DotLottie, type Config } from '@lottiefiles/dotlottie-web';

	export function setWasmUrl(url: string): void {
		DotLottie.setWasmUrl(url);
	}

	export let autoplay: Config['autoplay'] = false;
	export let backgroundColor: Config['backgroundColor'] = undefined;
	export let data: Config['data'] = undefined;
	export let loop: Config['loop'] = false;
	export let mode: Config['mode'] = 'forward';
	export let renderConfig: Config['renderConfig'] = undefined;
	export let segment: Config['segment'] = undefined;
	export let speed: Config['speed'] = 1;
	export let src: Config['src'] = undefined;
	export let useFrameInterpolation: Config['useFrameInterpolation'] = true;
	export let marker: Config['marker'] = undefined;
	export let layout: Config['layout'] = undefined;

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
			segment,
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
		if (dotLottie && typeof layout === 'object') {
			dotLottie.setLayout(layout);
		}
	}

	$: {
		if (dotLottie && typeof marker === 'string') {
			dotLottie.setMarker(marker);
		}
	}

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
		if (dotLottie && dotLottie.isLoaded && Array.isArray(segment) && segment.length === 2 && typeof segment[0] === 'number' && typeof segment[1] === 'number') {
			let [start, end] = segment;
			dotLottie.setSegment(start, end);
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
            segment,
            useFrameInterpolation,
            backgroundColor,
            mode,
			marker,
			layout
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
			segment,
			useFrameInterpolation,
			backgroundColor,
			mode,
			marker,
			layout
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
