import type { ParsedDotLottie } from './dotlottie';

/**
 * Resolves image assets packaged inside a dotLottie container (`i/` folder) into
 * inline data URIs so the Lottie parser can treat them as embedded images.
 */
export function resolvePackagedImageAssets(
  animationData: Record<string, unknown>,
  files: Record<string, Uint8Array>,
): Record<string, unknown> {
  const cloned = JSON.parse(JSON.stringify(animationData)) as Record<string, unknown>;
  const assets = cloned['assets'];
  if (!Array.isArray(assets)) return cloned;

  for (const asset of assets) {
    if (!asset || typeof asset !== 'object') continue;
    const record = asset as Record<string, unknown>;
    if (record['layers'] !== undefined || record['_t'] === 2 || record['e'] === 1) continue;

    const path = String(record['p'] ?? '');
    if (!path || isExternalAssetPath(path)) continue;

    const basePath = String(record['u'] ?? '');
    const filePath = findPackagedAsset(files, basePath, path);
    const fileData = filePath ? files[filePath] : undefined;
    if (!filePath || !fileData) continue;

    record['e'] = 1;
    record['u'] = '';
    record['p'] = toDataUri(filePath, fileData);
  }

  return cloned;
}

/**
 * Registers fonts packaged inside a dotLottie container (`f/` folder) with the
 * document font registry so text layers can render with the intended typeface.
 */
export function registerPackagedFonts(container: ParsedDotLottie): Promise<FontFace[]> {
  if (typeof FontFace === 'undefined' || typeof globalThis.document === 'undefined' || !globalThis.document.fonts) {
    return Promise.resolve([]);
  }

  const fonts: FontFace[] = [];
  const seen = new Set<string>();

  for (const animation of container.animations) {
    for (const font of collectAnimationFonts(animation.data, container.files)) {
      const key = `${font.family}\n${font.path}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const fileData = container.files[font.path];
      if (!fileData) continue;

      const face = new FontFace(font.family, `url(${toDataUri(font.path, fileData)})`, {
        style: font.style,
        weight: font.weight,
      });
      fonts.push(face);
      globalThis.document.fonts.add(face);
    }
  }

  return Promise.all(fonts.map((font) => font.load().catch(() => font)));
}

export function unregisterPackagedFonts(fonts: FontFace[]): void {
  if (typeof globalThis.document === 'undefined' || !globalThis.document.fonts) return;
  for (const font of fonts) {
    globalThis.document.fonts.delete?.(font);
  }
}

interface ResolvedFontAsset {
  family: string;
  path: string;
  style: string;
  weight: string;
}

function collectAnimationFonts(
  animationData: Record<string, unknown>,
  files: Record<string, Uint8Array>,
): ResolvedFontAsset[] {
  const fontsRecord = animationData['fonts'];
  if (!fontsRecord || typeof fontsRecord !== 'object') return [];

  const list = (fontsRecord as Record<string, unknown>)['list'];
  if (!Array.isArray(list)) return [];

  const resolved: ResolvedFontAsset[] = [];
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const font = item as Record<string, unknown>;
    const family = String(font['fName'] ?? font['fFamily'] ?? '').trim();
    if (!family) continue;

    const path = findPackagedFont(files, font);
    if (!path) continue;

    resolved.push({
      family,
      path,
      style: /italic|oblique/i.test(String(font['fStyle'] ?? family)) ? 'italic' : 'normal',
      weight: fontWeight(String(font['fStyle'] ?? family)),
    });
  }
  return resolved;
}

function findPackagedFont(files: Record<string, Uint8Array>, font: Record<string, unknown>): string | undefined {
  const candidates = new Set<string>();
  addFontCandidates(candidates, String(font['fPath'] ?? '').trim());
  addFontCandidates(candidates, String(font['fName'] ?? '').trim());
  addFontCandidates(candidates, String(font['fFamily'] ?? '').trim());

  const lowerCandidates = new Set([...candidates].map((candidate) => candidate.replace(/^\.?\//, '').toLowerCase()));
  return Object.keys(files).find((filePath) => lowerCandidates.has(filePath.toLowerCase()));
}

function addFontCandidates(candidates: Set<string>, value: string): void {
  if (!value) return;
  const normalized = value.replace(/^\.?\//, '');
  candidates.add(normalized);
  candidates.add(normalized.startsWith('f/') ? normalized : `f/${normalized}`);
  for (const extension of ['ttf', 'otf', 'woff', 'woff2']) {
    if (/\.(ttf|otf|woff|woff2)$/i.test(normalized)) continue;
    candidates.add(`f/${normalized}.${extension}`);
  }
}

function fontWeight(value: string): string {
  if (/black|heavy/i.test(value)) return '900';
  if (/bold/i.test(value)) return '700';
  if (/medium/i.test(value)) return '500';
  if (/light|thin/i.test(value)) return '300';
  return 'normal';
}

function isExternalAssetPath(path: string): boolean {
  return path.startsWith('data:') || /^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('//');
}

function findPackagedAsset(files: Record<string, Uint8Array>, basePath: string, path: string): string | undefined {
  const candidates = [`${basePath}${path}`, path, path.startsWith('i/') ? path : `i/${path}`].map((candidate) =>
    candidate.replace(/^\.?\//, ''),
  );
  const lowerCandidates = new Set(candidates.map((candidate) => candidate.toLowerCase()));

  return Object.keys(files).find((filePath) => lowerCandidates.has(filePath.toLowerCase()));
}

function toDataUri(path: string, data: Uint8Array): string {
  return `data:${mimeTypeForPath(path)};base64,${base64Encode(data)}`;
}

function mimeTypeForPath(path: string): string {
  const lower = path.toLowerCase();
  if (lower.endsWith('.ttf')) return 'font/ttf';
  if (lower.endsWith('.otf')) return 'font/otf';
  if (lower.endsWith('.woff')) return 'font/woff';
  if (lower.endsWith('.woff2')) return 'font/woff2';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.gif')) return 'image/gif';
  return 'image/png';
}

function base64Encode(data: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';

  for (let i = 0; i < data.length; i += 3) {
    const a = data[i] ?? 0;
    const b = data[i + 1];
    const c = data[i + 2];
    output += chars[a >> 2];
    output += chars[((a & 3) << 4) | ((b ?? 0) >> 4)];
    output += i + 1 < data.length ? chars[(((b ?? 0) & 15) << 2) | ((c ?? 0) >> 6)] : '=';
    output += i + 2 < data.length ? chars[(c ?? 0) & 63] : '=';
  }

  return output;
}
