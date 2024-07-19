import { describe, test, expect } from 'vitest';

import { hexStringToRGBAInt, isHexColor, isLottie, isDotLottie } from '../src/utils';

import lottieUrl from './__fixtures__/test.json?url';
import dotLottieUrl from './__fixtures__/test.lottie?url';

describe('isHexColor', () => {
  test.each([
    ['#123ABC', true],
    ['#123ABCD8', true],
    ['123456', false],
    ['#12345G', false],
    ['#12345', false],
    ['', false],
    ['#12', false],
    ['blue', false],
  ])('returns %s for %s', (color, expected) => {
    expect(isHexColor(color)).toBe(expected);
  });
});

describe('hexStringToRGBAInt', () => {
  test.each([
    ['#FFFFFF', 0xffffffff],
    ['#000000', 0x000000ff],
    ['#123456', 0x123456ff],
    ['#12345678', 0x12345678],
  ])('converts %s to RGBA integer %i', (color, expected) => {
    expect(hexStringToRGBAInt(color)).toBe(expected);
  });

  test.each([
    ['123456', 0],
    ['#12345G', 0],
    ['#12345', 0],
    ['', 0],
    ['blue', 0],
  ])('returns 0 for invalid hex color %s', (color, expected) => {
    expect(hexStringToRGBAInt(color)).toBe(expected);
  });

  test('handles missing alpha in hex colors', () => {
    expect(hexStringToRGBAInt('#123456')).toBe(0x123456ff);
  });
});

describe('isDotLottie', () => {
  const validZipSignature = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
  const invalidZipSignature = new Uint8Array([0x00, 0x00, 0x00, 0x00]);

  test.each([
    [validZipSignature.buffer, true],
    [invalidZipSignature.buffer, false],
    [new ArrayBuffer(2), false],
  ])('returns %s for %s', (buffer, expected) => {
    expect(isDotLottie(buffer)).toBe(expected);
  });

  test('returns true for a valid .lottie URL', async () => {
    const response = await fetch(dotLottieUrl);
    const buffer = await response.arrayBuffer();

    expect(isDotLottie(buffer)).toBe(true);
  });
});

describe('isLottie', () => {
  const validLottieObject = { v: '5.5.9', ip: 0, op: 300, fr: 30, w: 100, h: 100, layers: [] };
  const invalidLottieObject = { v: '5.5.9', ip: 0, op: 300 };
  const validLottieJSON = JSON.stringify(validLottieObject);
  const invalidLottieJSON = JSON.stringify(invalidLottieObject);

  test.each([
    [validLottieJSON, true],
    [invalidLottieJSON, false],
    [validLottieObject, true],
    [invalidLottieObject, false],
    ['invalid string', false],
  ])('returns %s for %s', (fileData, expected) => {
    expect(isLottie(fileData)).toBe(expected);
  });

  test('returns true for a valid .lottie URL', async () => {
    const response = await fetch(lottieUrl);
    const buffer = await response.json();

    expect(isLottie(buffer)).toBe(true);
  });
});
