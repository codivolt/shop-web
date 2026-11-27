"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";

import { Modal } from "@/components/ui/modal";
import { useAuthActions, useAuthState, displayName } from "@/hooks/use-auth";
import { cn } from "@/lib/cn";
import { absoluteImage } from "@/lib/format";
import { saveRecentSearch } from "@/lib/recent-searches";
import { SITE } from "@/lib/site";
import { CartLink } from "./header/cart-link";
import { NAV_LINKS } from "./header/nav-links";
import { SearchAutocomplete } from "./header/search-autocomplete";
import { UserMenu } from "./header/user-menu";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, hydrated } = useAuthState();
  const { logout } = useAuthActions();
  const avatarSrc = absoluteImage(user?.avatarUrl);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchModalOpen, setMobileSearchModalOpen] = useState(false);
  const [desktopSearchValue, setDesktopSearchValue] = useState("");
  const [mobileSearchValue, setMobileSearchValue] = useState("");
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const userName = displayName(user);

  const handleSearchSubmit = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      saveRecentSearch(trimmed);
      void router.push(`/products?q=${encodeURIComponent(trimmed)}`);
      setDesktopSearchOpen(false);
      setMobileSearchModalOpen(false);
      desktopSearchInputRef.current?.blur();
      mobileSearchInputRef.current?.blur();
    },
    [router],
  );

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    toast.success("از حساب خارج شدید");
  };

  return (
    <header className="top-0 z-40 sticky">
      <div className="bg-ink-950 border-white/10 border-b text-stone-400">
        <div className="flex justify-center items-center gap-4 py-2 text-[11px] container-page">
          <a href="tel:+989013247898" className="hover:text-white transition">
            پشتیبانی: <span dir="ltr">{SITE.phone}</span>
          </a>
        </div>
      </div>

      <div className="bg-ink-950/90 backdrop-blur-xl border-white/10 border-b">
        <div className="flex items-center gap-3 sm:gap-4 h-16 container-page">
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:bg-white/10 px-3 py-2 rounded-lg font-semibold text-stone-500 hover:text-white text-sm transition"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                href="/favorites"
                className="hover:bg-white/10 px-3 py-2 rounded-lg font-semibold text-stone-500 hover:text-white text-sm transition"
              >
                علاقه‌مندی‌ها
              </Link>
            ) : null}
            {isAuthenticated ? (
              <Link
                href="/orders"
                className="hover:bg-white/10 px-3 py-2 rounded-lg font-semibold text-stone-500 hover:text-white text-sm transition"
              >
                سفارش‌های من
              </Link>
            ) : null}
          </nav>

          <div className="hidden relative md:flex flex-1 w-full">
            <SearchAutocomplete
              value={desktopSearchValue}
              onChange={setDesktopSearchValue}
              onSubmit={handleSearchSubmit}
              onClose={() => setDesktopSearchOpen(false)}
              isOpen={desktopSearchOpen}
              inputRef={desktopSearchInputRef}
            />
            <div className="flex items-center gap-2 bg-white/5 focus-within:bg-white/10 px-3 border border-white/10 focus-within:border-brand-400 rounded-xl focus-within:ring-4 focus-within:ring-brand-500/15 w-full h-10 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="text-stone-400">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                name="q"
                autoComplete="off"
                placeholder="جستجوی توتون، کاغذ رول، فیلتر…"
                className="bg-transparent focus:outline-none w-full h-full text-stone-800 placeholder:text-stone-400 text-xs"
                ref={desktopSearchInputRef}
                value={desktopSearchValue}
                onChange={(event) => {
                  setDesktopSearchValue(event.target.value);
                  setDesktopSearchOpen(true);
                }}
                onFocus={() => setDesktopSearchOpen(true)}
                onBlur={() => setTimeout(() => setDesktopSearchOpen(false), 150)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearchSubmit(desktopSearchValue);
                }}
              />
              <button type="button" className="sr-only">
                جستجو
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 ms-auto md:ms-0">
            {!hydrated ? (
              <div className="bg-stone-100 rounded-xl w-24 h-10 animate-pulse" />
            ) : isAuthenticated ? (
              <UserMenu
                user={user}
                avatarSrc={avatarSrc}
                name={userName}
                onLogout={handleLogout}
              />
            ) : (
              <Link
                href="/login"
                className="sm:hidden flex md:flex items-center bg-gradient-to-l from-brand-500 via-brand-400 to-splash-orange hover:brightness-110 px-4 rounded-xl h-10 font-bold text-ink-950 shadow-brand-500/25 shadow-lg text-xs transition"
              >
                ورود به رولچی
              </Link>
            )}

            <CartLink />

            <button
              type="button"
              onClick={() => setMobileSearchModalOpen(true)}
              aria-label="جستجو"
              className="lg:hidden flex justify-center items-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl w-10 h-10 text-stone-500 hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="منو"
              aria-expanded={mobileOpen}
              className="lg:hidden flex justify-center items-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl w-10 h-10 text-stone-500 hover:text-white"
            >
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div
          inert={!mobileOpen}
          aria-hidden={!mobileOpen}
          className={cn(
            "lg:hidden grid bg-ink-900 overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            mobileOpen
              ? "grid-rows-[1fr] border-t border-white/10 opacity-100"
              : "pointer-events-none grid-rows-[0fr] border-t border-transparent opacity-0",
          )}
        >
          <div className="min-h-0">
            <div className="space-y-1 py-4 container-page">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block hover:bg-white/5 px-3 py-2.5 rounded-xl font-semibold text-stone-500 hover:text-white text-sm transition"
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated ? (
                <Link
                  href="/favorites"
                  onClick={() => setMobileOpen(false)}
                  className="block hover:bg-white/5 px-3 py-2.5 rounded-xl font-semibold text-stone-500 hover:text-white text-sm transition"
                >
                  علاقه‌مندی‌ها
                </Link>
              ) : null}
              {isAuthenticated ? (
                <Link
                  href="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="block hover:bg-white/5 px-3 py-2.5 rounded-xl font-semibold text-stone-500 hover:text-white text-sm transition"
                >
                  سفارش‌های من
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={mobileSearchModalOpen}
        onClose={() => setMobileSearchModalOpen(false)}
        title="جستجو"
        fullScreen
        className="max-w-[440px]"
      >
        <div className="relative w-full">
          <div className="flex items-center gap-2 bg-white/5 px-3 border border-white/10 rounded-xl h-11">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="text-stone-400">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              name="q"
              autoComplete="off"
              placeholder="جستجو در فروشگاه"
              className="bg-transparent focus:outline-none w-full text-sm"
              ref={mobileSearchInputRef}
              value={mobileSearchValue}
              onChange={(event) => setMobileSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearchSubmit(mobileSearchValue);
              }}
              autoFocus
            />
            <button type="button" className="sr-only">
              جستجو
            </button>
          </div>
          <SearchAutocomplete
            value={mobileSearchValue}
            onChange={setMobileSearchValue}
            onSubmit={handleSearchSubmit}
            onClose={() => setMobileSearchModalOpen(false)}
            isOpen={mobileSearchModalOpen}
            inputRef={mobileSearchInputRef}
            inline
          />
        </div>
      </Modal>
    </header>
  );
}
