/**
 * Copyright 2023 Design Barn Inc.
 */

import { useRef } from 'react';

interface ColorInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

function invert(hex: string) {
  hex = hex.replace('#', '');
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Invert each component by subtracting from 255
  const rInv = (255 - r).toString(16).padStart(2, '0');
  const gInv = (255 - g).toString(16).padStart(2, '0');
  const bInv = (255 - b).toString(16).padStart(2, '0');
  // Concatenate the inverted components and return
  return `#${rInv}${gInv}${bInv}`;
}

const ColorInput: React.FC<ColorInputProps> = ({ className = '', onChange, value, ...props }) => {
  const input = useRef<HTMLInputElement>(null);

  return (
    <button
      onClick={() => {
        input.current?.click();
      }}
      className={`border relative border-subtle rounded-lg bg-subtle w-full p-1 h-9 ${className}`}
      {...props}
    >
      <div
        className={`rounded-lg`}
        style={{
          backgroundColor: value,
        }}
      >
        <span
          style={{
            color: invert(value),
          }}
        >
          {value}
        </span>
      </div>
      <input
        onChange={(event) => onChange(event.target.value)}
        ref={input}
        type="color"
        className="invisible absolute left-0 bottom-0"
        defaultValue={value}
      />
    </button>
  );
};

export default ColorInput;
