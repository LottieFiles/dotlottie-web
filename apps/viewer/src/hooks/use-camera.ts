import type { DotLottie } from '@lottiefiles/dotlottie-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const BUTTON_STEP = 1.25;

interface Camera {
  zoom: number;
  x: number;
  y: number;
}

const IDENTITY: Camera = { zoom: 1, x: 0, y: 0 };

/**
 * Zoom and pan the animation with `setTransform`, leaving the canvas size alone.
 * Wheel/pinch zooms around the pointer, drag pans unless `panEnabled` is false.
 */
export function useCamera(dotLottie: DotLottie | null, panEnabled: boolean) {
  const camera = useRef<Camera>(IDENTITY);
  const [zoom, setZoom] = useState(1);

  const apply = useCallback(
    (next: Camera) => {
      camera.current = next;
      setZoom(next.zoom);
      // published versions older than setTransform don't have it
      if (typeof dotLottie?.setTransform !== 'function') return;
      dotLottie.setTransform([next.zoom, 0, next.x, 0, next.zoom, next.y, 0, 0, 1]);
    },
    [dotLottie],
  );

  // the transform is in canvas buffer pixels, the pointer in CSS pixels
  const toBuffer = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = dotLottie?.canvas;
      if (!(canvas instanceof HTMLCanvasElement)) return null;
      const rect = canvas.getBoundingClientRect();
      const scale = rect.width ? canvas.width / rect.width : 1;
      return { x: (clientX - rect.left) * scale, y: (clientY - rect.top) * scale, scale };
    },
    [dotLottie],
  );

  // zoom by `factor`, keeping the point (px, py) fixed on screen
  const zoomAt = useCallback(
    (factor: number, px: number, py: number) => {
      const { zoom: k, x, y } = camera.current;
      const next = Math.min(Math.max(k * factor, MIN_ZOOM), MAX_ZOOM);
      const f = next / k;
      apply({ zoom: next, x: px - f * (px - x), y: py - f * (py - y) });
    },
    [apply],
  );

  const zoomCenter = useCallback(
    (factor: number) => {
      const canvas = dotLottie?.canvas;
      if (!(canvas instanceof HTMLCanvasElement)) return;
      zoomAt(factor, canvas.width / 2, canvas.height / 2);
    },
    [dotLottie, zoomAt],
  );

  const reset = useCallback(() => apply(IDENTITY), [apply]);

  // new instance or new animation: start from the default view
  useEffect(() => {
    camera.current = IDENTITY;
    setZoom(1);
    if (!dotLottie) return;
    dotLottie.addEventListener('load', reset);
    return () => dotLottie.removeEventListener('load', reset);
  }, [dotLottie, reset]);

  useEffect(() => {
    const canvas = dotLottie?.canvas;
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const onWheel = (event: WheelEvent) => {
      const point = toBuffer(event.clientX, event.clientY);
      if (!point) return;
      event.preventDefault();
      // pinch arrives as ctrl+wheel with small deltas
      zoomAt(Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.002)), point.x, point.y);
    };

    let drag: { id: number; x: number; y: number } | null = null;

    const onPointerDown = (event: PointerEvent) => {
      if (!panEnabled || event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = 'grabbing';
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      const point = toBuffer(event.clientX, event.clientY);
      if (!point) return;
      const { zoom: k, x, y } = camera.current;
      apply({
        zoom: k,
        x: x + (event.clientX - drag.x) * point.scale,
        y: y + (event.clientY - drag.y) * point.scale,
      });
      drag.x = event.clientX;
      drag.y = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      drag = null;
      canvas.releasePointerCapture(event.pointerId);
      canvas.style.cursor = 'grab';
    };

    canvas.style.cursor = panEnabled ? 'grab' : '';
    canvas.style.touchAction = 'none';
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    return () => {
      canvas.style.cursor = '';
      canvas.style.touchAction = '';
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    };
  }, [dotLottie, panEnabled, toBuffer, zoomAt, apply]);

  return {
    zoom,
    zoomIn: () => zoomCenter(BUTTON_STEP),
    zoomOut: () => zoomCenter(1 / BUTTON_STEP),
    reset,
  };
}
