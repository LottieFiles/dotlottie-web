// Motion API — drag with spring return
// A gesture loop: setNode() writes the layer offset on every pointer move,
// and on release a spring takes over from the drop position and settles home.
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

// x/y offsets are in composition units (this comp is 600 wide, drawn at 400 CSS px)
const toCompUnits = 600 / 400;

let dragging = false;
let startX = 0;
let startY = 0;

canvas.addEventListener('pointerdown', (e) => {
  dragging = true;
  startX = e.clientX;
  startY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  dotLottie.setNode('knob', {
    x: (e.clientX - startX) * toCompUnits,
    y: (e.clientY - startY) * toCompUnits,
  });
});

const release = () => {
  if (!dragging) return;
  dragging = false;
  // Hand off to a spring — it starts from wherever the drag left the knob
  dotLottie.animate('knob', { x: 0, y: 0 }, { type: 'spring', stiffness: 220, damping: 13 });
};

canvas.addEventListener('pointerup', release);
canvas.addEventListener('pointercancel', release);

console.log('Drag the knob and let go — it springs back while the shadow stays grounded');
