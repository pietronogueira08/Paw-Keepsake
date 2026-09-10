'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { formatPrice } from '@/lib/utils';

const ORIGINAL_PRICE = 45;
const SALE_PRICE = 29; // 35% off

export function InCartOrderBump() {
  const petName = useCustomizerStore((s) => s.petName);
  const { hasOrderBump, addOrderBump, removeOrderBump } = useCartStore();

  const [isChecked, setIsChecked] = useState(hasOrderBump);
  const displayName = petName.trim() || 'your pet';

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setIsChecked(checked);
    if (checked) {
      addOrderBump();
    } else {
      removeOrderBump();
    }
  }

  return (
    <div className="border border-dashed border-accent/40 rounded-card p-4 bg-accent/3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-accent font-jakarta mb-3">
        🎁 Special One-Time Offer
      </p>

      <label className="flex items-start gap-3 cursor-pointer" htmlFor="order-bump-checkbox">
        <input
          id="order-bump-checkbox"
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          className="mt-1 w-4 h-4 accent-[#B88A58] cursor-pointer flex-shrink-0"
          aria-label="Add matching t-shirt"
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground font-jakarta leading-snug">
            Add a Matching Comfort Colors T-Shirt with{' '}
            <span className="text-accent">{displayName}</span>'s Art
          </p>
          <p className="text-xs text-muted font-jakarta mt-0.5">
            Premium unisex tee · Watercolor art on the chest · Soft ringspun cotton
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-bold text-accent font-jakarta">
              {formatPrice(SALE_PRICE)}
            </span>
            <span className="text-xs text-muted font-jakarta line-through">
              {formatPrice(ORIGINAL_PRICE)}
            </span>
            <span className="text-[10px] font-bold text-white bg-accent px-1.5 py-0.5 rounded-full font-jakarta">
              35% OFF
            </span>
          </div>
        </div>
      </label>

      <AnimatePresence>
        {isChecked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 pt-3 border-t border-accent/20"
          >
            <p className="text-xs text-trust font-jakarta flex items-center gap-1.5">
              ✓ Added! Your matching tee will ship with your memorial piece.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}