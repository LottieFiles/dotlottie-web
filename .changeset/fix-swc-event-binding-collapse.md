---
'@lottiefiles/dotlottie-web': patch
---

fix: read player event payloads synchronously so old SWC builds don't throw `null.frameNo` every frame
