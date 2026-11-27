"use client";

import { AddressForm } from "@/components/account/address-form";
import { AddressCard, CheckoutStep, Skeleton } from "@/components/ui";
import type { Address } from "@/lib/types";

interface AddressStepProps {
  addresses: Address[];
  selectedId: string | null;
  isLoading: boolean;
  formVisible: boolean;
  onSelect: (id: string) => void;
  onToggleForm: () => void;
  onCreated: (address: Address) => void;
}

export function AddressStep({
  addresses,
  selectedId,
  isLoading,
  formVisible,
  onSelect,
  onToggleForm,
  onCreated,
}: AddressStepProps) {
  return (
    <CheckoutStep number={2} title="آدرس تحویل">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-black text-stone-900" />
        {addresses.length > 0 ? (
          <button
            type="button"
            onClick={onToggleForm}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            {formVisible ? "بستن فرم" : "افزودن آدرس جدید +"}
          </button>
        ) : null}
      </div>

      {isLoading ? (
        <div className="mt-4 space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : addresses.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              id={address.id}
              title={address.title}
              province={address.province}
              city={address.city}
              addressLine={address.addressLine}
              recipientName={address.recipientName}
              phone={address.phone}
              isDefault={address.isDefault}
              selected={selectedId === address.id}
              onSelect={() => onSelect(address.id)}
            />
          ))}
        </div>
      ) : null}

      {formVisible ? (
        <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-5">
          <p className="mb-4 text-xs font-bold text-stone-600">ثبت آدرس جدید</p>
          <AddressForm
            onCreated={onCreated}
            onCancel={addresses.length > 0 ? onToggleForm : undefined}
          />
        </div>
      ) : null}
    </CheckoutStep>
  );
}