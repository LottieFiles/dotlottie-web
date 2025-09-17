<script lang="ts">
	import { onMount } from 'svelte';
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
	export let animationId: Config['animationId'] = '';
	export let themeId: Config['themeId'] = '';
	export let stateMachineId: Config['stateMachineId'] = undefined;
	export let stateMachineConfig: Config['stateMachineConfig'] = undefined;

	export let playOnHover: boolean = false;
	export let themeData: string = '';

	export let dotLottieRefCallback: (dotLottie: DotLottie) => void = () => {};

	const hoverHandler = (event: MouseEvent) => {
		if (!playOnHover || !dotLottie.isLoaded) return;

		if (event.type === 'mouseenter') {
		dotLottie.play();
		} else if (event.type === 'mouseleave') {
		dotLottie.pause();
		}
	};

	let dotLottie: DotLottie;
	let canvas: HTMLCanvasElement;
	let prevSrc: string | undefined = undefined;
	let prevData: Config['data'] = undefined;

	onMount(() => {
		const shouldAutoplay = autoplay && !playOnHover;
		dotLottie = new DotLottie({
			canvas,
			src,
			autoplay: shouldAutoplay,
			loop,
			speed,
			data,
			renderConfig,
			segment,
			useFrameInterpolation,
			backgroundColor,
			mode,
			animationId,
			themeId,
			stateMachineId,
			stateMachineConfig
		});

		if (dotLottieRefCallback) {
			dotLottieRefCallback(dotLottie);
		}
		
		canvas.addEventListener('mouseenter', hoverHandler);
		canvas.addEventListener('mouseleave', hoverHandler);

		return () => {
			canvas.removeEventListener('mouseenter', hoverHandler);
			canvas.removeEventListener('mouseleave', hoverHandler);
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
			layout,
			animationId,
			themeId,
			stateMachineId,
			stateMachineConfig
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
			layout,
			animationId,
			themeId,
			stateMachineId,
			stateMachineConfig
		});
		prevData = data;
	}

	$: if (dotLottie && dotLottie.isLoaded && dotLottie.activeAnimationId !== animationId) {
		dotLottie.loadAnimation(animationId);
	}

	$: if (dotLottie && dotLottie.isLoaded && dotLottie.activeThemeId !== themeId) {
		dotLottie.setTheme(themeId);
	}

	$: if (dotLottie && dotLottie.isLoaded) {
		dotLottie.setThemeData(themeData);
	}

	$: {
		if (dotLottie && dotLottie.isLoaded) {
			if (typeof stateMachineId === 'string' && stateMachineId) {
				const smLoaded = dotLottie.stateMachineLoad(stateMachineId);
				
				if (smLoaded) {
					dotLottie.stateMachineStart();
				}
			} else {
				dotLottie.stateMachineStop();
			}
		}
	}

	$: {
		if (dotLottie) {
			dotLottie.stateMachineSetConfig(stateMachineConfig ?? null);
		}
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
