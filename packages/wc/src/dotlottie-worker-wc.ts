/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { customElement, property } from 'lit/decorators.js';

import { BaseDotLottieWC } from './base-dotlottie-wc';

@customElement('dotlottie-worker-wc')
export class DotLottieWorkerWC extends BaseDotLottieWC<DotLottieWorker> {
  @property({ type: String })
  public workerUrl: string = '';

  public override connectedCallback(): void {
    // Validate workerUrl before initializing
    if (!this.workerUrl) {
      throw new Error(
        'dotlottie-worker-wc: workerUrl attribute is required for CSP-compliant worker initialization. ' +
          'Please provide the path to dotlottie-worker.js. ' +
          'Example: <dotlottie-worker-wc workerUrl="/workers/dotlottie-worker.js"></dotlottie-worker-wc>',
      );
    }

    super.connectedCallback();
  }

  protected override _createDotLottieInstance(config: Config & { workerId?: string }): DotLottieWorker {
    return new DotLottieWorker({
      ...config,
      workerUrl: this.workerUrl,
    });
  }
}
