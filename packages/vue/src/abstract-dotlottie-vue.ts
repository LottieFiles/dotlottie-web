import type { DotLottieWorker, DotLottie, Mode } from '@lottiefiles/dotlottie-web';
import { type Config } from '@lottiefiles/dotlottie-web';
import { type VNode, onMounted, watch, type SetupContext, onBeforeUnmount, defineComponent, h, ref } from 'vue';

export { type DotLottie };

export interface AbstractDotLottieVueProps extends Omit<Config, 'canvas'> {
  _createDotLottieInstance: (config: Config & { workerId?: string }) => DotLottie | DotLottieWorker;
  animationId?: string;
  dotLottieRefCallback?: (dotLottie: DotLottie | DotLottieWorker) => void;
  playOnHover?: boolean;
  themeData?: string;
  themeId?: string;
  workerId?: string;
}

export const dotLottieVuePropsDefinition = defineProps({
  animationId: String,
  autoplay: Boolean,
  backgroundColor: String,
  data: [String, ArrayBuffer],
  loop: Boolean,
  mode: String,
  renderConfig: Object,
  segment: Array,
  speed: Number,
  src: String,
  useFrameInterpolation: Boolean,
  marker: String,
  playOnHover: Boolean,
  themeData: String,
  themeId: String,
  workerId: String,
  _createDotLottieInstance: { Function, required: true },
  dotLottieRefCallback: Function,
});

export const AbstractDotLottieVue = defineComponent({
  props: dotLottieVuePropsDefinition,
  setup(props, { attrs, expose }: SetupContext): () => VNode {
    let dotLottie: DotLottie | DotLottieWorker | null = null;
    const canvasRef = ref<HTMLCanvasElement | null>(null);

    watch(
      () => props.backgroundColor,
      (newVal) => {
        dotLottie?.setBackgroundColor(newVal ?? '');
      },
    );
    watch(
      () => props.marker,
      (newVal) => {
        dotLottie?.setMarker(newVal ?? '');
      },
    );
    watch(
      () => props.loop,
      (newVal) => {
        dotLottie?.setLoop(newVal);
      },
    );
    watch(
      () => props.mode,
      (newVal) => {
        if (newVal) {
          dotLottie?.setMode(newVal as Mode);
        } else {
          dotLottie?.setMode('forward');
        }
      },
    );
    watch(
      () => props.segment,
      (_newVal) => {
        // const startFrame = newVal?.[0] ?? 0;
        // const endFrame = newVal?.[1] ?? 0;
        // dotLottie?.setSegment(startFrame, endFrame);
      },
    );
    watch(
      () => props.speed,
      (newVal) => {
        dotLottie?.setSpeed(newVal ?? 1);
      },
    );
    watch(
      () => props.useFrameInterpolation,
      (newVal) => {
        dotLottie?.setUseFrameInterpolation(newVal);
      },
    );
    watch(
      () => props.animationId,
      (newVal) => {
        dotLottie?.loadAnimation(newVal ?? '');
      },
    );
    watch(
      () => props.themeData,
      (newVal) => {
        dotLottie?.setTheme(newVal ?? '');
      },
    );
    watch(
      () => props.themeId,
      (newVal) => {
        dotLottie?.setThemeData(newVal ?? '');
      },
    );

    onMounted(() => {
      const canvas = canvasRef.value;

      const { _createDotLottieInstance, dotLottieRefCallback, ...config } = props;

      dotLottie = _createDotLottieInstance?.({
        ...config,
        canvas,
      });

      if (typeof dotLottieRefCallback === 'function') {
        dotLottieRefCallback(dotLottie);
      }
    });

    onBeforeUnmount(() => {
      dotLottie?.destroy();
      dotLottie = null;
    });

    expose({
      getDotLottieInstance: (): DotLottie | DotLottieWorker | null => dotLottie,
    });

    return () => h('div', { ...attrs }, [h('canvas', { ref: canvasRef, style: 'height: 100%; width: 100%' })]);
  },
});
