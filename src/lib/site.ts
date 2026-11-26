export const SITE = {
  name: "رولچی",
  shortName: "رولچی",
  tagline: "رول کن، مال خودت باش",
  description:
    "رولچی؛ توتون و سیگار خیابونی از دل شهر. توتون دست‌چین، کاغذ و فیلتر رول، لوازم رول‌کردن و ارسال سریع به سراسر ایران.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
  locale: "fa_IR",
  phone: "۰۲۱-۹۱۰۰۰۰۰۰",
  email: "support@rollchi.example",
  address: "تهران، خیابان ولیعصر، پلاک ۱۲۰",
} as const;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const SERVER_API_URL = process.env.API_URL ?? API_URL;

export const SHIPPING_THRESHOLD = 2_000_000;
export const SHIPPING_COST = 65_000;
