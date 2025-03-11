// import { DotLottieReact, DotLottie, setWasmUrl, OpenUrl, OpenUrlMode } from '@lottiefiles/dotlottie-react';
import { DotLottieWorkerReact, DotLottieWorker, setWasmUrl } from '@lottiefiles/dotlottie-react';
import React, { useState } from 'react';

// import smData from './open_url_rating.json';
// import pigeonData from './loop_complete.json'
// import starAnimation from './star-rating.json';
// import starSM from './starRating.json';
// import pigeonAnimation from './exploding-pigeon.json';
// import pigeonSM from './exploding-pigeon-sm.json';

const animations = [
  // pigeon
  // 'https://assets.codepen.io/11716235/sm_exploding_pigeon.lottie'
  // 'https://assets.codepen.io/11716235/sm_star_rating.lottie',
  //minecraft
  // 'https://asset-cdn.lottiefiles.dev/1452b1e1-1d27-4394-a39a-a3c838e2b477/aUwJ8LNLZd.lottie',
  //pig
  // 'https://asset-cdn.lottiefiles.dev/dc0615d8-a1fb-4c25-866b-2152d3cdc0c9/L9pOD3RJen.lottie'
];

setWasmUrl(new URL('../../../packages/web/src/core/dotlottie-player.wasm', import.meta.url).href);

function App() {
  const [dotLottie, setDotLottie] = useState<DotLottieWorker | null>(null);
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
      setCurrentFrame(event.currentFrame);
    }

    function onLoad() {
      console.log('onLoad');
      if (dotLottie) {
        setAllMarkers(dotLottie.markers().map((marker) => marker.name));
        setAnimationsIds(dotLottie.manifest?.animations.map((animation) => animation.id) || []);
        setCurrentAnimationId(dotLottie.activeAnimationId || '');
      }
    }

    dotLottie?.addEventListener('play', console.log);
    dotLottie?.addEventListener('complete', console.log);
    dotLottie?.addEventListener('freeze', console.log);
    dotLottie?.addEventListener('unfreeze', console.log);
    dotLottie?.addEventListener('pause', console.log);
    dotLottie?.addEventListener('stop', console.log);
    dotLottie?.addEventListener('load', onLoad);
    dotLottie?.addEventListener('frame', updateCurrentFrame);

    // ------------------------------------------------------------------------------------

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
      <DotLottieWorkerReact
        dotLottieRefCallback={setDotLottie}
        useFrameInterpolation={useFrameInterpolation}
        // src={animations[srcIdx]}
        src={'https://assets.codepen.io/11716235/sm_smiley_slider.lottie'}
        speed={speed}
        stateMachineId="smiley_slider"
        playOnHover={playOnHover}
        renderConfig={{
          autoResize: autoResizeCanvas,
        }}
        marker={marker}
        style={{
          margin: '2px',
          border: '1px solid white',
        }}
      />
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
        onClick={async () => {
          dotLottie?.addEventListener('stateMachineStart', () => {
            console.log('🚨 stateMachineStart');
          });
          dotLottie?.addEventListener('stateMachineTransition', (event) => {
            console.log('🚨 stateMachineTransition ', event.previousState, event.newState);
          });
          dotLottie?.addEventListener('stateMachineStateEntered', (event) => {
            console.log('🚨 enteringState ', event.enteringState);
          });
          dotLottie?.addEventListener('stateMachineStateExit', (event) => {
            console.log('🚨 state machine exit', event.exitingState);
          });
          dotLottie?.addEventListener('stateMachineStop', () => {
            console.log('🚨 state machine stop');
          });
          dotLottie?.addEventListener('stateMachineNumericInputValueChange', (event) => {
            console.log('🚨 state machine trigger value change', event.inputName, event.oldValue, event.newValue);
          });
          dotLottie?.addEventListener('stateMachineStringInputValueChange', (event) => {
            console.log('🚨 state machine trigger value change', event.inputName, event.oldValue, event.newValue);
          });
          dotLottie?.addEventListener('stateMachineBooleanInputValueChange', (event) => {
            console.log('🚨 state machine trigger value change', event.inputName, event.oldValue, event.newValue);
          });

          dotLottie?.addEventListener('stateMachineCustomEvent', (message) => {
            console.log('🚨 stateMachineOnCustomEvent', message);
          });

          dotLottie?.addEventListener('stateMachineInputFired', (message) => {
            console.log('APP:: 🚨 stateMachineInputFired', message);
          });

          // const jsonSmData = JSON.stringify(smData);
          // const l = dotLottie?.stateMachineLoadData(jsonSmData);

          // const l = dotLottie?.stateMachineLoadData(JSON.stringify(pigeonSM));
          const l = dotLottie?.stateMachineLoad('smiley_slider');

          // let config = OpenUrl();

          // const config = OpenUrl({
          //   url: 'https://www.lottiefiles.com',
          //   target: '_blank',
          // })

          const s = dotLottie?.stateMachineStart();

          console.log(l, s);
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
          // dotLottie?.stateMachineStop();
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

          console.log(nextSrcIdx);

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
