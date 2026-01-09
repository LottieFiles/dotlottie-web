import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { VirtualizedAnimationList } from '../components/virtualized/VirtualizedAnimationList';
import dotLottieWasmUrl from '../../../../packages/web/src/core/dotlottie-player.wasm?url';

DotLottie.setWasmUrl(dotLottieWasmUrl);

const BASE_ANIMATIONS = [
  'https://lottie.host/e641272e-039b-4612-96de-138acfbede6e/bc0sW78EeR.lottie',
  'https://lottie.host/f315768c-a29b-41fd-b5a8-a1c1dfb36cd2/CRiiNg8fqQ.lottie',
  'https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json',
  'https://lottie.host/68f06eea-5f90-4e58-b51e-3abe1fbd74b8/llUlrzgWDQ.lottie',
];

const generateAnimationUrls = (count: number): string[] =>
  Array.from({ length: count }, (_, i) => BASE_ANIMATIONS[i % BASE_ANIMATIONS.length]);

export const List = () => {
  const [animationCount] = useState(1000);
  const [itemHeight] = useState(220);
  const animations = useMemo(() => generateAnimationUrls(animationCount), [animationCount]);

  return (
    <div className="min-h-screen text-white bg-gray-950">
      <div className="max-w-6xl p-5 mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-sm text-purple-400 hover:text-purple-300">
              &larr; Back to Viewer
            </Link>
          </div>
        </header>
        <VirtualizedAnimationList animations={animations} itemHeight={itemHeight} />
      </div>
    </div>
  );
};
