"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Button, buttonStyles } from "@/components/ui/button";
import { ProductImage } from "@/components/product/product-image";
import { formatNumber, formatPrice } from "@/lib/format";
import type { CartItem } from "@/lib/types";

export interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryPrice: number;
  totalAmount: number;
  discountAmount?: number;
  deliveryLabel?: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  footer?: ReactNode;
  showBreakdown?: boolean;
  variant?: "default" | "compact" | "checkout";
}

export function OrderSummary({
  items,
  subtotal,
  deliveryPrice,
  totalAmount,
  discountAmount = 0,
  deliveryLabel = "هزینه ارسال",
  actionLabel,
  actionHref,
  onAction,
  loading,
  disabled,
  className,
  footer,
  showBreakdown = true,
  variant = "default",
}: OrderSummaryProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onAction) {
      e.preventDefault();
      onAction();
    }
  };

  const content = (
    <>
      <h2 className="text-base font-black text-stone-900">خلاصه سفارش</h2>
      {showBreakdown && (
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-stone-500">جمع کالاها</dt>
            <dd className="font-bold text-stone-800">{formatPrice(subtotal)}</dd>
          </div>
          {discountAmount && discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-300">
              <dt className="text-stone-500">تخفیف کد</dt>
              <dd className="font-semibold">-{formatPrice(discountAmount)}</dd>
            </div>
          )}
          <div className="flex items-center justify-between">
            <dt className="text-stone-500">{deliveryLabel}</dt>
            <dd className="font-semibold text-emerald-300">{deliveryPrice === 0 ? "رایگان" : formatPrice(deliveryPrice)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-stone-200 pt-4">
            <dt className="font-bold text-stone-700">مبلغ قابل پرداخت</dt>
            <dd className="text-lg font-black text-brand-800">{formatPrice(totalAmount)}</dd>
          </div>
        </dl>
      )}

      {actionHref ? (
        <Link href={actionHref} className={buttonStyles({ size: "lg", className: "mt-6 w-full" })} onClick={handleClick}>
          {actionLabel}
          <span aria-hidden>←</span>
        </Link>
      ) : (
        <Button onClick={handleClick} loading={loading} disabled={disabled} size="lg" className="mt-6 w-full">
          {actionLabel}
        </Button>
      )}

      {footer && <div className="mt-4">{footer}</div>}
    </>
  );

  if (variant === "compact") {
    return (
      <aside className={cn("rounded-3xl border border-white/10 bg-ink-800 p-5 lg:sticky lg:top-28", className)}>
        {content}
      </aside>
    );
  }

  if (variant === "checkout") {
    return (
      <aside className={cn("rounded-3xl border border-white/10 bg-ink-800 p-5 lg:sticky lg:top-28", className)}>
        {content}
        <p className="mt-4 text-center text-[11px] leading-5 text-stone-400">
          پرداخت در این نسخه با ثبت فیش و تایید توسط مدیریت انجام می‌شود.
        </p>
      </aside>
    );
  }

  return (
    <div className={cn("rounded-3xl border border-white/10 bg-ink-800 p-6", className)}>
      {content}
    </div>
  );
}

export interface OrderItemListProps {
  items: CartItem[];
  className?: string;
}

export function OrderItemList({ items, className }: OrderItemListProps) {
  return (
    <section className={cn("rounded-3xl border border-white/10 bg-ink-800 p-5", className)}>
      <h2 className="flex items-center gap-2 text-base font-black text-stone-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-xs font-black text-brand-800">
          ۴
        </span>
        اقلام سفارش
      </h2>
      <ul className="mt-4 divide-y divide-stone-100">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-50">
              <ProductImage src={item.product.imageUrl} alt={item.product.name} sizes="56px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-bold text-stone-800">{item.product.name}</p>
              <p className="mt-1 text-[11px] text-stone-400">
                {formatNumber(item.quantity)} × {formatPrice(item.product.price)}
              </p>
            </div>
            <p className="text-xs font-black text-stone-800">{formatPrice(item.totalPrice)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export interface CheckoutStepProps {
  number: number;
  title: string;
  children: ReactNode;
  className?: string;
}

export function CheckoutStep({ number, title, children, className }: CheckoutStepProps) {
  return (
    <section className={cn("rounded-3xl border border-white/10 bg-ink-800 p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-black text-stone-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-xs font-black text-brand-800">
            {number}
          </span>
          {title}
        </h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}