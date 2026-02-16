import type { DotLottie } from '@lottiefiles/dotlottie-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import InputLabel from './form/input-label';

interface SlotControllerProps {
  dotLottie: DotLottie | null;
}

interface SlotInfo {
  id: string;
  type: string;
}

// Collapsible section component
function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden border rounded-lg border-subtle">
      <button
        className="flex items-center justify-between w-full p-3 transition-colors bg-subtle hover:bg-subtle/60"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-bold">{title}</span>
        {isOpen ? <IoChevronUp /> : <IoChevronDown />}
      </button>
      {isOpen && <div className="flex flex-col gap-3 p-3 bg-white">{children}</div>}
    </div>
  );
}

// Color slot input component
function ColorSlotInput({ slotId, dotLottie }: { slotId: string; dotLottie: DotLottie }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    const slotValue = dotLottie.getSlot(slotId) as { k?: number[] } | undefined;
    if (slotValue?.k && Array.isArray(slotValue.k) && slotValue.k.length >= 3) {
      // Convert RGBA (0-1) to hex
      const r = Math.round((slotValue.k[0] ?? 0) * 255);
      const g = Math.round((slotValue.k[1] ?? 0) * 255);
      const b = Math.round((slotValue.k[2] ?? 0) * 255);
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b
        .toString(16)
        .padStart(2, '0')}`;
      setColor(hex);
    }
  }, [dotLottie, slotId]);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    // Convert hex to RGBA (0-1)
    const hex = newColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    dotLottie.setColorSlot(slotId, [r, g, b, 1]);
  };

  const invertColor = (hex: string) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const rInv = (255 - r).toString(16).padStart(2, '0');
    const gInv = (255 - g).toString(16).padStart(2, '0');
    const bInv = (255 - b).toString(16).padStart(2, '0');
    return `#${rInv}${gInv}${bInv}`;
  };

  return (
    <InputLabel lablel={slotId}>
      <button
        onClick={() => inputRef.current?.click()}
        className="relative w-full p-1 border rounded-lg border-subtle bg-subtle h-9"
      >
        <div className="flex items-center justify-center h-full rounded-lg" style={{ backgroundColor: color }}>
          <span style={{ color: invertColor(color) }}>{color}</span>
        </div>
        <input
          ref={inputRef}
          type="color"
          className="absolute bottom-0 left-0 invisible"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
        />
      </button>
    </InputLabel>
  );
}

// Gradient slot input component (simplified: start and end colors)
function GradientSlotInput({ slotId, dotLottie }: { slotId: string; dotLottie: DotLottie }) {
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const [startColor, setStartColor] = useState('#000000');
  const [endColor, setEndColor] = useState('#ffffff');

  useEffect(() => {
    const slotValue = dotLottie.getSlot(slotId) as { k?: number[] } | undefined;
    // Gradient format: [offset, r, g, b, offset, r, g, b, ...]
    if (slotValue?.k && Array.isArray(slotValue.k) && slotValue.k.length >= 8) {
      // First color stop (offset, r, g, b)
      const r1 = Math.round((slotValue.k[1] ?? 0) * 255);
      const g1 = Math.round((slotValue.k[2] ?? 0) * 255);
      const b1 = Math.round((slotValue.k[3] ?? 0) * 255);
      setStartColor(
        `#${r1.toString(16).padStart(2, '0')}${g1.toString(16).padStart(2, '0')}${b1.toString(16).padStart(2, '0')}`,
      );

      // Second color stop
      const r2 = Math.round((slotValue.k[5] ?? 0) * 255);
      const g2 = Math.round((slotValue.k[6] ?? 0) * 255);
      const b2 = Math.round((slotValue.k[7] ?? 0) * 255);
      setEndColor(
        `#${r2.toString(16).padStart(2, '0')}${g2.toString(16).padStart(2, '0')}${b2.toString(16).padStart(2, '0')}`,
      );
    }
  }, [dotLottie, slotId]);

  const applyGradient = (start: string, end: string) => {
    const hexToRgb = (hex: string) => {
      hex = hex.replace('#', '');
      return [
        parseInt(hex.substring(0, 2), 16) / 255,
        parseInt(hex.substring(2, 4), 16) / 255,
        parseInt(hex.substring(4, 6), 16) / 255,
      ];
    };
    const [r1, g1, b1] = hexToRgb(start);
    const [r2, g2, b2] = hexToRgb(end);
    // Format: [offset, r, g, b, offset, r, g, b]
    dotLottie.setGradientSlot(slotId, [0, r1, g1, b1, 1, r2, g2, b2]);
  };

  return (
    <InputLabel lablel={slotId}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => startInputRef.current?.click()}
          className="flex-shrink-0 w-12 p-1 border rounded-lg border-subtle h-9"
          style={{ backgroundColor: startColor }}
        >
          <input
            ref={startInputRef}
            type="color"
            className="absolute invisible"
            value={startColor}
            onChange={(e) => {
              setStartColor(e.target.value);
              applyGradient(e.target.value, endColor);
            }}
          />
        </button>
        <div
          className="flex-grow h-6 rounded"
          style={{ background: `linear-gradient(to right, ${startColor}, ${endColor})` }}
        />
        <button
          onClick={() => endInputRef.current?.click()}
          className="flex-shrink-0 w-12 p-1 border rounded-lg border-subtle h-9"
          style={{ backgroundColor: endColor }}
        >
          <input
            ref={endInputRef}
            type="color"
            className="absolute invisible"
            value={endColor}
            onChange={(e) => {
              setEndColor(e.target.value);
              applyGradient(startColor, e.target.value);
            }}
          />
        </button>
      </div>
    </InputLabel>
  );
}

// Text slot input component (content only)
function TextSlotInput({ slotId, dotLottie }: { slotId: string; dotLottie: DotLottie }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const slotValue = dotLottie.getSlot(slotId) as { k?: Array<{ s?: { t?: string } }> } | undefined;
    if (slotValue?.k?.[0]?.s?.t) {
      setText(slotValue.k[0].s.t);
    }
  }, [dotLottie, slotId]);

  const handleChange = (newText: string) => {
    setText(newText);
    dotLottie.setTextSlot(slotId, { t: newText });
  };

  return (
    <InputLabel lablel={slotId}>
      <input
        type="text"
        className="w-full p-2 text-sm border rounded-lg border-subtle bg-subtle h-9"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter text..."
      />
    </InputLabel>
  );
}

// Vector slot input component
function VectorSlotInput({ slotId, dotLottie }: { slotId: string; dotLottie: DotLottie }) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const slotValue = dotLottie.getSlot(slotId) as { k?: number[] } | undefined;
    if (slotValue?.k && Array.isArray(slotValue.k) && slotValue.k.length >= 2) {
      setX(slotValue.k[0] ?? 0);
      setY(slotValue.k[1] ?? 0);
    }
  }, [dotLottie, slotId]);

  const handleChange = (newX: number, newY: number) => {
    setX(newX);
    setY(newY);
    dotLottie.setVectorSlot(slotId, [newX, newY]);
  };

  return (
    <InputLabel lablel={slotId}>
      <div className="flex gap-2">
        <div className="flex items-center flex-1 gap-1">
          <span className="text-xs text-secondary">X</span>
          <input
            type="number"
            className="w-full p-2 text-sm border rounded-lg border-subtle bg-subtle h-9"
            value={x}
            onChange={(e) => handleChange(parseFloat(e.target.value) || 0, y)}
          />
        </div>
        <div className="flex items-center flex-1 gap-1">
          <span className="text-xs text-secondary">Y</span>
          <input
            type="number"
            className="w-full p-2 text-sm border rounded-lg border-subtle bg-subtle h-9"
            value={y}
            onChange={(e) => handleChange(x, parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
    </InputLabel>
  );
}

// Scalar slot input component (single numeric value like rotation, opacity, stroke width)
function ScalarSlotInput({ slotId, dotLottie }: { slotId: string; dotLottie: DotLottie }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const slotValue = dotLottie.getSlot(slotId) as { k?: number } | undefined;
    if (slotValue?.k !== undefined && typeof slotValue.k === 'number') {
      setValue(slotValue.k);
    }
  }, [dotLottie, slotId]);

  const handleChange = (newValue: number) => {
    setValue(newValue);
    dotLottie.setScalarSlot(slotId, newValue);
  };

  return (
    <InputLabel lablel={slotId}>
      <input
        type="number"
        step="any"
        className="w-full p-2 text-sm border rounded-lg border-subtle bg-subtle h-9"
        value={value}
        onChange={(e) => handleChange(parseFloat(e.target.value) || 0)}
      />
    </InputLabel>
  );
}

export default function SlotController({ dotLottie }: SlotControllerProps) {
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const loadSlots = useCallback(() => {
    if (!dotLottie || !dotLottie.isLoaded) {
      setSlots([]);
      return;
    }

    try {
      const slotIds = dotLottie.getSlotIds();
      console.log('[SlotController] Found slot IDs:', slotIds);
      const slotInfos: SlotInfo[] = slotIds.map((id) => ({
        id,
        type: dotLottie.getSlotType(id) || 'unknown',
      }));
      console.log('[SlotController] Slot infos:', slotInfos);
      setSlots(slotInfos);
    } catch (error) {
      console.error('[SlotController] Error loading slots:', error);
    }
  }, [dotLottie]);

  useEffect(() => {
    if (!dotLottie) {
      console.log('[SlotController] No dotLottie instance');
      return;
    }

    console.log('[SlotController] dotLottie instance received, isLoaded:', dotLottie.isLoaded);

    // Load slots when animation loads
    const onLoad = () => {
      console.log('[SlotController] Animation loaded event fired');
      loadSlots();
    };
    dotLottie.addEventListener('load', onLoad);

    // Also load immediately if already loaded
    if (dotLottie.isLoaded) {
      console.log('[SlotController] Animation already loaded, loading slots immediately');
      loadSlots();
    }

    return () => {
      dotLottie.removeEventListener('load', onLoad);
    };
  }, [dotLottie, loadSlots]);

  const colorSlots = slots.filter((s) => s.type === 'color');
  const gradientSlots = slots.filter((s) => s.type === 'gradient');
  const textSlots = slots.filter((s) => s.type === 'text');
  const vectorSlots = slots.filter((s) => s.type === 'vector' || s.type === 'position');
  const scalarSlots = slots.filter((s) => s.type === 'scalar');

  const hasSlots = slots.length > 0;

  // Only show if we have a dotLottie instance and slots to display
  if (!dotLottie) {
    return null;
  }

  if (!hasSlots) {
    return null;
  }

  return (
    <div className="bg-white border rounded-lg border-subtle">
      <button
        className="flex items-center justify-between w-full p-3 text-white transition-colors rounded-t-lg bg-lottie hover:bg-lottie/90"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-sm font-bold">Slot Controls ({slots.length})</span>
        {isExpanded ? <IoChevronUp /> : <IoChevronDown />}
      </button>
      {isExpanded && (
        <div className="flex flex-col gap-3 p-3 border-t border-subtle">
          {colorSlots.length > 0 && (
            <CollapsibleSection title={`Colors (${colorSlots.length})`}>
              {colorSlots.map((slot) => (
                <ColorSlotInput key={slot.id} slotId={slot.id} dotLottie={dotLottie!} />
              ))}
            </CollapsibleSection>
          )}

          {gradientSlots.length > 0 && (
            <CollapsibleSection title={`Gradients (${gradientSlots.length})`}>
              {gradientSlots.map((slot) => (
                <GradientSlotInput key={slot.id} slotId={slot.id} dotLottie={dotLottie!} />
              ))}
            </CollapsibleSection>
          )}

          {textSlots.length > 0 && (
            <CollapsibleSection title={`Text (${textSlots.length})`}>
              {textSlots.map((slot) => (
                <TextSlotInput key={slot.id} slotId={slot.id} dotLottie={dotLottie!} />
              ))}
            </CollapsibleSection>
          )}

          {vectorSlots.length > 0 && (
            <CollapsibleSection title={`Vectors (${vectorSlots.length})`}>
              {vectorSlots.map((slot) => (
                <VectorSlotInput key={slot.id} slotId={slot.id} dotLottie={dotLottie!} />
              ))}
            </CollapsibleSection>
          )}

          {scalarSlots.length > 0 && (
            <CollapsibleSection title={`Scalars (${scalarSlots.length})`}>
              {scalarSlots.map((slot) => (
                <ScalarSlotInput key={slot.id} slotId={slot.id} dotLottie={dotLottie!} />
              ))}
            </CollapsibleSection>
          )}
        </div>
      )}
    </div>
  );
}
