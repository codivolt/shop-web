"use client";

import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const buttonClass =
    "flex items-center justify-center text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div
      className={cn(
        "inline-flex items-center overflow-hidden rounded-xl border border-stone-200 bg-white",
        size === "sm" ? "h-9" : "h-11",
        disabled && "opacity-60",
      )}
    >
      <button
        type="button"
        aria-label="افزایش تعداد"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(buttonClass, size === "sm" ? "h-9 w-9" : "h-11 w-11")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <span
        className={cn(
          "min-w-8 text-center text-sm font-bold text-stone-800 tabular-nums",
          size === "sm" ? "px-1" : "px-2",
        )}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="کاهش تعداد"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(buttonClass, size === "sm" ? "h-9 w-9" : "h-11 w-11")}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
