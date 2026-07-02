import { describe, expect, it } from 'vitest';
import { parseDotLottie, resolveDotLottieAnimation } from '../../src/lite/parser/dotlottie';

// The source repo used fflate's zipSync/strToU8 to build test archives. fflate is not a
// dependency of this package, so we build stored (uncompressed) ZIP archives by hand instead.
// The vendored dotLottie parser supports stored entries (compression method 0).
function strToU8(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

const CRC_TABLE = ((): Uint32Array => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
    table[i] = crc >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = (crc >>> 8) ^ (CRC_TABLE[(crc ^ byte) & 0xff] as number);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeU16(target: Uint8Array, offset: number, value: number): void {
  target[offset] = value & 0xff;
  target[offset + 1] = (value >>> 8) & 0xff;
}

function writeU32(target: Uint8Array, offset: number, value: number): void {
  writeU16(target, offset, value & 0xffff);
  writeU16(target, offset + 2, (value >>> 16) & 0xffff);
}

function zipSync(files: Record<string, Uint8Array>): Uint8Array {
  const entries = Object.entries(files).map(([name, data]) => ({
    name: strToU8(name),
    data,
    crc: crc32(data),
  }));

  const localSize = entries.reduce((sum, entry) => sum + 30 + entry.name.length + entry.data.length, 0);
  const centralSize = entries.reduce((sum, entry) => sum + 46 + entry.name.length, 0);
  const output = new Uint8Array(localSize + centralSize + 22);

  let offset = 0;
  const localOffsets: number[] = [];

  for (const entry of entries) {
    localOffsets.push(offset);
    writeU32(output, offset, 0x04034b50);
    writeU16(output, offset + 4, 20); // version needed
    writeU16(output, offset + 6, 0x0800); // UTF-8 flag
    writeU16(output, offset + 8, 0); // method: stored
    writeU32(output, offset + 14, entry.crc);
    writeU32(output, offset + 18, entry.data.length); // compressed size
    writeU32(output, offset + 22, entry.data.length); // uncompressed size
    writeU16(output, offset + 26, entry.name.length);
    output.set(entry.name, offset + 30);
    output.set(entry.data, offset + 30 + entry.name.length);
    offset += 30 + entry.name.length + entry.data.length;
  }

  const centralStart = offset;
  entries.forEach((entry, index) => {
    writeU32(output, offset, 0x02014b50);
    writeU16(output, offset + 4, 20); // version made by
    writeU16(output, offset + 6, 20); // version needed
    writeU16(output, offset + 8, 0x0800); // UTF-8 flag
    writeU16(output, offset + 10, 0); // method: stored
    writeU32(output, offset + 16, entry.crc);
    writeU32(output, offset + 20, entry.data.length); // compressed size
    writeU32(output, offset + 24, entry.data.length); // uncompressed size
    writeU16(output, offset + 28, entry.name.length);
    writeU32(output, offset + 42, localOffsets[index] as number);
    output.set(entry.name, offset + 46);
    offset += 46 + entry.name.length;
  });

  writeU32(output, offset, 0x06054b50);
  writeU16(output, offset + 8, entries.length); // entries on this disk
  writeU16(output, offset + 10, entries.length); // total entries
  writeU32(output, offset + 12, offset - centralStart); // central directory size
  writeU32(output, offset + 16, centralStart); // central directory offset

  return output;
}

function animation(width: number, height = width): Record<string, unknown> {
  return {
    v: '5.5.0',
    fr: 60,
    ip: 0,
    op: 60,
    w: width,
    h: height,
    layers: [],
  };
}

describe('parseDotLottie', () => {
  it('parses a minimal dotLottie archive', () => {
    const manifest = JSON.stringify({
      version: '2.0',
      animations: [{ id: 'anim', path: 'animations/anim.json' }],
    });

    const zip = zipSync({
      'manifest.json': strToU8(manifest),
      'animations/anim.json': strToU8(JSON.stringify(animation(512))),
    });

    const parsed = parseDotLottie(zip);
    expect(parsed.manifest.version).toBe('2.0');
    expect(parsed.animations).toHaveLength(1);
    expect(parsed.animations[0]!.id).toBe('anim');
    expect(parsed.animations[0]!.animation.width).toBe(512);
  });

  it('parses dotLottie v2 default animation, theme, and state-machine paths', () => {
    const manifest = JSON.stringify({
      version: '2',
      initial: { animation: 'second' },
      animations: [
        { id: 'first' },
        {
          id: 'second',
          initialTheme: 'dark',
          background: 0xffffffff,
          themes: ['dark'],
        },
      ],
      themes: [{ id: 'dark', name: 'Dark' }],
      stateMachines: [{ id: 'button', name: 'Button' }],
    });

    const stateMachine = {
      initial: 'idle',
      states: [{ type: 'PlaybackState', name: 'idle', animation: 'second' }],
    };

    const zip = zipSync({
      'manifest.json': strToU8(manifest),
      'a/first.json': strToU8(JSON.stringify(animation(100))),
      'a/second.json': strToU8(JSON.stringify(animation(200))),
      't/dark.json': strToU8(JSON.stringify({ rules: [] })),
      's/button.json': strToU8(JSON.stringify(stateMachine)),
    });

    const parsed = parseDotLottie(zip);
    expect(parsed.manifest.initial?.animation).toBe('second');
    expect(parsed.manifest.animations?.[1]?.initialTheme).toBe('dark');
    expect(parsed.animations.map((entry) => entry.id)).toEqual(['first', 'second']);
    expect(parsed.animations[1]!.data['w']).toBe(200);
    expect(parsed.themes).toEqual([{ id: 'dark', data: { rules: [] } }]);
    expect(parsed.stateMachines).toEqual([{ id: 'button', data: stateMachine }]);
    expect(resolveDotLottieAnimation(parsed).id).toBe('second');
  });

  it('falls back to the first animation when no initial animation is set', () => {
    const zip = zipSync({
      'manifest.json': strToU8(
        JSON.stringify({
          version: '2',
          animations: [{ id: 'first' }, { id: 'second' }],
        }),
      ),
      'a/first.json': strToU8(JSON.stringify(animation(100))),
      'a/second.json': strToU8(JSON.stringify(animation(200))),
    });

    const parsed = parseDotLottie(zip);
    expect(resolveDotLottieAnimation(parsed).id).toBe('first');
  });

  it('throws a clear error when the initial animation is missing', () => {
    const zip = zipSync({
      'manifest.json': strToU8(
        JSON.stringify({
          version: '2',
          initial: { animation: 'missing' },
          animations: [{ id: 'first' }],
        }),
      ),
      'a/first.json': strToU8(JSON.stringify(animation(100))),
    });

    const parsed = parseDotLottie(zip);
    expect(() => resolveDotLottieAnimation(parsed)).toThrow('dotLottie animation not found: missing');
  });
});
