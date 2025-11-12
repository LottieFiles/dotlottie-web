/* eslint-disable no-warning-comments */
import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import type { VNode } from 'vue';
import { defineComponent, h } from 'vue';

import { AbstractDotLottieVue, dotLottieVuePropsDefinition } from './abstract-dotlottie-vue';

export const DotLottieVue = defineComponent({
  // TODO: omit from the props the createDotLottieInstance function
  props: dotLottieVuePropsDefinition,
  setup(props, { attrs }) {
    console.log('DotLottieVue Props', props);
    const _createDotLottieInstance = (config: Config): DotLottie => {
      return new DotLottie(config);
    };

    return (): VNode => h(AbstractDotLottieVue, { ...props, ...attrs, _createDotLottieInstance });
  },
});
