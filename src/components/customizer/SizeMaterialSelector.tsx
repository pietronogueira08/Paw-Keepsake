'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { SIZE_VARIANTS } from '@/lib/breeds-data';
import { cn, formatPrice } from '@/lib/utils';
import type { ProductType, CanvasSize } from '@/types/ecommerce';

const PRODUCT_TABS: { id: ProductType; label: string; subtitle: string }[] = [
  { id: 'museum-canvas', label: 'Museum Canvas', subtitle: 'Stretched, gallery-ready' },
  { id: 'framed-print', label: 'Framed Fine Art Print', subtitle: 'Solid wood frame included' },
];

export function SizeMaterialSelector() {
  const { productType, setProductType, size, setSize } = useCustomizerStore();

  return (
    <div className="flex flex-col gap-5">
      {/* Product type tabs */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted font-jakarta mb-2">
          Print Style
        </p>
        <div className="flex rounded-card border border-border overflow-hidden bg-surface-subtle p-1 gap-1">
          {PRODUCT_TABS.map((tab) => {
            const isActive = productType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProductType(tab.id)}
                className={cn(
                  'relative flex-1 rounded-[8px] px-3 py-2.5 text-center transition-all duration-200 font-jakarta',
                )}
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.div
                    layoutId="productTypeIndicator"
                    className="absolute inset-0 bg-accent rounded-[8px]"
                    transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }}
                  />
                )}
                <span className={cn('relative z-10 block text-xs font-semibold leading-tight', isActive ? 'text-white' : 'text-foreground')}>
                  {tab.label}
                </span>
                <span className={cn('relative z-10 block text-[10px] leading-tight mt-0.5', isActive ? 'text-white/80' : 'text-muted')}>
                  {tab.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size selection */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted font-jakarta mb-2">
          Size
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SIZE_VARIANTS.map((variant) => {
            const isSelected = size === variant.size;
            const price = variant.prices[productType];

            return (
              <motion.button
                key={variant.size}
                type="button"
                onClick={() => setSize(variant.size as CanvasSize)}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 450, damping: 18 } }}
                className={cn(
                  'relative flex flex-col items-start gap-0.5 rounded-card border px-3 py-3 text-left transition-all duration-200',
                  isSelected
                    ? 'border-accent bg-accent/5 shadow-accent-ring'
                    : 'border-border bg-surface hover:border-accent/40',
                )}
                aria-pressed={isSelected}
              >
                {/* Popular badge */}
                {variant.popularityLabel && (
                  <span className="absolute -top-2 left-3 bg-accent text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full font-jakarta">
                    {variant.popularityLabel}
                  </span>
                )}

                {isSelected && (
                  <span className="absolute top-2 right-2">
                    <Check size={12} strokeWidth={2.5} className="text-accent" />
                  </span>
                )}

                <span className={cn('text-sm font-semibold font-jakarta', isSelected ? 'text-accent' : 'text-foreground')}>
                  {variant.label}
                </span>
                <span className="text-[10px] text-muted font-jakarta">{variant.dimensionsCm}</span>
                <span className={cn('text-base font-semibold font-jakarta mt-1', isSelected ? 'text-accent' : 'text-foreground')}>
                  {formatPrice(price)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Material quality strip */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {['300 GSM Fine Art Paper', 'Gallery UV Coating', 'Acid-Free Inks', 'Solid Wood Frame'].map((feat) => (
          <span key={feat} className="flex items-center gap-1 text-[10px] text-trust font-jakarta">
            <Check size={10} strokeWidth={3} aria-hidden="true" />
            {feat}
          </span>
        ))}
      </div>
    </div>
  );
}
