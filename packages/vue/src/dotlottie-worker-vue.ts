/* eslint-disable no-warning-comments */
import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';
import type { VNode } from 'vue';
import { defineComponent, h } from 'vue';

import { AbstractDotLottieVue, dotLottieVuePropsDefinition } from './abstract-dotlottie-vue';

export const DotLottieWorkerVue = defineComponent({
  // TODO: omit from the props the createDotLottieInstance function
  props: dotLottieVuePropsDefinition,
  setup(props, { attrs }) {
    const _createDotLottieInstance = (config: Config & { workerId?: string }): DotLottieWorker => {
      console.log('DotLottieWorkerVue _createDotLottieInstance', config);

      return new DotLottieWorker(config);
    };

    return (): VNode => h(AbstractDotLottieVue, { ...props, ...attrs, _createDotLottieInstance });
  },
});
