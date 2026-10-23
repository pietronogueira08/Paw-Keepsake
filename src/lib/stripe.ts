import Stripe from 'stripe';

/**
 * Lazily-initialized Stripe singleton.
 * Throws at call time (not import time) so Next.js static builds do not fail
 * when STRIPE_SECRET_KEY is absent during build time.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      '[Stripe] STRIPE_SECRET_KEY is required in environment variables (.env.local or hosting provider).'
    );
  }

  _stripe = new Stripe(key, {
    typescript: true,
  });

  return _stripe;
}

/**
 * Helper to get Stripe client for a given session.
 */
export function getStripeForSession(_sessionId: string): Stripe {
  return getStripe();
}

/**
 * Convenient proxy object that lazily delegates calls to getStripe().
 * Can be imported directly: `import { stripe } from '@/lib/stripe';`
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
