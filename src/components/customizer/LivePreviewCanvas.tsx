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
      className="relative rounded-[4px] p-3 shadow-xl w-full max-w-[380px] aspect-square lg:aspect-[4/5]"
      style={{
        background: 'linear-gradient(135deg, #c8a97a 0%, #a67c4e 25%, #c8a97a 50%, #b08a5c 75%, #c8a97a 100%)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
      }}
    >
      {/* Inner mount */}
      <div
        className="rounded-sm p-6 bg-[--bg-page] w-full h-full"
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
    <div className="flex flex-col items-center justify-center text-center">
      <svg viewBox="0 0 200 200" width="100" height="100" aria-hidden="true" className="mb-4">
        <path
          d="M100 40 C80 35 65 50 60 65 C50 60 40 68 38 80 C30 85 28 100 35 112
             C28 118 24 132 30 144 C36 156 50 160 56 152 C60 165 72 175 84 172
             C88 178 94 182 100 180 C106 182 112 178 116 172
             C128 175 140 165 144 152 C150 160 164 156 170 144
             C176 132 172 118 165 112 C172 100 170 85 162 80
             C160 68 150 60 140 65 C135 50 120 35 100 40 Z"
          fill="var(--border-default)"
          opacity="0.8"
        />
      </svg>
      <p className="text-sm font-jakarta text-[--text-secondary] max-w-[180px]">
        Your dog's portrait appears here
      </p>
    </div>
  );
}

export function LivePreviewCanvas({ onEmailPreview, className }: LivePreviewCanvasProps) {
  const { breed, petName, dateRange, selectedPackage, previewLoading } = useCustomizerStore();

  const sizeLabels: Record<string, string> = {
    '8x12': '8×12" Petite Canvas • 1.5" Depth',
    '12x16': '12×16" Gallery Canvas • 1.5" Depth',
    '16x20': '16×20" Statement Canvas • 1.5" Depth',
    '16x24': '16×24" Grand Masterpiece • 1.5" Depth',
    entry: '8×12" Petite Canvas • 1.5" Depth',
    gallery: '12×16" Gallery Canvas • 1.5" Depth',
    heritage: '16×24" Grand Masterpiece • 1.5" Depth',
  };
  const pkgLabel = sizeLabels[selectedPackage] || '12×16" Gallery Canvas • 1.5" Depth';

  // "previewSync" animation rule:
  const previewSync = { opacity: [0.6, 1], transition: { duration: 0.25, ease: "easeOut" as const } };

  return (
    <div className={cn('flex flex-col items-center gap-4 w-full', className)}>
      <OakFrame>
        {/* Canvas interior — warm linen ground */}
        <div className="relative flex flex-col items-center justify-between w-full h-full">
          {/* Decorative inner border */}
          <div
            className="absolute inset-3 rounded-sm pointer-events-none"
            style={{ border: '1px solid var(--border-default)' }}
            aria-hidden="true"
          />

          {/* Breed silhouette — animated on change */}
          <div className="flex items-center justify-center flex-1 w-full mt-4">
            <AnimatePresence mode="wait">
              {breed ? (
                <motion.div
                  key={breed.id}
                  animate={previewLoading ? { opacity: 0.6 } : previewSync}
                  className="flex flex-col items-center justify-center w-full relative"
                  style={{ height: '140px' }}
                >
                  {/* Primary silhouette using CSS mask to colorize any external SVG */}
                  <div 
                    className="w-[140px] h-[140px] bg-[--accent]"
                    style={{
                      WebkitMaskImage: `url(/breeds/${breed.slug}.svg)`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskPosition: 'center',
                      WebkitMaskRepeat: 'no-repeat',
                      maskImage: `url(/breeds/${breed.slug}.svg)`,
                      maskSize: 'contain',
                      maskPosition: 'center',
                      maskRepeat: 'no-repeat',
                      opacity: 0.85,
                      filter: 'drop-shadow(0 2px 8px rgba(184,138,88,0.25))'
                    }}
                    aria-label={`${breed.name} silhouette`}
                  />
                  
                  {/* Subtle watercolor inner fill offset */}
                  <div 
                    className="absolute w-[140px] h-[140px] bg-[#D4A96A] pointer-events-none"
                    style={{
                      WebkitMaskImage: `url(/breeds/${breed.slug}.svg)`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskPosition: 'center',
                      WebkitMaskRepeat: 'no-repeat',
                      maskImage: `url(/breeds/${breed.slug}.svg)`,
                      maskSize: 'contain',
                      maskPosition: 'center',
                      maskRepeat: 'no-repeat',
                      opacity: 0.3,
                      transform: 'scale(0.94) translate(6px, 6px)'
                    }}
                    aria-hidden="true"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center w-full"
                >
                  <PlaceholderSilhouette />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Text area */}
          <div className="flex flex-col items-center gap-1 pb-6 px-4 text-center w-full">
            <motion.div layoutId="petName" layout="position" className="w-full">
              <span
                className="font-fraunces text-[--text-primary] leading-tight block truncate w-full"
                style={{ 
                  // Size proportional to space, clamp used to prevent overflow
                  fontSize: 'clamp(20px, 6cqw, 32px)' 
                }}
              >
                {petName || ""}
              </span>
            </motion.div>

            <motion.div layoutId="dateRange" layout="position">
              <span className="font-fraunces text-sm block text-[--text-secondary] italic">
                {dateRange || ""}
              </span>
            </motion.div>

            {/* Product label */}
            <span className="text-[9px] tracking-widest uppercase text-[--border-default] mt-3">
              {pkgLabel}
            </span>
          </div>

          {/* Watermark */}
          <span
            className="absolute bottom-1 right-2 text-[8px] text-[--border-default] font-jakarta tracking-wider select-none pointer-events-none"
            aria-hidden="true"
          >
            PREVIEW
          </span>
        </div>
      </OakFrame>

      {/* Micro-CTA */}
      {onEmailPreview && (
        <button
          onClick={onEmailPreview}
          className="text-sm font-jakarta font-medium text-[--text-secondary] border border-[--border-default] rounded-lg px-4 py-2 hover:border-[--accent] hover:text-[--accent] transition-all cursor-pointer"
        >
          Save preview to email
        </button>
      )}
    </div>
  );
}
