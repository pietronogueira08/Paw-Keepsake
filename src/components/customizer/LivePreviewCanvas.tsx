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

interface RoomCanvasConfig {
  width: number;
  height: number;
  top: string;
  imageMaxHeight: number;
  nameFontSize: number;
  dateFontSize: number;
  quoteFontSize: number;
  padding: number;
  shadow: string;
  badge: string;
}

const ROOM_CANVAS_CONFIG: Record<string, RoomCanvasConfig> = {
  '8x12': {
    width: 60,
    height: 90,
    top: '32%',
    imageMaxHeight: 46,
    nameFontSize: 7.5,
    dateFontSize: 5.5,
    quoteFontSize: 5,
    padding: 4,
    shadow:
      '0 12px 20px -5px rgba(0,0,0,0.38), 0 5px 10px -3px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(0,0,0,0.08)',
    badge: 'Compact / Desk',
  },
  '12x16': {
    width: 80,
    height: 107,
    top: '32%',
    imageMaxHeight: 58,
    nameFontSize: 8.5,
    dateFontSize: 6.5,
    quoteFontSize: 5.5,
    padding: 5,
    shadow:
      '0 16px 26px -6px rgba(0,0,0,0.42), 0 6px 12px -3px rgba(0,0,0,0.26), inset 0 0 0 1px rgba(0,0,0,0.08)',
    badge: 'Most Loved',
  },
  '16x20': {
    width: 108,
    height: 135,
    top: '32%',
    imageMaxHeight: 76,
    nameFontSize: 10,
    dateFontSize: 7.5,
    quoteFontSize: 6.5,
    padding: 6,
    shadow:
      '0 20px 30px -7px rgba(0,0,0,0.46), 0 8px 15px -4px rgba(0,0,0,0.30), inset 0 0 0 1px rgba(0,0,0,0.08)',
    badge: 'Feature Wall',
  },
  '16x24': {
    width: 124,
    height: 186,
    top: '32%',
    imageMaxHeight: 108,
    nameFontSize: 11.5,
    dateFontSize: 8.5,
    quoteFontSize: 7,
    padding: 7,
    shadow:
      '0 24px 36px -8px rgba(0,0,0,0.50), 0 10px 18px -4px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(0,0,0,0.08)',
    badge: 'Grand Gallery',
  },
  // Legacy PackageTier fallbacks
  entry: {
    width: 60,
    height: 90,
    top: '32%',
    imageMaxHeight: 46,
    nameFontSize: 7.5,
    dateFontSize: 5.5,
    quoteFontSize: 5,
    padding: 4,
    shadow:
      '0 12px 20px -5px rgba(0,0,0,0.38), 0 5px 10px -3px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(0,0,0,0.08)',
    badge: 'Compact / Desk',
  },
  gallery: {
    width: 80,
    height: 107,
    top: '32%',
    imageMaxHeight: 58,
    nameFontSize: 8.5,
    dateFontSize: 6.5,
    quoteFontSize: 5.5,
    padding: 5,
    shadow:
      '0 16px 26px -6px rgba(0,0,0,0.42), 0 6px 12px -3px rgba(0,0,0,0.26), inset 0 0 0 1px rgba(0,0,0,0.08)',
    badge: 'Most Loved',
  },
  heritage: {
    width: 124,
    height: 186,
    top: '32%',
    imageMaxHeight: 108,
    nameFontSize: 11.5,
    dateFontSize: 8.5,
    quoteFontSize: 7,
    padding: 7,
    shadow:
      '0 24px 36px -8px rgba(0,0,0,0.50), 0 10px 18px -4px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(0,0,0,0.08)',
    badge: 'Grand Gallery',
  },
};

interface DetailCanvasConfig {
  width: string;
  height: string;
  scale: number;
  badge: string;
  dimensionsCm: string;
}

const DETAIL_CANVAS_CONFIG: Record<string, DetailCanvasConfig> = {
  '8x12': {
    width: '78%',
    height: '80%',
    scale: 0.85,
    badge: '8×12" Petite (20×30 cm)',
    dimensionsCm: '20 × 30 cm',
  },
  '12x16': {
    width: '88%',
    height: '89%',
    scale: 0.92,
    badge: '12×16" Gallery (30×40 cm)',
    dimensionsCm: '30 × 40 cm',
  },
  '16x20': {
    width: '95%',
    height: '95%',
    scale: 0.97,
    badge: '16×20" Statement (40×50 cm)',
    dimensionsCm: '40 × 50 cm',
  },
  '16x24': {
    width: '100%',
    height: '100%',
    scale: 1.0,
    badge: '16×24" Grand Masterpiece (40×60 cm)',
    dimensionsCm: '40 × 60 cm',
  },
  // Legacy fallbacks
  entry: {
    width: '78%',
    height: '80%',
    scale: 0.85,
    badge: '8×12" Petite (20×30 cm)',
    dimensionsCm: '20 × 30 cm',
  },
  gallery: {
    width: '88%',
    height: '89%',
    scale: 0.92,
    badge: '12×16" Gallery (30×40 cm)',
    dimensionsCm: '30 × 40 cm',
  },
  heritage: {
    width: '100%',
    height: '100%',
    scale: 1.0,
    badge: '16×24" Grand Masterpiece (40×60 cm)',
    dimensionsCm: '40 × 60 cm',
  },
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
    quote,
    selectedPackage,
    previewLoading,
    viewMode,
    setViewMode,
  } = useCustomizerStore();

  const resolvedSize = getPackageSize(selectedPackage);
  const currentRoomConfig = ROOM_CANVAS_CONFIG[resolvedSize] || ROOM_CANVAS_CONFIG['12x16'];
  const currentDetailConfig = DETAIL_CANVAS_CONFIG[resolvedSize] || DETAIL_CANVAS_CONFIG['12x16'];

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
      
      {/* ── View Mode Switcher (Enlarged with Prominent Tap Targets & Visual Polish) ── */}
      <div className="w-full flex items-center justify-between p-1.5 bg-white rounded-2xl border border-[--border-default] shadow-xs">
        <button
          type="button"
          onClick={() => setViewMode('detail')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold font-jakarta transition-all cursor-pointer relative',
            viewMode === 'detail'
              ? 'text-[--text-primary] shadow-xs'
              : 'text-[--text-secondary] hover:text-[--text-primary]'
          )}
          aria-label="View canvas in detail"
        >
          {viewMode === 'detail' && (
            <motion.div
              layoutId="viewModePill"
              className="absolute inset-0 bg-[#F5F1EB] rounded-xl -z-0"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />
          )}
          <Eye size={18} className="relative z-10 text-[--accent]" />
          <span className="relative z-10">Canvas Detail</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('room')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold font-jakarta transition-all cursor-pointer relative',
            viewMode === 'room'
              ? 'text-[--text-primary] shadow-xs'
              : 'text-[--text-secondary] hover:text-[--text-primary]'
          )}
          aria-label="View canvas on living room wall"
        >
          {viewMode === 'room' && (
            <motion.div
              layoutId="viewModePill"
              className="absolute inset-0 bg-[#F5F1EB] rounded-xl -z-0"
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            />
          )}
          <Home size={18} className="relative z-10 text-[--accent]" />
          <span className="relative z-10">View in Room</span>
        </button>
      </div>

      {/* ── Main Preview Display Area ────────────────────────────── */}
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[--border-default] shadow-md bg-[#FAF8F5] select-none">
        <AnimatePresence mode="wait">
          {viewMode === 'detail' ? (
            /* ══════════════════════════════════════════════════════
               1. DETAIL VIEW: Close-up 1.5" Depth Museum Canvas with Dynamic Scale
               ══════════════════════════════════════════════════════ */
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-3 sm:p-5 flex items-center justify-center bg-[#F4EFE6]"
            >
              {/* Dynamic Size Floating Badge Pill in Detail View */}
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold font-jakarta shadow-md border border-white/20">
                <Sparkles size={11} className="text-[--accent]" />
                <span>{currentDetailConfig.badge}</span>
              </div>

              {/* Museum Gallery-Wrapped Canvas Mockup - Dynamically Animated to Convey Physical Scale */}
              <motion.div
                className="relative rounded-[3px] bg-[#FDFBF7] flex flex-col justify-between p-3.5 sm:p-5 overflow-hidden origin-center"
                animate={{
                  width: currentDetailConfig.width,
                  height: currentDetailConfig.height,
                  scale: currentDetailConfig.scale,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 24,
                  mass: 0.85,
                }}
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

                {/* Artwork Area - Smartly scaled hero presence */}
                <div className="flex-1 w-full flex items-center justify-center relative my-auto min-h-0 pt-1">
                  <AnimatePresence mode="wait">
                    {activeImage ? (
                      <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={previewLoading ? { opacity: 0.5, scale: 0.97 } : { opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="relative w-full h-full max-h-[225px] sm:max-h-[260px] md:max-h-[285px] flex items-center justify-center"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeImage}
                          alt={breed ? breed.name : 'Memorial Dog Artwork'}
                          className="max-h-[215px] sm:max-h-[250px] md:max-h-[275px] w-auto max-w-[84%] sm:max-w-[80%] object-contain filter drop-shadow-[0_8px_20px_rgba(45,35,25,0.15)]"
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
                <div className="relative z-10 flex flex-col items-center text-center gap-0.5 pt-1.5 pb-0.5 px-3">
                  <motion.div layoutId="petName" layout="position" className="w-full">
                    <span
                      className="font-fraunces text-[--text-primary] font-medium leading-tight block truncate tracking-tight"
                      style={{ fontSize: 'clamp(18px, 5.2cqw, 28px)' }}
                    >
                      {petName || (breed ? breed.name : 'Your Pet')}
                    </span>
                  </motion.div>

                  {dateRange && (
                    <motion.div layoutId="dateRange" layout="position">
                      <span className="font-fraunces text-xs sm:text-[13px] text-[--text-secondary] italic block">
                        {dateRange}
                      </span>
                    </motion.div>
                  )}

                  {/* Memorial Tribute Inscription Quote */}
                  {quote && (
                    <motion.p
                      layout="position"
                      className="font-fraunces italic text-[11px] sm:text-xs text-[#524C42] leading-snug max-w-[280px] mx-auto mt-1"
                    >
                      “{quote}”
                    </motion.p>
                  )}

                  {/* Micro badge */}
                  <span className="text-[9px] tracking-wider uppercase font-semibold text-[#A39788] mt-1.5 font-jakarta">
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
              </motion.div>
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

              {/* Scalable Mounted Canvas on the Cream Plaster Wall (Positioned cleanly above credenza, clear of foliage) */}
              <motion.div
                className="absolute origin-center"
                animate={{
                  width: currentRoomConfig.width,
                  height: currentRoomConfig.height,
                  top: currentRoomConfig.top,
                  left: '67%',
                  x: '-50%',
                  y: '-50%',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 26,
                  mass: 0.9,
                }}
              >
                {/* The Miniature Hanging Canvas */}
                <div
                  className="relative w-full h-full rounded-[2px] bg-[#FAF7F0] flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out"
                  style={{
                    padding: `${currentRoomConfig.padding}px`,
                    boxShadow: currentRoomConfig.shadow,
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
                        className="w-auto max-w-[86%] object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out"
                        style={{ maxHeight: `${currentRoomConfig.imageMaxHeight}px` }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#EBE6DE]/60 flex items-center justify-center text-sm">
                        🐾
                      </div>
                    )}
                  </div>

                  {/* Text thumbnail */}
                  <div className="text-center pt-0.5 pb-0.5 px-0.5 transition-all duration-300 ease-out">
                    <p
                      className="font-fraunces font-semibold text-[--text-primary] leading-none truncate mx-auto transition-all duration-300 ease-out"
                      style={{
                        fontSize: `${currentRoomConfig.nameFontSize}px`,
                        maxWidth: `${currentRoomConfig.width - currentRoomConfig.padding * 2}px`,
                      }}
                    >
                      {petName || (breed ? breed.name : 'Your Pet')}
                    </p>
                    {dateRange && (
                      <p
                        className="font-fraunces text-[--text-secondary] italic leading-tight mt-0.5 transition-all duration-300 ease-out"
                        style={{ fontSize: `${currentRoomConfig.dateFontSize}px` }}
                      >
                        {dateRange}
                      </p>
                    )}
                    {quote && (
                      <p
                        className="font-fraunces text-[#615B52] italic leading-tight line-clamp-1 mx-auto mt-0.5 transition-all duration-300 ease-out"
                        style={{
                          fontSize: `${currentRoomConfig.quoteFontSize}px`,
                          maxWidth: `${currentRoomConfig.width - currentRoomConfig.padding * 2}px`,
                        }}
                      >
                        “{quote}”
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Dynamic Scale Overlay Pill at Bottom */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Sparkles size={13} className="text-[--accent] shrink-0" />
                  <span className="text-[11px] font-semibold font-jakarta text-[--text-primary] truncate">
                    Wall Size: {resolvedSize.replace('x', '×')}&quot;
                  </span>
                </div>
                <span className="text-[10px] font-bold font-jakarta px-2 py-0.5 rounded-full bg-[--accent]/10 text-[--accent] shrink-0 uppercase tracking-wide">
                  {currentRoomConfig.badge}
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
          Live Interactive Preview
        </span>

        {onEmailPreview && (
          <button
            type="button"
            onClick={onEmailPreview}
            className="text-xs font-medium text-[--text-secondary] hover:text-[--accent] transition-colors cursor-pointer underline underline-offset-2"
          >
            Email this preview
          </button>
        )}
      </div>

    </div>
  );
}
