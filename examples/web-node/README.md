# DotLottie Web Node.js Example

## Overview

This example demonstrates how to use the DotLottie Web package in a Node.js environment. It showcases controlling animation playback, rendering frame by frame, and converting a Lottie animation into a GIF file.

## How to Run

To run the example with default settings, execute:

```bash
pnpm start
```

The output GIF will be saved to `./output/animation.gif`.

![Alt Text](./demo.gif)

To customize settings and explore different options, use the command line arguments as follows:

```bash
pnpm start --width [width] --height [height] --fps [fps] --repeat [repeat] --quality [quality] --input [input file or URL] --speed [speed] 
```

### Arguments

* `--width`: Width of the output GIF (default: 200)
* `--height`: Height of the output GIF (default: 200)
* `--fps`: Frames per second for the output GIF (default: 60)
* `--repeat`: Number of times the GIF should repeat (default: 0 for infinite)
* `--input`: Path or URL to the Lottie animation file (default: example animation)
* `--speed`: Speed multiplier for the animation (default: 1)
* `--quality`: Quality of the output GIF ('high', 'mid', or 'low'; default: 'mid')

### Example Command

```bash
pnpm start --width 200 --height 200 --fps 30 --repeat 0 --quality high --input https://lottie.host/aaccfd1e-487e-4e9a-9d20-c57299089cfc/iVNpuLw0co.lottie --speed 1.5
```
