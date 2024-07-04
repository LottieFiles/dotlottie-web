---
'@lottiefiles/dotlottie-web': minor
---

feat(web): 🎸 DotLottieWorker

Introducing `DotLottieWorker`, a new class for offloading animation rendering to a Web Worker, enhancing application performance by freeing the main thread from expensive animations rendering. The API remains similar to `DotLottie`, with most methods being asynchronous.

# Basic Usage

```js
import { DotLottieWorker } from "@lottiefiles/dotlottie-web";

new DotLottieWorker({
    canvas: document.getElementById("canvas"),
    src: "url/to/animation.json",
    autoplay: true,
    loop: true,
});
```

#### Worker Grouping

By default, all animations using `DotLottieWorker` are rendered in the same worker. To group animations into different workers, use the `workerId` property in the configuration object, as shown below:

```js
new DotLottieWorker({
    canvas: document.getElementById("canvas"),
    src: "url/to/animation.json",
    autoplay: true,
    loop: true,
    workerId: "worker-1",
});

new DotLottieWorker({
    canvas: document.getElementById("canvas-2"),
    src: "url/to/animation2.json",
    autoplay: true,
    loop: true,
    workerId: "worker-2",
});
```

This feature is particularly useful when rendering a large number of animations simultaneously, as it allows you to distribute the rendering animations workload across multiple workers, improving performance.
