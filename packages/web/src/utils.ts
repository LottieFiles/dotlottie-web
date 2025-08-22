import { DEFAULT_DPR_FACTOR, IS_BROWSER, LOTTIE_JSON_MANDATORY_FIELDS, ZIP_SIGNATURE } from './constants';

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

// WebGL feature detection and validation utilities
export const isWebGLSupported = (): boolean => {
  if (!IS_BROWSER) return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    return gl !== null;
  } catch {
    return false;
  }
};

// WebGPU feature detection and validation utilities
export const isWebGPUSupported = (): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return IS_BROWSER && 'gpu' in navigator && navigator.gpu !== undefined;
};

export const createWebGPUDevice = async (): Promise<GPUDevice | null> => {
  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      console.warn('WebGPU adapter not found');

      return null;
    }

    const device = await adapter.requestDevice();

    return device;
  } catch (error) {
    console.warn('Failed to create secure WebGPU device:', error);

    return null;
  }
};
