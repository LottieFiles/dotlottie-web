---
"@lottiefiles/dotlottie-web": patch
---

Fix WebGPU rendering channel-swapped or black on platforms where the preferred canvas format isn't `bgra8unorm` (e.g. Android/Linux Chrome). The redundant JS-side `gpuCtx.configure()` calls were conflicting with ThorVG's `bgra8unorm` pipelines and have been removed; ThorVG now owns surface configuration via the `dotlottie-rs` bridge.
