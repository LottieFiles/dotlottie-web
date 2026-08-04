// Motion API — stagger entrance
// setNode() instantly writes override props, animate() springs them back —
// add an increasing delay per layer and you get a stagger, motion.dev style.
// Requires a dotlottie-web build with the Motion API (dotlottie-rs feat/motion-api).

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '300px';
document.body.appendChild(canvas);

const dotLottie = new DotLottie({
  canvas,
  src: './motion-assets/stars.json', // named layers: "star-1" … "star-5"
  autoplay: true,
  loop: true,
});

const stars = ['star-1', 'star-2', 'star-3', 'star-4', 'star-5'];

const replay = () => {
  stars.forEach((name, i) => {
    // Start each star above the canvas, invisible and rotated…
    dotLottie.setNode(name, { y: -140, opacity: 0, rotate: -90 });
    // …then spring it in, 80ms later than the previous one.
    // bounce/visualDuration is the perceptual way to shape a spring
    // (an alternative to stiffness/damping/mass).
    dotLottie.animate(
      name,
      { y: 0, opacity: 1, rotate: 0 },
      { type: 'spring', bounce: 0.35, visualDuration: 0.55, delay: i * 0.08 },
    );
  });
};

dotLottie.addEventListener('load', () => setTimeout(replay, 300));
canvas.addEventListener('pointerdown', replay);

console.log('Click the canvas to replay the staggered entrance');
