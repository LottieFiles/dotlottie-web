import { createEffect, createSignal, onCleanup, type Component } from 'solid-js';
import { type DotLottie, DotLottieSolid } from 'src';

const animations = [
	'https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json',
	'https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie',
];

const App: Component = () => {
	const [dotLottie, setDotlottie] = createSignal<DotLottie | null>(null);
	const [loop, setLoop] = createSignal(true);
	const [speed, setSpeed] = createSignal(1);
	const [srcIdx, setSrcIdx] = createSignal(0);
	const [useFrameInterpolation, setUseFrameInterpolation] = createSignal(false);
	const [playOnHover, setPlayOnHover] = createSignal(false);
	const [autoResizeCanvas, setAutoResizeCanvas] = createSignal(true);

	createEffect(() => {
		dotLottie()?.addEventListener('play', console.log);
		dotLottie()?.addEventListener('freeze', console.log);
		dotLottie()?.addEventListener('unfreeze', console.log);
		dotLottie()?.addEventListener('pause', console.log);
		dotLottie()?.addEventListener('stop', console.log);
	});

	onCleanup(() => {
		dotLottie()?.removeEventListener('play', console.log);
		dotLottie()?.removeEventListener('freeze', console.log);
		dotLottie()?.removeEventListener('unfreeze', console.log);
		dotLottie()?.addEventListener('pause', console.log);
		dotLottie()?.addEventListener('stop', console.log);
	});

	return (
		<div
			style={{
				display: 'flex',
				'flex-direction': 'column',
				'align-items': 'center',
				gap: '10px',
			}}
		>
			<DotLottieSolid
				dotLottieRefCallback={setDotlottie}
				useFrameInterpolation={useFrameInterpolation()}
				src={animations[srcIdx()]}
				autoplay
				loop={loop()}
				speed={speed()}
				playOnHover={playOnHover()}
				autoResizeCanvas={autoResizeCanvas()}
				style={{
					height: '500px',
				}}
			/>
			<div
				style={{
					display: 'flex',
					gap: '10px',
				}}
			>
				<button
					onClick={() => {
						dotLottie()?.play();
					}}
				>
					Play
				</button>
				<button
					onClick={() => {
						dotLottie()?.pause();
					}}
				>
					Pause
				</button>
				<button
					onClick={() => {
						dotLottie()?.stop();
					}}
				>
					Stop
				</button>
				<button
					onClick={() => {
						setLoop(!loop());
					}}
				>
					{loop() ? 'Looping' : 'Not looping'}
				</button>
				<button
					onClick={() => {
						setSpeed(speed() + 0.1);
					}}
				>
					+ Speed
				</button>
				<button
					onClick={() => {
						setSpeed(speed() - 0.1);
					}}
				>
					- Speed
				</button>
				<button
					onClick={() => {
						const totalAnimations = animations.length;
						const nextSrcIdx = (srcIdx() + 1) % totalAnimations;

						setSrcIdx(nextSrcIdx);
					}}
				>
					Change src
				</button>
				<button
					onClick={() => {
						setUseFrameInterpolation(!useFrameInterpolation());
					}}
				>
					{useFrameInterpolation()
						? 'Using frame interpolation'
						: 'Not using frame interpolation'}
				</button>
				<button
					onClick={() => {
						setPlayOnHover(!playOnHover());
					}}
				>
					{playOnHover() ? 'Play on hover' : 'Not play on hover'}
				</button>
				<label>
					<input
						type="checkbox"
						checked={autoResizeCanvas()}
						onChange={() => {
							setAutoResizeCanvas(!autoResizeCanvas());
						}}
					/>
					Auto Resize
				</label>
			</div>
		</div>
	);
};

export default App;
