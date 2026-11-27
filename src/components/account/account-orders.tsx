"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/use-orders";
import { apiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import {
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  formatDateTime,
  formatNumber,
  formatPrice,
} from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const ORDER_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "ثبت شد" },
  { status: "processing", label: "پردازش" },
  { status: "shipped", label: "ارسال" },
  { status: "delivered", label: "تحویل" },
];

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "processing", "shipped"];

export function AccountOrders() {
  const orders = useOrders(1, 10);
  const list = orders.data?.data ?? [];
  const activeOrder = list.find((order) =>
    ACTIVE_STATUSES.includes(order.status),
  );

  return (
    <section className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-stone-900">سفارش‌های من</h2>
          <p className="mt-1 text-[11px] text-stone-400">
            وضعیت سفارش‌های در جریان و تاریخچه خریدها
          </p>
        </div>
        <Link
          href="/orders"
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          مشاهده همه سفارش‌ها ←
        </Link>
      </div>

      {orders.isLoading ? (
        <div className="mt-5 space-y-3">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      ) : orders.isError ? (
        <p className="mt-5 rounded-xl bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
          {apiErrorMessage(orders.error)}
        </p>
      ) : list.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="هنوز سفارشی ثبت نکرده‌اید"
            description="با ثبت اولین سفارش، وضعیت آن در همین بخش قابل پیگیری خواهد بود."
          >
            <Link href="/products" className={buttonStyles({ size: "sm" })}>
              شروع خرید
            </Link>
          </EmptyState>
        </div>
      ) : (
        <>
          {activeOrder ? (
            <ActiveOrderCard order={activeOrder} />
          ) : (
            <LatestOrderSummary order={list[0]} />
          )}

          {list.length > 1 ? (
            <ul className="mt-5 divide-y divide-stone-100 border-t border-stone-100">
              {list.slice(0, 5).map((order) => {
                const status = ORDER_STATUS_META[order.status];
                return (
                  <li key={order.id}>
                    <Link
                      href={`/orders/detail?id=${order.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 py-3.5 transition hover:text-brand-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-[10px] font-black text-stone-500">
                          #{order.id.slice(0, 4)}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-stone-800">
                            {formatPrice(order.totalAmount)}
                          </p>
                          <p className="mt-0.5 text-[10px] text-stone-400">
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          label={status.label}
                          className={status.className}
                        />
                        <span aria-hidden className="text-stone-300">
                          ←
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}

function ActiveOrderCard({ order }: { order: Order }) {
  const status = ORDER_STATUS_META[order.status];
  const payment = PAYMENT_STATUS_META[order.paymentStatus];
  const currentStep = ORDER_STEPS.findIndex((step) => step.status === order.status);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const names = order.items
    .map((item) => item.productNameSnapshot)
    .slice(0, 2)
    .join("، ");

  return (
    <div className="mt-5 rounded-2xl border border-brand-500/30 bg-gradient-to-l from-brand-500/15 via-ink-800 to-ink-800 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-black text-brand-800">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
            سفارش در جریان
          </p>
          <p className="mt-1 text-[11px] text-stone-500">
            سفارش #{order.id.slice(0, 8)} — {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={status.label} className={status.className} />
          <StatusBadge label={payment.label} className={payment.className} />
        </div>
      </div>

      <ol className="mt-5 grid grid-cols-4 gap-1">
        {ORDER_STEPS.map((step, index) => {
          const active = index <= currentStep;
          return (
            <li key={step.status} className="text-center">
              <div className="flex items-center">
                {index > 0 ? (
                  <span
                    className={cn(
                      "h-0.5 flex-1 rounded-full",
                      index <= currentStep ? "bg-brand-500" : "bg-stone-200",
                    )}
                  />
                ) : (
                  <span className="flex-1" />
                )}
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ring-4",
                    active
                      ? "bg-brand-700 text-white ring-brand-100"
                      : "bg-stone-100 text-stone-400 ring-white",
                  )}
                >
                  {index + 1}
                </span>
                {index < ORDER_STEPS.length - 1 ? (
                  <span
                    className={cn(
                      "h-0.5 flex-1 rounded-full",
                      index < currentStep ? "bg-brand-500" : "bg-stone-200",
                    )}
                  />
                ) : (
                  <span className="flex-1" />
                )}
              </div>
              <p
                className={cn(
                  "mt-1.5 text-[10px] font-bold",
                  active ? "text-stone-700" : "text-stone-400",
                )}
              >
                {step.label}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-4">
        <div className="min-w-0">
          <p className="line-clamp-1 text-xs text-stone-600">{names}</p>
          <p className="mt-1 text-[10px] text-stone-400">
            {formatNumber(itemCount)} قلم کالا —{" "}
            {formatPrice(order.totalAmount)}
          </p>
        </div>
        <Link
          href={`/orders/detail?id=${order.id}`}
          className={buttonStyles({ size: "sm" })}
        >
          پیگیری سفارش
        </Link>
      </div>
    </div>
  );
}

function LatestOrderSummary({ order }: { order: Order }) {
  const status = ORDER_STATUS_META[order.status];

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
      <div>
        <p className="text-[11px] text-stone-500">آخرین سفارش شما</p>
        <p className="mt-1 text-xs font-bold text-stone-800">
          #{order.id.slice(0, 8)} — {formatPrice(order.totalAmount)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge label={status.label} className={status.className} />
        <Link
          href={`/orders/detail?id=${order.id}`}
          className="text-[11px] font-semibold text-brand-700 hover:underline"
        >
          جزئیات
        </Link>
      </div>
    </div>
  );
}