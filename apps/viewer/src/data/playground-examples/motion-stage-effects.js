import { DotLottie } from 'https://esm.sh/@lottiefiles/dotlottie-web';

// Motion API — stage compositing effects
// "@stage" targets the whole animation. Three effects Lottie can't author:
//   clip — an animatable circular clip (iris reveal)
//   spot — a feathered alpha spotlight that chases the cursor
//   tint — duotone color grading (day/night) tweened live
// Requires a dotlottie-web build with the Motion API (dotlottie-rs feat/motion-api).

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '300px';
document.body.appendChild(canvas);

const button = document.createElement('button');
button.textContent = 'Toggle night';
button.style.cssText = 'margin-left: 12px; padding: 8px 16px; border-radius: 6px; border: 0; cursor: pointer;';
document.body.appendChild(button);

const dotLottie = new DotLottie({
  canvas,
  src: './motion-assets/scene.json',
  autoplay: true,
  loop: true,
});

// spot/clip coordinates are in canvas pixels
const px = (e) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) * canvas.width) / rect.width,
    y: ((e.clientY - rect.top) * canvas.height) / rect.height,
  };
};

dotLottie.addEventListener('load', () => {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Iris reveal: start fully clipped, tween the radius open
  dotLottie.setNode('@stage', {
    clip: { type: 'circle', cx, cy, r: 0 },
    spot: { cx, cy, r: canvas.width, feather: 0.5 },
    tint: { black: '#0b1030', white: '#ffd9a0', intensity: 0 },
  });
  dotLottie.animate('@stage', { 'clip.r': canvas.width }, { duration: 0.8, ease: 'easeInOut' });
});

// Spotlight: shrink on enter, spring after the cursor, open back up on leave
canvas.addEventListener('pointerenter', () => {
  dotLottie.animate('@stage', { 'spot.r': 130 }, { type: 'spring', bounce: 0.2, visualDuration: 0.35 });
});
canvas.addEventListener('pointermove', (e) => {
  const { x, y } = px(e);
  dotLottie.animate('@stage', { 'spot.cx': x, 'spot.cy': y }, { type: 'spring', visualDuration: 0.15, bounce: 0 });
});
canvas.addEventListener('pointerleave', () => {
  dotLottie.animate('@stage', { 'spot.r': canvas.width }, { duration: 0.4, ease: 'easeOut' });
});

// Day / night grading: tween the duotone intensity
let night = false;
button.addEventListener('click', () => {
  night = !night;
  dotLottie.animate('@stage', { 'tint.intensity': night ? 0.75 : 0 }, { duration: 0.9, ease: 'easeInOut' });
});

console.log('Move the pointer for the spotlight, click "Toggle night" for live color grading');
