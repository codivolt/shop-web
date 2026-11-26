import type { ReactNode } from "react";

import { BrandStrip } from "@/components/layout/brand-strip";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <BrandStrip />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
