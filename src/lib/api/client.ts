import axios from "axios";

import { API_URL } from "../site";
import { clearSession, getToken } from "../session";

export const http = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
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
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      getToken()
    ) {
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
