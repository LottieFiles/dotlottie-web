/* eslint-disable node/no-unsupported-features/node-builtins */
import type { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { describe, test, expect, vi, afterEach } from 'vitest';

import { setWasmUrl, type DotLottieWorkerWC } from '../src';
import type { DotLottieWC } from '../src/dotlottie-wc';

const src = new URL('./__fixtures__/test.lottie', import.meta.url).href;
const lottieSrc = new URL('./__fixtures__/test.json', import.meta.url).href;

setWasmUrl(new URL('../../web/src/core/dotlottie-player.wasm', import.meta.url).href);

const render = <T extends 'dotlottie-wc' | 'dotlottie-worker-wc'>(
  elementName: T,
  attributes: Record<string, string> = {},
): {
  element: T extends 'dotlottie-wc' ? DotLottieWC : DotLottieWorkerWC;
  rerender: (props: Record<string, string>) => void;
  unmount: () => void;
} => {
  const element = document.createElement(elementName) as T extends 'dotlottie-wc' ? DotLottieWC : DotLottieWorkerWC;

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  document.body.appendChild(element);

  const unmount = (): void => {
    document.body.removeChild(element);
  };

  const rerender = (givenAttributes: Record<string, string>): void => {
    const currentAttributes = element.getAttributeNames();

    // remove attributes not present in the new attributes
    currentAttributes.forEach((key) => {
      if (!(key in givenAttributes)) {
        element.removeAttribute(key);
      }
    });

    Object.entries(givenAttributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  };

  return { element, rerender, unmount };
};

const cleanup = (): void => {
  document.body.innerHTML = '';
};

describe.each([{ elementName: 'dotlottie-wc' as const }, { elementName: 'dotlottie-worker-wc' as const }])(
  '$elementName',
  ({ elementName }) => {
    afterEach(() => {
      cleanup();
    });

    test('should be defined', () => {
      const customElements = window.customElements;

      expect(customElements.get(elementName)).toBeDefined();
    });

    test('should instantiate dotLottie instance on connectedCallback', () => {
      const { element } = render(elementName, { src });

      vi.spyOn(element, 'connectedCallback');

      expect(element.dotLottie).toBeDefined();
    });

    test('calls dotLottie.destroy on unmount', async () => {
      const { element, unmount } = render(elementName, { src });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;

      await vi.waitFor(() => {
        expect(dotLottie.isLoaded).toBe(true);
      });

      const destroy = vi.spyOn(dotLottie, 'destroy');

      unmount();

      expect(destroy).toHaveBeenCalledTimes(1);
      expect(element.dotLottie).toBeNull();
    });

    test.todo('should render canvas element', async () => {
      const { element } = render(elementName, { src });

      await vi.waitFor(() => {
        expect(element.dotLottie?.isLoaded).toBe(true);
      });

      expect(element.shadowRoot?.innerHTML).toMatchSnapshot();
    });

    test('should render with data', async () => {
      // eslint-disable-next-line @typescript-eslint/promise-function-async
      const animationData = await fetch(lottieSrc).then((res) => res.json());

      const { element } = render(elementName, { data: animationData });

      expect(element).toBeDefined();
    });

    test('calls dotLottie.setSpeed when speed attribute changes', async () => {
      const { element, rerender } = render(elementName, { src });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;

      await vi.waitFor(() => {
        expect(dotLottie.isLoaded).toBe(true);
      });

      expect(dotLottie.speed).toBe(1);

      const setSpeed = vi.spyOn(dotLottie, 'setSpeed');

      rerender({
        src,
        speed: '2',
      });

      expect(setSpeed).toHaveBeenCalledTimes(1);
      expect(setSpeed).toHaveBeenCalledWith(2);

      await vi.waitFor(() => {
        expect(dotLottie.speed).toBe(2);
      });

      rerender({});

      expect(setSpeed).toHaveBeenCalledTimes(2);
      expect(setSpeed).toHaveBeenCalledWith(1);

      await vi.waitFor(() => {
        expect(dotLottie.speed).toBe(1);
      });
    });

    test('calls dotLottie.setMarker when marker attribute changes', async () => {
      const { element, rerender } = render(elementName, { src });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;

      await vi.waitFor(() => {
        expect(dotLottie.isLoaded).toBe(true);
      });

      expect(dotLottie.marker).toBe('');

      const setMarker = vi.spyOn(dotLottie, 'setMarker');

      rerender({ src, marker: 'Marker_1' });

      expect(setMarker).toHaveBeenCalledTimes(1);
      expect(setMarker).toHaveBeenCalledWith('Marker_1');

      await vi.waitFor(() => {
        expect(dotLottie.marker).toBe('Marker_1');
      });

      rerender({ src });

      expect(setMarker).toHaveBeenCalledTimes(2);
      expect(setMarker).toHaveBeenCalledWith('');

      await vi.waitFor(() => {
        expect(dotLottie.marker).toBe('');
      });
    });

    test('calls dotLottie.setLoop when loop attribute changes', async () => {
      const { element, rerender } = render(elementName, { src });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;

      await vi.waitFor(() => {
        expect(dotLottie.isLoaded).toBe(true);
      });

      expect(dotLottie.loop).toBe(false);

      const setLoop = vi.spyOn(dotLottie, 'setLoop');

      rerender({ src, loop: 'true' });

      expect(setLoop).toHaveBeenCalledTimes(1);
      expect(setLoop).toHaveBeenCalledWith(true);

      await vi.waitFor(() => {
        expect(dotLottie.loop).toBe(true);
      });

      rerender({ src });

      expect(setLoop).toHaveBeenCalledTimes(2);
      expect(setLoop).toHaveBeenCalledWith(false);

      await vi.waitFor(() => {
        expect(dotLottie.loop).toBe(false);
      });
    });

    test('calls dotLottie.setUseFrameInterpolation when useFrameInterpolation attribute changes', async () => {
      const { element, rerender } = render(elementName, { src });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;

      await vi.waitFor(() => {
        expect(dotLottie.isLoaded).toBe(true);
      });

      expect(dotLottie.useFrameInterpolation).toBe(true);

      const setUseFrameInterpolation = vi.spyOn(dotLottie, 'setUseFrameInterpolation');

      rerender({ src, useframeinterpolation: 'false' });

      expect(setUseFrameInterpolation).toHaveBeenCalledTimes(1);
      expect(setUseFrameInterpolation).toHaveBeenCalledWith(false);

      await vi.waitFor(() => {
        expect(dotLottie.useFrameInterpolation).toBe(false);
      });

      rerender({ src });

      expect(setUseFrameInterpolation).toHaveBeenCalledTimes(2);
      expect(setUseFrameInterpolation).toHaveBeenCalledWith(true);

      await vi.waitFor(() => {
        expect(dotLottie.useFrameInterpolation).toBe(true);
      });
    });

    test('calls dotLottie.setMode when marker attribute changes', async () => {
      const { element, rerender } = render(elementName, { src });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;

      await vi.waitFor(() => {
        expect(dotLottie.isLoaded).toBe(true);
      });

      const setMode = vi.spyOn(dotLottie, 'setMode');

      rerender({ src, mode: 'bounce' });

      expect(setMode).toHaveBeenCalledTimes(1);
      expect(setMode).toHaveBeenCalledWith('bounce');

      await vi.waitFor(() => {
        expect(dotLottie.mode).toBe('bounce');
      });

      rerender({ src });

      expect(setMode).toHaveBeenCalledTimes(2);
      expect(setMode).toHaveBeenCalledWith('forward');

      await vi.waitFor(() => {
        expect(dotLottie.mode).toBe('forward');
      });
    });

    test('calls dotLottie.setSegment when segment attribute changes', async () => {
      const { element, rerender } = render(elementName, { src });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;

      await vi.waitFor(() => {
        expect(dotLottie.isLoaded).toBe(true);
      });

      const setSegment = vi.spyOn(dotLottie, 'setSegment');

      rerender({ src, segment: JSON.stringify([0, 20]) });

      expect(setSegment).toHaveBeenCalledTimes(1);
      expect(setSegment).toHaveBeenCalledWith(0, 20);

      await vi.waitFor(() => {
        expect(dotLottie.segment).toEqual([0, 20]);
      });

      rerender({ src });

      expect(setSegment).toHaveBeenCalledTimes(2);
      expect(setSegment).toHaveBeenCalledWith(0, dotLottie.totalFrames);

      await vi.waitFor(() => {
        expect(dotLottie.segment).toEqual([0, dotLottie.totalFrames]);
      });
    });

    test('calls dotLottie.load when src attribute changes', async () => {
      const { element, rerender } = render(elementName, {});

      await vi.waitFor(() => {
        expect(element.dotLottie?.isReady).toBe(true);
      });

      const load = vi.spyOn(element.dotLottie as DotLottie | DotLottieWorker, 'load');

      rerender({ src: lottieSrc });

      expect(load).toHaveBeenCalledTimes(1);
      expect(load).toHaveBeenCalledWith({
        src: lottieSrc,
      });

      load.mockClear();

      rerender({});

      expect(load).not.toHaveBeenCalled();
    });

    test('calls dotLottie.load when data attribute changes', async () => {
      const { element, rerender } = render(elementName, {});

      await vi.waitFor(() => {
        expect(element.dotLottie?.isReady).toBe(true);
      });

      const load = vi.spyOn(element.dotLottie as DotLottie | DotLottieWorker, 'load');

      // eslint-disable-next-line @typescript-eslint/promise-function-async
      const lottieAnimationData = await fetch(lottieSrc).then((res) => res.text());

      rerender({ data: lottieAnimationData });

      expect(load).toHaveBeenCalledTimes(1);
      expect(load).toHaveBeenCalledWith({
        data: lottieAnimationData,
      });

      load.mockClear();

      rerender({});

      expect(load).not.toHaveBeenCalled();
    });

    test('calls dotLottie.setBackgroundColor when background-color attribute changes', async () => {
      const { element, rerender } = render(elementName, {
        src,
      });

      // FIX: Can't set config until the dotLottie instance is ready
      await vi.waitFor(() => {
        expect(element.dotLottie?.isReady).toBe(true);
      });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;

      const setBackgroundColor = vi.spyOn(dotLottie, 'setBackgroundColor');

      expect(dotLottie.backgroundColor).toBe('');

      rerender({ backgroundcolor: '#ff00ff' });

      expect(setBackgroundColor).toHaveBeenCalledTimes(1);
      expect(setBackgroundColor).toHaveBeenCalledWith('#ff00ff');

      await vi.waitFor(() => {
        expect(dotLottie.backgroundColor).toBe('#ff00ff');
      });

      rerender({});

      expect(setBackgroundColor).toHaveBeenCalledTimes(2);
      expect(setBackgroundColor).toHaveBeenCalledWith('');

      await vi.waitFor(() => {
        expect(dotLottie.backgroundColor).toBe('');
      });
    });

    test('calls dotLottie.setRenderConfig when renderconfig attribute changes', async () => {
      const { element, rerender } = render(elementName, { src });

      await vi.waitFor(() => {
        expect(element.dotLottie?.isReady).toBe(true);
      });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;

      const setRenderConfig = vi.spyOn(dotLottie, 'setRenderConfig');

      const originalRenderConfig = dotLottie.renderConfig;

      rerender({ renderconfig: JSON.stringify({ devicePixelRatio: 0.5 }) });

      expect(setRenderConfig).toHaveBeenCalledTimes(1);
      expect(setRenderConfig).toHaveBeenCalledWith({ devicePixelRatio: 0.5 });

      await vi.waitFor(() => {
        expect(dotLottie.renderConfig).toHaveProperty('devicePixelRatio', 0.5);
      });

      rerender({});

      expect(setRenderConfig).toHaveBeenCalledTimes(2);
      expect(setRenderConfig).toHaveBeenCalledWith({});

      // falls back to default values
      await vi.waitFor(() => {
        expect(dotLottie.renderConfig).toEqual(originalRenderConfig);
      });
    });

    test('calls dotLottie.loadAnimation when animationid attribute changes', async () => {
      const { element, rerender } = render(elementName, {
        // eslint-disable-next-line no-secrets/no-secrets
        src: 'https://lottie.host/294b684d-d6b4-4116-ab35-85ef566d4379/VkGHcqcMUI.lottie',
      });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;

      const onLoad = vi.fn();

      dotLottie.addEventListener('load', onLoad);

      await vi.waitFor(
        () => {
          expect(onLoad).toHaveBeenCalledTimes(1);
        },
        { timeout: 10000 },
      );

      const animationId = dotLottie.manifest?.animations[1]?.id;

      expect(animationId).toBeDefined();

      const loadAnimation = vi.spyOn(dotLottie, 'loadAnimation');

      rerender({ animationid: animationId as string });

      expect(loadAnimation).toHaveBeenCalledTimes(1);
      expect(loadAnimation).toHaveBeenCalledWith(animationId);

      await vi.waitFor(() => {
        expect(onLoad).toHaveBeenCalledTimes(2);
      });

      await vi.waitFor(() => {
        expect(element.dotLottie?.activeAnimationId).toBe(animationId);
      });

      loadAnimation.mockClear();

      rerender({ animationid: '' });

      expect(loadAnimation).not.toHaveBeenCalled();
    });

    test('dotLottie instance is recreated when component is moved to a new DOM node', async () => {
      const { element } = render(elementName, { src });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;
      const destroy = vi.spyOn(dotLottie, 'destroy');

      expect(element.dotLottie).toBe(dotLottie);

      const div = document.createElement('div');

      // move the component to a new DOM node
      div.appendChild(element);
      document.body.appendChild(div);

      expect(destroy).toHaveBeenCalledTimes(1);
      expect(element.dotLottie).not.toBe(dotLottie);
    });

    test('dotLottie instance is recreated when component is adopted to a new document', async () => {
      const { element } = render(elementName, { src });

      const dotLottie = element.dotLottie as DotLottie | DotLottieWorker;
      const destroy = vi.spyOn(dotLottie, 'destroy');

      expect(element.dotLottie).toBe(dotLottie);

      const iframe = document.createElement('iframe');

      // move the component to a new document
      document.body.appendChild(iframe);
      iframe.contentDocument?.body.appendChild(element);

      expect(destroy).toHaveBeenCalledTimes(1);
      expect(element.dotLottie).not.toBe(dotLottie);
    });
  },
);
