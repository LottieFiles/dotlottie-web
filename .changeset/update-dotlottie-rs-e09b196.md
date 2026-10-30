---
"@lottiefiles/dotlottie-web": patch
---

Update dotlottie-rs WASM bindings to `e09b196`. Audio now plays WAV, FLAC, Ogg and M4A, uses the left channel of a layer's volume (static `[100, 0]` levels were silent), and a volume above 100% or below 0 no longer breaks the player.
