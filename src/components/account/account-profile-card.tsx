"use client";

import Image from "next/image";

import { ReferralSection } from "@/components/account/referral-section";
import { Button } from "@/components/ui/button";
import { displayName } from "@/hooks/use-auth";
import { absoluteImage } from "@/lib/format";
import type { User } from "@/lib/types";

interface AccountProfileCardProps {
  user: User | null;
  hasPassword: boolean;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onApplyReferral: (code: string) => void;
}

export function AccountProfileCard({
  user,
  hasPassword,
  onEditProfile,
  onChangePassword,
  onApplyReferral,
}: AccountProfileCardProps) {
  const avatarSrc = absoluteImage(user?.avatarUrl);

  return (
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
        <ReferralSection user={user} applyReferral={onApplyReferral} />
      ) : null}

      <div className="mt-4 grid gap-2 border-t border-stone-100 pt-4">
        <Button variant="outline" size="sm" onClick={onEditProfile}>
          ویرایش پروفایل
        </Button>
        <Button variant="ghost" size="sm" onClick={onChangePassword}>
          {hasPassword ? "تغییر رمز عبور" : "تعیین رمز عبور"}
        </Button>
      </div>
    </section>
  );
}