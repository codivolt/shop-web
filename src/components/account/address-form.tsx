"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { useCreateAddress } from "@/hooks/use-addresses";
import { apiErrorMessage } from "@/lib/api/client";
import { addressSchema, type AddressFormValues } from "@/lib/validation";
import type { Address } from "@/lib/types";

export function AddressForm({
  onCreated,
  onCancel,
}: {
  onCreated?: (address: Address) => void;
  onCancel?: () => void;
}) {
  const createAddress = useCreateAddress();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: "",
      recipientName: "",
      phone: "",
      province: "",
      city: "",
      addressLine: "",
      postalCode: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const address = await createAddress.mutateAsync({
        title: values.title || undefined,
        recipientName: values.recipientName,
        phone: values.phone,
        province: values.province,
        city: values.city,
        addressLine: values.addressLine,
        postalCode: values.postalCode || undefined,
      });
      toast.success("آدرس با موفقیت ثبت شد");
      reset();
      onCreated?.(address);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="address-title"
          label="عنوان آدرس"
          placeholder="مثلاً خانه یا محل کار"
          error={errors.title?.message}
          {...register("title")}
        />
        <Input
          id="address-recipient"
          label="نام گیرنده"
          placeholder="نام و نام خانوادگی"
          required
          error={errors.recipientName?.message}
          {...register("recipientName")}
        />
        <Input
          id="address-phone"
          label="شماره تماس"
          placeholder="09xxxxxxxxx"
          inputMode="tel"
          dir="ltr"
          required
          error={errors.phone?.message}
          {...register("phone")}
        />
        <Input
          id="address-postal"
          label="کد پستی"
          placeholder="۱۰ رقم"
          inputMode="numeric"
          dir="ltr"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
        <Input
          id="address-province"
          label="استان"
          placeholder="مثلاً تهران"
          required
          error={errors.province?.message}
          {...register("province")}
        />
        <Input
          id="address-city"
          label="شهر"
          placeholder="مثلاً تهران"
          required
          error={errors.city?.message}
          {...register("city")}
        />
      </div>

      <Input
        id="address-line"
        label="آدرس کامل"
        placeholder="خیابان، کوچه، پلاک و واحد"
        required
        error={errors.addressLine?.message}
        {...register("addressLine")}
      />

      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" loading={isSubmitting || createAddress.isPending}>
          ثبت آدرس
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            انصراف
          </Button>
        ) : null}
      </div>
    </form>
  );
}
