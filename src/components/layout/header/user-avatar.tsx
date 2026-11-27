"use client";

import Image from "next/image";

import { cn } from "@/lib/cn";

export function UserAvatar({
  src,
  name,
  className,
}: {
  src: string | null;
  name: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex justify-center items-center bg-brand-100 overflow-hidden font-black text-brand-800 shrink-0",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt="عکس پروفایل"
          fill
          sizes="72px"
          unoptimized
          className="object-cover"
        />
      ) : (
        name.slice(0, 1)
      )}
    </span>
  );
}
