import Link from "next/link";

import type { Brand } from "@/lib/types";

export function BrandsSection({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <section className="mt-10 container-page">
      <div className="flex flex-wrap items-center gap-3 bg-ink-800 p-6 border border-white/10 rounded-3xl">
        <span className="me-2 font-bold text-stone-500 text-xs">برندهای موجود در رولچی:</span>
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/products?brand=${brand.slug}`}
            className="hover:bg-brand-500/10 px-4 py-2 border border-white/10 hover:border-brand-400/50 rounded-full font-semibold text-stone-500 hover:text-brand-300 text-xs transition"
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </section>
  );
}