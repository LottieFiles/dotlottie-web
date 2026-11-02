---
'@lottiefiles/dotlottie-web': patch
---

Freeze an autoplaying animation whose canvas isn't rendered (for example inside a `display: none` ancestor) when `freezeOnOffscreen` is on. The load-time viewport check treated the canvas's 0x0 rect at (0, 0) as visible, so if `setRenderConfig()` ran before load (as `DotLottieReact` does on mount), the hidden animation kept rendering every frame.
