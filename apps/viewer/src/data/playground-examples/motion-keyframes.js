import { DotLottie } from 'https://esm.sh/@lottiefiles/dotlottie-web';

// Motion API — keyframe waypoints
// Pass an array of values to animate() and it tweens through each waypoint,
// just like motion.dev keyframes: scale [1, 1.4, 1] pops out and back in one call.
// Requires a dotlottie-web build with the Motion API (dotlottie-rs feat/motion-api).

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '300px';
document.body.appendChild(canvas);

const dotLottie = new DotLottie({
  canvas,
  src: './motion-assets/heart.json', // named layer: "heart"
  autoplay: true,
  loop: true,
});

canvas.addEventListener('pointerdown', () => {
  // Waypoint keyframes over a single eased tween.
  // ease accepts presets ("linear", "easeIn", "easeOut", "easeInOut")
  // or a cubic-bezier array like [0.22, 1, 0.36, 1].
  dotLottie.animate('heart', { scale: [1, 1.4, 1], rotate: [0, -8, 0] }, { duration: 0.45, ease: 'easeOut' });
});

console.log('Click the heart — keyframe waypoints compose on top of its authored pulse');
