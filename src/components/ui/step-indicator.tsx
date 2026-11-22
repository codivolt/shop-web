"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface Step {
  label: string;
  description?: string;
  icon?: ReactNode;
  completed?: boolean;
  active?: boolean;
  disabled?: boolean;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
  showNumbers?: boolean;
  connector?: boolean;
}

export function StepIndicator({
  steps,
  currentStep,
  orientation = "horizontal",
  className,
  showNumbers = true,
  connector = true,
}: StepIndicatorProps) {
  if (orientation === "vertical") {
    return (
      <ol className={cn("space-y-6", className)}>
        {steps.map((step, index) => (
          <li key={step.label} className="relative flex gap-4">
            {connector && index < steps.length - 1 && (
              <div className="absolute top-7 left-3.5 h-full w-1 bg-stone-200" aria-hidden />
            )}
            <div
              className={cn(
                "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                step.completed
                  ? "bg-brand-700 border-brand-700 text-white"
                  : step.active
                    ? "bg-brand-700 border-brand-700 text-white ring-4 ring-brand-500/20"
                    : "bg-white border-stone-200 text-stone-400",
              )}
            >
              {step.completed ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : showNumbers ? (
                <span className="text-xs font-black">{index + 1}</span>
              ) : (
                <span className="h-2 w-2 rounded-full bg-current" />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <p className={cn("text-sm font-bold transition-colors", step.active || step.completed ? "text-stone-900" : "text-stone-600")}>
                {step.label}
              </p>
              {step.description && (
                <p className="mt-1 text-xs text-stone-400">{step.description}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className={cn("flex items-center gap-4", className)}>
      {steps.map((step, index) => (
        <li key={step.label} className="relative flex flex-col items-center">
          {connector && index < steps.length - 1 && (
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 h-1 w-full bg-stone-200 z-[-1]" aria-hidden />
          )}
          <div
            className={cn(
              "relative flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
              step.completed
                ? "bg-brand-700 border-brand-700 text-white"
                : step.active
                  ? "bg-brand-700 border-brand-700 text-white ring-4 ring-brand-500/20"
                  : "bg-white border-stone-200 text-stone-400",
            )}
          >
            {step.completed ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : showNumbers ? (
              <span className="text-xs font-black">{index + 1}</span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-current" />
            )}
          </div>
          <div className="mt-2 w-32 text-center">
            <p className={cn("text-xs font-bold transition-colors", step.active || step.completed ? "text-stone-900" : "text-stone-600")}>
              {step.label}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export interface ProgressStepsProps {
  steps: Array<{ label: string; href?: string; completed?: boolean; active?: boolean }>;
  className?: string;
}

export function ProgressSteps({ steps, className }: ProgressStepsProps) {
  return (
    <nav aria-label="پیشرفت مراحل" className={cn("flex items-center gap-4", className)}>
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center gap-2">
          {index > 0 && <span className="flex-1 h-1 bg-stone-200" aria-hidden />}
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                step.completed
                  ? "bg-brand-700 border-brand-700 text-white"
                  : step.active
                    ? "bg-white border-brand-700 text-brand-700 ring-4 ring-brand-500/20"
                    : "bg-white border-stone-200 text-stone-400",
              )}
            >
              {step.completed ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="text-xs font-black">{index + 1}</span>
              )}
            </div>
            <span className={cn("text-[11px] font-bold", step.active ? "text-brand-800" : "text-stone-500")}>
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </nav>
  );
}