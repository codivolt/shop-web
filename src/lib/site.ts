export const SITE = {
  name: "رولچی",
  shortName: "رولچی",
  tagline: "رولچی، سیگار خودتو رول کن",
  description:
    "رولچی؛ فروشگاه آنلاین سیگار و توتون خیابونی و تمام لوازم جانبی سیگار. خرید توتون اصل، توتون پیپر، کاغذ رول، فیلتر سیگار، رولر و همه قطعات سیگار با ضمانت اصالت و ارسال سریع به سراسر ایران.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001",
  locale: "fa_IR",
  phone: "09013247898",
  email: "support@rollchi.example",
  address: "از دل خیابون های تهران",
  keywords: [
    "رولچی",
    "سیگار",
    "توتون",
    "توتون پیپر",
    "سیگار خیابونی",
    "توتون رول",
    "کاغذ رول",
    "کاغذ سیگار",
    "فیلتر سیگار",
    "فیلتر",
    "رولر سیگار",
    "لوازم رول کردن",
    "لوازم جانبی سیگار",
    "قطعات سیگار",
    "خرید آنلاین توتون",
    "خرید سیگار",
  ],
} as const;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const SERVER_API_URL = process.env.API_URL ?? API_URL;

export const SHIPPING_THRESHOLD = 2_000_000;
export const SHIPPING_COST = 65_000;
