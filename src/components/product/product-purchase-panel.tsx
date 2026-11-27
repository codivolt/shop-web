"use client";

import { useState } from "react";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { FavoriteButton } from "@/components/product/favorite-button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { formatPrice } from "@/lib/format";
import type { CartLineProduct } from "@/lib/types";

export function ProductPurchasePanel({ product }: { product: CartLineProduct }) {
  const [quantity, setQuantity] = useState(1);
  const max = Math.max(1, Math.min(product.stock, 10));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4">
        <div>
          <p className="text-[11px] text-stone-500">تعداد</p>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={max}
            disabled={product.stock <= 0}
          />
        </div>
        <div className="text-left">
          <p className="text-[11px] text-stone-500">مبلغ قابل پرداخت</p>
          <p className="text-lg font-black text-stone-900">
            {formatPrice(product.price * quantity)}
          </p>
        </div>
      </div>

      <AddToCartButton product={product} quantity={quantity} full />
      <FavoriteButton productId={product.id} withLabel className="w-full" />

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3l7 3v5c0 4.4-2.9 8.2-7 9.5-4.1-1.3-7-5.1-7-9.5V6l7-3Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        اصالت توتون و ضمانت بازگشت کالا
      </p>
    </div>
  );
}
