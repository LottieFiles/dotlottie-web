/**
 * Copyright 2024 Design Barn Inc.
 */

import { createEffect, createSignal } from 'solid-js';

export default function useStableCallback<Args extends unknown[], T>(
  callback: (...args: Args) => T,
): (...args: Args) => T {
  const [getCallback, setCallback] = createSignal(callback);

  createEffect(() => {
    setCallback(() => callback);
  });

  return (...args: Args) => getCallback()(...args);
}
