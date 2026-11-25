import type { OrderStatus, PaymentStatus } from "./types";

const priceFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatPrice(value: number): string {
  return `${priceFormatter.format(Math.round(value))} تومان`;
}

export function formatNumber(value: number): string {
  return priceFormatter.format(value);
}

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string | Date): string {
  return dateTimeFormatter.format(new Date(value));
}

export function normalizeImage(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    /^https?:\/\//i.test(trimmed)
  ) {
    return trimmed;
  }
  return `${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

export function absoluteImage(url: string | null | undefined): string | null {
  const normalized = normalizeImage(url);
  if (!normalized) return null;
  if (normalized.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}${normalized}`;
  }
  return normalized;
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "در انتظار تأیید",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  processing: {
    label: "در حال پردازش",
    className: "bg-sky-50 text-sky-700 ring-sky-200",
  },
  shipped: {
    label: "ارسال شده",
    className: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  },
  delivered: {
    label: "تحویل شده",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  cancelled: {
    label: "لغو شده",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  failed: {
    label: "منقضی شده",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  },
};

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  unpaid: {
    label: "پرداخت نشده",
    className: "bg-stone-100 text-stone-600 ring-stone-200",
  },
  paid: {
    label: "پرداخت شده",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  refunded: {
    label: "بازگشت وجه",
    className: "bg-sky-50 text-sky-700 ring-sky-200",
  },
};

export function cartTotal(
  items: { totalPrice: number; quantity: number; product: { price: number } }[],
): number {
  return items.reduce(
    (sum, item) => sum + (item.totalPrice || item.product.price * item.quantity),
    0,
  );
}
