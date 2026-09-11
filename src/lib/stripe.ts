import Stripe from 'stripe';

/**
 * Lazily-initialized Stripe singleton.
 * Throws at call time (not import time) so the build doesn't fail when
 * STRIPE_SECRET_KEY is absent from the build environment.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY environment variable is required');
  }
  _stripe = new Stripe(key, { typescript: true });
  return _stripe;
}

/**
 * For convenience, export a proxy object that lazily calls getStripe().
 * Use this as a drop-in replacement for `stripe.checkout.sessions.create(...)`.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// ---------------------------------------------------------------------------
// Price ID map
// ---------------------------------------------------------------------------
export const STRIPE_PRICE_IDS: Record<string, string> = {
  'museum-canvas-8x12':  process.env.STRIPE_PRICE_CANVAS_8X12  ?? '',
  'museum-canvas-12x16': process.env.STRIPE_PRICE_CANVAS_12X16 ?? '',
  'museum-canvas-16x20': process.env.STRIPE_PRICE_CANVAS_16X20 ?? '',
  'museum-canvas-16x24': process.env.STRIPE_PRICE_CANVAS_16X24 ?? '',
  'framed-print-8x12':   process.env.STRIPE_PRICE_PRINT_8X12   ?? '',
  'framed-print-12x16':  process.env.STRIPE_PRICE_PRINT_12X16  ?? '',
  'framed-print-16x20':  process.env.STRIPE_PRICE_PRINT_16X20  ?? '',
  'framed-print-16x24':  process.env.STRIPE_PRICE_PRINT_16X24  ?? '',
  // Backward compatibility
  'museum-canvas-8x10':  process.env.STRIPE_PRICE_CANVAS_8X10  ?? '',
  'museum-canvas-18x24': process.env.STRIPE_PRICE_CANVAS_18X24 ?? '',
  'museum-canvas-24x36': process.env.STRIPE_PRICE_CANVAS_24X36 ?? '',
  'framed-print-8x10':   process.env.STRIPE_PRICE_PRINT_8X10   ?? '',
  'framed-print-18x24':  process.env.STRIPE_PRICE_PRINT_18X24  ?? '',
  'framed-print-24x36':  process.env.STRIPE_PRICE_PRINT_24X36  ?? '',
  'comfort-tshirt':      process.env.STRIPE_PRICE_TSHIRT        ?? '',
};

export function getVariantKey(productType: string, size: string): string {
  return `${productType}-${size}`;
}
