"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { RequireAuth } from "@/components/auth/require-auth";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui";
import { ImageViewer } from "@/components/ui/ImageViewer";
import { useOrder, useUploadReceipt } from "@/hooks/use-orders";
import { apiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import {
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  formatDateTime,
  formatPrice,
} from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const RECEIPT_REQUIRED_TYPES = new Set([
  "card_to_card",
  "sheba",
  "crypto",
]);

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
  const uploadReceipt = useUploadReceipt();
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const data = order.data;
  const isLoading = order.isLoading && !data;
  const isError = order.isError || !data;

  const status = data ? ORDER_STATUS_META[data.status] : null;
  const payment = data ? PAYMENT_STATUS_META[data.paymentStatus] : null;

  const needsReceipt =
    data &&
    Boolean(data.paymentMethod) &&
    RECEIPT_REQUIRED_TYPES.has(data.paymentMethod as any);
  const hasReceipt = Boolean(data?.receiptImageUrl);
  const sortedHistory = [...(data?.receiptHistory ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const latestHistory = sortedHistory[0];
  const isReceiptPending =
    hasReceipt && latestHistory?.status === "pending";
  const isReceiptRejected =
    (hasReceipt && latestHistory?.status === "rejected") ||
    Boolean(data?.rejectionReason);
  const isReceiptApproved =
    hasReceipt && latestHistory?.status === "approved";

  const canUploadReceipt = needsReceipt || isReceiptRejected;

  // Countdown timer for receipt resubmission deadline
  useEffect(() => {
    if (
      !data?.receiptDeadline ||
      !isReceiptRejected ||
      data.status === "failed"
    ) {
      setRemainingSeconds(0);
      return;
    }

    const deadline = new Date(data.receiptDeadline).getTime();
    const updateTimer = () => {
      const now = Date.now();
      const diff = deadline - now;
      if (diff <= 0) {
        setRemainingSeconds(0);
      } else {
        setRemainingSeconds(Math.ceil(diff / 1000));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [data?.receiptDeadline, isReceiptRejected, data?.status]);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  const timeLeft =
    remainingSeconds > 0
      ? `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : null;

  const isReceiptExpired =
    isReceiptRejected &&
    data?.receiptDeadline &&
    new Date(data.receiptDeadline) <= new Date();

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setReceiptFile(file);
  };

  const handleUploadReceipt = async () => {
    if (!id || !receiptFile) return;
    try {
      await uploadReceipt.mutateAsync({ orderId: id, file: receiptFile });
      setReceiptFile(null);
      receiptInputRef.current?.value && (receiptInputRef.current.value = "");
      toast.success("فیش پرداخت بارگذاری شد");
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const isOrderFinal = data
    ? data.status === "cancelled" || data.status === "failed"
    : false;

  if (isLoading) {
    return (
      <div className="container-page space-y-4 py-10">
        <Skeleton className="h-9 w-48 rounded-xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-page py-16">
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

  const currentStep = PROGRESS_STEPS.findIndex(
    (step) => step.status === data.status,
  );

  return (
    <>
      <div className="container-page py-10">
        <div className="mb-6">
          <Link
            href="/orders"
            className="group inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-500 shadow-sm transition hover:border-brand-200 hover:text-brand-800"
          >
            <span className="transition group-hover:-translate-x-0.5">→</span>
            بازگشت به سفارش‌ها
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
            <StatusBadge
              label={status!.label}
              className={cn(status!.className, "shadow-sm")}
            />
            <StatusBadge
              label={payment!.label}
              className={cn(payment!.className, "shadow-sm")}
            />
          </div>
        </div>

        {data.status === "failed" && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex shrink-0 items-center justify-center rounded-xl bg-rose-100 p-3 text-rose-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-rose-900">
                  سفارش منقضی شده
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-rose-700/90">
                  مهلت بارگذاری فیش پرداخت به پایان رسید و سفارش شما به دلیل عدم
                  پرداخت منقضی شد.
                </p>
              </div>
            </div>
            <div className="border-t border-rose-100 bg-rose-50/50 p-4 sm:p-5">
              <Button
                onClick={() => {
                  window.location.href = "/cart";
                }}
                className="w-full bg-rose-900 text-white shadow-sm hover:bg-rose-800 sm:w-auto"
              >
                ثبت سفارش جدید
              </Button>
            </div>
          </div>
        )}

        {canUploadReceipt && (!hasReceipt || isReceiptRejected) && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[13px] font-bold text-amber-900">
                  {isReceiptRejected
                    ? "بارگذاری فیش پرداخت جدید"
                    : "بارگذاری فیش پرداخت"}
                </h3>
                <p className="mt-0.5 text-xs leading-5 text-amber-700/90">
                  {isReceiptRejected
                    ? "فیش قبلی شما توسط ادمین رد شد. لطفا فیش صحیح را بارگذاری کنید."
                    : "برای بررسی پرداخت، فیش پرداخت را بارگذاری کنید."}
                </p>
                {isReceiptRejected && timeLeft && (
                  <p className="mt-1 text-xs font-bold text-amber-600">
                    زمان باقی‌مانده: {timeLeft}
                  </p>
                )}
                {isReceiptRejected && isReceiptExpired && (
                  <p className="mt-1 text-xs font-bold text-rose-600">
                    مهلت بارگذاری فیش به پایان رسیده است.
                  </p>
                )}
              </div>
            </div>
            <input
              ref={receiptInputRef}
              type="file"
              accept="image/*"
              onChange={handleReceiptChange}
              className="sr-only"
            />
            {receiptFile ? (
              <div className="flex items-center gap-2 sm:shrink-0">
                <span className="max-w-[9rem] truncate text-xs text-amber-700">
                  فیش انتخاب شده: {receiptFile.name}
                </span>
                <Button
                  size="sm"
                  onClick={handleUploadReceipt}
                  disabled={uploadReceipt.isPending}
                  className="bg-amber-900 text-white shadow-sm hover:bg-amber-800"
                >
                  {uploadReceipt.isPending ? "در حال ارسال..." : "ارسال فیش"}
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => receiptInputRef.current?.click()}
                disabled={uploadReceipt.isPending}
                className="self-start bg-amber-900 text-white shadow-sm hover:bg-amber-800 sm:self-auto"
              >
                {uploadReceipt.isPending ? "در حال بارگذاری..." : "انتخاب فیش"}
              </Button>
            )}
          </div>
        )}

        {isReceiptApproved && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] font-bold text-emerald-900">
                فیش پرداخت تایید شد
              </h3>
              <p className="mt-0.5 text-xs leading-5 text-emerald-700/90">
                فیش پرداخت شما توسط ادمین تایید شد.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setImageViewerOpen(true)}
              className="shrink-0 bg-emerald-900 text-white shadow-sm hover:bg-emerald-800"
            >
              نمایش فیش
            </Button>
          </div>
        )}

        {isReceiptRejected && (
          <div className="mt-6 overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex shrink-0 items-center justify-center rounded-xl bg-rose-100 p-3 text-rose-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-rose-900">
                  فیش پرداخت رد شد
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-rose-700/90">
                  فیش پرداخت شما توسط ادمین رد شد.
                </p>
                {(latestHistory?.rejectionReason || data?.rejectionReason) && (
                  <div className="mt-2 text-sm italic text-rose-700/90">
                    «{latestHistory?.rejectionReason || data?.rejectionReason}»
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-rose-100 bg-rose-50/50 p-4 sm:p-5">
              <Button
                onClick={() => setImageViewerOpen(true)}
                className="bg-rose-900 text-white shadow-sm hover:bg-rose-800"
              >
                نمایش فیش
              </Button>
            </div>
          </div>
        )}

        {isReceiptPending && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] font-bold text-amber-900">
                در حال بررسی
              </h3>
              <p className="mt-0.5 text-xs leading-5 text-amber-700/90">
                فیش پرداخت شما بارگذاری شده و در انتظار تایید ادمین است.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setImageViewerOpen(true)}
              className="shrink-0 bg-amber-900 text-white shadow-sm hover:bg-amber-800"
            >
              نمایش فیش
            </Button>
          </div>
        )}

        {data.receiptHistory && data.receiptHistory.length > 1 && (
          <div className="mt-6 rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-stone-900">
              تاریخچه فیش‌ها
            </h3>
            <div className="space-y-3">
              {data.receiptHistory.map((h) => (
                <div
                  key={h.id}
                  className="flex items-start gap-3 rounded-xl border border-stone-200/50 bg-stone-50/50 p-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-600">
                    {h.status === "approved"
                      ? "✓"
                      : h.status === "rejected"
                        ? "✗"
                        : "⟳"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-stone-700">
                      {h.status === "approved"
                        ? "تایید شده"
                        : h.status === "rejected"
                          ? "رد شده"
                          : "در انتظار بررسی"}
                    </p>
                    {h.status === "rejected" && h.rejectionReason && (
                      <p className="mt-0.5 text-xs italic text-rose-600">
                        «{h.rejectionReason}»
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-stone-400">
                    {new Date(h.createdAt).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isOrderFinal && (
          <>
            <div className="mt-8 rounded-3xl border border-stone-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_16px_40px_-16px_rgba(28,25,23,0.10)] sm:p-7">
              <ol className="relative grid grid-cols-4 gap-2">
                <span
                  aria-hidden
                  className="absolute top-4 right-[12.5%] left-[12.5%] h-0.5 -translate-y-1/2 rounded-full bg-stone-100"
                />
                <span
                  aria-hidden
                  className="absolute top-4 right-[12.5%] h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-l from-brand-400 to-brand-600 transition-all duration-500"
                  style={{
                    width: `${(Math.max(currentStep, 0) / (PROGRESS_STEPS.length - 1)) * 75}%`,
                  }}
                />
                {PROGRESS_STEPS.map((step, index) => {
                  const active = index <= currentStep;
                  const isCurrent = index === currentStep;
                  return (
                    <li key={step.status} className="relative text-center">
                      <span
                        className={cn(
                          "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ring-4 transition-all duration-300",
                          active
                            ? "bg-gradient-to-br from-brand-500 to-brand-700 text-white ring-brand-100 shadow-md shadow-brand-700/20"
                            : "bg-stone-100 text-stone-400 ring-white",
                          isCurrent && "scale-110",
                        )}
                      >
                        {index + 1}
                      </span>
                      <p
                        className={cn(
                          "mt-2.5 text-[11px] font-bold transition-colors",
                          active ? "text-stone-800" : "text-stone-400",
                        )}
                      >
                        {step.label}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]">
              <section className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.04),0_16px_40px_-16px_rgba(28,25,23,0.10)]">
                <div className="flex items-center gap-2.5 border-b border-stone-100 px-6 py-5">
                  <span className="h-5 w-1 rounded-full bg-gradient-to-b from-brand-400 to-brand-600" />
                  <h2 className="text-base font-black text-stone-900">
                    اقلام سفارش
                  </h2>
                  <span className="mr-auto rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-bold text-stone-500">
                    {data.items.length.toLocaleString("fa-IR")} قلم
                  </span>
                </div>
                <div className="overflow-x-auto px-2">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="text-[11px] text-stone-500">
                        <th className="px-4 py-3 font-semibold">محصول</th>
                        <th className="px-4 py-3 font-semibold">قیمت واحد</th>
                        <th className="px-4 py-3 font-semibold">تعداد</th>
                        <th className="px-4 py-3 font-semibold">جمع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-stone-100 transition-colors hover:bg-stone-50/60"
                        >
                          <td className="px-4 py-3.5 font-semibold text-stone-800">
                            {item.productNameSnapshot}
                          </td>
                          <td className="px-4 py-3.5 text-stone-600">
                            {formatPrice(item.unitPrice)}
                          </td>
                          <td className="px-4 py-3.5 text-stone-600">
                            {item.quantity.toLocaleString("fa-IR")}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-stone-900">
                            {formatPrice(item.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <aside className="overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-[0_1px_2px_rgba(28,25,23,0.04),0_16px_40px_-16px_rgba(28,25,23,0.10)]">
                <div className="flex items-center gap-2.5 border-b border-stone-100 px-6 py-5">
                  <span className="h-5 w-1 rounded-full bg-gradient-to-b from-brand-400 to-brand-600" />
                  <h2 className="text-base font-black text-stone-900">
                    خلاصه پرداخت
                  </h2>
                </div>
                <div className="p-6">
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-stone-500">جمع کالاها</dt>
                      <dd className="font-bold text-stone-800">
                        {formatPrice(data.totalAmount)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-stone-500">هزینه ارسال</dt>
                      <dd className="font-semibold text-emerald-600">رایگان</dd>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 px-4 py-3.5 ring-1 ring-inset ring-brand-100">
                      <dt className="font-bold text-brand-900">مبلغ کل</dt>
                      <dd className="text-lg font-black text-brand-800">
                        {formatPrice(data.totalAmount)}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-5 rounded-xl bg-stone-50 px-4 py-3 text-[11px] leading-5 text-stone-500 ring-1 ring-inset ring-stone-100">
                    در صورت نیاز به تغییر یا لغو سفارش، از طریق پشتیبانی اقدام
                    کنید.
                  </p>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>

      <ImageViewer
        open={imageViewerOpen}
        onClose={() => setImageViewerOpen(false)}
        src={data.receiptImageUrl ?? null}
        title="فیش پرداخت"
      />
    </>
  );
}