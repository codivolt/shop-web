"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearSession, setSession } from "@/store/auth-slice";
import { clearSession as clearStoredSession, saveSession } from "@/lib/session";
import { mergeGuestCartIntoServer } from "@/lib/guest-cart";
import type { AuthResponse } from "@/lib/types";

export function useAuthState() {
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useAppSelector((state) => state.auth.hydrated);

  return {
    token,
    user,
    hydrated,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === "admin",
  };
}

export function useAuthActions() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const login = async (auth: AuthResponse) => {
    saveSession(auth);
    await mergeGuestCartIntoServer().catch(() => false);
    dispatch(setSession({ token: auth.access_token, user: auth.user }));
    await queryClient.invalidateQueries();
  };

  const logout = () => {
    clearStoredSession();
    dispatch(clearSession());
    queryClient.clear();
  };

  return { login, logout };
}

export function displayName(
  user: { firstName: string | null; lastName: string | null; phone: string | null } | null,
): string {
  if (!user) return "کاربر";
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  if (user.phone) return user.phone;
  return "کاربر";
}
