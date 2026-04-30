import type { DotLottie } from '@lottiefiles/dotlottie-react';
import { lazy, Suspense, useEffect, useState } from 'react';

type Renderer = 'canvas' | 'webgl' | 'webgpu';

import dotLottieCanvasWasmUrl from '../../../packages/web/src/core/dotlottie-player.wasm?url';
import dotLottieWebGLWasmUrl from '../../../packages/web/src/webgl/dotlottie-player.wasm?url';
import dotLottieWebGPUWasmUrl from '../../../packages/web/src/webgpu/dotlottie-player.wasm?url';

const DotLottieCanvas = lazy(() =>
  import('@lottiefiles/dotlottie-react').then((m) => {
    m.setWasmUrl(dotLottieCanvasWasmUrl);
    return { default: m.DotLottieReact };
  }),
);
const DotLottieWebGL = lazy(() =>
  import('@lottiefiles/dotlottie-react/webgl').then((m) => {
    m.setWasmUrl(dotLottieWebGLWasmUrl);
    return { default: m.DotLottieReact };
  }),
);
const DotLottieWebGPU = lazy(() =>
  import('@lottiefiles/dotlottie-react/webgpu').then((m) => {
    m.setWasmUrl(dotLottieWebGPUWasmUrl);
    return { default: m.DotLottieReact };
  }),
);

const rendererComponent = {
  canvas: DotLottieCanvas,
  webgl: DotLottieWebGL,
  webgpu: DotLottieWebGPU,
} as const;

const animations = [
  'https://lottie.host/e641272e-039b-4612-96de-138acfbede6e/bc0sW78EeR.lottie',
  'https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie',
  'https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json',
];

function App() {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
  const [renderer, setRenderer] = useState<Renderer>('canvas');
  const [loop, setLoop] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [srcIdx, setSrcIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    function onFrame(event: { currentFrame: number }) {
      setCurrentFrame(event.currentFrame);
    }

    dotLottie?.addEventListener('frame', onFrame);

    return () => {
      dotLottie?.removeEventListener('frame', onFrame);
    };
  }, [dotLottie]);

  const progress = dotLottie?.isLoaded ? (currentFrame / dotLottie.totalFrames) * 100 : 0;
  const Component = rendererComponent[renderer];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: '1rem' }}>dotlottie-react example</h2>

      {/* Renderer selector */}
      <fieldset style={{ marginBottom: '1rem', padding: '0.75rem', border: '1px solid #444', borderRadius: 8 }}>
        <legend>Renderer</legend>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {(['canvas', 'webgl', 'webgpu'] as const).map((r) => (
            <label key={r} style={{ cursor: 'pointer' }}>
              <input type="radio" name="renderer" value={r} checked={renderer === r} onChange={() => setRenderer(r)} />{' '}
              {r === 'canvas' ? 'Canvas 2D' : r.toUpperCase()}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Animation */}
      <Suspense
        fallback={<div style={{ height: 400, display: 'grid', placeItems: 'center' }}>Loading renderer...</div>}
      >
        <Component
          key={renderer}
          dotLottieRefCallback={setDotLottie}
          src={animations[srcIdx]}
          autoplay={autoplay}
          loop={loop}
          speed={speed}
          renderConfig={{ autoResize: true }}
          style={{ height: 400, border: '1px solid #333', borderRadius: 8 }}
        />
      </Suspense>

      {/* Progress */}
      <input type="range" min={0} max={100} value={progress} readOnly style={{ width: '100%', marginTop: '0.5rem' }} />

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
        <button onClick={() => dotLottie?.play()}>Play</button>
        <button onClick={() => dotLottie?.pause()}>Pause</button>
        <button onClick={() => dotLottie?.stop()}>Stop</button>
        <button onClick={() => setLoop((l) => !l)}>{loop ? 'Loop: ON' : 'Loop: OFF'}</button>
        <button onClick={() => setAutoplay((a) => !a)}>{autoplay ? 'Autoplay: ON' : 'Autoplay: OFF'}</button>
        <button onClick={() => setSpeed((s) => Math.round((s + 0.5) * 10) / 10)}>Speed +</button>
        <button onClick={() => setSpeed((s) => Math.max(0.5, Math.round((s - 0.5) * 10) / 10))}>Speed -</button>
        <button onClick={() => setSrcIdx((i) => (i + 1) % animations.length)}>Next animation</button>
      </div>
      <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
        Speed: {speed}x &middot; Frame: {Math.round(currentFrame)} &middot; Renderer: {renderer}
      </p>
    </div>
  );
}

export default App;
