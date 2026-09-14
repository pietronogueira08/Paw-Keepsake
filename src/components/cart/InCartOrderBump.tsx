'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Shield, Key } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { formatPrice, cn } from '@/lib/utils';

const ORIGINAL_PRICE = 29;
const SALE_PRICE = 19.9; // $19.90 promo price (31% OFF)

export function InCartOrderBump() {
  const customizerPetName = useCustomizerStore((s) => s.petName);
  const customizerBreed = useCustomizerStore((s) => s.breed);
  const customizerCoat = useCustomizerStore((s) => s.selectedCoat);

  const cartItems = useCartStore((s) => s.items);
  const {
    hasOrderBump,
    addOrderBump,
    removeOrderBump,
  } = useCartStore();

  // Resolve pet details from first cart item or customizer draft
  const firstItem = cartItems[0];
  const petName = firstItem?.petName || customizerPetName || 'Cooper';
  const breed = firstItem?.breed || customizerBreed;
  const selectedCoat = firstItem?.selectedCoat || customizerCoat;

  const activeDogImage = selectedCoat
    ? `/breeds/${selectedCoat}.webp`
    : breed?.image || (breed ? `/breeds/${breed.slug}.webp` : '/breeds/french-bulldog-fawn.webp');

  function handleToggle() {
    if (hasOrderBump) {
      removeOrderBump();
    } else {
      addOrderBump();
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all overflow-hidden p-3.5 sm:p-4 my-2',
        hasOrderBump
          ? 'bg-[#FAF6F0] border-[--accent] shadow-xs'
          : 'bg-[#FCFAF7] border-dashed border-[--border-default] hover:border-[--accent]/60'
      )}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[--accent] font-jakarta bg-[--accent]/10 px-2.5 py-0.5 rounded-full">
          <Sparkles size={11} />
          Special Add-on Offer (31% OFF)
        </span>
        <span className="text-[10px] text-[--text-secondary] font-jakarta font-medium">
          Studio Direct • Ships Together
        </span>
      </div>

      {/* Main Row: Photorealistic Keyring Mockup on Left, Offer Details on Right */}
      <div className="flex gap-3 sm:gap-4 items-center">
        {/* ── Studio Keyring Mockup Container ───────────────────────── */}
        <div className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-gradient-to-b from-[#F7F4EE] to-[#ECE7DC] border border-[#E2DDD3] flex items-center justify-center shadow-xs select-none p-1">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Photorealistic Stainless Steel Keyring Base */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/keyring/keyring-mockup.webp"
              alt="Custom Memorial Keepsake Keyring"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
            />

            {/* ── Perfectly Circular Mask (rounded-full overflow-hidden) ── */}
            {/* Precisely calibrated over the round medallion bezel */}
            <div
              className="absolute rounded-full overflow-hidden flex items-center justify-center pointer-events-none bg-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.3)]"
              style={{
                left: '44.8%',
                top: '65.6%',
                width: '38.8%',
                height: '36.8%',
                transform: 'translate(-50%, -50%)',
              }}
              aria-label={`${petName}'s portrait medallion`}
            >
              {/* Only the Pet Artwork inside the round medallion */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeDogImage}
                alt={`${petName}'s artwork`}
                className="w-[88%] h-[88%] object-contain rounded-full filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-transform duration-300"
              />

              {/* Protective Domed Resin Glass Highlight */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-tr from-black/15 via-transparent to-white/45 opacity-80"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Micro Tag */}
          <span className="absolute bottom-1 right-1.5 text-[7px] font-bold text-[#7A7163] bg-white/90 px-1 py-0.2 rounded backdrop-blur-xs font-jakarta tracking-tight border border-black/5">
            Stainless Steel
          </span>
        </div>

        {/* ── Offer Info & Actions ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Key size={13} className="text-[--accent] shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-[--text-primary] font-jakarta leading-tight truncate">
              Matching Keepsake Keyring
            </p>
          </div>
          <p className="text-[11px] text-[--text-secondary] font-jakarta leading-snug mt-1">
            Keep <span className="font-semibold text-[--text-primary]">{petName}</span> close wherever you go. Heavyweight polished metal medallion with scratch-resistant resin dome.
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-2 mb-2">
            <span className="text-sm sm:text-base font-bold text-[--accent] font-jakarta">
              {formatPrice(SALE_PRICE)}
            </span>
            <span className="text-xs text-[--text-secondary]/70 font-jakarta line-through">
              {formatPrice(ORIGINAL_PRICE)}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-jakarta">
              SAVE $9.10
            </span>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[--text-secondary] font-jakarta">
            <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-[#E8E3DA]">
              <Shield size={10} className="text-emerald-600" />
              Scratch-proof
            </span>
            <span className="bg-white/80 px-2 py-0.5 rounded border border-[#E8E3DA]">
              Double-ring swivel
            </span>
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
            aria-label="Add matching keepsake keyring to order"
          />
          <span className="text-xs font-semibold text-[--text-primary] font-jakarta truncate">
            {hasOrderBump ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1 min-w-0 text-[11px] sm:text-xs">
                <Check size={13} strokeWidth={2.5} className="shrink-0" />
                <span className="truncate">Keyring added ({petName}&apos;s Edition)</span>
              </span>
            ) : (
              <span className="font-bold text-[--text-primary] tracking-tight text-[11px] sm:text-xs">
                + ADD MATCHING KEYRING (+{formatPrice(SALE_PRICE)})
              </span>
            )}
          </span>
        </label>

        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'px-3.5 py-1.5 rounded-lg text-xs font-bold font-jakarta transition-all cursor-pointer border shrink-0',
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