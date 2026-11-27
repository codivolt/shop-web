"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/lib/api/client";
import type { Product } from "@/lib/types";
import { useAuthState } from "./use-auth";

const favoritesKey = (token: string | null) =>
  ["favorites", token ?? "guest"] as const;

export function useFavorites() {
  const { token } = useAuthState();

  return useQuery({
    queryKey: favoritesKey(token),
    enabled: Boolean(token),
    staleTime: 30_000,
    queryFn: async () => {
      const { data } = await http.get<Product[]>("/favorites");
      return data;
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { productId: string; isFavorite: boolean }) => {
      if (input.isFavorite) {
        await http.delete(`/favorites/${input.productId}`);
      } else {
        await http.post(`/favorites/${input.productId}`);
      }
      return input;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}