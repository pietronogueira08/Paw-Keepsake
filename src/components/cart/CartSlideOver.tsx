'use client';

/**
 * CartSlideOver — Main cart drawer component.
 *
 * Critical conversion component that opens from the right side of the screen.
 * Contains: shipping progress bar, cart items with quantity controls,
 * order bump, trust seals, and the primary checkout CTA.
 */

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { trackInitiateCheckout } from '@/lib/analytics';
import { Drawer } from '@/components/ui/Drawer';
import { FreeShippingBar } from '@/components/cart/FreeShippingBar';
import { InCartOrderBump } from '@/components/cart/InCartOrderBump';
import type { CartItem } from '@/types/ecommerce';

// ─── Icons ────────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function PawIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <ellipse cx="12" cy="14" rx="5" ry="7" fill="#EBE6DE" />
      <ellipse cx="24" cy="10" rx="5" ry="7" fill="#EBE6DE" />
      <ellipse cx="36" cy="14" rx="5" ry="7" fill="#EBE6DE" />
      <ellipse cx="8" cy="24" rx="4" ry="6" fill="#EBE6DE" />
      <path d="M24 20C30.627 20 36 25.373 36 32C36 38.627 30.627 40 24 40C17.373 40 12 38.627 12 32C12 25.373 17.373 20 24 20Z" fill="#EBE6DE" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5L2 4v4c0 3.314 2.686 6 6 7.5C14 14 14 11.314 14 8V4L8 1.5z" stroke="#879788" strokeWidth="1.4" fill="none" />
      <path d="M5.5 8l1.75 1.75L10.5 6" stroke="#879788" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1" y="5" width="9" height="7" rx="1" stroke="#879788" strokeWidth="1.4" />
      <path d="M10 7h3l2 3v2h-5V7z" stroke="#879788" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="4" cy="13" r="1.5" fill="#879788" />
      <circle cx="12" cy="13" r="1.5" fill="#879788" />
    </svg>
  );
}

// ─── Cart Line Item Row ───────────────────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem;
}

function CartItemRow({ item }: CartItemRowProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const productLabel = item.productType
    .split('-')
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0, paddingBottom: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      className="flex items-start gap-3 py-3.5 border-b border-border last:border-0"
    >
      {/* Breed silhouette */}
      <div
        className="flex-shrink-0 h-8 w-8 rounded-md bg-surface-subtle border border-border overflow-hidden flex items-center justify-center"
        aria-label={item.breed ? `${item.breed.name} silhouette` : 'memorial item'}
      >
        {item.breed?.svgPath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.breed.svgPath}
            alt={item.breed.name}
            width={28}
            height={28}
            className="object-contain"
          />
        ) : (
          <span className="text-base select-none">🐾</span>
        )}
      </div>

      {/* Item details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground font-jakarta truncate">
          {item.petName ? `${item.petName}'s ` : ''}{item.productTitle ?? productLabel}
        </p>
        <p className="text-xs text-muted font-jakarta mt-0.5">
          {item.size}{item.breed ? ` · ${item.breed.name}` : item.color ? ` · ${item.color}` : ''}
        </p>

        {/* Quantity controls */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label={`Decrease quantity of ${item.petName}'s ${productLabel}`}
            className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted hover:border-accent hover:text-accent transition-colors"
          >
            <span className="text-sm leading-none select-none">−</span>
          </button>
          <span className="w-4 text-center text-sm font-medium text-foreground font-jakarta">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label={`Increase quantity of ${item.petName}'s ${productLabel}`}
            className="flex h-6 w-6 items-center justify-center rounded border border-border text-muted hover:border-accent hover:text-accent transition-colors"
          >
            <span className="text-sm leading-none select-none">+</span>
          </button>
        </div>
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <span className="text-sm font-bold text-foreground font-jakarta">
          {formatPrice(item.unitPrice * item.quantity)}
        </span>
        <button
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${item.petName}'s ${productLabel} from cart`}
          className="text-muted hover:text-red-400 transition-colors"
        >
          <XIcon />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyCartState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <PawIcon />
      <div>
        <p className="text-lg font-semibold text-foreground font-fraunces">
          Your cart is empty
        </p>
        <p className="mt-1 text-sm text-muted font-jakarta max-w-xs">
          Create a beautiful watercolor memorial for your beloved pet and add it to your cart.
        </p>
      </div>
      <button
        onClick={onClose}
        className="mt-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white font-jakarta hover:bg-accent-hover transition-colors"
      >
        Start Creating
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CartSlideOver() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const itemCount = useCartStore((s) => s.itemCount);

  const hasItems = items.length > 0;
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = useCallback(async () => {
    if (isCheckingOut) return;
    setIsCheckingOut(true);

    try {
      trackInitiateCheckout({ value: subtotal, currency: 'USD' });

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          hasOrderBump: useCartStore.getState().hasOrderBump,
          successUrl: `${window.location.origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to initiate checkout. Please try again.');
        setIsCheckingOut(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (err) {
      console.error('[CartSlideOver] Checkout error:', err);
      toast.error('Unable to connect to checkout. Please check your connection and try again.');
      setIsCheckingOut(false);
    }
  }, [items, subtotal, isCheckingOut]);

  return (
    <Drawer isOpen={isOpen} onClose={closeCart} title="Your Order">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 py-3.5 border-b border-border bg-surface">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-foreground font-fraunces tracking-tight">
            Your Order
          </h2>
          {hasItems && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold text-white font-jakarta">
              {itemCount}
            </span>
          )}
        </div>
        <button
          onClick={closeCart}
          aria-label="Close cart"
          className="rounded-full p-1.5 text-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
        >
          <XIcon />
        </button>
      </header>

      {/* ── Free Shipping Bar ── */}
      {hasItems && <FreeShippingBar />}

      {/* ── Body ── */}
      {hasItems ? (
        <>
          {/* Cart items */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>

          {/* Order bump */}
          <InCartOrderBump />

          {/* ── Footer ── */}
          <div className="border-t border-border bg-surface px-4 pt-4 pb-5 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted font-jakarta">Subtotal</span>
              <span className="text-base font-bold text-foreground font-jakarta">
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Trust seals */}
            <div className="flex items-center justify-center gap-4 py-2">
              <div className="flex items-center gap-1.5">
                <ShieldIcon />
                <span className="text-[11px] text-muted font-jakarta">Lifetime Memory Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TruckIcon />
                <span className="text-[11px] text-muted font-jakarta">Assembled in the USA</span>
              </div>
            </div>

            {/* Primary CTA */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full rounded-full bg-accent py-3.5 text-sm font-bold text-white font-jakarta tracking-wide hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait"
            >
              {isCheckingOut ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Securing Order...</span>
                </>
              ) : (
                <span>Proceed to Checkout →</span>
              )}
            </motion.button>

            {/* Secondary link */}
            <div className="text-center">
              <button
                onClick={closeCart}
                className="text-xs text-muted hover:text-foreground font-jakarta underline underline-offset-2 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      ) : (
        <EmptyCartState onClose={closeCart} />
      )}
    </Drawer>
  );
}