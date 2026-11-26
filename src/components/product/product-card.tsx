import Link from "next/link";

import { ProductImage } from "@/components/product/product-image";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-800 shadow-sm shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-xl hover:shadow-black/60">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-ink-900"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {product.category ? (
            <Badge tone="neutral" className="bg-black/60 backdrop-blur">
              {product.category.name}
            </Badge>
          ) : (
            <span />
          )}
          {outOfStock ? (
            <Badge tone="danger">ناموجود</Badge>
          ) : lowStock ? (
            <Badge tone="warning">{formatNumber(product.stock)} عدد باقی‌مانده</Badge>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-h-11">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 text-sm font-bold leading-6 text-stone-800 transition hover:text-brand-300"
          >
            {product.name}
          </Link>
          {product.brand ? (
            <p className="mt-1 text-xs text-stone-400">{product.brand.name}</p>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <span className="text-[11px] text-stone-400">قیمت</span>
            <p className="text-base font-black text-white">
              {formatPrice(product.price)}
            </p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            aria-label={`مشاهده ${product.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-stone-400 transition hover:bg-brand-500 hover:text-ink-950"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
