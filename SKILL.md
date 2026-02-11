---
name: dotlottie-web
description: >-
  Implement Lottie animations using dotLottie runtimes (@lottiefiles/dotlottie-web
  and @lottiefiles/dotlottie-react). Use when building, debugging, or optimizing
  dotLottie or Lottie animations in web projects, including vanilla JS, React,
  and Next.js. Covers package selection, Web Workers, state machines, theming,
  dynamic slot overriding, performance best practices, and common patterns.
license: MIT
metadata:
  author: lottiefiles
  version: "1.0.0"
  source: "https://github.com/LottieFiles/dotlottie-web"
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

Slots enable runtime customization of animated properties using typed APIs.
Available slot types: color, scalar, vector, gradient, text, image.

Key APIs: `getSlotIds()`, `getSlotType()`, `setColorSlot()`, `setScalarSlot()`,
`setVectorSlot()`, `setGradientSlot()`, `setTextSlot()`, `resetSlot()`, `clearSlots()`.

For complete API reference with code examples for each slot type, animated keyframes,
resetting, bulk updates, common use cases (branding, dark mode, progress indicators),
and React integration, see [Dynamic Slots Reference](references/dynamic-slots.md).

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
