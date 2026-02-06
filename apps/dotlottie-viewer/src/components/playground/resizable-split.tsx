import { useCallback, useEffect, useRef, useState } from 'react';

interface ResizableSplitProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initialLeftPercent?: number;
  minLeftPercent?: number;
  maxLeftPercent?: number;
}

export const ResizableSplit: React.FC<ResizableSplitProps> = ({
  left,
  right,
  initialLeftPercent = 50,
  minLeftPercent = 20,
  maxLeftPercent = 80,
}) => {
  const [leftPercent, setLeftPercent] = useState(initialLeftPercent);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = (x / rect.width) * 100;

      // Clamp between min and max
      const clamped = Math.min(maxLeftPercent, Math.max(minLeftPercent, percent));
      setLeftPercent(clamped);
    },
    [isDragging, minLeftPercent, maxLeftPercent],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="flex h-full w-full relative">
      {/* Overlay to capture mouse events during drag (prevents iframe from stealing events) */}
      {isDragging && <div className="absolute inset-0 z-50" />}

      {/* Left panel */}
      <div style={{ width: `calc(${leftPercent}% - 4px)` }} className="min-w-0 h-full overflow-hidden flex-shrink-0">
        {left}
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`w-2 h-full cursor-col-resize flex-shrink-0 transition-colors hover:bg-lottie/50 ${
          isDragging ? 'bg-lottie' : 'bg-subtle dark:bg-dark-border'
        }`}
      />

      {/* Right panel */}
      <div className="flex-1 min-w-0 h-full overflow-hidden">{right}</div>
    </div>
  );
};
