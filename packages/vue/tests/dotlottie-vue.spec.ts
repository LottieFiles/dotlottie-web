import { DotLottie } from '@lottiefiles/dotlottie-web';
import { afterEach, describe, expect, test, vi } from 'vitest';
import type { App } from 'vue';
import { createApp, h, nextTick, reactive } from 'vue';
import type { DotLottieVueInstance } from '../src';
import { DotLottieVue } from '../src';

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const lottieSrc = new URL('../../../fixtures/test.json', import.meta.url).href;
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const dotLottieSrc = new URL('../../../fixtures/test.lottie', import.meta.url).href;

const themeData = JSON.stringify({ rules: [{ id: 'c0', type: 'Color', value: [1, 0, 1] }] });

describe('DotLottieVue', () => {
  let app: App | undefined;

  afterEach(() => {
    app?.unmount();
    app = undefined;
    vi.restoreAllMocks();
  });

  function mount(props: Record<string, unknown>): { instance: () => DotLottie } {
    let component: DotLottieVueInstance | null = null;

    app = createApp({
      render: () =>
        h(DotLottieVue, {
          ...props,
          ref: (el: unknown) => {
            component = el as DotLottieVueInstance | null;
          },
        }),
    });
    app.mount(document.body.appendChild(document.createElement('div')));

    return {
      instance: () => {
        const instance = component?.getDotLottieInstance();

        if (!instance) throw new Error('expected a player instance');

        return instance;
      },
    };
  }

  test('applies the initial themeData once the animation loads', async () => {
    const setThemeData = vi.spyOn(DotLottie.prototype, 'setThemeData');
    const { instance } = mount({ src: lottieSrc, autoplay: true, themeData });

    await vi.waitFor(() => {
      expect(instance().isLoaded).toBe(true);
      expect(setThemeData).toHaveBeenCalledWith(themeData);
    });
  });

  test('re-applies themeData after src changes', async () => {
    const setThemeData = vi.spyOn(DotLottie.prototype, 'setThemeData');
    const props = reactive({ src: lottieSrc, autoplay: true, themeData });
    const { instance } = mount(props);

    await vi.waitFor(() => {
      expect(instance().isLoaded).toBe(true);
      expect(setThemeData).toHaveBeenCalledTimes(1);
    });

    props.src = dotLottieSrc;
    await nextTick();

    await vi.waitFor(() => {
      expect(setThemeData).toHaveBeenCalledTimes(2);
      expect(setThemeData).toHaveBeenLastCalledWith(themeData);
    });
  });

  test('resets the segment when the segment prop is cleared', async () => {
    const props = reactive<{ src: string; segment?: [number, number] }>({ src: dotLottieSrc });
    const { instance } = mount(props);

    await vi.waitFor(() => expect(instance().isLoaded).toBe(true));

    const player = instance();
    const setSegment = vi.spyOn(player, 'setSegment');
    const resetSegment = vi.spyOn(player, 'resetSegment');

    props.segment = [0, 10];
    await nextTick();

    expect(setSegment).toHaveBeenCalledWith(0, 10);
    expect(player.segment).toEqual([0, 10]);

    props.segment = undefined;
    await nextTick();

    expect(resetSegment).toHaveBeenCalledTimes(1);
    expect(player.segment).toEqual([0, player.totalFrames - 1]);
  });
});
