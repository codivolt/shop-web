import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export function JoinSection() {
  return (
    <section className="mt-10 container-page">
      <div className="relative bg-gradient-to-l from-brand-500/15 via-ink-900 to-ink-900 p-8 sm:p-10 border border-brand-500/30 rounded-3xl overflow-hidden">
        <div className="top-0 absolute inset-x-0 opacity-70 splash-rule" />
        <div className="flex sm:flex-row flex-col justify-between items-center gap-6">
          <div>
            <h2 className="font-display text-white text-2xl sm:text-3xl">
              عضو خانواده رولچی شو
            </h2>
            <p className="mt-2 max-w-md text-stone-400 text-sm leading-6">
              با ورود به حساب کاربری، سفارش‌ها را پیگیری کن و خریدهای بعدی را
              سریع‌تر انجام بده.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className={buttonStyles({ size: "lg" })}>
              ورود به حساب
            </Link>
            <Link
              href="/products"
              className={buttonStyles({ variant: "outline", size: "lg" })}
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}