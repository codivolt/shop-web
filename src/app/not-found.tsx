import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-10 text-center shadow-xl shadow-stone-900/5">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl font-black text-brand-800">
          ۴۰۴
        </span>
        <h1 className="mt-5 text-xl font-black text-stone-900">صفحه پیدا نشد</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          آدرسی که وارد کرده‌اید وجود ندارد یا محصول موردنظر حذف شده است.
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
  );
}
