import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderDetailView } from "./order-detail-view";

export const metadata: Metadata = {
  title: "جزئیات سفارش",
  robots: { index: false, follow: false },
};

export default function OrderDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page flex min-h-[50vh] items-center justify-center">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        </div>
      }
    >
      <OrderDetailView />
    </Suspense>
  );
}
