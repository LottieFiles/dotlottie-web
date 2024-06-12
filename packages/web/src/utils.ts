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
