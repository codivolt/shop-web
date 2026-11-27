# Shop Web (Next.js)

Customer-facing storefront for the **Rolchi** e-commerce platform. Built with **Next.js 16 (App Router) + React + Redux Toolkit + TanStack Query + Tailwind CSS**, PWA-enabled and SEO-optimized.

---

## 1. Tech Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 18, Tailwind CSS, `lucide-react` icons |
| State | Redux Toolkit (`react-redux`) + TanStack Query (server state) |
| Forms | `react-hook-form` + `zod` (`@hookform/resolvers`) |
| HTTP | `axios` (wrapper in `src/lib/api`) |
| Toasts | `react-hot-toast` |
| PWA | `@ducanh2912/next-pwa` (manifest, service worker) |
| Drawers | `vaul` (mobile bottom sheets) |
| SEO | Metadata API, `opengraph-image`, `twitter-image`, `sitemap`, `robots`, JSON-LD |

---

## 2. Structure

```
src/
├── app/
│   ├── (shop)/            # storefront layout group
│   │   ├── page.tsx       # home
│   │   ├── products/      # list + [slug] detail
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/        # list + detail
│   │   └── account/
│   ├── (auth)/login/
│   ├── layout.tsx
│   ├── manifest.ts
│   ├── opengraph-image.tsx
│   ├── twitter-image.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                # design-system primitives (card, badge, button, modal, field, section, skeleton, empty-state, pagination, quantity-stepper, order-summary, page-layout, ImageViewer, step-indicator, modal-sheet, modal-header)
│   ├── layout/            # header (search, cart, account), footer
│   ├── home/              # splash-slider, FeaturedSlider
│   ├── product/           # product-card, product-image, product-gallery, product-purchase-panel
│   ├── cart/ · account/ · auth/
├── hooks/                 # use-auth, use-cart, use-orders, use-profile, ...
├── lib/                   # format.ts, site.ts, cn.ts, session.ts, guest-cart.ts, validation.ts, types.ts, api/
└── store/                 # Redux store + slices
```

---

## 3. Environment Variables (`.env.local`)

| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend base URL (default `http://localhost:3000`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for SEO/canonical) |

---

## 4. Scripts

```bash
pnpm install
pnpm run dev      # next dev (port 3001)
pnpm run build    # next build
pnpm run start    # next start
pnpm run lint     # eslint
```

---

## 5. Key Features

- **Home**: splash slider, featured products, categories, brands.
- **Products**: listing with filters/search/pagination; detail page with gallery (main image included), purchase panel, related products.
- **Cart**: guest cart (localStorage) + server cart merge; quantity stepper; order summary.
- **Checkout**: address form, delivery method, payment method, receipt upload for card-to-card/sheba/crypto, order summary.
- **Orders**: list + detail view with receipt workflow (upload, history, rejection reason fallback).
- **Account**: profile, addresses, order history.
- **Auth**: login (phone + password; login = registration on backend).
- **SEO/perf**: rich metadata, multiple OG images, JSON-LD, `revalidate`, image optimization (avif/webp, `minimumCacheTTL`), `poweredByHeader:false`, `compress:true`.
- **PWA**: manifest + service worker (precache).

---

## 6. Shared Utilities

- `lib/format.ts`: `formatPrice`, `formatNumber`, `formatDate`, `formatDateTime`, `normalizeImage`, `absoluteImage`, `ORDER_STATUS_META`, `PAYMENT_STATUS_META`, `cartTotal`.
- `lib/site.ts`: site metadata (name, description, URLs).
- `lib/api/`: axios client + `apiErrorMessage`.
- `components/ui`: reusable primitives (see structure) — prefer these over inline markup to avoid duplication.

---

## 7. Conventions

- Use `components/ui` primitives and `lib/format` helpers everywhere; do not re-implement formatting or buttons.
- Server components fetch via `lib/api/catalog`; client components use TanStack Query hooks.
- Keep pages thin; extract repeated blocks into `components`.