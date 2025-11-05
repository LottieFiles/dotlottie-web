import type { MainModule, VectorChar } from '../core/dotlottie-player.types';

export const toVectorChar = (module: MainModule, data: ArrayBuffer): VectorChar => {
  const vectorChar = new module.VectorChar();

  const uint8Array = new Uint8Array(data);

  for (let i = 0; i < uint8Array.length; i += 1) {
    const byte = uint8Array[i];

    if (byte !== undefined && typeof byte === 'number') {
      vectorChar.push_back(byte);
    }
  }

  return vectorChar;
};
