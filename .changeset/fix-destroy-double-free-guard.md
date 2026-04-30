---
"@lottiefiles/dotlottie-web": patch
---

Fix `Error: null pointer passed to rust` thrown from `DotLottie.destroy()` on iOS Safari 15.5. Make `destroy()` idempotent: null `_dotLottieCore` before invoking `free()`, and swallow wasm-side cleanup errors so they don't propagate into React error boundaries on unmount.
