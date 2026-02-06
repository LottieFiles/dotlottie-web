import { DotLottie } from 'https://esm.sh/@lottiefiles/dotlottie-web';

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '400px';
document.body.appendChild(canvas);

// Interactive animation - play on hover
const dotLottie = new DotLottie({
  canvas,
  src: 'https://lottie.host/779299c1-d174-4359-a66b-6253897b33e7/yRJTT0fCfq.lottie',
  autoplay: false,
  loop: true,
});

// Play when mouse enters
canvas.addEventListener('mouseenter', () => {
  dotLottie.play();
  console.log('Playing - mouse entered');
});

// Pause when mouse leaves
canvas.addEventListener('mouseleave', () => {
  dotLottie.pause();
  console.log('Paused - mouse left');
});

console.log('Hover over the canvas to play!');
