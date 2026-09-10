'use client';

import { useCustomizerStore, type PackageTier } from '@/store/useCustomizerStore';
import { formatPrice, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const PACKAGES: {
  id: PackageTier;
  title: string;
  subtitle: string;
  price: number;
  badge?: string;
  isDecoy?: boolean;
}[] = [
  {
    id: 'entry',
    title: 'Entry',
    subtitle: '12×16" Standard Canvas',
    price: 48,
  },
  {
    id: 'gallery',
    title: 'Gallery',
    subtitle: '18×24" Gallery Canvas',
    price: 68,
    badge: 'MOST LOVED',
    isDecoy: true,
  },
  {
    id: 'heritage',
    title: 'Heritage',
    subtitle: '18×24" Canvas + Memorial Tee',
    price: 88,
    badge: 'SAVE 35%',
  },
];

const springDefault = { type: "spring", stiffness: 350, damping: 25 };
const cardHover = { y: -2, transition: { duration: 0.15 } };
const cardTap = { scale: 0.98 };

export function PackageSelector() {
  const { selectedPackage, setPackage } = useCustomizerStore();

  return (
    <div className="pt-7 pb-7 border-t border-[--border-default]">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-5 h-5 rounded-full bg-[--accent] text-white text-[11px] font-bold font-jakarta flex items-center justify-center shrink-0">
          3
        </span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-[--text-primary] font-jakarta">
          Select Package
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3 mt-4">
        {PACKAGES.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;

          return (
            <motion.button
              key={pkg.id}
              type="button"
              onClick={() => setPackage(pkg.id)}
              whileHover={cardHover}
              whileTap={cardTap}
              className={cn(
                'relative p-5 md:p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[--accent]',
                isSelected
                  ? 'border-2 border-[--accent] bg-[--bg-page]'
                  : pkg.isDecoy
                    ? 'border border-[--border-default] bg-white shadow-md hover:border-[--accent]/50'
                    : 'border border-[--border-default] bg-white hover:border-[--accent]/50'
              )}
              aria-pressed={isSelected}
            >
              {pkg.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-[--accent] text-white shadow-sm whitespace-nowrap">
                  {pkg.badge}
                </span>
              )}

              <span className={cn(
                'text-sm font-bold font-jakarta mb-1',
                isSelected ? 'text-[--accent]' : 'text-[--text-primary]'
              )}>
                {pkg.title}
              </span>

              <span className="text-[11px] leading-snug text-[--text-secondary] font-jakarta mb-2 px-2 h-8 flex items-center">
                {pkg.subtitle}
              </span>

              <span className={cn(
                'text-base font-bold font-jakarta',
                isSelected ? 'text-[--accent]' : 'text-[--text-primary]'
              )}>
                {formatPrice(pkg.price)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
