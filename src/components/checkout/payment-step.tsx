"use client";

import { CheckoutStep, PaymentMethodCard } from "@/components/ui";
import { requiresReceipt } from "@/lib/checkout";
import type { PaymentAccount } from "@/lib/types";

interface PaymentStepProps {
  accounts: PaymentAccount[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PaymentStep({ accounts, selectedId, onSelect }: PaymentStepProps) {
  return (
    <CheckoutStep number={3} title="روش پرداخت">
      {accounts.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-5 text-center">
          <p className="text-sm text-stone-500">
            روش پرداخت تعریف نشده است. با پشتیبانی تماس بگیرید.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {accounts.map((account) => (
            <PaymentMethodCard
              key={account.id}
              id={account.id}
              name={account.name}
              type={account.type}
              bankName={account.bankName}
              cardNumber={account.cardNumber}
              sheba={account.sheba}
              cryptoAddress={account.cryptoAddress}
              selected={selectedId === account.id}
              onSelect={() => onSelect(account.id)}
              requiresReceipt={requiresReceipt(account.type)}
            />
          ))}
        </div>
      )}
    </CheckoutStep>
  );
}