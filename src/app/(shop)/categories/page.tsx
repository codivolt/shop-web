import type { Metadata } from "next";
import Link from "next/link";

import { PageLayout, SectionCard, EmptyState, ProductCardComponent } from "@/components/ui";
import { getCategories } from "@/lib/api/catalog";
import type { Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "دسته‌بندی محصولات",
  description:
    "مرور دسته‌بندی‌های فروشگاه؛ سیگار، توتون، پیپ و لوازم جانبی با امکان مشاهده سریع محصولات هر گروه.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getCategories(100);
  const roots = categories.filter((category) => !category.parentId);
  const childrenOf = (id: string) =>
    categories.filter((category) => category.parentId === id);

  return (
    <PageLayout
      title="دسته‌بندی‌های رولچی"
      description="برای دیدن محصولات هر گروه، روی دسته‌بندی موردنظر کلیک کنید."
      eyebrow="کاتالوگ رولچی"
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "دسته‌بندی‌ها" }]}
    >
      {roots.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roots.map((category: Category, index) => {
            const children = childrenOf(category.id);

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group flex flex-col rounded-3xl border border-stone-200/80 bg-white p-6 transition hover:border-brand-200 hover:shadow-lg hover:shadow-stone-900/5"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-sm font-black text-brand-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-bold text-stone-600 transition group-hover:bg-brand-700 group-hover:text-white">
                    مشاهده محصولات
                  </span>
                </div>

                <p className="mt-5 text-lg font-black text-stone-900 transition hover:text-brand-800">
                  {category.name}
                </p>
                <p className="mt-2 min-h-10 text-xs leading-5 text-stone-500">
                  {category.description ?? "محصولات این دسته‌بندی را ببینید."}
                </p>

                {children.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/products?category=${child.slug}`}
                        className="rounded-full border border-stone-200 px-3 py-1.5 text-[11px] font-semibold text-stone-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="دسته‌بندی‌ای ثبت نشده است"
          description="پس از ایجاد دسته‌بندی در پنل مدیریت، این صفحه به‌صورت خودکار تکمیل می‌شود."
          actionLabel="مشاهده همه محصولات"
          actionHref="/products"
        />
      )}
    </PageLayout>
  );
}