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
  namePt: string;
  hex: string;
  collar: string;
  stroke: string;
  textColor: string;
}[] = [
  {
    id: 'black',
    label: 'Black',
    namePt: 'Preto',
    hex: '#1E1E20',
    collar: '#2D2D32',
    stroke: '#38383E',
    textColor: '#FFFFFF',
  },
  {
    id: 'grey',
    label: 'Heather Grey',
    namePt: 'Cinza',
    hex: '#D0D3D8',
    collar: '#BEC2C9',
    stroke: '#B4B8C0',
    textColor: '#242424',
  },
  {
    id: 'white',
    label: 'White',
    namePt: 'Branco',
    hex: '#FFFFFF',
    collar: '#F0ECE4',
    stroke: '#E0DDD4',
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
    TSHIRT_COLORS.find((c) => c.id === orderBumpColor) || TSHIRT_COLORS[2]; // default white

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
        <span className="text-[10px] text-[--text-secondary] font-jakarta">
          Printful Direct • Ships Together
        </span>
      </div>

      {/* Main Row: T-Shirt Mockup on Left, Offer Details on Right */}
      <div className="flex gap-3 sm:gap-4 items-center">
        {/* ── Realistic Interactive T-Shirt Mockup ───────────────────── */}
        <div className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-white/70 border border-[#E8E4DC] p-1 flex items-center justify-center shadow-xs select-none">
          {/* T-shirt Vector Mockup */}
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.1)] transition-all duration-200"
          >
            {/* T-shirt Body and Sleeves */}
            <path
              d="M 52 24 C 64 37, 96 37, 108 24 L 142 43 C 147 46, 148 53, 145 58 L 130 81 C 127 85, 120 87, 115 84 L 108 79 L 108 150 C 108 153, 105 156, 102 156 L 58 156 C 55 156, 52 153, 52 150 L 52 79 L 45 84 C 40 87, 33 85, 30 81 L 15 58 C 12 53, 13 46, 18 43 Z"
              fill={selectedColorConfig.hex}
              stroke={selectedColorConfig.stroke}
              strokeWidth="1.5"
            />
            {/* Ribbed Collar */}
            <path
              d="M 52 24 C 64 38, 96 38, 108 24 C 96 31, 64 31, 52 24 Z"
              fill={selectedColorConfig.collar}
              stroke={selectedColorConfig.stroke}
              strokeWidth="1"
            />
            {/* Fabric Crease Shadow Lines */}
            <path
              d="M 52 79 Q 65 83 80 85"
              stroke={selectedColorConfig.stroke}
              strokeWidth="1"
              opacity="0.35"
              fill="none"
            />
            <path
              d="M 108 79 Q 95 83 80 85"
              stroke={selectedColorConfig.stroke}
              strokeWidth="1"
              opacity="0.35"
              fill="none"
            />
          </svg>

          {/* Printed Watercolor Artwork on the Chest */}
          <div
            className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
            style={{ top: '38%', left: '50%', transform: 'translate(-50%, -50%)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeDogImage}
              alt="T-shirt artwork"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
            />
            <span
              className="font-fraunces text-[6.5px] sm:text-[7px] font-bold tracking-widest uppercase block truncate max-w-[50px] mt-0.5 leading-none"
              style={{ color: selectedColorConfig.textColor }}
            >
              {petName}
            </span>
          </div>

          {/* Brand Micro-Label */}
          <span className="absolute bottom-1 right-1.5 text-[7px] text-[#A69E90] font-jakarta tracking-tight">
            100% Cotton
          </span>
        </div>

        {/* ── Offer Info & Actions ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold text-[--text-primary] font-jakarta leading-tight truncate">
            Matching Comfort Colors® Tee
          </p>
          <p className="text-[11px] text-[--text-secondary] font-jakarta leading-snug mt-0.5">
            Wear <span className="font-semibold text-[--text-primary]">{petName}</span>'s portrait with soft ringspun cotton.
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

          {/* ── Color Swatches (Preto, Cinza, Branco) ─────────────── */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[11px] font-medium text-[--text-secondary] font-jakarta mr-1">
              Cor:
            </span>
            {TSHIRT_COLORS.map((c) => {
              const isSelected = orderBumpColor === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  title={`${c.label} (${c.namePt})`}
                  onClick={() => setOrderBumpColor(c.id)}
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium font-jakarta border transition-all cursor-pointer',
                    isSelected
                      ? 'border-[--accent] bg-white text-[--text-primary] shadow-2xs ring-1 ring-[--accent]/30'
                      : 'border-[--border-default] bg-white/60 text-[--text-secondary] hover:border-[--accent]/50'
                  )}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.namePt}</span>
                </button>
              );
            })}
          </div>

          {/* ── Size Pills (S, M, L, XL, 2XL) ───────────────────────── */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-medium text-[--text-secondary] font-jakarta mr-1">
              Tam:
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
          className="flex items-center gap-2 cursor-pointer flex-1 select-none"
        >
          <input
            id="order-bump-checkbox"
            type="checkbox"
            checked={hasOrderBump}
            onChange={handleToggle}
            className="w-4 h-4 rounded accent-[#B88A58] cursor-pointer"
            aria-label="Add matching t-shirt to order"
          />
          <span className="text-xs font-semibold text-[--text-primary] font-jakarta">
            {hasOrderBump ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check size={14} strokeWidth={2.5} />
                Camiseta adicionada ({selectedColorConfig.namePt}, {orderBumpSize})
              </span>
            ) : (
              <span>Adicionar Camiseta por +$29</span>
            )}
          </span>
        </label>

        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-bold font-jakarta transition-all cursor-pointer border',
            hasOrderBump
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              : 'bg-[--accent] text-white border-[--accent] hover:bg-[#A67A49]'
          )}
        >
          {hasOrderBump ? 'Remover' : '+ Adicionar'}
        </button>
      </div>
    </div>
  );
}