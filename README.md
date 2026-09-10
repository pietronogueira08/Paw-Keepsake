# Paw & Keepsake 🐾

> **Museum-grade custom dog memorial art** — personalized with your pet's breed, name & dates.  
> Built with Next.js 16, Tailwind CSS v4, Framer Motion, Stripe Checkout, and Cloudflare R2.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Animation | Framer Motion 11 |
| State | Zustand + persist |
| Forms | React Hook Form + Zod |
| Payments | Stripe Hosted Checkout (Apple Pay / Google Pay) |
| Storage | Cloudflare R2 (AWS S3-compatible) |
| Print Gen | sharp (300 DPI SVG → PNG) |
| Fonts | Fraunces (editorial serif) + Plus Jakarta Sans (body) |

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/pietronogueira08/Paw-Keepsake.git
cd "Paw-Keepsake"
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local`:

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_test_… or sk_live_…) |
| `STRIPE_WEBHOOK_SECRET` | From `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `CLOUDFLARE_R2_ACCOUNT_ID` | Cloudflare account ID |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | R2 access key |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | R2 secret key |
| `CLOUDFLARE_R2_BUCKET_NAME` | R2 bucket name |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Google Analytics 4 (G-XXXXXXXXXX) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel ID |

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Stripe webhook (local testing)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, CartSlideOver, Toaster)
│   ├── page.tsx                # Home page (JSON-LD, all sections)
│   ├── (legal)/                # Shipping, Refund, Privacy pages
│   └── api/
│       ├── checkout/           # Stripe Checkout session creation
│       ├── generate-print-file/# 300 DPI PNG generation via sharp
│       ├── save-draft/         # Email preview / draft save
│       └── webhooks/stripe/    # Stripe webhook handler
├── components/
│   ├── cart/                   # CartSlideOver, FreeShippingBar, InCartOrderBump
│   ├── checkout/               # UsAddressForm
│   ├── customizer/             # LivePreviewCanvas, BreedGridSelector, etc.
│   ├── sections/               # HeroCustomizer, CraftsmanshipStory, Reviews, etc.
│   └── ui/                     # Button, Input, Dialog, Drawer, Badge, etc.
├── lib/
│   ├── analytics.ts            # Meta Pixel + GA4 event bus
│   ├── breeds-data.ts          # 30+ breeds, memorial quotes, size variants
│   ├── r2.ts                   # Cloudflare R2 upload helpers
│   ├── stripe.ts               # Lazy Stripe singleton
│   └── utils.ts                # cn(), formatPrice(), springs, etc.
├── store/
│   ├── useCustomizerStore.ts   # 5-step customizer state (Zustand + persist)
│   └── useCartStore.ts         # Cart state with order bump
└── types/
    └── ecommerce.ts            # All TypeScript interfaces
```

## Deployment

Deploy to [Vercel](https://vercel.com) with zero config — the project is fully compatible with the Vercel platform.  
Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

## License

Private — all rights reserved. © 2026 Paw & Keepsake.
