import { beforeEach, describe, expect, test } from 'vitest';

import {
  getDefaultDPR,
  hexStringToRGBAInt,
  isDotLottie,
  isElementInViewport,
  isHexColor,
  isLottie,
} from '../src/utils';

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

  test('returns true for a valid Lottie URL', async () => {
    const response = await fetch(lottieUrl);
    const buffer = await response.json();

    expect(isLottie(buffer)).toBe(true);
  });
});

describe('getDefaultDotLottieDPR', () => {
  test('return 75% of device pixel ratio', () => {
    expect(getDefaultDPR()).toBe(1 + (window.devicePixelRatio - 1) * 0.75);
  });
});

describe('isElementInViewport', () => {
  beforeEach(() => {
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', { value: 1000, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
  });

  test('returns true for fully visible element', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: 100,
        left: 100,
        bottom: 200,
        right: 200,
      }),
    } as HTMLElement;

    expect(isElementInViewport(mockElement)).toBe(true);
  });

  test('returns true for partially visible element (cut off at bottom)', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        // Near bottom of viewport (800px height)
        top: 700,
        left: 100,
        // Extends below viewport
        bottom: 900,
        right: 200,
      }),
    } as HTMLElement;

    expect(isElementInViewport(mockElement)).toBe(true);
  });

  test('returns true for partially visible element (cut off at top)', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        // Starts above viewport
        top: -50,
        left: 100,
        // Ends within viewport
        bottom: 50,
        right: 200,
      }),
    } as HTMLElement;

    expect(isElementInViewport(mockElement)).toBe(true);
  });

  test('returns true for partially visible element (cut off at right)', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: 100,
        // Near right edge of viewport (1000px width)
        left: 900,
        bottom: 200,
        // Extends beyond viewport
        right: 1100,
      }),
    } as HTMLElement;

    expect(isElementInViewport(mockElement)).toBe(true);
  });

  test('returns true for partially visible element (cut off at left)', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: 100,
        // Starts before viewport
        left: -50,
        bottom: 200,
        // Ends within viewport
        right: 50,
      }),
    } as HTMLElement;

    expect(isElementInViewport(mockElement)).toBe(true);
  });

  test('returns false for element completely above viewport', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: -200,
        left: 100,
        // Completely above viewport
        bottom: -50,
        right: 200,
      }),
    } as HTMLElement;

    expect(isElementInViewport(mockElement)).toBe(false);
  });

  test('returns false for element completely below viewport', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        // Below viewport (800px height)
        top: 900,
        left: 100,
        bottom: 1000,
        right: 200,
      }),
    } as HTMLElement;

    expect(isElementInViewport(mockElement)).toBe(false);
  });

  test('returns false for element completely to the left of viewport', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: 100,
        left: -200,
        bottom: 200,
        // Completely to the left of viewport
        right: -50,
      }),
    } as HTMLElement;

    expect(isElementInViewport(mockElement)).toBe(false);
  });

  test('returns false for element completely to the right of viewport', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        top: 100,
        // Beyond viewport (1000px width)
        left: 1100,
        bottom: 200,
        right: 1200,
      }),
    } as HTMLElement;

    expect(isElementInViewport(mockElement)).toBe(false);
  });

  test('handles edge case where element exactly touches viewport boundary', () => {
    const mockElement = {
      getBoundingClientRect: () => ({
        // Exactly at top edge
        top: 0,
        // Exactly at left edge
        left: 0,
        // Exactly at bottom edge
        bottom: 800,
        // Exactly at right edge
        right: 1000,
      }),
    } as HTMLElement;

    expect(isElementInViewport(mockElement)).toBe(true);
  });
});
