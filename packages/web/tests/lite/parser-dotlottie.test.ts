import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import { parseDotLottie, resolveDotLottieAnimation } from '../../src/lite/parser/dotlottie';

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

  it('exposes shader metadata from the vendor-prefixed extension', () => {
    const shaderMeta = { overlays: [{ shader: 'grain', opacity: 0.2 }] };
    const anim = animation(512);
    (anim as Record<string, unknown>)['com.lottiefiles.shaders'] = shaderMeta;

    const zip = zipSync({
      'manifest.json': strToU8(
        JSON.stringify({
          version: '2',
          animations: [{ id: 'shaded' }],
        }),
      ),
      'a/shaded.json': strToU8(JSON.stringify(anim)),
    });

    const parsed = parseDotLottie(zip);
    expect(parsed.animations[0]!.shaders).toEqual(shaderMeta);
    expect(parsed.animations[0]!.animation.extensions?.['com.lottiefiles.shaders']).toEqual(shaderMeta);
  });

  it('falls back to poc_shaders when the vendor extension is absent', () => {
    const shaderMeta = { background: 'neuroglass' };
    const anim = animation(512);
    anim['poc_shaders'] = shaderMeta;

    const zip = zipSync({
      'manifest.json': strToU8(
        JSON.stringify({
          version: '2',
          animations: [{ id: 'legacy' }],
        }),
      ),
      'a/legacy.json': strToU8(JSON.stringify(anim)),
    });

    const parsed = parseDotLottie(zip);
    expect(parsed.animations[0]!.shaders).toEqual(shaderMeta);
  });

  it('extracts shader sources listed in the manifest', () => {
    const fragment = '#version 300 es\nvoid main() {}\n';
    const zip = zipSync({
      'manifest.json': strToU8(
        JSON.stringify({
          version: '2',
          animations: [{ id: 'anim' }],
          shaders: [{ id: 'custom-halftone' }, { id: 'renamed', path: 'shaders/other.frag' }],
        }),
      ),
      'a/anim.json': strToU8(JSON.stringify(animation(64))),
      'shaders/custom-halftone.frag': strToU8(fragment),
      'shaders/other.frag': strToU8('// other'),
    });

    const parsed = parseDotLottie(zip);
    expect(parsed.shaderSources['custom-halftone']).toBe(fragment);
    expect(parsed.shaderSources['renamed']).toBe('// other');
  });

  it('skips manifest shader entries whose files are missing', () => {
    const zip = zipSync({
      'manifest.json': strToU8(
        JSON.stringify({
          version: '2',
          animations: [{ id: 'anim' }],
          shaders: [{ id: 'ghost' }],
        }),
      ),
      'a/anim.json': strToU8(JSON.stringify(animation(64))),
    });

    const parsed = parseDotLottie(zip);
    expect(parsed.shaderSources).toEqual({});
  });

  it('returns an empty shader source map when the manifest has no shaders', () => {
    const zip = zipSync({
      'manifest.json': strToU8(JSON.stringify({ version: '2', animations: [{ id: 'anim' }] })),
      'a/anim.json': strToU8(JSON.stringify(animation(64))),
    });

    const parsed = parseDotLottie(zip);
    expect(parsed.shaderSources).toEqual({});
  });
});

function readU32(data: Uint8Array, offset: number): number {
  return (data[offset]! | (data[offset + 1]! << 8) | (data[offset + 2]! << 16) | (data[offset + 3]! << 24)) >>> 0;
}

function writeU32(data: Uint8Array, offset: number, value: number): void {
  data[offset] = value & 0xff;
  data[offset + 1] = (value >>> 8) & 0xff;
  data[offset + 2] = (value >>> 16) & 0xff;
  data[offset + 3] = (value >>> 24) & 0xff;
}

function findEndOfCentralDirectory(data: Uint8Array): number {
  for (let offset = data.length - 22; offset >= 0; offset--) {
    if (readU32(data, offset) === 0x06054b50) return offset;
  }
  throw new Error('end of central directory not found in test fixture');
}

/** Rewrite the declared uncompressed size of every central-directory entry. */
function patchDeclaredSizes(zip: Uint8Array, declaredSize: number): Uint8Array {
  const patched = zip.slice();
  const eocd = findEndOfCentralDirectory(patched);
  const entryCount = patched[eocd + 10]! | (patched[eocd + 11]! << 8);
  let offset = readU32(patched, eocd + 16);
  for (let i = 0; i < entryCount; i++) {
    if (readU32(patched, offset) !== 0x02014b50) {
      throw new Error('bad central directory entry in test fixture');
    }
    writeU32(patched, offset + 24, declaredSize);
    const nameLength = patched[offset + 28]! | (patched[offset + 29]! << 8);
    const extraLength = patched[offset + 30]! | (patched[offset + 31]! << 8);
    const commentLength = patched[offset + 32]! | (patched[offset + 33]! << 8);
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return patched;
}

describe('decompression bomb protection', () => {
  // Highly compressible payloads guarantee fflate emits DEFLATE (method 8)
  // entries, which is the code path that pre-allocates the declared size.
  function compressibleZip(animationCount = 1): Uint8Array {
    const filler = 'x'.repeat(4096);
    const ids = Array.from({ length: animationCount }, (_, i) => `a${i}`);
    const entries: Record<string, Uint8Array> = {
      'manifest.json': strToU8(JSON.stringify({ version: '2', animations: ids.map((id) => ({ id })), filler })),
    };
    for (const id of ids) {
      entries[`a/${id}.json`] = strToU8(JSON.stringify({ ...animation(100), filler }));
    }
    return zipSync(entries);
  }

  it('rejects an entry that declares an absurd uncompressed size', () => {
    const zip = patchDeclaredSizes(compressibleZip(), 0xffffffff);
    expect(() => parseDotLottie(zip)).toThrow(/dotLottie entry exceeds size limit/);
  });

  it('rejects an archive whose total declared uncompressed size exceeds the cap', () => {
    // 6 entries (manifest + 5 animations), each declared just under the
    // 64 MiB per-entry cap; the running total crosses 256 MiB at entry 5.
    const zip = patchDeclaredSizes(compressibleZip(5), 60 * 1024 * 1024);
    expect(() => parseDotLottie(zip)).toThrow(/dotLottie archive exceeds total size limit/);
  });

  it('rejects deflate data that expands past its declared size', () => {
    const zip = patchDeclaredSizes(compressibleZip(), 4);
    expect(() => parseDotLottie(zip)).toThrow(/deflate output exceeds declared size/);
  });

  it('rejects an archive that declares too many entries', () => {
    const zip = compressibleZip().slice();
    const eocd = findEndOfCentralDirectory(zip);
    zip[eocd + 10] = 0xff;
    zip[eocd + 11] = 0xff; // declare 65535 entries
    expect(() => parseDotLottie(zip)).toThrow(/too many entries/);
  });
});
