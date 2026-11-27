"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

const AUTOPLAY_MS = 6000;

interface Slide {
  key: string;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  ctaLabel: string;
  href: string;
  tag: string;
  tagSub: string;
  accent: string;
  dot: string;
  panel: string;
  ring: string;
  blob: string;
  glow: string;
}

const SLIDES: Slide[] = [
  {
    key: "pure",
    eyebrow: "خط تولید رولچی",
    title: "توتون خالص،",
    highlight: "بدون مواد نگهدارنده و افزودنی",
    description:
      "فقط برگ توتون دست‌چین و خشک‌شده، آماده‌ی رول‌کردن؛ همان‌طور که از دل شهر می‌آید.",
    ctaLabel: "توتون‌های خالص",
    href: "/products",
    tag: "۱۰۰٪ خالص",
    tagSub: "NO FLAVOUR",
    accent: "text-splash-lime",
    dot: "bg-splash-lime",
    panel: "from-brand-500/30 via-ink-900 to-ink-900",
    ring: "from-brand-500 via-splash-orange to-splash-yellow",
    blob: "bg-splash-lime/40",
    glow: "bg-brand-500/25",
  },
  {
    key: "roll",
    eyebrow: "سیگار خودتو رول کن",
    title: "سیگارت رو",
    highlight: "خودت رول کن",
    description:
      "کاغذ رول نازک، فیلتر و چرخ رول؛ همه‌چیز برای رولی که دقیقاً اندازه‌ی دست خودت باشد.",
    ctaLabel: "لوازم رول‌کردن",
    href: "/categories",
    tag: "دست‌ساز",
    tagSub: "HAND ROLLED",
    accent: "text-splash-cyan",
    dot: "bg-splash-cyan",
    panel: "from-splash-violet/30 via-ink-900 to-ink-900",
    ring: "from-splash-cyan via-splash-violet to-brand-500",
    blob: "bg-splash-cyan/40",
    glow: "bg-splash-violet/30",
  },
  {
    key: "city",
    eyebrow: "از دل شهر",
    title: "طعم خیابون،",
    highlight: "توی جیب تو",
    description:
      "رولچی از یک مغازه‌ی کوچک در شهر شروع شد؛ سفارش‌ها با پیک رولچی و بسته‌بندی ساده به دستت می‌رسد.",
    ctaLabel: "ورود به فروشگاه",
    href: "/products",
    tag: "پیک همون روز",
    tagSub: "ROLLCHI DELIVERY",
    accent: "text-splash-yellow",
    dot: "bg-splash-yellow",
    panel: "from-splash-cyan/25 via-ink-900 to-ink-900",
    ring: "from-splash-yellow via-splash-orange to-brand-500",
    blob: "bg-splash-orange/40",
    glow: "bg-splash-cyan/25",
  },
];


export function SplashSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((direction: number) => {
    setIndex((current) => (current + direction + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused]);

  const slide = SLIDES[index];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="ویترین رولچی"
      className="container-page mt-14"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-ink-900 shadow-2xl shadow-black/60">
        {SLIDES.map((item, itemIndex) => (
          <div
            key={item.key}
            aria-hidden
            className={cn(
              "absolute inset-0 bg-gradient-to-l transition-opacity duration-700",
              item.panel,
              itemIndex === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        <div className="splash-field absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/25 to-transparent" />

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -bottom-24 -start-16 h-56 w-56 rounded-full opacity-70 blur-2xl transition-colors duration-700",
            slide.glow,
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -top-16 end-10 h-32 w-32 rounded-full opacity-70 blur-xl transition-colors duration-700",
            slide.blob,
          )}
        />

        <div className="relative h-[31rem] sm:h-[27rem] lg:h-[26rem]">
          {SLIDES.map((item, itemIndex) => {
            const isActive = itemIndex === index;
            return (
              <article
                key={item.key}
                aria-hidden={!isActive}
                className="absolute inset-0 grid items-center gap-8 p-6 transition-[opacity,transform] duration-500 ease-out sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-12"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translateX(0) scale(1)"
                    : `translateX(${itemIndex < index ? "28px" : "-28px"}) scale(0.985)`,
                  pointerEvents: isActive ? "auto" : "none",
                  zIndex: isActive ? 20 : 10,
                }}
              >
                <div className="slider-rise">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-stone-500 backdrop-blur">
                    <span className={cn("h-1.5 w-1.5 rounded-full", item.dot)} />
                    {item.eyebrow}
                  </span>
                  <h2 className="font-display mt-5 text-3xl leading-[1.45] text-white sm:text-4xl sm:leading-[1.35] lg:text-5xl">
                    {item.title}
                    <span className={cn("block", item.accent)}>{item.highlight}</span>
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-7 text-stone-400">
                    {item.description}
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link href={item.href} className={buttonStyles({ size: "md" })}>
                      {item.ctaLabel}
                      <span aria-hidden>←</span>
                    </Link>
                    <Link
                      href="/categories"
                      className={buttonStyles({
                        variant: "outline",
                        size: "md",
                        className: "border-white/15 bg-white/5 text-white hover:bg-white/10",
                      })}
                    >
                      همه دسته‌بندی‌ها
                    </Link>
                  </div>
                </div>

                <div className="relative mx-auto hidden h-52 w-52 items-center justify-center sm:flex lg:h-64 lg:w-64">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  >
                    <span className="font-display text-[11rem] leading-none text-white/[0.05]">
                      {formatNumber(itemIndex + 1)}
                    </span>
                  </span>

                  <div className="relative flex h-full w-full items-center justify-center rounded-full">
                    <span
                      className={cn(
                        "slider-orbit absolute inset-0 rounded-full bg-gradient-to-br opacity-85",
                        item.ring,
                      )}
                    />
                    <span className="absolute inset-[7px] rounded-full bg-ink-950" />
                    <span className="absolute inset-[-16px] rounded-full border border-dashed border-white/15" />
                    <span className="relative h-[8.5rem] w-[8.5rem] overflow-hidden rounded-full ring-1 ring-white/20 lg:h-40 lg:w-40">
                      <Image
                        src="/rollchi-logo.webp"
                        alt="لوگوی رولچی"
                        width={320}
                        height={320}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="absolute -bottom-2 -start-3 -rotate-6 rounded-2xl border border-white/15 bg-ink-800/90 px-4 py-2 text-center shadow-xl shadow-black/60 backdrop-blur">
                      <span className={cn("block font-display text-base", item.accent)}>
                        {item.tag}
                      </span>
                      <span className="block text-[9px] tracking-[0.18em] text-stone-500">
                        {item.tagSub}
                      </span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="relative z-40 flex items-center justify-between gap-4 border-t border-white/10 bg-ink-950/60 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="اسلاید قبلی"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-stone-500 transition hover:border-brand-400/60 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="اسلاید بعدی"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-stone-500 transition hover:border-brand-400/60 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-display text-sm text-white">
              {formatNumber(index + 1)}
              <span className="text-stone-400"> / {formatNumber(SLIDES.length)}</span>
            </span>
            <div className="relative hidden h-1 w-32 overflow-hidden rounded-full bg-white/10 sm:block lg:w-44">
              <span
                key={`bar-${index}`}
                className="slider-progress absolute inset-y-0 start-0 w-full rounded-full bg-gradient-to-l from-brand-500 via-splash-orange to-splash-yellow"
                style={{ animationPlayState: paused ? "paused" : "running" }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {SLIDES.map((item, itemIndex) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setIndex(itemIndex)}
                aria-label={`اسلاید ${formatNumber(itemIndex + 1)}`}
                aria-current={itemIndex === index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  itemIndex === index
                    ? "w-8 bg-brand-400 shadow-[0_0_12px_2px_rgba(255,45,111,0.45)]"
                    : "w-2 bg-white/25 hover:bg-white/50",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
