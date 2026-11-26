import Image from "next/image";
import Link from "next/link";

import { SITE } from "@/lib/site";

function SplashCluster() {
  return (
    <span aria-hidden className="splash-cluster">
      <span className="bg-splash-cyan" />
      <span className="bg-splash-yellow" />
      <span className="bg-brand-500" />
      <span className="bg-splash-lime" />
      <span className="bg-splash-violet" />
    </span>
  );
}

export function BrandStrip() {
  return (
    <section
      aria-label="رولچی"
      className="relative overflow-hidden border-b border-white/10 bg-ink-950"
    >
      <div className="splash-field absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand-400/50 to-transparent" />

      <div className="container-page relative flex flex-col items-center gap-5 py-8 sm:flex-row sm:justify-center sm:gap-7">
        <Link href="/" className="group flex items-center gap-4">
          <span className="relative flex h-20 w-20 items-center justify-center">
            <span
              aria-hidden
              className="brand-strip-orbit absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#ff2d6f,#ff8a3d,#ffd43b,#b6f24a,#22d3ee,#a855f7,#ff2d6f)] opacity-80 blur-[1px]"
            />
            <span className="absolute inset-[3px] rounded-full bg-ink-950" />
            <span className="relative flex h-[4.25rem] w-[4.25rem] overflow-hidden rounded-full ring-1 ring-white/15 transition duration-500 group-hover:scale-105">
              <Image
                src="/rollchi-logo.webp"
                alt="لوگوی رولچی"
                width={272}
                height={272}
                className="h-full w-full object-cover"
              />
            </span>
          </span>

          <span className="flex flex-col items-center leading-none sm:items-start">
            <span className="font-display text-4xl text-white transition-colors group-hover:text-brand-300">
              {SITE.name}
            </span>
            <span className="mt-2 text-[10px] tracking-[0.32em] text-stone-500">
              ROLL YOUR OWN
            </span>
          </span>
        </Link>

        <span aria-hidden className="hidden h-12 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent sm:block" />

        <div className="flex items-center gap-3">
          <SplashCluster />
          <p className="text-center text-xs leading-6 text-stone-500 sm:text-start">
            بدون مواد نگهدارنده و افزودنی
            <span className="mx-2 text-stone-300">·</span>
            <span className="text-stone-400">از دل شهر، تا در خونه‌ت</span>
          </p>
          <SplashCluster />
        </div>
      </div>
    </section>
  );
}
