import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "dark";

type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-l from-brand-500 via-brand-400 to-splash-orange text-ink-950 shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/35 hover:brightness-110",
  secondary:
    "bg-brand-50 text-brand-300 ring-1 ring-inset ring-brand-200 hover:bg-brand-100 hover:text-brand-200",
  outline:
    "border border-white/12 bg-white/5 text-stone-700 hover:border-white/25 hover:bg-white/10 hover:text-white",
  ghost: "text-stone-500 hover:bg-white/5 hover:text-white",
  danger:
    "bg-rose-600 text-white shadow-lg shadow-rose-900/40 hover:bg-rose-500",
  dark: "bg-ink-700 text-white ring-1 ring-inset ring-white/10 hover:bg-ink-600",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
  icon: "h-10 w-10",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    variants[variant],
    sizes[size],
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading, children, disabled, type, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type ?? "button"}
      disabled={disabled || loading}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
