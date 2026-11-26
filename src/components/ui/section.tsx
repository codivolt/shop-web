import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-4",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-splash-yellow" />
            {eyebrow}
          </span>
        ) : null}
        <h2 className="font-display text-3xl leading-[1.4] text-white sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="group inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-stone-500 transition hover:border-brand-400/50 hover:text-white"
        >
          {actionLabel}
          <span className="transition group-hover:-translate-x-1">←</span>
        </Link>
      ) : null}
    </div>
  );
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav
      aria-label="مسیر صفحه"
      className={cn(
        "flex flex-wrap items-center gap-2 text-xs text-stone-500",
        className,
      )}
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden className="text-stone-300">
              /
            </span>
          ) : null}
          {item.href ? (
            <Link href={item.href} className="transition hover:text-brand-300">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-stone-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function InfoRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-3 last:border-none">
      <span className="text-sm text-stone-500">{label}</span>
      <span className="text-sm font-bold text-stone-800">
        {value ?? children}
      </span>
    </div>
  );
}
