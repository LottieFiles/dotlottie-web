import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { useDotLottiePool } from '../../hooks/useDotLottiePool';
import { VirtualAnimationItem } from './VirtualAnimationItem';

export interface VirtualizedAnimationListProps {
  animations: string[];
  itemHeight?: number;
}

export const VirtualizedAnimationList: React.FC<VirtualizedAnimationListProps> = ({ animations, itemHeight = 220 }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: animations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 2,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const { registerCanvas, activeCount } = useDotLottiePool();

  return (
    <div>
      <div className="sticky top-0 z-10 p-4 font-mono text-sm border-b bg-gradient-to-b from-gray-950 via-gray-950 to-transparent border-gray-700">
        <div className="flex flex-wrap items-center gap-5">
          <span className="text-green-400">
            Active Instances: <strong>{activeCount}</strong>
          </span>
          <span className="text-gray-500">
            Visible: <strong>{virtualItems.length}</strong>
          </span>
          <span className="text-gray-600">
            Total: <strong>{animations.length}</strong>
          </span>
        </div>
      </div>

      <div ref={parentRef} className="h-[600px] overflow-auto border border-gray-600 rounded">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualItem) => (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <VirtualAnimationItem
                index={virtualItem.index}
                animationUrl={animations[virtualItem.index]}
                onRegisterCanvas={registerCanvas}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
