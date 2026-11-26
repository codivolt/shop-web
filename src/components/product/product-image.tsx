import Image from "next/image";

import { absoluteImage } from "@/lib/format";
import { cn } from "@/lib/cn";

export function ProductImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const normalized = absoluteImage(src);

  if (!normalized) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink-900 via-ink-800 to-brand-500/10 text-stone-500">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="9" cy="10" r="1.5" fill="currentColor" />
          <path
            d="m4.8 16.5 4.3-3.9a1.4 1.4 0 0 1 1.9 0l2.1 1.9 2.2-2a1.4 1.4 0 0 1 1.9 0l3 2.7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-medium text-[11px] text-stone-400">بدون تصویر</span>
      </div>
    );
  }

  return (
    <Image
      src={normalized}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={normalized.startsWith("data:") || normalized.startsWith("blob:") || normalized.startsWith("http")}
      className={cn("object-cover", className)}
    />
  );
}
