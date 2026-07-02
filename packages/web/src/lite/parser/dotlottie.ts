import type { Animation } from '../model';
import { parseLottie } from './lottie';

export interface DotLottieManifest {
  version?: string;
  generator?: string;
  authors?: string[];
  initial?: DotLottieInitial;
  animations?: DotLottieAnimationManifestEntry[];
  themes?: DotLottieThemeManifestEntry[];
  stateMachines?: DotLottieStateMachineManifestEntry[];
  states?: unknown[];
}

export interface DotLottieInitial {
  animation?: string;
  stateMachine?: string;
}

export interface DotLottieAnimationManifestEntry {
  id: string;
  name?: string;
  path?: string;
  initialTheme?: string;
  background?: number;
  themes?: string[];
}

export interface DotLottieThemeManifestEntry {
  id: string;
  name?: string;
  path?: string;
}

export interface DotLottieStateMachineManifestEntry {
  id: string;
  name?: string;
  path?: string;
}

export interface DotLottieAnimation {
  id: string;
  data: Record<string, unknown>;
  animation: Animation;
}

export interface DotLottieTheme {
  id: string;
  data: unknown;
}

export interface DotLottieStateMachine {
  id: string;
  data: unknown;
}

export interface ParsedDotLottie {
  manifest: DotLottieManifest;
  animations: DotLottieAnimation[];
  themes: DotLottieTheme[];
  stateMachines: DotLottieStateMachine[];
  files: Record<string, Uint8Array>;
}

/**
 * Parse a dotLottie container (ZIP archive) into its manifest, animations,
 * and themes. The first animation is typically the default one to play.
 */
export function parseDotLottie(data: Uint8Array | ArrayBuffer): ParsedDotLottie {
  const buffer = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
  const files = unzipDotLottie(buffer);

  const manifest = parseManifest(files);
  const animations = parseAnimations(files, manifest.animations ?? []);
  const themes = parseThemes(files, manifest.themes ?? []);
  const stateMachines = parseStateMachines(files, manifest.stateMachines ?? []);

  return { manifest, animations, themes, stateMachines, files };
}

export function resolveDotLottieAnimation(
  container: ParsedDotLottie,
  animationId = container.manifest.initial?.animation,
): DotLottieAnimation {
  if (animationId) {
    const animation = container.animations.find((entry) => entry.id === animationId);
    if (!animation) {
      throw new Error(`dotLottie animation not found: ${animationId}`);
    }
    return animation;
  }

  const first = container.animations[0];
  if (!first) {
    throw new Error('No animations found in dotLottie container');
  }
  return first;
}

function unzipDotLottie(data: Uint8Array): Record<string, Uint8Array> {
  const files: Record<string, Uint8Array> = {};
  const centralDirectoryOffset = findEndOfCentralDirectory(data);
  const entryCount = readU16(data, centralDirectoryOffset + 10);
  let offset = readU32(data, centralDirectoryOffset + 16);

  for (let i = 0; i < entryCount; i++) {
    if (readU32(data, offset) !== 0x02014b50) {
      throw new Error('Invalid dotLottie central directory');
    }

    const flags = readU16(data, offset + 8);
    const method = readU16(data, offset + 10);
    const compressedSize = readU32(data, offset + 20);
    const uncompressedSize = readU32(data, offset + 24);
    const fileNameLength = readU16(data, offset + 28);
    const extraLength = readU16(data, offset + 30);
    const commentLength = readU16(data, offset + 32);
    const localHeaderOffset = readU32(data, offset + 42);
    const nameStart = offset + 46;
    const name = decodeText(data.subarray(nameStart, nameStart + fileNameLength), flags);

    offset = nameStart + fileNameLength + extraLength + commentLength;
    if (name.endsWith('/')) continue;

    if (readU32(data, localHeaderOffset) !== 0x04034b50) {
      throw new Error('Invalid dotLottie local file header');
    }

    const localNameLength = readU16(data, localHeaderOffset + 26);
    const localExtraLength = readU16(data, localHeaderOffset + 28);
    const compressedStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressed = data.subarray(compressedStart, compressedStart + compressedSize);

    if (method === 0) {
      files[name] = compressed;
    } else if (method === 8) {
      files[name] = inflateRaw(compressed, uncompressedSize);
    } else {
      throw new Error(`Unsupported dotLottie compression method: ${method}`);
    }
  }

  return files;
}

const LENGTH_BASE = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258,
];
const LENGTH_EXTRA = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
const DIST_BASE = [
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577,
];
const DIST_EXTRA = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
const CODE_LENGTH_ORDER = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

type Huffman = Array<Record<number, number>>;

function inflateRaw(data: Uint8Array, expectedSize: number): Uint8Array {
  const reader = new BitReader(data);
  const output = new Uint8Array(expectedSize);
  let out = 0;
  let finalBlock = false;

  while (!finalBlock) {
    finalBlock = reader.bits(1) === 1;
    const type = reader.bits(2);

    if (type === 0) {
      reader.align();
      const length = reader.bits(16);
      reader.bits(16);
      output.set(data.subarray(reader.byteOffset, reader.byteOffset + length), out);
      reader.byteOffset += length;
      out += length;
      continue;
    }

    if (type === 3) {
      throw new Error('Invalid dotLottie deflate block');
    }

    const [literalTree, distanceTree] = type === 1 ? fixedTrees() : dynamicTrees(reader);

    while (true) {
      const symbol = decodeSymbol(reader, literalTree);
      if (symbol < 256) {
        output[out++] = symbol;
        continue;
      }
      if (symbol === 256) break;

      const lengthIndex = symbol - 257;
      const length = LENGTH_BASE[lengthIndex] + reader.bits(LENGTH_EXTRA[lengthIndex]);
      const distanceSymbol = decodeSymbol(reader, distanceTree);
      const distance = DIST_BASE[distanceSymbol] + reader.bits(DIST_EXTRA[distanceSymbol]);
      for (let i = 0; i < length; i++) {
        output[out] = output[out - distance];
        out++;
      }
    }
  }

  return out === output.length ? output : output.slice(0, out);
}

class BitReader {
  byteOffset = 0;
  private bitBuffer = 0;
  private bitCount = 0;

  constructor(private data: Uint8Array) {}

  bits(count: number): number {
    while (this.bitCount < count) {
      this.bitBuffer |= (this.data[this.byteOffset++] ?? 0) << this.bitCount;
      this.bitCount += 8;
    }
    const value = this.bitBuffer & ((1 << count) - 1);
    this.bitBuffer >>>= count;
    this.bitCount -= count;
    return value;
  }

  align(): void {
    this.bitBuffer = 0;
    this.bitCount = 0;
  }
}

let fixedLiteralTree: Huffman | undefined;
let fixedDistanceTree: Huffman | undefined;

function fixedTrees(): [Huffman, Huffman] {
  if (!fixedLiteralTree || !fixedDistanceTree) {
    const literalLengths = new Array(288).fill(8);
    literalLengths.fill(9, 144, 256);
    literalLengths.fill(7, 256, 280);
    fixedLiteralTree = buildHuffman(literalLengths);
    fixedDistanceTree = buildHuffman(new Array(32).fill(5));
  }
  return [fixedLiteralTree, fixedDistanceTree];
}

function dynamicTrees(reader: BitReader): [Huffman, Huffman] {
  const literalCount = reader.bits(5) + 257;
  const distanceCount = reader.bits(5) + 1;
  const codeLengthCount = reader.bits(4) + 4;
  const codeLengths = new Array(19).fill(0);
  for (let i = 0; i < codeLengthCount; i++) {
    codeLengths[CODE_LENGTH_ORDER[i]] = reader.bits(3);
  }
  const codeLengthTree = buildHuffman(codeLengths);
  const lengths: number[] = [];
  while (lengths.length < literalCount + distanceCount) {
    const symbol = decodeSymbol(reader, codeLengthTree);
    if (symbol < 16) {
      lengths.push(symbol);
    } else if (symbol === 16) {
      lengths.push(...new Array(reader.bits(2) + 3).fill(lengths[lengths.length - 1] ?? 0));
    } else if (symbol === 17) {
      lengths.push(...new Array(reader.bits(3) + 3).fill(0));
    } else {
      lengths.push(...new Array(reader.bits(7) + 11).fill(0));
    }
  }
  return [
    buildHuffman(lengths.slice(0, literalCount)),
    buildHuffman(lengths.slice(literalCount, literalCount + distanceCount)),
  ];
}

function buildHuffman(lengths: number[]): Huffman {
  const counts: number[] = [];
  for (const length of lengths) counts[length] = (counts[length] ?? 0) + 1;
  const nextCode: number[] = [];
  let code = 0;
  for (let bits = 1; bits <= 15; bits++) {
    code = (code + (counts[bits - 1] ?? 0)) << 1;
    nextCode[bits] = code;
  }
  const table: Huffman = [];
  for (let symbol = 0; symbol < lengths.length; symbol++) {
    const length = lengths[symbol];
    if (!length) continue;
    const reversed = reverseBits(nextCode[length]++, length);
    const lengthTable = table[length] ?? {};
    table[length] = lengthTable;
    lengthTable[reversed] = symbol;
  }
  return table;
}

function decodeSymbol(reader: BitReader, tree: Huffman): number {
  let code = 0;
  for (let length = 1; length < tree.length; length++) {
    code |= reader.bits(1) << (length - 1);
    const symbol = tree[length]?.[code];
    if (symbol !== undefined) return symbol;
  }
  throw new Error('Invalid dotLottie deflate data');
}

function reverseBits(value: number, length: number): number {
  let current = value;
  let reversed = 0;
  for (let i = 0; i < length; i++) {
    reversed = (reversed << 1) | (current & 1);
    current >>>= 1;
  }
  return reversed;
}

function findEndOfCentralDirectory(data: Uint8Array): number {
  const minOffset = Math.max(0, data.length - 65_557);
  for (let offset = data.length - 22; offset >= minOffset; offset--) {
    if (readU32(data, offset) === 0x06054b50) {
      return offset;
    }
  }
  throw new Error('Invalid dotLottie archive');
}

function readU16(data: Uint8Array, offset: number): number {
  return data[offset] | (data[offset + 1] << 8);
}

function readU32(data: Uint8Array, offset: number): number {
  return (data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24)) >>> 0;
}

const utf8Decoder = new TextDecoder();
const latin1Decoder = new TextDecoder('latin1');

function decodeText(data: Uint8Array, flags = 0x0800): string {
  return (flags & 0x0800 ? utf8Decoder : latin1Decoder).decode(data);
}

function parseManifest(files: Record<string, Uint8Array>): DotLottieManifest {
  const manifestPath = findFilePath(files, 'manifest.json');
  if (!manifestPath) {
    return {};
  }
  return JSON.parse(decodeText(files[manifestPath])) as DotLottieManifest;
}

function parseAnimations(
  files: Record<string, Uint8Array>,
  entries: DotLottieManifest['animations'],
): DotLottieAnimation[] {
  const result: DotLottieAnimation[] = [];
  for (const entry of entries ?? []) {
    const id = entry.id;
    const path = entry.path ?? `a/${id}.json`;
    const resolved = findFilePath(files, path);
    if (!resolved) continue;

    const text = decodeText(files[resolved]);
    const data = JSON.parse(text) as Record<string, unknown>;
    result.push({ id, data, animation: parseLottie(data) });
  }
  return result;
}

function parseThemes(files: Record<string, Uint8Array>, entries: DotLottieManifest['themes']): DotLottieTheme[] {
  const result: DotLottieTheme[] = [];
  for (const entry of entries ?? []) {
    const id = entry.id;
    const path = entry.path ?? `t/${id}.json`;
    const resolved = findFilePath(files, path);
    if (!resolved) continue;

    const text = decodeText(files[resolved]);
    result.push({ id, data: JSON.parse(text) });
  }
  return result;
}

function parseStateMachines(
  files: Record<string, Uint8Array>,
  entries: DotLottieManifest['stateMachines'],
): DotLottieStateMachine[] {
  const result: DotLottieStateMachine[] = [];
  for (const entry of entries ?? []) {
    const id = entry.id;
    const path = entry.path ?? `s/${id}.json`;
    const resolved = findFilePath(files, path);
    if (!resolved) continue;

    const text = decodeText(files[resolved]);
    result.push({ id, data: JSON.parse(text) });
  }
  return result;
}

function findFilePath(files: Record<string, Uint8Array>, name: string): string | undefined {
  const lower = name.toLowerCase();
  for (const path of Object.keys(files)) {
    if (path.toLowerCase() === lower) {
      return path;
    }
  }
  return undefined;
}
