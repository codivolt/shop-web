"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { fetchSearchSuggestions } from "@/lib/api/search";
import {
  clearRecentSearches,
  getRecentSearches,
  getTrendingSearches,
  type RecentSearch,
  type TrendingSearch,
} from "@/lib/recent-searches";
import {
  RecentSearchItem,
  SearchEmptyState,
  SearchLoadingSkeleton,
  SearchSectionHeader,
  SuggestionItem,
  TrendingSearchItem,
  type SearchSuggestion,
} from "./search-result-items";

export function SearchAutocomplete({
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
  const [trendingSearches] = useState<TrendingSearch[]>(getTrendingSearches);
  const [recentSearches, setRecentSearches] =
    useState<RecentSearch[]>(getRecentSearches);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const query = value.trim();
  const visibleSuggestions = useMemo(
    () => (query ? suggestions : []),
    [query, suggestions],
  );

  useEffect(() => {
    if (!isOpen || !query) return;

    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);

      try {
        const results = await fetchSearchSuggestions(query, controller.signal);
        setSuggestions(
          results.map((result) => ({
            type: result.type,
            label: result.title,
            value: result.title,
          })),
        );
        setHighlightedIndex(-1);
      } catch {
        if (!controller.signal.aborted) setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const maxIndex = visibleSuggestions.length - 1;
      if (maxIndex < 0) return;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) => Math.min(prev + 1, maxIndex));
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && visibleSuggestions[highlightedIndex]) {
            onSubmit(visibleSuggestions[highlightedIndex].value);
          } else if (query) {
            onSubmit(query);
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
  }, [isOpen, visibleSuggestions, highlightedIndex, query, onSubmit, onClose, inputRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const insideDropdown = dropdownRef.current?.contains(target);
      const insideInput = inputRef.current?.contains(target);
      if (!insideDropdown && !insideInput) onClose();
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [isOpen, onClose, inputRef]);

  const selectQuery = (nextQuery: string) => {
    onChange(nextQuery);
    onSubmit(nextQuery);
  };

  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const hasSuggestions = visibleSuggestions.length > 0;
  const hasRecent = recentSearches.length > 0;
  const hasTrending = trendingSearches.length > 0;
  const showTrending = !query && hasTrending;
  const showEmpty = Boolean(query) && !hasSuggestions && !hasRecent;

  const renderSuggestionsList = () => {
    if (isLoading && !hasSuggestions && !hasRecent) {
      return <SearchLoadingSkeleton />;
    }

    if (showEmpty) {
      return <SearchEmptyState />;
    }

    return (
      <>
        {showTrending ? (
          <div className="border-stone-100/50 border-b">
            <SearchSectionHeader
              title="جستجوهای رائج"
              count={trendingSearches.length}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="text-amber-300">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            {trendingSearches.slice(0, 6).map((trending) => (
              <TrendingSearchItem
                key={trending.query}
                query={trending.query}
                count={trending.count}
                onSelect={selectQuery}
              />
            ))}
          </div>
        ) : null}

        {hasSuggestions ? (
          <div className="border-stone-100/50 border-b">
            <SearchSectionHeader
              title="پیشنهادها"
              count={visibleSuggestions.length}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="text-brand-300">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            {visibleSuggestions.map((suggestion, index) => (
              <SuggestionItem
                key={`${suggestion.type}-${suggestion.value}-${index}`}
                suggestion={suggestion}
                isHighlighted={index === highlightedIndex}
                onSelect={(item) => selectQuery(item.value)}
                onHighlight={() => setHighlightedIndex(index)}
                onClearHighlight={() => setHighlightedIndex(-1)}
              />
            ))}
          </div>
        ) : null}

        {hasRecent ? (
          <div className="border-stone-100/50 border-b">
            <SearchSectionHeader
              title="جستجوهای اخیر"
              count={recentSearches.length}
              onClear={handleClearRecent}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden className="text-stone-500">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />
            {recentSearches.map((recent) => (
              <RecentSearchItem
                key={recent.query}
                query={recent.query}
                onSelect={selectQuery}
              />
            ))}
          </div>
        ) : null}

        {query ? (
          <div className="p-3 border-stone-100/50 border-t bg-stone-50/30">
            <Button
              type="button"
              variant="primary"
              className="justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold shadow-sm shadow-brand-500/20 hover:shadow-brand-500/30 transition-shadow"
              onClick={() => onSubmit(query)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              جستجوی «{query}»
            </Button>
          </div>
        ) : null}

        {!query && !hasRecent && !hasTrending ? (
          <div className="p-6 border-stone-100/50 border-t bg-stone-50/30">
            <div className="text-center">
              <p className="font-medium text-stone-600 text-sm mb-3">برای شروع تایپ کنید</p>
            </div>
          </div>
        ) : null}
      </>
    );
  };

  if (!isOpen) return null;

  if (inline) {
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
