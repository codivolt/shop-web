"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { AddressForm } from "@/components/account/address-form";
import { PasswordForm } from "@/components/account/password-form";
import { ProfileForm } from "@/components/account/profile-form";
import { RequireAuth } from "@/components/auth/require-auth";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { displayName, useAuthActions, useAuthState } from "@/hooks/use-auth";
import {
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/use-addresses";
import { useApplyReferral } from "@/hooks/use-profile";
import { useMe, useRefreshMe } from "@/hooks/use-auth-mutations";
import { useOrders } from "@/hooks/use-orders";
import { apiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import {
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
  absoluteImage,
  formatDateTime,
  formatNumber,
  formatPrice,
} from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/auth-slice";
import { updateStoredUser } from "@/lib/session";

const ORDER_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "ثبت شد" },
  { status: "processing", label: "پردازش" },
  { status: "shipped", label: "ارسال" },
  { status: "delivered", label: "تحویل" },
];

const ACTIVE_STATUSES: OrderStatus[] = ["pending", "processing", "shipped"];

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountView />
    </RequireAuth>
  );
}

function AccountView() {
  const { user } = useAuthState();
  const me = useMe();
  const refreshMe = useRefreshMe();
  const dispatch = useAppDispatch();
  const { logout } = useAuthActions();
  const router = useRouter();
  const addresses = useAddresses();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();
  const [modalOpen, setModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const avatarSrc = absoluteImage(user?.avatarUrl);
  const hasPassword = Boolean(user?.passwordSetAt);
  const applyReferral = useApplyReferral();

  const handleApplyReferral = async (code: string) => {
    try {
      await applyReferral.mutateAsync(code);
      toast.success("کد رفرال اعمال شد");
      void refreshMe();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  useEffect(() => {
    if (me.data) {
      dispatch(setUser(me.data));
      updateStoredUser(me.data);
    }
  }, [me.data, dispatch]);

  const handleDelete = (id: string) => {
    deleteAddress.mutate(id, {
      onSuccess: () => toast.success("آدرس حذف شد"),
      onError: (error) => toast.error(apiErrorMessage(error)),
    });
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress.mutate(id, {
      onSuccess: () => toast.success("آدرس پیش‌فرض تغییر کرد"),
      onError: (error) => toast.error(apiErrorMessage(error)),
    });
  };

  return (
    <div className="container-page py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
            حساب کاربری رولچی
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            اطلاعات حساب، آدرس‌ها و سفارش‌های رولچی‌ات را همین‌جا مدیریت کن.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout();
            toast.success("از حساب خارج شدید");
            router.replace("/");
          }}
        >
          خروج از حساب
        </Button>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[320px_1fr]">
        <section className="rounded-3xl border border-stone-200/80 bg-white p-6">
          <div className="flex items-center gap-4">
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-100 text-xl font-black text-brand-800">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt="عکس پروفایل"
                  fill
                  sizes="56px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                displayName(user).slice(0, 1)
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-stone-900">
                {displayName(user)}
              </p>
              <p className="mt-1 text-[11px] text-stone-400">
                {user?.role === "admin" ? "مدیر فروشگاه" : "مشتری"}
              </p>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div>
              <dt className="text-[11px] text-stone-400">شماره موبایل</dt>
              <dd className="mt-1 font-semibold text-stone-800" dir="ltr">
                {user?.phone ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-stone-400">ایمیل</dt>
              <dd className="mt-1 truncate font-semibold text-stone-800" dir="ltr">
                {user?.email ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-stone-400">نام</dt>
              <dd className="mt-1 font-semibold text-stone-800">
                {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || "—"}
              </dd>
            </div>
          </dl>

          {user?.referralCode ? (
            <ReferralSection user={user} applyReferral={handleApplyReferral} />
          ) : null}

          <div className="mt-4 grid gap-2 border-t border-stone-100 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProfileOpen(true)}
            >
              ویرایش پروفایل
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPasswordOpen(true)}
            >
              {hasPassword ? "تغییر رمز عبور" : "تعیین رمز عبور"}
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200/80 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-black text-stone-900">آدرس‌های من</h2>
            <Button size="sm" onClick={() => setModalOpen(true)}>
              افزودن آدرس
            </Button>
          </div>

          {addresses.isLoading ? (
            <div className="mt-5 space-y-3">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ) : !addresses.data || addresses.data.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                title="آدرسی ثبت نشده است"
                description="برای ثبت سفارش، حداقل یک آدرس تحویل اضافه کنید."
              >
                <Button size="sm" onClick={() => setModalOpen(true)}>
                  افزودن آدرس
                </Button>
              </EmptyState>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {addresses.data.map((address) => (
                <div
                  key={address.id}
                  className="rounded-2xl border border-stone-200 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-stone-800">
                      {address.title ?? "آدرس"}
                    </p>
                    {address.isDefault ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        پیش‌فرض
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xs leading-6 text-stone-600">
                    {address.province}، {address.city}، {address.addressLine}
                  </p>
                  <p className="mt-1 text-[11px] text-stone-400">
                    {address.recipientName ?? "گیرنده"}
                    {address.phone ? ` — ${address.phone}` : ""}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {!address.isDefault ? (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(address.id)}
                        disabled={setDefaultAddress.isPending}
                        className="text-[11px] font-semibold text-brand-700 hover:underline disabled:opacity-50"
                      >
                        پیش‌فرض شود
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(address.id)}
                      disabled={deleteAddress.isPending}
                      className="text-[11px] font-semibold text-rose-300 hover:underline disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <AccountOrders />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="افزودن آدرس جدید"
        description="اطلاعات آدرس تحویل را کامل وارد کنید."
      >
        <AddressForm
          onCreated={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        title="ویرایش پروفایل"
        description="نام و عکس پروفایل خود را به‌روزرسانی کنید."
      >
        <ProfileForm onDone={() => setProfileOpen(false)} />
      </Modal>

      <Modal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title={hasPassword ? "تغییر رمز عبور" : "تعیین رمز عبور"}
        description={
          hasPassword
            ? "برای امنیت حساب، ابتدا رمز فعلی را وارد کنید."
            : "با تعیین رمز می‌توانید با شماره موبایل و رمز وارد شوید."
        }
      >
        <PasswordForm
          hasPassword={hasPassword}
          onDone={() => setPasswordOpen(false)}
        />
      </Modal>
    </div>
  );
}

function AccountOrders() {
  const orders = useOrders(1, 10);
  const list = orders.data?.data ?? [];
  const activeOrder = list.find((order) =>
    ACTIVE_STATUSES.includes(order.status),
  );

  return (
    <section className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-stone-900">سفارش‌های من</h2>
          <p className="mt-1 text-[11px] text-stone-400">
            وضعیت سفارش‌های در جریان و تاریخچه خریدها
          </p>
        </div>
        <Link
          href="/orders"
          className="text-xs font-semibold text-brand-700 hover:underline"
        >
          مشاهده همه سفارش‌ها ←
        </Link>
      </div>

      {orders.isLoading ? (
        <div className="mt-5 space-y-3">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      ) : orders.isError ? (
        <p className="mt-5 rounded-xl bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
          {apiErrorMessage(orders.error)}
        </p>
      ) : list.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="هنوز سفارشی ثبت نکرده‌اید"
            description="با ثبت اولین سفارش، وضعیت آن در همین بخش قابل پیگیری خواهد بود."
          >
            <Link href="/products" className={buttonStyles({ size: "sm" })}>
              شروع خرید
            </Link>
          </EmptyState>
        </div>
      ) : (
        <>
          {activeOrder ? (
            <ActiveOrderCard order={activeOrder} />
          ) : (
            <LatestOrderSummary order={list[0]} />
          )}

          {list.length > 1 ? (
            <ul className="mt-5 divide-y divide-stone-100 border-t border-stone-100">
              {list.slice(0, 5).map((order) => {
                const status = ORDER_STATUS_META[order.status];
                return (
                  <li key={order.id}>
                    <Link
                      href={`/orders/detail?id=${order.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 py-3.5 transition hover:text-brand-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 text-[10px] font-black text-stone-500">
                          #{order.id.slice(0, 4)}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-stone-800">
                            {formatPrice(order.totalAmount)}
                          </p>
                          <p className="mt-0.5 text-[10px] text-stone-400">
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          label={status.label}
                          className={status.className}
                        />
                        <span aria-hidden className="text-stone-300">
                          ←
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}

function ActiveOrderCard({ order }: { order: Order }) {
  const status = ORDER_STATUS_META[order.status];
  const payment = PAYMENT_STATUS_META[order.paymentStatus];
  const currentStep = ORDER_STEPS.findIndex((step) => step.status === order.status);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const names = order.items
    .map((item) => item.productNameSnapshot)
    .slice(0, 2)
    .join("، ");

  return (
    <div className="mt-5 rounded-2xl border border-brand-500/30 bg-gradient-to-l from-brand-500/15 via-ink-800 to-ink-800 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-xs font-black text-brand-800">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
            سفارش در جریان
          </p>
          <p className="mt-1 text-[11px] text-stone-500">
            سفارش #{order.id.slice(0, 8)} — {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={status.label} className={status.className} />
          <StatusBadge label={payment.label} className={payment.className} />
        </div>
      </div>

      <ol className="mt-5 grid grid-cols-4 gap-1">
        {ORDER_STEPS.map((step, index) => {
          const active = index <= currentStep;
          return (
            <li key={step.status} className="text-center">
              <div className="flex items-center">
                {index > 0 ? (
                  <span
                    className={cn(
                      "h-0.5 flex-1 rounded-full",
                      index <= currentStep ? "bg-brand-500" : "bg-stone-200",
                    )}
                  />
                ) : (
                  <span className="flex-1" />
                )}
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ring-4",
                    active
                      ? "bg-brand-700 text-white ring-brand-100"
                      : "bg-stone-100 text-stone-400 ring-white",
                  )}
                >
                  {index + 1}
                </span>
                {index < ORDER_STEPS.length - 1 ? (
                  <span
                    className={cn(
                      "h-0.5 flex-1 rounded-full",
                      index < currentStep ? "bg-brand-500" : "bg-stone-200",
                    )}
                  />
                ) : (
                  <span className="flex-1" />
                )}
              </div>
              <p
                className={cn(
                  "mt-1.5 text-[10px] font-bold",
                  active ? "text-stone-700" : "text-stone-400",
                )}
              >
                {step.label}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-brand-100 pt-4">
        <div className="min-w-0">
          <p className="line-clamp-1 text-xs text-stone-600">{names}</p>
          <p className="mt-1 text-[10px] text-stone-400">
            {formatNumber(itemCount)} قلم کالا —{" "}
            {formatPrice(order.totalAmount)}
          </p>
        </div>
        <Link
          href={`/orders/detail?id=${order.id}`}
          className={buttonStyles({ size: "sm" })}
        >
          پیگیری سفارش
        </Link>
      </div>
    </div>
  );
}

function LatestOrderSummary({ order }: { order: Order }) {
  const status = ORDER_STATUS_META[order.status];

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
      <div>
        <p className="text-[11px] text-stone-500">آخرین سفارش شما</p>
        <p className="mt-1 text-xs font-bold text-stone-800">
          #{order.id.slice(0, 8)} — {formatPrice(order.totalAmount)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge label={status.label} className={status.className} />
        <Link
          href={`/orders/detail?id=${order.id}`}
          className="text-[11px] font-semibold text-brand-700 hover:underline"
        >
          جزئیات
        </Link>
      </div>
    </div>
  );
}

function ReferralSection({
  user,
  applyReferral,
}: {
  user: { referralCode: string | null; referredBy: string | null };
  applyReferral: (code: string) => void;
}) {
  const [code, setCode] = useState("");
  const [inputOpen, setInputOpen] = useState(false);

  return (
    <section className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-black text-stone-900">کد رفرال من</h2>
        {!user.referredBy && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInputOpen(true)}
          >
            اعمال کد معرف
          </Button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-[11px] text-stone-400">کد referral شما:</span>
        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2">
          <span dir="ltr" className="font-mono font-bold text-brand-700">
            {user.referralCode}
          </span>
          <button
            type="button"
            className="rounded p-1 text-stone-400 hover:text-stone-600"
            onClick={() => {
              navigator.clipboard.writeText(user.referralCode ?? "");
              toast.success("کد کپی شد");
            }}
            title="کپی کد"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="16" height="12" x="2" y="4" rx="2" ry="2" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="M12 14l2-2 2 2" />
            </svg>
          </button>
        </div>
      </div>

      {user.referredBy && (
        <p className="mt-3 text-[11px] text-stone-500">
          شما با کد معرف وارد شده‌اید.
        </p>
      )}

      {inputOpen && (
        <div className="mt-4 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim()) {
                applyReferral(code.trim().toUpperCase());
                setInputOpen(false);
                setCode("");
              }
            }}
            className="flex gap-2"
          >
            <Input
              id="referral-code"
              label="کد رفرال معرف"
              placeholder="REF12345"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 uppercase"
            />
            <Button type="submit" size="sm">
              اعمال
            </Button>
          </form>
        </div>
      )}
    </section>
  );
}
