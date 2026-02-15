<script lang="ts">
import { type Config, DotLottie } from '@lottiefiles/dotlottie-web';
import { onMount } from 'svelte';

export function setWasmUrl(url: string): void {
  DotLottie.setWasmUrl(url);
}

export const autoplay: Config['autoplay'] = false;
export const backgroundColor: Config['backgroundColor'] = undefined;
export const data: Config['data'] = undefined;
export const loop: Config['loop'] = false;
export const mode: Config['mode'] = 'forward';
export const renderConfig: Config['renderConfig'] = undefined;
export const segment: Config['segment'] = undefined;
export const speed: Config['speed'] = 1;
export const src: Config['src'] = undefined;
export const useFrameInterpolation: Config['useFrameInterpolation'] = true;
export const marker: Config['marker'] = undefined;
export const layout: Config['layout'] = undefined;
export const animationId: Config['animationId'] = '';
export const themeId: Config['themeId'] = '';
export const stateMachineId: Config['stateMachineId'] = undefined;
export const stateMachineConfig: Config['stateMachineConfig'] = undefined;

export const playOnHover: boolean = false;
export const themeData: string = '';

export const dotLottieRefCallback: (dotLottie: DotLottie) => void = () => {};

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
let prevSrc: string | undefined;
let prevData: Config['data'];

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
    stateMachineConfig,
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
  if (dotLottie && dotLottie.isLoaded && typeof speed == 'number') {
    dotLottie.setSpeed(speed);
  }
}

$: {
  if (dotLottie && dotLottie.isLoaded && typeof useFrameInterpolation == 'boolean') {
    dotLottie.setUseFrameInterpolation(useFrameInterpolation);
  }
}

$: {
  if (
    dotLottie &&
    dotLottie.isLoaded &&
    Array.isArray(segment) &&
    segment.length === 2 &&
    typeof segment[0] === 'number' &&
    typeof segment[1] === 'number'
  ) {
    const [start, end] = segment;
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
    dotLottie.setBackgroundColor(backgroundColor || '');
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
    stateMachineConfig,
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
    stateMachineConfig,
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
