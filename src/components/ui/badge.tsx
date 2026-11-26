import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const tones: Record<BadgeTone, string> = {
  neutral: "bg-white/10 text-stone-700 ring-white/15",
  brand: "bg-brand-500/15 text-brand-300 ring-brand-400/30",
  success: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  warning: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  danger: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
  info: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface StatusBadgeProps {
  label: string;
  className?: string;
}

export function StatusBadge({
  label,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
