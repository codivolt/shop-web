"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/lib/api/client";
import {
  addGuestCartItem,
  clearGuestCart,
  mergeGuestCartIntoServer,
  readGuestCart,
  removeGuestCartItem,
  updateGuestCartQuantity,
} from "@/lib/guest-cart";
import type { CartItem, CartLineProduct } from "@/lib/types";
import { useAuthState } from "./use-auth";

const cartKey = (token: string | null) => ["cart", token ?? "guest"] as const;
const cartPrefix = ["cart"] as const;

export function useCart() {
  const { token } = useAuthState();

  return useQuery({
    queryKey: cartKey(token),
    staleTime: token ? 30_000 : Infinity,
    queryFn: async () => {
      if (!token) return readGuestCart();
      const { data } = await http.get<CartItem[]>("/cart");
      return data;
    },
  });
}

export function useCartCount() {
  const { data } = useCart();
  return data?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async (input: {
      product: CartLineProduct;
      quantity: number;
    }) => {
      if (!token) return addGuestCartItem(input.product, input.quantity);

      const { data } = await http.post<CartItem>("/cart", {
        productId: input.product.id,
        quantity: input.quantity,
      });
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartPrefix });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async (input: { id: string; quantity: number }) => {
      if (!token) return updateGuestCartQuantity(input.id, input.quantity);

      const { data } = await http.put<CartItem>(`/cart/${input.id}`, {
        quantity: input.quantity,
      });
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartPrefix });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) return removeGuestCartItem(id);
      await http.delete(`/cart/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartPrefix });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async () => {
      if (!token) {
        clearGuestCart();
        return;
      }
      await http.delete("/cart");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartPrefix });
    },
  });
}

export function useMergeGuestCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mergeGuestCartIntoServer,
    onSuccess: (merged) => {
      if (merged) {
        void queryClient.invalidateQueries({ queryKey: cartPrefix });
      }
    },
  });
}
