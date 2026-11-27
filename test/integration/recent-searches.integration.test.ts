import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearRecentSearches,
  getRecentSearches,
  getTrendingSearches,
  saveRecentSearch,
} from '../../src/lib/recent-searches';

describe('recent searches', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves a trimmed query', () => {
    saveRecentSearch('  توتون  ');
    expect(getRecentSearches()[0].query).toBe('توتون');
  });

  it('moves a repeated query to the top', () => {
    saveRecentSearch('الف');
    saveRecentSearch('ب');
    saveRecentSearch('الف');
    expect(getRecentSearches().map((item) => item.query)).toEqual(['الف', 'ب']);
  });

  it('keeps at most five entries', () => {
    for (const query of ['۱', '۲', '۳', '۴', '۵', '۶']) saveRecentSearch(query);
    expect(getRecentSearches()).toHaveLength(5);
    expect(getRecentSearches()[0].query).toBe('۶');
  });

  it('ignores empty queries', () => {
    saveRecentSearch('   ');
    expect(getRecentSearches()).toEqual([]);
  });

  it('clears stored searches', () => {
    saveRecentSearch('توتون');
    clearRecentSearches();
    expect(getRecentSearches()).toEqual([]);
  });

  it('reads trending searches', () => {
    window.localStorage.setItem(
      'trending_searches',
      JSON.stringify([{ query: 'توتون', count: 3 }]),
    );
    expect(getTrendingSearches()).toEqual([{ query: 'توتون', count: 3 }]);
  });
});