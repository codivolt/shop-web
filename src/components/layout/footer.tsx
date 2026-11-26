import Image from "next/image";
import Link from "next/link";

import { SITE } from "@/lib/site";

async function CopyrightYear() {
  return new Date().toLocaleDateString("fa-IR", { year: "numeric" });
}

const shopLinks = [
  { href: "/products", label: "همه محصولات رولچی" },
  { href: "/categories", label: "دسته‌بندی‌ها" },
  { href: "/cart", label: "سبد خرید" },
];

const accountLinks = [
  { href: "/account", label: "حساب کاربری" },
  { href: "/orders", label: "سفارش‌های من" },
  { href: "/login", label: "ورود / ثبت‌نام" },
];

const seals = [
  { label: "توتون تازه", color: "border-splash-cyan/30 text-splash-cyan" },
  { label: "توتون اصل", color: "border-splash-lime/30 text-splash-lime" },
  { label: "ارسال سریع", color: "border-brand-400/30 text-brand-300" },
];

export function Footer() {
  return (
    <footer className="mt-20 bg-ink-900 text-stone-500">
      <div className="splash-rule opacity-80" />
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
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
                <p className="font-display text-xl text-white">{SITE.name}</p>
                <p className="text-xs text-brand-300">{SITE.tagline}</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-stone-500">
              {SITE.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              {seals.map((seal) => (
                <span
                  key={seal.label}
                  className={`rounded-lg border bg-white/5 px-3 py-1.5 ${seal.color}`}
                >
                  {seal.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-base text-white">فروشگاه رولچی</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-brand-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base text-white">حساب من</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-brand-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="font-display mt-8 text-base text-white">تماس با ما</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li dir="ltr" className="text-right">{SITE.phone}</li>
              <li>{SITE.email}</li>
              <li>{SITE.address}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-[11px] text-stone-500 sm:flex-row">
          <p>
            © <CopyrightYear /> {SITE.name} — تمامی حقوق محفوظ است.
          </p>
          <p className="tracking-[0.2em] text-stone-400">ROLL YOUR OWN</p>
        </div>
      </div>
    </footer>
  );
}
