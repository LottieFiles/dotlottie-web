import { DotLottie } from 'https://esm.sh/@lottiefiles/dotlottie-web';

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '400px';
document.body.appendChild(canvas);

// Event listeners for animation lifecycle
const dotLottie = new DotLottie({
  canvas,
  src: 'https://lottie.host/779299c1-d174-4359-a66b-6253897b33e7/yRJTT0fCfq.lottie',
  autoplay: true,
  loop: false, // Set to false to see complete event
});

// Called when animation data is loaded
dotLottie.addEventListener('load', () => {
  console.log('Animation loaded!');
  console.log('Total frames:', dotLottie.totalFrames);
  console.log('Duration:', dotLottie.duration, 'seconds');
});

// Called on each frame render
dotLottie.addEventListener('frame', ({ currentFrame }) => {
  console.log('Frame:', Math.round(currentFrame));
});

// Called when animation completes (only if loop is false)
dotLottie.addEventListener('complete', () => {
  console.log('Animation completed!');
});

// Called when loop completes
dotLottie.addEventListener('loop', ({ loopCount }) => {
  console.log('Loop count:', loopCount);
});
