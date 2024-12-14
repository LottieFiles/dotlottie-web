/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { customElement } from 'lit/decorators.js';

import { AbstractDotLottieWC } from './abstract-dotlottie-wc';

@customElement('dotlottie-worker-wc')
export class DotLottieWorkerWC extends AbstractDotLottieWC<DotLottieWorker> {
  protected override _createDotLottieInstance(config: Config & { workerId?: string }): DotLottieWorker {
    return new DotLottieWorker(config);
  }
}
