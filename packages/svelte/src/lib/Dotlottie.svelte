<script lang="ts">
	import { onMount } from 'svelte';
	import { DotLottie, type Config } from '@lottiefiles/dotlottie-web';

	export function setWasmUrl(url: string): void {
		DotLottie.setWasmUrl(url);
	}

	type Props = Partial<
		Omit<Config, 'canvas'> & {
			playOnHover: boolean;
			animationId: string;
			themeId: string;
			themeData: string;
			dotLottieRefCallback: (dotLottie: DotLottie) => void;
		}
	>;

	let {
		autoplay = false,
		backgroundColor,
		data,
		loop = false,
		mode = 'forward',
		renderConfig,
		segment,
		speed = 1,
		src,
		useFrameInterpolation = true,
		marker,
		layout,
		playOnHover = false,
		animationId = '',
		themeId = '',
		themeData = '',
		dotLottieRefCallback = () => {}
	}: Props = $props();

	const hoverHandler = (event: MouseEvent) => {
		if (!playOnHover || !dotLottie?.isLoaded) return;

		if (event.type === 'mouseenter') {
			dotLottie.play();
		} else if (event.type === 'mouseleave') {
			dotLottie.pause();
		}
	};

	let dotLottie: DotLottie | undefined = $state();
	let canvas: Config['canvas'] | undefined = $state();
	let prevSrc: string | undefined = $state();
	let prevData: Config['data'] = $state();

	onMount(() => {
		if (!canvas) return;

		const shouldAutoplay = autoplay && !playOnHover;
		dotLottie = new DotLottie({
			canvas: canvas as HTMLCanvasElement,
			src,
			autoplay: shouldAutoplay,
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

		canvas.addEventListener('mouseenter', hoverHandler);
		canvas.addEventListener('mouseleave', hoverHandler);

		return () => {
			if (canvas) {
				canvas.removeEventListener('mouseenter', hoverHandler);
				canvas.removeEventListener('mouseleave', hoverHandler);
			}
			if (dotLottie) dotLottie.destroy();
		};
	});

	$effect(() => {
		if (dotLottie && typeof layout === 'object') {
			dotLottie.setLayout(layout);
		}
	});

	$effect(() => {
		if (dotLottie && typeof marker === 'string') {
			dotLottie.setMarker(marker);
		}
	});

	$effect(() => {
		console.log(speed);
		if (dotLottie && dotLottie.isLoaded && typeof speed == 'number') {
			dotLottie.setSpeed(speed);
		}
	});

	$effect(() => {
		if (dotLottie && dotLottie.isLoaded && typeof useFrameInterpolation == 'boolean') {
			dotLottie.setUseFrameInterpolation(useFrameInterpolation);
		}
	});

	$effect(() => {
		if (
			dotLottie &&
			dotLottie.isLoaded &&
			Array.isArray(segment) &&
			segment.length === 2 &&
			typeof segment[0] === 'number' &&
			typeof segment[1] === 'number'
		) {
			let [start, end] = segment;
			dotLottie.setSegment(start, end);
		}
	});

	$effect(() => {
		if (dotLottie && dotLottie.isLoaded && typeof loop == 'boolean') {
			dotLottie.setLoop(loop);
		}
	});

	$effect(() => {
		if (dotLottie) {
			dotLottie.setBackgroundColor(backgroundColor || '');
		}
	});

	$effect(() => {
		if (dotLottie && dotLottie.isLoaded && typeof mode == 'string') {
			dotLottie.setMode(mode);
		}
	});

	$effect(() => {
		if (dotLottie && src !== prevSrc) {
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
	});

	$effect(() => {
		if (dotLottie && data !== prevData) {
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
	});

	$effect(() => {
		if (dotLottie && dotLottie.isLoaded && dotLottie.activeAnimationId !== animationId) {
			dotLottie.loadAnimation(animationId);
		}
	});

	$effect(() => {
		if (dotLottie && dotLottie.isLoaded && dotLottie.activeThemeId !== themeId) {
			dotLottie.loadTheme(themeId);
		}
	});

	$effect(() => {
		if (dotLottie && dotLottie.isLoaded) {
			dotLottie.loadThemeData(themeData);
		}
	});
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
