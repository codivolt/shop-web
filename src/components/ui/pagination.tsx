import Link from "next/link";

import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

function pageWindow(current: number, total: number): (number | "dots")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current]);
  if (current > 2) pages.add(current - 1);
  if (current < total - 1) pages.add(current + 1);
  if (current <= 3) pages.add(2).add(3).add(4);
  if (current >= total - 2) pages.add(total - 1).add(total - 2).add(total - 3);

  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const result: (number | "dots")[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) result.push("dots");
    result.push(page);
  }

  return result;
}

export function Pagination({
  page,
  totalPages,
  makeHref,
  className,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const itemClass =
    "flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-semibold transition";

  return (
    <nav
      aria-label="صفحه‌بندی"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      {page > 1 ? (
        <Link
          href={makeHref(page - 1)}
          rel="prev"
          className={cn(itemClass, "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50")}
        >
          قبلی
        </Link>
      ) : null}

      {pageWindow(page, totalPages).map((item, index) =>
        item === "dots" ? (
          <span key={`dots-${index}`} className="px-1 text-stone-400">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={makeHref(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              itemClass,
              item === page
                ? "bg-brand-700 text-white shadow-md shadow-brand-700/25"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50",
            )}
          >
            {formatNumber(item)}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link
          href={makeHref(page + 1)}
          rel="next"
          className={cn(itemClass, "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50")}
        >
          بعدی
        </Link>
      ) : null}
    </nav>
  );
}
