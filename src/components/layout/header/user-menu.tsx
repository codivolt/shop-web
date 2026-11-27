"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { UserAvatar } from "./user-avatar";

interface UserSummary {
  role?: string | null;
  phone?: string | null;
}

export function UserMenu({
  user,
  avatarSrc,
  name,
  onLogout,
}: {
  user: UserSummary | null;
  avatarSrc: string | null;
  name: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "group flex items-center gap-2 bg-white/5 py-1.5 ps-1.5 pe-3 border rounded-2xl transition",
          open
            ? "border-brand-400/60 shadow-lg shadow-brand-500/20"
            : "border-white/10 hover:border-brand-400/50 hover:shadow-sm",
        )}
      >
        <UserAvatar
          src={avatarSrc}
          name={name}
          className="rounded-xl ring-2 ring-white/20 w-8 h-8 text-xs"
        />
        <span className="hidden sm:flex flex-col items-start min-w-0">
          <span className="max-w-[7.5rem] font-bold text-stone-800 text-xs truncate">
            {name}
          </span>
          <span className="font-medium text-[10px] text-stone-400">
            {user?.role === "admin" ? "مدیر فروشگاه" : "حساب کاربری"}
          </span>
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={cn(
            "hidden sm:block text-stone-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        role="menu"
        className={cn(
          "top-[calc(100%+0.65rem)] z-50 absolute bg-ink-800 shadow-2xl shadow-black/70 border border-white/10 rounded-2xl w-72 overflow-hidden origin-top transition-all duration-200 end-0",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "pointer-events-none invisible -translate-y-1.5 scale-95 opacity-0",
        )}
      >
        <div className="relative bg-gradient-to-br from-brand-500/20 via-ink-800 to-ink-800 p-4 overflow-hidden">
          <span className="-top-8 -left-6 absolute bg-splash-violet/30 blur-2xl rounded-full w-20 h-20" />
          <div className="relative flex items-center gap-3">
            <UserAvatar
              src={avatarSrc}
              name={name}
              className="shadow-brand-900/10 shadow-md rounded-2xl ring-2 ring-white w-12 h-12 text-base"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-black text-stone-900 text-sm truncate">{name}</p>
                {user?.role === "admin" ? <Badge tone="brand">مدیر</Badge> : null}
              </div>
              <p className="mt-0.5 font-medium text-[11px] text-stone-500" dir="ltr">
                {user?.phone ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-1.5">
          <Link
            href="/account"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 hover:bg-white/5 px-3 py-2.5 rounded-xl font-semibold text-stone-500 hover:text-white text-xs transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="text-stone-400">
              <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
              <path d="M5 19.5c.7-3 3.5-4.7 7-4.7s6.3 1.7 7 4.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            حساب کاربری
          </Link>
          <Link
            href="/orders"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 hover:bg-white/5 px-3 py-2.5 rounded-xl font-semibold text-stone-500 hover:text-white text-xs transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="text-stone-400">
              <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="m4 7.5 8 4.5 8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            سفارش‌های من
          </Link>
        </div>

        <div className="p-1.5 border-stone-100 border-t">
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex items-center gap-2.5 hover:bg-rose-500/10 px-3 py-2.5 rounded-xl w-full font-semibold text-rose-300 text-xs transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              <path d="M9 12h11m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            خروج از حساب
          </button>
        </div>
      </div>
    </div>
  );
}
