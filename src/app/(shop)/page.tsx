import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { SplashSlider } from "@/components/home/splash-slider";
import { ProductCard } from "@/components/product/product-card";
import { ProductImage } from "@/components/product/product-image";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section";
import { getBrands, getCategories, getProducts } from "@/lib/api/catalog";
import { formatNumber, formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

const FEATURES = [
  {
    title: "توتون اصل، نه تقلبی",
    description: "هر بسته توتون با ضمانت اصالت و تازگی ارسال می‌شود",
    tone: "bg-splash-cyan/15 text-splash-cyan",
    icon: (
      <path
        d="M12 3l7 3v5c0 4.4-2.9 8.2-7 9.5-4.1-1.3-7-5.1-7-9.5V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "پیک همون روز",
    description: "ارسال ۲۴ تا ۷۲ ساعته به سراسر کشور",
    tone: "bg-splash-orange/15 text-splash-orange",
    icon: (
      <>
        <path
          d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="17.5" r="1.5" fill="currentColor" />
        <circle cx="17" cy="17.5" r="1.5" fill="currentColor" />
      </>
    ),
  },
  {
    title: "تازه، هر هفته",
    description: "بار تازه توتون به‌صورت هفتگی به انبار رولچی می‌رسد",
    tone: "bg-splash-lime/15 text-splash-lime",
    icon: (
      <>
        <path
          d="M12 3c3.6 2.4 6.5 5.3 6.5 9a6.5 6.5 0 1 1-13 0C5.5 8.3 8.4 5.4 12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M12 9v5.5M9.5 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "پشتیبانی رولچی",
    description: "همراهت از انتخاب توتون تا تحویل سفارش",
    tone: "bg-splash-violet/15 text-splash-violet",
    icon: (
      <path
        d="M6 12a6 6 0 0 1 12 0v5a2 2 0 0 1-2 2h-2M6 12v5a2 2 0 0 0 2 2h1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
];

const SPLASH_TONES = [
  "bg-splash-cyan/15 text-splash-cyan ring-splash-cyan/25",
  "bg-splash-yellow/15 text-splash-yellow ring-splash-yellow/25",
  "bg-brand-500/15 text-brand-300 ring-brand-400/25",
  "bg-splash-violet/15 text-splash-violet ring-splash-violet/25",
  "bg-splash-lime/15 text-splash-lime ring-splash-lime/25",
  "bg-splash-orange/15 text-splash-orange ring-splash-orange/25",
];

export default async function HomePage() {
  const [products, categories, brands] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategories(8),
    getBrands(10),
  ]);

  const featured = products.data[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
        inLanguage: "fa-IR",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE.url}/products?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Store",
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        telephone: SITE.phone,
        address: {
          "@type": "PostalAddress",
          addressCountry: "IR",
          streetAddress: SITE.address,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="splash-field absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-white/15 to-transparent" />

        <div className="container-page relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-18">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-stone-500 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-splash-yellow" />
              توتون سیگار خیابونی، از دل شهر
            </span>
            <h1 className="font-display mt-6 max-w-xl text-4xl leading-[1.45] sm:text-5xl sm:leading-[1.35]">
              رولچی،
              <span className="text-splash block">رول کن، مال خودت باش</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-stone-400 sm:text-base sm:leading-8">
              توتون دست‌چین، کاغذ و فیلتر رول و لوازم رول‌کردن؛ همه‌چیز برای اینکه
              سیگارت رو خودت رول کنی. طعم خیابون، توی جیب تو.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
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

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <dt className="text-[11px] text-stone-500">محصولات فعال</dt>
                <dd className="mt-1 text-xl font-black text-white">
                  {formatNumber(products.total)}
                  <span className="ms-1 text-xs font-medium text-stone-500">عدد</span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-stone-500">دسته‌بندی</dt>
                <dd className="mt-1 text-xl font-black text-white">
                  {formatNumber(categories.length)}
                  <span className="ms-1 text-xs font-medium text-stone-500">گروه</span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-stone-500">رضایت رول‌کن‌ها</dt>
                <dd className="mt-1 text-xl font-black text-splash-yellow">
                  ۹۸٪
                  <span className="ms-1 text-xs font-medium text-stone-500">مثبت</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute inset-0 -rotate-3 rounded-[2rem] border border-white/10 bg-white/5" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900/85 p-5 shadow-2xl shadow-black/60 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15">
                    <Image
                      src="/rollchi-logo.webp"
                      alt="لوگوی رولچی"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <div className="leading-tight">
                    <p className="font-display text-base text-white">رولچی</p>
                    <p className="text-[9px] tracking-[0.22em] text-stone-500">ROLL YOUR OWN</p>
                  </div>
                </div>
                <span className="rounded-full bg-brand-500/15 px-3 py-1 text-[11px] font-bold text-brand-300">
                  پیشنهاد این هفته
                </span>
              </div>

              {featured ? (
                <div>
                  <Link
                    href={`/products/${featured.slug}`}
                    className="group mt-4 flex gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:border-brand-400/30 hover:bg-white/10"
                  >
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-ink-800">
                      <ProductImage
                        src={featured.imageUrl}
                        alt={featured.name}
                        sizes="112px"
                        className="transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="line-clamp-2 text-sm font-bold text-white">
                        {featured.name}
                      </h2>
                      <p className="mt-1 text-xs text-stone-400">
                        {featured.category?.name ?? "منتخب رولچی"}
                      </p>
                      <p className="mt-3 text-base font-black text-brand-300">
                        {formatPrice(featured.price)}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                        مشاهده جزئیات
                        <span aria-hidden>←</span>
                      </span>
                    </div>
                  </Link>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {products.data.slice(1, 3).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-splash-cyan/40 hover:bg-white/10"
                      >
                        <p className="line-clamp-1 text-xs font-semibold text-stone-500">
                          {product.name}
                        </p>
                        <p className="mt-1.5 text-xs font-bold text-splash-yellow">
                          {formatPrice(product.price)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-white/15 p-8 text-center">
                  <p className="text-sm font-bold text-white">کاتالوگ در حال تکمیل است</p>
                  <p className="mt-2 text-xs leading-6 text-stone-400">
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

      <div className="container-page relative z-10 -mt-6">
        <div className="grid gap-4 rounded-3xl border border-white/10 bg-ink-800 p-4 shadow-xl shadow-black/50 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-white/5">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${feature.tone}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  {feature.icon}
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold text-stone-800">{feature.title}</p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SplashSlider />

      {categories.length > 0 ? (
        <section className="container-page mt-12">
          <SectionHeading
            eyebrow="دسته‌بندی رولچی"
            title="رولت رو از کجا شروع می‌کنی؟"
            description="توتون، کاغذ، فیلتر و لوازم رول‌کردن؛ دسته‌بندی‌ها را بگرد و سریع‌تر به انتخاب خودت برس."
            actionLabel="همه دسته‌بندی‌ها"
            actionHref="/categories"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800 p-5 transition hover:-translate-y-0.5 hover:border-brand-400/40 hover:shadow-lg hover:shadow-black/50"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black ring-1 ring-inset ${SPLASH_TONES[index % SPLASH_TONES.length]}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 line-clamp-1 text-sm font-bold text-stone-800">
                  {category.name}
                </p>
                <p className="mt-1 line-clamp-2 min-h-8 text-xs leading-4 text-stone-400">
                  {category.description ?? "مشاهده محصولات این دسته"}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-300">
                  مشاهده
                  <span aria-hidden className="transition group-hover:-translate-x-1">←</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-page mt-10">
        <SectionHeading
          eyebrow="تازه‌ها"
          title="تازه از دل شهر رسیده"
          description="جدیدترین توتون‌ها و لوازم رول‌کردن رولچی، با موجودی به‌روز."
          actionLabel="مشاهده فروشگاه"
          actionHref="/products"
        />
        {products.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="هنوز محصولی ثبت نشده است"
            description="با اضافه‌کردن محصولات از پنل مدیریت، این بخش به‌صورت خودکار تکمیل می‌شود."
            actionLabel="مشاهده فروشگاه"
            actionHref="/products"
          />
        )}
        </section>

      <section className="container-page mt-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900 text-white">
          <div className="splash-field absolute inset-0 opacity-80" />
          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-[11px] font-bold tracking-wide text-splash-yellow">چرا رولچی؟</span>
              <h2 className="font-display mt-3 text-3xl leading-[1.4] sm:text-4xl">
                سیگارت رو خودت رول کن
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-stone-400">
                رولچی از دل شهر شروع شد؛ با توتون تازه، بسته‌بندی ساده و قیمتی که
                به جیب بچه‌های شهر بخوره. هر سفارش قبل از ارسال بررسی می‌شود و با
                کد رهگیری به دستت می‌رسد.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
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
              {[
                { title: "انتخاب و ثبت سفارش", text: "محصولات را به سبد اضافه کنید و آدرس را مشخص کنید." },
                { title: "بسته‌بندی و ارسال", text: "سفارش پس از پردازش، با بسته‌بندی ایمن ارسال می‌شود." },
                { title: "تحویل و پیگیری", text: "وضعیت سفارش را از حساب کاربری خود دنبال کنید." },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ring-1 ring-inset ${SPLASH_TONES[index % SPLASH_TONES.length]}`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{step.title}</p>
                    <p className="mt-1 text-xs leading-5 text-stone-400">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {brands.length > 0 ? (
        <section className="container-page mt-10">
          <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/10 bg-ink-800 p-6">
            <span className="me-2 text-xs font-bold text-stone-500">برندهای موجود در رولچی:</span>
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-stone-500 transition hover:border-brand-400/50 hover:bg-brand-500/10 hover:text-brand-300"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-page mt-10">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-l from-brand-500/15 via-ink-900 to-ink-900 p-8 sm:p-10">
          <div className="splash-rule absolute inset-x-0 top-0 opacity-70" />
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div>
              <h2 className="font-display text-2xl text-white sm:text-3xl">
                عضو خانواده رولچی شو
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-stone-400">
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
    </>
  );
}
