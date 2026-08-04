// Motion API — async sequencing
// animate() returns an animation id and a "motionComplete" event fires when it
// settles — wrap that in a promise and choreograph multi-step sequences with
// plain async/await: shake, ignite, lift off, land.
// Requires a dotlottie-web build with the Motion API (dotlottie-rs feat/motion-api).

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '300px';
document.body.appendChild(canvas);

const dotLottie = new DotLottie({
  canvas,
  src: './motion-assets/launch.json', // named layers: "rocket", "flame", "pad"
  autoplay: true,
  loop: true,
});

// Resolve when a specific animation settles
function finished(animationId) {
  return new Promise((resolve) => {
    const onComplete = (event) => {
      if (event.animationId === animationId) {
        dotLottie.removeEventListener('motionComplete', onComplete);
        resolve();
      }
    };
    dotLottie.addEventListener('motionComplete', onComplete);
  });
}

let running = false;

canvas.addEventListener('pointerdown', async () => {
  if (running) return;
  running = true;

  // 1. Shake on the pad
  await finished(dotLottie.animate('rocket', { rotate: [0, -4, 4, 0] }, { duration: 0.5 }));

  // 2. Ignite and lift off with a soft spring
  dotLottie.setNode('flame', { opacity: 1 });
  await finished(dotLottie.animate('rocket', { y: -420 }, { type: 'spring', stiffness: 60, damping: 14 }));

  // 3. Cut the engine and glide back down
  dotLottie.setNode('flame', { opacity: 0 });
  await finished(dotLottie.animate('rocket', { y: 0, rotate: 0 }, { duration: 0.6, ease: 'easeInOut' }));

  running = false;
});

console.log('Click to launch — each step awaits the previous one via motionComplete');
