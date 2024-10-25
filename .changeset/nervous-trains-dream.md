---
'@lottiefiles/dotlottie-web': minor
---

feat(web): 🎸 added `getLayerBoundingBox` method

Basic usage:

```typescript
const canvas = document.getElementById('dotLottie-canvas');

const dotLottie = new DotLottie({
  canvas,
  ...
});

// Draw a rectangle around the layer 'Layer 1' after a frame is renderered
dotLottie.addEventListener('render', () => {
  const boundingBox = dotLottie.getLayerBoundingBox('Layer 1');
  const context = canvas.getContext('2d');

  if (boundingBox && context) {
    const { x, y, width, height } = boundingBox;
    context.strokeRect(x, y, width, height);
  }
});
```
