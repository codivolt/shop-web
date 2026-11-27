import { http } from "./client";

export type SearchSuggestionType = "product" | "category" | "brand";

export interface SearchSuggestionResult {
  type: SearchSuggestionType;
  id: string;
  title: string;
  subtitle?: string;
  href?: string;
}

export async function fetchSearchSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<SearchSuggestionResult[]> {
  const { data } = await http.get<SearchSuggestionResult[]>("/search/suggestions", {
    params: { q: query, limit: 8 },
    signal,
  });

  return data ?? [];
}
