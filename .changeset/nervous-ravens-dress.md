---
'@lottiefiles/dotlottie-web': minor
---

* feat(web):🎸 added `ready` event to inform users when the WASM runtime is fully initialized.
* feat(web):🎸 added `isReady` property to `DotLottie` class to check if the WASM runtime is fully initialized.

Usage:

```js
const dotLottie = new DotLottie(...);

if (dotLottie.isReady) {
  // Safe to interact with the player
} else {
  dotLottie.addEventListener('ready', () => {
    // Safe to interact with the player
  });
}
```
