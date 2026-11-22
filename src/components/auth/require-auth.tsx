"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuthState } from "@/hooks/use-auth";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { hydrated, isAuthenticated } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      const nextPath = `${window.location.pathname}${window.location.search}`;
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        <p className="text-sm text-stone-500">
          {hydrated
            ? "برای ادامه وارد حساب کاربری شوید..."
            : "در حال بررسی وضعیت ورود..."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
