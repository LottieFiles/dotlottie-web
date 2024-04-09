/**
 * Copyright 2023 Design Barn Inc.
 */

import { Range, getTrackBackground } from 'react-range';

interface StepSelect {
  className?: string;
  values: number[];
  min: number;
  max: number;
  allowOverlap?: boolean;
  step: number;
  onChange: (values: number[]) => void;
}

const StepSelect: React.FC<StepSelect> = ({
  className = '',
  min,
  max,
  step = 1,
  allowOverlap = false,
  values,
  onChange,
  ...props
}) => {
  return (
    <div className={`flex gap-1 h-9 w-full ${className}`} {...props}>
      <div className="flex items-center justify-center rounded-lg bg-subtle text-xs border border-subtle w-16 p-1 text-secondary">
        {values.join(' - ')}
      </div>
      <Range
        min={min}
        max={max}
        step={step}
        allowOverlap={allowOverlap}
        values={values}
        onChange={(values) => {
          onChange(values);
        }}
        renderTrack={({ props, children }) => (
          <div
            className="flex-grow flex bg-subtle border border-subtle overflow-hidden rounded-lg"
            onMouseDown={(event) => {
              props.onMouseDown(event);
            }}
            onTouchStart={(event) => {
              props.onTouchStart(event);
            }}
            style={{
              ...props.style,
            }}
          >
            <div
              ref={props.ref}
              style={{
                background: getTrackBackground({
                  values: values,
                  colors: values.length === 2 ? ['#F3F6F8', '#80cec8', '#F3F6F8'] : ['#80cec8', '#F3F6F8'],
                  min,
                  max,
                }),
              }}
              className="self-center w-full h-full"
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="rounded-lg border border-subtle h-full w-5 bg-white hover:bg-hover"
            style={{
              ...props.style,
            }}
          />
        )}
      />
    </div>
  );
};

export default StepSelect;
