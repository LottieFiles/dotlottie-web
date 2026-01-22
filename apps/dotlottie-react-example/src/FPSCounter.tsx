import React, { useEffect, useRef, useState } from 'react';

interface FPSCounterProps {
  style?: React.CSSProperties;
}

export function FPSCounter({ style }: FPSCounterProps) {
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const updateFPS = () => {
      frameCountRef.current++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTimeRef.current;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      rafIdRef.current = requestAnimationFrame(updateFPS);
    };

    rafIdRef.current = requestAnimationFrame(updateFPS);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#00ff00',
        fontFamily: 'monospace',
        fontSize: '16px',
        borderRadius: '4px',
        zIndex: 9999,
        ...style,
      }}
    >
      FPS: {fps}
    </div>
  );
}
