'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MapPin, PackageCheck, ShieldCheck, Search, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { LivePreviewCanvas } from '@/components/customizer/LivePreviewCanvas';
import { PackageSelector } from '@/components/customizer/PackageSelector';
import { SaveMemorialDraftModal } from '@/components/customizer/SaveMemorialDraftModal';
import { useCustomizerStore, getPackageSize } from '@/store/useCustomizerStore';
import { useCartStore } from '@/store/useCartStore';
import { trackAddToCart } from '@/lib/analytics';
import { generateId, formatPrice, cn } from '@/lib/utils';
import type { CartItem } from '@/types/ecommerce';
import { BREEDS } from '@/lib/breeds-data';

export function HeroCustomizer() {
  const store = useCustomizerStore();
  const { addItem, openCart } = useCartStore();
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [breedSearch, setBreedSearch] = useState('');
  
  // Validation state
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);

  const filteredBreeds = useMemo(() => {
    const q = breedSearch.trim().toLowerCase();
    if (!q) return BREEDS;
    return BREEDS.filter((b) => b.name.toLowerCase().includes(q));
  }, [breedSearch]);

  const isValid = store.breed !== null && store.petName.trim().length > 0;

  const handleAddToCart = () => {
    setHasTriedSubmit(true);

    if (!store.breed) {
      step1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (store.petName.trim().length === 0) {
      step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const resolvedSize = getPackageSize(store.selectedPackage);
    const coatObj = store.breed.coats?.find((c) => c.slug === store.selectedCoat);
    const coatLabel = coatObj ? ` · ${coatObj.label}` : '';
    const item: CartItem = {
      id: generateId(),
      productTitle: `Memorial Canvas (${resolvedSize.replace('x', '×')}")${coatLabel}`,
      productType: 'museum-canvas',
      breed: store.breed,
      selectedCoat: store.selectedCoat || undefined,
      petName: store.petName.trim(),
      dateRange: store.dateRange.trim(),
      quote: '', // Kept for type compatibility
      size: resolvedSize,
      frameStyle: 'none',
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
    
    // Success UX
    setHasTriedSubmit(false);
  };

  const springDefault = { type: "spring" as const, stiffness: 350, damping: 25 };

  return (
    <section id="hero-customizer-section" className="w-full bg-[--bg-page] py-10 lg:py-20" aria-label="Memorial Art Customizer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* ── Left Column: Live Preview (Sticky on Desktop) ────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-center gap-6">
            <LivePreviewCanvas onEmailPreview={() => setIsDraftModalOpen(true)} />
          </div>

          {/* ── Right Column: Single-Column Customization Panel ────── */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Editorial Heading */}
            <div className="mb-10 lg:mb-12">
              <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl text-[--text-primary] font-normal leading-[1.25] tracking-tight mb-4">
                Create Their{' '}
                <span className="italic font-normal text-[--accent] inline-block ml-1">
                  Forever Portrait
                </span>
              </h1>
              <p className="text-base text-[--text-secondary] font-jakarta leading-relaxed max-w-xl">
                Handcrafted watercolor art personalized for your beloved companion. Museum-grade quality, made in the USA.
              </p>
            </div>

            {/* Customizer Panel */}
            <div className="bg-white rounded-2xl border border-[--border-default] p-5 sm:p-8 shadow-sm">
              
              {/* Step 1: Choose Your Dog's Breed */}
              <div id="step-1-breed" ref={step1Ref} className="pb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-5 h-5 rounded-full bg-[--accent] text-white text-[11px] font-bold font-jakarta flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[--text-primary] font-jakarta">
                    Choose Your Dog's Breed
                  </h2>
                </div>

                <div className="relative mb-4">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[--text-secondary] pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    placeholder="Search breeds (e.g. Golden Retriever)..."
                    value={breedSearch}
                    onChange={(e) => setBreedSearch(e.target.value)}
                    className={cn(
                      "w-full h-12 pl-10 pr-4 rounded-lg border bg-white text-sm font-jakarta text-[--text-primary] placeholder:text-[--text-secondary]/70 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--accent]/30",
                      hasTriedSubmit && !store.breed ? "border-[--error]" : "border-[--border-default] focus:border-[--accent]"
                    )}
                    aria-label="Search dog breeds"
                  />
                </div>

                {hasTriedSubmit && !store.breed && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-[--error] font-jakarta flex items-center gap-1.5 mb-3">
                    <AlertCircle size={14} /> Please select your dog's breed
                  </motion.p>
                )}

                <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar" role="radiogroup" aria-label="Select breed">
                  {filteredBreeds.map((b) => {
                    const isSelected = store.breed?.id === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => store.setBreed(b)}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium font-jakarta transition-all cursor-pointer border outline-none focus-visible:ring-2 focus-visible:ring-[--accent]',
                          isSelected
                            ? 'bg-[--bg-page] text-[--text-primary] border-2 border-[--accent]'
                            : 'bg-white text-[--text-secondary] border-[--border-default] hover:border-[--accent]/60 hover:text-[--text-primary]'
                        )}
                      >
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springDefault}>
                            <Check size={14} strokeWidth={2.5} className="text-[--accent]" />
                          </motion.div>
                        )}
                        <span>{b.name}</span>
                      </button>
                    );
                  })}
                </div>

                {filteredBreeds.length === 0 && (
                  <p className="text-sm text-[--text-secondary] py-3 font-jakarta border border-dashed border-[--border-default] rounded-lg text-center mt-2">
                    Mixed breed / Not sure? Choose the closest match.
                  </p>
                )}

                {/* Coat / Color Variation Selector (for breeds with multiple coats) */}
                <AnimatePresence>
                  {store.breed?.coats && store.breed.coats.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-5 pt-4 border-t border-[--border-default]/80 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[12px] font-bold uppercase tracking-[0.06em] text-[--text-primary] font-jakarta">
                          Coat Color / Pelagem
                        </label>
                        <span className="text-xs font-medium text-[--accent] font-jakarta">
                          {store.breed.coats.find((c) => c.slug === store.selectedCoat)?.label || ''}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select coat color">
                        {store.breed.coats.map((coat) => {
                          const isCoatSelected = store.selectedCoat === coat.slug;
                          return (
                            <button
                              key={coat.slug}
                              type="button"
                              role="radio"
                              aria-checked={isCoatSelected}
                              onClick={() => store.setCoat(coat.slug)}
                              className={cn(
                                'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-jakarta transition-all cursor-pointer border outline-none',
                                isCoatSelected
                                  ? 'bg-[--bg-page] text-[--text-primary] border-2 border-[--accent] shadow-sm ring-1 ring-[--accent]/30'
                                  : 'bg-white text-[--text-secondary] border-[--border-default] hover:border-[--accent]/60 hover:text-[--text-primary]'
                              )}
                            >
                              <span className="w-5 h-5 rounded-full overflow-hidden border border-[--border-default] shrink-0 bg-[#FAF8F5] flex items-center justify-center">
                                <img
                                  src={coat.image}
                                  alt={coat.label}
                                  className="w-full h-full object-contain"
                                />
                              </span>
                              <span>{coat.label}</span>
                              {isCoatSelected && (
                                <Check size={13} strokeWidth={2.5} className="text-[--accent]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 2: Pet Details */}
              <div id="step-2-details" ref={step2Ref} className="pt-7 pb-8 border-t border-[--border-default]">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-5 h-5 rounded-full bg-[--accent] text-white text-[11px] font-bold font-jakarta flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[--text-primary] font-jakarta">
                    Personalize Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pet-name" className="text-[13px] font-medium uppercase tracking-[0.06em] text-[--text-secondary] mb-2 block font-jakarta">
                      Pet's Name
                    </label>
                    <motion.div animate={hasTriedSubmit && !store.petName.trim() ? { x: [-2, 2, -2, 2, 0] } : {}} transition={{ duration: 0.3 }}>
                      <input
                        id="pet-name"
                        type="text"
                        placeholder="e.g. Cooper"
                        value={store.petName}
                        onChange={(e) => store.setPetName(e.target.value)}
                        maxLength={20}
                        className={cn(
                          "w-full h-12 px-4 rounded-lg border bg-white text-base font-jakarta text-[--text-primary] placeholder:text-[--text-secondary]/60 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--accent]/30",
                          hasTriedSubmit && !store.petName.trim() ? "border-[--error]" : "border-[--border-default] focus:border-[--accent]"
                        )}
                      />
                    </motion.div>
                    {hasTriedSubmit && !store.petName.trim() && (
                      <p className="text-sm text-[--error] font-jakarta mt-1.5 flex items-center gap-1.5">
                        <AlertCircle size={14} /> Please enter a name
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="pet-dates" className="text-[13px] font-medium uppercase tracking-[0.06em] text-[--text-secondary] mb-2 block font-jakarta">
                      Years / Dates
                    </label>
                    <input
                      id="pet-dates"
                      type="text"
                      placeholder="e.g. 2014 — 2024"
                      value={store.dateRange}
                      onChange={(e) => store.setDateRange(e.target.value)}
                      maxLength={30}
                      className="w-full h-12 px-4 rounded-lg border border-[--border-default] bg-white text-base font-jakarta text-[--text-primary] placeholder:text-[--text-secondary]/60 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--accent]/30 focus:border-[--accent]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Packages */}
              <PackageSelector />

              {/* Step 4: Primary Action & Trust */}
              <div className="pt-8 border-t border-[--border-default] flex flex-col gap-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={hasTriedSubmit && !isValid}
                  className={cn(
                    "w-full h-14 rounded-lg font-semibold font-jakarta text-[15px] flex items-center justify-center gap-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--accent] focus-visible:ring-offset-2",
                    isValid || !hasTriedSubmit
                      ? "bg-[#B88A58] hover:bg-[#A67A49] text-white cursor-pointer active:scale-[0.98]"
                      : "bg-[#EBE6DE] text-[#6B6156] cursor-not-allowed opacity-70"
                  )}
                  aria-disabled={hasTriedSubmit && !isValid}
                >
                  <ShoppingBag size={18} aria-hidden="true" />
                  Add to Cart • 
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={store.unitPrice}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="inline-block min-w-[2.5rem] text-left"
                    >
                      {formatPrice(store.unitPrice)}
                    </motion.span>
                  </AnimatePresence>
                </button>

                {/* Sentinel for mobile sticky cta */}
                <div id="hero-cta-sentinel" className="sr-only" aria-hidden="true" />

                {/* Trust Line */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-[--border-default]/50">
                  <div className="flex flex-col items-center justify-center gap-1.5 text-center text-xs text-[--text-secondary] font-jakarta">
                    <MapPin size={16} strokeWidth={1.5} />
                    <span>Made in USA</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1.5 text-center text-xs text-[--text-secondary] font-jakarta">
                    <PackageCheck size={16} strokeWidth={1.5} />
                    <span>Ready to Hang</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1.5 text-center text-xs text-[--text-secondary] font-jakarta">
                    <ShieldCheck size={16} strokeWidth={1.5} />
                    <span>Free Replacement</span>
                  </div>
                </div>
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
