import * as React from "react";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  "aria-label"?: string;
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  "aria-label": ariaLabel,
}: SliderProps) {
  const currentValue = value[0] ?? min;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={currentValue}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      aria-label={ariaLabel}
      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
    />
  );
}
