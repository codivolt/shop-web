import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-ink-800 p-10 text-center shadow-xl shadow-black/60">
        <div className="splash-field absolute inset-0 opacity-70" />
        <div className="relative">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-2xl font-black text-brand-300 ring-1 ring-inset ring-brand-400/30">
            ۴۰۴
          </span>
          <h1 className="font-display mt-5 text-2xl text-white">
            این صفحه رول نشد!
          </h1>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            این آدرس توی رولچی وجود نداره یا محصول موردنظر حذف شده است.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
            <Link href="/" className={buttonStyles({ size: "md" })}>
              بازگشت به خانه
            </Link>
            <Link
              href="/products"
              className={buttonStyles({ variant: "outline", size: "md" })}
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
