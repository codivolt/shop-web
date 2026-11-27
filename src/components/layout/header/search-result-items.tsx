"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

export type SearchSuggestionType = "product" | "category" | "brand";

export interface SearchSuggestion {
  type: SearchSuggestionType;
  label: string;
  value: string;
  image?: string;
  count?: number;
}

export function typeColorClass(type: SearchSuggestionType): string {
  switch (type) {
    case "category":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
    case "brand":
      return "bg-violet-500/15 text-violet-300 border-violet-400/30";
    case "product":
    default:
      return "bg-brand-500/15 text-brand-300 border-brand-400/30";
  }
}

function TypeIcon({ type }: { type: SearchSuggestionType }) {
  switch (type) {
    case "category":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-emerald-300">
          <path d="M4 12.5l5 5 10-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 12.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "brand":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-violet-300">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M6 8h12M6 12h8M6 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "product":
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-brand-600">
          <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2M4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 14h8M12 10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

const TYPE_LABEL: Record<SearchSuggestionType, string> = {
  category: "دسته‌بندی",
  brand: "برند",
  product: "محصول",
};

const TYPE_ABBREVIATION: Record<SearchSuggestionType, string> = {
  category: "کت",
  brand: "بر",
  product: "مح",
};

export function SuggestionItem({
  suggestion,
  isHighlighted,
  onSelect,
  onHighlight,
  onClearHighlight,
}: {
  suggestion: SearchSuggestion;
  isHighlighted: boolean;
  onSelect: (suggestion: SearchSuggestion) => void;
  onHighlight: () => void;
  onClearHighlight: () => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(suggestion)}
      className={cn(
        "group flex items-center gap-3 px-4 py-3.5 border-b border-stone-100/60 last:border-0 rounded-none w-full text-right transition-all duration-200",
        isHighlighted
          ? "bg-gradient-to-r from-brand-500/15 via-white/5 to-brand-500/10 border-brand-400/25 shadow-sm shadow-brand-500/10"
          : "hover:bg-white/5",
      )}
      onMouseEnter={onHighlight}
      onMouseLeave={onClearHighlight}
    >
      <div className="relative flex shrink-0">
        <div
          className={cn(
            "flex justify-center items-center rounded-2xl w-12 h-12 shadow-sm transition-all duration-200",
            isHighlighted ? "scale-105 shadow-md" : "group-hover:scale-105",
          )}
        >
          {suggestion.image ? (
            <Image
              src={suggestion.image}
              alt=""
              width={44}
              height={44}
              className="rounded-xl w-10 h-10 object-cover shadow-sm"
              unoptimized
            />
          ) : (
            <div
              className={cn(
                "flex justify-center items-center rounded-2xl w-10 h-10 text-xl shadow-sm",
                suggestion.type === "category"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : suggestion.type === "brand"
                    ? "bg-violet-500/15 text-violet-300"
                    : "bg-brand-500/15 text-brand-300",
              )}
            >
              <TypeIcon type={suggestion.type} />
            </div>
          )}
        </div>
        <span
          className={cn(
            "absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[9px] font-bold leading-none border-2 border-white",
            typeColorClass(suggestion.type),
          )}
        >
          {TYPE_ABBREVIATION[suggestion.type]}
        </span>
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="font-semibold text-stone-800 text-sm truncate leading-snug group-hover:text-brand-300 transition-colors">
          {suggestion.label}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          {suggestion.count ? (
            <span className="flex items-center gap-1 text-stone-400 text-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2M4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 14h8M12 10v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {formatNumber(suggestion.count)}
            </span>
          ) : null}
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
              typeColorClass(suggestion.type),
            )}
          >
            {TYPE_LABEL[suggestion.type]}
          </span>
        </div>
      </div>
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 shrink-0",
          isHighlighted
            ? "bg-brand-100 text-brand-600 scale-110"
            : "bg-stone-100/50 text-stone-400 group-hover:bg-brand-100 group-hover:text-brand-600",
        )}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M19 12H5M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </button>
  );
}

export function RecentSearchItem({
  query,
  onSelect,
}: {
  query: string;
  onSelect: (query: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(query)}
      className="group flex items-center gap-3 px-4 py-3 border-b border-stone-100/60 last:border-0 rounded-none w-full text-right transition-all duration-200 hover:bg-stone-50/50 hover:shadow-sm hover:shadow-stone-200/30"
    >
      <div className="flex justify-center items-center bg-white/5 rounded-2xl w-12 h-12 text-stone-400 shrink-0 group-hover:scale-105 transition-transform">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <span className="font-semibold text-stone-800 text-sm truncate group-hover:text-brand-700 transition-colors">
        {query}
      </span>
      <div className="flex-1" />
      <kbd className="flex items-center gap-1 bg-stone-100/80 px-2.5 py-1 rounded-lg font-mono text-[10px] text-stone-400 shrink-0">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </kbd>
    </button>
  );
}

export function TrendingSearchItem({
  query,
  count,
  onSelect,
}: {
  query: string;
  count: number;
  onSelect: (query: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(query)}
      className="group flex items-center gap-3 px-4 py-3 border-b border-stone-100/60 last:border-0 rounded-none w-full text-right transition-all duration-200 hover:bg-stone-50/50 hover:shadow-sm hover:shadow-stone-200/30"
    >
      <div className="flex justify-center items-center bg-amber-500/15 rounded-2xl w-12 h-12 text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="font-semibold text-stone-800 text-sm truncate leading-snug group-hover:text-brand-300 transition-colors">
          {query}
        </p>
        <span className="flex items-center gap-1 text-stone-400 text-xs mt-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {formatNumber(count)} جستجو
        </span>
      </div>
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-medium border border-amber-400/30 shrink-0">
        رائج
      </span>
    </button>
  );
}

export function SearchSectionHeader({
  title,
  icon,
  count,
  onClear,
}: {
  title: string;
  icon: ReactNode;
  count?: number;
  onClear?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100/50 bg-stone-50/30">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/80 shadow-sm">
          {icon}
        </div>
        <div>
          <span className="font-semibold text-stone-700 text-xs tracking-tight uppercase">{title}</span>
          {count !== undefined ? (
            <span className="text-stone-400 text-[10px] ml-1">({formatNumber(count)})</span>
          ) : null}
        </div>
      </div>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="font-medium text-stone-400 hover:text-white text-xs transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
        >
          پاک کردن
        </button>
      ) : null}
    </div>
  );
}

export function SearchLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-2 p-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <div className="bg-stone-200 rounded-2xl w-12 h-12 shrink-0" />
          <div className="flex-1">
            <div className="bg-stone-200 h-4 w-3/4 rounded mb-2" />
            <div className="bg-stone-200 h-3 w-1/2 rounded" />
          </div>
          <div className="bg-stone-200 w-10 h-10 rounded-xl shrink-0" />
        </div>
      ))}
    </div>
  );
}

export function SearchEmptyState() {
  return (
    <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-stone-700 text-sm mb-1">پیشنهادی یافت نشد</p>
        <p className="text-stone-400 text-xs">عبارت دیگری تایپ کنید یا از جستجوهای رائج استفاده کنید</p>
      </div>
    </div>
  );
}
