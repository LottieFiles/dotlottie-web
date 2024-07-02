import { type DotLottie, DotLottieSolid, setWasmUrl } from '@lottiefiles/dotlottie-solid';
import type { Component } from 'solid-js';
import { createEffect, createSignal, onCleanup } from 'solid-js';

import wasmUrl from '../../../packages/web/src/core/dotlottie-player.wasm?url';

const animations = [
  'https://lottie.host/b06d1336-2c08-4156-aa6f-96f08ff511e0/4itF1pXb1i.lottie',
  // eslint-disable-next-line no-secrets/no-secrets
  'https://lottie.host/294b684d-d6b4-4116-ab35-85ef566d4379/VkGHcqcMUI.lottie',
  // eslint-disable-next-line no-secrets/no-secrets
  'https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json',
  // eslint-disable-next-line no-secrets/no-secrets
  'https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie',
];

setWasmUrl(wasmUrl);

const App: Component = () => {
  const [dotLottie, setDotlottie] = createSignal<DotLottie>();
  const [loop, setLoop] = createSignal(true);
  const [speed, setSpeed] = createSignal(1);
  const [srcIdx, setSrcIdx] = createSignal(0);
  const [useFrameInterpolation, setUseFrameInterpolation] = createSignal(false);
  const [playOnHover, setPlayOnHover] = createSignal(false);
  const [autoResizeCanvas, setAutoResizeCanvas] = createSignal(true);
  const [animationIds, setAnimationIds] = createSignal<string[]>([]);
  const [themes, setThemes] = createSignal<string[]>([]);
  const [activeAnimationId, setActiveAnimationId] = createSignal('');
  const [themeId, setThemeId] = createSignal('');

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

  function handleActiveAnimationChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    setActiveAnimationId(value);
  }

  function handleActiveThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value;

    setThemeId(value);
  }

  function handleOnLoad(): void {
    const dotLottieInstance = dotLottie();

    if (!dotLottieInstance) return;

    const animIds = dotLottieInstance.manifest?.animations.map((animation) => {
      return animation.id;
    });
    const _themes = dotLottieInstance.manifest?.themes?.map((theme) => {
      return theme.id;
    });

    setAnimationIds(animIds || []);
    setThemes(_themes || []);
  }

  createEffect(() => {
    const dotLottieInstance = dotLottie();

    if (dotLottieInstance) {
      dotLottieInstance.addEventListener('play', console.log);
      dotLottieInstance.addEventListener('pause', console.log);
      dotLottieInstance.addEventListener('stop', console.log);
      dotLottieInstance.addEventListener('load', handleOnLoad);
    }
  });

  onCleanup(() => {
    dotLottie()?.removeEventListener('load', handleOnLoad);
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
        animationId={activeAnimationId()}
        themeId={themeId()}
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
          'flex-wrap': 'wrap',
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
        <label>
          Animations
          <select onChange={handleActiveAnimationChange}>
            {animationIds().map((id) => (
              <option value={id}>{id}</option>
            ))}
          </select>
        </label>
        <label>
          Themes
          <select onChange={handleActiveThemeChange}>
            <option value="">Default theme</option>
            {themes().map((id) => (
              <option value={id}>{id}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default App;
