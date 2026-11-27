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
  formatNumber,
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
      <div className="space-y-4 py-10 container-page">
        <Skeleton className="rounded-xl w-48 h-9" />
        <Skeleton className="rounded-3xl w-full h-40" />
        <Skeleton className="rounded-3xl w-full h-64" />
      </div>
    );
  }

  if (order.isError || !order.data) {
    return (
      <div className="py-16 container-page">
        <EmptyState
          title="سفارش یافت نشد"
          description={
            order.isError
              ? apiErrorMessage(order.error)
              : "این سفارش در دسترس نیست."
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
    <div className="py-10 container-page">
      <div className="mb-6">
        <Link
          href="/orders"
          className="font-semibold text-stone-500 hover:text-brand-800 text-xs transition"
        >
          → بازگشت به سفارش‌ها
        </Link>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="font-black text-stone-900 text-2xl sm:text-3xl tracking-tight">
            سفارش #{data.id.slice(0, 8)}
          </h1>
          <p className="mt-2 text-stone-500 text-sm">
            ثبت‌شده در {formatDateTime(data.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label={status.label} className={status.className} />
          <StatusBadge label={payment.label} className={payment.className} />
        </div>
      </div>

      {data.status === "cancelled" ? (
        <div className="bg-rose-500/10 mt-6 p-4 border border-rose-400/30 rounded-2xl font-semibold text-rose-300 text-sm">
          این سفارش لغو شده است. در صورت پرداخت، مبلغ طی فرآیند بازگشت وجه
          واریز می‌شود.
        </div>
      ) : (
        <ol className="gap-2 grid grid-cols-4 mt-8">
          {PROGRESS_STEPS.map((step, index) => {
            const active = index <= currentStep;
            return (
              <li key={step.status} className="text-center">
                <div className="flex items-center">
                  <span
                    className={cn(
                      "flex justify-center items-center mx-auto rounded-full ring-4 w-8 h-8 font-black text-xs",
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
                    "mt-2 font-bold text-[11px]",
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

      <div className="items-start gap-6 grid lg:grid-cols-[1fr_340px] mt-8">
        <section className="bg-white p-6 border border-stone-200/80 rounded-3xl">
          <h2 className="font-black text-stone-900 text-base">اقلام سفارش</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm text-right">
              <thead>
                <tr className="border-stone-200 border-b text-[11px] text-stone-500">
                  <th className="py-3 font-semibold">محصول</th>
                  <th className="py-3 font-semibold">قیمت واحد</th>
                  <th className="py-3 font-semibold">تعداد</th>
                  <th className="py-3 font-semibold">جمع</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-stone-100 border-b last:border-none">
                    <td className="py-3.5 font-semibold text-stone-800">
                      {item.productNameSnapshot}
                    </td>
                    <td className="py-3.5 text-stone-600">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="py-3.5 text-stone-600">
                      {formatNumber(item.quantity)}
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

        <aside className="bg-white p-6 border border-stone-200/80 rounded-3xl">
          <h2 className="font-black text-stone-900 text-base">خلاصه پرداخت</h2>
          <dl className="space-y-3 mt-4 text-sm">
            <div className="flex justify-between items-center">
              <dt className="text-stone-500">جمع کالاها</dt>
              <dd className="font-bold text-stone-800">
                {formatPrice(data.totalAmount)}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-stone-500">هزینه ارسال</dt>
              <dd className="font-semibold text-emerald-300">رایگان</dd>
            </div>
            <div className="flex justify-between items-center pt-4 border-stone-200 border-t border-dashed">
              <dt className="font-bold text-stone-700">مبلغ کل</dt>
              <dd className="font-black text-brand-800 text-lg">
                {formatPrice(data.totalAmount)}
              </dd>
            </div>
          </dl>

          <p className="bg-stone-50 mt-5 px-4 py-3 rounded-xl text-[11px] text-stone-500 leading-5">
            در صورت نیاز به تغییر یا لغو سفارش، از طریق پشتیبانی اقدام کنید.
          </p>
        </aside>
      </div>
    </div>
  );
}