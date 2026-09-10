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
      {/* Print Style Toggle */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#736E65] mb-2.5 block font-jakarta">
          Print Style
        </label>
        <div className="grid grid-cols-2 rounded-xl border border-[#EBE6DE] bg-white p-1 gap-1.5 shadow-xs">
          {PRODUCT_TABS.map((tab) => {
            const isActive = productType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setProductType(tab.id)}
                className={cn(
                  'relative rounded-lg px-3 py-2.5 text-center transition-all duration-200 font-jakarta cursor-pointer',
                  isActive
                    ? 'bg-[#B88A58] text-white shadow-xs'
                    : 'bg-transparent text-[#242424] hover:bg-[#FAF8F5]'
                )}
                aria-pressed={isActive}
              >
                <span className="block text-xs font-bold leading-tight">
                  {tab.label}
                </span>
                <span className={cn('block text-[10px] leading-tight mt-0.5', isActive ? 'text-white/90' : 'text-[#736E65]')}>
                  {tab.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Size Cards with Guaranteed Visibility */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#736E65] mb-3 block font-jakarta">
          Select Size
        </label>
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {SIZE_CONFIG.map((variant) => {
            const isSelected = size === variant.size;
            const price = variant.prices[productType];

            return (
              <button
                key={variant.size}
                type="button"
                onClick={() => setSize(variant.size)}
                className={cn(
                  isSelected
                    ? 'relative p-4 rounded-xl border-2 border-[#B88A58] bg-[#FAF8F5] ring-1 ring-[#B88A58] shadow-sm transition-all cursor-pointer flex flex-col items-center justify-center text-center'
                    : 'relative p-4 rounded-xl border border-[#EBE6DE] bg-white transition-all cursor-pointer flex flex-col items-center justify-center text-center hover:border-[#B88A58]/60 hover:shadow-sm'
                )}
                aria-pressed={isSelected}
              >
                {/* Popular Badge */}
                {variant.croBadge && (
                  <span className="absolute -top-2.5 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-[#B88A58] text-white shadow-xs">
                    {variant.croBadge}
                  </span>
                )}

                {/* Dimensions on Top */}
                <span className={cn(
                  'text-sm font-bold font-jakarta',
                  isSelected ? 'text-[#B88A58]' : 'text-[#242424]'
                )}>
                  {variant.label}
                </span>

                <span className="text-[11px] text-[#736E65] font-jakarta">
                  {variant.dimensionsCm}
                </span>

                {/* Price with mt-1 */}
                <span className={cn(
                  'text-base font-bold font-jakarta mt-1',
                  isSelected ? 'text-[#B88A58]' : 'text-[#242424]'
                )}>
                  {formatPrice(price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quality reassurance strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#EBE6DE]">
        {['300 GSM Archival Paper', 'Gallery UV Coating', 'Acid-Free Inks', 'Solid Wood Frame'].map((feat) => (
          <span key={feat} className="inline-flex items-center gap-1 text-[11px] text-[#879788] font-jakarta">
            <Check size={11} strokeWidth={3} aria-hidden="true" />
            {feat}
          </span>
        ))}
      </div>
    </div>
  );
}
