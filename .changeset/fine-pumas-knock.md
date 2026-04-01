---
"@lottiefiles/dotlottie-web": minor
---

**Dependency Updates:**

- **Bumped `dotlottie-rs` WASM bindings to v0.1.56 (commit `afbf24b6`):** This update integrates core underlying fixes for the state machine.

**State Machine fixes:**

- **Corrected state entry execution order:** Animations are now explicitly loaded before setting markers, playback modes, or autoplay. This ensures that markers resolve correctly against the newly loaded animation's data.
- **Fixed rendering failures during animation switches:** Cleared stale theme data when switching animations. Previously, `load_animation()` re-applied saved themes specific to the old animation. These stale slot values caused `flush_slots()` to fail, silently breaking `render()` and preventing the `OnComplete` event from firing.
- **Disabled tweened transitions across different animations:** Because tweening interpolates between markers within a single animation's timeline, cross-animation tweens caused visual glitches by tweening the old animation before abruptly switching. These now default to instant transitions.
- **Fixed `GlobalState` configuration:** Ignored the `animation` property on `GlobalState`.