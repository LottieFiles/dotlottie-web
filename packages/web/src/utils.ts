import { DEFAULT_DPR_FACTOR, IS_BROWSER, LOTTIE_JSON_MANDATORY_FIELDS, ZIP_SIGNATURE } from './constants';

export function isHexColor(color: string): boolean {
  return /^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/iu.test(color);
}

export function hexStringToRGBAInt(colorHex: string): number {
  if (!isHexColor(colorHex)) {
    return 0;
  }

  let hex = colorHex.replace('#', '');

  if (hex.length === 3 || hex.length === 4) {
    const expandedHex = hex
      .split('')
      .map((char) => char + char)
      .join('');

    hex = expandedHex;
  }

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
