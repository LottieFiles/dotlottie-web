import { DotLottieReact, DotLottie } from '@lottiefiles/dotlottie-react';
import { useRef } from 'react';

function App() {
  const dotLottieInstanceRef = useRef<DotLottie | null>(null);

  return (
    <>
      <DotLottieReact
        dotLottieRefCallback={(dotLottieInstance) => {
          dotLottieInstanceRef.current = dotLottieInstance;
        }}
        src="https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie"
        autoplay
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
          console.log(dotLottieInstanceRef.current);

          dotLottieInstanceRef.current?.pause();
        }}
      >
        Pause
      </button>
    </>
  );
}

export default App;
