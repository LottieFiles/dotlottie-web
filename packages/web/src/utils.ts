import { DEFAULT_DPR_FACTOR, IS_BROWSER, LOTTIE_JSON_MANDATORY_FIELDS, ZIP_SIGNATURE } from './constants';

/**
 * Validates if a string is a valid hex color in #RRGGBB or #RRGGBBAA format.
 * @param color - Color string to validate
 * @returns True if valid hex color format, false otherwise
 */
export function isHexColor(color: string): boolean {
  return /^#([\da-f]{6}|[\da-f]{8})$/iu.test(color);
}

/**
 * Converts a hex color string to an RGBA integer for WASM consumption.
 * Adds full opacity (alpha = 255, 0xFF in hex) if alpha channel is not specified.
 * @param colorHex - Hex color string (e.g., '#FFFFFF' or '#FFFFFFFF')
 * @returns RGBA value as a 32-bit integer, or 0 if invalid hex color
 */
export function hexStringToRGBAInt(colorHex: string): number {
  if (!isHexColor(colorHex)) {
    return 0;
  }

  let hex = colorHex.replace('#', '');

  // Add alpha if it's not included
  hex = hex.length === 6 ? `${hex}ff` : hex;

  return parseInt(hex, 16);
}

/**
 * Detects if file data is a .lottie file by checking for ZIP signature.
 * dotLottie files are ZIP archives containing Lottie JSON and metadata.
 * @param fileData - Raw file data as ArrayBuffer
 * @returns True if data starts with ZIP signature, false otherwise
 */
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
  return LOTTIE_JSON_MANDATORY_FIELDS.every((field) => Object.hasOwn(json, field));
}

/**
 * Detects if data is a valid Lottie animation by checking for required JSON fields.
 * Accepts either a JSON string or a parsed object.
 * @param fileData - Lottie data as JSON string or parsed object
 * @returns True if data contains required Lottie fields, false otherwise
 */
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

/**
 * Calculates the default device pixel ratio with a scaling factor.
 * Applies a factor to balance quality and performance on high-DPI displays.
 * @returns Adjusted device pixel ratio value
 */
export function getDefaultDPR(): number {
  const dpr = IS_BROWSER ? window.devicePixelRatio : 1;

  return 1 + (dpr - 1) * DEFAULT_DPR_FACTOR;
}

/**
 * Checks if an HTML element is currently visible within the browser viewport.
 * Used to determine when to freeze/unfreeze rendering for performance optimization.
 * @param element - HTMLElement to check visibility for
 * @returns True if element is at least partially visible in viewport, false otherwise
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

  return !(rect.bottom < 0 || rect.top > viewportHeight || rect.right < 0 || rect.left > viewportWidth);
}

/**
 * Calculate pointer position relative to the canvas coordinate system
 * @param event - The mouse or pointer event (target should be the canvas element)
 * @returns The calculated position or null if calculation fails or target is not a valid canvas
 */
export function getPointerPosition(event: MouseEvent | PointerEvent): { x: number; y: number } | null {
  const canvas = event.target;

  if (canvas instanceof HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0 || canvas.width === 0 || canvas.height === 0) {
      return null;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    if (!Number.isFinite(x) || !Number.isFinite(y) || Number.isNaN(x) || Number.isNaN(y)) {
      return null;
    }

    return { x, y };
  }

  // Return null if target is not an HTMLCanvasElement or calculation fails
  return null;
}

export function handleOpenUrl(message: string): void {
  const content = message.replace('OpenUrl: ', '');

  const targetSeparatorIndex = content.indexOf(' | Target: ');
  let urlToOpen: string;
  let target: string;

  if (targetSeparatorIndex === -1) {
    // Format: "OpenUrl: {url}"
    urlToOpen = content;
    target = '_blank';
  } else {
    // Format: "OpenUrl: {url} | Target: {target}"
    urlToOpen = content.substring(0, targetSeparatorIndex);
    target = content.substring(targetSeparatorIndex + ' | Target: '.length);
  }

  window.open(urlToOpen, target);
}
