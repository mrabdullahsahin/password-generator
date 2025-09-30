import type { PasswordOptions } from "../core/random";
import { getEffectiveCharsetSize } from "../core/random";

// Returns approximate entropy in bits based on effective charset size and length.
export function estimateEntropyBitsForPassword(length: number, effectiveCharsetSize: number): number {
  if (effectiveCharsetSize <= 1 || length <= 0) return 0;
  // H ≈ length * log2(charsetSize)
  return length * Math.log2(effectiveCharsetSize);
}

export function estimateEntropyBitsFromOptions(opts: PasswordOptions): number {
  const size = getEffectiveCharsetSize(opts);
  return estimateEntropyBitsForPassword(opts.length, size);
}


