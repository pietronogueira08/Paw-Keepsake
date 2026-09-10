'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { cn } from '@/lib/utils';
import { MEMORIAL_QUOTES } from '@/lib/breeds-data';

interface LivePreviewCanvasProps {
  onEmailPreview?: () => void;
  className?: string;
}

/** Renders a warm oak wood frame around the preview */
function OakFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-[4px] p-3 shadow-floating"
      style={{
        background: 'linear-gradient(135deg, #c8a97a 0%, #a67c4e 25%, #c8a97a 50%, #b08a5c 75%, #c8a97a 100%)',
        boxShadow: '0 8px 40px rgba(36,36,36,0.18), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
    >
      {/* Inner mount */}
      <div
        className="rounded-sm p-6 bg-background"
        style={{ boxShadow: 'inset 0 2px 8px rgba(36,36,36,0.12)' }}
      >
        {children}
      </div>
    </div>
  );
}

/** Placeholder SVG shown when no breed is selected */
function PlaceholderSilhouette() {
  return (
    <motion.div
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      className="flex items-center justify-center"
    >
      <svg viewBox="0 0 200 200" width="120" height="120" aria-hidden="true">
        <path
          d="M100 40 C80 35 65 50 60 65 C50 60 40 68 38 80 C30 85 28 100 35 112
             C28 118 24 132 30 144 C36 156 50 160 56 152 C60 165 72 175 84 172
             C88 178 94 182 100 180 C106 182 112 178 116 172
             C128 175 140 165 144 152 C150 160 164 156 170 144
             C176 132 172 118 165 112 C172 100 170 85 162 80
             C160 68 150 60 140 65 C135 50 120 35 100 40 Z"
          fill="#EBE6DE"
          opacity="0.8"
        />
      </svg>
    </motion.div>
  );
}

export function LivePreviewCanvas({ onEmailPreview, className }: LivePreviewCanvasProps) {
  const { breed, petName, dateRange, selectedQuoteId, customQuote, productType, size } = useCustomizerStore();

  const activeQuote =
    selectedQuoteId === 'custom'
      ? customQuote
      : MEMORIAL_QUOTES.find((q) => q.id === selectedQuoteId)?.text ?? '';

  const truncatedQuote = activeQuote.length > 72 ? activeQuote.slice(0, 72) + '…' : activeQuote;

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <OakFrame>
        {/* Canvas interior — warm linen ground */}
        <div
          className="relative flex flex-col items-center justify-between"
          style={{ minHeight: '340px', width: '100%', maxWidth: '320px', margin: '0 auto' }}
        >
          {/* Decorative inner border */}
          <div
            className="absolute inset-3 rounded-sm pointer-events-none"
            style={{ border: '1px solid #EBE6DE' }}
            aria-hidden="true"
          />

          {/* Breed silhouette — animated on change */}
          <div className="flex items-center justify-center mt-8 mb-2" style={{ minHeight: '140px' }}>
            <AnimatePresence mode="wait">
              {breed ? (
                <motion.div
                  key={breed.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <svg
                    viewBox="0 0 200 200"
                    width="130"
                    height="130"
                    style={{ filter: 'drop-shadow(0 2px 8px rgba(184,138,88,0.25))' }}
                    aria-label={`${breed.name} silhouette`}
                  >
                    <path d={breed.svgPath} fill="#B88A58" opacity="0.82" />
                    {/* Subtle watercolor inner fill */}
                    <path d={breed.svgPath} fill="#D4A96A" opacity="0.3" transform="scale(0.94) translate(6,6)" />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <PlaceholderSilhouette />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text area — layoutId enables fluid transitions */}
          <div className="flex flex-col items-center gap-1 pb-8 px-4 text-center w-full">
            <motion.div layoutId="petName" layout="position">
              <span
                className={cn(
                  'font-fraunces text-foreground leading-tight block transition-all duration-200',
                  petName ? 'text-2xl font-normal' : 'text-lg text-muted italic',
                )}
              >
                {petName || "Your pet's name"}
              </span>
            </motion.div>

            <motion.div layoutId="dateRange" layout="position">
              <span
                className={cn(
                  'font-fraunces text-sm block transition-all duration-200',
                  dateRange ? 'text-muted italic' : 'text-border italic',
                )}
              >
                {dateRange || '2014 — 2024'}
              </span>
            </motion.div>

            {truncatedQuote && (
              <motion.p
                key={truncatedQuote}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-fraunces text-[10px] italic text-muted/70 mt-1 leading-relaxed max-w-[220px]"
              >
                "{truncatedQuote}"
              </motion.p>
            )}

            {/* Product label */}
            <span className="text-[9px] tracking-widest uppercase text-border mt-2">
              {productType === 'museum-canvas' ? 'Museum Canvas' : 'Framed Fine Art Print'} · {size.replace('x', '×')}"
            </span>
          </div>

          {/* Watermark */}
          <span
            className="absolute bottom-1 right-2 text-[8px] text-border/60 font-jakarta tracking-wider select-none pointer-events-none"
            aria-hidden="true"
          >
            PREVIEW — pawandkeepsake.com
          </span>
        </div>
      </OakFrame>

      {/* Email preview CTA */}
      {onEmailPreview && (
        <motion.button
          onClick={onEmailPreview}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors duration-150 font-jakarta"
        >
          <Mail size={14} aria-hidden="true" />
          Email this preview to myself
        </motion.button>
      )}
    </div>
  );
}
