"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { useSetPassword } from "@/hooks/use-profile";
import { apiErrorMessage } from "@/lib/api/client";
import {
  createPasswordSchema,
  type PasswordFormValues,
} from "@/lib/validation";

export function PasswordForm({
  hasPassword,
  onDone,
}: {
  hasPassword: boolean;
  onDone?: () => void;
}) {
  const setPassword = useSetPassword();
  const schema = createPasswordSchema(hasPassword);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await setPassword.mutateAsync({
        currentPassword: hasPassword ? values.currentPassword : undefined,
        newPassword: values.newPassword,
      });
      toast.success(
        hasPassword ? "رمز عبور تغییر کرد" : "رمز عبور برای حساب شما تعیین شد",
      );
      reset();
      onDone?.();
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {hasPassword ? (
        <Input
          id="current-password"
          label="رمز عبور فعلی"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          required
          error={errors.currentPassword?.message}
          {...register("currentPassword")}
        />
      ) : (
        <div className="rounded-xl bg-brand-50 px-4 py-3 text-[11px] leading-6 text-brand-900">
          هنوز رمزی برای حساب شما تعیین نشده است. با تعیین رمز، می‌توانید علاوه بر
          کد تایید، با شماره موبایل و رمز عبور هم وارد شوید.
        </div>
      )}

      <Input
        id="new-password"
        label="رمز عبور جدید"
        type="password"
        dir="ltr"
        autoComplete="new-password"
        required
        error={errors.newPassword?.message}
        {...register("newPassword")}
      />
      <Input
        id="confirm-password"
        label="تکرار رمز عبور جدید"
        type="password"
        dir="ltr"
        autoComplete="new-password"
        required
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" loading={isSubmitting || setPassword.isPending}>
          {hasPassword ? "تغییر رمز عبور" : "تعیین رمز عبور"}
        </Button>
        {onDone ? (
          <Button type="button" variant="ghost" onClick={onDone}>
            انصراف
          </Button>
        ) : null}
      </div>
    </form>
  );
}
