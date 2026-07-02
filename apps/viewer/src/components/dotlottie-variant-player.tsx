import type { DotLottie, Mode } from '@lottiefiles/dotlottie-web';
import { useCallback, useEffect, useRef } from 'react';
import webglWasmUrl from '../../../../packages/web/src/webgl/dotlottie-player.wasm?url';
import webgpuWasmUrl from '../../../../packages/web/src/webgpu/dotlottie-player.wasm?url';
import type { Renderer } from '../store/viewer-slice';

interface DotLottieGPUPlayerProps {
  renderer: Exclude<Renderer, 'software'>;
  src: string;
  autoplay: boolean;
  loop: boolean;
  speed: number;
  mode: Mode;
  backgroundColor: string;
  useFrameInterpolation: boolean;
  animationId: string;
  themeId: string;
  marker: string;
  segment: [number, number] | number[];
  stateMachineId: string;
  dotLottieRefCallback: (instance: DotLottie | null) => void;
}

async function createDotLottieInstance(
  renderer: 'webgl' | 'webgpu',
  config: Omit<DotLottieGPUPlayerProps, 'renderer' | 'dotLottieRefCallback'> & { canvas: HTMLCanvasElement },
): Promise<DotLottie> {
  if (renderer === 'webgl') {
    const { DotLottie: DotLottieWebGL } = await import('@lottiefiles/dotlottie-web/webgl');

    DotLottieWebGL.setWasmUrl(webglWasmUrl);

    return new DotLottieWebGL({
      canvas: config.canvas,
      src: config.src,
      autoplay: config.autoplay,
      loop: config.loop,
      speed: config.speed,
      mode: config.mode,
      backgroundColor: config.backgroundColor,
      useFrameInterpolation: config.useFrameInterpolation,
      animationId: config.animationId || undefined,
      themeId: config.themeId || undefined,
      marker: config.marker || undefined,
      segment: config.segment.length === 2 ? (config.segment as [number, number]) : undefined,
      stateMachineId: config.stateMachineId || undefined,
    }) as unknown as DotLottie;
  }

  const { DotLottie: DotLottieWebGPU } = await import('@lottiefiles/dotlottie-web/webgpu');

  DotLottieWebGPU.setWasmUrl(webgpuWasmUrl);

  return new DotLottieWebGPU({
    canvas: config.canvas,
    src: config.src,
    autoplay: config.autoplay,
    loop: config.loop,
    speed: config.speed,
    mode: config.mode,
    backgroundColor: config.backgroundColor,
    useFrameInterpolation: config.useFrameInterpolation,
    animationId: config.animationId || undefined,
    themeId: config.themeId || undefined,
    marker: config.marker || undefined,
    segment: config.segment.length === 2 ? (config.segment as [number, number]) : undefined,
    stateMachineId: config.stateMachineId || undefined,
  }) as unknown as DotLottie;
}

export default function DotLottieGPUPlayer({
  renderer,
  src,
  autoplay,
  loop,
  speed,
  mode,
  backgroundColor,
  useFrameInterpolation,
  animationId,
  themeId,
  marker,
  segment,
  stateMachineId,
  dotLottieRefCallback,
}: DotLottieGPUPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<DotLottie | null>(null);
  const rendererRef = useRef(renderer);

  // Create / destroy the player when renderer or src changes
  const initPlayer = useCallback(async () => {
    // Destroy previous instance
    if (instanceRef.current) {
      try {
        instanceRef.current.destroy();
      } catch {
        // WASM may throw during cleanup if GPU resources are already gone
      }
      instanceRef.current = null;
      dotLottieRefCallback(null);
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    try {
      const instance = await createDotLottieInstance(renderer, {
        canvas,
        src,
        autoplay,
        loop,
        speed,
        mode,
        backgroundColor,
        useFrameInterpolation,
        animationId,
        themeId,
        marker,
        segment,
        stateMachineId,
      });

      // Guard against stale init (renderer changed while awaiting)
      if (rendererRef.current !== renderer) {
        instance.destroy();

        return;
      }

      instanceRef.current = instance;
      dotLottieRefCallback(instance);
    } catch (error) {
      console.error(`[DotLottieGPUPlayer] Failed to create ${renderer} player:`, error);
    }
    // Only re-create on renderer or src change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderer, src]);

  useEffect(() => {
    rendererRef.current = renderer;
    initPlayer();

    return () => {
      if (instanceRef.current) {
        try {
          instanceRef.current.destroy();
        } catch {
          // WASM may throw during cleanup if GPU resources are already gone
        }
        instanceRef.current = null;
        dotLottieRefCallback(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initPlayer]);

  // Sync props to existing instance
  useEffect(() => {
    const instance = instanceRef.current;

    if (!instance) return;

    instance.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    const instance = instanceRef.current;

    if (!instance) return;

    instance.setLoop(loop);
  }, [loop]);

  useEffect(() => {
    const instance = instanceRef.current;

    if (!instance) return;

    instance.setMode(mode);
  }, [mode]);

  useEffect(() => {
    const instance = instanceRef.current;

    if (!instance) return;

    instance.setUseFrameInterpolation(useFrameInterpolation);
  }, [useFrameInterpolation]);

  useEffect(() => {
    const instance = instanceRef.current;

    if (!instance) return;

    instance.setBackgroundColor(backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    const instance = instanceRef.current;

    if (!instance || !animationId) return;

    instance.loadAnimation(animationId);
  }, [animationId]);

  useEffect(() => {
    const instance = instanceRef.current;

    if (!instance) return;

    if (themeId) {
      instance.setTheme(themeId);
    } else {
      instance.resetTheme();
    }
  }, [themeId]);

  useEffect(() => {
    const instance = instanceRef.current;

    if (!instance || !marker) return;

    instance.setMarker(marker);
  }, [marker]);

  useEffect(() => {
    const instance = instanceRef.current;

    if (!instance || segment.length !== 2) return;

    instance.setSegment(segment[0]!, segment[1]!);
  }, [segment]);

  useEffect(() => {
    const instance = instanceRef.current;

    if (!instance) return;

    if (stateMachineId) {
      instance.stateMachineLoad(stateMachineId);
      instance.stateMachineStart();
    } else {
      instance.stateMachineStop();
    }
  }, [stateMachineId]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}
