import Link from "next/link";

import { SectionHeading } from "@/components/ui/section";
import { SPLASH_TONES } from "@/lib/home-content";
import type { Category } from "@/lib/types";

export function CategoriesSection({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="mt-12 container-page">
      <SectionHeading
        eyebrow="دسته‌بندی رولچی"
        title="رولت رو از کجا شروع می‌کنی؟"
        description="توتون، کاغذ، فیلتر و لوازم رول‌کردن؛ دسته‌بندی‌ها را بگرد و سریع‌تر به انتخاب خودت برس."
        actionLabel="همه دسته‌بندی‌ها"
        actionHref="/categories"
      />
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group relative bg-ink-800 hover:shadow-black/50 hover:shadow-lg p-5 border border-white/10 hover:border-brand-400/40 rounded-2xl overflow-hidden transition hover:-translate-y-0.5"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black ring-1 ring-inset ${SPLASH_TONES[index % SPLASH_TONES.length]}`}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-4 font-bold text-stone-800 text-sm line-clamp-1">
              {category.name}
            </p>
            <p className="mt-1 min-h-8 text-stone-400 text-xs line-clamp-2 leading-4">
              {category.description ?? "مشاهده محصولات این دسته"}
            </p>
            <span className="inline-flex items-center gap-1 mt-4 font-semibold text-[11px] text-brand-300">
              مشاهده
              <span aria-hidden className="transition group-hover:-translate-x-1">←</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}