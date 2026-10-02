'use client';

import { Check, Sparkles, Shield, Coffee } from 'lucide-react';
import { useCartStore, ORDER_BUMP_OPTIONS } from '@/store/useCartStore';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { formatPrice, cn } from '@/lib/utils';
import { trackAddToCart } from '@/lib/analytics';

export function InCartOrderBump() {
  const customizerPetName = useCustomizerStore((s) => s.petName);
  const customizerBreed = useCustomizerStore((s) => s.breed);
  const customizerCoat = useCustomizerStore((s) => s.selectedCoat);

  const cartItems = useCartStore((s) => s.items);
  const {
    hasOrderBump,
    orderBump,
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

  const hasMugInCart = cartItems.some((i) => i.productType === 'ceramic-mug');

  // If a ceramic mug is already in the cart as a main item, don't show the order bump
  if (hasMugInCart) return null;

  const mugOption = ORDER_BUMP_OPTIONS.mug;
  const isAdded = hasOrderBump && orderBump?.type === 'mug';

  function handleToggle() {
    if (isAdded) {
      removeOrderBump();
    } else {
      addOrderBump('mug');
      trackAddToCart({
        content_name: mugOption.name,
        content_category: 'Merchandise',
        content_ids: [mugOption.id],
        content_type: 'product',
        value: mugOption.salePrice,
        currency: 'USD',
        petName,
      });
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all overflow-hidden p-3.5 sm:p-4',
        isAdded
          ? 'bg-[#FAF6F0] border-[--accent] shadow-xs'
          : 'bg-[#FCFAF7] border-dashed border-[--border-default] hover:border-[--accent]/60'
      )}
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[--accent] font-jakarta bg-[--accent]/10 px-2.5 py-0.5 rounded-full">
          <Sparkles size={11} />
          Special Add-on Offer ({mugOption.discountPercent}% OFF)
        </span>
        <span className="text-[10px] text-[--text-secondary] font-jakarta font-medium">
          Studio Direct • Ships Together
        </span>
      </div>

      {/* Main Row: Photorealistic Mockup on Left, Offer Details on Right */}
      <div className="flex gap-3 sm:gap-4 items-center">
        {/* ── Studio Mug Mockup Container ─────────────────────────── */}
        <div className="relative w-24 h-28 sm:w-28 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-gradient-to-b from-[#F7F4EE] to-[#ECE7DC] border border-[#E2DDD3] flex items-center justify-center shadow-xs select-none p-1">
          <div className="relative h-full aspect-square flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mugs/mug-mockup.webp"
              alt={`${petName}'s Memorial Ceramic Mug`}
              className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.16)]"
            />

            {/* Printed Dog Artwork on the Cylindrical Face of the Mug */}
            <div
              className="absolute flex flex-col items-center justify-center pointer-events-none text-center"
              style={{
                left: '54.5%',
                top: '51%',
                width: '38%',
                height: '46%',
                transform: 'translate(-50%, -50%)',
              }}
              aria-label={`${petName}'s mug artwork`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeDogImage}
                alt={`${petName}'s artwork on mug`}
                className="w-[78%] h-[78%] object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)] transition-transform duration-300"
              />
              {/* Pet Name underneath artwork */}
              <span className="font-fraunces text-[7.5px] sm:text-[8.5px] font-semibold tracking-wider text-[#2B2723] uppercase mt-0.5 truncate max-w-full leading-tight">
                {petName}
              </span>
            </div>
          </div>

          {/* Micro Tag */}
          <span className="absolute bottom-1 right-1.5 text-[7.5px] font-bold text-[#7A7163] bg-white/90 px-1 py-0.2 rounded backdrop-blur-xs font-jakarta tracking-tight border border-black/5">
            11 oz Ceramic
          </span>
        </div>

        {/* ── Offer Info & Actions ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Coffee size={14} className="text-[--accent] shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-[--text-primary] font-jakarta leading-snug">
              Matching Memorial Ceramic Mug (11 oz)
            </h3>
          </div>

          <p className="text-[11px] text-[--text-secondary] font-jakarta leading-snug mt-1">
            Start each morning with <span className="font-semibold text-[--text-primary]">{petName}</span>&apos;s warm watercolor portrait. Premium glossy ceramic with black accent handle & rim.
          </p>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-2 mb-2">
            <span className="text-sm sm:text-base font-bold text-[--accent] font-jakarta">
              {formatPrice(mugOption.salePrice)}
            </span>
            <span className="text-xs text-[--text-secondary]/70 font-jakarta line-through">
              {formatPrice(mugOption.originalPrice)}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-jakarta">
              SAVE {formatPrice(mugOption.originalPrice - mugOption.salePrice)}
            </span>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[--text-secondary] font-jakarta">
            <span className="inline-flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-[#E8E3DA]">
              <Shield size={10} className="text-emerald-600" />
              Dishwasher Safe
            </span>
            <span className="bg-white/80 px-2 py-0.5 rounded border border-[#E8E3DA]">
              Microwave Safe
            </span>
            <span className="bg-white/80 px-2 py-0.5 rounded border border-[#E8E3DA]">
              Lead & BPA-free
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
            checked={isAdded}
            onChange={handleToggle}
            className="w-4 h-4 rounded accent-[#B88A58] cursor-pointer shrink-0"
            aria-label="Add matching ceramic mug to order"
          />
          <span className="text-xs font-semibold text-[--text-primary] font-jakarta truncate">
            {isAdded ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1 min-w-0 text-[11px] sm:text-xs">
                <Check size={13} strokeWidth={2.5} className="shrink-0" />
                <span className="truncate">Ceramic Mug added ({petName}&apos;s Edition)</span>
              </span>
            ) : (
              <span className="font-bold text-[--text-primary] tracking-tight text-[11px] sm:text-xs">
                + ADD MATCHING MUG (+{formatPrice(mugOption.salePrice)})
              </span>
            )}
          </span>
        </label>

        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            'px-3.5 py-1.5 rounded-lg text-xs font-bold font-jakarta transition-all cursor-pointer border shrink-0',
            isAdded
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              : 'bg-[--accent] text-white border-[--accent] hover:bg-[#A67A49]'
          )}
        >
          {isAdded ? 'Remove' : '+ Add'}
        </button>
      </div>
    </div>
  );
}