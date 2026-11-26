"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { RequireAuth } from "@/components/auth/require-auth";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/use-orders";
import { apiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import {
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  formatDateTime,
  formatPrice,
} from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const PROGRESS_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "ثبت شد" },
  { status: "processing", label: "پردازش" },
  { status: "shipped", label: "ارسال" },
  { status: "delivered", label: "تحویل" },
];

export function OrderDetailView() {
  return (
    <RequireAuth>
      <OrderDetailContent />
    </RequireAuth>
  );
}

function OrderDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const order = useOrder(id);

  if (order.isLoading) {
    return (
      <div className="container-page space-y-4 py-10">
        <Skeleton className="h-9 w-48 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (order.isError || !order.data) {
    return (
      <div className="container-page py-16">
        <EmptyState
          title="سفارش یافت نشد"
          description={
            order.isError ? apiErrorMessage(order.error) : "این سفارش در دسترس نیست."
          }
          actionLabel="بازگشت به سفارش‌ها"
          actionHref="/orders"
        />
      </div>
    );
  }

  const data = order.data;
  const status = ORDER_STATUS_META[data.status];
  const payment = PAYMENT_STATUS_META[data.paymentStatus];
  const currentStep = PROGRESS_STEPS.findIndex((step) => step.status === data.status);

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <Link
          href="/orders"
          className="text-xs font-semibold text-stone-500 transition hover:text-brand-800"
        >
          → بازگشت به سفارش‌ها
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
            سفارش #{data.id.slice(0, 8)}
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            ثبت‌شده در {formatDateTime(data.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={status.label} className={status.className} />
          <StatusBadge label={payment.label} className={payment.className} />
        </div>
      </div>

      {data.status === "cancelled" ? (
        <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm font-semibold text-rose-300">
          این سفارش لغو شده است. در صورت پرداخت، مبلغ طی فرآیند بازگشت وجه
          واریز می‌شود.
        </div>
      ) : (
        <ol className="mt-8 grid grid-cols-4 gap-2">
          {PROGRESS_STEPS.map((step, index) => {
            const active = index <= currentStep;
            return (
              <li key={step.status} className="text-center">
                <div className="flex items-center">
                  <span
                    className={cn(
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ring-4",
                      active
                        ? "bg-brand-700 text-white ring-brand-100"
                        : "bg-stone-100 text-stone-400 ring-white",
                    )}
                  >
                    {index + 1}
                  </span>
                </div>
                <p
                  className={cn(
                    "mt-2 text-[11px] font-bold",
                    active ? "text-stone-800" : "text-stone-400",
                  )}
                >
                  {step.label}
                </p>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-3xl border border-stone-200/80 bg-white p-6">
          <h2 className="text-base font-black text-stone-900">اقلام سفارش</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-right text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-[11px] text-stone-500">
                  <th className="py-3 font-semibold">محصول</th>
                  <th className="py-3 font-semibold">قیمت واحد</th>
                  <th className="py-3 font-semibold">تعداد</th>
                  <th className="py-3 font-semibold">جمع</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-b border-stone-100 last:border-none">
                    <td className="py-3.5 font-semibold text-stone-800">
                      {item.productNameSnapshot}
                    </td>
                    <td className="py-3.5 text-stone-600">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="py-3.5 text-stone-600">
                      {item.quantity.toLocaleString("fa-IR")}
                    </td>
                    <td className="py-3.5 font-bold text-stone-900">
                      {formatPrice(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="rounded-3xl border border-stone-200/80 bg-white p-6">
          <h2 className="text-base font-black text-stone-900">خلاصه پرداخت</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-stone-500">جمع کالاها</dt>
              <dd className="font-bold text-stone-800">
                {formatPrice(data.totalAmount)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-stone-500">هزینه ارسال</dt>
              <dd className="font-semibold text-emerald-300">رایگان</dd>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-stone-200 pt-4">
              <dt className="font-bold text-stone-700">مبلغ کل</dt>
              <dd className="text-lg font-black text-brand-800">
                {formatPrice(data.totalAmount)}
              </dd>
            </div>
          </dl>

          <p className="mt-5 rounded-xl bg-stone-50 px-4 py-3 text-[11px] leading-5 text-stone-500">
            در صورت نیاز به تغییر یا لغو سفارش، از طریق پشتیبانی اقدام کنید.
          </p>
        </aside>
      </div>
    </div>
  );
}
