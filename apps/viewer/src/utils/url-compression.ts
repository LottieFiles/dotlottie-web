import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

/**
 * Compresses code for URL-safe sharing using lz-string.
 * Returns a compressed string that can be used in URL query parameters.
 */
export function compressCode(code: string): string {
  return compressToEncodedURIComponent(code);
}

/**
 * Decompresses code from a URL-safe compressed string.
 * Returns null if decompression fails.
 */
export function decompressCode(compressed: string): string | null {
  try {
    return decompressFromEncodedURIComponent(compressed);
  } catch {
    return null;
  }
}

/**
 * Generates a shareable playground URL with the given code.
 */
export function getPlaygroundUrl(code: string): string {
  const compressed = compressCode(code);
  const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}playground`;
  return `${baseUrl}?code=${compressed}`;
}

/**
 * Generates an embeddable URL for the given code.
 */
export function getEmbedUrl(code: string): string {
  const compressed = compressCode(code);
  const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}embed`;
  return `${baseUrl}?code=${compressed}`;
}

/**
 * Generates an iframe HTML snippet for embedding.
 */
export function getEmbedHtml(code: string, width = 400, height = 400): string {
  const embedUrl = getEmbedUrl(code);
  return `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allowtransparency="true"></iframe>`;
}

/**
 * Extracts and decompresses code from the current URL's query parameters.
 * Returns null if no code parameter exists or decompression fails.
 */
export function getCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const compressed = params.get('code');
  if (!compressed) return null;
  return decompressCode(compressed);
}
