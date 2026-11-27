import type { ReactNode } from "react";

export interface HomeFeature {
  title: string;
  description: string;
  tone: string;
  icon: ReactNode;
}

export const HOME_FEATURES: HomeFeature[] = [
  {
    title: "توتون اصل، نه تقلبی",
    description: "هر بسته توتون با ضمانت اصالت و تازگی ارسال می‌شود",
    tone: "bg-splash-cyan/15 text-splash-cyan",
    icon: (
      <path
        d="M12 3l7 3v5c0 4.4-2.9 8.2-7 9.5-4.1-1.3-7-5.1-7-9.5V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "پیک همون روز",
    description: "ارسال ۲۴ تا ۷۲ ساعته به سراسر کشور",
    tone: "bg-splash-orange/15 text-splash-orange",
    icon: (
      <>
        <path
          d="M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="17.5" r="1.5" fill="currentColor" />
        <circle cx="17" cy="17.5" r="1.5" fill="currentColor" />
      </>
    ),
  },
  {
    title: "تازه، هر هفته",
    description: "بار تازه توتون به‌صورت هفتگی به انبار رولچی می‌رسد",
    tone: "bg-splash-lime/15 text-splash-lime",
    icon: (
      <>
        <path
          d="M12 3c3.6 2.4 6.5 5.3 6.5 9a6.5 6.5 0 1 1-13 0C5.5 8.3 8.4 5.4 12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M12 9v5.5M9.5 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "پشتیبانی رولچی",
    description: "همراهت از انتخاب توتون تا تحویل سفارش",
    tone: "bg-splash-violet/15 text-splash-violet",
    icon: (
      <path
        d="M6 12a6 6 0 0 1 12 0v5a2 2 0 0 1-2 2h-2M6 12v5a2 2 0 0 0 2 2h1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
  },
];

export const SPLASH_TONES = [
  "bg-splash-cyan/15 text-splash-cyan ring-splash-cyan/25",
  "bg-splash-yellow/15 text-splash-yellow ring-splash-yellow/25",
  "bg-brand-500/15 text-brand-300 ring-brand-400/25",
  "bg-splash-violet/15 text-splash-violet ring-splash-violet/25",
  "bg-splash-lime/15 text-splash-lime ring-splash-lime/25",
  "bg-splash-orange/15 text-splash-orange ring-splash-orange/25",
];

export const WHY_STEPS = [
  { title: "انتخاب و ثبت سفارش", text: "محصولات را به سبد اضافه کنید و آدرس را مشخص کنید." },
  { title: "بسته‌بندی و ارسال", text: "سفارش پس از پردازش، با بسته‌بندی ایمن ارسال می‌شود." },
  { title: "تحویل و پیگیری", text: "وضعیت سفارش را از حساب کاربری خود دنبال کنید." },
];