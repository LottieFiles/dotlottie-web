import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';

import { parseDotLottie } from '../../src/lite/parser/dotlottie';
import { parseLottie } from '../../src/lite/parser/lottie';

/**
 * Regression tests for the local additions kept on top of the vendored
 * dotlottie-lite-player sources. If one of these fails after a re-vendor,
 * the corresponding local patch was dropped and must be re-applied:
 * - Lottie marker parsing (`cm`/`tm`/`dr`) feeding DotLottie's markers() API.
 * - Gaussian blur effects dispatched by numeric type (`ty: 29`) when the
 *   exporter omits the `mn` match name.
 * - dotLottie v1 container layout (`animations/`, `themes/`) in addition to
 *   the v2 layout (`a/`, `t/`).
 */
describe('local additions on top of vendored sources', () => {
  it('parses Lottie markers (cm/tm/dr)', () => {
    const animation = parseLottie({
      v: '5.5.0',
      fr: 30,
      ip: 0,
      op: 90,
      w: 100,
      h: 100,
      layers: [],
      markers: [
        { cm: 'intro', tm: 10, dr: 20 },
        { cm: '', tm: 40, dr: 0 },
        { cm: 'outro', tm: 60 },
      ],
    });

    expect(animation.markers).toEqual([
      { name: 'intro', time: 10, duration: 20 },
      { name: 'outro', time: 60, duration: 0 },
    ]);
  });

  it('parses a Gaussian blur effect without a match name via ty 29', () => {
    const animation = parseLottie({
      v: '5.5.0',
      fr: 30,
      ip: 0,
      op: 90,
      w: 100,
      h: 100,
      layers: [
        {
          ty: 4,
          ip: 0,
          op: 90,
          ks: {},
          shapes: [],
          ef: [{ ty: 29, ef: [{ v: { a: 0, k: 12 } }] }],
        },
      ],
    });

    expect(animation.layers[0]?.effects).toEqual([{ type: 'gaussian-blur', blurriness: 12 }]);
  });

  it('resolves animations and themes from a dotLottie v1 layout', () => {
    const animationJson = JSON.stringify({
      v: '5.5.0',
      fr: 30,
      ip: 0,
      op: 90,
      w: 320,
      h: 240,
      layers: [],
    });
    const zip = zipSync({
      'manifest.json': strToU8(
        JSON.stringify({
          version: '1.0',
          animations: [{ id: 'legacy' }],
          themes: [{ id: 'dark' }],
        }),
      ),
      'animations/legacy.json': strToU8(animationJson),
      'themes/dark.json': strToU8(JSON.stringify({ rules: [] })),
    });

    const parsed = parseDotLottie(zip);

    expect(parsed.animations).toHaveLength(1);
    expect(parsed.animations[0]?.id).toBe('legacy');
    expect(parsed.animations[0]?.animation.width).toBe(320);
    expect(parsed.themes).toHaveLength(1);
    expect(parsed.themes[0]?.id).toBe('dark');
  });
});
