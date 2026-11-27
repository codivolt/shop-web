"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useFavorites, useToggleFavorite } from "@/hooks/use-favorites";
import { useAuthState } from "@/hooks/use-auth";
import { cn } from "@/lib/cn";

export function FavoriteButton({
  productId,
  className,
  withLabel = false,
}: {
  productId: string;
  className?: string;
  withLabel?: boolean;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthState();
  const { data } = useFavorites();
  const mutation = useToggleFavorite();
  const isFavorite = data?.some((product) => product.id === productId) ?? false;

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      toast.error("برای افزودن به علاقه‌مندی‌ها وارد حساب شوید");
      router.push("/login");
      return;
    }

    mutation.mutate({ productId, isFavorite });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-pressed={isFavorite}
      style={isFavorite ? { color: "#ef4444" } : undefined}
      aria-label={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-stone-400 transition hover:border-rose-400/50 hover:text-rose-300 disabled:opacity-50",
        withLabel ? "h-11 px-4 text-sm font-semibold" : "h-9 w-9",
        isFavorite && "border-red-500/50 bg-red-500/15 text-red-500",
        className,
      )}
    >
      <svg
        width={withLabel ? 18 : 16}
        height={withLabel ? 18 : 16}
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        aria-hidden
      >
        <path
          d="M12 20.5s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3.5c0 5.4-7.5 10-7.5 10Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withLabel ? (isFavorite ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها") : null}
    </button>
  );
}