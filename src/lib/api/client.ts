import axios from "axios";

import { API_URL } from "../site";
import { clearSession, getToken, saveSession } from "../session";

export const http = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const status = error.response?.status;
    const config = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (status === 401 && config && !config._retry) {
      config._retry = true;
      try {
        const refresh = await http.post("/auth/refresh", undefined, {
          withCredentials: true,
        });
        saveSession(refresh.data);
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return http(config);
      } catch {
        clearSession();
        window.dispatchEvent(new Event("auth:expired"));
      }
    }

    if (status === 401 && getToken()) {
      clearSession();
      window.dispatchEvent(new Event("auth:expired"));
    }

    return Promise.reject(error);
  },
);

export function apiErrorMessage(
  error: unknown,
  fallback = "خطایی رخ داد، دوباره تلاش کنید",
): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { message?: string | string[] })
      ?.message;
    if (Array.isArray(message)) return message.join("، ");
    if (typeof message === "string" && message) return message;
    if (error.code === "ECONNABORTED") return "زمان پاسخ سرور به پایان رسید";
    if (!error.response) return "ارتباط با سرور برقرار نشد";
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}