import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import lottieUrl from '../../../fixtures/test.json?url';
import dotLottieUrl from '../../../fixtures/test.lottie?url';
import {
  getDefaultDPR,
  getPointerPosition,
  hexStringToRGBAInt,
  isDotLottie,
  isElementInViewport,
  isHexColor,
  isLottie,
} from '../src/utils';

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

describe('getPointerPosition', () => {
  const createCanvas = (
    canvasWidth: number,
    canvasHeight: number,
    rectLeft: number,
    rectTop: number,
    rectWidth: number,
    rectHeight: number,
  ): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.left = `${rectLeft}px`;
    canvas.style.top = `${rectTop}px`;
    canvas.style.width = `${rectWidth}px`;
    canvas.style.height = `${rectHeight}px`;

    return canvas;
  };

  const createMockEvent = (clientX: number, clientY: number, target: HTMLCanvasElement): MouseEvent => {
    return {
      clientX,
      clientY,
      target,
    } as unknown as MouseEvent;
  };

  afterEach(() => {
    document.querySelectorAll('canvas').forEach((canvas) => canvas.remove());
  });

  test('returns correct position for valid canvas with 1:1 scaling', () => {
    const canvas = createCanvas(400, 300, 0, 0, 400, 300);
    const event = createMockEvent(200, 150, canvas);

    const result = getPointerPosition(event);

    expect(result).toEqual({ x: 200, y: 150 });
  });

  test('returns correct position with upscaled canvas (canvas larger than display)', () => {
    // Canvas is 800x600, but displayed as 400x300 (2x scale)
    const canvas = createCanvas(800, 600, 0, 0, 400, 300);
    const event = createMockEvent(200, 150, canvas);

    const result = getPointerPosition(event);

    // Coordinates should be scaled up by 2x
    expect(result).toEqual({ x: 400, y: 300 });
  });

  test('returns correct position with downscaled canvas (canvas smaller than display)', () => {
    // Canvas is 200x150, but displayed as 400x300 (0.5x scale)
    const canvas = createCanvas(200, 150, 0, 0, 400, 300);
    const event = createMockEvent(200, 150, canvas);

    const result = getPointerPosition(event);

    // Coordinates should be scaled down by 0.5x
    expect(result).toEqual({ x: 100, y: 75 });
  });

  test('returns correct position with canvas offset from origin', () => {
    // Canvas displayed at position (100, 50) with 1:1 scaling
    const canvas = createCanvas(400, 300, 100, 50, 400, 300);
    const event = createMockEvent(250, 150, canvas);

    const result = getPointerPosition(event);

    // Should subtract the offset (250-100=150, 150-50=100)
    expect(result).toEqual({ x: 150, y: 100 });
  });

  test('returns correct position with both scaling and offset', () => {
    // Canvas is 800x600, displayed as 400x300 at position (50, 25)
    const canvas = createCanvas(800, 600, 50, 25, 400, 300);
    const event = createMockEvent(250, 175, canvas);

    const result = getPointerPosition(event);

    // First subtract offset: (250-50=200, 175-25=150)
    // Then scale by 2x: (200*2=400, 150*2=300)
    expect(result).toEqual({ x: 400, y: 300 });
  });

  test('returns null when target is not HTMLCanvasElement', () => {
    const div = document.createElement('div');
    const event = {
      clientX: 200,
      clientY: 150,
      target: div,
    } as unknown as MouseEvent;

    const result = getPointerPosition(event);

    expect(result).toBeNull();
  });

  test('returns null when target is null', () => {
    const event = {
      clientX: 200,
      clientY: 150,
      target: null,
    } as MouseEvent;

    const result = getPointerPosition(event);

    expect(result).toBeNull();
  });

  test('returns null when canvas width is 0', () => {
    const canvas = createCanvas(0, 300, 0, 0, 400, 300);
    const event = createMockEvent(200, 150, canvas);

    const result = getPointerPosition(event);

    expect(result).toBeNull();
  });

  test('returns null when canvas height is 0', () => {
    const canvas = createCanvas(400, 0, 0, 0, 400, 300);
    const event = createMockEvent(200, 150, canvas);

    const result = getPointerPosition(event);

    expect(result).toBeNull();
  });

  test('returns null when rect width is 0', () => {
    const canvas = createCanvas(400, 300, 0, 0, 0, 300);
    const event = createMockEvent(200, 150, canvas);

    const result = getPointerPosition(event);

    expect(result).toBeNull();
  });

  test('returns null when rect height is 0', () => {
    const canvas = createCanvas(400, 300, 0, 0, 400, 0);
    const event = createMockEvent(200, 150, canvas);

    const result = getPointerPosition(event);

    expect(result).toBeNull();
  });

  test('handles negative coordinates correctly', () => {
    // Canvas at position (100, 100), click at (50, 50) - outside canvas area
    const canvas = createCanvas(400, 300, 100, 100, 400, 300);
    const event = createMockEvent(50, 50, canvas);

    const result = getPointerPosition(event);

    // Should calculate negative coordinates: (50-100=-50, 50-100=-50)
    expect(result).toEqual({ x: -50, y: -50 });
  });

  test('returns null when calculation results in NaN', () => {
    // Create a canvas that would cause NaN in calculations
    const canvas = document.createElement('canvas');

    canvas.width = 400;
    canvas.height = 300;
    document.body.appendChild(canvas);

    // Mock getBoundingClientRect to return NaN which would cause NaN in calculations
    const originalGetBoundingClientRect = canvas.getBoundingClientRect.bind(canvas);

    canvas.getBoundingClientRect = vi.fn(
      (): DOMRect => ({
        left: NaN,
        top: 0,
        width: 400,
        height: 300,
        right: 400,
        bottom: 300,
        x: NaN,
        y: 0,
        // Comment: Empty toJSON function is required for DOMRect interface
        toJSON: (): Record<string, unknown> => ({}),
      }),
    );

    const event = createMockEvent(200, 150, canvas);

    const result = getPointerPosition(event);

    expect(result).toBeNull();

    // Restore original method
    canvas.getBoundingClientRect = originalGetBoundingClientRect;
    canvas.remove();
  });

  test('returns null when calculation results in Infinity', () => {
    // Create a canvas that would cause Infinity in calculations (division by zero)
    const canvas = document.createElement('canvas');

    canvas.width = 400;
    canvas.height = 300;
    document.body.appendChild(canvas);

    // Mock getBoundingClientRect to return 0 width which causes division by zero
    const originalGetBoundingClientRect = canvas.getBoundingClientRect.bind(canvas);

    canvas.getBoundingClientRect = vi.fn(
      (): DOMRect => ({
        left: 0,
        top: 0,
        // This will cause division by zero when calculating scale
        width: 0,
        height: 300,
        right: 0,
        bottom: 300,
        x: 0,
        y: 0,
        // Comment: Empty toJSON function is required for DOMRect interface
        toJSON: (): Record<string, unknown> => ({}),
      }),
    );

    const event = createMockEvent(200, 150, canvas);

    const result = getPointerPosition(event);

    expect(result).toBeNull();

    canvas.getBoundingClientRect = originalGetBoundingClientRect;
    canvas.remove();
  });

  test('handles fractional coordinates and scaling', () => {
    const canvas = createCanvas(300, 200, 0, 0, 100, 100);
    const event = createMockEvent(33.5, 66.7, canvas);

    const result = getPointerPosition(event);

    // Scale factors: scaleX = 300/100 = 3, scaleY = 200/100 = 2
    // Expected: x = 33.5 * 3 = 100.5, y = 66.7 * 2 = 133.4
    expect(result).toEqual({ x: 100.5, y: 133.4 });
  });

  test('works with PointerEvent as well as MouseEvent', () => {
    const canvas = createCanvas(400, 300, 0, 0, 400, 300);
    const pointerEvent = {
      clientX: 200,
      clientY: 150,
      target: canvas,
    } as unknown as PointerEvent;

    const result = getPointerPosition(pointerEvent);

    expect(result).toEqual({ x: 200, y: 150 });
  });
});
