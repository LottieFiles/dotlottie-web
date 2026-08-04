// Motion API — ghost trails with runtime node duplication
// duplicateNode() deep-copies a layer at its current pose — animate the copy
// out (additive blend, fading, scaling up) and remove it when it settles.
// The scene graph itself becomes a motion primitive.
// Requires a dotlottie-web build with the Motion API (dotlottie-rs feat/motion-api).

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '300px';
document.body.appendChild(canvas);

const dotLottie = new DotLottie({
  canvas,
  src: './motion-assets/knob.json', // named layers: "knob", "shadow"
  autoplay: true,
  loop: true,
});

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

let count = 0;

canvas.addEventListener('pointerdown', async () => {
  const ghost = `ghost-${++count}`;

  // Deep-copy the knob at its current pose under a new name
  if (!dotLottie.duplicateNode('knob', ghost)) return;

  // Style the copy: additive blend so overlapping ghosts glow
  dotLottie.setNode(ghost, { blend: 'add', opacity: 0.6 });

  // Animate it out, then clean it up once it settles
  const id = dotLottie.animate(ghost, { scale: 1.9, opacity: 0 }, { duration: 0.7, ease: 'easeOut' });
  await finished(id);
  dotLottie.removeNode(ghost);
});

console.log('Click repeatedly — each click spawns a glowing ghost that expands and fades');
