import { z } from "zod";

export const phoneRegex = /^(\+98|0)?9\d{9}$/;

export const otpPhoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "شماره موبایل را وارد کنید")
    .regex(phoneRegex, "شماره موبایل معتبر نیست"),
});

export type OtpPhoneValues = z.infer<typeof otpPhoneSchema>;

export const otpVerifySchema = z.object({
  code: z
    .string()
    .trim()
    .min(4, "کد تایید ۶ رقمی است")
    .max(6, "کد تایید ۶ رقمی است")
    .regex(/^\d+$/, "کد تایید باید عدد باشد"),
});

export type OtpVerifyValues = z.infer<typeof otpVerifySchema>;

export const passwordLoginSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "شماره موبایل معتبر نیست"),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر است"),
});

export type PasswordLoginValues = z.infer<typeof passwordLoginSchema>;

export const addressSchema = z.object({
  title: z.string().trim().max(100, "عنوان حداکثر ۱۰۰ کاراکتر").optional(),
  recipientName: z
    .string()
    .trim()
    .min(3, "نام گیرنده را وارد کنید")
    .max(200, "نام گیرنده طولانی است"),
  phone: z
    .string()
    .trim()
    .min(1, "شماره تماس را وارد کنید")
    .regex(phoneRegex, "شماره تماس معتبر نیست"),
  province: z.string().trim().min(1, "استان را وارد کنید"),
  city: z.string().trim().min(1, "شهر را وارد کنید"),
  addressLine: z
    .string()
    .trim()
    .min(10, "آدرس کامل را وارد کنید (حداقل ۱۰ کاراکتر)"),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد")
    .optional()
    .or(z.literal("")),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export const toEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632));

export const referralCodeSchema = z
  .string()
  .trim()
  .min(1, "کد رفرال را وارد کنید")
  .max(20, "کد رفرال حداکثر ۲۰ کاراکتر است")
  .regex(/^[A-Z0-9]+$/, "کد رفرال باید فقط شامل حروف بزرگ و عدد باشد");

export type ReferralCodeValues = z.infer<typeof referralCodeSchema>;

export function isValidNationalId(value: string): boolean {
  if (!/^\d{10}$/.test(value) || /^(\d)\1{9}$/.test(value)) {
    return false;
  }

  const check = Number(value[9]);
  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += Number(value[i]) * (10 - i);
  }
  const remainder = sum % 11;

  return check === (remainder < 2 ? remainder : 11 - remainder);
}

const optionalDigits = (pattern: RegExp, message: string) =>
  z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || pattern.test(toEnglishDigits(value)), message);

export const profileSchema = z
  .object({
    firstName: z.string().trim().max(100, "نام حداکثر ۱۰۰ کاراکتر").optional(),
    lastName: z
      .string()
      .trim()
      .max(100, "نام خانوادگی حداکثر ۱۰۰ کاراکتر")
      .optional(),
    phone: optionalDigits(
      /^09\d{9}$/,
      "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد",
    ),
    nationalId: optionalDigits(/^\d{10}$/, "کد ملی باید ۱۰ رقم باشد"),
  })
  .superRefine((values, ctx) => {
    if (
      values.nationalId &&
      !isValidNationalId(toEnglishDigits(values.nationalId))
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["nationalId"],
        message: "کد ملی وارد شده معتبر نیست",
      });
    }
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function createPasswordSchema(hasPassword: boolean) {
  return z
    .object({
      currentPassword: z.string().optional(),
      newPassword: z
        .string()
        .min(6, "رمز عبور جدید باید حداقل ۶ کاراکتر باشد")
        .max(72, "رمز عبور جدید طولانی است"),
      confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید"),
    })
    .superRefine((values, ctx) => {
      if (hasPassword && !values.currentPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["currentPassword"],
          message: "رمز عبور فعلی را وارد کنید",
        });
      }

      if (values.newPassword !== values.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "تکرار رمز عبور مطابقت ندارد",
        });
      }
    });
}

export type PasswordFormValues = z.infer<
  ReturnType<typeof createPasswordSchema>
>;
