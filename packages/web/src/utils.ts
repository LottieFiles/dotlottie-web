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

    if (contentType?.includes('application/json') || contentType?.includes('text/plain')) {
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

export function isHexColor(color: string): boolean {
  return /^#([\da-f]{6}|[\da-f]{8})$/iu.test(color);
}

export function hexStringToRGBAInt(colorHex: string): number {
  if (!isHexColor(colorHex)) {
    return 0;
  }

  let hex = colorHex.replace('#', '');

  // Add alpha if it's not included
  hex = hex.length === 6 ? `${hex}ff` : hex;

  return parseInt(hex, 16);
}
