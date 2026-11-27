import { describe, expect, it } from 'vitest';

import { requiresReceipt } from '../../src/lib/checkout';
import { API_URL, SHIPPING_COST, SHIPPING_THRESHOLD, SITE } from '../../src/lib/site';

describe('checkout', () => {
  it('requires a receipt for card, sheba and crypto', () => {
    expect(requiresReceipt('card_to_card')).toBe(true);
    expect(requiresReceipt('sheba')).toBe(true);
    expect(requiresReceipt('crypto')).toBe(true);
  });

  it('does not require a receipt for other types', () => {
    expect(requiresReceipt('cash_on_delivery')).toBe(false);
    expect(requiresReceipt(null)).toBe(false);
    expect(requiresReceipt(undefined)).toBe(false);
  });
});

describe('site config', () => {
  it('exposes storefront constants', () => {
    expect(SITE.name).toBe('رولچی');
    expect(SHIPPING_THRESHOLD).toBe(2_000_000);
    expect(SHIPPING_COST).toBe(65_000);
    expect(API_URL).toBeTruthy();
  });
});