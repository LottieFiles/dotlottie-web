/**
 * Copyright 2023 Design Barn Inc.
 */

import { type Config, DotLottie, type EventType, type EventListener } from '@lottiefiles/dotlottie-web';
import { type VNode, h, ref, onMounted, type Ref, watch, type SetupContext, onBeforeUnmount } from 'vue';

export { type DotLottie };

interface DotLottieVueProps extends Omit<Config, 'canvas'> {}

export const DotLottieVue = {
  props: {
    autoplay: { type: Boolean, require: false },
    backgroundColor: { type: String, require: false },
    data: { type: String, require: false },
    loop: { type: Boolean, require: false },
    mode: { type: String, require: false },
    renderConfig: { type: String, require: false },
    segments: { type: Array, require: false },
    speed: { type: Number, require: false },
    src: { type: String, require: false },
    useFrameInterpolation: { type: String, require: false },
  },

  setup(props: DotLottieVueProps, { attrs, expose }: SetupContext): () => VNode {
    const canvas: Ref<HTMLCanvasElement | undefined> = ref(undefined);
    let dotLottie: DotLottie | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;

    // Prop change
    watch(
      () => props.backgroundColor,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setBackgroundColor(newVal);
        }
      },
    );
    watch(
      () => props.loop,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setLoop(newVal);
        }
      },
    );
    watch(
      () => props.mode,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setMode(newVal);
        }
      },
    );
    watch(
      () => props.segments,
      (newVal) => {
        if (dotLottie && Array.isArray(newVal)) {
          dotLottie.setSegments(newVal[0], newVal[1]);
        }
      },
    );
    watch(
      () => props.speed,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setSpeed(newVal);
        }
      },
    );
    watch(
      () => props.useFrameInterpolation,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setUseFrameInterpolation(newVal);
        }
      },
    );

    function getIntersectionObserver(): IntersectionObserver {
      return new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              dotLottie?.unfreeze();
            } else {
              dotLottie?.freeze();
            }
          });
        },
        {
          threshold: 0,
        },
      );
    }

    function getResizeObserver(): ResizeObserver {
      return new ResizeObserver((entries) => {
        entries.forEach(() => {
          dotLottie?.resize();
        });
      });
    }

    function onVisibilityChange(): void {
      if (document.hidden) {
        dotLottie?.freeze();
      } else {
        dotLottie?.unfreeze();
      }
    }

    onMounted(() => {
      if (!canvas.value) return;

      dotLottie = new DotLottie({
        canvas: canvas.value,
        ...props,
      });

      dotLottie.resize();

      intersectionObserver = getIntersectionObserver();
      resizeObserver = getResizeObserver();
      intersectionObserver.observe(canvas.value);
      resizeObserver.observe(canvas.value);
      document.addEventListener('visibilitychange', onVisibilityChange);
    });

    onBeforeUnmount(() => {
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      dotLottie?.destroy();
    });

    expose({
      getInstance: (): DotLottie | null => dotLottie,
      addEventListener: <T extends EventType>(type: T, listener: EventListener<T>) =>
        dotLottie?.addEventListener(type, listener),
      removeEventListener: <T extends EventType>(type: T, listener: EventListener<T>) =>
        dotLottie?.removeEventListener(type, listener),
    });

    return () => h('div', { ...attrs }, h('canvas', { style: 'height: 100%; width: 100%', ref: canvas }));
  },
};
