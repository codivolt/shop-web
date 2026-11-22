import Link from "next/link";

import { SITE } from "@/lib/site";

async function CopyrightYear() {
  return new Date().toLocaleDateString("fa-IR", { year: "numeric" });
}

const shopLinks = [
  { href: "/products", label: "همه محصولات" },
  { href: "/categories", label: "دسته‌بندی‌ها" },
  { href: "/cart", label: "سبد خرید" },
];

const accountLinks = [
  { href: "/account", label: "حساب کاربری" },
  { href: "/orders", label: "سفارش‌های من" },
  { href: "/login", label: "ورود / ثبت‌نام" },
];

export function Footer() {
  return (
    <footer className="mt-20 bg-stone-950 text-stone-400">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-700 text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 3c2.4 2.2 4 4.4 4 7a4 4 0 0 1-8 0c0-1.3.4-2.4 1.2-3.4C8.5 8.5 8 10.2 8 12a4 4 0 0 0 8 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 21c3.9 0 7-2.9 7-6.5 0-1.2-.3-2.3-.9-3.3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-base font-black text-white">{SITE.name}</p>
                <p className="text-xs text-stone-500">{SITE.tagline}</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-stone-400">
              {SITE.description}
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-stone-500">
              <span className="rounded-lg border border-stone-800 px-3 py-1.5">پرداخت امن</span>
              <span className="rounded-lg border border-stone-800 px-3 py-1.5">ضمانت اصالت</span>
              <span className="rounded-lg border border-stone-800 px-3 py-1.5">ارسال سریع</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">فروشگاه</h3>
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
            <h3 className="text-sm font-bold text-white">حساب من</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-brand-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="mt-8 text-sm font-bold text-white">تماس با ما</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li dir="ltr" className="text-right">{SITE.phone}</li>
              <li>{SITE.email}</li>
              <li>{SITE.address}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800/80">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-[11px] text-stone-500 sm:flex-row">
          <p>
            © <CopyrightYear /> {SITE.name} — تمامی حقوق محفوظ است.
          </p>
          <p>ساخته‌شده با Next.js و React</p>
        </div>
      </div>
    </footer>
  );
}
