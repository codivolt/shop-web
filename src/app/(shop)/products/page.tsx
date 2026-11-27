import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const revalidate = 60;

import {
  ProductGrid,
  EmptyState,
  Pagination,
  PageLayout,
  SectionCard,
  buttonStyles,
  cn,
} from "@/components/ui";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { getBrands, getCategories, getProducts } from "@/lib/api/catalog";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = {
  title: "فروشگاه محصولات",
  description:
    "لیست کامل سیگار، توتون، پیپ و لوازم جانبی با امکان جستجو، فیلتر برند و بازه قیمتی.",
  alternates: { canonical: "/products" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const PAGE_SIZE = 12;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <PageLayout
      title="فروشگاه رولچی"
      description="توتون دست‌چین، کاغذ و فیلتر رول و لوازم جانبی؛ با امکان جستجو، فیلتر برند و بازه قیمتی."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "فروشگاه" }]}
    >
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </PageLayout>
  );
}

function CatalogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-56 animate-pulse rounded-xl bg-stone-200" />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden h-80 animate-pulse rounded-2xl bg-stone-200/70 lg:block" />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}

async function Catalog({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const search = first(sp.q)?.trim();
  const categorySlug = first(sp.category);
  const brandSlug = first(sp.brand);
  const minPrice = toNumber(first(sp.min));
  const maxPrice = toNumber(first(sp.max));
  const page = Math.max(1, Number(first(sp.page) ?? 1) || 1);

  const [categories, brands] = await Promise.all([
    getCategories(100),
    getBrands(100),
  ]);

  const category = categorySlug
    ? categories.find((item) => item.slug === categorySlug)
    : undefined;
  const brand = brandSlug
    ? brands.find((item) => item.slug === brandSlug)
    : undefined;

  const products = await getProducts({
    page,
    limit: PAGE_SIZE,
    search,
    categoryId: category?.id,
    brandId: brand?.id,
    minPrice,
    maxPrice,
  });

  const buildHref = (overrides: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams();

    if (search) params.set("q", search);
    if (categorySlug) params.set("category", categorySlug);
    if (brandSlug) params.set("brand", brandSlug);
    if (minPrice) params.set("min", String(minPrice));
    if (maxPrice) params.set("max", String(maxPrice));
    if (page > 1) params.set("page", String(page));

    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined) params.delete(key);
      else params.set(key, String(value));
    }

    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  const title = category?.name ?? brand?.name ?? (search ? `نتیجه جستجوی «${search}»` : "همه محصولات");
  const hasFilters = Boolean(search || categorySlug || brandSlug || minPrice || maxPrice);

  const filterPanel = (
    <SectionCard title="فیلترها" className="space-y-5">
      <div className="rounded-2xl border border-stone-200/80 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-stone-800">دسته‌بندی</h2>
          {categorySlug ? (
            <Link
              href={buildHref({ category: undefined, page: undefined })}
              className="text-[11px] font-semibold text-brand-700 hover:underline"
            >
              حذف
            </Link>
          ) : null}
        </div>
        <ul className="mt-4 space-y-1">
          <li>
            <Link
              href={buildHref({ category: undefined, page: undefined })}
              className={cn(
                "block rounded-lg px-3 py-2 text-xs font-semibold transition",
                !categorySlug
                  ? "bg-brand-50 text-brand-800"
                  : "text-stone-600 hover:bg-stone-50",
              )}
            >
              همه دسته‌ها
            </Link>
          </li>
          {categories.map((item) => (
            <li key={item.id}>
              <Link
                href={buildHref({ category: item.slug, page: undefined })}
                className={cn(
                  "block rounded-lg px-3 py-2 text-xs font-semibold transition",
                  categorySlug === item.slug
                    ? "bg-brand-50 text-brand-800"
                    : "text-stone-600 hover:bg-stone-50",
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {brands.length > 0 ? (
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-stone-800">برند</h2>
            {brandSlug ? (
              <Link
                href={buildHref({ brand: undefined, page: undefined })}
                className="text-[11px] font-semibold text-brand-700 hover:underline"
              >
                حذف
              </Link>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {brands.map((item) => (
              <Link
                key={item.id}
                href={buildHref({ brand: item.slug, page: undefined })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
                  brandSlug === item.slug
                    ? "border-brand-200 bg-brand-50 text-brand-800"
                    : "border-stone-200 text-stone-600 hover:border-stone-300",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-stone-200/80 bg-white p-5">
        <h2 className="text-sm font-black text-stone-800">بازه قیمت</h2>
        <form action="/products" className="mt-4 space-y-3">
          {search ? <input type="hidden" name="q" value={search} /> : null}
          {categorySlug ? <input type="hidden" name="category" value={categorySlug} /> : null}
          {brandSlug ? <input type="hidden" name="brand" value={brandSlug} /> : null}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="min" className="mb-1 block text-[11px] text-stone-500">
                از (تومان)
              </label>
              <input
                id="min"
                name="min"
                inputMode="numeric"
                defaultValue={minPrice ? String(minPrice) : ""}
                placeholder="۰"
                className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-xs focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="max" className="mb-1 block text-[11px] text-stone-500">
                تا (تومان)
              </label>
              <input
                id="max"
                name="max"
                inputMode="numeric"
                defaultValue={maxPrice ? String(maxPrice) : ""}
                placeholder="بدون محدودیت"
                className="h-10 w-full rounded-xl border border-stone-200 bg-stone-50 px-3 text-xs focus:border-brand-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
          <button type="submit" className={buttonStyles({ size: "sm", className: "w-full" })}>
            اعمال فیلتر
          </button>
          {hasFilters ? (
            <Link
              href="/products"
              className="block text-center text-[11px] font-semibold text-stone-500 hover:text-brand-800"
            >
              حذف همه فیلترها
            </Link>
          ) : null}
        </form>
      </div>
    </SectionCard>
  );

  return (
    <>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            {products.total > 0
              ? `${formatNumber(products.total)} محصول یافت شد`
              : "محصولی با این مشخصات یافت نشد"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {search ? (
            <span className="rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-semibold text-stone-600">
              جستجو: {search}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-20">{filterPanel}</div>
        </div>

        <div>
          <details className="mb-4 rounded-2xl border border-stone-200/80 bg-white p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-bold text-stone-700">
              فیلترهای جستجو
            </summary>
            <div className="mt-4">{filterPanel}</div>
          </details>

          {products.data.length > 0 ? (
            <>
              <ProductGrid products={products.data} />
              <Pagination
                page={products.page}
                totalPages={products.totalPages}
                makeHref={(nextPage) =>
                  buildHref({ page: nextPage > 1 ? nextPage : undefined })
                }
                className="mt-6"
              />
            </>
          ) : (
            <EmptyState
              title="محصولی پیدا نشد"
              description="فیلترها را تغییر دهید یا همه محصولات را ببینید."
              actionLabel="مشاهده همه محصولات"
              actionHref="/products"
            />
          )}
        </div>
      </div>
    </>
  );
}