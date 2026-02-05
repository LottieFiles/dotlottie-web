---
name: dotlottie
description: Guidelines for implementing dotLottie animations in web applications
---

# dotLottie Implementation Guidelines

You are an expert at implementing Lottie animations using dotLottie runtimes. Follow these guidelines when working with dotLottie in web projects.

## Package Selection

### Use `@lottiefiles/dotlottie-web` when:

* You need direct canvas control
* Building framework-agnostic code
* Maximum performance is critical
* You want the smallest bundle

### Use `@lottiefiles/dotlottie-react` when:

* Building React applications
* You want declarative component API
* You need React lifecycle integration

## Installation

```bash
# Web (vanilla JS, Vue, Svelte, etc.)
npm install @lottiefiles/dotlottie-web

# React
npm install @lottiefiles/dotlottie-react
```

## Basic Implementation

### Vanilla JavaScript

```typescript
import { DotLottie } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottie({
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  src: 'https://example.com/animation.lottie',
  autoplay: true,
  loop: true,
});
```

### React

```tsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

function Animation() {
  return (
    <DotLottieReact
      src="https://example.com/animation.lottie"
      autoplay
      loop
    />
  );
}
```

### React with Instance Control

```tsx
import { useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-web';

function Animation() {
  const dotLottieRef = useRef<DotLottie | null>(null);

  return (
    <DotLottieReact
      src="https://example.com/animation.lottie"
      dotLottieRefCallback={(dotLottie) => (dotLottieRef.current = dotLottie)}
    />
  );
}
```

## .lottie vs .json

**Always prefer `.lottie` format over `.json`:**

* Smaller file size (compressed)
* Supports multiple animations in one file
* Embedded assets (images, fonts)
* State machines for interactivity
* Theming with slots

## Web Workers (Recommended for Performance)

Use `DotLottieWorker` to offload animation rendering to a Web Worker, keeping the main thread free for UI interactions:

### Basic Worker Usage

```typescript
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

const dotLottie = new DotLottieWorker({
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  src: 'https://example.com/animation.lottie',
  autoplay: true,
  loop: true,
});
```

### Worker Grouping (Multiple Animations)

By default, all `DotLottieWorker` instances share the same worker. Group animations into separate workers using `workerId`:

```typescript
// Hero animation in its own worker
const heroAnimation = new DotLottieWorker({
  canvas: heroCanvas,
  src: 'hero.lottie',
  workerId: 'hero-worker',
});

// UI animations share a different worker
const buttonAnimation = new DotLottieWorker({
  canvas: buttonCanvas,
  src: 'button.lottie',
  workerId: 'ui-worker',
});
```

### When to Use Workers

* **Use `DotLottieWorker`** for:
  * Multiple simultaneous animations
  * Complex animations with many layers
  * Animations running alongside heavy JS operations
  * Mobile devices where main thread performance is critical

* **Use regular `DotLottie`** for:
  * Single simple animations
  * When you need synchronous frame access
  * SSR environments (workers not available)

### React with Workers

```tsx
import { DotLottieWorkerReact } from '@lottiefiles/dotlottie-react';

function Animation() {
  return (
    <DotLottieWorkerReact
      src="animation.lottie"
      autoplay
      loop
      workerId="my-worker" // Optional: dedicate to specific worker
    />
  );
}
```

## State Machines (Interactivity)

State machines enable interactive animations without code. See the [State Machine Guide](https://github.com/LottieFiles/dotlottie-web/wiki/dotLottie-State-Machine-Guide) for details.

```typescript
const dotLottie = new DotLottie({
  canvas,
  src: 'interactive.lottie', // Contains state machine
  autoplay: true,
});

// Fire events to trigger state transitions
dotLottie.stateMachineFireEvent('click');
dotLottie.stateMachineFireEvent('hover');
dotLottie.stateMachineFireEvent('custom-event');

// Set numeric/boolean/string inputs for state conditions
// See: https://github.com/LottieFiles/dotlottie-web/wiki/dotLottie-State-Machine-Guide#working-with-inputs
dotLottie.stateMachineSetNumericInput('progress', 0.5);
dotLottie.stateMachineSetBooleanInput('isActive', true);
dotLottie.stateMachineSetStringInput('mode', 'dark');
```

### State Machine Events

* `click` - User click/tap
* `hover` - Mouse enter
* `unhover` - Mouse leave
* `complete` - Animation finished
* Custom events defined in the state machine

## Theming with Slots

Slots allow runtime color/value customization. Themes follow the [dotLottie 2.0 spec](https://dotlottie.io/spec/2.0/#themes).

```typescript
const dotLottie = new DotLottie({
  canvas,
  src: 'themed.lottie',
  themeId: 'dark-mode', // Use embedded theme by ID
});

// Or apply theme data directly (JSON string per dotLottie 2.0 spec)
// See: https://dotlottie.io/spec/2.0/#themes
dotLottie.setThemeData(JSON.stringify({
  rules: [
    { id: 'primary-color', value: [1, 0.34, 0.13] }, // RGB values 0-1
  ]
}));
```

## Dynamic Slot Overriding

Slots enable runtime customization of animated properties. Use the typed slot APIs for type-safe property overriding.

### Discovering Available Slots

```typescript
// Get all slot IDs in the animation
const slotIds = dotLottie.getSlotIds();
// Returns: ['primary-color', 'scale', 'title-text', ...]

// Get the type of a specific slot
const type = dotLottie.getSlotType('primary-color');
// Returns: 'color' | 'scalar' | 'vector' | 'gradient' | 'text' | 'image' | undefined

// Get current value of a slot
const value = dotLottie.getSlot('primary-color');
// Returns the parsed slot value

// Get all slots as an object
const allSlots = dotLottie.getSlots();
// Returns: { 'primary-color': {...}, 'scale': {...}, ... }
```

### Slot Types and Their Setters

#### Color Slots

Override fill colors, stroke colors, or any color property.

```typescript
// Static color [r, g, b, a] - values 0-1
dotLottie.setColorSlot('background-color', [1, 0, 0, 1]); // Red

// Animated color (keyframes)
dotLottie.setColorSlot('background-color', [
  { t: 0, s: [1, 0, 0, 1] },   // Red at frame 0
  { t: 60, s: [0, 0, 1, 1] },  // Blue at frame 60
]);
```

#### Scalar Slots

Override single numeric values like rotation, opacity, stroke width.

```typescript
// Static value
dotLottie.setScalarSlot('rotation', 45);
dotLottie.setScalarSlot('opacity', 0.5);

// Animated value
dotLottie.setScalarSlot('rotation', [
  { t: 0, s: 0 },     // 0° at frame 0
  { t: 60, s: 360 },  // 360° at frame 60
]);
```

#### Vector Slots

Override position, scale, or any 2D/3D point property.

```typescript
// Static 2D vector
dotLottie.setVectorSlot('scale', [150, 150]);
dotLottie.setVectorSlot('position', [100, 200]);

// Animated vector
dotLottie.setVectorSlot('position', [
  { t: 0, s: [0, 0] },
  { t: 60, s: [100, 200] },
]);
```

#### Gradient Slots

Override gradient fills and strokes. Format: `[offset, r, g, b, offset, r, g, b, ...]`

```typescript
// Static gradient (red to blue)
dotLottie.setGradientSlot('bg-gradient', [
  0, 1, 0, 0,  // Red at position 0
  1, 0, 0, 1,  // Blue at position 1
]);

// Animated gradient
dotLottie.setGradientSlot('bg-gradient', [
  { t: 0, s: [0, 1, 0, 0, 1, 0, 0, 1] },
  { t: 60, s: [0, 0, 1, 0, 1, 1, 0, 0] },
]);
```

#### Text Slots

Override text content and styling. Supports partial updates - only provided properties change.

```typescript
// Full text document
dotLottie.setTextSlot('title', {
  t: 'Hello World',   // Text content
  s: 48,              // Font size
  f: 'Arial',         // Font family
  fc: [0, 0, 0, 1],   // Fill color (RGBA)
  j: 2,               // Justify: 0=left, 1=right, 2=center
  tr: 50,             // Tracking (letter spacing)
});

// Partial update - only change text, keep existing styles
dotLottie.setTextSlot('title', { t: 'New Text' });

// Change color only
dotLottie.setTextSlot('title', { fc: [1, 0, 0, 1] });
```

### Resetting Slots

```typescript
// Reset a single slot to its original value
dotLottie.resetSlot('primary-color');

// Clear a single slot's custom value
dotLottie.clearSlot('primary-color');

// Reset all slots to original values
dotLottie.resetSlots();

// Clear all custom slot values
dotLottie.clearSlots();
```

### Bulk Slot Updates

```typescript
// Set multiple slots at once (untyped, for advanced use)
dotLottie.setSlots({
  'primary-color': { a: 0, k: [1, 0, 0, 1] },
  'scale': { a: 0, k: [150, 150] },
});
```

### Common Use Cases

#### Dynamic Branding

```typescript
function applyBrandColors(primary: string, secondary: string) {
  const primaryRgb = hexToRgb(primary);  // Your conversion function
  const secondaryRgb = hexToRgb(secondary);

  dotLottie.setColorSlot('brand-primary', [...primaryRgb, 1]);
  dotLottie.setColorSlot('brand-secondary', [...secondaryRgb, 1]);
}
```

#### User-Customizable Text

```typescript
function updateGreeting(userName: string) {
  dotLottie.setTextSlot('greeting', { t: `Hello, ${userName}!` });
}
```

#### Responsive Scaling

```typescript
function updateScale(scaleFactor: number) {
  dotLottie.setVectorSlot('content-scale', [scaleFactor * 100, scaleFactor * 100]);
}
```

#### Dark Mode Toggle

```typescript
function setDarkMode(isDark: boolean) {
  if (isDark) {
    dotLottie.setColorSlot('background', [0.1, 0.1, 0.1, 1]);
    dotLottie.setColorSlot('text-color', [1, 1, 1, 1]);
  } else {
    dotLottie.resetSlot('background');
    dotLottie.resetSlot('text-color');
  }
}
```

#### Progress Indicator

```typescript
function updateProgress(percent: number) {
  // Assuming a scalar slot controls fill amount or similar
  dotLottie.setScalarSlot('progress-value', percent);
}
```

### React Integration

```tsx
import { useRef, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-web';

function BrandedAnimation({ primaryColor, userName }) {
  const dotLottieRef = useRef<DotLottie | null>(null);

  useEffect(() => {
    if (dotLottieRef.current) {
      dotLottieRef.current.setColorSlot('brand-color', primaryColor);
      dotLottieRef.current.setTextSlot('greeting', { t: `Welcome, ${userName}!` });
    }
  }, [primaryColor, userName]);

  return (
    <DotLottieReact
      src="branded-animation.lottie"
      autoplay
      loop
      dotLottieRefCallback={(dotLottie) => {
        dotLottieRef.current = dotLottie;
      }}
    />
  );
}
```

## Markers & Segments

### Playing Specific Segments

```typescript
// Play frames 0-60
dotLottie.setSegment(0, 60);
dotLottie.play();

// Play by marker name (defined in animation)
dotLottie.setMarker('intro');
dotLottie.play();
```

### Getting Markers

```typescript
const markers = dotLottie.markers();
// Returns: [{ name: 'intro', time: 0, duration: 60 }, ...]
```

## Event Handling

```typescript
dotLottie.addEventListener('load', () => {
  console.log('Animation loaded');
});

dotLottie.addEventListener('play', () => {
  console.log('Playing');
});

dotLottie.addEventListener('complete', () => {
  console.log('Animation completed');
});

dotLottie.addEventListener('frame', ({ currentFrame }) => {
  console.log('Frame:', currentFrame);
});

// Clean up
dotLottie.removeEventListener('load', handler);
```

## Performance Best Practices

### 1. Use Web Workers for Complex Animations

```typescript
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';

// Offload rendering to worker thread
const dotLottie = new DotLottieWorker({
  canvas,
  src: 'complex-animation.lottie',
});
```

### 2. Lazy Load Animations

```typescript
// Only load when visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadAnimation();
      observer.disconnect();
    }
  });
});
observer.observe(container);
```

### 3. Auto-Freeze is Enabled by Default

DotLottie automatically freezes animations when they're not visible (offscreen). To disable this behavior:

```typescript
const dotLottie = new DotLottie({
  canvas,
  src: 'animation.lottie',
  renderConfig: {
    freezeOnOffscreen: false, // Disable auto-freeze (not recommended)
  },
});
```

### 4. Device Pixel Ratio

By default, devicePixelRatio is set to 75% of the actual value for better performance. For full retina quality (with higher performance cost):

```typescript
const dotLottie = new DotLottie({
  canvas,
  src: 'animation.lottie',
  renderConfig: {
    devicePixelRatio: window.devicePixelRatio, // Full retina (higher CPU/GPU)
  },
});
```

### 5. Clean Up (Vanilla JS only)

```typescript
// Always destroy when done (vanilla JS)
dotLottie.destroy();
```

**Note:** `DotLottieReact` handles cleanup automatically on unmount - no manual cleanup needed.

### 6. Frame Interpolation Control

```typescript
const dotLottie = new DotLottie({
  canvas,
  src: 'animation.lottie',
  useFrameInterpolation: true,  // Smooth playback (default)
  // useFrameInterpolation: false, // Match original AE frame rate
});
```

## Multi-Animation Files

A single `.lottie` file can contain multiple animations:

```typescript
// Load specific animation by ID
dotLottie.loadAnimation('animation-2');

// Get all animation IDs
const animations = dotLottie.manifest?.animations;
// Returns: [{ id: 'animation-1' }, { id: 'animation-2' }]
```

## Canvas Sizing

**Set canvas size via CSS styles** (recommended). DotLottie will automatically determine the optimal drawing area:

```html
<canvas id="canvas" style="width: 400px; height: 400px;"></canvas>
```

### Auto-Resize to Container

Use the `autoResize` render config to automatically resize when the container changes:

```typescript
const dotLottie = new DotLottie({
  canvas,
  src: 'animation.lottie',
  renderConfig: {
    autoResize: true, // Canvas resizes to fit container
  },
});
```

## Common Patterns

### Play on Hover

```typescript
canvas.addEventListener('mouseenter', () => dotLottie.play());
canvas.addEventListener('mouseleave', () => dotLottie.pause());
```

### Play on Click (Once)

```typescript
canvas.addEventListener('click', () => {
  dotLottie.setFrame(0);
  dotLottie.setLoop(false);
  dotLottie.play();
});
```

### Scrub with Scroll

```typescript
window.addEventListener('scroll', () => {
  const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const frame = progress * dotLottie.totalFrames;
  dotLottie.setFrame(frame);
});
```

### Loading States (React)

```tsx
function Animation() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && <Skeleton />}
      <DotLottieReact
        src="animation.lottie"
        style={{ opacity: isLoaded ? 1 : 0 }}
        dotLottieRefCallback={(dotLottie) => {
          dotLottie.addEventListener('load', () => setIsLoaded(true));
        }}
      />
    </>
  );
}
```

### Responsive Animation

```tsx
function ResponsiveAnimation() {
  return (
    <DotLottieReact
      src="animation.lottie"
      autoplay
      loop
      style={{ width: '100%', maxWidth: '400px' }}
      renderConfig={{ autoResize: true }}
    />
  );
}
```

## Debugging

```typescript
// Check if loaded
console.log('Loaded:', dotLottie.isLoaded);

// Get animation info
console.log('Duration:', dotLottie.duration);
console.log('Total Frames:', dotLottie.totalFrames);
console.log('Current Frame:', dotLottie.currentFrame);
console.log('Is Playing:', dotLottie.isPlaying);
console.log('Loop:', dotLottie.loop);
console.log('Speed:', dotLottie.speed);

// Get manifest (for .lottie files)
console.log('Manifest:', dotLottie.manifest);
```

## Error Handling

```typescript
dotLottie.addEventListener('loadError', (error) => {
  console.error('Failed to load animation:', error);
  // Show fallback UI
});
```

## SSR / Next.js Considerations

dotLottie requires browser APIs. For SSR frameworks:

```tsx
import dynamic from 'next/dynamic';

const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then(mod => mod.DotLottieReact),
  { ssr: false }
);

function Animation() {
  return <DotLottieReact src="animation.lottie" autoplay loop />;
}
```

## Resources

* Documentation: [https://developers.lottiefiles.com/docs/dotlottie-player](https://developers.lottiefiles.com/docs/dotlottie-player)
* State Machine Guide: [https://github.com/LottieFiles/dotlottie-web/wiki/dotLottie-State-Machine-Guide](https://github.com/LottieFiles/dotlottie-web/wiki/dotLottie-State-Machine-Guide)
* GitHub: [https://github.com/LottieFiles/dotlottie-web](https://github.com/LottieFiles/dotlottie-web)
* dotLottie 2.0 Spec: [https://dotlottie.io/spec/2.0/](https://dotlottie.io/spec/2.0/)
* Create .lottie files: [https://lottiefiles.com](https://lottiefiles.com) or [https://creators.lottiefiles.com](https://creators.lottiefiles.com)
