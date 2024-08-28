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

export interface DotLottieVueProps extends Omit<Config, 'canvas'> {
  animationId?: string;
  playOnHover?: boolean;
  themeData?: string;
  themeId?: string;
}

interface DotLottieVueExposed {
  getDotLottieInstance: () => DotLottie | null;
}

export const DotLottieVue = defineComponent({
  props: {
    animationId: { type: String, required: false },
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
    marker: { type: String, required: false },
    playOnHover: { type: Boolean, required: false },
    themeData: { type: String, required: false },
    themeId: { type: String, required: false },
  },

  setup(props: DotLottieVueProps, { attrs, expose }: SetupContext): () => VNode {
    const canvas: Ref<HTMLCanvasElement | undefined> = ref(undefined);
    const { backgroundColor, loop, marker, mode, playOnHover, segment, speed, useFrameInterpolation } = toRefs(props);
    let dotLottie: DotLottie | null = null;
    let intersectionObserver: IntersectionObserver | null = null;

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
      () => marker?.value,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setMarker(newVal);
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
    watch(
      () => props.animationId,
      (newVal) => {
        if (
          dotLottie &&
          dotLottie.isLoaded &&
          typeof newVal !== 'undefined' &&
          newVal !== dotLottie.activeAnimationId
        ) {
          dotLottie.loadAnimation(newVal);
        }
      },
    );
    watch(
      () => props.themeData,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.loadTheme(newVal);
        }
      },
    );
    watch(
      () => props.themeId,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.loadThemeData(newVal);
        }
      },
    );

    function hoverHandler(event: MouseEvent): void {
      if (event.type === 'mouseenter') {
        dotLottie?.play();
      } else {
        dotLottie?.pause();
      }
    }

    watch(
      () => playOnHover?.value,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined' && newVal) {
          canvas.value?.addEventListener('mouseenter', hoverHandler);
          canvas.value?.addEventListener('mouseleave', hoverHandler);
        } else {
          canvas.value?.removeEventListener('mouseenter', hoverHandler);
          canvas.value?.removeEventListener('mouseleave', hoverHandler);
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

    onMounted(() => {
      if (!canvas.value) return;

      let shouldAutoplay = props.autoplay;

      if (typeof playOnHover?.value !== 'undefined' && playOnHover.value) {
        shouldAutoplay = false;
      }

      dotLottie = new DotLottie({
        canvas: canvas.value,
        ...props,
        autoplay: shouldAutoplay,
      });

      intersectionObserver = getIntersectionObserver();
      intersectionObserver.observe(canvas.value);

      if (playOnHover?.value) {
        canvas.value.addEventListener('mouseenter', hoverHandler);
        canvas.value.addEventListener('mouseleave', hoverHandler);
      }
    });

    onBeforeUnmount(() => {
      intersectionObserver?.disconnect();
      canvas.value?.addEventListener('mouseenter', hoverHandler);
      canvas.value?.addEventListener('mouseleave', hoverHandler);
      dotLottie?.destroy();
    });

    expose({
      getDotLottieInstance: (): DotLottie | null => dotLottie,
    } as DotLottieVueExposed);

    return () => h('div', { ...attrs }, h('canvas', { style: 'height: 100%; width: 100%', ref: canvas }));
  },
});

export type DotLottieVueInstance = InstanceType<typeof DotLottieVue> & DotLottieVueExposed;

export const setWasmUrl = (url: string): void => {
  DotLottie.setWasmUrl(url);
};
