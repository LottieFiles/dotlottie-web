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
  type PropType,
} from 'vue';

export { type DotLottie };

export interface DotLottieVueProps extends Omit<Config, 'canvas'> {
  playOnHover?: boolean;
  themeData?: string;
}

interface DotLottieVueExposed {
  getDotLottieInstance: () => DotLottie | null;
}

export const DotLottieVue = defineComponent({
  props: {
    animationId: { type: String as PropType<DotLottieVueProps['animationId']>, required: false },
    autoplay: { type: Boolean as PropType<DotLottieVueProps['autoplay']>, required: false },
    backgroundColor: { type: String as PropType<DotLottieVueProps['backgroundColor']>, required: false },
    data: { type: [String, ArrayBuffer] as PropType<DotLottieVueProps['data']>, required: false },
    loop: { type: Boolean as PropType<DotLottieVueProps['loop']>, required: false },
    mode: { type: String as () => Mode as PropType<DotLottieVueProps['mode']>, required: false },
    renderConfig: { type: Object as PropType<DotLottieVueProps['renderConfig']>, required: false },
    segment: {
      type: Array as unknown as () => [number, number] as PropType<DotLottieVueProps['segment']>,
      required: false,
    },
    speed: { type: Number as PropType<DotLottieVueProps['speed']>, required: false },
    src: { type: String as PropType<DotLottieVueProps['src']>, required: false },
    useFrameInterpolation: { type: Boolean as PropType<DotLottieVueProps['useFrameInterpolation']>, required: false },
    marker: { type: String as PropType<DotLottieVueProps['marker']>, required: false },
    playOnHover: { type: Boolean as PropType<DotLottieVueProps['playOnHover']>, required: false },
    themeData: { type: String as PropType<DotLottieVueProps['themeData']>, required: false },
    themeId: { type: String as PropType<DotLottieVueProps['themeId']>, required: false },
  },

  setup(props: DotLottieVueProps, { attrs, expose }: SetupContext): () => VNode {
    const canvas: Ref<HTMLCanvasElement | undefined> = ref(undefined);
    const {
      animationId,
      backgroundColor,
      loop,
      marker,
      mode,
      playOnHover,
      segment,
      speed,
      themeId,
      useFrameInterpolation,
    } = toRefs(props);
    let dotLottie: DotLottie | null = null;

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
        if (!dotLottie) return;

        const startFrame = newVal?.[0];
        const endFrame = newVal?.[1];

        if (typeof startFrame === 'number' && typeof endFrame === 'number') {
          dotLottie.setSegment(startFrame, endFrame);
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
      () => animationId?.value,
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
          dotLottie.setTheme(newVal);
        }
      },
    );
    watch(
      () => themeId?.value,
      (newVal) => {
        if (dotLottie && typeof newVal !== 'undefined') {
          dotLottie.setTheme(newVal);
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

      if (playOnHover?.value) {
        canvas.value.addEventListener('mouseenter', hoverHandler);
        canvas.value.addEventListener('mouseleave', hoverHandler);
      }
    });

    onBeforeUnmount(() => {
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
