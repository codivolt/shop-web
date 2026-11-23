# Web - فروشگاه آنلاین سیگار (Next.js 16)

## 📋 نمای کلی

پروژه **Web** یک فروشگاه آنلاین مدرن برای فروش سیگار و لوازم جانبی است که با **Next.js 16** (App Router) و **React 19** توسعه داده شده است. این پروژه شامل احراز هویت، سبد خرید، سفارش، پرداخت و پنل کاربری می‌باشد.

---

## 🛠 تکنولوژی‌های اصلی

| تکنولوژی | نسخه | کاربرد |
|------------|-------|--------|
| Next.js | 16.4.6 | فریم‌ورک React (App Router، Turbopack) |
| React | 19.3.0 | کتابخانه UI |
| TypeScript | 5.x | تایپ‌सेفتی |
| Tailwind CSS | 4.3.3 | استایل‌دهی (v4 با Turbopack) |
| Redux Toolkit | 2.14+ | مدیریت Zustand (auth، cart) |
| TanStack Query | 5.108+ | سرور استیت و کشینگ API |
| Axios | 1.21+ | HTTP Client |
| React Hook Form | 7.92+ | مدیریت فرم‌ها |
| Zod | 4.6+ | اعتبارسنجی اسکیم‌ها |
| @ducanh2912/next-pwa | 10.2.9 | PWA / Service Worker |

---

## 📁 ساختار پروژه

```
web/
├── public/                      # استاتیک‌ها (manifest، icons، favicon)
│   ├── manifest.json            # PWA Manifest (RTL، فارسی)
│   ├── pwa-192x192.png          # آیکون PWA 192px
│   └── pwa-512x512.png          # آیکون PWA 512px
├── src/
│   ├── app/                     # App Router (Next.js 13+)
│   │   ├── (auth)/              # Route Group: احراز هویت
│   │   │   └── login/
│   │   ├── (shop)/              # Route Group: فروشگاه
│   │   │   ├── page.tsx         # 홈 صفحه اصلی
│   │   │   ├── categories/      # دسته‌بندی‌ها
│   │   │   ├── products/        # محصولات (Dynamic Route: [slug])
│   │   │   ├── cart/            # سبد خرید
│   │   │   ├── checkout/        # تسویه حساب
│   │   │   ├── account/         # پنل کاربری
│   │   │   └── orders/          # سفارشات
│   │   ├── layout.tsx           # Layout ریشه (PWA metadata، providers، font)
│   │   ├── globals.css          # استایل‌های گلوبال (Tailwind v4)
│   │   ├── providers.tsx        # Context Providers (Redux، Query، Toast)
│   │   ├── robots.ts            # robots.txt generación
│   │   └── sitemap.ts           # sitemap.xml generation
│   ├── components/
│   │   ├── ui/                  # کامپوننت‌های پایه UI (Button، Card، Modal، ...)
│   │   ├── layout/              # Header، Footer، PageLayout
│   │   ├── product/             # ProductCard، Gallery، PurchasePanel
│   │   ├── auth/                # RequireAuth (محافظت مسیرها)
│   │   └── account/             # فرم‌های پروفایل، آدرس، رمز عبور
│   ├── hooks/                   # Custom React Hooks
│   │   ├── use-auth.ts          # احراز هویت (login، register، logout)
│   │   ├── use-cart.ts          # سبد خرید (add، remove، update)
│   │   ├── use-orders.ts        # سفارشات
│   │   ├── use-profile.ts       # پروفایل کاربر
│   │   ├── use-addresses.ts     # آدرس‌ها
│   │   └── use-delivery.ts      # روش‌های ارسال
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts        # Axios instance (Client-side)
│   │   │   ├── server.ts        # Axios instance (Server-side)
│   │   │   └── catalog.ts       # توابع API کاتالوگ (محصولات، برندها، دسته‌بندی)
│   │   ├── site.ts              # تنظیمات سایت (نام، URL، locale)
│   │   ├── session.ts           # مدیریت Session (Cookie)
│   │   ├── guest-cart.ts        # سبد خرید مهمان (localStorage)
│   │   ├── cn.ts                # utility: clsx + tailwind-merge
│   │   └── validation.ts        # اسکیم‌های Zod
│   ├── store/
│   │   ├── index.ts             # Redux Store config
│   │   ├── auth-slice.ts        # Auth state (user، token، permissions)
│   │   └── hooks.ts             # Typed hooks (useAppDispatch، useAppSelector)
│   └── types/                   # TypeScript Types
├── next.config.ts               # Next.js Config + PWA wrapper
├── tsconfig.json                # TypeScript Config
├── package.json
└── next-pwa.d.ts                # Type declaration for next-pwa
```

---

## 🔐 احراز هویت (Authentication)

### Flow
1. **Login/Register**: ارسال شماره موبایل → دریافت OTP → تأیید کد
2. **JWT Token**: در HttpOnly Cookie ذخیره می‌شود (secure، sameSite)
3. **Redux Persist**: state کاربر در Redux نگهداری می‌شود
4. **Middleware/Guard**: `RequireAuth` کامپوننت برای محافظت از مسیرهای خصوصی

### فایل‌های کلیدی
- `src/hooks/use-auth.ts` - توابع login، register، logout، refresh
- `src/store/auth-slice.ts` - State مدیریت کاربر و توکن
- `src/components/auth/require-auth.tsx` - HOC محافظت مسیر
- `src/lib/session.ts` - مدیریت Cookie سمت سرور/کلاینت

---

## 🛒 سبد خرید (Cart)

### دو حالت:
1. **مهمان (Guest)**: localStorage با کلید `guest_cart`
2. **کاربر لاگین‌شده**: API Backend + Redux Sync

### فایل‌های کلیدی
- `src/hooks/use-cart.ts` - Hook اصلی سبد خرید
- `src/lib/guest-cart.ts` - توابع مدیریت localStorage
- `src/components/ui/quantity-stepper.tsx` - کنترل تعداد
- `src/components/product/add-to-cart-button.tsx` - دکمه افزودن

---

## 📦 محصولات و کاتالوگ

### صفحات
- `/` - صفحه اصلی (Hero، دسته‌بندی‌ها، محصولات پیشنهادی)
- `/categories` - لیست دسته‌بندی‌ها
- `/products` - لیست محصولات با فیلتر/جستجو
- `/products/[slug]` - جزئیات محصول (Dynamic Route)

### API Functions (`src/lib/api/catalog.ts`)
- `getCategories()` - دریافت دسته‌بندی‌ها
- `getProducts(filters?)` - لیست محصولات با صفحه‌بندی
- `getProduct(slug)` - جزئیات محصول
- `getBrands()` - برندها
- `searchProducts(query)` - جستجو

---

## 🎨 استایل‌دهی (Tailwind CSS v4)

### ویژگی‌ها
- **Turbopack** برای dev/build سریع
- **RTL Support** با `dir="rtl"` در html
- **Font**: Vazirmatn (Google Fonts، subset arabic/latin)
- **Color Palette**: Stone/Amber ( سفارشی در globals.css)

### فایل‌های استایل
- `src/app/globals.css` - Import Tailwind، متغیرهای CSS، استایل‌های پایه
- `tailwind.config.js` - عدم وجود (v4 از CSS-first استفاده می‌کند)

---

## 📱 PWA (Progressive Web App)

### تنظیمات
- **Plugin**: `@ducanh2912/next-pwa` (Workbox-powered)
- **Manifest**: `public/manifest.json` (نام فارسی، RTL، icons)
- **Service Worker**: `sw.js` + `workbox-*.js` در build تولید می‌شود
- **Caching Strategy**: NetworkFirst برای API، CacheFirst برای استاتیک‌ها
- **Offline Support**: Runtime caching برای درخواست‌های شبکه

### فایل‌ها
- `next.config.ts` - Config PWA با `workboxOptions.runtimeCaching`
- `public/manifest.json` - Metadata نصب
- `public/pwa-192x192.png`، `pwa-512x512.png` - آیکون‌ها
- `src/app/layout.tsx` - `manifest`، `apple` icon، `themeColor` در metadata

---

## 🚀 اسکریپت‌ها

```bash
# Development (Turbopack)
pnpm dev

# Production Build
pnpm build

# Start Production Server
pnpm start

# Lint
pnpm lint
```

---

## ⚙️ متغیرهای محیطی (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📝 نکات توسعه

### App Router Patterns
- **Route Groups**: `(auth)`، `(shop)` برای Layout جداگانه
- **Dynamic Routes**: `[slug]` برای جزئیات محصول
- **Parallel Routes**: در صورت نیاز (مثلاً loading states)
- **Server Components**: پیش‌فرض، Client Component با `'use client'`

### Data Fetching
- **Server Components**: مستقیم در کامپوننت (async/await)
- **Client Components**: TanStack Query (`useQuery`، `useMutation`)
- **Axios Instances**: جدا برای Client/Server (Cookie handling)

### Type Safety
- Strict TypeScript (`strict: true`)
- Path aliases: `@/*` → `./src/*`
- Zod برای runtime validation

---

## 🔗 Backend Integration

Backend در پوشه `../back` (NestJS) قرار دارد:
- **Base URL**: `NEXT_PUBLIC_API_URL`
- **Endpoints**: `/auth`، `/products`، `/categories`، `/orders`، `/cart`، `/users`
- **Auth**: JWT در HttpOnly Cookie
- **Swagger**: در `/api/docs` (backend)

---

## 📦 Deploy

### Standalone Output
```bash
# next.config.ts: output: "standalone"
pnpm build
# خروجی در .next/standalone/
```

### Docker
```dockerfile
# Multi-stage build با standalone output
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📚 منابع و مستندات

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [@ducanh2912/next-pwa](https://ducanh-next-pwa.vercel.app/)
- [Zod](https://zod.dev/)