'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { formatPrice, cn } from '@/lib/utils';
import type { ProductType, CanvasSize } from '@/types/ecommerce';

// ─── Product type tabs ────────────────────────────────────────────────────────

const PRODUCT_TABS: { id: ProductType; label: string; subtitle: string }[] = [
  { id: 'museum-canvas', label: 'Museum Canvas', subtitle: 'Stretched, gallery-ready' },
  { id: 'framed-print',  label: 'Framed Fine Art Print', subtitle: 'Solid wood frame included' },
];

// ─── CRO-anchored size config ─────────────────────────────────────────────────
// Pricing restructured per brief:
//   12x16 → entry level $48 (museum-canvas), $65 (framed)
//   18x24 → "Most Loved by Families" anchor at $68 / $89
//   24x36 → Grand Statement $148 / $185

interface SizeConfig {
  size: CanvasSize;
  label: string;
  dimensionsCm: string;
  prices: Record<ProductType, number>;
  croBadge?: string;
  subLabel?: string;
}

const SIZE_CONFIG: SizeConfig[] = [
  {
    size: '12x16',
    label: '12×16"',
    dimensionsCm: '30 × 40 cm',
    prices: { 'museum-canvas': 48, 'framed-print': 65 },
    subLabel: 'Entry Level',
  },
  {
    size: '18x24',
    label: '18×24"',
    dimensionsCm: '45 × 60 cm',
    prices: { 'museum-canvas': 68, 'framed-print': 89 },
    croBadge: 'Most Loved',
    subLabel: 'Best Value',
  },
  {
    size: '24x36',
    label: '24×36"',
    dimensionsCm: '60 × 90 cm',
    prices: { 'museum-canvas': 148, 'framed-print': 185 },
    subLabel: 'Grand Statement',
  },
  {
    size: '8x10',
    label: '8×10"',
    dimensionsCm: '20 × 25 cm',
    prices: { 'museum-canvas': 38, 'framed-print': 52 },
    subLabel: 'Mini Print',
  },
];

export function SizeMaterialSelector() {
  const { productType, setProductType, size, setSize } = useCustomizerStore();

  return (
    <div className="flex flex-col gap-6">
      {/* Product type tabs */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#736E65] mb-2 block">
          Print Style
        </label>
        <div className="flex rounded-xl border border-[#EBE6DE] overflow-hidden bg-white p-1 gap-1">
          {PRODUCT_TABS.map((tab) => {
            const isActive = productType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProductType(tab.id)}
                className="relative flex-1 rounded-[10px] px-3 py-3 text-center transition-all duration-200 font-jakarta"
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.div
                    layoutId="productTypeIndicator"
                    className="absolute inset-0 bg-[#B88A58] rounded-[10px]"
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
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

      {/* Size selection — CRO anchored grid */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#736E65] mb-2 block">
          Size
        </label>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {SIZE_CONFIG.map((variant) => {
            const isSelected = size === variant.size;
            const price = variant.prices[productType];
            const isMostLoved = !!variant.croBadge;

            return (
              <motion.button
                key={variant.size}
                type="button"
                onClick={() => setSize(variant.size)}
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
                whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 450, damping: 18 } }}
                className={cn(
                  'relative p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-200 mt-2',
                  isSelected
                    ? 'border-[#B88A58] bg-white ring-2 ring-[#B88A58]/20'
                    : 'border-[#EBE6DE] bg-white hover:border-[#B88A58]/40',
                )}
                aria-pressed={isSelected}
              >
                {/* CRO badge — Cleanly placed above without overlap */}
                {variant.croBadge && (
                  <span className="absolute -top-3 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-[#B88A58] text-white">
                    {variant.croBadge}
                  </span>
                )}

                {/* Size label */}
                <span className={cn(
                  'text-sm font-semibold font-jakarta mt-1',
                  isMostLoved && !isSelected ? 'text-[#B88A58]' : isSelected ? 'text-[#B88A58]' : 'text-foreground',
                )}>
                  {variant.label}
                </span>

                {/* Dimensions */}
                <span className="text-[10px] text-muted font-jakarta mt-0.5">{variant.dimensionsCm}</span>

                {/* Sub-label */}
                {variant.subLabel && (
                  <span className={cn(
                    'text-[10px] font-jakarta font-medium mt-1',
                    isMostLoved ? 'text-[#B88A58]/80' : 'text-muted/70',
                  )}>
                    {variant.subLabel}
                  </span>
                )}

                {/* Price */}
                <span className={cn('text-base font-semibold font-jakarta mt-2', isSelected ? 'text-[#B88A58]' : 'text-foreground')}>
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
