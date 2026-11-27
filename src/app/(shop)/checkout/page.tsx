"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import { AddressStep } from "@/components/checkout/address-step";
import { OrderSummaryCard } from "@/components/checkout/order-summary-card";
import { DeliveryStep } from "@/components/checkout/delivery-step";
import { DiscountStep } from "@/components/checkout/discount-step";
import { PaymentStep } from "@/components/checkout/payment-step";
import { RequireAuth } from "@/components/auth/require-auth";
import {
  EmptyState,
  PageLayout,
  OrderItemList,
  Skeleton,
} from "@/components/ui";
import { useAddresses } from "@/hooks/use-addresses";
import { useCart, useClearCart } from "@/hooks/use-cart";
import { useCreateOrder, useUploadReceipt } from "@/hooks/use-orders";
import { useValidateDiscount } from "@/hooks/use-profile";
import { useDeliveryMethods } from "@/hooks/use-delivery";
import { usePaymentAccounts } from "@/hooks/use-payment-accounts";
import { apiErrorMessage } from "@/lib/api/client";
import { requiresReceipt } from "@/lib/checkout";
import type { Address } from "@/lib/types";

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutView />
    </RequireAuth>
  );
}

function CheckoutView() {
  const router = useRouter();
  const cart = useCart();
  const addresses = useAddresses();
  const delivery = useDeliveryMethods();
  const paymentAccounts = usePaymentAccounts();
  const createOrder = useCreateOrder();
  const uploadReceipt = useUploadReceipt();
  const validateDiscount = useValidateDiscount();
  const clearCart = useClearCart();

  const [pickedAddressId, setPickedAddressId] = useState<string | null>(null);
  const [pickedDeliveryId, setPickedDeliveryId] = useState<string | null>(null);
  const [pickedPaymentId, setPickedPaymentId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState<string | null>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(() => cart.data ?? [], [cart.data]);
  const subtotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  const addressList = useMemo(() => addresses.data ?? [], [addresses.data]);
  const deliveryMethods = useMemo(
    () => delivery.data?.filter((m) => m.isActive) ?? [],
    [delivery.data],
  );
  const accounts = useMemo(
    () => paymentAccounts.data?.filter((a) => a.isActive) ?? [],
    [paymentAccounts.data],
  );

  const defaultAddress = useMemo(
    () => addressList.find((address) => address.isDefault) ?? addressList[0],
    [addressList],
  );

  const selectedAddressId = pickedAddressId ?? defaultAddress?.id ?? null;
  const selectedDeliveryId = pickedDeliveryId ?? deliveryMethods[0]?.id ?? null;
  const selectedPaymentId = pickedPaymentId ?? accounts[0]?.id ?? null;
  const selectedDelivery = deliveryMethods.find((m) => m.id === selectedDeliveryId);
  const selectedPayment = accounts.find((a) => a.id === selectedPaymentId);
  const deliveryPrice = Number(selectedDelivery?.price ?? 0);
  const totalAmount = Number(subtotal) + Number(deliveryPrice) - Number(discountAmount);
  const needsReceipt = requiresReceipt(selectedPayment?.type);
  const formVisible = showForm || (!addresses.isLoading && addressList.length === 0);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error("کد تخفیف را وارد کنید");
      return;
    }
    try {
      const result = await validateDiscount.mutateAsync({
        code: discountCode.trim(),
        orderAmount: subtotal + deliveryPrice,
      });
      if (result.valid) {
        setDiscountAmount(result.discountAmount);
        setAppliedDiscountCode(discountCode.trim());
        toast.success(`کد تخفیف اعمال شد: ${result.discountAmount.toLocaleString()} تومان`);
      } else {
        toast.error(result.message || "کد تخفیف معتبر نیست");
      }
    } catch {
      toast.error("خطا در اعمال کد تخفیف");
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode("");
    setDiscountAmount(0);
    setAppliedDiscountCode(null);
    toast.success("کد تخفیف حذف شد");
  };

  const handleAddressCreated = (address: Address) => {
    setPickedAddressId(address.id);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!selectedAddressId) {
      toast.error("ابتدا آدرس تحویل را انتخاب کنید");
      return;
    }
    if (items.length === 0) {
      toast.error("سبد خرید شما خالی است");
      return;
    }
    if (!selectedDeliveryId) {
      toast.error("ابتدا روش ارسال را انتخاب کنید");
      return;
    }
    if (!selectedPaymentId) {
      toast.error("ابتدا روش پرداخت را انتخاب کنید");
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        addressId: selectedAddressId,
        deliveryMethodId: selectedDeliveryId || undefined,
        paymentMethod: selectedPaymentId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
      setCreatedOrderId(order.id);
      toast.success("سفارش شما ثبت شد");
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiptFile(e.target.files?.[0] ?? null);
  };

  const handleUploadReceipt = async () => {
    if (!createdOrderId || !receiptFile) return;
    try {
      await uploadReceipt.mutateAsync({ orderId: createdOrderId, file: receiptFile });
      await clearCart.mutateAsync().catch(() => undefined);
      toast.success("فیش پرداخت بارگذاری شد");
      router.push(`/orders/detail?id=${createdOrderId}`);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  if (cart.isLoading || delivery.isLoading || paymentAccounts.isLoading) {
    return (
      <PageLayout
        title="تکمیل سفارش"
        description="روش ارسال، آدرس و روش پرداخت را بررسی کنید و سفارش را نهایی کنید."
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "تسویه حساب" }]}
      >
        <div className="container-page grid gap-6 py-10 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <Skeleton className="h-72 w-full rounded-3xl" />
        </div>
      </PageLayout>
    );
  }

  if (items.length === 0) {
    return (
      <PageLayout
        title="تکمیل سفارش"
        description="روش ارسال، آدرس و روش پرداخت را بررسی کنید و سفارش را نهایی کنید."
        breadcrumbs={[{ label: "خانه", href: "/" }, { label: "تسویه حساب" }]}
      >
        <EmptyState
          title="سبد خرید خالی است"
          description="برای ثبت سفارش ابتدا محصولی را به سبد خرید اضافه کنید."
          actionLabel="مشاهده محصولات"
          actionHref="/products"
        />
      </PageLayout>
    );
  }

  const orderPlaced = Boolean(createdOrderId);

  return (
    <PageLayout
      title="ثبت سفارش رولچی"
      description="روش ارسال، آدرس و روش پرداخت را بررسی کنید و سفارش را نهایی کنید."
      eyebrow="تکمیل سفارش"
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "تسویه حساب" }]}
    >
      <div className="grid items-start gap-3 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          <DeliveryStep
            methods={deliveryMethods}
            selectedId={selectedDeliveryId}
            onSelect={setPickedDeliveryId}
          />

          <AddressStep
            addresses={addressList}
            selectedId={selectedAddressId}
            isLoading={addresses.isLoading}
            formVisible={formVisible}
            onSelect={setPickedAddressId}
            onToggleForm={() => setShowForm((open) => !open)}
            onCreated={handleAddressCreated}
          />

          <PaymentStep
            accounts={accounts}
            selectedId={selectedPaymentId}
            onSelect={setPickedPaymentId}
          />

          <DiscountStep
            code={discountCode}
            appliedCode={appliedDiscountCode}
            amount={discountAmount}
            isPending={validateDiscount.isPending}
            onCodeChange={setDiscountCode}
            onApply={handleApplyDiscount}
            onRemove={handleRemoveDiscount}
          />

          <OrderItemList items={items} />
        </div>

        <OrderSummaryCard
          items={items}
          subtotal={subtotal}
          deliveryPrice={deliveryPrice}
          totalAmount={totalAmount}
          discountAmount={discountAmount}
          orderPlaced={orderPlaced}
          needsReceipt={needsReceipt}
          loading={createOrder.isPending || uploadReceipt.isPending}
          disabled={
            !orderPlaced &&
            (!selectedAddressId || !selectedDeliveryId || !selectedPaymentId)
          }
          onAction={
            orderPlaced
              ? needsReceipt
                ? handleUploadReceipt
                : () => {
                    void clearCart.mutateAsync().catch(() => undefined);
                    router.push(`/orders/detail?id=${createdOrderId}`);
                  }
              : handleSubmit
          }
          receiptFile={receiptFile}
          onReceiptChange={handleReceiptChange}
          onPickReceipt={() => receiptInputRef.current?.click()}
        />
      </div>
    </PageLayout>
  );
}