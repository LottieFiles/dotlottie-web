/**
 * Copyright 2024 Design Barn Inc.
 */

import { useCallback, useLayoutEffect, useRef, useEffect } from 'react';

// eslint-disable-next-line no-negated-condition
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Returns a memoized version of your function that maintains a stable reference, but
 * also can read the latest scope (props and state) of the component in which it is used.
 */
export default function useStableCallback<Args extends unknown[], T>(
  callback: (...args: Args) => T,
): (...args: Args) => T {
  const callbackContainer = useRef(callback);

  useIsomorphicLayoutEffect(() => {
    callbackContainer.current = callback;
  });

  return useCallback((...args: Args) => callbackContainer.current(...args), [callbackContainer]);
}
