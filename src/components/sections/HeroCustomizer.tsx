'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ShoppingBag, Search, Check, Lock, Package, Quote } from 'lucide-react';
import { LivePreviewCanvas } from '@/components/customizer/LivePreviewCanvas';
import { SizeMaterialSelector } from '@/components/customizer/SizeMaterialSelector';
import { SaveMemorialDraftModal } from '@/components/customizer/SaveMemorialDraftModal';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { useCartStore } from '@/store/useCartStore';
import { trackAddToCart } from '@/lib/analytics';
import { generateId, formatPrice, cn } from '@/lib/utils';
import type { CartItem } from '@/types/ecommerce';
import { BREEDS, MEMORIAL_QUOTES } from '@/lib/breeds-data';

export function HeroCustomizer() {
  const store = useCustomizerStore();
  const { addItem, openCart } = useCartStore();
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [breedSearch, setBreedSearch] = useState('');
  const [showQuotes, setShowQuotes] = useState(false);

  // Filtered breeds based on search
  const filteredBreeds = useMemo(() => {
    const q = breedSearch.trim().toLowerCase();
    if (!q) return BREEDS;
    return BREEDS.filter((b) => b.name.toLowerCase().includes(q));
  }, [breedSearch]);

  const activeQuote =
    store.selectedQuoteId === 'custom'
      ? store.customQuote
      : MEMORIAL_QUOTES.find((q) => q.id === store.selectedQuoteId)?.text ?? '';

  const handleAddToCart = () => {
    if (!store.breed) {
      toast.error("Please choose your dog's breed first 🐾", {
        description: 'Select your breed from Step 1 above.',
      });
      // Scroll to Step 1 smoothly
      document.getElementById('step-1-breed')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const petDisplayName = store.petName.trim() || store.breed.name;

    const item: CartItem = {
      id: generateId(),
      productTitle: `${store.productType === 'framed-print' ? 'Framed Fine Art Print' : 'Museum Canvas'}`,
      productType: store.productType,
      breed: store.breed,
      petName: store.petName.trim(),
      dateRange: store.dateRange.trim(),
      quote: activeQuote,
      size: store.size,
      frameStyle: store.frameStyle,
      quantity: 1,
      unitPrice: store.unitPrice,
    };

    addItem(item);
    openCart();
    trackAddToCart({
      value: store.unitPrice,
      currency: 'USD',
      items: [{ id: item.id, name: `${store.breed.name} Memorial Canvas`, price: store.unitPrice, quantity: 1 }],
    });
    toast.success('Added to your order 🐾', {
      description: `${petDisplayName} • ${store.size.replace('x', '×')}" ${store.productType === 'museum-canvas' ? 'Canvas' : 'Framed Print'}`,
    });
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-12 md:py-20" aria-label="Memorial Art Customizer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ── Left Column: Live Preview (Sticky on Desktop) ────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-xs font-jakarta uppercase tracking-widest text-[#736E65] mb-1.5 font-semibold">
                Your memorial, museum-quality
              </p>
              <h2 className="font-fraunces text-2xl lg:text-3xl text-[#242424] font-light italic">
                See it come to life
              </h2>
            </div>

            <LivePreviewCanvas onEmailPreview={() => setIsDraftModalOpen(true)} />

            {/* Quality trust strip */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 justify-center">
              {['300 DPI Archival Print', 'Gallery UV Coating', 'Solid Wood Frame'].map((feat) => (
                <span key={feat} className="text-xs text-[#879788] font-jakarta flex items-center gap-1 font-medium">
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right Column: Single-Column Customization Panel ────── */}
          <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-[#EBE6DE] p-6 sm:p-8 shadow-xs">
            
            {/* Header with fixed font collision */}
            <div className="mb-8 pt-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#B88A58] font-jakarta mb-2">
                Personalized Memorial Studio
              </p>
              <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-[42px] text-[#242424] font-normal leading-[1.3] tracking-normal pt-1 mb-2">
                Create Their{' '}
                <span className="italic font-normal text-[#B88A58] inline-block ml-1">
                  Forever Portrait
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[#736E65] font-jakarta leading-relaxed">
                Handcrafted watercolor art personalized for your beloved companion. Museum-grade archival quality, printed &amp; assembled in the USA.
              </p>
            </div>

            {/* Step 1: Choose Your Dog's Breed */}
            <div id="step-1-breed" className="pb-7">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#B88A58] text-white text-xs font-bold font-jakarta flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#242424] font-jakarta">
                    Choose Your Dog's Breed
                  </h3>
                </div>
                {store.breed && (
                  <span className="text-xs text-[#879788] font-bold font-jakarta flex items-center gap-1">
                    <Check size={13} strokeWidth={3} /> {store.breed.name}
                  </span>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative mb-3">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736E65] pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Search breeds (e.g. Golden Retriever, Labrador, Beagle)..."
                  value={breedSearch}
                  onChange={(e) => setBreedSearch(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#EBE6DE] bg-white text-sm font-jakarta text-[#242424] placeholder:text-[#736E65]/60 focus:outline-none focus:ring-2 focus:ring-[#B88A58]/20 focus:border-[#B88A58] transition-all"
                  aria-label="Search dog breeds"
                />
              </div>

              {/* Scrollable Breed Pill / Tag Grid */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredBreeds.map((b) => {
                  const isSelected = store.breed?.id === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => store.setBreed(b)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium font-jakarta transition-all cursor-pointer border',
                        isSelected
                          ? 'bg-[#B88A58] text-white border-[#B88A58] shadow-xs'
                          : 'bg-white text-[#242424] border-[#EBE6DE] hover:border-[#B88A58]/60 hover:bg-[#FAF8F5]'
                      )}
                      aria-pressed={isSelected}
                    >
                      <svg viewBox="0 0 200 200" className="w-3.5 h-3.5 shrink-0" fill="none">
                        <path d={b.svgPath} fill={isSelected ? '#ffffff' : '#736E65'} />
                      </svg>
                      <span>{b.name}</span>
                      {isSelected && <Check size={12} strokeWidth={3} className="ml-0.5" />}
                    </button>
                  );
                })}
              </div>

              {filteredBreeds.length === 0 && (
                <p className="text-xs text-[#736E65] py-2 font-jakarta">
                  No breed found matching "{breedSearch}". Try searching another name or reset search.
                </p>
              )}
            </div>

            {/* Step 2: Pet Details */}
            <div className="pt-7 pb-7 border-t border-[#EBE6DE]">
              <div className="flex items-center gap-2.5 mb-3.5">
                <span className="w-6 h-6 rounded-full bg-[#B88A58] text-white text-xs font-bold font-jakarta flex items-center justify-center shrink-0">
                  2
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#242424] font-jakarta">
                  Pet Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E65] mb-2 block font-jakarta">
                    Pet's Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cooper"
                    value={store.petName}
                    onChange={(e) => store.setPetName(e.target.value)}
                    maxLength={30}
                    className="w-full h-12 px-4 rounded-xl border border-[#EBE6DE] bg-white text-sm font-jakarta text-[#242424] placeholder:text-[#736E65]/50 focus:outline-none focus:ring-2 focus:ring-[#B88A58]/20 focus:border-[#B88A58] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#736E65] mb-2 block font-jakarta">
                    Years of Life / Memorial Dates
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2014 — 2024"
                    value={store.dateRange}
                    onChange={(e) => store.setDateRange(e.target.value)}
                    maxLength={30}
                    className="w-full h-12 px-4 rounded-xl border border-[#EBE6DE] bg-white text-sm font-jakarta text-[#242424] placeholder:text-[#736E65]/50 focus:outline-none focus:ring-2 focus:ring-[#B88A58]/20 focus:border-[#B88A58] transition-all"
                  />
                </div>
              </div>

              {/* Optional Tribute Quote Selector Accordion */}
              <div className="mt-3.5">
                <button
                  type="button"
                  onClick={() => setShowQuotes(!showQuotes)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B88A58] hover:text-[#A37747] font-jakarta transition-colors cursor-pointer"
                >
                  <Quote size={12} />
                  {showQuotes ? 'Hide tribute quotes' : 'Choose or edit tribute quote (optional)'}
                </button>

                <AnimatePresence>
                  {showQuotes && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-2 mt-3 pt-3 border-t border-[#EBE6DE]"
                    >
                      {MEMORIAL_QUOTES.slice(0, 4).map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => store.setQuote(q.id)}
                          className={cn(
                            'text-left p-3 rounded-xl border text-xs font-fraunces italic transition-all cursor-pointer',
                            store.selectedQuoteId === q.id
                              ? 'border-[#B88A58] bg-[#FAF8F5] text-[#242424] ring-1 ring-[#B88A58]'
                              : 'border-[#EBE6DE] bg-white text-[#736E65] hover:border-[#B88A58]/50'
                          )}
                        >
                          "{q.text}"
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Step 3: Print Format & Size */}
            <div className="pt-7 pb-7 border-t border-[#EBE6DE]">
              <div className="flex items-center gap-2.5 mb-3.5">
                <span className="w-6 h-6 rounded-full bg-[#B88A58] text-white text-xs font-bold font-jakarta flex items-center justify-center shrink-0">
                  3
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#242424] font-jakarta">
                  Print Format &amp; Size
                </h3>
              </div>

              <SizeMaterialSelector />
            </div>

            {/* Step 4: Primary Action */}
            <div className="pt-7 border-t border-[#EBE6DE] flex flex-col gap-3.5">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full h-14 rounded-xl bg-[#B88A58] hover:bg-[#A37747] text-white font-medium font-jakarta text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <ShoppingBag size={18} aria-hidden="true" />
                Add to Cart • {formatPrice(store.unitPrice)}
              </button>

              {/* Sentinel element for mobile sticky bar */}
              <div id="hero-cta-sentinel" className="sr-only" aria-hidden="true" />

              {/* Express checkout indicators */}
              <div className="flex items-center gap-2 pt-1">
                <div className="h-px flex-1 bg-[#EBE6DE]" />
                <span className="text-[10px] text-[#736E65] font-jakarta uppercase tracking-wider">or express checkout with</span>
                <div className="h-px flex-1 bg-[#EBE6DE]" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-[#EBE6DE] bg-white text-xs font-semibold font-jakarta text-[#242424]">
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M17.5 12.5c0-1.9-1.6-3.5-3.5-3.5H8V19h2v-3h4c1.9 0 3.5-1.6 3.5-3.5zM10 14v-3h4c.8 0 1.5.7 1.5 1.5S14.8 14 14 14h-4zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="currentColor"/></svg>
                  Apple Pay
                </div>
                <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-[#EBE6DE] bg-white text-xs font-semibold font-jakarta text-[#242424]">
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="currentColor"/></svg>
                  Google Pay
                </div>
              </div>

              {/* Trust micro-copy */}
              <div className="flex flex-col gap-1.5 pt-2">
                <p className="text-[11px] text-[#736E65] font-jakarta flex items-center gap-1.5 justify-center">
                  <Package size={12} aria-hidden="true" />
                  🇺🇸 Printed &amp; Assembled in the USA · Arrives in 4-6 business days
                </p>
                <p className="text-[11px] text-[#736E65] font-jakarta flex items-center gap-1.5 justify-center">
                  <Lock size={12} aria-hidden="true" />
                  100% Lifetime Memory Guarantee · 256-bit Encrypted Checkout
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <SaveMemorialDraftModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
      />
    </section>
  );
}
