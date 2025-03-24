import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Play, Repeat, Globe } from 'lucide-react';

interface StateNodeProps {
  data: {
    label: string;
    type: string;
    autoplay?: boolean;
    loop?: boolean;
    isActive?: boolean;
  };
}

export default memo(function StateNode({ data }: StateNodeProps) {
  const isGlobal = data.type === 'GlobalState';

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md border-2 ${
        isGlobal ? 'bg-purple-50 border-purple-500' : 'bg-blue-50 border-blue-500'
      }`}
    >
      {data.isActive && (
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" />
      )}
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center gap-2">
        {isGlobal ? (
          <Globe className="w-4 h-4 text-purple-600" />
        ) : (
          <div className="flex gap-1">
            {data.autoplay && <Play className="w-4 h-4 text-blue-600" />}
            {data.loop && <Repeat className="w-4 h-4 text-blue-600" />}
          </div>
        )}
        <span className="font-medium text-sm">{data.label}</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});
