---
'@lottiefiles/dotlottie-web': minor
---

feat(web): 🎸 added `getLayerBoundingBox` method

Basic usage:

```typescript
// Draw a rectangle around the layer 'Layer 1'
dotLottie.addEventListener('render', () => {
  const boundingBox = dotLottie.getLayerBoundingBox('Layer 1');

  if (boundingBox) {
    const { x, y, width, height } = boundingBox;
    context.strokeRect(x, y, width, height);
  }
});
```
