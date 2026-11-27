"use client";

import Link from "next/link";

import { Button, buttonStyles, OrderSummary } from "@/components/ui";
import type { CartItem } from "@/lib/types";

interface OrderSummaryCardProps {
  items: CartItem[];
  subtotal: number;
  deliveryPrice: number;
  totalAmount: number;
  discountAmount: number;
  orderPlaced: boolean;
  needsReceipt: boolean;
  loading: boolean;
  disabled: boolean;
  onAction: () => void;
  receiptFile: File | null;
  onReceiptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPickReceipt: () => void;
}

export function OrderSummaryCard({
  items,
  subtotal,
  deliveryPrice,
  totalAmount,
  discountAmount,
  orderPlaced,
  needsReceipt,
  loading,
  disabled,
  onAction,
  receiptFile,
  onReceiptChange,
  onPickReceipt,
}: OrderSummaryCardProps) {
  return (
    <OrderSummary
      items={items}
      subtotal={subtotal}
      deliveryPrice={deliveryPrice}
      totalAmount={totalAmount}
      discountAmount={discountAmount}
      deliveryLabel="هزینه ارسال"
      actionLabel={
        orderPlaced
          ? needsReceipt
            ? "آپلود فیش و نهایی کردن"
            : "مشاهده سفارش"
          : "ثبت نهایی سفارش"
      }
      onAction={onAction}
      loading={loading}
      disabled={disabled}
      variant="checkout"
      footer={
        <>
          {!orderPlaced && (
            <Link
              href="/cart"
              className={buttonStyles({
                variant: "ghost",
                size: "sm",
                className: "mt-2 w-full",
              })}
            >
              بازگشت به سبد خرید
            </Link>
          )}
          {orderPlaced && needsReceipt && (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                بارگذاری فیش پرداخت
              </p>
              <label className="block">
                <Button
                  onClick={onPickReceipt}
                  disabled={loading}
                  size="sm"
                  className="w-full"
                >
                  انتخاب فیش
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onReceiptChange}
                  className="sr-only"
                />
              </label>
              {receiptFile && (
                <p className="text-[11px] text-stone-500 mt-1">
                  فیش انتخاب شده: {receiptFile.name}
                </p>
              )}
            </div>
          )}
        </>
      }
    />
  );
}