// Motion API — scroll-linked parallax + layer discovery
// Scroll scrubs the authored timeline (setFrame) while setNode() layers
// parallax offsets on top — two motion sources composing on the same scene.
// layers() lists every named layer, so any animation is introspectable.
// Requires a dotlottie-web build with the Motion API (dotlottie-rs feat/motion-api).

// Create a scrollable stage with a sticky canvas
const box = document.createElement('div');
box.style.cssText = 'height: 300px; width: 400px; overflow-y: scroll; border-radius: 8px;';
const inner = document.createElement('div');
inner.style.cssText = 'height: 900px; position: relative;';
const canvas = document.createElement('canvas');
canvas.style.cssText = 'width: 400px; height: 300px; position: sticky; top: 0; display: block;';
inner.appendChild(canvas);
box.appendChild(inner);
document.body.appendChild(box);

const dotLottie = new DotLottie({
  canvas,
  src: './motion-assets/scene.json',
  autoplay: false, // scroll owns the timeline
});

dotLottie.addEventListener('load', () => {
  // Discover every named layer — each one is a live animate()/setNode() target
  console.log('Layers:', dotLottie.layers());
});

box.addEventListener('scroll', () => {
  const progress = box.scrollTop / (inner.offsetHeight - box.offsetHeight);

  // Scrub the authored timeline (the sun arcs across the sky)
  dotLottie.setFrame(progress * (dotLottie.totalFrames - 1));

  // Drive parallax offsets on top of the scrubbed frame
  dotLottie.setNode('cloud-1', { x: progress * 260 });
  dotLottie.setNode('cloud-2', { x: progress * -200 });
});

console.log('Scroll inside the box — the timeline scrubs while the clouds get parallax offsets');
