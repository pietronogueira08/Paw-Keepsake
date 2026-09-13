'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Home, Sparkles } from 'lucide-react';
import { useCustomizerStore, getPackageSize } from '@/store/useCustomizerStore';
import { cn } from '@/lib/utils';

interface LivePreviewCanvasProps {
  onEmailPreview?: () => void;
  className?: string;
}

const SCALE_BY_PACKAGE: Record<string, { scale: number; label: string; badge: string }> = {
  '8x12': { scale: 0.66, label: '8×12" Petite', badge: 'Compact / Desk' },
  '12x16': { scale: 0.82, label: '12×16" Gallery', badge: 'Most Loved' },
  '16x20': { scale: 0.98, label: '16×20" Statement', badge: 'Feature Wall' },
  '16x24': { scale: 1.15, label: '16×24" Masterpiece', badge: 'Grand Gallery' },
  entry: { scale: 0.66, label: '8×12" Petite', badge: 'Compact / Desk' },
  gallery: { scale: 0.82, label: '12×16" Gallery', badge: 'Most Loved' },
  heritage: { scale: 1.15, label: '16×24" Masterpiece', badge: 'Grand Gallery' },
};

/** Placeholder silhouette when no breed is selected */
function PlaceholderSilhouette() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6 px-4">
      <div className="w-16 h-16 rounded-full bg-[#EBE6DE]/40 flex items-center justify-center mb-3 text-2xl">
        🐾
      </div>
      <p className="text-xs sm:text-sm font-semibold text-[--text-primary] font-jakarta mb-1">
        Choose Your Dog's Breed
      </p>
      <p className="text-[11px] text-[--text-secondary] font-jakarta max-w-[180px] leading-snug">
        Your personalized watercolor portrait will appear here in real time.
      </p>
    </div>
  );
}

export function LivePreviewCanvas({ onEmailPreview, className }: LivePreviewCanvasProps) {
  const {
    breed,
    selectedCoat,
    petName,
    dateRange,
    selectedPackage,
    previewLoading,
    viewMode,
    setViewMode,
  } = useCustomizerStore();

  const resolvedSize = getPackageSize(selectedPackage);
  const currentScale = SCALE_BY_PACKAGE[selectedPackage] || SCALE_BY_PACKAGE['12x16'];

  const sizeLabels: Record<string, string> = {
    '8x12': '8×12" Petite Canvas • 1.5" Museum Depth',
    '12x16': '12×16" Gallery Canvas • 1.5" Museum Depth',
    '16x20': '16×20" Statement Canvas • 1.5" Museum Depth',
    '16x24': '16×24" Grand Masterpiece • 1.5" Museum Depth',
    entry: '8×12" Petite Canvas • 1.5" Museum Depth',
    gallery: '12×16" Gallery Canvas • 1.5" Museum Depth',
    heritage: '16×24" Grand Masterpiece • 1.5" Museum Depth',
  };
  const pkgLabel = sizeLabels[selectedPackage] || '12×16" Gallery Canvas • 1.5" Museum Depth';

  // Resolve active transparent WebP image path
  const activeImage = useMemo(() => {
    if (!breed) return null;
    if (selectedCoat) {
      return `/breeds/${selectedCoat}.webp`;
    }
    return breed.image || `/breeds/${breed.slug}.webp`;
  }, [breed, selectedCoat]);

  return (
    <div className={cn('flex flex-col items-center gap-4 w-full max-w-[420px]', className)}>
      
      {/* ── View Mode Switcher ────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between p-1 bg-white rounded-xl border border-[--border-default] shadow-xs">
        <button
          type="button"
          onClick={() => setViewMode('detail')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold font-jakarta transition-all cursor-pointer relative',
            viewMode === 'detail'
              ? 'text-[--text-primary] shadow-xs'
              : 'text-[--text-secondary] hover:text-[--text-primary]'
          )}
          aria-label="View canvas in detail"
        >
          {viewMode === 'detail' && (
            <motion.div
              layoutId="viewModePill"
              className="absolute inset-0 bg-[#F5F1EB] rounded-lg -z-0"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />
          )}
          <Eye size={14} className="relative z-10 text-[--accent]" />
          <span className="relative z-10">Quadro em Detalhe</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('room')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold font-jakarta transition-all cursor-pointer relative',
            viewMode === 'room'
              ? 'text-[--text-primary] shadow-xs'
              : 'text-[--text-secondary] hover:text-[--text-primary]'
          )}
          aria-label="View canvas on living room wall"
        >
          {viewMode === 'room' && (
            <motion.div
              layoutId="viewModePill"
              className="absolute inset-0 bg-[#F5F1EB] rounded-lg -z-0"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />
          )}
          <Home size={14} className="relative z-10 text-[--accent]" />
          <span className="relative z-10">Ver na Parede</span>
        </button>
      </div>

      {/* ── Main Preview Display Area ────────────────────────────── */}
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[--border-default] shadow-md bg-[#FAF8F5] select-none">
        <AnimatePresence mode="wait">
          {viewMode === 'detail' ? (
            /* ══════════════════════════════════════════════════════
               1. DETAIL VIEW: Close-up 1.5" Depth Museum Canvas
               ══════════════════════════════════════════════════════ */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-4 sm:p-6 flex items-center justify-center bg-[#F4EFE6]"
            >
              {/* Museum Gallery-Wrapped Canvas Mockup */}
              <div
                className="relative w-full h-full rounded-[3px] bg-[#FDFBF7] flex flex-col justify-between p-4 sm:p-6 overflow-hidden transition-all"
                style={{
                  boxShadow:
                    '10px 18px 32px -8px rgba(45,35,25,0.22), 2px 6px 14px -2px rgba(45,35,25,0.12), inset 0 0 0 1px rgba(0,0,0,0.05)',
                  background:
                    'radial-gradient(circle at 50% 35%, #FFFDF9 0%, #FAF6EE 70%, #F5EFE3 100%)',
                }}
              >
                {/* Simulated 1.5" canvas side edge bevel on right */}
                <div
                  className="absolute top-0 right-0 bottom-0 w-[6px] pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(0,0,0,0.03), rgba(0,0,0,0.18))',
                  }}
                  aria-hidden="true"
                />

                {/* Subtle canvas linen texture effect */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.035]"
                  style={{
                    backgroundImage: `radial-gradient(#242424 1px, transparent 1px)`,
                    backgroundSize: '12px 12px',
                  }}
                  aria-hidden="true"
                />

                {/* Elegant subtle inner border */}
                <div
                  className="absolute inset-3 sm:inset-4 rounded-[2px] pointer-events-none border border-[#E8E0D2]/70"
                  aria-hidden="true"
                />

                {/* Artwork Area */}
                <div className="flex-1 w-full flex items-center justify-center relative my-auto min-h-0">
                  <AnimatePresence mode="wait">
                    {activeImage ? (
                      <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={previewLoading ? { opacity: 0.5, scale: 0.97 } : { opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="relative w-full h-full max-h-[220px] flex items-center justify-center"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeImage}
                          alt={breed ? breed.name : 'Memorial Dog Artwork'}
                          className="max-h-[190px] sm:max-h-[210px] w-auto max-w-full object-contain filter drop-shadow-[0_6px_14px_rgba(45,35,25,0.12)]"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full flex items-center justify-center"
                      >
                        <PlaceholderSilhouette />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Typography Area */}
                <div className="relative z-10 flex flex-col items-center text-center gap-0.5 pt-2 pb-1">
                  <motion.div layoutId="petName" layout="position" className="w-full">
                    <span
                      className="font-fraunces text-[--text-primary] font-medium leading-tight block truncate tracking-tight"
                      style={{ fontSize: 'clamp(20px, 5.5cqw, 30px)' }}
                    >
                      {petName || (breed ? breed.name : 'Your Pet')}
                    </span>
                  </motion.div>

                  <motion.div layoutId="dateRange" layout="position">
                    <span className="font-fraunces text-xs sm:text-sm text-[--text-secondary] italic block">
                      {dateRange || 'Forever in our hearts'}
                    </span>
                  </motion.div>

                  {/* Micro badge */}
                  <span className="text-[9px] tracking-wider uppercase font-semibold text-[--border-default] text-[#A39788] mt-2 font-jakarta">
                    {pkgLabel}
                  </span>
                </div>

                {/* Watermark */}
                <span
                  className="absolute bottom-1 right-2.5 text-[8px] text-[#C4B7A5] font-jakarta tracking-wider select-none pointer-events-none opacity-60"
                  aria-hidden="true"
                >
                  PREVIEW • PAW & KEEPSAKE
                </span>
              </div>
            </motion.div>
          ) : (
            /* ══════════════════════════════════════════════════════
               2. ROOM VIEW: Living Room Wall Mockup with Dynamic Scale
               ══════════════════════════════════════════════════════ */
            <motion.div
              key="room-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center"
            >
              {/* Background Living Room Photo (WebP) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/room-background.webp"
                alt="Living Room Wall Preview"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
              />

              {/* Natural Room Ambience Lighting Gradient */}
              <div
                className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-black/10"
                aria-hidden="true"
              />

              {/* Scalable Mounted Canvas on the Cream Plaster Wall */}
              <motion.div
                className="absolute origin-center"
                style={{
                  top: '36%',
                  left: '52%',
                }}
                animate={{
                  scale: currentScale.scale,
                  x: '-50%',
                  y: '-50%',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 24,
                }}
              >
                {/* The Miniature Hanging Canvas */}
                <div
                  className="relative rounded-[2px] bg-[#FAF7F0] flex flex-col justify-between p-2 overflow-hidden"
                  style={{
                    width: '142px',
                    height: '188px',
                    boxShadow:
                      '0 24px 38px -8px rgba(0,0,0,0.48), 0 8px 16px -4px rgba(0,0,0,0.32), inset 0 0 0 1px rgba(0,0,0,0.08)',
                    background:
                      'radial-gradient(circle at 50% 30%, #FFFDF9 0%, #F8F3EA 80%, #EDE5D5 100%)',
                  }}
                >
                  {/* Subtle 3D Canvas Side Wrap Shadow */}
                  <div
                    className="absolute top-0 right-0 bottom-0 w-[4px] pointer-events-none"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.22))',
                    }}
                    aria-hidden="true"
                  />

                  {/* Artwork thumbnail */}
                  <div className="flex-1 w-full flex items-center justify-center overflow-hidden my-auto min-h-0">
                    {activeImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={activeImage}
                        alt="Canvas Art"
                        className="max-h-[96px] w-auto max-w-full object-contain filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.15)]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#EBE6DE]/60 flex items-center justify-center text-sm">
                        🐾
                      </div>
                    )}
                  </div>

                  {/* Text thumbnail */}
                  <div className="text-center pt-1 pb-0.5">
                    <p className="font-fraunces text-[11px] font-semibold text-[--text-primary] leading-none truncate max-w-[125px] mx-auto">
                      {petName || (breed ? breed.name : 'Your Pet')}
                    </p>
                    <p className="font-fraunces text-[8px] text-[--text-secondary] italic leading-tight mt-0.5">
                      {dateRange || 'Forever Loved'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Dynamic Scale Overlay Pill at Bottom */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Sparkles size={13} className="text-[--accent] shrink-0" />
                  <span className="text-[11px] font-semibold font-jakarta text-[--text-primary] truncate">
                    Tamanho na Parede: {resolvedSize.replace('x', '×')}&quot;
                  </span>
                </div>
                <span className="text-[10px] font-bold font-jakarta px-2 py-0.5 rounded-full bg-[--accent]/10 text-[--accent] shrink-0 uppercase tracking-wide">
                  {currentScale.badge}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Micro-Actions Below Canvas ───────────────────────────── */}
      <div className="w-full flex items-center justify-between text-xs text-[--text-secondary] font-jakarta px-1">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          Preview em tempo real
        </span>

        {onEmailPreview && (
          <button
            type="button"
            onClick={onEmailPreview}
            className="text-xs font-medium text-[--text-secondary] hover:text-[--accent] transition-colors cursor-pointer underline underline-offset-2"
          >
            Salvar prévia por e-mail
          </button>
        )}
      </div>

    </div>
  );
}
