"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
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

  const needsReceipt =
    Boolean(data?.paymentMethod) &&
    RECEIPT_REQUIRED_TYPES.has(data.paymentMethod as any);
  const hasReceipt = Boolean(data?.receiptImageUrl);
  const isReceiptRejected =
    hasReceipt && data.paymentStatus === "unpaid" && Boolean(data.rejectionReason);

  const canUploadReceipt = needsReceipt || isReceiptRejected;

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

  return (
    <>
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

      {canUploadReceipt && (!hasReceipt || isReceiptRejected) && (
        <div className="mt-6 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-5 lg:p-6">
            <div className="flex shrink-0 items-center justify-center rounded-xl bg-amber-100 p-3 text-amber-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900">
                {isReceiptRejected ? "بارگذاری فیش پرداخت جدید" : "بارگذاری فیش پرداخت"}
              </h3>
              <p className="mt-1 text-sm text-amber-700/90 leading-relaxed">
                {isReceiptRejected
                  ? "فیش قبلی شما توسط ادمین رد شد. لطفا فیش صحیح را بارگذاری کنید."
                  : "روش پرداخت شما نیاز به بارگذاری فیش دارد. لطفا فیش پرداخت را بارگذاری کنید تا ادمین بتواند آن را بررسی نماید."}
              </p>
            </div>
          </div>
          <div className="bg-amber-50/50 border-t border-amber-100 p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="block cursor-pointer flex-1">
                <Button
                  onClick={() => receiptInputRef.current?.click()}
                  disabled={uploadReceipt.isPending}
                  className="w-full bg-amber-900 hover:bg-amber-800 text-white shadow-sm"
                >
                  {uploadReceipt.isPending ? "در حال بارگذاری..." : "انتخاب فیش"}
                </Button>
                <input
                  ref={receiptInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptChange}
                  className="sr-only"
                />
              </label>
              {receiptFile && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 max-w-sm">
                  <span className="text-xs text-amber-700 truncate">
                    فیش انتخاب شده: {receiptFile.name}
                  </span>
                  <Button
                    onClick={handleUploadReceipt}
                    disabled={uploadReceipt.isPending}
                    className="bg-amber-900 hover:bg-amber-800 text-white shadow-sm"
                  >
                    {uploadReceipt.isPending ? "در حال ارسال..." : "ارسال فیش"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {hasReceipt && data.paymentStatus === "paid" && (
        <div className="mt-6 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-5 lg:p-6">
            <div className="flex shrink-0 items-center justify-center rounded-xl bg-emerald-100 p-3 text-emerald-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-emerald-900">فیش پرداخت تایید شد</h3>
              <p className="mt-1 text-sm text-emerald-700/90">
                فیش پرداخت شما توسط ادمین تایید شد.
              </p>
            </div>
          </div>
          <div className="bg-emerald-50/50 border-t border-emerald-100 p-4 lg:p-5">
            <Button
              onClick={() => setImageViewerOpen(true)}
              className="bg-emerald-900 hover:bg-emerald-800 text-white shadow-sm"
            >
              نمایش فیش
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {hasReceipt && data.paymentStatus === "unpaid" && data.rejectionReason && (
        <div className="mt-6 rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-5 lg:p-6">
            <div className="flex shrink-0 items-center justify-center rounded-xl bg-rose-100 p-3 text-rose-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-rose-900">فیش پرداخت رد شد</h3>
              <p className="mt-1 text-sm text-rose-700/90">
                فیش پرداخت شما توسط ادمین رد شد.
              </p>
              <div className="mt-2 text-sm text-rose-700/90 italic">
                «{data.rejectionReason}»
              </div>
            </div>
          </div>
          <div className="bg-rose-50/50 border-t border-rose-100 p-4 lg:p-5">
            <Button
              onClick={() => setImageViewerOpen(true)}
              className="bg-rose-900 hover:bg-rose-800 text-white shadow-sm"
            >
              نمایش فیش
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {hasReceipt && data.paymentStatus === "unpaid" && !data.rejectionReason && (
        <div className="mt-6 rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-5 lg:p-6">
            <div className="flex shrink-0 items-center justify-center rounded-xl bg-amber-100 p-3 text-amber-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900">فیش پرداخت بارگذاری شده</h3>
              <p className="mt-1 text-sm text-amber-700/90">
                فیش پرداخت شما بارگذاری شده و در انتظار تایید ادمین است.
              </p>
            </div>
          </div>
          <div className="bg-amber-50/50 border-t border-amber-100 p-4 lg:p-5">
            <Button
              onClick={() => setImageViewerOpen(true)}
              className="bg-amber-900 hover:bg-amber-800 text-white shadow-sm"
            >
              نمایش فیش
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {data.status === "cancelled" ? (
        <div className="mt-6 rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white shadow-sm overflow-hidden p-6">
          <div className="flex items-start gap-3">
            <div className="flex shrink-0 items-center justify-center rounded-xl bg-rose-100 p-3 text-rose-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">سفارش لغو شده</h3>
              <p className="mt-1 text-sm text-rose-700/90 leading-relaxed">
                این سفارش لغو شده است. در صورت پرداخت، مبلغ طی فرآیند بازگشت وجه واریز می‌شود.
              </p>
            </div>
          </div>
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
              <dd className="font-semibold text-emerald-600">رایگان</dd>
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

    <ImageViewer
      open={imageViewerOpen}
      onClose={() => setImageViewerOpen(false)}
      src={data.receiptImageUrl ?? null}
      title="فیش پرداخت"
    />
      </>
  );
}
