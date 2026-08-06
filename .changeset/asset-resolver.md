---
"@lottiefiles/dotlottie-web": minor
---

Add an `assetResolver` config option for supplying assets an animation references but does not embed.

```ts
new DotLottie({
  canvas,
  src: 'animation.json',
  assetResolver: (src) => assets.get(src) ?? null, // src e.g. '/images/img_0.png'
});
```

Must return bytes synchronously (`Uint8Array` or `ArrayBuffer`), or `null` to leave the asset unresolved. Not supported by `DotLottieWorker`.
