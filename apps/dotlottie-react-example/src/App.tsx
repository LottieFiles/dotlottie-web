import { DotLottieReact, DotLottie, setWasmUrl } from '@lottiefiles/dotlottie-react';
// import { DotLottieReact, DotLottie, setWasmUrl } from '@lottiefiles/dotlottie-react';
import React, { useState } from 'react';

const animations = [
  'https://assets.codepen.io/11716235/sm_star_rating_1.lottie',
  // 'https://assets.codepen.io/11716235/sm_exploding_pigeon.lottie',
  // 'https://assets.codepen.io/11716235/sm_toggle_button.lottie',
  // 'https://assets.codepen.io/11716235/sm_theme_action.lottie',
  // 'https://assets.codepen.io/11716235/sm_smiley_slider.lottie'
];

setWasmUrl(new URL('../../../packages/web/src/core/dotlottie-player.wasm', import.meta.url).href);

function App() {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const [dotSecond] = useState<DotLottie | null>(null);
  const [loop, setLoop] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [srcIdx, setSrcIdx] = useState(0);
  const [useFrameInterpolation, setUseFrameInterpolation] = useState(false);
  const [playOnHover, setPlayOnHover] = useState(false);
  const [autoResizeCanvas, setAutoResizeCanvas] = useState(true);
  const [marker, setMarker] = useState('');
  const [allMarkers, setAllMarkers] = useState<string[]>([]);
  const [animationsIds, setAnimationsIds] = useState<string[]>([]);
  const [currentAnimationId, setCurrentAnimationId] = useState<string>('');

  React.useEffect(() => {
    function updateCurrentFrame(event: { currentFrame: number }) {
      // console.log('currentFrame', event.currentFrame);
      setCurrentFrame(event.currentFrame);
    }

    function onLoad() {
      if (dotLottie) {
        setAllMarkers(dotLottie.markers().map((marker) => marker.name));
        setAnimationsIds(dotLottie.manifest?.animations.map((animation) => animation.id) || []);
        setCurrentAnimationId(dotLottie.activeAnimationId || '');

        console.log('Adding event listeners');

        dotLottie?.addEventListener('stateMachineError', (message) => {
          console.error('StateMachineError: ', message);
        });
        dotLottie?.addEventListener('play', console.log);
        dotLottie?.addEventListener('loop', console.log);
        dotLottie?.addEventListener('complete', console.log);
        dotLottie?.addEventListener('freeze', console.log);
        dotLottie?.addEventListener('unfreeze', console.log);
        dotLottie?.addEventListener('pause', console.log);
        dotLottie?.addEventListener('stop', console.log);
        dotLottie?.addEventListener('frame', updateCurrentFrame);

        dotLottie?.addEventListener('stateMachineStart', console.log);
        dotLottie?.addEventListener('stateMachineStop', console.log);
        dotLottie?.addEventListener('stateMachineTransition', console.log);
        dotLottie?.addEventListener('stateMachineStateEntered', console.log);
        dotLottie?.addEventListener('stateMachineStateExit', console.log);
        dotLottie?.addEventListener('stateMachineCustomEvent', console.log);
        dotLottie?.addEventListener('stateMachineError', console.log);
        dotLottie?.addEventListener('stateMachineStringInputValueChange', console.log);
        dotLottie?.addEventListener('stateMachineNumericInputValueChange', console.log);
        dotLottie?.addEventListener('stateMachineBooleanInputValueChange', console.log);
        dotLottie?.addEventListener('stateMachineInputFired', console.log);
      }
    }

    dotLottie?.addEventListener('load', onLoad);

    return () => {
      dotLottie?.removeEventListener('play', console.log);
      dotLottie?.removeEventListener('freeze', console.log);
      dotLottie?.removeEventListener('unfreeze', console.log);
      dotLottie?.addEventListener('pause', console.log);
      dotLottie?.addEventListener('stop', console.log);
      dotLottie?.removeEventListener('load', onLoad);
      dotLottie?.removeEventListener('frame', updateCurrentFrame);
    };
  }, [dotLottie]);

  const progress = dotLottie?.isLoaded ? (currentFrame / dotLottie.totalFrames) * 100 : 0;

  return (
    <div>
      <div
        style={{
          marginBottom: '2000px',
        }}
      ></div>
      <DotLottieReact
        dotLottieRefCallback={setDotLottie}
        useFrameInterpolation={useFrameInterpolation}
        src={animations[srcIdx]}
        speed={speed}
        playOnHover={playOnHover}
        renderConfig={{
          autoResize: autoResizeCanvas,
        }}
        marker={marker}
        autoplay={true}
        loop={false}
        style={{
          margin: '2px',
          border: '1px solid white',
        }}
        animationId={currentAnimationId}
      />
      {/* <DotLottieReact
        dotLottieRefCallback={setDotSecond}
        useFrameInterpolation={useFrameInterpolation}
        src={animations[srcIdx]}
        speed={speed}
        autoplay
        playOnHover={playOnHover}
        renderConfig={{
          autoResize: autoResizeCanvas,
        }}
        marker={marker}
        style={{
          margin: '2px',
          border: '1px solid white',
        }}
        animationId={currentAnimationId}
      /> */}
      <input type="range" min="0" max="100" defaultValue="0" value={progress} />
      <label>
        Marker:
        <select
          onChange={(event) => {
            setMarker(event.target.value);
          }}
        >
          <option value="">Select a marker</option>
          {allMarkers.map((markerName) => (
            <option key={markerName} id={markerName} value={markerName}>
              {markerName}
            </option>
          ))}
        </select>
      </label>
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
          const error = dotLottie?.stateMachineLoad(dotLottie?.manifest?.stateMachines[0].id);

          console.log(error);

          const start = dotLottie?.stateMachineStart();

          console.log(error, start);

          ////

          const error2 = dotSecond?.stateMachineLoad(dotSecond?.manifest?.stateMachines[0].id);

          console.log(error2);

          const start2 = dotSecond?.stateMachineStart();

          console.log(error2, start2);
        }}
      >
        Load State Machine
      </button>
      <button
        onClick={() => {
          dotLottie?.stateMachineStop();
          dotSecond?.stateMachineStop();
        }}
      >
        Stop State Machine
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
      <button
        onClick={() => {
          setPlayOnHover(!playOnHover);
        }}
      >
        {playOnHover ? 'Play on hover' : 'Not play on hover'}
      </button>
      <input
        type="checkbox"
        checked={autoResizeCanvas}
        onChange={() => {
          setAutoResizeCanvas(!autoResizeCanvas);
        }}
      />
      Auto resize canvas
      <div>
        <label>
          Animation ID:
          <select value={currentAnimationId} onChange={(event) => setCurrentAnimationId(event.target.value)}>
            {animationsIds.map((animationId) => (
              <option key={animationId} value={animationId}>
                {animationId}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

export default App;
