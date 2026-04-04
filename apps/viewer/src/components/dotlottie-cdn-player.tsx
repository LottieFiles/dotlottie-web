import type { DotLottie, Mode } from '@lottiefiles/dotlottie-web';
import { useCallback, useEffect, useRef } from 'react';

interface DotLottieCDNPlayerProps {
  version: string;
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

async function createCDNDotLottieInstance(
  version: string,
  config: Omit<DotLottieCDNPlayerProps, 'version' | 'dotLottieRefCallback'> & { canvas: HTMLCanvasElement },
): Promise<DotLottie> {
  const module = await import(/* @vite-ignore */ `https://esm.sh/@lottiefiles/dotlottie-web@${version}`);
  const CDNDotLottie = module.DotLottie;

  CDNDotLottie.setWasmUrl(`https://unpkg.com/@lottiefiles/dotlottie-web@${version}/dist/dotlottie-player.wasm`);

  return new CDNDotLottie({
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

export default function DotLottieCDNPlayer({
  version,
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
}: DotLottieCDNPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<DotLottie | null>(null);
  const versionRef = useRef(version);

  const initPlayer = useCallback(async () => {
    if (instanceRef.current) {
      try {
        instanceRef.current.destroy();
      } catch {
        // WASM may throw during cleanup
      }
      instanceRef.current = null;
      dotLottieRefCallback(null);
    }

    const canvas = canvasRef.current;

    if (!canvas) return;

    try {
      const instance = await createCDNDotLottieInstance(version, {
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

      // Guard against stale init (version changed while awaiting)
      if (versionRef.current !== version) {
        instance.destroy();

        return;
      }

      instanceRef.current = instance;
      dotLottieRefCallback(instance);
    } catch (error) {
      console.error(`[DotLottieCDNPlayer] Failed to load v${version}:`, error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, src]);

  useEffect(() => {
    versionRef.current = version;
    initPlayer();

    return () => {
      if (instanceRef.current) {
        try {
          instanceRef.current.destroy();
        } catch {
          // WASM may throw during cleanup
        }
        instanceRef.current = null;
        dotLottieRefCallback(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initPlayer]);

  // Sync props to existing instance
  useEffect(() => {
    instanceRef.current?.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    instanceRef.current?.setLoop(loop);
  }, [loop]);

  useEffect(() => {
    instanceRef.current?.setMode(mode);
  }, [mode]);

  useEffect(() => {
    instanceRef.current?.setUseFrameInterpolation(useFrameInterpolation);
  }, [useFrameInterpolation]);

  useEffect(() => {
    instanceRef.current?.setBackgroundColor(backgroundColor);
  }, [backgroundColor]);

  useEffect(() => {
    if (!instanceRef.current || !animationId) return;

    instanceRef.current.loadAnimation(animationId);
  }, [animationId]);

  useEffect(() => {
    if (!instanceRef.current) return;

    if (themeId) {
      instanceRef.current.setTheme(themeId);
    } else {
      instanceRef.current.resetTheme();
    }
  }, [themeId]);

  useEffect(() => {
    if (!instanceRef.current || !marker) return;

    instanceRef.current.setMarker(marker);
  }, [marker]);

  useEffect(() => {
    if (!instanceRef.current || segment.length !== 2) return;

    instanceRef.current.setSegment(segment[0]!, segment[1]!);
  }, [segment]);

  useEffect(() => {
    if (!instanceRef.current) return;

    if (stateMachineId) {
      instanceRef.current.stateMachineLoad(stateMachineId);
      instanceRef.current.stateMachineStart();
    } else {
      instanceRef.current.stateMachineStop();
    }
  }, [stateMachineId]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}
