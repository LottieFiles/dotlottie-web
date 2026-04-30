---
"@lottiefiles/dotlottie-web": minor
---

- Upgrade `dotlottie-rs` wasm bindings to v0.1.57-6d23176.
- Reduce per-frame allocations by caching `ImageData` and rebuilding it only when the canvas dimensions or the WASM-backed `ArrayBuffer` change.
- Pre-bind the animation loop callback instead of re-binding every frame.
- Dispatch frame/loop events via `queueMicrotask` instead of `setTimeout(..., 0)` for lower-latency, lower-overhead delivery.
- Use `performance.now()` in the Node frame strategy for higher-resolution timing.
- Route worker messages through a single per-worker listener with RPC-reply and per-instance event handler maps, avoiding O(n) listener fan-out on every `postMessage`.
