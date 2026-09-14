'use client';

import { useState, useEffect } from 'react';
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
  const [inventory, setInventory] = useState<Record<string, boolean>>({
    '8x12': true,
    '12x16': true,
    '16x20': true,
    '16x24': true,
  });

  useEffect(() => {
    let active = true;
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.canvas) {
          const map: Record<string, boolean> = {};
          Object.entries(data.canvas).forEach(([size, info]: [string, any]) => {
            map[size] = Boolean(info.available);
          });
          setInventory((prev) => ({ ...prev, ...map }));

          // If current selection is out of stock, auto-switch to first in-stock package
          const currentSize = selectedPackage === 'gallery' ? '12x16' : selectedPackage === 'entry' ? '8x12' : selectedPackage;
          if (map[currentSize] === false) {
            const firstAvailable = PACKAGES.find((p) => map[p.id] !== false);
            if (firstAvailable) {
              setPackage(firstAvailable.id);
            }
          }
        }
      })
      .catch((err) => console.warn('[PackageSelector] Inventory fetch fallback:', err));

    return () => {
      active = false;
    };
  }, [selectedPackage, setPackage]);

  return (
    <div className="pt-5 pb-5 border-t border-[#EBE6DE]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#B88A58] text-white text-[11px] font-bold font-jakarta flex items-center justify-center shrink-0">
            3
          </span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#2B241D] font-jakarta">
            Select Canvas Size
          </h3>
        </div>
        <span className="text-[11px] text-[#6B6156] font-jakarta">
          1.5&quot; Museum Depth • Ready to Hang
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-3">
        {PACKAGES.map((pkg) => {
          const isSelected = selectedPackage === pkg.id || (pkg.id === '12x16' && selectedPackage === 'gallery') || (pkg.id === '8x12' && selectedPackage === 'entry');
          const isAvailable = inventory[pkg.id] !== false;

          return (
            <motion.button
              key={pkg.id}
              type="button"
              disabled={!isAvailable}
              onClick={() => isAvailable && setPackage(pkg.id)}
              whileHover={isAvailable ? cardHover : undefined}
              whileTap={isAvailable ? cardTap : undefined}
              className={cn(
                'relative p-3 sm:p-3.5 rounded-xl flex flex-col items-center justify-between text-center transition-all outline-none min-h-[132px]',
                !isAvailable
                  ? 'opacity-40 cursor-not-allowed bg-neutral-100 border border-neutral-200 filter grayscale'
                  : 'cursor-pointer focus-visible:ring-2 focus-visible:ring-[#B88A58]',
                isAvailable && isSelected
                  ? 'border-2 border-[#B88A58] bg-[#FAF8F5] ring-1 ring-[#B88A58]/30 shadow-sm'
                  : isAvailable && pkg.isDecoy
                    ? 'border border-[#EBE6DE] bg-white shadow-sm hover:border-[#B88A58]/50'
                    : isAvailable
                      ? 'border border-[#EBE6DE] bg-white hover:border-[#B88A58]/50'
                      : ''
              )}
              aria-pressed={isSelected}
              aria-disabled={!isAvailable}
            >
              {!isAvailable ? (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full bg-neutral-700 text-white shadow-sm whitespace-nowrap">
                  OUT OF STOCK
                </span>
              ) : pkg.badge ? (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full bg-[#B88A58] text-white shadow-xs whitespace-nowrap">
                  {pkg.badge}
                </span>
              ) : null}

              <div className="w-full pt-0.5">
                <span className={cn(
                  'text-base sm:text-lg font-bold font-jakarta block leading-tight',
                  !isAvailable ? 'text-neutral-400' : isSelected ? 'text-[#B88A58]' : 'text-[#2B241D]'
                )}>
                  {pkg.title}
                </span>
                <span className="text-[10px] text-[#6B6156] font-jakarta block mt-0.5">
                  {pkg.dimensions}
                </span>
              </div>

              <span className="text-[11px] leading-tight text-[#6B6156] font-jakarta my-1 px-1">
                {!isAvailable ? 'Temporarily unavailable' : pkg.subtitle}
              </span>

              <div className="w-full pt-1.5 border-t border-[#EBE6DE]/60">
                <span className={cn(
                  'text-sm sm:text-base font-bold font-jakarta block',
                  !isAvailable ? 'text-neutral-400 line-through' : isSelected ? 'text-[#B88A58]' : 'text-[#2B241D]'
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
