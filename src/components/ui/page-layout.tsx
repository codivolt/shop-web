"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { buttonStyles } from "@/components/ui/button";

export interface PageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actionLabel?: string;
  actionHref?: string;
  actionVariant?: "primary" | "outline" | "ghost";
  actionSize?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
  eyebrow?: string;
}

export function PageLayout({
  title,
  description,
  breadcrumbs,
  actionLabel,
  actionHref,
  actionVariant = "primary",
  actionSize = "md",
  className,
  children,
  eyebrow,
}: PageLayoutProps) {
  return (
    <div className={cn("container-page py-6", className)}>
      {breadcrumbs ? (
        <nav
          aria-label="مسیر صفحه"
          className="mb-4 flex flex-wrap items-center gap-2 text-xs text-stone-500"
        >
          {breadcrumbs.map((item, index) => (
            <span key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="text-stone-300">/</span>
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
      ) : null}

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          {eyebrow ? (
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-splash-yellow" />
              {eyebrow}
            </span>
          ) : null}
          <h1 className="font-display text-3xl leading-[1.4] text-white sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
          ) : null}
        </div>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className={buttonStyles({
              variant: actionVariant,
              size: actionSize,
              className: "group inline-flex items-center gap-1.5",
            })}
          >
            {actionLabel}
            <span className="transition group-hover:-translate-x-1">←</span>
          </Link>
        ) : null}
      </div>

      {children}
    </div>
  );
}

export interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  headerAction?: ReactNode;
}

export function SectionCard({
  title,
  description,
  children,
  className,
  footer,
  headerAction,
}: SectionCardProps) {
  return (
    <section className={cn("rounded-3xl border border-white/10 bg-ink-800 p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-black text-stone-900">{title}</h2>
        {headerAction}
      </div>
      {description ? <p className="mt-2 text-sm text-stone-500">{description}</p> : null}
      <div className="mt-4">{children}</div>
      {footer && <div className="mt-5 border-t border-stone-100 pt-4">{footer}</div>}
    </section>
  );
}

export interface InfoCardProps {
  label: string;
  value: ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
}

export function InfoCard({ label, value, className, trend, icon }: InfoCardProps) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-ink-800 p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-stone-500">{label}</span>
        {icon && <span className="text-stone-400">{icon}</span>}
      </div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <span className="text-xl font-black text-stone-900">{value}</span>
        {trend !== "neutral" && (
          <span className={cn("text-xs font-bold", trend === "up" ? "text-emerald-300" : "text-rose-300")}>
            {trend === "up" ? "↑" : "↓"}
          </span>
        )}
      </div>
    </div>
  );
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  iconColor = "text-brand-300",
  iconBg = "bg-brand-500/15",
  className,
  actionLabel,
  actionHref,
}: FeatureCardProps) {
  return (
    <div className={cn("flex items-start gap-3 rounded-2xl p-3 transition hover:bg-stone-50", className)}>
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm font-bold text-stone-800">{title}</p>
        <p className="mt-1 text-xs leading-5 text-stone-500">{description}</p>
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-300 hover:underline"
          >
            {actionLabel}
            <span aria-hidden>←</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon?: ReactNode;
  iconBg?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  description,
  icon,
  iconBg = "bg-brand-50",
  iconColor = "text-brand-700",
  className,
}: StatCardProps) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-ink-800 p-4 transition hover:border-brand-400/40 hover:shadow-sm", className)}>
      {icon && (
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      )}
      <div className="mt-3">
        <p className="text-[11px] text-stone-400">{label}</p>
        <p className="mt-1 flex items-baseline gap-1 font-black text-xl text-stone-900">
          {value}
          {unit && <span className="text-xs font-medium text-stone-400">{unit}</span>}
        </p>
        {description && <p className="mt-1 text-[10px] leading-4 text-stone-400">{description}</p>}
      </div>
    </div>
  );
}