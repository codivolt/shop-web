"use client";

import { CheckoutStep } from "@/components/ui";

interface DiscountStepProps {
  code: string;
  appliedCode: string | null;
  amount: number;
  isPending: boolean;
  onCodeChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
}

export function DiscountStep({
  code,
  appliedCode,
  amount,
  isPending,
  onCodeChange,
  onApply,
  onRemove,
}: DiscountStepProps) {
  return (
    <CheckoutStep number={4} title="کد تخفیف">
      <div className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
            placeholder="کد تخفیف را وارد کنید"
            className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
            disabled={isPending || appliedCode !== null}
          />
          {appliedCode ? (
            <button
              type="button"
              onClick={onRemove}
              className="px-4 py-3 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors font-medium"
            >
              حذف
            </button>
          ) : (
            <button
              type="button"
              onClick={onApply}
              disabled={isPending || !code.trim()}
              className="px-4 py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "در حال بررسی..." : "اعمال"}
            </button>
          )}
        </div>
        {appliedCode && (
          <p className="mt-2 text-sm text-emerald-300 font-medium">
            ✓ کد <span className="font-mono">{appliedCode}</span> اعمال شد — تخفیف:{" "}
            {amount.toLocaleString()} تومان
          </p>
        )}
      </div>
    </CheckoutStep>
  );
}