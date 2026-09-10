'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ShoppingBag, ChevronRight, ChevronLeft, Lock, Package } from 'lucide-react';
import { LivePreviewCanvas } from '@/components/customizer/LivePreviewCanvas';
import { BreedGridSelector } from '@/components/customizer/BreedGridSelector';
import { PersonalizationForm } from '@/components/customizer/PersonalizationForm';
import { SizeMaterialSelector } from '@/components/customizer/SizeMaterialSelector';
import { SaveMemorialDraftModal } from '@/components/customizer/SaveMemorialDraftModal';
import { useCustomizerStore, type CustomizerStep } from '@/store/useCustomizerStore';
import { useCartStore } from '@/store/useCartStore';
import { trackAddToCart } from '@/lib/analytics';
import { generateId, formatPrice, cn } from '@/lib/utils';
import type { CartItem } from '@/types/ecommerce';
import { MEMORIAL_QUOTES } from '@/lib/breeds-data';

// Step metadata for the progress indicator
const STEPS: { id: CustomizerStep; label: string }[] = [
  { id: 1, label: 'Style' },
  { id: 2, label: 'Breed' },
  { id: 3, label: 'Details' },
  { id: 4, label: 'Size' },
  { id: 5, label: 'Order' },
];

function StepIndicator({ currentStep }: { currentStep: CustomizerStep }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{
                backgroundColor: currentStep >= step.id ? '#B88A58' : '#EBE6DE',
                scale: currentStep === step.id ? 1.1 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-jakarta"
              style={{ color: currentStep >= step.id ? '#fff' : '#736E65' }}
            >
              {step.id}
            </motion.div>
            <span className={cn('text-[9px] font-jakarta uppercase tracking-wider', currentStep === step.id ? 'text-accent font-semibold' : 'text-muted')}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <motion.div
              animate={{ backgroundColor: currentStep > step.id ? '#B88A58' : '#EBE6DE' }}
              transition={{ duration: 0.3 }}
              className="h-px mx-1.5 flex-1"
              style={{ width: '24px', minWidth: '20px' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function StepContent({ step }: { step: CustomizerStep }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }}
      >
        {step === 1 && <SizeMaterialSelector />}
        {step === 2 && <BreedGridSelector />}
        {step === 3 && <PersonalizationForm />}
        {step === 4 && <SizeMaterialSelector />}
        {step === 5 && <CheckoutBlock />}
      </motion.div>
    </AnimatePresence>
  );
}

function CheckoutBlock() {
  const store = useCustomizerStore();
  const { addItem, openCart } = useCartStore();

  const activeQuote =
    store.selectedQuoteId === 'custom'
      ? store.customQuote
      : MEMORIAL_QUOTES.find((q) => q.id === store.selectedQuoteId)?.text ?? '';

  const canOrder = store.breed !== null && store.petName.trim().length >= 1;

  const handleAddToCart = () => {
    if (!store.breed) return;

    const item: CartItem = {
      id: generateId(),
      productTitle: `${store.productType === 'framed-print' ? 'Framed Fine Art Print' : 'Museum Canvas'}`,
      productType: store.productType,
      breed: store.breed,
      petName: store.petName,
      dateRange: store.dateRange,
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
      description: `${store.petName || store.breed.name} • ${store.size.replace('x', '×')}" ${store.productType === 'museum-canvas' ? 'Canvas' : 'Framed Print'}`,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Order summary */}
      {store.breed && (
        <div className="flex items-center gap-3 p-4 rounded-card bg-surface-subtle border border-border">
          <svg viewBox="0 0 200 200" width="48" height="48" className="flex-shrink-0" aria-hidden="true">
            <path d={store.breed.svgPath} fill="#B88A58" opacity="0.8" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground font-jakarta text-sm">
              {store.petName || store.breed.name} Memorial
            </p>
            <p className="text-xs text-muted font-jakarta">
              {store.breed.name} · {store.size.replace('x', '×')}" ·{' '}
              {store.productType === 'museum-canvas' ? 'Museum Canvas' : 'Framed Print'}
            </p>
          </div>
          <span className="font-bold text-lg text-foreground font-jakarta flex-shrink-0">
            {formatPrice(store.unitPrice)}
          </span>
        </div>
      )}

      {/* Primary CTA */}
      <motion.button
        type="button"
        onClick={handleAddToCart}
        disabled={!canOrder}
        whileHover={canOrder ? { y: -1 } : undefined}
        whileTap={canOrder ? { scale: 0.98 } : undefined}
        className={cn(
          'w-full py-4 rounded-full font-bold font-jakarta text-base flex items-center justify-center gap-2 transition-all duration-150',
          canOrder
            ? 'bg-accent text-white hover:bg-accent-hover shadow-md hover:shadow-lg'
            : 'bg-border text-muted cursor-not-allowed',
        )}
      >
        <ShoppingBag size={18} aria-hidden="true" />
        {canOrder
          ? `Add to Cart — ${formatPrice(store.unitPrice)}`
          : 'Select a breed & add a name to continue'}
      </motion.button>

      {/* Express checkout indicators */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] text-muted font-jakarta uppercase tracking-wider">or pay with</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-border bg-surface text-xs font-semibold font-jakarta text-foreground">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M17.5 12.5c0-1.9-1.6-3.5-3.5-3.5H8V19h2v-3h4c1.9 0 3.5-1.6 3.5-3.5zM10 14v-3h4c.8 0 1.5.7 1.5 1.5S14.8 14 14 14h-4zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" fill="currentColor"/></svg>
          Apple Pay
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-border bg-surface text-xs font-semibold font-jakarta text-foreground">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="currentColor"/></svg>
          Google Pay
        </div>
      </div>
      <p className="text-[10px] text-muted/70 text-center font-jakarta">
        Express pay available at checkout via Stripe
      </p>

      {/* Trust micro-copy */}
      <div className="flex flex-col gap-1.5 pt-1">
        <p className="text-[11px] text-muted font-jakarta flex items-center gap-1.5 justify-center">
          <Package size={11} aria-hidden="true" />
          🇺🇸 Printed & Assembled in the USA · Arrives in 4-6 business days
        </p>
        <p className="text-[11px] text-muted font-jakarta flex items-center gap-1.5 justify-center">
          <Lock size={11} aria-hidden="true" />
          Secure Checkout via Stripe · 256-bit SSL
        </p>
      </div>
    </div>
  );
}

export function HeroCustomizer() {
  const { currentStep, advanceStep, goBack, isStepComplete } = useCustomizerStore();
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);

  const canAdvance = isStepComplete(currentStep);
  const isLastStep = currentStep === 5;

  return (
    <section className="w-full bg-background" aria-label="Memorial Art Customizer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* ── Left column: Live preview ────────────────────────────── */}
          <div className="lg:sticky lg:top-24 flex flex-col items-center gap-6">
            {/* Editorial label */}
            <div className="text-center">
              <p className="text-xs font-jakarta uppercase tracking-widest text-muted mb-1">
                Your memorial, museum-quality
              </p>
              <h2 className="font-fraunces text-2xl lg:text-3xl text-foreground font-light italic">
                See it come to life
              </h2>
            </div>

            <LivePreviewCanvas onEmailPreview={() => setIsDraftModalOpen(true)} />

            {/* Quality trust strip */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 justify-center">
              {['300 DPI Archival Print', 'Gallery UV Coating', 'Solid Wood Frame'].map((feat) => (
                <span key={feat} className="text-[11px] text-trust font-jakarta flex items-center gap-1">
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right column: Funnel ────────────────────────────────── */}
          <div className="flex flex-col">
            {/* Heading */}
            <div className="mb-6">
              <h1 className="font-fraunces text-3xl lg:text-4xl text-foreground font-light leading-tight mb-2">
                Create Their{' '}
                <span className="italic text-accent">Forever Portrait</span>
              </h1>
              <p className="text-sm text-muted font-jakarta leading-relaxed">
                Handcrafted watercolor art personalized for your beloved dog. Museum-grade quality, made in the USA.
              </p>
            </div>

            {/* Step indicator */}
            <StepIndicator currentStep={currentStep} />

            {/* Step content */}
            <div className="min-h-[300px]">
              <StepContent step={currentStep} />
            </div>

            {/* Step navigation */}
            {!isLastStep && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                {currentStep > 1 ? (
                  <motion.button
                    type="button"
                    onClick={goBack}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground font-jakarta transition-colors"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                    Back
                  </motion.button>
                ) : (
                  <span />
                )}

                <motion.button
                  type="button"
                  onClick={advanceStep}
                  disabled={!canAdvance}
                  whileHover={canAdvance ? { x: 2 } : undefined}
                  whileTap={canAdvance ? { scale: 0.97 } : undefined}
                  className={cn(
                    'flex items-center gap-1.5 px-6 py-2.5 rounded-full font-semibold font-jakarta text-sm transition-all duration-150',
                    canAdvance
                      ? 'bg-accent text-white hover:bg-accent-hover'
                      : 'bg-border text-muted cursor-not-allowed',
                  )}
                >
                  Continue
                  <ChevronRight size={16} aria-hidden="true" />
                </motion.button>
              </div>
            )}
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
