---
'@lottiefiles/dotlottie-web': minor
---

feat: add `registerFont` static method in `DotLottie` and `DotLottieWorker` for custom font registration.

```js
const fontRegistered = await DotLottie.registerFont('CustomFont', 'path/to/font.ttf');
```
