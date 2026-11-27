import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section";
import type { Product } from "@/lib/types";

export function NewArrivalsSection({ products }: { products: Product[] }) {
  return (
    <section className="mt-10 container-page">
      <SectionHeading
        eyebrow="تازه‌ها"
        title="تازه از دل شهر رسیده"
        description="جدیدترین توتون‌ها و لوازم رول‌کردن رولچی، با موجودی به‌روز."
        actionLabel="مشاهده فروشگاه"
        actionHref="/products"
      />
      {products.length > 0 ? (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="هنوز محصولی ثبت نشده است"
          description="با اضافه‌کردن محصولات از پنل مدیریت، این بخش به‌صورت خودکار تکمیل می‌شود."
          actionLabel="مشاهده فروشگاه"
          actionHref="/products"
        />
      )}
    </section>
  );
}