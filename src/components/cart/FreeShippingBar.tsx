'use client';

/**
 * FreeShippingBar — Animated progress bar shown in the cart drawer header.
 *
 * Reads cart state and displays:
 *   - "Add $X more for Free Insured Shipping" while threshold is not met
 *   - "You've unlocked Free Insured Shipping! 🎉" once hasFreeShipping is true
 *
 * Uses framer-motion for spring-animated width transitions.
 */

import { motion } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 50;

export function FreeShippingBar() {
  const subtotal = useCartStore((s) => s.subtotal);
  const hasFreeShipping = useCartStore((s) => s.hasFreeShipping);
  const freeShippingRemaining = useCartStore((s) => s.freeShippingRemaining);

  const percent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="px-4 py-2.5 bg-surface-subtle border-b border-border">
      {/* Message */}
      <p className="mb-1.5 text-xs font-medium font-jakarta text-center text-foreground">
        {hasFreeShipping ? (
          <span className="text-trust font-semibold">
            You&apos;ve unlocked Free Insured Shipping! 🎉
          </span>
        ) : (
          <>
            Add{' '}
            <span className="text-accent font-semibold">
              {formatPrice(freeShippingRemaining)}
            </span>{' '}
            more for{' '}
            <span className="font-semibold">Free Insured Shipping</span>
          </>
        )}
      </p>

      {/* Progress bar track */}
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Free shipping progress"
        className="relative h-1.5 w-full rounded-full bg-border overflow-hidden"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: hasFreeShipping
              ? 'linear-gradient(90deg, #B88A58, #D4A96A)'
              : 'linear-gradient(90deg, #B88A58, #C9986A)',
          }}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 20,
            mass: 0.8,
          }}
        />
      </div>
    </div>
  );
}