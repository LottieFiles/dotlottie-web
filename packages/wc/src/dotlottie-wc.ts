/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import { customElement } from 'lit/decorators.js';

import { BaseDotLottieWC } from './base-dotlottie-wc';

@customElement('dotlottie-wc')
export class DotLottieWC extends BaseDotLottieWC<DotLottie> {
  protected override _createDotLottieInstance(config: Config): DotLottie {
    return new DotLottie(config);
  }
}
