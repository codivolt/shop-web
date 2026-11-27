import { describe, expect, it } from 'vitest';

import {
  absoluteImage,
  cartTotal,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPrice,
  normalizeImage,
} from '../../src/lib/format';

describe('format', () => {
  it('formats prices and numbers in Persian', () => {
    expect(formatPrice(1000)).toBe('۱٬۰۰۰ تومان');
    expect(formatNumber(1234)).toBe('۱٬۲۳۴');
  });

  it('formats dates', () => {
    expect(formatDate('2024-01-01T00:00:00.000Z')).toContain('۱۴۰۲');
    expect(formatDateTime('2024-01-01T00:00:00.000Z')).toContain('۱۴۰۲');
  });
});

describe('normalizeImage', () => {
  it('returns null for empty values', () => {
    expect(normalizeImage(null)).toBeNull();
    expect(normalizeImage('  ')).toBeNull();
  });

  it('adds a leading slash to relative paths', () => {
    expect(normalizeImage('images/a.jpg')).toBe('/images/a.jpg');
    expect(normalizeImage('/images/a.jpg')).toBe('/images/a.jpg');
  });

  it('keeps absolute and data URLs', () => {
    expect(normalizeImage('https://x.test/a.jpg')).toBe('https://x.test/a.jpg');
    expect(normalizeImage('data:image/png;base64,aa')).toBe(
      'data:image/png;base64,aa',
    );
  });
});

describe('absoluteImage', () => {
  it('prefixes relative paths with the API URL', () => {
    expect(absoluteImage('/a.jpg')).toBe('http://localhost:3000/a.jpg');
  });

  it('returns absolute URLs unchanged', () => {
    expect(absoluteImage('https://x.test/a.jpg')).toBe('https://x.test/a.jpg');
  });
});

describe('cartTotal', () => {
  it('sums line totals and falls back to price * quantity', () => {
    expect(
      cartTotal([
        { totalPrice: 2000, quantity: 2, product: { price: 1000 } },
        { totalPrice: 0, quantity: 3, product: { price: 500 } },
      ]),
    ).toBe(3500);
  });
});