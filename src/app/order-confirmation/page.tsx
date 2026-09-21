'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { trackPurchase } from '@/lib/analytics';

function OrderConfirmationContent() {
  const clearCart = useCartStore((s) => s.clearCart);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [petName, setPetName] = useState<string | null>(null);

  useEffect(() => {
    // Clear client-side cart once order is confirmed
    clearCart();

    if (!sessionId) return;

    const storageKey = `paw_purchase_tracked_${sessionId}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey)) {
      return; // Already tracked for this checkout session — prevents duplicate on refresh
    }

    // Fetch verified checkout details from the server to fire accurate Meta Pixel Purchase event
    fetch(`/api/checkout/session?id=${encodeURIComponent(sessionId)}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn('[OrderConfirmation] Stripe verification failed:', err);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data || !data.isPaid || data.paymentStatus !== 'paid') {
          console.warn('[OrderConfirmation] Order is not confirmed as paid by Stripe. Purchase event skipped.');
          return;
        }

        if (data.petName) setPetName(data.petName);

        // Dispatches standard Purchase event ONLY with confirmed Stripe amount & currency
        trackPurchase(
          {
            value: data.amountTotal,
            currency: data.currency || 'USD',
            transactionId: sessionId,
            petName: data.petName || undefined,
            content_ids: data.contentIds || ['museum-canvas'],
            content_type: 'product',
            eventID: data.eventId,
          },
          { eventID: data.eventId }
        );

        // Prevents duplicate firing on subsequent page refreshes
        sessionStorage.setItem(storageKey, 'true');
      })
      .catch((err) => {
        console.error('[OrderConfirmation] Error verifying payment with server:', err);
        // Do NOT simulate purchase if server check fails
      });
  }, [clearCart, sessionId]);

  return (
    <main className="min-h-[80vh] bg-background py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-surface rounded-2xl border border-border p-8 sm:p-12 shadow-sm text-center"
        >
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
            className="w-16 h-16 bg-trust/15 text-trust rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          <span className="text-xs font-bold tracking-widest text-accent uppercase font-jakarta block mb-2">
            Order Confirmed & In Production
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold font-fraunces text-foreground mb-4">
            {petName
              ? `Thank You for Honoring ${petName}'s Memory`
              : 'Thank You for Honoring Their Memory'}
          </h1>

          <p className="text-sm sm:text-base text-muted font-jakarta leading-relaxed max-w-lg mx-auto mb-8">
            {petName
              ? `Your custom memorial tribute for ${petName} is now queued with our artisans. Every canvas is individually printed, hand-stretched over solid wood bars, and inspected before leaving our USA workshop.`
              : 'Your custom tribute is now queued with our artisans. Every canvas is individually printed, hand-stretched over solid wood bars, and inspected before leaving our USA workshop.'}
          </p>

          {/* Fulfillment Timeline */}
          <div className="bg-background rounded-xl p-6 border border-border/80 text-left mb-8">
            <h2 className="text-xs font-bold text-foreground uppercase tracking-wider font-jakarta mb-4">
              What Happens Next
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-trust text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-jakarta">Order & Personalization Confirmed</p>
                  <p className="text-xs text-muted font-jakarta">Receipt & order details sent to your email.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 animate-pulse">
                  2
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-jakarta">High-Resolution Artisan Proofing</p>
                  <p className="text-xs text-muted font-jakarta">Prepared at 300 DPI with gallery-grade archival inks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-jakarta">Museum Framing & Secure Packaging</p>
                  <p className="text-xs text-muted font-jakarta">Crafted with 1.5&quot; solid wood depth & UV-protective shield.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-jakarta">Insured USA Delivery (4–6 Business Days)</p>
                  <p className="text-xs text-muted font-jakarta">Tracking number emailed the moment your package departs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-xs font-medium font-jakarta mb-8">
            <span>🛡️</span>
            <span>Covered by our 100% Lifetime Memory Guarantee</span>
          </div>

          <div>
            <Link
              href="/"
              prefetch={false}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold font-jakarta transition-colors shadow-sm"
            >
              Return to Homepage
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[80vh] flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </main>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
