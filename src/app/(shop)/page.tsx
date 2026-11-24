import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/product/product-card";
import { ProductImage } from "@/components/product/product-image";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section";
import { FeaturedSlider } from "@/components/home/FeaturedSlider";
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
    title: "ضمانت اصالت کالا",
    description: "تمام محصولات از منابع معتبر تأمین می‌شوند",
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
    title: "ارسال سریع",
    description: "تحویل ۲۴ تا ۷۲ ساعته در سراسر کشور",
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
    title: "پرداخت امن",
    description: "درگاه پرداخت معتبر با رمزنگاری کامل",
    icon: (
      <>
        <rect x="4" y="6" width="16" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 10h16" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
  {
    title: "پشتیبانی واقعی",
    description: "همراه شما از انتخاب تا تحویل سفارش",
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

      <section className="relative overflow-hidden bg-stone-950 text-white">
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-brand-400/10 blur-3xl" />

        <div className="container-page relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-18">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-brand-200 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              تجربه خریدی متفاوت برای علاقه‌مندان
            </span>
            <h1 className="mt-6 max-w-xl text-balance text-3xl font-bold leading-[1.35] tracking-tight sm:text-5xl sm:leading-[1.25]">
              انتخاب حرفه‌ای‌ها،
              <span className="text-brand-400"> از یک فروشگاه مطمئن</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-stone-300 sm:text-base sm:leading-8">
              مجموعه‌ای منتخب از سیگار، توتون، پیپ و لوازم جانبی؛ با ضمانت
              اصالت، قیمت شفاف و ارسال سریع به سراسر ایران.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/products" className={buttonStyles({ size: "lg" })}>
                مشاهده فروشگاه
                <span aria-hidden>←</span>
              </Link>
              <Link
                href="/categories"
                className={buttonStyles({
                  variant: "outline",
                  size: "lg",
                  className:
                    "border-white/15 bg-white/5 text-white hover:border-white/25 hover:bg-white/10",
                })}
              >
                دسته‌بندی محصولات
              </Link>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <dt className="text-[11px] text-stone-400">محصولات فعال</dt>
                <dd className="mt-1 text-xl font-black text-white">
                  {formatNumber(products.total)}
                  <span className="ms-1 text-xs font-medium text-stone-400">عدد</span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-stone-400">دسته‌بندی</dt>
                <dd className="mt-1 text-xl font-black text-white">
                  {formatNumber(categories.length)}
                  <span className="ms-1 text-xs font-medium text-stone-400">گروه</span>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-stone-400">رضایت مشتریان</dt>
                <dd className="mt-1 text-xl font-black text-white">
                  ۹۸٪
                  <span className="ms-1 text-xs font-medium text-stone-400">مثبت</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute inset-0 -rotate-3 rounded-[2rem] border border-white/10 bg-white/5" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-stone-900/80 p-5 shadow-2xl backdrop-blur">
              {featured ? (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-brand-500/15 px-3 py-1 text-[11px] font-bold text-brand-300">
                      پیشنهاد ویژه این هفته
                    </span>
                    <span className="text-[11px] text-stone-400">موجودی محدود</span>
                  </div>
                  <Link
                    href={`/products/${featured.slug}`}
                    className="group mt-4 flex gap-4 rounded-2xl bg-white/5 p-4 transition hover:bg-white/10"
                  >
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-stone-800">
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
                        {featured.category?.name ?? "منتخب فروشگاه"}
                      </p>
                      <p className="mt-3 text-base font-black text-brand-300">
                        {formatPrice(featured.price)}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-stone-300">
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
                        className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-brand-500/40 hover:bg-white/10"
                      >
                        <p className="line-clamp-1 text-xs font-semibold text-stone-200">
                          {product.name}
                        </p>
                        <p className="mt-1.5 text-xs font-bold text-brand-300">
                          {formatPrice(product.price)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/15 p-8 text-center">
                  <p className="text-sm font-bold text-white">کاتالوگ در حال تکمیل است</p>
                  <p className="mt-2 text-xs leading-6 text-stone-400">
                    به‌زودی محصولات تازه در این بخش نمایش داده می‌شوند.
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
        <div className="grid gap-4 rounded-3xl border border-stone-200/80 bg-white p-4 shadow-xl shadow-stone-900/5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3 rounded-2xl p-3 transition hover:bg-stone-50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
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

      {products.data.length > 0 && (
        <section className="container-page mt-10">
          <FeaturedSlider />
        </section>
      )}

      {categories.length > 0 ? (
        <section className="container-page mt-16">
          <SectionHeading
            eyebrow="دسته‌بندی‌ها"
            title="از کجا شروع می‌کنید؟"
            description="محصولات را بر اساس دسته‌بندی مرور کنید و سریع‌تر به انتخاب دلخواه برسید."
            actionLabel="همه دسته‌بندی‌ها"
            actionHref="/categories"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lg hover:shadow-stone-900/5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-sm font-black text-stone-500 transition group-hover:bg-brand-50 group-hover:text-brand-800">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 line-clamp-1 text-sm font-bold text-stone-800">
                  {category.name}
                </p>
                <p className="mt-1 line-clamp-2 min-h-8 text-xs leading-4 text-stone-400">
                  {category.description ?? "مشاهده محصولات این دسته"}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-800">
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
          title="جدیدترین محصولات"
          description="تازه‌ترین محصولات اضافه‌شده به فروشگاه، با موجودی به‌روز."
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
        <div className="overflow-hidden rounded-3xl bg-stone-900 text-white">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-[11px] font-bold text-brand-300">چرا فروشگاه ما؟</span>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                خریدی مطمئن، بدون ریسک
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-stone-300">
                هر محصول پیش از ارسال بررسی می‌شود؛ سفارش شما با بسته‌بندی ایمن و
                کد رهگیری تحویل داده می‌شود. اگر با محصول مشکلی داشتید، تیم
                پشتیبانی تا حل کامل همراه شماست.
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
                <li key={step.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">
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
          <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-stone-200/80 bg-white p-6">
            <span className="me-2 text-xs font-bold text-stone-500">برندهای موجود:</span>
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-page mt-10">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-brand-200 bg-gradient-to-l from-brand-50 via-white to-white p-8 sm:flex-row sm:p-10">
          <div>
            <h2 className="text-xl font-black text-stone-900 sm:text-2xl">
              عضو خانواده ما شوید
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
              با ورود به حساب کاربری، سفارش‌ها را پیگیری کنید و خریدهای بعدی را
              سریع‌تر انجام دهید.
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
      </section>
    </>
  );
}
