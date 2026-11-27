import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { SPLASH_TONES, WHY_STEPS } from "@/lib/home-content";

export function WhySection() {
  return (
    <section className="mt-10 container-page">
      <div className="relative bg-ink-900 border border-white/10 rounded-3xl overflow-hidden text-white">
        <div className="absolute inset-0 opacity-80 splash-field" />
        <div className="relative lg:items-center gap-10 grid lg:grid-cols-2 p-8 sm:p-12">
          <div>
            <span className="font-bold text-[11px] text-splash-yellow tracking-wide">چرا رولچی؟</span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl leading-[1.4]">
              سیگارت رو خودت رول کن
            </h2>
            <p className="mt-4 max-w-lg text-stone-400 text-sm leading-7">
              رولچی از دل شهر شروع شد؛ با توتون تازه، بسته‌بندی ساده و قیمتی که
              به جیب بچه‌های شهر بخوره. هر سفارش قبل از ارسال بررسی می‌شود و با
              کد رهگیری به دستت می‌رسد.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link href="/products" className={buttonStyles({ size: "md" })}>
                شروع خرید
              </Link>
              <Link
                href="/orders"
                className={buttonStyles({
                  variant: "outline",
                  size: "md",
                  className: "border-white/15 bg-transparent text-white hover:bg-white/10",
                })}
              >
                پیگیری سفارش
              </Link>
            </div>
          </div>
          <ol className="space-y-3">
            {WHY_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4 bg-white/[0.04] backdrop-blur-sm p-4 border border-white/10 rounded-2xl">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ring-1 ring-inset ${SPLASH_TONES[index % SPLASH_TONES.length]}`}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="font-bold text-sm">{step.title}</p>
                  <p className="mt-1 text-stone-400 text-xs leading-5">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}