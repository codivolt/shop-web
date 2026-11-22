import { http } from "./api/client";
import type { CartItem, CartLineProduct } from "./types";

const GUEST_CART_STORAGE_KEY = "shoplab.guest_cart";

function isStorageAvailable(): boolean {
  return typeof window !== "undefined";
}

export function readGuestCart(): CartItem[] {
  if (!isStorageAvailable()) return [];

  try {
    const raw = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<CartItem>;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.productId === "string" &&
        typeof candidate.quantity === "number" &&
        typeof candidate.product === "object" &&
        candidate.product !== null
      );
    });
  } catch {
    return [];
  }
}

export function writeGuestCart(items: CartItem[]): CartItem[] {
  if (isStorageAvailable()) {
    if (items.length > 0) {
      window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
    } else {
      window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    }
  }
  return items;
}

export function clearGuestCart(): void {
  writeGuestCart([]);
}

export function addGuestCartItem(
  product: CartLineProduct,
  quantity: number,
): CartItem[] {
  const items = readGuestCart();
  const existing = items.find((item) => item.productId === product.id);
  const maxQuantity = Math.max(1, product.stock);

  if (existing) {
    existing.quantity = Math.min(maxQuantity, existing.quantity + quantity);
    existing.product = product;
    existing.totalPrice = product.price * existing.quantity;
    return writeGuestCart(items);
  }

  const next: CartItem = {
    id: `guest-${product.id}`,
    productId: product.id,
    product,
    quantity: Math.min(maxQuantity, quantity),
    totalPrice: product.price * Math.min(maxQuantity, quantity),
  };

  return writeGuestCart([...items, next]);
}

export function updateGuestCartQuantity(id: string, quantity: number): CartItem[] {
  const items = readGuestCart().map((item) => {
    if (item.id !== id) return item;
    const nextQuantity = Math.max(1, Math.min(item.product.stock || 1, quantity));
    return {
      ...item,
      quantity: nextQuantity,
      totalPrice: item.product.price * nextQuantity,
    };
  });

  return writeGuestCart(items);
}

export function removeGuestCartItem(id: string): CartItem[] {
  return writeGuestCart(readGuestCart().filter((item) => item.id !== id));
}

export async function mergeGuestCartIntoServer(): Promise<boolean> {
  const items = readGuestCart();
  if (items.length === 0) return false;

  const failed: CartItem[] = [];

  await Promise.all(
    items.map(async (item) => {
      try {
        await http.post("/cart", {
          productId: item.productId,
          quantity: item.quantity,
        });
      } catch {
        // محصول حذف/غیرفعال شده یا خطای شبکه؛ این آیتم برای تلاش بعدی می‌ماند.
        failed.push(item);
      }
    }),
  );

  writeGuestCart(failed);

  return failed.length < items.length;
}
