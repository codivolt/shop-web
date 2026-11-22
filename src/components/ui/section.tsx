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
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800 ring-1 ring-inset ring-brand-100">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {eyebrow}
          </span>
        ) : null}
        <h2 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
        ) : null}
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="group inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-brand-200 hover:text-brand-800"
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
            <Link href={item.href} className="transition hover:text-brand-800">
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
    <div className="flex items-center justify-between gap-4 border-b border-stone-100 py-3 last:border-none">
      <span className="text-sm text-stone-500">{label}</span>
      <span className="text-sm font-bold text-stone-800">
        {value ?? children}
      </span>
    </div>
  );
}
