/**
 * Copyright 2023 Design Barn Inc.
 */

import { getAnimation, getManifest, loadFromArrayBuffer } from '@dotlottie/dotlottie-js';

export async function getAnimationJSONFromDotLottie(dotLottieBuffer: ArrayBuffer): Promise<string> {
  const loadedDotLottieFile = await loadFromArrayBuffer(dotLottieBuffer);
  const manifest = await getManifest(loadedDotLottieFile);
  const activeAnimationId = manifest?.activeAnimationId || manifest?.animations[0]?.id || '';

  if (!activeAnimationId) {
    throw new Error('Unable to determine the active animation ID from the .lottie manifest.');
  }
  const animationData = await getAnimation(loadedDotLottieFile, activeAnimationId, { inlineAssets: true });

  return JSON.stringify(animationData);
}

export async function loadAnimationJSONFromURL(animationURL: string): Promise<string> {
  try {
    const response = await fetch(animationURL);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch the animation data from URL: ${animationURL}. ${response.status}: ${response.statusText}`,
      );
    }

    const contentType = response.headers.get('content-type');
    let animationJSON: string;

    if (contentType?.includes('application/json')) {
      animationJSON = await response.text();
    } else {
      const arrayBuffer = await response.arrayBuffer();

      animationJSON = await getAnimationJSONFromDotLottie(arrayBuffer);
    }

    return animationJSON;
  } catch (error) {
    throw new Error(`Failed to load animation data from URL: ${animationURL}. ${error}`);
  }
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...funcArgs: Parameters<T>) => void {
  let timeoutId: number | undefined;

  return function debounced(...args: Parameters<T>) {
    clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      func(...args);
    }, wait);
  };
}
