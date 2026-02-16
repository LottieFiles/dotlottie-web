import { DotLottie } from 'https://esm.sh/@lottiefiles/dotlottie-web';

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '400px';
document.body.appendChild(canvas);

// Basic dotLottie animation
// biome-ignore lint/correctness/noUnusedVariables: example code - variable available for playground interaction
const dotLottie = new DotLottie({
  canvas,
  src: 'https://lottie.host/779299c1-d174-4359-a66b-6253897b33e7/yRJTT0fCfq.lottie',
  autoplay: true,
  loop: true,
});
