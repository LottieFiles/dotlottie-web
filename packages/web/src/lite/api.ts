import type { DotLottie } from '../dotlottie';

/**
 * Public API contract shared by every DotLottie player implementation.
 *
 * Derived mechanically from the DotLottie class (public instance members only),
 * so any implementing class is compiler-verified against the real player and
 * cannot drift from it. Type-only: importing this adds zero bytes to a bundle.
 */
export type DotLottieAPI = { [K in keyof DotLottie]: DotLottie[K] };

/**
 * Static-side contract of the DotLottie class (not covered by `implements`).
 * Implementations assert conformance by assigning the class to this type.
 */
export type DotLottieStatics = {
  registerFont: typeof DotLottie.registerFont;
  setWasmUrl: typeof DotLottie.setWasmUrl;
};
