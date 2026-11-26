"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { useAuthActions, useAuthState } from "@/hooks/use-auth";
import {
  usePasswordLogin,
  useSendCode,
  useVerifyCode,
} from "@/hooks/use-auth-mutations";
import { useApplyReferral } from "@/hooks/use-profile";
import { apiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import {
  otpPhoneSchema,
  otpVerifySchema,
  passwordLoginSchema,
  type OtpPhoneValues,
  type OtpVerifyValues,
  type PasswordLoginValues,
} from "@/lib/validation";

const BENEFITS = [
  "پیگیری آنلاین سفارش‌های رولچی",
  "سبد خرید و توتون‌های محبوبت همیشه در دسترس",
  "ثبت سریع آدرس و خرید مجدد",
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, hydrated } = useAuthState();
  const { login } = useAuthActions();
  const sendCode = useSendCode();
  const verifyCode = useVerifyCode();
  const passwordLogin = usePasswordLogin();

  const [tab, setTab] = useState<"otp" | "password">("otp");
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [referralCode, setReferralCode] = useState("");

  const applyReferral = useApplyReferral();

  const nextParam = searchParams.get("next");
  const nextPath = nextParam && nextParam.startsWith("/") ? nextParam : "/";

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [hydrated, isAuthenticated, nextPath, router]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  const phoneForm = useForm<OtpPhoneValues>({
    resolver: zodResolver(otpPhoneSchema),
    defaultValues: { phone: "" },
  });

  const verifyForm = useForm<OtpVerifyValues>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: { code: "" },
  });

  const passwordForm = useForm<PasswordLoginValues>({
    resolver: zodResolver(passwordLoginSchema),
    defaultValues: { phone: "", password: "" },
  });

  const requestCode = async (value: string) => {
    try {
      await sendCode.mutateAsync({ phone: value });
      setPhone(value);
      setStep(2);
      setSeconds(60);
      toast.success("کد تایید ارسال شد");
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  };

  const onPhoneSubmit = phoneForm.handleSubmit(async (values) => {
    await requestCode(values.phone);
  });

  const onVerifySubmit = verifyForm.handleSubmit(async (values) => {
    try {
      const auth = await verifyCode.mutateAsync({ phone, code: values.code });
      await login(auth);
      if (referralCode.trim()) {
        try {
          await applyReferral.mutateAsync(referralCode.trim().toUpperCase());
          toast.success("کد رفرال اعمال شد");
        } catch (refError) {
          toast.error(apiErrorMessage(refError));
        }
      }
      toast.success("خوش آمدید");
      router.replace(nextPath);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  });

  const onPasswordSubmit = passwordForm.handleSubmit(async (values) => {
    try {
      const auth = await passwordLogin.mutateAsync(values);
      await login(auth);
      if (referralCode.trim()) {
        try {
          await applyReferral.mutateAsync(referralCode.trim().toUpperCase());
          toast.success("کد رفرال اعمال شد");
        } catch (refError) {
          toast.error(apiErrorMessage(refError));
        }
      }
      toast.success("خوش آمدید");
      router.replace(nextPath);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-2xl shadow-stone-900/10 lg:grid-cols-[1fr_1.05fr]">
        <aside className="relative hidden overflow-hidden bg-ink-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="hero-grid absolute inset-0 opacity-40" />
          <div className="splash-field absolute inset-0" />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-600/25 blur-3xl" />
          <div className="absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-splash-cyan/15 blur-3xl" />

          <div className="relative">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15">
                <Image
                  src="/rollchi-logo.webp"
                  alt="لوگوی رولچی"
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </span>
              <div>
                <p className="font-display text-lg">{SITE.name}</p>
                <p className="text-[11px] text-stone-400">{SITE.tagline}</p>
              </div>
            </Link>

            <h1 className="font-display mt-14 text-4xl leading-[1.5]">
              خوش برگشتی،
              <br />
              <span className="text-splash">رولت رو ادامه بده</span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-stone-400">
              با شماره موبایل নিজت وارد شو؛ بدون رمز عبور، در چند ثانیه. سفارش‌ها،
              آدرس‌ها و سبد خریدت همیشه همراه رولچی هستند.
            </p>

            <ul className="mt-9 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-sm text-stone-500">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600/20 text-brand-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="m5 13 4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative mt-10 text-[11px] text-stone-500">
            © {SITE.name} — تمامی حقوق محفوظ است.
          </p>
        </aside>

        <div className="p-6 sm:p-10">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15">
                <Image
                  src="/rollchi-logo.webp"
                  alt="لوگوی رولچی"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-display text-lg text-white">{SITE.name}</span>
            </Link>
            <Link href="/" className="text-xs font-semibold text-stone-500">
              بازگشت به فروشگاه
            </Link>
          </div>

          <div className="hidden lg:block">
            <h2 className="font-display text-2xl text-white">ورود به رولچی</h2>
            <p className="mt-2 text-xs leading-6 text-stone-500">
              شماره موبایل خود را وارد کنید؛ اگر حساب نداشته باشید، به‌صورت خودکار
              ساخته می‌شود.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setTab("otp")}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-bold transition",
                tab === "otp"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700",
              )}
            >
              ورود با کد تایید
            </button>
            <button
              type="button"
              onClick={() => setTab("password")}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-bold transition",
                tab === "password"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700",
              )}
            >
              ورود با رمز عبور
            </button>
          </div>

          {tab === "otp" ? (
            step === 1 ? (
              <form onSubmit={onPhoneSubmit} className="mt-6 space-y-4">
                <Input
                  id="phone"
                  label="شماره موبایل"
                  placeholder="09123456789"
                  inputMode="tel"
                  dir="ltr"
                  autoComplete="tel"
                  required
                  error={phoneForm.formState.errors.phone?.message}
                  {...phoneForm.register("phone")}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={sendCode.isPending}
                >
                  دریافت کد تایید
                </Button>
                <p className="text-center text-[11px] leading-5 text-stone-400">
                  با ورود، قوانین و شرایط استفاده از فروشگاه را می‌پذیرید.
                </p>
              </form>
            ) : (
              <form onSubmit={onVerifySubmit} className="mt-6 space-y-4">
                <div className="rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone-600">
                  کد تایید به شماره{" "}
                  <span dir="ltr" className="font-bold text-stone-800">
                    {phone}
                  </span>{" "}
                  ارسال شد.
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setSeconds(0);
                      verifyForm.reset();
                    }}
                    className="ms-2 font-semibold text-brand-700 hover:underline"
                  >
                    تغییر شماره
                  </button>
                </div>

                <Input
                  id="code"
                  label="کد تایید ۶ رقمی"
                  placeholder="------"
                  inputMode="numeric"
                  dir="ltr"
                  maxLength={6}
                  autoComplete="one-time-code"
                  className="text-center text-lg font-black tracking-[0.5em]"
                  required
                  error={verifyForm.formState.errors.code?.message}
                  {...verifyForm.register("code")}
                />

                <Input
                  id="referral-code-login"
                  label="کد رفرال معرف (اختیاری)"
                  placeholder="REF12345"
                  dir="ltr"
                  value={referralCode.toUpperCase()}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="uppercase"
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={verifyCode.isPending}
                >
                  ورود به حساب
                </Button>

                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span>کد را دریافت نکردید؟</span>
                  <button
                    type="button"
                    disabled={seconds > 0 || sendCode.isPending}
                    onClick={() => void requestCode(phone)}
                    className="font-semibold text-brand-700 hover:underline disabled:text-stone-400 disabled:no-underline"
                  >
                    {seconds > 0
                      ? `ارسال مجدد تا ${seconds.toLocaleString("fa-IR")} ثانیه`
                      : "ارسال مجدد کد"}
                  </button>
                </div>

                <p className="text-center text-[11px] leading-5 text-stone-400">
                  اگر در محیط توسعه هستید، کد تایید در لاگ سرور چاپ می‌شود.
                </p>
              </form>
            )
          ) : (
            <form onSubmit={onPasswordSubmit} className="mt-6 space-y-4">
              <Input
                id="password-phone"
                label="شماره موبایل"
                placeholder="09123456789"
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                required
                error={passwordForm.formState.errors.phone?.message}
                {...passwordForm.register("phone")}
              />
              <Input
                id="password"
                label="رمز عبور"
                type="password"
                placeholder="••••••"
                dir="ltr"
                autoComplete="current-password"
                required
                error={passwordForm.formState.errors.password?.message}
                {...passwordForm.register("password")}
              />
              <Input
                id="referral-code-password"
                label="کد رفرال معرف (اختیاری)"
                placeholder="REF12345"
                dir="ltr"
                value={referralCode.toUpperCase()}
                onChange={(e) => setReferralCode(e.target.value)}
                className="uppercase"
              />
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={passwordLogin.isPending}
              >
                ورود به حساب
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
