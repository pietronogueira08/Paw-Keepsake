'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Shield, Key, Coffee } from 'lucide-react';
import { useCartStore, ORDER_BUMP_OPTIONS } from '@/store/useCartStore';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { formatPrice, cn } from '@/lib/utils';

export function InCartOrderBump() {
  const customizerPetName = useCustomizerStore((s) => s.petName);
  const customizerBreed = useCustomizerStore((s) => s.breed);
  const customizerCoat = useCustomizerStore((s) => s.selectedCoat);

  const cartItems = useCartStore((s) => s.items);
  const {
    hasOrderBump,
    orderBump,
    activeBumpType,
    setActiveBumpType,
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

  const currentOption = ORDER_BUMP_OPTIONS[activeBumpType] || ORDER_BUMP_OPTIONS.keyring;
  const isKeyring = activeBumpType === 'keyring';

  function handleToggle() {
    if (hasOrderBump) {
      removeOrderBump();
    } else {
      addOrderBump(activeBumpType);
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
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[--accent] font-jakarta bg-[--accent]/10 px-2.5 py-0.5 rounded-full">
          <Sparkles size={11} />
          Special Add-on Offer ({currentOption.discountPercent}% OFF)
        </span>
        <span className="text-[10px] text-[--text-secondary] font-jakarta font-medium">
          Studio Direct • Ships Together
        </span>
      </div>

      {/* ── Product Switcher Pills: Keyring vs Ceramic Mug ──────────── */}
      <div className="flex items-center gap-1.5 p-1 bg-[#EFE9DD]/70 rounded-xl mb-3 border border-[#E2DDD3]">
        <button
          type="button"
          onClick={() => setActiveBumpType('keyring')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold font-jakarta transition-all cursor-pointer',
            isKeyring
              ? 'bg-white text-[--text-primary] shadow-xs border border-black/5'
              : 'text-[--text-secondary] hover:text-[--text-primary]'
          )}
        >
          <Key size={13} className={isKeyring ? 'text-[--accent]' : 'text-muted'} />
          <span className="truncate">Keyring ({formatPrice(ORDER_BUMP_OPTIONS.keyring.salePrice)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveBumpType('mug')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold font-jakarta transition-all cursor-pointer',
            !isKeyring
              ? 'bg-white text-[--text-primary] shadow-xs border border-black/5'
              : 'text-[--text-secondary] hover:text-[--text-primary]'
          )}
        >
          <Coffee size={13} className={!isKeyring ? 'text-[--accent]' : 'text-muted'} />
          <span className="truncate">Ceramic Mug ({formatPrice(ORDER_BUMP_OPTIONS.mug.salePrice)})</span>
        </button>
      </div>

      {/* Main Row: Photorealistic Mockup on Left, Offer Details on Right */}
      <div className="flex gap-3 sm:gap-4 items-center">
        {/* ── Studio Mockup Container ───────────────────────────────── */}
        <div className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-gradient-to-b from-[#F7F4EE] to-[#ECE7DC] border border-[#E2DDD3] flex items-center justify-center shadow-xs select-none p-1">
          <AnimatePresence mode="wait">
            {isKeyring ? (
              /* ── 1. KEYRING MOCKUP ───────────────────────────────── */
              <motion.div
                key="keyring-mockup"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Photorealistic Stainless Steel Keyring Base */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/keyring/keyring-mockup.webp"
                  alt="Custom Memorial Keepsake Keyring"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.18)]"
                />

                {/* Circular Medallion Mask (rounded-full overflow-hidden) */}
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

                {/* Micro Tag */}
                <span className="absolute bottom-1 right-1.5 text-[7px] font-bold text-[#7A7163] bg-white/90 px-1 py-0.2 rounded backdrop-blur-xs font-jakarta tracking-tight border border-black/5">
                  Stainless Steel
                </span>
              </motion.div>
            ) : (
              /* ── 2. CERAMIC MUG MOCKUP ────────────────────────────── */
              <motion.div
                key="mug-mockup"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {/* Photorealistic 15 oz Ceramic Mug Base */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/mugs/mug-mockup.webp"
                  alt="Custom Memorial Ceramic Mug"
                  className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.16)]"
                />

                {/* Printed Dog Artwork on the Cylindrical Face of the Mug */}
                <div
                  className="absolute flex flex-col items-center justify-center pointer-events-none text-center"
                  style={{
                    left: '54.5%',
                    top: '51%',
                    width: '42%',
                    height: '48%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  aria-label={`${petName}'s mug artwork`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeDogImage}
                    alt={`${petName}'s artwork on mug`}
                    className="w-[74%] h-[74%] object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)] transition-transform duration-300"
                  />
                  {/* Pet Name underneath artwork */}
                  <span className="font-fraunces text-[7px] sm:text-[8px] font-semibold tracking-wider text-[#2B2723] uppercase mt-0.5 truncate max-w-full leading-tight">
                    {petName}
                  </span>
                </div>

                {/* Micro Tag */}
                <span className="absolute bottom-1 right-1.5 text-[7px] font-bold text-[#7A7163] bg-white/90 px-1 py-0.2 rounded backdrop-blur-xs font-jakarta tracking-tight border border-black/5">
                  15 oz Ceramic
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Offer Info & Actions ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {isKeyring ? (
              <Key size={13} className="text-[--accent] shrink-0" />
            ) : (
              <Coffee size={13} className="text-[--accent] shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-bold text-[--text-primary] font-jakarta leading-tight truncate">
              {currentOption.name}
            </p>
          </div>

          <p className="text-[11px] text-[--text-secondary] font-jakarta leading-snug mt-1">
            {isKeyring ? (
              <>
                Keep <span className="font-semibold text-[--text-primary]">{petName}</span> close wherever you go. Heavyweight polished metal medallion with scratch-resistant dome.
              </>
            ) : (
              <>
                Start each morning with <span className="font-semibold text-[--text-primary]">{petName}</span>&apos;s warm portrait. 15 oz glossy ceramic mug with black accent handle.
              </>
            )}
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-2 mb-2">
            <span className="text-sm sm:text-base font-bold text-[--accent] font-jakarta">
              {formatPrice(currentOption.salePrice)}
            </span>
            <span className="text-xs text-[--text-secondary]/70 font-jakarta line-through">
              {formatPrice(currentOption.originalPrice)}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-jakarta">
              SAVE {formatPrice(currentOption.originalPrice - currentOption.salePrice)}
            </span>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[--text-secondary] font-jakarta">
            {isKeyring ? (
              <>
                <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-[#E8E3DA]">
                  <Shield size={10} className="text-emerald-600" />
                  Scratch-proof
                </span>
                <span className="bg-white/80 px-2 py-0.5 rounded border border-[#E8E3DA]">
                  Double-ring swivel
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-[#E8E3DA]">
                  <Shield size={10} className="text-emerald-600" />
                  Dishwasher Safe
                </span>
                <span className="bg-white/80 px-2 py-0.5 rounded border border-[#E8E3DA]">
                  Microwave Safe
                </span>
              </>
            )}
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
            checked={hasOrderBump && orderBump?.type === activeBumpType}
            onChange={handleToggle}
            className="w-4 h-4 rounded accent-[#B88A58] cursor-pointer shrink-0"
            aria-label={`Add matching ${isKeyring ? 'keyring' : 'ceramic mug'} to order`}
          />
          <span className="text-xs font-semibold text-[--text-primary] font-jakarta truncate">
            {hasOrderBump && orderBump?.type === activeBumpType ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1 min-w-0 text-[11px] sm:text-xs">
                <Check size={13} strokeWidth={2.5} className="shrink-0" />
                <span className="truncate">{isKeyring ? 'Keyring' : 'Ceramic Mug'} added ({petName}&apos;s Edition)</span>
              </span>
            ) : (
              <span className="font-bold text-[--text-primary] tracking-tight text-[11px] sm:text-xs">
                + ADD MATCHING {isKeyring ? 'KEYRING' : 'MUG'} (+{formatPrice(currentOption.salePrice)})
              </span>
            )}
          </span>
        </label>

        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'px-3.5 py-1.5 rounded-lg text-xs font-bold font-jakarta transition-all cursor-pointer border shrink-0',
            hasOrderBump && orderBump?.type === activeBumpType
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              : 'bg-[--accent] text-white border-[--accent] hover:bg-[#A67A49]'
          )}
        >
          {hasOrderBump && orderBump?.type === activeBumpType ? 'Remove' : '+ Add'}
        </button>
      </div>
    </div>
  );
}