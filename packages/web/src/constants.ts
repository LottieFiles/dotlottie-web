export const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
export const MS_TO_SEC_FACTOR = 1000;
export const DEFAULT_BG_COLOR = '#00000000';
export const ZIP_SIGNATURE = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
export const LOTTIE_JSON_MANDATORY_FIELDS = ['v', 'ip', 'op', 'layers', 'fr', 'w', 'h'];

// These values are replace during the build process with the package version and name
export const PACKAGE_VERSION = '__PACKAGE_VERSION__';
export const PACKAGE_NAME = '__PACKAGE_NAME__';

export const DEFAULT_DPR_FACTOR = 0.75;

export const BYTES_PER_PIXEL = 4;
