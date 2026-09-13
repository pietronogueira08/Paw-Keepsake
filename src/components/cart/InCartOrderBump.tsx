'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useCartStore, type OrderBumpColor, type OrderBumpSize } from '@/store/useCartStore';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { formatPrice, cn } from '@/lib/utils';

const ORIGINAL_PRICE = 45;
const SALE_PRICE = 29; // 35% off

const TSHIRT_COLORS: {
  id: OrderBumpColor;
  label: string;
  image: string;
  hex: string;
  textColor: string;
}[] = [
  {
    id: 'black',
    label: 'Pepper Black',
    image: '/images/tshirts/tshirt-black.webp',
    hex: '#242424',
    textColor: '#FFFFFF',
  },
  {
    id: 'grey',
    label: 'Heather Grey',
    image: '/images/tshirts/tshirt-grey.webp',
    hex: '#D1D5DB',
    textColor: '#242424',
  },
  {
    id: 'white',
    label: 'Pure White',
    image: '/images/tshirts/tshirt-white.webp',
    hex: '#FFFFFF',
    textColor: '#242424',
  },
];

const TSHIRT_SIZES: OrderBumpSize[] = ['S', 'M', 'L', 'XL', '2XL'];

export function InCartOrderBump() {
  const customizerPetName = useCustomizerStore((s) => s.petName);
  const customizerBreed = useCustomizerStore((s) => s.breed);
  const customizerCoat = useCustomizerStore((s) => s.selectedCoat);

  const cartItems = useCartStore((s) => s.items);
  const {
    hasOrderBump,
    orderBumpColor,
    orderBumpSize,
    addOrderBump,
    removeOrderBump,
    setOrderBumpColor,
    setOrderBumpSize,
  } = useCartStore();

  const [isAvailable, setIsAvailable] = useState(true);

  // Resolve pet details from first cart item or customizer draft
  const firstItem = cartItems[0];
  const petName = firstItem?.petName || customizerPetName || 'Cooper';
  const breed = firstItem?.breed || customizerBreed;
  const selectedCoat = firstItem?.selectedCoat || customizerCoat;

  const activeDogImage = selectedCoat
    ? `/breeds/${selectedCoat}.webp`
    : breed?.image || (breed ? `/breeds/${breed.slug}.webp` : '/breeds/french-bulldog-fawn.webp');

  const selectedColorConfig =
    TSHIRT_COLORS.find((c) => c.id === orderBumpColor) || TSHIRT_COLORS[0]; // default Pepper Black

  useEffect(() => {
    let active = true;
    fetch('/api/inventory')
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.tshirt) {
          setIsAvailable(Boolean(data.tshirt.available));
          if (!data.tshirt.available && hasOrderBump) {
            removeOrderBump();
          }
        }
      })
      .catch((err) => console.warn('[InCartOrderBump] Inventory check fallback:', err));

    return () => {
      active = false;
    };
  }, [hasOrderBump, removeOrderBump]);

  function handleToggle() {
    if (!isAvailable) return;
    if (hasOrderBump) {
      removeOrderBump();
    } else {
      addOrderBump();
    }
  }

  if (!isAvailable) return null;

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all overflow-hidden p-3.5 sm:p-4',
        hasOrderBump
          ? 'bg-[#FAF6F0] border-[--accent] shadow-xs'
          : 'bg-[#FCFAF7] border-dashed border-[--border-default] hover:border-[--accent]/60'
      )}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[--accent] font-jakarta bg-[--accent]/10 px-2 py-0.5 rounded-full">
          <Sparkles size={11} />
          Special Add-on Offer (35% OFF)
        </span>
        <span className="text-[10px] text-[--text-secondary] font-jakarta font-medium">
          Studio Direct • Ships Together
        </span>
      </div>

      {/* Main Row: Photorealistic T-Shirt Mockup on Left, Offer Details on Right */}
      <div className="flex gap-3 sm:gap-4 items-center">
        {/* ── Studio Photograph T-Shirt Mockup ─────────────────────── */}
        <div className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-[#F5F2EB] border border-[#E5E0D6] flex items-center justify-center shadow-xs select-none">
          {/* Photorealistic T-Shirt Base Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedColorConfig.image}
              src={selectedColorConfig.image}
              alt={`${selectedColorConfig.label} T-Shirt`}
              initial={{ opacity: 0.5, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Printed Watercolor Artwork on the Chest */}
          <div
            className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
            style={{ top: '44%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeDogImage}
              alt="T-shirt artwork"
              className={cn(
                'w-9 h-9 sm:w-10 sm:h-10 object-contain transition-all',
                orderBumpColor === 'white'
                  ? 'mix-blend-multiply opacity-90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]'
                  : orderBumpColor === 'grey'
                  ? 'mix-blend-multiply opacity-95 drop-shadow-[0_1px_3px_rgba(0,0,0,0.15)]'
                  : 'filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.45)]'
              )}
            />
            <span
              className="font-fraunces text-[6.5px] sm:text-[7px] font-bold tracking-widest uppercase block truncate max-w-[50px] mt-0.5 leading-none"
              style={{
                color: selectedColorConfig.textColor,
                textShadow: orderBumpColor === 'black' ? '0 1px 2px rgba(0,0,0,0.7)' : 'none',
              }}
            >
              {petName}
            </span>
          </div>

          {/* Micro Tag */}
          <span className="absolute bottom-1 right-1.5 text-[7px] font-semibold text-[#8C8477] bg-white/85 px-1 py-0.2 rounded backdrop-blur-xs font-jakarta tracking-tight">
            100% Cotton
          </span>
        </div>

        {/* ── Offer Info & Actions ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold text-[--text-primary] font-jakarta leading-tight truncate">
            Matching Comfort Colors® Tee
          </p>
          <p className="text-[11px] text-[--text-secondary] font-jakarta leading-snug mt-0.5">
            Wear <span className="font-semibold text-[--text-primary]">{petName}</span>'s portrait with heavy 6.1 oz ringspun cotton.
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-1.5 mb-2.5">
            <span className="text-sm font-bold text-[--accent] font-jakarta">
              {formatPrice(SALE_PRICE)}
            </span>
            <span className="text-xs text-[--text-secondary]/70 font-jakarta line-through">
              {formatPrice(ORIGINAL_PRICE)}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-jakarta">
              SAVE $16
            </span>
          </div>

          {/* ── Color Swatches (Clean Circles, No Text Clipping) ─────── */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-medium text-[--text-secondary] font-jakarta truncate">
              Color: <span className="font-semibold text-[--text-primary]">{selectedColorConfig.label}</span>
            </span>
            <div className="flex items-center gap-1.5 shrink-0" role="radiogroup" aria-label="T-shirt color">
              {TSHIRT_COLORS.map((c) => {
                const isSelected = orderBumpColor === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    title={c.label}
                    onClick={() => setOrderBumpColor(c.id)}
                    className={cn(
                      'w-5 h-5 rounded-full transition-all cursor-pointer relative flex items-center justify-center',
                      c.id === 'white' && 'bg-white border border-black/20',
                      c.id === 'grey' && 'bg-[#D1D5DB] border border-black/10',
                      c.id === 'black' && 'bg-[#242424] border border-black/30',
                      isSelected
                        ? 'ring-2 ring-[--accent] ring-offset-2 ring-offset-white shadow-xs scale-110'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    )}
                  >
                    {isSelected && (
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          c.id === 'black' ? 'bg-white' : 'bg-[--accent]'
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Size Pills (S, M, L, XL, 2XL) ───────────────────────── */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-[--text-secondary] font-jakarta mr-1">
              Size:
            </span>
            {TSHIRT_SIZES.map((sz) => {
              const isSelected = orderBumpSize === sz;
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setOrderBumpSize(sz)}
                  className={cn(
                    'w-6 h-6 rounded text-[10.5px] font-semibold font-jakarta flex items-center justify-center transition-all cursor-pointer border',
                    isSelected
                      ? 'bg-[--accent] text-white border-[--accent]'
                      : 'bg-white text-[--text-secondary] border-[--border-default] hover:border-[--accent]/60'
                  )}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Add to Cart Toggle CTA ─────────────────────────────────── */}
      <div className="mt-3 pt-3 border-t border-[--border-default]/70 flex items-center justify-between gap-3">
        <label
          htmlFor="order-bump-checkbox"
          className="flex items-center gap-2 cursor-pointer flex-1 select-none min-w-0"
        >
          <input
            id="order-bump-checkbox"
            type="checkbox"
            checked={hasOrderBump}
            onChange={handleToggle}
            className="w-4 h-4 rounded accent-[#B88A58] cursor-pointer shrink-0"
            aria-label="Add matching t-shirt to order"
          />
          <span className="text-xs font-semibold text-[--text-primary] font-jakarta truncate">
            {hasOrderBump ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1 truncate">
                <Check size={14} strokeWidth={2.5} className="shrink-0" />
                <span className="truncate">Matching Tee added ({selectedColorConfig.label}, {orderBumpSize})</span>
              </span>
            ) : (
              <span className="font-bold text-[--text-primary] tracking-tight text-[11px] sm:text-xs">
                + ADD MATCHING T-SHIRT (+${SALE_PRICE})
              </span>
            )}
          </span>
        </label>

        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-bold font-jakarta transition-all cursor-pointer border shrink-0',
            hasOrderBump
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              : 'bg-[--accent] text-white border-[--accent] hover:bg-[#A67A49]'
          )}
        >
          {hasOrderBump ? 'Remove' : '+ Add'}
        </button>
      </div>
    </div>
  );
}