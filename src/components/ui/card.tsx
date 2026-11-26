"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { ProductImage } from "@/components/product/product-image";
import { Badge, BadgeTone } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export type CardVariant =
  | "default"
  | "elevated"
  | "outlined"
  | "filled"
  | "interactive"
  | "selection";

export interface BaseCardProps {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  as?: "div" | "article" | "section";
  padding?: "none" | "sm" | "md" | "lg";
}

const variantStyles: Record<CardVariant, string> = {
  default: "border border-white/10 bg-ink-800 shadow-sm shadow-black/40",
  elevated: "border border-white/10 bg-ink-800 shadow-lg shadow-black/50",
  outlined: "border-2 border-white/10 bg-ink-800",
  filled: "bg-ink-900 border border-white/5",
  interactive: "border border-white/10 bg-ink-800 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-xl hover:shadow-black/60",
  selection: "border border-white/10 bg-ink-800 transition cursor-pointer hover:border-brand-400/50",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4 sm:p-5",
  lg: "p-6",
};

export function Card({
  variant = "default",
  className,
  children,
  onClick,
  as = "div",
  padding = "md",
}: BaseCardProps) {
  const Component = as;
  const isInteractive = variant === "interactive" || variant === "selection" || onClick;

  return (
    <Component
      className={cn(
        "rounded-3xl overflow-hidden",
        variantStyles[variant],
        paddingStyles[padding],
        className,
        isInteractive && "cursor-pointer",
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }} : undefined}
    >
      {children}
    </Component>
  );
}

export interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function ProductCardComponent({ product, variant = "default", className }: ProductCardProps) {
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  if (variant === "compact") {
    return (
      <Link
        href={`/products/${product.slug}`}
        className={cn(
          "group flex gap-3 rounded-xl border border-white/10 bg-ink-800 p-3 transition hover:border-brand-400/40 hover:shadow-lg hover:shadow-black/50",
          className,
        )}
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-900">
          <ProductImage src={product.imageUrl} alt={product.name} sizes="64px" className="transition duration-300 group-hover:scale-105" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-bold text-stone-800 group-hover:text-brand-800 transition-colors">
            {product.name}
          </p>
          {product.brand && <p className="mt-0.5 text-[11px] text-stone-400">{product.brand.name}</p>}
          <p className="mt-1.5 text-sm font-black text-stone-900">{formatPrice(product.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <article className={cn("group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-800 shadow-sm shadow-black/40 transition duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-xl hover:shadow-black/60", className)}>
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-ink-900">
        <ProductImage src={product.imageUrl} alt={product.name} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {product.category ? (
            <Badge tone="neutral" className="bg-black/60 backdrop-blur">{product.category.name}</Badge>
          ) : null}
          {outOfStock ? (
            <Badge tone="danger">ناموجود</Badge>
          ) : lowStock ? (
            <Badge tone="warning">{product.stock.toLocaleString("fa-IR")} عدد باقی‌مانده</Badge>
          ) : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-h-11">
          <Link href={`/products/${product.slug}`} className="line-clamp-2 text-sm font-bold leading-6 text-stone-800 transition hover:text-brand-800">
            {product.name}
          </Link>
          {product.brand ? <p className="mt-1 text-xs text-stone-400">{product.brand.name}</p> : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <span className="text-[11px] text-stone-400">قیمت</span>
            <p className="text-base font-black text-stone-900">{formatPrice(product.price)}</p>
          </div>
          <Link href={`/products/${product.slug}`} aria-label={`مشاهده ${product.name}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-stone-400 transition hover:bg-brand-500 hover:text-ink-950">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, variant = "default", className }: { products: Product[]; variant?: "default" | "compact"; className?: string }) {
  if (variant === "compact") {
    return (
      <div className={cn("space-y-2", className)}>
        {products.map((product) => (
          <ProductCardComponent key={product.id} product={product} variant="compact" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {products.map((product) => (
        <ProductCardComponent key={product.id} product={product} variant="default" />
      ))}
    </div>
  );
}

export interface CategoryCardProps {
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  count?: number;
  children?: Array<{ name: string; slug: string }>;
  index?: number;
  className?: string;
}

export function CategoryCard({ name, description, slug, imageUrl, count, children, index, className }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${slug}`}
      className={cn(
        "group flex flex-col rounded-3xl border border-white/10 bg-ink-800 p-6 transition hover:border-brand-400/40 hover:shadow-lg hover:shadow-black/50",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 text-sm font-black text-brand-300">
          {index !== undefined ? String(index + 1).padStart(2, "0") : ""}
        </span>
        <span className="rounded-full bg-white/5 px-3 py-1.5 text-[11px] font-bold text-stone-500 transition group-hover:bg-brand-500 group-hover:text-ink-950">
          مشاهده محصولات
        </span>
      </div>

      <p className="mt-5 text-lg font-black text-stone-900 transition hover:text-brand-800">{name}</p>
      <p className="mt-2 min-h-10 text-xs leading-5 text-stone-500">{description ?? "محصولات این دسته‌بندی را ببینید."}</p>

      {children && children.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {children.map((child) => (
            <Link
              key={child.slug}
              href={`/products?category=${child.slug}`}
              className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-stone-500 transition hover:border-brand-400/50 hover:bg-brand-500/10 hover:text-brand-300"
            >
              {child.name}
            </Link>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

export interface OrderCardProps {
  id: string;
  totalAmount: number;
  status: { label: string; className: string };
  paymentStatus: { label: string; className: string };
  createdAt: string;
  items: Array<{ productNameSnapshot: string }>;
  href: string;
  className?: string;
}

export function OrderCard({ id, totalAmount, status, paymentStatus, createdAt, items, href, className }: OrderCardProps) {
  return (
    <Link href={href} className={cn("block rounded-2xl border border-white/10 bg-ink-800 p-4 transition hover:border-brand-400/40 hover:shadow-lg hover:shadow-black/50", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-stone-500">سفارش #{id.slice(0, 8)}</p>
          <p className="mt-1 text-sm font-black text-stone-900">{formatPrice(totalAmount)}</p>
          <p className="mt-1 text-[11px] text-stone-400">{createdAt}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold", status.className)}>{status.label}</span>
          <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold", paymentStatus.className)}>{paymentStatus.label}</span>
        </div>
      </div>
      <p className="mt-3 line-clamp-1 border-t border-stone-100 pt-2 text-xs text-stone-500">{items.map((item) => item.productNameSnapshot).join("، ")}</p>
    </Link>
  );
}

export interface CartItemCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string | null;
    stock: number;
  };
  quantity: number;
  onQuantityChange: (next: number) => void;
  onRemove: () => void;
  isUpdating?: boolean;
  isRemoving?: boolean;
  className?: string;
}

export function CartItemCard({ product, quantity, onQuantityChange, onRemove, isUpdating, isRemoving, className }: CartItemCardProps) {
  const max = Math.max(1, product.stock);

  return (
    <div className={cn("flex gap-4 rounded-2xl border border-white/10 bg-ink-800 p-4", className)}>
      <Link href={`/products/${product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-900">
        <ProductImage src={product.imageUrl} alt={product.name} sizes="96px" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/products/${product.slug}`} className="line-clamp-2 text-sm font-bold text-stone-800 transition hover:text-brand-800">
              {product.name}
            </Link>
            <p className="mt-1 text-xs text-stone-400">قیمت واحد: {formatPrice(product.price)}</p>
          </div>
          <button
            type="button"
            aria-label="حذف از سبد"
            onClick={onRemove}
            disabled={isRemoving}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-rose-500/15 hover:text-rose-300 disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 7h14M10 11v6M14 11v6M8 7l1-2h6l1 2m-9 0 1 13h8l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper value={quantity} onChange={onQuantityChange} min={1} max={max} size="sm" disabled={isUpdating} />
          <p className="text-sm font-black text-stone-900">{formatPrice(product.price * quantity)}</p>
        </div>
      </div>
    </div>
  );
}

function QuantityStepper({ value, onChange, min = 1, max = 99, disabled, size = "md" }: { value: number; onChange: (next: number) => void; min?: number; max?: number; disabled?: boolean; size?: "sm" | "md" }) {
  const buttonClass = "flex items-center justify-center text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className={cn("inline-flex items-center overflow-hidden rounded-xl border border-white/10 bg-ink-800", size === "sm" ? "h-9" : "h-11", disabled && "opacity-60")}>
      <button type="button" aria-label="افزایش تعداد" disabled={disabled || value >= max} onClick={() => onChange(Math.min(max, value + 1))} className={cn(buttonClass, size === "sm" ? "h-9 w-9" : "h-11 w-11")}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
      <span className={cn("min-w-8 text-center text-sm font-bold text-stone-800 tabular-nums", size === "sm" ? "px-1" : "px-2")}>{value}</span>
      <button type="button" aria-label="کاهش تعداد" disabled={disabled || value <= min} onClick={() => onChange(Math.max(min, value - 1))} className={cn(buttonClass, size === "sm" ? "h-9 w-9" : "h-11 w-11")}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

export interface AddressCardProps {
  id: string;
  title?: string | null;
  province: string | null;
  city: string | null;
  addressLine: string | null;
  recipientName?: string | null;
  phone?: string | null;
  isDefault?: boolean;
  selected?: boolean;
  onSelect: () => void;
  className?: string;
}

export function AddressCard({ id, title, province, city, addressLine, recipientName, phone, isDefault, selected, onSelect, className }: AddressCardProps) {
  return (
    <label className={cn("relative cursor-pointer rounded-2xl border p-4 transition", selected ? "border-brand-400 bg-brand-500/10 ring-2 ring-brand-500/25" : "border-white/10 hover:border-white/25", className)}>
      <input type="radio" name="address" value={id} checked={selected} onChange={onSelect} className="sr-only" />
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-stone-800">{title ?? "آدرس"}</p>
        {isDefault && <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">پیش‌فرض</span>}
      </div>
      <p className="mt-2 text-xs leading-6 text-stone-600">{province}، {city}، {addressLine}</p>
      <p className="mt-2 text-[11px] text-stone-400">{recipientName ?? "گیرنده"}{phone ? ` — ${phone}` : ""}</p>
    </label>
  );
}

export interface DeliveryMethodCardProps {
  id: string;
  name: string | null;
  description?: string | null;
  price: number | null;
  selected?: boolean;
  onSelect: () => void;
  className?: string;
}

export function DeliveryMethodCard({ id, name, description, price, selected, onSelect, className }: DeliveryMethodCardProps) {
  return (
    <label className={cn("relative cursor-pointer rounded-xl border p-3 transition", selected ? "border-brand-400 bg-brand-500/10 ring-2 ring-brand-500/25" : "border-white/10 hover:border-white/25", className)}>
      <input type="radio" name="delivery" value={id} checked={selected} onChange={onSelect} className="sr-only" />
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-stone-800">{name ?? ""}</p>
          {description && <p className="mt-1 text-[11px] text-stone-500">{description}</p>}
        </div>
        <p className="text-xs font-bold text-stone-800">{price === 0 || price == null ? "رایگان" : formatPrice(price)}</p>
      </div>
    </label>
  );
}

export interface PaymentMethodCardProps {
  id: string;
  name: string | null;
  type: string | null;
  bankName?: string | null;
  cardNumber?: string | null;
  sheba?: string | null;
  cryptoAddress?: string | null;
  selected?: boolean;
  onSelect: () => void;
  requiresReceipt?: boolean;
  className?: string;
}

export function PaymentMethodCard({ id, name, type, bankName, cardNumber, sheba, cryptoAddress, selected, onSelect, requiresReceipt, className }: PaymentMethodCardProps) {
  return (
    <label className={cn("relative cursor-pointer rounded-xl border p-3 transition flex flex-col", selected ? "border-brand-400 bg-brand-500/10 ring-2 ring-brand-500/25" : "border-white/10 hover:border-white/25", className)}>
      <input type="radio" name="payment" value={id} checked={selected} onChange={onSelect} className="sr-only" />
      <div className="flex items-start gap-2 mb-1">
        <p className="text-sm font-bold text-stone-800">{name}</p>
        {requiresReceipt && <span className="text-[10px] font-bold text-brand-300 bg-brand-500/15 px-2 py-0.5 rounded">بارگذاری فیش الزامی است</span>}
      </div>
      {bankName && <p className="mt-1 text-[11px] text-stone-500">{bankName}</p>}
      {cardNumber && <p className="mt-1 text-[11px] font-mono text-stone-600">{cardNumber}</p>}
      {sheba && <p className="mt-1 text-[11px] font-mono text-stone-600">{sheba}</p>}
      {cryptoAddress && <p className="mt-1 text-[11px] text-stone-600">{cryptoAddress}</p>}
    </label>
  );
}