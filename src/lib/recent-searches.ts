const RECENT_SEARCHES_KEY = "recent_searches";
const TRENDING_SEARCHES_KEY = "trending_searches";
const MAX_RECENT_SEARCHES = 5;

export interface RecentSearch {
  query: string;
  timestamp: number;
}

export interface TrendingSearch {
  query: string;
  count: number;
}

function readStoredList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T[]) : [];
  } catch {
    return [];
  }
}

export function getRecentSearches(): RecentSearch[] {
  return readStoredList<RecentSearch>(RECENT_SEARCHES_KEY);
}

export function saveRecentSearch(query: string): void {
  const trimmed = query.trim();
  if (typeof window === "undefined" || !trimmed) return;

  try {
    const previous = getRecentSearches().filter((item) => item.query !== trimmed);
    const updated = [{ query: trimmed, timestamp: Date.now() }, ...previous].slice(
      0,
      MAX_RECENT_SEARCHES,
    );
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // Storage can be unavailable (private mode, quota) — searching still works.
  }
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore storage failures.
  }
}

export function getTrendingSearches(): TrendingSearch[] {
  return readStoredList<TrendingSearch>(TRENDING_SEARCHES_KEY);
}
