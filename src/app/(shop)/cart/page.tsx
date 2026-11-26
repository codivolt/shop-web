"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { ProductImage } from "@/components/product/product-image";
import { Button, buttonStyles, EmptyState, PageLayout, CartItemCard, OrderSummary } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthState } from "@/hooks/use-auth";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/use-cart";
import { apiErrorMessage } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/lib/types";

export default function CartPage() {
  return <CartView />;
}

function CartView() {
  const cart = useCart();
  const { isAuthenticated, hydrated } = useAuthState();
  const items = cart.data ?? [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  return (
    <PageLayout
      title="سبد خرید رولچی"
      description={items.length > 0 ? `${items.length.toLocaleString("fa-IR")} نوع کالا در سبد شما` : "سبد رولچی‌ات هنوز خالیه؛ از فروشگاه شروع کن"}
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "سبد خرید" }]}
      actionLabel="ادامه خرید"
      actionHref="/products"
      actionVariant="ghost"
      actionSize="sm"
    >
      {!hydrated ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      ) : cart.isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
      ) : cart.isError ? (
        <EmptyState
          title="دریافت سبد خرید ممکن نشد"
          description={apiErrorMessage(cart.error)}
          actionLabel="تلاش دوباره"
        >
          <Button onClick={() => void cart.refetch()}>تلاش دوباره</Button>
        </EmptyState>
      ) : items.length === 0 ? (
        <EmptyState
          icon={
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4h2.2l1.9 10.4a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20 8H6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          }
          title="سبد خرید خالی است"
          description="از فروشگاه محصولات مورد علاقه‌تان را انتخاب کنید و به سبد اضافه کنید."
          actionLabel="مشاهده محصولات"
          actionHref="/products"
        />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {!isAuthenticated ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 px-4 py-3">
                <p className="text-xs leading-6 text-brand-900">
                  فعلاً به‌عنوان مهمان خرید می‌کنید؛ برای نهایی‌کردن سفارش وارد
                  حساب کاربری می‌شوید و اقلام سبد حفظ می‌شوند.
                </p>
                <Link
                  href="/login?next=/checkout"
                  className="text-xs font-bold text-brand-800 underline-offset-4 hover:underline"
                >
                  ورود به حساب
                </Link>
              </div>
            ) : null}
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                product={item.product}
                quantity={item.quantity}
                onQuantityChange={(next) => updateItem.mutate({ id: item.id, quantity: next })}
                onRemove={() =>
                  removeItem.mutate(item.id, {
                    onSuccess: () => toast.success("محصول از سبد حذف شد"),
                    onError: (error: Error) => toast.error(apiErrorMessage(error)),
                  })
                }
                isUpdating={updateItem.isPending}
                isRemoving={removeItem.isPending}
              />
            ))}
          </div>

          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryPrice={0}
            totalAmount={subtotal}
            deliveryLabel="هزینه ارسال (در تسویه محاسبه می‌شود)"
            actionLabel="ادامه و ثبت سفارش"
            actionHref={isAuthenticated ? "/checkout" : "/login?next=/checkout"}
            variant="checkout"
            className="lg:sticky lg:top-28"
            footer={
              <p className="mt-4 text-center text-[11px] leading-5 text-stone-400">
                با ثبت سفارش، شرایط خرید و قوانین فروشگاه را می‌پذیرید.
              </p>
            }
          />
        </div>
      )}
    </PageLayout>
  );
}