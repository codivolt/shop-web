import { beforeEach, describe, expect, it } from 'vitest';

import {
  addGuestCartItem,
  clearGuestCart,
  readGuestCart,
  removeGuestCartItem,
  updateGuestCartQuantity,
  writeGuestCart,
} from '../../src/lib/guest-cart';
import type { CartLineProduct } from '../../src/lib/types';

const product: CartLineProduct = {
  id: 'p1',
  name: 'توتون',
  slug: 'tutun',
  price: 1000,
  imageUrl: null,
  stock: 5,
};

describe('guest cart', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts empty', () => {
    expect(readGuestCart()).toEqual([]);
  });

  it('adds a new item', () => {
    const items = addGuestCartItem(product, 2);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ productId: 'p1', quantity: 2, totalPrice: 2000 });
  });

  it('merges quantities for the same product and caps at stock', () => {
    addGuestCartItem(product, 2);
    const items = addGuestCartItem(product, 10);
    expect(items[0].quantity).toBe(5);
    expect(items[0].totalPrice).toBe(5000);
  });

  it('updates quantity within stock bounds', () => {
    addGuestCartItem(product, 2);
    const items = updateGuestCartQuantity('guest-p1', 99);
    expect(items[0].quantity).toBe(5);
  });

  it('removes an item', () => {
    addGuestCartItem(product, 1);
    expect(removeGuestCartItem('guest-p1')).toEqual([]);
    expect(readGuestCart()).toEqual([]);
  });

  it('clears the cart', () => {
    writeGuestCart([
      {
        id: 'x',
        productId: 'p1',
        product,
        quantity: 1,
        totalPrice: 1000,
      },
    ]);
    clearGuestCart();
    expect(readGuestCart()).toEqual([]);
  });

  it('ignores malformed stored data', () => {
    window.localStorage.setItem('shoplab.guest_cart', '{bad json');
    expect(readGuestCart()).toEqual([]);
  });
});