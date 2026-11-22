"use client";

import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart";
import { apiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import type { CartLineProduct } from "@/lib/types";

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  full,
  label = "افزودن به سبد خرید",
}: {
  product: CartLineProduct;
  quantity?: number;
  className?: string;
  full?: boolean;
  label?: string;
}) {
  const mutation = useAddToCart();
  const disabled = product.stock <= 0;

  const handleClick = () => {
    mutation.mutate(
      { product, quantity },
      {
        onSuccess: () => toast.success("محصول به سبد خرید اضافه شد"),
        onError: (error) => toast.error(apiErrorMessage(error)),
      },
    );
  };

  return (
    <Button
      onClick={handleClick}
      loading={mutation.isPending}
      disabled={disabled}
      className={cn(full && "w-full", className)}
    >
      {!mutation.isPending ? (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 4h2.2l1.9 10.4a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20 8H6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="9.5" cy="19.5" r="1.2" fill="currentColor" />
          <circle cx="17" cy="19.5" r="1.2" fill="currentColor" />
        </svg>
      ) : null}
      {disabled ? "ناموجود" : label}
    </Button>
  );
}
