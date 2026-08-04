import { DotLottie } from 'https://esm.sh/@lottiefiles/dotlottie-web';

// Motion API — spring hover
// animate() drives named layers at runtime, on top of the authored animation.
// Springs redirect mid-flight with velocity handoff, so fast hover in/out never snaps.
// Requires a dotlottie-web build with the Motion API (dotlottie-rs feat/motion-api).

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '300px';
document.body.appendChild(canvas);

const dotLottie = new DotLottie({
  canvas,
  src: './motion-assets/hover-card.json', // named layers: "card", "icon"
  autoplay: true,
  loop: true,
});

// Spring both layers to a new pose on hover
canvas.addEventListener('pointerenter', () => {
  dotLottie.animate('card', { scale: 1.06 }, { type: 'spring', stiffness: 350, damping: 16 });
  dotLottie.animate('icon', { scale: 1.35, rotate: 90 }, { type: 'spring', stiffness: 350, damping: 14 });
});

// Spring back on leave — no reset, no snap
canvas.addEventListener('pointerleave', () => {
  dotLottie.animate('card', { scale: 1 }, { type: 'spring', stiffness: 350, damping: 16 });
  dotLottie.animate('icon', { scale: 1, rotate: 0 }, { type: 'spring', stiffness: 350, damping: 14 });
});

console.log('Hover the card — the card and icon spring independently on top of the authored idle bob');
