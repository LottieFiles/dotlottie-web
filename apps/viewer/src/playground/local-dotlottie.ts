/**
 * Playground runtime module: the workspace build of @lottiefiles/dotlottie-web
 * with its wasm pre-pointed at the locally built binary.
 *
 * The playground preview iframe injects an import map that resolves both
 * `@lottiefiles/dotlottie-web` and `https://esm.sh/@lottiefiles/dotlottie-web`
 * to this module, so example code stays copy-pasteable (it falls back to the
 * published package outside the playground) while running against the repo's
 * current build inside it.
 */
import { DotLottie } from '@lottiefiles/dotlottie-web';

import wasmUrl from '../../../../packages/web/src/core/dotlottie-player.wasm?url';

DotLottie.setWasmUrl(wasmUrl);

export * from '@lottiefiles/dotlottie-web';
