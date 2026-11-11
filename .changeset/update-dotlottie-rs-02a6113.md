---
"@lottiefiles/dotlottie-web": patch
---

Update dotlottie-rs WASM bindings to `02a6113`. State machines now skip states, transitions, guards, actions and interactions they do not know instead of failing to load, and an event fired while a tween is running is kept until the tween ends.
