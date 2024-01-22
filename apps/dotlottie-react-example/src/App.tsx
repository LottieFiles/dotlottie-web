import { DotLottieReact, DotLottie } from '@lottiefiles/dotlottie-react';
import { useRef, useCallback } from 'react';

function App() {
  const dotLottieInstanceRef = useRef<DotLottie | null>(null);

  const dotLottieRefCallback = useCallback((dotLottieInstance: DotLottie | null) => {
    dotLottieInstanceRef.current = dotLottieInstance;

    dotLottieInstance?.addEventListener('freeze', console.log);
    dotLottieInstance?.addEventListener('unfreeze', console.log);
    dotLottieInstance?.addEventListener('load', console.log);
    dotLottieInstance?.addEventListener('play', console.log);
    dotLottieInstance?.addEventListener('pause', console.log);
  }, []);

  return (
    <>
      <DotLottieReact
        dotLottieRefCallback={dotLottieRefCallback}
        src="https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie"
        autoplay
        playOnHover
        loop
      />
      <button
        onClick={() => {
          dotLottieInstanceRef.current?.play();
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          dotLottieInstanceRef.current?.pause();
        }}
      >
        Pause
      </button>
    </>
  );
}

export default App;
