import { describe, test, expect } from 'vitest';

import { hexStringToRGBAInt, isHexColor } from '../src/utils';

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
