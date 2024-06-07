/**
 * Copyright 2024 Design Barn Inc.
 */

import { createEffect, createSignal, onCleanup, type Component } from 'solid-js';
import { type DotLottie, DotLottieSolid } from 'src';

const animations = [
  // eslint-disable-next-line no-secrets/no-secrets
  'https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json',
  // eslint-disable-next-line no-secrets/no-secrets
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

  function play(): void {
    dotLottie()?.play();
  }

  function pause(): void {
    dotLottie()?.pause();
  }

  function stop(): void {
    dotLottie()?.stop();
  }

  function handleLoop(): void {
    setLoop((prev) => !prev);
  }

  function increaseSpeed(): void {
    setSpeed((prev) => prev + 0.1);
  }

  function decreaseSpeed(): void {
    setSpeed((prev) => prev - 0.1);
  }

  function changeSrc(): void {
    const totalAnimations = animations.length;
    const nextSrcIdx = (srcIdx() + 1) % totalAnimations;

    setSrcIdx(nextSrcIdx);
  }

  function handleUseFrameInterpolation(): void {
    setUseFrameInterpolation((prev) => !prev);
  }

  function handlePlayOnHover(): void {
    setPlayOnHover((prev) => !prev);
  }

  function handleAutoResizeCanvas(): void {
    setAutoResizeCanvas((prev) => !prev);
  }

  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    dotLottieInstance.addEventListener('play', console.log);
    dotLottieInstance.addEventListener('freeze', console.log);
    dotLottieInstance.addEventListener('unfreeze', console.log);
    dotLottieInstance.addEventListener('pause', console.log);
    dotLottieInstance.addEventListener('stop', console.log);
  });

  onCleanup(() => {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    dotLottieInstance.removeEventListener('play', console.log);
    dotLottieInstance.removeEventListener('freeze', console.log);
    dotLottieInstance.removeEventListener('unfreeze', console.log);
    dotLottieInstance.removeEventListener('pause', console.log);
    dotLottieInstance.removeEventListener('stop', console.log);
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
        <button onClick={play}>Play</button>
        <button onClick={pause}>Pause</button>
        <button onClick={stop}>Stop</button>
        <button onClick={handleLoop}>{loop() ? 'Looping' : 'Not looping'}</button>
        <button onClick={increaseSpeed}>+ Speed</button>
        <button onClick={decreaseSpeed}>- Speed</button>
        <button onClick={changeSrc}>Change src</button>
        <button onClick={handleUseFrameInterpolation}>
          {useFrameInterpolation() ? 'Using frame interpolation' : 'Not using frame interpolation'}
        </button>
        <button onClick={handlePlayOnHover}>{playOnHover() ? 'Play on hover' : 'Not play on hover'}</button>
        <label>
          <input type="checkbox" checked={autoResizeCanvas()} onChange={handleAutoResizeCanvas} />
          Auto Resize
        </label>
      </div>
    </div>
  );
};

export default App;
