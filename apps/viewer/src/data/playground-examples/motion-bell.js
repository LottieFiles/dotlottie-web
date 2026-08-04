// Motion API — notification bell
// A complete micro-interaction over a fully static asset (zero authored keyframes):
// bell swing, clapper counter-swing, badge pop, ripple rings, and a spark burst
// are all runtime springs and tweens on named layers.
// Requires a dotlottie-web build with the Motion API (dotlottie-rs feat/motion-api).

// Create canvas element
const canvas = document.createElement('canvas');
canvas.style.width = '400px';
canvas.style.height = '300px';
canvas.style.cursor = 'pointer';
document.body.appendChild(canvas);

const dotLottie = new DotLottie({
  canvas,
  src: './motion-assets/bell.json', // named layers: bell, clapper, badge, ring-1, ring-2, spark-1..4
  autoplay: true,
  loop: true,
});

// Sparks are authored at their final burst positions around the bell crown.
// Each entry is the offset that moves it back onto the crown before launch.
const sparks = [
  { name: 'spark-1', x: 66, y: 30 },
  { name: 'spark-2', x: 12, y: 62 },
  { name: 'spark-3', x: -32, y: 58 },
  { name: 'spark-4', x: -72, y: 26 },
];

// Resting state: just the bell. Badge, ripples, and sparks wait for a notification.
// (Opacity overrides are 0–1 multipliers on the authored value — the asset authors
// these layers fully visible so the runtime can hide and reveal them at will.)
const rest = () => {
  dotLottie.setNode('badge', { opacity: 0, scale: 0.2 });
  dotLottie.setNode('ring-1', { opacity: 0 });
  dotLottie.setNode('ring-2', { opacity: 0 });
  sparks.forEach(({ name }) => dotLottie.setNode(name, { opacity: 0 }));
};

const notify = () => {
  // The whole decaying ring is ONE underdamped spring back to 0 — physics
  // writes the swing envelope. Clicking mid-swing redirects it with velocity
  // handoff, so spamming the bell speeds it up instead of snapping it.
  dotLottie.animate('bell', { rotate: [14, 0] }, { type: 'spring', stiffness: 260, damping: 5 });

  // Clapper counter-swings at a different frequency so the two drift in and
  // out of phase — that slight disagreement is what sells the physicality.
  dotLottie.animate('clapper', { rotate: [-22, 0] }, { type: 'spring', stiffness: 340, damping: 6 });

  // Badge pops in with overshoot, just after the swing starts.
  dotLottie.setNode('badge', { opacity: 1 });
  dotLottie.animate('badge', { scale: [0.2, 1] }, { type: 'spring', bounce: 0.55, visualDuration: 0.4, delay: 0.1 });

  // Two ripples chase each other outward and dissolve.
  dotLottie.animate('ring-1', { scale: [0.55, 1.25], opacity: [0.9, 0] }, { duration: 0.6, ease: 'easeOut' });
  dotLottie.animate(
    'ring-2',
    { scale: [0.5, 1.4], opacity: [0.6, 0] },
    { duration: 0.75, ease: 'easeOut', delay: 0.12 },
  );

  // Sparks launch from the crown to their authored spots (spring), while a
  // separate opacity tween flashes them in and burns them out.
  sparks.forEach(({ name, x, y }, i) => {
    dotLottie.setNode(name, { x, y });
    dotLottie.animate(name, { x: 0, y: 0 }, { type: 'spring', bounce: 0.3, visualDuration: 0.5, delay: i * 0.04 });
    dotLottie.animate(name, { opacity: [0, 1, 1, 0] }, { duration: 0.65, ease: 'easeOut', delay: i * 0.04 });
  });
};

dotLottie.addEventListener('load', () => {
  rest();
  setTimeout(notify, 600); // one incoming notification to set the scene
});

canvas.addEventListener('pointerdown', notify);

console.log('Click the bell — every ring is springs over a static, keyframe-less asset');
