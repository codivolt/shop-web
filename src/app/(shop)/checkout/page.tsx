"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import { AddressForm } from "@/components/account/address-form";
import { RequireAuth } from "@/components/auth/require-auth";
import { ProductImage } from "@/components/product/product-image";
import {
  Button,
  buttonStyles,
  EmptyState,
  PageLayout,
  OrderSummary,
  OrderItemList,
  CheckoutStep,
  AddressCard,
  DeliveryMethodCard,
  PaymentMethodCard,
  Skeleton,
} from "@/components/ui";
import { useAddresses } from "@/hooks/use-addresses";
import { useCart, useClearCart } from "@/hooks/use-cart";
import { useCreateOrder, useUploadReceipt } from "@/hooks/use-orders";
import { useValidateDiscount } from "@/hooks/use-profile";
import { useDeliveryMethods } from "@/hooks/use-delivery";
import { usePaymentAccounts } from "@/hooks/use-payment-accounts";
import { apiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Address, DeliveryMethod, PaymentAccount } from "@/lib/types";

const RECEIPT_REQUIRED_TYPES = new Set([
  "card_to_card",
  "sheba",
  "crypto",
]);

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
  const needsReceipt =
    Boolean(selectedPayment) &&
    RECEIPT_REQUIRED_TYPES.has((selectedPayment?.type as any) ?? "");
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
    } catch (error) {
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
    const file = e.target.files?.[0] ?? null;
    setReceiptFile(file);
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
      title="ثبت سفارش و پرداخت"
      description="روش ارسال، آدرس و روش پرداخت را بررسی کنید و سفارش را نهایی کنید."
      eyebrow="تکمیل سفارش"
      breadcrumbs={[{ label: "خانه", href: "/" }, { label: "تسویه حساب" }]}
    >
      <div className="grid items-start gap-3 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          <CheckoutStep number={1} title="روش ارسال">
            {deliveryMethods.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-5 text-center">
                <p className="text-sm text-stone-500">
                  روش ارسالی تعریف نشده است. با پشتیبانی تماس بگیرید.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {deliveryMethods.map((method) => (
                  <DeliveryMethodCard
                    key={method.id}
                    id={method.id}
                    name={method.name}
                    description={method.description}
                    price={method.price}
                    selected={selectedDeliveryId === method.id}
                    onSelect={() => {
                      setPickedDeliveryId(method.id);
                    }}
                  />
                ))}
              </div>
            )}
          </CheckoutStep>

          <CheckoutStep number={2} title="آدرس تحویل">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-base font-black text-stone-900" />
              {addressList.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setShowForm((open) => !open)}
                  className="text-xs font-semibold text-brand-700 hover:underline"
                >
                  {formVisible ? "بستن فرم" : "افزودن آدرس جدید +"}
                </button>
              ) : null}
            </div>

            {addresses.isLoading ? (
              <div className="mt-4 space-y-3">
                <Skeleton className="h-20 w-full rounded-2xl" />
                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            ) : addressList.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {addressList.map((address) => (
                  <AddressCard
                    key={address.id}
                    id={address.id}
                    title={address.title}
                    province={address.province}
                    city={address.city}
                    addressLine={address.addressLine}
                    recipientName={address.recipientName}
                    phone={address.phone}
                    isDefault={address.isDefault}
                    selected={selectedAddressId === address.id}
                    onSelect={() => {
                      setPickedAddressId(address.id);
                    }}
                  />
                ))}
              </div>
            ) : null}

            {formVisible ? (
              <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-5">
                <p className="mb-4 text-xs font-bold text-stone-600">
                  ثبت آدرس جدید
                </p>
                <AddressForm
                  onCreated={handleAddressCreated}
                  onCancel={
                    addressList.length > 0 ? () => setShowForm(false) : undefined
                  }
                />
              </div>
            ) : null}
          </CheckoutStep>

          <CheckoutStep number={3} title="روش پرداخت">
            {accounts.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-5 text-center">
                <p className="text-sm text-stone-500">
                  روش پرداخت تعریف نشده است. با پشتیبانی تماس بگیرید.
                </p>
              </div>
            ) : (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {accounts.map((account) => {
                  const requiresReceipt = RECEIPT_REQUIRED_TYPES.has(
                    account.type as any,
                  );
                  return (
                    <PaymentMethodCard
                      key={account.id}
                      id={account.id}
                      name={account.name}
                      type={account.type}
                      bankName={account.bankName}
                      cardNumber={account.cardNumber}
                      sheba={account.sheba}
                      cryptoAddress={account.cryptoAddress}
                      selected={selectedPaymentId === account.id}
                      onSelect={() => {
                        setPickedPaymentId(account.id);
                      }}
                      requiresReceipt={requiresReceipt}
                    />
                  );
                })}
              </div>
            )}
          </CheckoutStep>

          <CheckoutStep number={4} title="کد تخفیف">
            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="کد تخفیف را وارد کنید"
                  className="flex-1 rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  disabled={validateDiscount.isPending || appliedDiscountCode !== null}
                />
                {appliedDiscountCode ? (
                  <button
                    type="button"
                    onClick={handleRemoveDiscount}
                    className="px-4 py-3 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors font-medium"
                  >
                    حذف
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    disabled={validateDiscount.isPending || !discountCode.trim()}
                    className="px-4 py-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {validateDiscount.isPending ? "در حال بررسی..." : "اعمال"}
                  </button>
                )}
              </div>
              {appliedDiscountCode && (
                <p className="mt-2 text-sm text-emerald-600 font-medium">
                  ✓ کد <span className="font-mono">{appliedDiscountCode}</span> اعمال شد — تخفیف: {discountAmount.toLocaleString()} تومان
                </p>
              )}
            </div>
          </CheckoutStep>

          <OrderItemList items={items} />
        </div>

        <OrderSummary
          items={items}
          subtotal={subtotal}
          deliveryPrice={deliveryPrice}
          totalAmount={totalAmount}
          discountAmount={discountAmount}
          deliveryLabel="هزینه ارسال"
          actionLabel={orderPlaced ? (needsReceipt ? "آپلود فیش و نهایی کردن" : "مشاهده سفارش") : "ثبت نهایی سفارش"}
          onAction={orderPlaced ? (needsReceipt ? handleUploadReceipt : () => {
            void clearCart.mutateAsync().catch(() => undefined);
            router.push(`/orders/detail?id=${createdOrderId}`);
          }) : handleSubmit}
          loading={createOrder.isPending || uploadReceipt.isPending}
          disabled={
            !orderPlaced && (
              !selectedAddressId ||
              !selectedDeliveryId ||
              !selectedPaymentId
            )
          }
          variant="checkout"
          footer={
            <>
              {!orderPlaced && (
                <Link
                  href="/cart"
                  className={buttonStyles({
                    variant: "ghost",
                    size: "sm",
                    className: "mt-2 w-full",
                  })}
                >
                  بازگشت به سبد خرید
                </Link>
              )}
              {orderPlaced && needsReceipt && (
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                    بارگذاری فیش پرداخت
                  </p>
                  <label className="block">
                    <Button
                      onClick={() => receiptInputRef.current?.click()}
                      disabled={uploadReceipt.isPending}
                      size="sm"
                      className="w-full"
                    >
                      انتخاب فیش
                    </Button>
                    <input
                      ref={receiptInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleReceiptChange}
                      className="sr-only"
                    />
                  </label>
                  {receiptFile && (
                    <p className="text-[11px] text-stone-500 mt-1">
                      فیش انتخاب شده: {receiptFile.name}
                    </p>
                  )}
                </div>
              )}
            </>
          }
        />
      </div>
    </PageLayout>
  );
}