"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAuthActions, useAuthState, displayName } from "@/hooks/use-auth";
import { useCartCount } from "@/hooks/use-cart";
import { cn } from "@/lib/cn";
import { absoluteImage, formatNumber } from "@/lib/format";
import { API_URL, SITE } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "فروشگاه" },
  { href: "/categories", label: "دسته‌بندی‌ها" },
];

interface SearchSuggestion {
  type: "product" | "category" | "brand";
  label: string;
  value: string;
  image?: string;
  count?: number;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

interface SearchResult {
  type: "product" | "category" | "brand";
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
}

interface TrendingSearch {
  query: string;
  count: number;
}

function getRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("recent_searches");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  if (typeof window === "undefined") return;
  try {
    const recent = getRecentSearches();
    const filtered = recent.filter((r) => r.query !== query);
    const updated = [{ query, timestamp: Date.now() }, ...filtered].slice(0, 5);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  } catch {}
}

function getTrendingSearches(): TrendingSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("trending_searches");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function SearchAutocomplete({
  value,
  onChange,
  onSubmit,
  onClose,
  isOpen,
  inputRef,
  inline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (query: string) => void;
  onClose: () => void;
  isOpen: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  inline?: boolean;
}) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingSearches] = useState<TrendingSearch[]>(() => getTrendingSearches());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const recentSearches = getRecentSearches();
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      setIsLoading(false);
      return;
    }

    const query = value.trim();
    if (query.length === 0) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const res = await axios.get<SearchResult[]>(
          `${API_URL}/search/suggestions`,
          {
            params: { q: query, limit: 8 },
            signal: abortRef.current.signal,
          },
        );
        setSuggestions(
          res.data.map((s) => ({
            type: s.type,
            label: s.title,
            value: s.title,
            image: undefined,
            count: undefined,
          })),
        );
        setHighlightedIndex(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      const maxIndex = suggestions.length - 1;
      if (maxIndex < 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) => Math.min(prev + 1, maxIndex));
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
            onSubmit(suggestions[highlightedIndex].value);
          } else if (value.trim()) {
            onSubmit(value.trim());
          }
          break;
        case "Escape":
          onClose();
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, suggestions, highlightedIndex, value, onSubmit, onClose, inputRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [onClose, inputRef]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.value);
    onSubmit(suggestion.value);
  };

  const handleRecentClick = (query: string) => {
    onChange(query);
    onSubmit(query);
  };

  const handleTrendingClick = (query: string) => {
    onChange(query);
    onSubmit(query);
  };

  const clearRecentSearches = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    localStorage.removeItem("recent_searches");
    window.dispatchEvent(new Event("storage"));
  };

  const getTypeIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "category":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-emerald-300">
            <path d="M4 12.5l5 5 10-10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 12.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "brand":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-violet-300">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M6 8h12M6 12h8M6 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
      case "product":
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-brand-600">
            <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2M4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 14h8M12 10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        );
    }
  };

  const getTypeColor = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "category":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-400/30";
      case "brand":
        return "bg-violet-500/15 text-violet-300 border-violet-400/30";
      case "product":
      default:
        return "bg-brand-500/15 text-brand-300 border-brand-400/30";
    }
  };

  const SuggestionItem = ({
    suggestion,
    index,
    isHighlighted,
  }: {
    suggestion: SearchSuggestion;
    index: number;
    isHighlighted: boolean;
  }) => (
    <button
      type="button"
      onClick={() => handleSuggestionClick(suggestion)}
      className={cn(
        "group flex items-center gap-3 px-4 py-3.5 border-b border-stone-100/60 last:border-0 rounded-none w-full text-right transition-all duration-200",
        isHighlighted
          ? "bg-gradient-to-r from-brand-500/15 via-white/5 to-brand-500/10 border-brand-400/25 shadow-sm shadow-brand-500/10"
          : "hover:bg-white/5"
      )}
      onMouseEnter={() => setHighlightedIndex(index)}
      onMouseLeave={() => setHighlightedIndex(-1)}
    >
      <div className="relative flex shrink-0">
        <div className={cn(
          "flex justify-center items-center rounded-2xl w-12 h-12 shadow-sm transition-all duration-200",
          isHighlighted ? "scale-105 shadow-md" : "group-hover:scale-105"
        )}>
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
            <div className={cn(
              "flex justify-center items-center rounded-2xl w-10 h-10 text-xl shadow-sm",
              suggestion.type === "category"
                ? "bg-emerald-500/15 text-emerald-300"
                : suggestion.type === "brand"
                  ? "bg-violet-500/15 text-violet-300"
                  : "bg-brand-500/15 text-brand-300"
            )}>
              {getTypeIcon(suggestion.type)}
            </div>
          )}
        </div>
        <span className={cn(
          "absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[9px] font-bold leading-none border-2 border-white",
          getTypeColor(suggestion.type)
        )}>
          {suggestion.type === "category" && "کت"}
          {suggestion.type === "brand" && "بر"}
          {suggestion.type === "product" && "مح"}
        </span>
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="font-semibold text-stone-800 text-sm truncate leading-snug group-hover:text-brand-300 transition-colors">
          {suggestion.label}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          {suggestion.count && (
            <span className="flex items-center gap-1 text-stone-400 text-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2M4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 14h8M12 10v8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              {formatNumber(suggestion.count)}
            </span>
          )}
          <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border",
            getTypeColor(suggestion.type)
          )}>
            {suggestion.type === "category" && "دسته‌بندی"}
            {suggestion.type === "brand" && "برند"}
            {suggestion.type === "product" && "محصول"}
          </span>
        </div>
      </div>
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 shrink-0",
        isHighlighted
          ? "bg-brand-100 text-brand-600 scale-110"
          : "bg-stone-100/50 text-stone-400 group-hover:bg-brand-100 group-hover:text-brand-600"
      )}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M19 12H5M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </button>
  );

  const RecentSearchItem = ({ query, index }: { query: string; index: number }) => (
    <button
      type="button"
      onClick={() => handleRecentClick(query)}
      className="group flex items-center gap-3 px-4 py-3 border-b border-stone-100/60 last:border-0 rounded-none w-full text-right transition-all duration-200 hover:bg-stone-50/50 hover:shadow-sm hover:shadow-stone-200/30"
    >
      <div className="flex justify-center items-center bg-white/5 rounded-2xl w-12 h-12 text-stone-400 shrink-0 group-hover:scale-105 transition-transform">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="font-semibold text-stone-800 text-sm truncate group-hover:text-brand-700 transition-colors">{query}</span>
      <div className="flex-1" />
      <kbd className="flex items-center gap-1 bg-stone-100/80 px-2.5 py-1 rounded-lg font-mono text-[10px] text-stone-400 shrink-0">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </kbd>
    </button>
  );

  const TrendingSearchItem = ({ query, count, index }: { query: string; count: number; index: number }) => (
    <button
      type="button"
      onClick={() => handleTrendingClick(query)}
      className="group flex items-center gap-3 px-4 py-3 border-b border-stone-100/60 last:border-0 rounded-none w-full text-right transition-all duration-200 hover:bg-stone-50/50 hover:shadow-sm hover:shadow-stone-200/30"
    >
      <div className="flex justify-center items-center bg-amber-500/15 rounded-2xl w-12 h-12 text-amber-300 shrink-0 group-hover:scale-105 transition-transform">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="font-semibold text-stone-800 text-sm truncate leading-snug group-hover:text-brand-300 transition-colors">
          {query}
        </p>
        <span className="flex items-center gap-1 text-stone-400 text-xs mt-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {formatNumber(count)} جستجو
        </span>
      </div>
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-medium border border-amber-400/30 shrink-0">
        رائج
      </span>
    </button>
  );

  const LoadingSkeleton = () => (
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

  const EmptyState = () => (
    <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <p className="font-semibold text-stone-700 text-sm mb-1">پیشنهادی یافت نشد</p>
        <p className="text-stone-400 text-xs">عبارت دیگری تایپ کنید یا از جستجوهای راجع استفاده کنید</p>
      </div>
    </div>
  );

  const renderSectionHeader = ({
    title,
    icon,
    color,
    onClear,
    count,
  }: {
    title: string;
    icon: React.ReactNode;
    color: string;
    onClear?: () => void;
    count?: number;
  }) => (
    <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100/50 bg-stone-50/30">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/80 shadow-sm">
          {icon}
        </div>
        <div>
          <span className="font-semibold text-stone-700 text-xs tracking-tight uppercase">{title}</span>
          {count !== undefined && (
            <span className="text-stone-400 text-[10px] ml-1">({formatNumber(count)})</span>
          )}
        </div>
      </div>
      {onClear && (
                    <button
              type="button"
              onClick={onClear}
              className="font-medium text-stone-400 hover:text-white text-xs transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
            >
          پاک کردن
        </button>
      )}
    </div>
  );

  if (!isOpen) return null;

  const hasSuggestions = suggestions.length > 0;
  const hasRecent = recentSearches.length > 0;
  const hasTrending = trendingSearches.length > 0;
  const query = value.trim();
  const showTrending = !query && hasTrending;
  const showEmpty = query && !hasSuggestions && !hasRecent;

  const renderSuggestionsList = () => {
    if (isLoading && !hasSuggestions && !hasRecent) {
      return <LoadingSkeleton />;
    }

    if (showEmpty) {
      return <EmptyState />;
    }

    return (
      <>
        {showTrending && (
          <div className="border-stone-100/50 border-b">
            {renderSectionHeader({
              title: "جستجوهای رائج",
              icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="text-amber-300">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              color: "text-amber-300",
              count: trendingSearches.length,
            })}
            {trendingSearches.slice(0, 6).map((trending, index) => (
              <TrendingSearchItem key={index} query={trending.query} count={trending.count} index={index} />
            ))}
          </div>
        )}

        {hasSuggestions && (
          <div className="border-stone-100/50 border-b">
            {renderSectionHeader({
              title: "پیشنهادها",
              icon: (
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="text-brand-300">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              color: "text-brand-300",
              count: suggestions.length,
            })}
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                suggestion={suggestion}
                index={index}
                isHighlighted={index === highlightedIndex}
              />
            ))}
          </div>
        )}

        {hasRecent && (
          <div className="border-stone-100/50 border-b">
            {renderSectionHeader({
              title: "جستجوهای اخیر",
              icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="text-stone-500">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
              color: "text-stone-500",
              count: recentSearches.length,
              onClear: () => clearRecentSearches(),
            })}
            {recentSearches.map((recent, index) => (
              <RecentSearchItem key={index} query={recent.query} index={index} />
            ))}
          </div>
        )}

        {query && (
          <div className="p-3 border-stone-100/50 border-t bg-stone-50/30">
            <Button
              type="button"
              variant="primary"
              className="justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold shadow-sm shadow-brand-500/20 hover:shadow-brand-500/30 transition-shadow"
              onClick={() => onSubmit(query)}
              disabled={!query}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              جستجوی «{query}»
            </Button>
          </div>
        )}

        {!query && !hasRecent && !hasTrending && (
          <div className="p-6 border-stone-100/50 border-t bg-stone-50/30">
            <div className="text-center">
              <p className="font-medium text-stone-600 text-sm mb-3">برای شروع تایپ کنید</p>
              <div className="flex flex-wrap justify-center gap-2">
                {trendingSearches.slice(0, 4).map((trending, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleTrendingClick(trending.query)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-brand-300 hover:bg-brand-50 text-stone-600 hover:text-brand-700 text-xs font-medium transition-all duration-200"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden className="text-splash-yellow">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {trending.query}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  if (inline) {
    if (!isOpen) return null;
    return (
      <div className="animate-in duration-200 fade-in slide-in-from-top-2">
        {renderSuggestionsList()}
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="top-full right-0 left-0 z-50 absolute bg-ink-800/95 backdrop-blur-xl shadow-2xl shadow-black/70 mt-2.5 border border-white/10 rounded-3xl w-full overflow-hidden origin-top-right animate-in duration-300 ease-out-[cubic-bezier(0.16,1,0.3,1)] fade-in-0 zoom-in-95 slide-in-from-top-1"
      role="listbox"
      aria-label="پیشنهادات جستجو"
      style={{ maxHeight: "60vh" }}
    >
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
        {renderSuggestionsList()}
      </div>
    </div>
  );
}

function UserAvatar({
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

function CartLink({ onNavigate }: { onNavigate?: () => void }) {
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

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, hydrated } = useAuthState();
  const { logout } = useAuthActions();
  const avatarSrc = absoluteImage(user?.avatarUrl);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [mobileSearchModalOpen, setMobileSearchModalOpen] = useState(false);
  const [desktopSearchValue, setDesktopSearchValue] = useState("");
  const [mobileSearchValue, setMobileSearchValue] = useState("");
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const userName = displayName(user);

  const handleSearchSubmit = useCallback((query: string) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
      void router.push(`/products?q=${encodeURIComponent(query.trim())}`);
      setDesktopSearchOpen(false);
      setMobileSearchModalOpen(false);
      desktopSearchInputRef.current?.blur();
      mobileSearchInputRef.current?.blur();
    }
  }, [router]);

  useEffect(() => {
    if (!profileOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
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
                href="/orders"
                className="hover:bg-white/10 px-3 py-2 rounded-lg font-semibold text-stone-500 hover:text-white text-sm transition"
              >
                سفارش‌های من
              </Link>
            ) : null}
          </nav>

          <div
            ref={desktopSearchInputRef}
            className="hidden relative md:flex flex-1 w-full"
          >
            <SearchAutocomplete
              value={desktopSearchValue}
              onChange={(v) => setDesktopSearchValue(v)}
              onSubmit={handleSearchSubmit}
              onClose={() => setDesktopSearchOpen(false)}
              isOpen={desktopSearchOpen}
              inputRef={desktopSearchInputRef}
            />
            <div className="flex items-center gap-2 bg-white/5 focus-within:bg-white/10 px-3 border border-white/10 focus-within:border-brand-400 rounded-xl focus-within:ring-4 focus-within:ring-brand-500/15 w-full h-10 transition">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="text-stone-400"
              >
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
                onChange={(e) => {
                  setDesktopSearchValue(e.target.value);
                  setDesktopSearchOpen(true);
                }}
                onFocus={() => setDesktopSearchOpen(true)}
                onBlur={() => setTimeout(() => setDesktopSearchOpen(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit(desktopSearchValue);
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
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  className={cn(
                    "group flex items-center gap-2 bg-white/5 py-1.5 ps-1.5 pe-3 border rounded-2xl transition",
                    profileOpen
                      ? "border-brand-400/60 shadow-lg shadow-brand-500/20"
                      : "border-white/10 hover:border-brand-400/50 hover:shadow-sm",
                  )}
                >
                  <UserAvatar
                    src={avatarSrc}
                    name={userName}
                    className="rounded-xl ring-2 ring-white/20 w-8 h-8 text-xs"
                  />
                  <span className="hidden sm:flex flex-col items-start min-w-0">
                    <span className="max-w-[7.5rem] font-bold text-stone-800 text-xs truncate">
                      {userName}
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
                      profileOpen && "rotate-180",
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
                    profileOpen
                      ? "visible translate-y-0 scale-100 opacity-100"
                      : "pointer-events-none invisible -translate-y-1.5 scale-95 opacity-0",
                  )}
                >
                  <div className="relative bg-gradient-to-br from-brand-500/20 via-ink-800 to-ink-800 p-4 overflow-hidden">
                    <span className="-top-8 -left-6 absolute bg-splash-violet/30 blur-2xl rounded-full w-20 h-20" />
                    <div className="relative flex items-center gap-3">
                      <UserAvatar
                        src={avatarSrc}
                        name={userName}
                        className="shadow-brand-900/10 shadow-md rounded-2xl ring-2 ring-white w-12 h-12 text-base"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-black text-stone-900 text-sm truncate">
                            {userName}
                          </p>
                          {user?.role === "admin" ? (
                            <Badge tone="brand">مدیر</Badge>
                          ) : null}
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
                      onClick={() => setProfileOpen(false)}
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
                      onClick={() => setProfileOpen(false)}
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
        <div ref={mobileSearchInputRef} className="relative w-full">
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
              onChange={(e) => {
                setMobileSearchValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit(mobileSearchValue);
              }}
              autoFocus
            />
            <button type="button" className="sr-only">
              جستجو
            </button>
          </div>
          <SearchAutocomplete
            value={mobileSearchValue}
            onChange={(v) => setMobileSearchValue(v)}
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
