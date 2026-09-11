'use client';

import { useCustomizerStore, type PackageTier } from '@/store/useCustomizerStore';
import { formatPrice, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const PACKAGES: {
  id: PackageTier;
  title: string;
  dimensions: string;
  subtitle: string;
  price: number;
  badge?: string;
  isDecoy?: boolean;
}[] = [
  {
    id: '8x12',
    title: '8×12"',
    dimensions: '20×30 cm',
    subtitle: 'Petite / Desk',
    price: 48,
  },
  {
    id: '12x16',
    title: '12×16"',
    dimensions: '30×40 cm',
    subtitle: 'Family Favorite',
    price: 68,
    badge: 'MOST LOVED',
    isDecoy: true,
  },
  {
    id: '16x20',
    title: '16×20"',
    dimensions: '40×50 cm',
    subtitle: 'Feature Wall',
    price: 98,
    badge: 'POPULAR',
  },
  {
    id: '16x24',
    title: '16×24"',
    dimensions: '40×61 cm',
    subtitle: 'Grand Gallery',
    price: 128,
    badge: 'BEST VALUE',
  },
];

const springDefault = { type: "spring", stiffness: 350, damping: 25 };
const cardHover = { y: -2, transition: { duration: 0.15 } };
const cardTap = { scale: 0.98 };

export function PackageSelector() {
  const { selectedPackage, setPackage } = useCustomizerStore();

  return (
    <div className="pt-7 pb-7 border-t border-[--border-default]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[--accent] text-white text-[11px] font-bold font-jakarta flex items-center justify-center shrink-0">
            3
          </span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[--text-primary] font-jakarta">
            Select Canvas Size
          </h3>
        </div>
        <span className="text-[11px] text-[--text-secondary] font-jakarta">
          1.5&quot; Museum Depth • Ready to Hang
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-4">
        {PACKAGES.map((pkg) => {
          const isSelected = selectedPackage === pkg.id || (pkg.id === '12x16' && selectedPackage === 'gallery') || (pkg.id === '8x12' && selectedPackage === 'entry');

          return (
            <motion.button
              key={pkg.id}
              type="button"
              onClick={() => setPackage(pkg.id)}
              whileHover={cardHover}
              whileTap={cardTap}
              className={cn(
                'relative p-3.5 sm:p-4 rounded-xl flex flex-col items-center justify-between text-center transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[--accent] min-h-[148px]',
                isSelected
                  ? 'border-2 border-[--accent] bg-[--bg-page] ring-1 ring-[--accent]/30 shadow-sm'
                  : pkg.isDecoy
                    ? 'border border-[--border-default] bg-white shadow-sm hover:border-[--accent]/50'
                    : 'border border-[--border-default] bg-white hover:border-[--accent]/50'
              )}
              aria-pressed={isSelected}
            >
              {pkg.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full bg-[--accent] text-white shadow-sm whitespace-nowrap">
                  {pkg.badge}
                </span>
              )}

              <div className="w-full pt-1">
                <span className={cn(
                  'text-base sm:text-lg font-bold font-jakarta block leading-tight',
                  isSelected ? 'text-[--accent]' : 'text-[--text-primary]'
                )}>
                  {pkg.title}
                </span>
                <span className="text-[10px] text-[--text-secondary] font-jakarta block mt-0.5">
                  {pkg.dimensions}
                </span>
              </div>

              <span className="text-[11px] leading-tight text-[--text-secondary] font-jakarta my-1.5 px-1">
                {pkg.subtitle}
              </span>

              <div className="w-full pt-1.5 border-t border-[--border-default]/50">
                <span className={cn(
                  'text-sm sm:text-base font-bold font-jakarta block',
                  isSelected ? 'text-[--accent]' : 'text-[--text-primary]'
                )}>
                  {formatPrice(pkg.price)}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
