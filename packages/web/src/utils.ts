import { DEFAULT_DPR_FACTOR, IS_BROWSER, LOTTIE_JSON_MANDATORY_FIELDS, ZIP_SIGNATURE } from './constants';
import type { MainModule, Mode as CoreMode, VectorFloat, Fit as CoreFit } from './core';
import type { Fit, Mode } from './types';

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

export function isDotLottie(fileData: ArrayBuffer): boolean {
  if (fileData.byteLength < 4) {
    return false;
  }

  const fileSignature = new Uint8Array(fileData.slice(0, ZIP_SIGNATURE.byteLength));

  for (let i = 0; i < ZIP_SIGNATURE.length; i += 1) {
    if (ZIP_SIGNATURE[i] !== fileSignature[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Returns whether the given object looks like a valid Lottie JSON structure.
 */
export function isLottieJSON(json: Record<string, unknown>): boolean {
  return LOTTIE_JSON_MANDATORY_FIELDS.every((field) => Object.prototype.hasOwnProperty.call(json, field));
}

export function isLottie(fileData: string | Record<string, unknown>): boolean {
  if (typeof fileData === 'string') {
    try {
      return isLottieJSON(JSON.parse(fileData));
    } catch (_e) {
      return false;
    }
  } else {
    return isLottieJSON(fileData);
  }
}

export function getDefaultDPR(): number {
  const dpr = IS_BROWSER ? window.devicePixelRatio : 1;

  return 1 + (dpr - 1) * DEFAULT_DPR_FACTOR;
}

export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export const createCoreMode = (mode: Mode, module: MainModule): CoreMode => {
  if (mode === 'reverse') {
    return module.Mode.Reverse;
  } else if (mode === 'bounce') {
    return module.Mode.Bounce;
  } else if (mode === 'reverse-bounce') {
    return module.Mode.ReverseBounce;
  } else {
    return module.Mode.Forward;
  }
};

export const createCoreFit = (fit: Fit, module: MainModule): CoreFit => {
  if (fit === 'contain') {
    return module.Fit.Contain;
  } else if (fit === 'cover') {
    return module.Fit.Cover;
  } else if (fit === 'fill') {
    return module.Fit.Fill;
  } else if (fit === 'fit-height') {
    return module.Fit.FitHeight;
  } else if (fit === 'fit-width') {
    return module.Fit.FitWidth;
  } else {
    return module.Fit.None;
  }
};

export const createCoreAlign = (align: [number, number], module: MainModule): VectorFloat => {
  const coreAlign = new module.VectorFloat();

  coreAlign.push_back(align[0]);
  coreAlign.push_back(align[1]);

  return coreAlign;
};

export const createCoreSegment = (segment: number[], module: MainModule): VectorFloat => {
  const coresegment = new module.VectorFloat();

  if (segment.length !== 2) return coresegment;

  coresegment.push_back(segment[0] as number);
  coresegment.push_back(segment[1] as number);

  return coresegment;
};

/**
 * Fetches animation data from a given URL.
 *
 * @param src - The URL to fetch the animation data from.
 * @returns The animation data as a string if the animation is a Lottie JSON, or an ArrayBuffer if the animation is a dotLottie.
 */
export async function fetchAnimationData(src: string): Promise<string | ArrayBuffer> {
  const response = await fetch(src);

  const data = await response.arrayBuffer();

  if (isDotLottie(data)) {
    return data;
  }

  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  return new TextDecoder().decode(data);
}
