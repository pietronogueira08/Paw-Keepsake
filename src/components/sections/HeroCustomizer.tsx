'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { MapPin, PackageCheck, ShieldCheck, Search, Check, AlertCircle, ShoppingBag, ChevronDown, X } from 'lucide-react';
import { LivePreviewCanvas } from '@/components/customizer/LivePreviewCanvas';
import { PackageSelector } from '@/components/customizer/PackageSelector';
import { SaveMemorialDraftModal } from '@/components/customizer/SaveMemorialDraftModal';
import { useCustomizerStore, getPackageSize } from '@/store/useCustomizerStore';
import { useCartStore } from '@/store/useCartStore';
import { trackAddToCart } from '@/lib/analytics';
import { generateId, formatPrice, cn } from '@/lib/utils';
import type { CartItem } from '@/types/ecommerce';
import { BREEDS } from '@/lib/breeds-data';

const PRESET_QUOTES = [
  'No longer by my side, but forever in my heart.',
  'You were my favorite hello and my hardest goodbye.',
  'Forever running free, always loved.',
  'Until one has loved an animal, a part of one\'s soul remains unawakened.',
];

const TOP_5_BREEDS: { id: string; name: string }[] = [
  { id: 'golden-retriever', name: 'Golden Retriever' },
  { id: 'labrador-retriever', name: 'Labrador' },
  { id: 'french-bulldog', name: 'French Bulldog' },
  { id: 'german-shepherd', name: 'German Shepherd' },
  { id: 'pembroke-welsh-corgi', name: 'Corgi' },
];

const TOP_5_BREED_IDS = TOP_5_BREEDS.map((b) => b.id);

export function HeroCustomizer() {
  const store = useCustomizerStore();
  const { addItem, openCart } = useCartStore();
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [breedSearch, setBreedSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCustomQuote, setIsCustomQuote] = useState(() => {
    return !PRESET_QUOTES.includes(store.quote) && store.quote.length > 0;
  });
  
  // Validation state
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search autocomplete dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBreeds = useMemo(() => {
    const q = breedSearch.trim().toLowerCase();
    if (!q) return [];
    return BREEDS.filter((b) => b.name.toLowerCase().includes(q));
  }, [breedSearch]);

  const otherBreeds = useMemo(() => {
    return BREEDS.filter((b) => !TOP_5_BREED_IDS.includes(b.id)).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, []);

  const isTop5Selected = store.breed ? TOP_5_BREED_IDS.includes(store.breed.id) : false;

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
      quote: store.quote.trim(),
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
    <section id="hero-customizer-section" className="w-full bg-[--bg-page] py-8 lg:py-14" aria-label="Memorial Art Customizer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* ── Left Column: Live Preview (Sticky on Desktop) ────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col items-center gap-6">
            <LivePreviewCanvas onEmailPreview={() => setIsDraftModalOpen(true)} />
          </div>

          {/* ── Right Column: Single-Column Customization Panel ────── */}
          <div className="lg:col-span-7 flex flex-col">
            
            {/* Editorial Heading */}
            <div className="mb-6 lg:mb-8">
              <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl text-[--text-primary] font-normal leading-[1.25] tracking-tight mb-3">
                Create Their{' '}
                <span className="italic font-normal text-[--accent] inline-block ml-1">
                  Forever Portrait
                </span>
              </h1>
              <p className="text-sm sm:text-base text-[--text-secondary] font-jakarta leading-relaxed max-w-xl">
                Handcrafted watercolor art personalized for your beloved companion. Museum-grade quality, made in the USA.
              </p>
            </div>

            {/* Customizer Panel */}
            <div className="bg-white rounded-2xl border border-[--border-default] p-5 sm:p-6 shadow-sm">
              
              {/* Step 1: Choose Your Dog's Breed */}
              <div id="step-1-breed" ref={step1Ref} className="pb-5">
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="w-5 h-5 rounded-full bg-[--accent] text-white text-[11px] font-bold font-jakarta flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[--text-primary] font-jakarta">
                    Choose Your Dog's Breed
                  </h2>
                </div>

                {/* Search input with autocomplete dropdown */}
                <div ref={searchContainerRef} className="relative mb-3">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[--text-secondary] pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    placeholder="Search all 30+ dog breeds..."
                    value={breedSearch}
                    onFocus={() => setIsSearchOpen(true)}
                    onChange={(e) => {
                      setBreedSearch(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    className={cn(
                      "w-full h-11 pl-10 pr-9 rounded-lg border bg-white text-xs sm:text-sm font-jakarta text-[--text-primary] placeholder:text-[--text-secondary]/70 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--accent]/30",
                      hasTriedSubmit && !store.breed ? "border-[--error]" : "border-[--border-default] focus:border-[--accent]"
                    )}
                    aria-label="Search dog breeds"
                  />
                  {breedSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setBreedSearch('');
                        setIsSearchOpen(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-secondary] hover:text-[--text-primary] p-0.5 rounded-full"
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {/* Autocomplete dropdown */}
                  {isSearchOpen && breedSearch.trim().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-30 bg-white rounded-xl border border-[--border-default] shadow-xl max-h-52 overflow-y-auto custom-scrollbar py-1 divide-y divide-[--border-default]/40">
                      {filteredBreeds.length > 0 ? (
                        filteredBreeds.map((b) => {
                          const isSelected = store.breed?.id === b.id;
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                store.setBreed(b);
                                setBreedSearch('');
                                setIsSearchOpen(false);
                              }}
                              className={cn(
                                "w-full px-3.5 py-2.5 text-left text-xs sm:text-sm font-jakarta flex items-center justify-between hover:bg-[--bg-page] transition-colors cursor-pointer",
                                isSelected ? "text-[--accent] font-semibold bg-[--bg-page]" : "text-[--text-primary]"
                              )}
                            >
                              <span>{b.name}</span>
                              {isSelected && <Check size={14} className="text-[--accent]" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-xs text-[--text-secondary] font-jakarta text-center">
                          No matching breed found. Choose closest match or pick below.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {hasTriedSubmit && !store.breed && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-[--error] font-jakarta flex items-center gap-1.5 mb-2.5">
                    <AlertCircle size={14} /> Please select your dog's breed
                  </motion.p>
                )}

                {/* Top 5 Popular Quick-Tags */}
                <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Popular dog breeds">
                  {TOP_5_BREEDS.map((b) => {
                    const isSelected = store.breed?.id === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          const breedObj = BREEDS.find((item) => item.id === b.id);
                          if (breedObj) store.setBreed(breedObj);
                        }}
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium font-jakarta transition-all cursor-pointer border outline-none focus-visible:ring-2 focus-visible:ring-[--accent]',
                          isSelected
                            ? 'bg-[--bg-page] text-[--text-primary] border-2 border-[--accent] shadow-xs font-semibold'
                            : 'bg-white text-[--text-secondary] border-[--border-default] hover:border-[--accent]/60 hover:text-[--text-primary]'
                        )}
                      >
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={springDefault}>
                            <Check size={13} strokeWidth={2.5} className="text-[--accent]" />
                          </motion.div>
                        )}
                        <span>{b.name}</span>
                      </button>
                    );
                  })}

                  {/* Active indicator if a non-top-5 breed is selected */}
                  {store.breed && !TOP_5_BREED_IDS.includes(store.breed.id) && (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold font-jakarta bg-[--bg-page] text-[--text-primary] border-2 border-[--accent] shadow-xs">
                      <Check size={13} strokeWidth={2.5} className="text-[--accent]" />
                      <span>{store.breed.name}</span>
                    </div>
                  )}
                </div>

                {/* Dropdown for other 25+ breeds */}
                <div className="relative mt-2.5">
                  <select
                    id="other-breeds-select"
                    value={isTop5Selected ? '' : store.breed?.id ?? ''}
                    onChange={(e) => {
                      const found = BREEDS.find((b) => b.id === e.target.value);
                      if (found) store.setBreed(found);
                    }}
                    className={cn(
                      "w-full h-10 pl-3 pr-9 rounded-lg border text-xs sm:text-sm font-jakarta transition-all outline-none appearance-none cursor-pointer",
                      !isTop5Selected && store.breed
                        ? "bg-[--bg-page] border-2 border-[--accent] text-[--text-primary] font-medium"
                        : "bg-white border-[--border-default] text-[--text-secondary] hover:border-[--accent]/60 focus:border-[--accent]"
                    )}
                    aria-label="Select from all other dog breeds"
                  >
                    <option value="" disabled>
                      {!isTop5Selected && store.breed
                        ? `Selected: ${store.breed.name}`
                        : 'Or choose from 25+ other breeds...'}
                    </option>
                    {otherBreeds.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-secondary] pointer-events-none" />
                </div>

                {/* Coat / Color Variation Selector (for breeds with multiple coats) */}
                <AnimatePresence>
                  {store.breed?.coats && store.breed.coats.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3.5 pt-3.5 border-t border-[--border-default]/80 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-[--text-primary] font-jakarta">
                          Coat Color / Variation
                        </label>
                        <span className="text-xs font-medium text-[--accent] font-jakarta">
                          {store.breed.coats.find((c) => c.slug === store.selectedCoat)?.label || ''}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Select coat color">
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
                                'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium font-jakarta transition-all cursor-pointer border outline-none',
                                isCoatSelected
                                  ? 'bg-[--bg-page] text-[--text-primary] border-2 border-[--accent] shadow-xs ring-1 ring-[--accent]/30'
                                  : 'bg-white text-[--text-secondary] border-[--border-default] hover:border-[--accent]/60 hover:text-[--text-primary]'
                              )}
                            >
                              <span className="w-4 h-4 rounded-full overflow-hidden border border-[--border-default] shrink-0 bg-[#FAF8F5] flex items-center justify-center">
                                <img
                                  src={coat.image}
                                  alt={coat.label}
                                  className="w-full h-full object-contain"
                                />
                              </span>
                              <span>{coat.label}</span>
                              {isCoatSelected && (
                                <Check size={12} strokeWidth={2.5} className="text-[--accent]" />
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
              <div id="step-2-details" ref={step2Ref} className="pt-5 pb-5 border-t border-[--border-default]">
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="w-5 h-5 rounded-full bg-[--accent] text-white text-[11px] font-bold font-jakarta flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[--text-primary] font-jakarta">
                    Personalize Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label htmlFor="pet-name" className="text-[12px] font-medium uppercase tracking-[0.06em] text-[--text-secondary] mb-1.5 block font-jakarta">
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
                          "w-full h-11 px-3.5 rounded-lg border bg-white text-sm sm:text-base font-jakarta text-[--text-primary] placeholder:text-[--text-secondary]/60 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--accent]/30",
                          hasTriedSubmit && !store.petName.trim() ? "border-[--error]" : "border-[--border-default] focus:border-[--accent]"
                        )}
                      />
                    </motion.div>
                    {hasTriedSubmit && !store.petName.trim() && (
                      <p className="text-xs text-[--error] font-jakarta mt-1 flex items-center gap-1">
                        <AlertCircle size={13} /> Please enter a name
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="pet-dates" className="text-[12px] font-medium uppercase tracking-[0.06em] text-[--text-secondary] mb-1.5 block font-jakarta">
                      Years / Dates
                    </label>
                    <input
                      id="pet-dates"
                      type="text"
                      placeholder="e.g. 2014 — 2024"
                      value={store.dateRange}
                      onChange={(e) => store.setDateRange(e.target.value)}
                      maxLength={30}
                      className="w-full h-11 px-3.5 rounded-lg border border-[--border-default] bg-white text-sm sm:text-base font-jakarta text-[--text-primary] placeholder:text-[--text-secondary]/60 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--accent]/30 focus:border-[--accent]"
                    />
                  </div>
                </div>

                {/* Compact Memorial Quote Selector */}
                <div className="mt-3.5 pt-3.5 border-t border-[--border-default]/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="memorial-quote-select" className="text-[12px] font-bold uppercase tracking-[0.06em] text-[--text-primary] block font-jakarta">
                      Memorial Quote
                    </label>
                    <span className="text-[11px] text-[--accent] font-medium font-jakarta">
                      Printed on canvas
                    </span>
                  </div>

                  <div className="relative">
                    <select
                      id="memorial-quote-select"
                      value={isCustomQuote ? 'custom' : store.quote}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'custom') {
                          setIsCustomQuote(true);
                        } else {
                          setIsCustomQuote(false);
                          store.setQuote(val);
                        }
                      }}
                      className="w-full h-10 pl-3 pr-9 rounded-lg border border-[--border-default] bg-white text-xs sm:text-sm font-jakarta text-[--text-primary] transition-all outline-none focus:border-[--accent] focus-visible:ring-2 focus-visible:ring-[--accent]/30 appearance-none cursor-pointer"
                    >
                      {PRESET_QUOTES.map((q) => (
                        <option key={q} value={q}>
                          &ldquo;{q}&rdquo;
                        </option>
                      ))}
                      <option value="custom">✍️ Custom Personal Message...</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[--text-secondary] pointer-events-none" />
                  </div>

                  {/* Custom Quote Input */}
                  {isCustomQuote && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="mt-2.5 overflow-hidden"
                    >
                      <input
                        type="text"
                        placeholder="e.g. Always running free in our hearts..."
                        value={store.quote}
                        onChange={(e) => store.setQuote(e.target.value)}
                        maxLength={75}
                        className="w-full h-10 px-3.5 rounded-lg border border-[--accent] bg-white text-xs sm:text-sm font-jakarta text-[--text-primary] placeholder:text-[--text-secondary]/60 outline-none focus-visible:ring-2 focus-visible:ring-[--accent]/30"
                        autoFocus
                      />
                      <span className="text-[10px] text-[--text-secondary] font-jakarta mt-1 block text-right">
                        {store.quote.length}/75 characters
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Step 3: Packages */}
              <PackageSelector />

              {/* Step 4: Primary Action & Trust */}
              <div className="pt-5 border-t border-[--border-default] flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={hasTriedSubmit && !isValid}
                  className={cn(
                    "w-full h-13 sm:h-14 rounded-lg font-semibold font-jakarta text-[15px] flex items-center justify-center gap-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[--accent] focus-visible:ring-offset-2",
                    isValid || !hasTriedSubmit
                      ? "bg-[#B88A58] hover:bg-[#A67A49] text-white cursor-pointer active:scale-[0.98] shadow-sm hover:shadow-md"
                      : "bg-[#EBE6DE] text-[#6B6156] cursor-not-allowed opacity-70"
                  )}
                  aria-disabled={hasTriedSubmit && !isValid}
                >
                  <ShoppingBag size={18} aria-hidden="true" />
                  <span>Add to Keepsakes •</span>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={store.unitPrice}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
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
                <div className="grid grid-cols-3 gap-2 mt-1 pt-2 border-t border-[--border-default]/50">
                  <div className="flex flex-col items-center justify-center gap-1 text-center text-[11px] sm:text-xs text-[--text-secondary] font-jakarta">
                    <MapPin size={15} strokeWidth={1.5} />
                    <span>Made in USA</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 text-center text-[11px] sm:text-xs text-[--text-secondary] font-jakarta">
                    <PackageCheck size={15} strokeWidth={1.5} />
                    <span>Ready to Hang</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 text-center text-[11px] sm:text-xs text-[--text-secondary] font-jakarta">
                    <ShieldCheck size={15} strokeWidth={1.5} />
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
