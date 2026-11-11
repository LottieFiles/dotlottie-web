---
"@lottiefiles/dotlottie-web": minor
---

Add `setBezierPathSlot()` to `DotLottie` and `DotLottieWorker`. It replaces the geometry of a path tagged with a slot id, with a static path or keyframes, and tangents you leave out default to zero. `getSlotType()` can now return `position` and `bezier_path`.
