"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { http } from "@/lib/api/client";
import { updateStoredUser } from "@/lib/session";
import type { User } from "@/lib/types";
import { setUser } from "@/store/auth-slice";
import { useAppDispatch } from "@/store/hooks";
import { useAuthState } from "./use-auth";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async (input: {
      firstName?: string;
      lastName?: string;
    }) => {
      const { data } = await http.put<User>("/users/me", input);
      return data;
    },
    onSuccess: (user) => {
      dispatch(setUser(user));
      updateStoredUser(user);
      void queryClient.invalidateQueries({ queryKey: ["me", token] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await http.post<User>("/users/me/avatar", formData);
      return data;
    },
    onSuccess: (user) => {
      dispatch(setUser(user));
      updateStoredUser(user);
      void queryClient.invalidateQueries({ queryKey: ["me", token] });
    },
  });
}

export function useSetPassword() {
  return useMutation({
    mutationFn: async (input: {
      currentPassword?: string;
      newPassword: string;
    }) => {
      const { data } = await http.put<{ message: string }>(
        "/users/me/password",
        {
          currentPassword: input.currentPassword || undefined,
          newPassword: input.newPassword,
        },
      );
      return data;
    },
  });
}

export function useApplyReferral() {
  const queryClient = useQueryClient();
  const { token } = useAuthState();

  return useMutation({
    mutationFn: async (referralCode: string) => {
      const { data } = await http.post<{ message: string }>(
        "/users/me/referral",
        { referralCode },
      );
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["me", token] });
    },
  });
}

export function useValidateDiscount() {
  return useMutation({
    mutationFn: async (input: { code: string; orderAmount: number }) => {
      const { data } = await http.post<{
        valid: boolean;
        discount?: { id: string; code: string; type: string; value: number };
        discountAmount: number;
        message?: string;
      }>("/discounts/validate", {
        code: input.code,
        orderAmount: input.orderAmount,
      });
      return data;
    },
  });
}
