import type { AuthResponse, User } from "./types";

const TOKEN_KEY = "shoplab.access_token";
const USER_KEY = "shoplab.user";

export interface StoredSession {
  token: string | null;
  user: User | null;
}

export function readSession(): StoredSession {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const rawUser = window.localStorage.getItem(USER_KEY);
    return {
      token,
      user: rawUser ? (JSON.parse(rawUser) as User) : null,
    };
  } catch {
    return { token: null, user: null };
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function saveSession(auth: AuthResponse): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, auth.access_token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

export function updateStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}
