import { type Config, DotLottie, type Mode } from '@lottiefiles/dotlottie-web';
import {
  type VNode,
  h,
  ref,
  onMounted,
  type Ref,
  watch,
  type SetupContext,
  onBeforeUnmount,
  defineComponent,
  toRefs,
} from 'vue';

export { type DotLottie };

export interface DotLottieVueProps extends Omit<Config, 'canvas'> {}

export const DotLottieVue = defineComponent({
  props: {
    autoplay: { type: Boolean, required: false },
    backgroundColor: { type: String, required: false },
    data: { type: [String, ArrayBuffer], required: false },
    loop: { type: Boolean, required: false },
    mode: { type: String as () => Mode, required: false },
    renderConfig: { type: Object, required: false },
    segment: { type: Array as unknown as () => [number, number], required: false },
    speed: { type: Number, required: false },
    src: { type: String, required: false },
    useFrameInterpolation: { type: Boolean, required: false },
  },

  setup(props: DotLottieVueProps, { attrs, expose }: SetupContext): () => VNode {
    const canvas: Ref<HTMLCanvasElement | undefined> = ref(undefined);
    const { backgroundColor, loop, mode, segment, speed, useFrameInterpolation } = toRefs(props);
    let dotLottie: DotLottie | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;

    // Prop change
    watch(
      () => backgroundColor?.value,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setBackgroundColor(newVal);
        }
      },
    );
    watch(
      () => loop?.value,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setLoop(newVal);
        }
      },
    );
    watch(
      () => mode?.value,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setMode(newVal);
        }
      },
    );
    watch(
      () => segment?.value,
      (newVal) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (dotLottie && Array.isArray(newVal) && newVal.length === 2) {
          dotLottie.setSegment(newVal[0], newVal[1]);
        }
      },
    );
    watch(
      () => speed?.value,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setSpeed(newVal);
        }
      },
    );
    watch(
      () => useFrameInterpolation?.value,
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
      getDotLottieInstance: (): DotLottie | null => dotLottie,
    });

    return () => h('div', { ...attrs }, h('canvas', { style: 'height: 100%; width: 100%', ref: canvas }));
  },
});

export const setWasmUrl = (url: string): void => {
  DotLottie.setWasmUrl(url);
};
