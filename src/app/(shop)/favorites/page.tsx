"use client";

import { ProductGrid } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLayout } from "@/components/ui/page-layout";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { useAuthState } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";

export default function FavoritesPage() {
  const { isAuthenticated } = useAuthState();
  const { data, isLoading } = useFavorites();

  return (
    <PageLayout
      title="علاقه‌مندی‌ها"
      description="محصولاتی که ذخیره کرده‌اید تا بعداً پیدا کنید."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "علاقه‌مندی‌ها" }]}
    >
      {!isAuthenticated ? (
        <EmptyState
          title="برای دیدن علاقه‌مندی‌ها وارد شوید"
          description="پس از ورود، محصولات ذخیره‌شده در این صفحه نمایش داده می‌شوند."
          actionLabel="ورود به حساب"
          actionHref="/login"
        />
      ) : isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : data && data.length > 0 ? (
        <ProductGrid products={data} />
      ) : (
        <EmptyState
          title="هنوز محصولی ذخیره نکرده‌اید"
          description="روی آیکون قلب در کارت محصول بزنید تا به علاقه‌مندی‌ها اضافه شود."
          actionLabel="رفتن به فروشگاه"
          actionHref="/products"
        />
      )}
    </PageLayout>
  );
}