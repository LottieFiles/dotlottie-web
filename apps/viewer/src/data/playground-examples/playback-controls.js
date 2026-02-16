import { DotLottie } from 'https://esm.sh/@lottiefiles/dotlottie-web';

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '400px';
document.body.appendChild(canvas);

// Playback controls: speed, mode, and loop
const dotLottie = new DotLottie({
  canvas,
  src: 'https://lottie.host/779299c1-d174-4359-a66b-6253897b33e7/yRJTT0fCfq.lottie',
  autoplay: true,
  loop: true,
  speed: 1.5, // 1.5x speed
  mode: 'reverse', // Play in reverse ('forward', 'reverse', 'bounce', 'bounce-reverse')
});

// Change settings dynamically after 3 seconds
setTimeout(() => {
  dotLottie.setSpeed(0.5);
  dotLottie.setMode('bounce');
  console.log('Changed to 0.5x speed, bounce mode');
}, 3000);
