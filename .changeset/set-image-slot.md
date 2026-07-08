---
"@lottiefiles/dotlottie-web": minor
---

Add `setImageSlot` to `DotLottie` and `DotLottieWorker` for replacing an animation's image slot with a custom source. Accepts a `data:` URI or an `http(s)://` URL (fetched and inlined automatically, since the WASM renderer can only decode embedded images); returns a `Promise<boolean>`.
