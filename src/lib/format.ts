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
    className: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  },
  processing: {
    label: "در حال پردازش",
    className: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
  },
  shipped: {
    label: "ارسال شده",
    className: "bg-indigo-500/15 text-indigo-300 ring-indigo-400/30",
  },
  delivered: {
    label: "تحویل شده",
    className: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  },
  cancelled: {
    label: "لغو شده",
    className: "bg-rose-500/15 text-rose-300 ring-rose-400/30",
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
    className: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  },
  refunded: {
    label: "بازگشت وجه",
    className: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
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
