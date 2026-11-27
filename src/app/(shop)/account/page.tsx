"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { AccountOrders } from "@/components/account/account-orders";
import { AccountProfileCard } from "@/components/account/account-profile-card";
import { AddressesCard } from "@/components/account/addresses-card";
import { AddressForm } from "@/components/account/address-form";
import { PasswordForm } from "@/components/account/password-form";
import { ProfileForm } from "@/components/account/profile-form";
import { RequireAuth } from "@/components/auth/require-auth";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useAuthActions, useAuthState } from "@/hooks/use-auth";
import { useMe, useRefreshMe } from "@/hooks/use-auth-mutations";
import {
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/use-addresses";
import { useApplyReferral } from "@/hooks/use-profile";
import { apiErrorMessage } from "@/lib/api/client";
import { updateStoredUser } from "@/lib/session";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/auth-slice";

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
        <AccountProfileCard
          user={user}
          hasPassword={hasPassword}
          onEditProfile={() => setProfileOpen(true)}
          onChangePassword={() => setPasswordOpen(true)}
          onApplyReferral={handleApplyReferral}
        />

        <AddressesCard
          addresses={addresses.data}
          isLoading={addresses.isLoading}
          isDeleting={deleteAddress.isPending}
          isSetDefault={setDefaultAddress.isPending}
          onAdd={() => setModalOpen(true)}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
        />

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