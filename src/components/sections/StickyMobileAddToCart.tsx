'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { useCartStore } from '@/store/useCartStore';
import { generateId, formatPrice, cn } from '@/lib/utils';
import { trackAddToCart } from '@/lib/analytics';
import { MEMORIAL_QUOTES } from '@/lib/breeds-data';
import type { CartItem } from '@/types/ecommerce';
import { toast } from 'sonner';

export function StickyMobileAddToCart() {
  const [isVisible, setIsVisible] = useState(false);
  const store = useCustomizerStore();
  const { addItem, openCart } = useCartStore();

  const activeQuote =
    store.selectedQuoteId === 'custom'
      ? store.customQuote
      : MEMORIAL_QUOTES.find((q) => q.id === store.selectedQuoteId)?.text ?? '';

  useEffect(() => {
    const sentinel = document.getElementById('hero-cta-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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
    trackAddToCart({ value: store.unitPrice, currency: 'USD' });
    toast.success('Added to your order 🐾');
  };

  return (
    <>
      {/* Sentinel element — placed inside the hero CTA area */}
      <div id="hero-cta-sentinel" className="sr-only" aria-hidden="true" />

      {/* Sticky bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-surface border-t border-border px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: '0 -4px 24px rgba(36,36,36,0.1)' }}
            role="complementary"
            aria-label="Quick add to cart"
          >
            {/* Breed thumbnail or paw icon */}
            {store.breed ? (
              <div className="w-10 h-10 rounded-lg bg-surface-subtle border border-border flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 200 200" width="28" height="28" aria-hidden="true">
                  <path d={store.breed.svgPath} fill="#B88A58" opacity="0.8" />
                </svg>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-surface-subtle border border-border flex items-center justify-center flex-shrink-0 text-xl" aria-hidden="true">
                🐾
              </div>
            )}

            {/* Summary */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground font-jakarta truncate">
                {store.petName || (store.breed?.name ?? 'Your Memorial Canvas')}
              </p>
              <p className="text-[10px] text-muted font-jakarta">
                {store.size.replace('x', '×')}" · {store.productType === 'museum-canvas' ? 'Canvas' : 'Framed Print'}
              </p>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-bold text-foreground font-jakarta text-sm">
                {formatPrice(store.unitPrice)}
              </span>
              <motion.button
                type="button"
                onClick={handleAddToCart}
                disabled={!store.breed}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-bold font-jakarta flex items-center gap-1.5 transition-colors duration-150',
                  store.breed
                    ? 'bg-accent text-white hover:bg-accent-hover'
                    : 'bg-border text-muted cursor-not-allowed',
                )}
                aria-label="Add to cart"
              >
                <ShoppingBag size={13} aria-hidden="true" />
                Order Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
