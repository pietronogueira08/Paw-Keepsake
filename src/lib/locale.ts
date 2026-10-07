/**
 * Paw & Keepsake — Locale & Currency Utilities
 *
 * Detects whether a visitor is from the UK or US and returns
 * the correct currency, prices, and copy for their locale.
 *
 * Country detection: Vercel injects `x-vercel-ip-country` header.
 * Fallback: the `pk-locale` cookie set by proxy.ts.
 */

export type SupportedLocale = 'en-GB' | 'en-US';
export type SupportedCurrency = 'gbp' | 'usd';

export interface LocaleConfig {
  locale: SupportedLocale;
  currency: SupportedCurrency;
  currencySymbol: string;
  countryCode: 'GB' | 'US';
  /** Free shipping threshold in display currency units */
  freeShippingThreshold: number;
  /** Shipping cost if below threshold */
  shippingCost: number;
  copy: LocaleCopy;
  prices: LocalePrices;
}

export interface LocaleCopy {
  shippingLabel: string;
  freeShippingBadge: string;
  deliveryTime: string;
  madeIn: string;
  checkoutTrust: string;
  freeShippingBar: (remaining: string) => string;
  freeShippingUnlocked: string;
}

export interface LocalePrices {
  canvas: {
    '8x12': number;
    '12x16': number;
    '16x20': number;
    '16x24': number;
  };
  mug: number;
}

// ─── US Configuration ──────────────────────────────────────────────────────────

export const US_CONFIG: LocaleConfig = {
  locale: 'en-US',
  currency: 'usd',
  currencySymbol: '$',
  countryCode: 'US',
  freeShippingThreshold: 50,
  shippingCost: 9.46,
  copy: {
    shippingLabel: 'Free USA Shipping',
    freeShippingBadge: 'Free Insured Shipping on Orders $50+',
    deliveryTime: 'Arrives in 4–6 business days',
    madeIn: 'Printed & assembled in the USA',
    checkoutTrust: '🇺🇸 Printed & assembled in the USA • Arrives in 4–6 business days',
    freeShippingBar: (remaining) => `Add $${remaining} more for Free Insured Shipping`,
    freeShippingUnlocked: "You've unlocked Free Insured Shipping! 🎉",
  },
  prices: {
    canvas: {
      '8x12': 49,
      '12x16': 69,
      '16x20': 89,
      '16x24': 109,
    },
    mug: 24,
  },
};

// ─── UK Configuration ──────────────────────────────────────────────────────────

export const GB_CONFIG: LocaleConfig = {
  locale: 'en-GB',
  currency: 'gbp',
  currencySymbol: '£',
  countryCode: 'GB',
  freeShippingThreshold: 45,
  shippingCost: 7.99,
  copy: {
    shippingLabel: 'Free UK Delivery',
    freeShippingBadge: 'Free Tracked Delivery on Orders £45+',
    deliveryTime: 'Delivered in 4–7 working days',
    madeIn: 'Printed & fulfilled in the UK',
    checkoutTrust: '🇬🇧 Printed & fulfilled in the UK • Delivered in 4–7 working days',
    freeShippingBar: (remaining) => `Add £${remaining} more for Free Tracked Delivery`,
    freeShippingUnlocked: "You've unlocked Free Tracked Delivery! 🎉",
  },
  prices: {
    canvas: {
      '8x12': 44,
      '12x16': 62,
      '16x20': 79,
      '16x24': 97,
    },
    mug: 21,
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns the locale config based on the country code header set by proxy.ts.
 * Call this in Server Components via `import { headers } from 'next/headers'`.
 */
export function getLocaleConfig(countryHeader: string | null | undefined): LocaleConfig {
  return countryHeader === 'GB' ? GB_CONFIG : US_CONFIG;
}

/**
 * Format a price value in the given currency for display.
 * e.g. formatPrice(69, 'usd') → '$69'
 *      formatPrice(62, 'gbp') → '£62'
 */
export function formatPrice(amount: number, currency: SupportedCurrency): string {
  const symbol = currency === 'gbp' ? '£' : '$';
  return `${symbol}${amount}`;
}

/**
 * Get canvas price for a given size + locale config.
 */
export function getCanvasPrice(
  size: string,
  config: LocaleConfig
): number {
  const sizeKey = size as keyof LocalePrices['canvas'];
  return config.prices.canvas[sizeKey] ?? config.prices.canvas['12x16'];
}

/**
 * Convert price to smallest currency unit (cents/pence) for Stripe.
 */
export function toStripeAmount(price: number): number {
  return Math.round(price * 100);
}
