# Dynamic Slot Overriding

Slots enable runtime customization of Lottie animated properties. Use the typed slot APIs for type-safe property overriding.

## Discovering Available Slots

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

## Slot Types and Their Setters

### Color Slots

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

### Scalar Slots

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

### Vector Slots

Override position, scale, or any 2D point property.

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

### Gradient Slots

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

### Text Slots

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

## Resetting Slots

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

## Bulk Slot Updates

```typescript
// Set multiple slots at once (untyped, for advanced use)
dotLottie.setSlots({
  'primary-color': { a: 0, k: [1, 0, 0, 1] },
  'scale': { a: 0, k: [150, 150] },
});
```

## Common Use Cases

### Dynamic Branding

```typescript
function applyBrandColors(primary: string, secondary: string) {
  const primaryRgb = hexToRgb(primary);  // Your conversion function
  const secondaryRgb = hexToRgb(secondary);

  dotLottie.setColorSlot('brand-primary', [...primaryRgb, 1]);
  dotLottie.setColorSlot('brand-secondary', [...secondaryRgb, 1]);
}
```

### User-Customizable Text

```typescript
function updateGreeting(userName: string) {
  dotLottie.setTextSlot('greeting', { t: `Hello, ${userName}!` });
}
```

### Responsive Scaling

```typescript
function updateScale(scaleFactor: number) {
  dotLottie.setVectorSlot('content-scale', [scaleFactor * 100, scaleFactor * 100]);
}
```

### Dark Mode Toggle

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

### Progress Indicator

```typescript
function updateProgress(percent: number) {
  // Assuming a scalar slot controls fill amount or similar
  dotLottie.setScalarSlot('progress-value', percent);
}
```

## React Integration

```tsx
import { useRef, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { DotLottie } from '@lottiefiles/dotlottie-web';

function BrandedAnimation({ primaryColor, userName }) {
  const dotLottieRef = useRef<DotLottie | null>(null);
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);

  useEffect(() => {
    if (dotLottieRef.current && isLoaded) {
      dotLottieRef.current.setColorSlot('brand-color', primaryColor);
      dotLottieRef.current.setTextSlot('greeting', { t: `Welcome, ${userName}!` });
    }
  }, [primaryColor, userName, isLoaded]);

  return (
    <DotLottieReact
      src="branded-animation.lottie"
      autoplay
      loop
      dotLottieRefCallback={(dotLottie) => {
        dotLottieRef.current = dotLottie;
        dotLottie.addEventListener("load", () => setIsLoaded(true));
      }}
    />
  );
}
