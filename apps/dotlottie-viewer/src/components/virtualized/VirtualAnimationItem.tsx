import { useCallback, useRef } from 'react';

export interface VirtualAnimationItemProps {
  index: number;
  animationUrl: string;
  onRegisterCanvas: (index: number, canvas: HTMLCanvasElement | null, animationUrl: string) => void;
}

export const VirtualAnimationItem: React.FC<VirtualAnimationItemProps> = ({
  index,
  animationUrl,
  onRegisterCanvas,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const setCanvasRef = useCallback(
    (canvas: HTMLCanvasElement | null) => {
      canvasRef.current = canvas;
      onRegisterCanvas(index, canvas, animationUrl);
    },
    [index, animationUrl, onRegisterCanvas],
  );

  return (
    <div className="h-[200px] p-2.5 border border-gray-700 bg-gray-900 rounded">
      <div className="mb-1 font-mono text-xs text-gray-500">
        #{index + 1} | {animationUrl.split('/').pop()?.slice(0, 20)}...
      </div>
      <canvas ref={setCanvasRef} className="w-full h-[calc(100%-25px)] bg-black rounded-sm" />
    </div>
  );
};
