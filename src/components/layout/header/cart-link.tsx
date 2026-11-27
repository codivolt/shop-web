"use client";

import Link from "next/link";

import { useCartCount } from "@/hooks/use-cart";
import { formatNumber } from "@/lib/format";

export function CartLink({ onNavigate }: { onNavigate?: () => void }) {
  const count = useCartCount();

  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      className="relative flex justify-center items-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-400/60 rounded-xl w-10 h-10 text-stone-500 hover:text-white transition"
      aria-label="سبد خرید"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 4h2.2l1.9 10.4a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20 8H6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="9.5" cy="19.5" r="1.2" fill="currentColor" />
        <circle cx="17" cy="19.5" r="1.2" fill="currentColor" />
      </svg>
      {count > 0 ? (
        <span className="-top-1.5 -left-1.5 absolute flex justify-center items-center bg-brand-500 px-1 rounded-full ring-2 ring-ink-950 min-w-5 h-5 font-bold text-[10px] text-ink-950">
          {formatNumber(count)}
        </span>
      ) : null}
    </Link>
  );
}
