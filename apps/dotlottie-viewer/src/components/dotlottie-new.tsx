/**
 * Copyright 2023 Design Barn Inc.
 */

import { DotLottieReact, DotLottieReactProps } from '@lottiefiles/dotlottie-react';

export default function DotLottieNew(props: DotLottieReactProps) {
  return (
    <>
      <div className="">
        <DotLottieReact {...props} />
      </div>
    </>
  );
}
