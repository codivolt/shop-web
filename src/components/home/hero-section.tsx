import Image from "next/image";
import Link from "next/link";

import { ProductImage } from "@/components/product/product-image";
import { buttonStyles } from "@/components/ui/button";
import { formatNumber, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

interface HeroSectionProps {
  productCount: number;
  categoryCount: number;
  featured?: Product;
  related: Product[];
}

export function HeroSection({
  productCount,
  categoryCount,
  featured,
  related,
}: HeroSectionProps) {
  return (
    <section className="relative bg-ink-950 overflow-hidden text-white">
      <div className="absolute inset-0 hero-grid opacity-40" />
      <div className="absolute inset-0 splash-field" />
      <div className="bottom-0 absolute inset-x-0 bg-gradient-to-l from-transparent via-white/15 to-transparent h-px" />

      <div className="relative items-center gap-10 grid lg:grid-cols-[1.05fr_0.95fr] py-12 sm:py-16 lg:py-18 container-page">
        <div>
          <span className="inline-flex items-center gap-2 bg-white/5 backdrop-blur px-3 py-1.5 border border-white/10 rounded-full font-semibold text-[11px] text-stone-500">
            <span className="bg-splash-yellow rounded-full w-1.5 h-1.5" />
            توتون سیگار خیابونی، از دل شهر
          </span>
          <h1 className="mt-6 max-w-xl font-display text-4xl sm:text-5xl leading-[1.45] sm:leading-[1.35]">
            رولچی،
            <span className="block text-splash">سیگار خودتو رول کن</span>
          </h1>
          <p className="mt-5 max-w-lg text-stone-400 text-sm sm:text-base leading-7 sm:leading-8">
            توتون دست‌چین، کاغذ و فیلتر رول و لوازم رول‌کردن؛ همه‌چیز برای اینکه
            سیگارت رو خودت رول کنی. طعم خیابون، توی جیب تو.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8">
            <Link href="/products" className={buttonStyles({ size: "lg" })}>
              ورود به فروشگاه
              <span aria-hidden>←</span>
            </Link>
            <Link
              href="/categories"
              className={buttonStyles({
                variant: "outline",
                size: "lg",
                className: "border-white/15 bg-white/5 text-white hover:bg-white/10",
              })}
            >
              دسته‌بندی محصولات
            </Link>
          </div>

          <dl className="gap-4 grid grid-cols-3 mt-10 pt-6 border-white/10 border-t max-w-md">
            <div>
              <dt className="text-[11px] text-stone-500">محصولات فعال</dt>
              <dd className="mt-1 font-black text-white text-xl">
                {formatNumber(productCount)}
                <span className="ms-1 font-medium text-stone-500 text-xs">عدد</span>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-stone-500">دسته‌بندی</dt>
              <dd className="mt-1 font-black text-white text-xl">
                {formatNumber(categoryCount)}
                <span className="ms-1 font-medium text-stone-500 text-xs">گروه</span>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-stone-500">رضایت رول‌کن‌ها</dt>
              <dd className="mt-1 font-black text-splash-yellow text-xl">
                ۹۸٪
                <span className="ms-1 font-medium text-stone-500 text-xs">مثبت</span>
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative mx-auto w-full lg:max-w-none max-w-md">
          <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-[2rem] -rotate-3" />
          <div className="relative bg-ink-900/85 shadow-2xl shadow-black/60 backdrop-blur p-5 border border-white/10 rounded-[2rem] overflow-hidden">
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex justify-center items-center rounded-full ring-1 ring-white/15 w-10 h-10 overflow-hidden">
                  <Image
                    src="/rollchi-logo.webp"
                    alt="لوگوی رولچی"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </span>
                <div className="leading-tight">
                  <p className="font-display text-white text-base">رولچی</p>
                  <p className="text-[9px] text-stone-500 tracking-[0.22em]">ROLL YOUR OWN</p>
                </div>
              </div>
              <span className="bg-brand-500/15 px-3 py-1 rounded-full font-bold text-[11px] text-brand-300">
                پیشنهاد این هفته
              </span>
            </div>

            {featured ? (
              <div>
                <Link
                  href={`/products/${featured.slug}`}
                  className="group flex gap-4 bg-white/5 hover:bg-white/10 mt-4 p-4 border border-white/5 hover:border-brand-400/30 rounded-2xl transition"
                >
                  <div className="relative bg-ink-800 rounded-xl w-28 h-28 overflow-hidden shrink-0">
                    <ProductImage
                      src={featured.imageUrl}
                      alt={featured.name}
                      sizes="112px"
                      className="group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-white text-sm line-clamp-2">
                      {featured.name}
                    </h2>
                    <p className="mt-1 text-stone-400 text-xs">
                      {featured.category?.name ?? "منتخب رولچی"}
                    </p>
                    <p className="mt-3 font-black text-brand-300 text-base">
                      {formatPrice(featured.price)}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-3 font-semibold text-[11px] text-stone-500">
                      مشاهده جزئیات
                      <span aria-hidden>←</span>
                    </span>
                  </div>
                </Link>

                <div className="gap-3 grid grid-cols-2 mt-4">
                  {related.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="bg-white/5 hover:bg-white/10 p-3 border border-white/10 hover:border-splash-cyan/40 rounded-xl transition"
                    >
                      <p className="font-semibold text-stone-500 text-xs line-clamp-1">
                        {product.name}
                      </p>
                      <p className="mt-1.5 font-bold text-splash-yellow text-xs">
                        {formatPrice(product.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 p-8 border border-white/15 border-dashed rounded-xl text-center">
                <p className="font-bold text-white text-sm">کاتالوگ در حال تکمیل است</p>
                <p className="mt-2 text-stone-400 text-xs leading-6">
                  به‌زودی محصولات تازه رولچی در این بخش نمایش داده می‌شوند.
                </p>
                <Link
                  href="/products"
                  className={buttonStyles({ size: "sm", className: "mt-4" })}
                >
                  مشاهده فروشگاه
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}