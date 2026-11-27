"use client";


import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState, PageLayout, OrderCard, Skeleton } from "@/components/ui";
import { useOrders } from "@/hooks/use-orders";
import { apiErrorMessage } from "@/lib/api/client";
import {
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  formatDateTime,
} from "@/lib/format";

export default function OrdersPage() {
  return (
    <RequireAuth>
      <OrdersView />
    </RequireAuth>
  );
}

function OrdersView() {
  const orders = useOrders(1, 50);

  return (
    <PageLayout
      title="سفارش‌های من"
      description="وضعیت سفارش‌های رولچی را پیگیری کنید و جزئیات هر سفارش را ببینید."
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "سفارش‌ها" }]}
      actionLabel="خرید جدید"
      actionHref="/products"
      actionVariant="ghost"
      actionSize="sm"
    >
      {orders.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : orders.isError ? (
        <EmptyState
          title="دریافت سفارش‌ها ممکن نشد"
          description={apiErrorMessage(orders.error)}
        />
      ) : !orders.data || orders.data.data.length === 0 ? (
        <EmptyState
          title="هنوز سفارشی ثبت نکرده‌اید"
          description="اولین سفارش خود را از فروشگاه ثبت کنید تا در این بخش قابل پیگیری باشد."
          actionLabel="مشاهده محصولات"
          actionHref="/products"
        />
      ) : (
        <div className="space-y-3">
          {orders.data.data.map((order) => {
            const status = ORDER_STATUS_META[order.status];
            const payment = PAYMENT_STATUS_META[order.paymentStatus];

            return (
              <OrderCard
                key={order.id}
                id={order.id}
                totalAmount={order.totalAmount}
                status={{ label: status.label, className: status.className }}
                paymentStatus={{ label: payment.label, className: payment.className }}
                createdAt={formatDateTime(order.createdAt)}
                items={order.items}
                href={`/orders/detail?id=${order.id}`}
              />
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}