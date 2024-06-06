import type { Config, DotLottie } from '@lottiefiles/dotlottie-web';
import { ComponentProps, JSX, createEffect, splitProps } from 'solid-js';

import { useDotLottie } from './use-dotlottie';
import useStableCallback from './use-stable-callback';

export type DotLottieSolidProps = Omit<Config, 'canvas'> &
	ComponentProps<'canvas'> &
	Partial<{
		autoResizeCanvas: boolean;
		dotLottieRefCallback: (dotLottie: DotLottie) => void;
		playOnHover: boolean;
	}>;

export const DotLottieSolid = (props: DotLottieSolidProps): JSX.Element => {
	const [dotLottieProps, restProps] = splitProps(props, [
		'src',
		'data',
		'mode',
		'loop',
		'speed',
		'marker',
		'segment',
		'autoplay',
		'playOnHover',
		'renderConfig',
		'autoResizeCanvas',
		'dotLottieRefCallback',
		'useFrameInterpolation',
	]);
	const { DotLottieComponent, dotLottie } = useDotLottie(dotLottieProps);

	const stableDotLottieRefCallback =
		typeof dotLottieProps.dotLottieRefCallback === 'function'
			? useStableCallback(dotLottieProps.dotLottieRefCallback)
			: undefined;

	createEffect(() => {
		if (typeof stableDotLottieRefCallback === 'function') {
			stableDotLottieRefCallback(dotLottie()!);
		}
	});

	return <DotLottieComponent {...restProps} />;
};
