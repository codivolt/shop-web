"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/lib/api/client";
import type { Address } from "@/lib/types";
import { useAuthState } from "./use-auth";

const addressKey = (token: string | null) => ["addresses", token] as const;

export type AddressInput = {
  title?: string;
  recipientName?: string;
  phone?: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode?: string;
  isDefault?: boolean;
};

export function useAddresses() {
  const { token } = useAuthState();

  return useQuery({
    queryKey: addressKey(token),
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await http.get<Address[] | { data: Address[] }>(
        "/addresses?limit=50",
      );
      return Array.isArray(data) ? data : data.data;
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async (input: AddressInput) => {
      const { data } = await http.post<Address>("/addresses", input);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKey(token) });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/addresses/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKey(token) });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await http.put<Address>(`/addresses/${id}/default`);
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: addressKey(token) });
    },
  });
}
