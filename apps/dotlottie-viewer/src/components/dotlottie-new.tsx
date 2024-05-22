/**
 * Copyright 2023 Design Barn Inc.
 */

import { DotLottieReact, DotLottieReactProps, setWasmUrl } from '@lottiefiles/dotlottie-react';
import wasmUrl from '../../../../packages/web/src/core/dotlottie-player.wasm?url';

setWasmUrl(wasmUrl);

export default function DotLottieNew(props: DotLottieReactProps) {
  return (
    <>
      <div className="">
        <DotLottieReact {...props} />
      </div>
    </>
  );
}
