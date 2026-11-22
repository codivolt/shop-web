"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

import { mergeGuestCartIntoServer } from "@/lib/guest-cart";
import { clearSession as clearStoredSession, readSession } from "@/lib/session";
import { store } from "@/store";
import { clearSession, markHydrated, setSession } from "@/store/auth-slice";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  useEffect(() => {
    const session = readSession();

    if (session.token && session.user) {
      store.dispatch(setSession({ token: session.token, user: session.user }));
      void mergeGuestCartIntoServer().then((merged) => {
        if (merged) {
          void queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
      });
    } else {
      store.dispatch(markHydrated());
    }

    const handleExpired = () => {
      clearStoredSession();
      store.dispatch(clearSession());
      queryClient.clear();
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, [queryClient]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#1c1917",
              color: "#fafaf9",
              borderRadius: "14px",
              fontSize: "13px",
              padding: "10px 16px",
            },
          }}
        />
      </QueryClientProvider>
    </Provider>
  );
}
