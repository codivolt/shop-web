"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/lib/api/client";
import type { Order, Paginated } from "@/lib/types";
import { useAuthState } from "./use-auth";

const orderKey = (token: string | null) => ["orders", token] as const;

export function useOrders(page = 1, limit = 20) {
  const { token } = useAuthState();

  return useQuery({
    queryKey: [...orderKey(token), page, limit],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await http.get<Paginated<Order>>("/orders", {
        params: { page, limit },
      });
      return data;
    },
  });
}

export function useOrder(id: string) {
  const { token } = useAuthState();

  return useQuery({
    queryKey: [...orderKey(token), "detail", id],
    enabled: Boolean(token) && Boolean(id),
    queryFn: async () => {
      const { data } = await http.get<Order>(`/orders/${id}`);
      return data;
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async (input: {
      addressId: string;
      deliveryMethodId?: string;
      paymentMethod?: string;
      items: { productId: string; quantity: number }[];
    }) => {
      const { data } = await http.post<Order>("/orders", input);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders", token] });
      void queryClient.invalidateQueries({ queryKey: ["cart", token] });
    },
  });
}

export function useUploadReceipt() {
  return useMutation({
    mutationFn: async (input: {
      orderId: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("file", input.file);
      const { data } = await http.post<Order>(
        `/orders/${input.orderId}/receipt`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
  });
}
