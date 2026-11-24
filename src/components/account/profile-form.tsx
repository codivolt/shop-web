import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { useAuthState, displayName } from "@/hooks/use-auth";
import { useUpdateProfile, useUploadAvatar } from "@/hooks/use-profile";
import { apiErrorMessage } from "@/lib/api/client";
import { absoluteImage } from "@/lib/format";
import { profileSchema, type ProfileFormValues } from "@/lib/validation";
import { Copy, Check } from "lucide-react";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

export function ProfileForm({ onDone }: { onDone?: () => void }) {
  const { user } = useAuthState();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarSrc = absoluteImage(user?.avatarUrl);
  const [copied, setCopied] = useState(false);

  const handleCopyReferralCode = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("کد رفرال کپی شد");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  const handleAvatarChange = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل تصویری مجاز است");
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("حجم تصویر باید کمتر از ۲ مگابایت باشد");
      return;
    }

    uploadAvatar.mutate(file, {
      onSuccess: () => toast.success("عکس پروفایل به‌روزرسانی شد"),
      onError: (error) => toast.error(apiErrorMessage(error)),
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await updateProfile.mutateAsync({
        firstName: values.firstName?.trim() || undefined,
        lastName: values.lastName?.trim() || undefined,
      });
      toast.success("اطلاعات پروفایل ذخیره شد");
      onDone?.();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-brand-100">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt="عکس پروفایل"
              fill
              sizes="80px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl font-black text-brand-800">
              {displayName(user).slice(0, 1)}
            </span>
          )}
          {uploadAvatar.isPending ? (
            <span className="absolute inset-0 flex items-center justify-center bg-stone-900/50">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </span>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-bold text-stone-700">عکس پروفایل</p>
          <p className="mt-1 text-[11px] leading-5 text-stone-400">
            تصویر مربعی، JPG یا PNG، حداکثر ۲ مگابایت
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            loading={uploadAvatar.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            انتخاب عکس
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              handleAvatarChange(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>
      </div>

      {user?.referralCode && (
        <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-stone-700">کد رفرال شما</p>
              <p className="mt-1 text-[11px] leading-5 text-stone-400">
                این کد را با دوستان خود به اشتراک بگذارید تا از تخفیف‌ها بهره‌مند شوند.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-mono text-base font-medium text-stone-900 tracking-wider select-all">
                {user.referralCode}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyReferralCode}
                aria-label={copied ? "کپی شد" : "کپی کردن کد رفرال"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="profile-first-name"
            label="نام"
            placeholder="نام خود را وارد کنید"
            error={errors.firstName?.message}
            {...register("firstName")}
          />
          <Input
            id="profile-last-name"
            label="نام خانوادگی"
            placeholder="نام خانوادگی خود را وارد کنید"
            error={errors.lastName?.message}
            {...register("lastName")}
          />
        </div>

        <div className="rounded-xl bg-stone-50 px-4 py-3 text-[11px] leading-5 text-stone-500">
          شماره موبایل و ایمیل حساب قابل ویرایش نیستند؛ برای تغییر شماره با
          پشتیبانی در تماس باشید.
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Button type="submit" loading={updateProfile.isPending}>
            ذخیره تغییرات
          </Button>
          {onDone ? (
            <Button type="button" variant="ghost" onClick={onDone}>
              انصراف
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
