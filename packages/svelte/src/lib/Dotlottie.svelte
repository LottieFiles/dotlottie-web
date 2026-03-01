<script lang="ts">
	import { type Config, DotLottie } from '@lottiefiles/dotlottie-web';
	import { untrack } from 'svelte';

	interface DotLottieSvelteProps {
		autoplay?: Config['autoplay'];
		backgroundColor?: Config['backgroundColor'];
		data?: Config['data'];
		loop?: Config['loop'];
		mode?: Config['mode'];
		renderConfig?: Config['renderConfig'];
		segment?: Config['segment'];
		speed?: Config['speed'];
		src?: Config['src'];
		useFrameInterpolation?: Config['useFrameInterpolation'];
		marker?: Config['marker'];
		layout?: Config['layout'];
		animationId?: Config['animationId'];
		themeId?: Config['themeId'];
		stateMachineId?: Config['stateMachineId'];
		stateMachineConfig?: Config['stateMachineConfig'];
		playOnHover?: boolean;
		themeData?: string;
		dotLottieRefCallback?: (dotLottie: DotLottie) => void;
	}

	let {
		autoplay = false,
		backgroundColor = undefined,
		data = undefined,
		loop = false,
		mode = 'forward',
		renderConfig = undefined,
		segment = undefined,
		speed = 1,
		src = undefined,
		useFrameInterpolation = true,
		marker = undefined,
		layout = undefined,
		animationId = '',
		themeId = '',
		stateMachineId = undefined,
		stateMachineConfig = undefined,
		playOnHover = false,
		themeData = '',
		dotLottieRefCallback = () => {}
	}: DotLottieSvelteProps = $props();

	let canvas: HTMLCanvasElement;
	let dotLottie: DotLottie | undefined = $state(undefined);
	let prevSrc: Config['src'];
	let prevData: Config['data'];

	// Initialize DotLottie instance once when canvas is ready.
	// Use untrack() to read initial prop values without establishing reactive dependencies —
	// prop changes are handled by separate $effect blocks below.
	$effect(() => {
		const currentCanvas = canvas;
		if (!currentCanvas) return;

		const instance = new DotLottie(
			untrack(() => ({
				canvas: currentCanvas,
				src,
				autoplay: autoplay && !playOnHover,
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
			}))
		);

		dotLottie = instance;
		untrack(() => dotLottieRefCallback?.(instance));

		return () => {
			instance.destroy();
			dotLottie = undefined;
		};
	});

	// Hover handler — re-registers listeners whenever playOnHover or dotLottie changes
	$effect(() => {
		const currentPlayOnHover = playOnHover;
		const currentDotLottie = dotLottie;

		const handlePlayOnHover = (event: MouseEvent): void => {
			if (!currentPlayOnHover || !currentDotLottie?.isLoaded) return;
			if (event.type === 'mouseenter') {
				currentDotLottie.play();
			} else if (event.type === 'mouseleave') {
				currentDotLottie.pause();
			}
		};

		canvas?.addEventListener('mouseenter', handlePlayOnHover);
		canvas?.addEventListener('mouseleave', handlePlayOnHover);

		return () => {
			canvas?.removeEventListener('mouseenter', handlePlayOnHover);
			canvas?.removeEventListener('mouseleave', handlePlayOnHover);
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
		const currentSpeed = speed;
		if (dotLottie && typeof currentSpeed === 'number') {
			dotLottie.setSpeed(currentSpeed);
		}
	});

	$effect(() => {
		const currentUseFrameInterpolation = useFrameInterpolation;
		if (dotLottie && typeof currentUseFrameInterpolation === 'boolean') {
			dotLottie.setUseFrameInterpolation(currentUseFrameInterpolation);
		}
	});

	$effect(() => {
		const currentSegment = segment;
		if (
			dotLottie &&
			Array.isArray(currentSegment) &&
			currentSegment.length === 2 &&
			typeof currentSegment[0] === 'number' &&
			typeof currentSegment[1] === 'number'
		) {
			const [start, end] = currentSegment;
			dotLottie.setSegment(start, end);
		}
	});

	$effect(() => {
		const currentLoop = loop;
		if (dotLottie && typeof currentLoop === 'boolean') {
			dotLottie.setLoop(currentLoop);
		}
	});

	$effect(() => {
		if (dotLottie) {
			dotLottie.setBackgroundColor(backgroundColor || '');
		}
	});

	$effect(() => {
		const currentMode = mode;
		if (dotLottie && typeof currentMode === 'string') {
			dotLottie.setMode(currentMode);
		}
	});

	$effect(() => {
		if (dotLottie) {
			dotLottie.setRenderConfig(renderConfig ?? {});
		}
	});

	$effect(() => {
		if (dotLottie && typeof src === 'string' && src !== prevSrc) {
			prevSrc = src;
			dotLottie.load({
				src,
				...untrack(() => ({
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
				}))
			});
		}
	});

	$effect(() => {
		if (
			dotLottie &&
			(typeof data === 'string' || typeof data === 'object') &&
			data !== undefined &&
			data !== prevData
		) {
			prevData = data;
			dotLottie.load({
				data,
				...untrack(() => ({
					src,
					autoplay,
					loop,
					speed,
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
				}))
			});
		}
	});

	$effect(() => {
		const currentAnimationId = animationId;
		if (dotLottie) {
			dotLottie.loadAnimation(currentAnimationId);
		}
	});

	$effect(() => {
		const currentThemeId = themeId;
		if (dotLottie) {
			dotLottie.setTheme(currentThemeId);
		}
	});

	$effect(() => {
		const currentThemeData = themeData;
		if (dotLottie) {
			dotLottie.setThemeData(currentThemeData);
		}
	});

	$effect(() => {
		const currentStateMachineId = stateMachineId;
		if (dotLottie && dotLottie.isLoaded) {
			if (typeof currentStateMachineId === 'string' && currentStateMachineId) {
				const smLoaded = dotLottie.stateMachineLoad(currentStateMachineId);
				if (smLoaded) {
					dotLottie.stateMachineStart();
				}
			} else {
				dotLottie.stateMachineStop();
			}
		}
	});

	$effect(() => {
		if (dotLottie) {
			dotLottie.stateMachineSetConfig(stateMachineConfig ?? null);
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
