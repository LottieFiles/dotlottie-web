/**
 * Copyright 2023 Design Barn Inc.
 */

/*
requestAnimationFrame() calls are paused when running in background tabs.
This is a problem for animations that don't update the DOM (e.g. canvas).
*/

window['requestAnimationFrame'] = (cb: FrameRequestCallback): number => {
  return setTimeout(cb);
};

window['cancelAnimationFrame'] = (id: number): void => {
  clearTimeout(id);
};
