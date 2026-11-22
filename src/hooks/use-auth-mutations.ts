"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "@/lib/api/client";
import type { AuthResponse } from "@/lib/types";
import { useAuthState } from "./use-auth";

export interface SendCodeInput {
  phone: string;
}

export interface VerifyCodeInput {
  phone: string;
  code: string;
}

export function useSendCode() {
  return useMutation({
    mutationFn: async (input: SendCodeInput) => {
      const { data } = await http.post<{ message: string }>(
        "/auth/send-code",
        input,
      );
      return data;
    },
  });
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: async (input: VerifyCodeInput) => {
      const { data } = await http.post<AuthResponse>(
        "/auth/verify-code",
        input,
      );
      return data;
    },
  });
}

export function usePasswordLogin() {
  return useMutation({
    mutationFn: async (input: { phone: string; password: string }) => {
      const { data } = await http.post<AuthResponse>("/auth/login", input);
      return data;
    },
  });
}

export function useMe() {
  const { token } = useAuthState();

  return useQuery({
    queryKey: ["me", token],
    enabled: Boolean(token),
    retry: false,
    queryFn: async () => {
      const { data } = await http.get<AuthResponse["user"]>("/auth/me");
      return data;
    },
  });
}

export function useRefreshMe() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["me"] });
}
