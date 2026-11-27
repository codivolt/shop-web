"use client";

import { CheckoutStep, DeliveryMethodCard } from "@/components/ui";
import type { DeliveryMethod } from "@/lib/types";

interface DeliveryStepProps {
  methods: DeliveryMethod[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DeliveryStep({ methods, selectedId, onSelect }: DeliveryStepProps) {
  return (
    <CheckoutStep number={1} title="روش ارسال">
      {methods.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-5 text-center">
          <p className="text-sm text-stone-500">
            روش ارسالی تعریف نشده است. با پشتیبانی تماس بگیرید.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {methods.map((method) => (
            <DeliveryMethodCard
              key={method.id}
              id={method.id}
              name={method.name}
              description={method.description}
              price={method.price}
              selected={selectedId === method.id}
              onSelect={() => onSelect(method.id)}
            />
          ))}
        </div>
      )}
    </CheckoutStep>
  );
}