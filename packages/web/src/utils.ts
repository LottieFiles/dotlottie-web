/**
 * Copyright 2023 Design Barn Inc.
 */

import { getAnimation, getManifest, loadFromArrayBuffer } from '@dotlottie/dotlottie-js';

export async function loadFromURL(src: string): Promise<string> {
  try {
    const response = await fetch(src);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch the animation data from URL: ${src}. ${response.status}: ${response.statusText}`,
      );
    }

    const contentType = response.headers.get('content-type');
    let data: string;

    if (contentType?.includes('application/json')) {
      data = await response.text();
    } else {
      const arrayBuffer = await response.arrayBuffer();
      const dotLottie = await loadFromArrayBuffer(arrayBuffer);
      const manifest = await getManifest(dotLottie);
      const animationId = manifest?.activeAnimationId || manifest?.animations[0]?.id || '';

      if (!animationId) {
        throw new Error('Unable to determine animation ID from manifest.');
      }
      const animation = await getAnimation(dotLottie, animationId, { inlineAssets: true });

      data = JSON.stringify(animation);
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to load animation data from URL: ${src}. ${error}`);
  }
}
