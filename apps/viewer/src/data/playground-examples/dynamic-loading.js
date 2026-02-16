import { DotLottie } from 'https://esm.sh/@lottiefiles/dotlottie-web';

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '400px';
document.body.appendChild(canvas);

// Dynamically switch between animations
const animations = [
  'https://lottie.host/779299c1-d174-4359-a66b-6253897b33e7/yRJTT0fCfq.lottie',
  'https://lottie.host/294b684d-d6b4-4116-ab35-85ef566d4379/VkGHcqcMUI.lottie',
  'https://lottie.host/884c11a9-e648-4b2f-9906-2c77279710b1/PalAqPKzRZ.lottie',
];

let currentIndex = 0;

const dotLottie = new DotLottie({
  canvas,
  src: animations[currentIndex],
  autoplay: true,
  loop: true,
});

dotLottie.addEventListener('load', () => {
  console.log('Loaded animation', currentIndex + 1);
});

// Switch animation every 3 seconds
setInterval(() => {
  currentIndex = (currentIndex + 1) % animations.length;
  dotLottie.load({
    src: animations[currentIndex],
    autoplay: true,
    loop: true,
  });
}, 3000);
