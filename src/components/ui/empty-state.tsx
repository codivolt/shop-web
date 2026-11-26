import Link from "next/link";
import type { ReactNode } from "react";

import { buttonStyles } from "@/components/ui/button";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  children,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-16 text-center">
      {icon ? (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-stone-400">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-bold text-stone-800">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-6 text-stone-500">
          {description}
        </p>
      ) : null}
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className={buttonStyles({ size: "md", className: "mt-6" })}
        >
          {actionLabel}
        </Link>
      ) : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
