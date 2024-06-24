---
'@lottiefiles/dotlottie-react': minor
---

perf(react): ⚡️ render only visible canvas area

This update optimizes the rendering performance by ensuring that only the visible portion of the canvas is rendered, utilizing the dotlottie-web `setViewport` API.

> Note: No changes are required for existing usage. The optimization is applied internally within the `DotLottieReact` component.
