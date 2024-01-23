import { DotLottieReact, DotLottie } from '@lottiefiles/dotlottie-react';
import { FrameEvent } from '@lottiefiles/dotlottie-web';
import React, { useState } from 'react';

const animations = [
  'https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie',
  'https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json',
  './dragon.json',
];

function App() {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const [loop, setLoop] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [srcIdx, setSrcIdx] = useState(0);
  const [useFrameInterpolation, setUseFrameInterpolation] = useState(false);

  React.useEffect(() => {
    function updateCurrentFrame(event: FrameEvent) {
      setCurrentFrame(event.currentFrame);
    }

    dotLottie?.addEventListener('play', console.log);
    dotLottie?.addEventListener('pause', console.log);
    dotLottie?.addEventListener('stop', console.log);
    dotLottie?.addEventListener('load', console.log);
    dotLottie?.addEventListener('frame', updateCurrentFrame);

    return () => {
      dotLottie?.removeEventListener('play', console.log);
      dotLottie?.addEventListener('pause', console.log);
      dotLottie?.addEventListener('stop', console.log);
      dotLottie?.removeEventListener('load', console.log);
      dotLottie?.removeEventListener('frame', updateCurrentFrame);
    };
  }, [dotLottie]);

  const progress = dotLottie?.isLoaded ? (currentFrame / dotLottie.totalFrames) * 100 : 0;

  return (
    <>
      <DotLottieReact
        style={{
          maxWidth: '400px',
        }}
        dotLottieRefCallback={setDotLottie}
        useFrameInterpolation={useFrameInterpolation}
        src={animations[srcIdx]}
        autoplay
        loop={loop}
        speed={speed}
      />
      <input type="range" min="0" max="100" defaultValue="0" value={progress} />
      <button
        onClick={() => {
          dotLottie?.play();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          dotLottie?.pause();
        }}
      >
        Pause
      </button>
      <button
        onClick={() => {
          dotLottie?.stop();
        }}
      >
        Stop
      </button>
      <button
        onClick={() => {
          setLoop(!loop);
        }}
      >
        {loop ? 'Looping' : 'Not looping'}
      </button>
      <button
        onClick={() => {
          setSpeed(speed + 0.1);
        }}
      >
        + Speed
      </button>
      <button
        onClick={() => {
          setSpeed(speed - 0.1);
        }}
      >
        - Speed
      </button>
      <button
        onClick={() => {
          const totalAnimations = animations.length;

          const nextSrcIdx = (srcIdx + 1) % totalAnimations;

          setSrcIdx(nextSrcIdx);
        }}
      >
        Change src
      </button>
      <button
        onClick={() => {
          setUseFrameInterpolation(!useFrameInterpolation);
        }}
      >
        {useFrameInterpolation ? 'Using frame interpolation' : 'Not using frame interpolation'}
      </button>
    </>
  );
}

export default App;
