import { DotLottie } from '@lottiefiles/dotlottie-web';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { createApp, h, nextTick, reactive } from 'vue';
import type { App } from 'vue';

import { DotLottieVue } from '../src';
import type { DotLottieVueInstance } from '../src';

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const lottieSrc = new URL('../../../fixtures/test.json', import.meta.url).href;
// eslint-disable-next-line node/no-unsupported-features/node-builtins
const dotLottieSrc = new URL('../../../fixtures/test.lottie', import.meta.url).href;

const themeData = JSON.stringify({ rules: [{ id: 'c0', type: 'Color', value: [1, 0, 1] }] });

describe('DotLottieVue themeData', () => {
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
});
