'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Coffee, Key, ShieldCheck, Heart } from 'lucide-react';
import { useCartStore, ORDER_BUMP_OPTIONS } from '@/store/useCartStore';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { formatPrice, cn } from '@/lib/utils';
import type { OrderBumpType } from '@/types/ecommerce';

interface ExitIntentDownsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (type: OrderBumpType) => void;
}

export function ExitIntentDownsellModal({
  isOpen,
  onClose,
  onAccept,
}: ExitIntentDownsellModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedType, setSelectedType] = useState<OrderBumpType>('mug');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const cartItems = useCartStore((s) => s.items);
  const customizerPetName = useCustomizerStore((s) => s.petName);
  const customizerBreed = useCustomizerStore((s) => s.breed);
  const customizerCoat = useCustomizerStore((s) => s.selectedCoat);

  const firstItem = cartItems[0];
  const petName = firstItem?.petName || customizerPetName || 'Your Pet';
  const breed = firstItem?.breed || customizerBreed;
  const selectedCoat = firstItem?.selectedCoat || customizerCoat;

  const activeDogImage = selectedCoat
    ? `/breeds/${selectedCoat}.webp`
    : breed?.image || (breed ? `/breeds/${breed.slug}.webp` : '/breeds/french-bulldog-fawn.webp');

  const isMug = selectedType === 'mug';
  const currentOption = ORDER_BUMP_OPTIONS[selectedType] || ORDER_BUMP_OPTIONS.mug;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="downsell-title"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-[--border-default] z-10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close special offer modal"
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-[--text-secondary] hover:bg-black/10 hover:text-[--text-primary] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Top Banner Accent */}
            <div className="bg-gradient-to-r from-[#2B241D] via-[#3A3127] to-[#2B241D] px-6 py-3 text-center text-white">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase font-jakarta text-[#E2C499]">
                <Heart size={12} className="fill-[#E2C499]" />
                Special Memorial Tribute • Limited Time Offer
              </span>
            </div>

            <div className="p-6 sm:p-8">
              {/* Header copy */}
              <div className="text-center mb-5">
                <h3
                  id="downsell-title"
                  className="font-fraunces text-2xl sm:text-3xl text-[--text-primary] font-normal leading-tight tracking-tight"
                >
                  Keep {petName}&apos;s Memory Close — Without the Gallery Price
                </h3>
                <p className="font-jakarta text-xs sm:text-sm text-[--text-secondary] mt-2 leading-relaxed max-w-md mx-auto">
                  {isMug
                    ? `We understand a fine-art canvas might not fit right now. Keep ${petName}'s loving spirit right beside you every morning for just `
                    : `We understand a fine-art canvas might not fit right now. Carry ${petName}'s loving spirit everywhere you go for just `}
                  <strong className="text-[--text-primary] font-semibold">{formatPrice(currentOption.salePrice)}</strong>.
                </p>
              </div>

              {/* Switcher Pills: Mug vs Keyring */}
              <div className="flex items-center gap-1.5 p-1 bg-[#F5F1EB] rounded-2xl mb-5 border border-[#E8E2D7]">
                <button
                  type="button"
                  onClick={() => setSelectedType('mug')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold font-jakarta transition-all cursor-pointer',
                    isMug
                      ? 'bg-white text-[--text-primary] shadow-sm border border-black/5'
                      : 'text-[--text-secondary] hover:text-[--text-primary]'
                  )}
                >
                  <Coffee size={14} className={isMug ? 'text-[--accent]' : 'text-muted'} />
                  <span>Ceramic Mug ({formatPrice(ORDER_BUMP_OPTIONS.mug.salePrice)})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType('keyring')}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold font-jakarta transition-all cursor-pointer',
                    !isMug
                      ? 'bg-white text-[--text-primary] shadow-sm border border-black/5'
                      : 'text-[--text-secondary] hover:text-[--text-primary]'
                  )}
                >
                  <Key size={14} className={!isMug ? 'text-[--accent]' : 'text-muted'} />
                  <span>Keyring ({formatPrice(ORDER_BUMP_OPTIONS.keyring.salePrice)})</span>
                </button>
              </div>

              {/* Photorealistic Product Preview */}
              <div className="relative w-full h-52 sm:h-56 rounded-2xl bg-gradient-to-b from-[#FAF8F5] to-[#EFECE5] border border-[#E2DDD3] flex items-center justify-center overflow-hidden shadow-inner p-3 sm:p-4 mb-5">
                <AnimatePresence mode="wait">
                  {isMug ? (
                    /* ── Ceramic Mug Preview ────────────────────────────── */
                    <motion.div
                      key="mug-preview"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      {/* Aspect-square wrapper locked strictly to 1:1 image pixels */}
                      <div className="relative h-full aspect-square flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/mugs/mug-mockup.webp"
                          alt={`${petName}'s Memorial Mug`}
                          className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                        />

                        {/* Printed Dog Artwork on the Cylindrical Face */}
                        <div
                          className="absolute flex flex-col items-center justify-center pointer-events-none text-center"
                          style={{
                            left: '54.5%',
                            top: '51%',
                            width: '38%',
                            height: '46%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={activeDogImage}
                            alt={`${petName}'s portrait`}
                            className="w-[82%] h-[82%] object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
                          />
                          <span className="font-fraunces text-[9px] sm:text-[10px] font-semibold tracking-wider text-[#2B2723] uppercase mt-0.5 truncate max-w-full leading-tight">
                            {petName}
                          </span>
                        </div>
                      </div>

                      <span className="absolute bottom-2 right-2 text-[9px] font-bold text-[#7A7163] bg-white/90 px-2 py-0.5 rounded-full backdrop-blur-xs font-jakarta tracking-tight border border-black/5 shadow-xs">
                        11 oz Glossy Ceramic
                      </span>
                    </motion.div>
                  ) : (
                    /* ── Keepsake Keyring Preview ───────────────────────── */
                    <motion.div
                      key="keyring-preview"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      {/* Aspect-[567/597] wrapper locked strictly to keyring image pixels */}
                      <div className="relative h-full aspect-[567/597] flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/keyring/keyring-mockup.webp"
                          alt={`${petName}'s Memorial Keyring`}
                          className="w-full h-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.22)]"
                        />

                        {/* Circular Medallion Mask - mathematically true circle matching metallic recess */}
                        <div
                          className="absolute rounded-full overflow-hidden flex items-center justify-center pointer-events-none bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)]"
                          style={{
                            left: '44.8%',
                            top: '65.6%',
                            width: '38.8%',
                            height: '36.9%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={activeDogImage}
                            alt={`${petName}'s portrait`}
                            className="w-[90%] h-[90%] object-contain rounded-full filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                          />
                          <div
                            className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-tr from-black/15 via-transparent to-white/45 opacity-80"
                            aria-hidden="true"
                          />
                        </div>
                      </div>

                      <span className="absolute bottom-2 right-2 text-[9px] font-bold text-[#7A7163] bg-white/90 px-2 py-0.5 rounded-full backdrop-blur-xs font-jakarta tracking-tight border border-black/5 shadow-xs">
                        Solid Stainless Steel
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Pricing & Value Proof */}
              <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-xl border border-[--border-default] mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold font-jakarta text-[--accent]">
                    {formatPrice(currentOption.salePrice)}
                  </span>
                  <span className="text-sm text-[--text-secondary]/70 font-jakarta line-through">
                    {formatPrice(currentOption.originalPrice)}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-jakarta">
                    SAVE {formatPrice(currentOption.originalPrice - currentOption.salePrice)}
                  </span>
                </div>

                <span className="text-[11px] font-medium font-jakarta text-[--text-secondary]">
                  +$9.46 Tracked US Shipping
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => onAccept(selectedType)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#2B241D] text-white hover:bg-[#1C1712] font-jakarta font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <Sparkles size={16} className="text-[#E2C499]" />
                <span>
                  Yes, Switch to {petName}&apos;s {isMug ? 'Memorial Mug' : 'Keyring'} ({formatPrice(currentOption.salePrice)})
                </span>
              </button>

              {/* Secondary Link: Dismiss without changing */}
              <div className="flex flex-col items-center gap-2 mt-4 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[--text-secondary] hover:text-[--text-primary] font-jakarta underline underline-offset-4 cursor-pointer transition-colors"
                >
                  No thanks, keep my canvas order
                </button>

                <div className="flex items-center gap-1.5 text-[10px] text-[--text-secondary]/80 font-jakarta mt-1">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span>100% Lifetime Memory Guarantee • Handcrafted in the USA</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
