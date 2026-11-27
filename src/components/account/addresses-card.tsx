"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Address } from "@/lib/types";

interface AddressesCardProps {
  addresses: Address[] | undefined;
  isLoading: boolean;
  isDeleting: boolean;
  isSetDefault: boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function AddressesCard({
  addresses,
  isLoading,
  isDeleting,
  isSetDefault,
  onAdd,
  onDelete,
  onSetDefault,
}: AddressesCardProps) {
  return (
    <section className="rounded-3xl border border-stone-200/80 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-black text-stone-900">آدرس‌های من</h2>
        <Button size="sm" onClick={onAdd}>
          افزودن آدرس
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-5 space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      ) : !addresses || addresses.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="آدرسی ثبت نشده است"
            description="برای ثبت سفارش، حداقل یک آدرس تحویل اضافه کنید."
          >
            <Button size="sm" onClick={onAdd}>
              افزودن آدرس
            </Button>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-2xl border border-stone-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-stone-800">
                  {address.title ?? "آدرس"}
                </p>
                {address.isDefault ? (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    پیش‌فرض
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-xs leading-6 text-stone-600">
                {address.province}، {address.city}، {address.addressLine}
              </p>
              <p className="mt-1 text-[11px] text-stone-400">
                {address.recipientName ?? "گیرنده"}
                {address.phone ? ` — ${address.phone}` : ""}
              </p>
              <div className="mt-3 flex gap-2">
                {!address.isDefault ? (
                  <button
                    type="button"
                    onClick={() => onSetDefault(address.id)}
                    disabled={isSetDefault}
                    className="text-[11px] font-semibold text-brand-700 hover:underline disabled:opacity-50"
                  >
                    پیش‌فرض شود
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onDelete(address.id)}
                  disabled={isDeleting}
                  className="text-[11px] font-semibold text-rose-300 hover:underline disabled:opacity-50"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}