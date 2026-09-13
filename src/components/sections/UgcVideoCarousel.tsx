'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, CheckCircle2, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UgcVideoItem {
  id: string;
  videoSrc: string;
  posterSrc: string;
  authorName: string;
  location: string;
  petName: string;
  breed: string;
  quote: string;
  productType: string;
  likesCount: string;
}

const UGC_VIDEOS: UgcVideoItem[] = [
  {
    id: 'ugc-1',
    videoSrc: '/videos/ugc-video-1.mp4',
    posterSrc: '/videos/ugc-poster-1.webp',
    authorName: 'Sarah & Mark M.',
    location: 'Austin, TX',
    petName: 'Kaiser',
    breed: 'German Shepherd',
    quote: '“Seeing Kaiser on our living room wall... it feels like our guardian angel never left us.”',
    productType: '16×24” Museum Canvas',
    likesCount: '4.8k',
  },
  {
    id: 'ugc-2',
    videoSrc: '/videos/ugc-video-2.mp4',
    posterSrc: '/videos/ugc-poster-2.webp',
    authorName: 'David & Amanda L.',
    location: 'Denver, CO',
    petName: 'Cooper',
    breed: 'Golden Retriever',
    quote: '“The 1.5” solid wood depth and the watercolor texture in person blew us away. Worth every single penny.”',
    productType: '16×20” Statement Canvas',
    likesCount: '6.2k',
  },
  {
    id: 'ugc-3',
    videoSrc: '/videos/ugc-video-3.mp4',
    posterSrc: '/videos/ugc-poster-3.webp',
    authorName: 'Jessica R.',
    location: 'Seattle, WA',
    petName: 'Bailey',
    breed: 'Golden Retriever',
    quote: '“He rested right beneath his portrait the day we hung it up. The most meaningful gift I’ve ever received.”',
    productType: '12×16” Gallery Canvas',
    likesCount: '8.1k',
  },
];

export function UgcVideoCarousel() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  function handlePlayClick(id: string) {
    // Pause any previously playing video
    if (activeVideoId && activeVideoId !== id) {
      const prevVideo = videoRefs.current[activeVideoId];
      if (prevVideo) {
        prevVideo.pause();
      }
      setIsPlaying((prev) => ({ ...prev, [activeVideoId]: false }));
    }

    const currentVideo = videoRefs.current[id];
    if (activeVideoId === id && currentVideo) {
      if (currentVideo.paused) {
        currentVideo.play().catch(console.error);
        setIsPlaying((prev) => ({ ...prev, [id]: true }));
      } else {
        currentVideo.pause();
        setIsPlaying((prev) => ({ ...prev, [id]: false }));
      }
    } else {
      setActiveVideoId(id);
      setIsPlaying((prev) => ({ ...prev, [id]: true }));
      // Wait for mount then play
      setTimeout(() => {
        const vid = videoRefs.current[id];
        if (vid) {
          vid.currentTime = 0;
          vid.play().catch(console.error);
        }
      }, 50);
    }
  }

  function toggleMute(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    const vid = videoRefs.current[id];
    if (vid) {
      vid.muted = !vid.muted;
      setIsMuted(vid.muted);
    } else {
      setIsMuted((prev) => !prev);
    }
  }

  function scrollCarousel(direction: 'left' | 'right') {
    if (!carouselRef.current) return;
    const cardWidth = 320;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  return (
    <section className="w-full py-14 sm:py-20 bg-[#FDFBF7] border-y border-[--border-default] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ── Section Header ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[--accent]/10 border border-[--accent]/20 text-[--accent] text-xs font-semibold tracking-wide uppercase font-jakarta mb-3">
              <Sparkles size={13} />
              <span>Real Home Unboxings</span>
            </div>
            <h2 className="font-fraunces text-2xl sm:text-3xl md:text-4xl text-[--text-primary] font-normal tracking-tight">
              Seen In Real Homes Across America
            </h2>
            <p className="font-jakarta text-sm sm:text-base text-[--text-secondary] mt-1.5 max-w-xl">
              Watch real dog parents open, hang, and cherish their museum-grade memorials. No filters, no stock footage — just pure emotion.
            </p>
          </div>

          {/* Social Proof Stats & Nav Buttons */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-1 text-xs font-bold text-[--text-primary] bg-white px-3 py-1.5 rounded-full border border-[--border-default] shadow-xs">
              <span className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </span>
              <span className="ml-1 text-[11px] text-[--text-secondary]">4.9/5 from 1,400+ Families</span>
            </div>

            {/* Desktop Arrows */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-full bg-white border border-[--border-default] flex items-center justify-center text-[--text-primary] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-xs"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-full bg-white border border-[--border-default] flex items-center justify-center text-[--text-primary] hover:bg-[#FAF8F5] transition-all cursor-pointer shadow-xs"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Carousel Grid / Scroller ─────────────────────────────── */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 sm:pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {UGC_VIDEOS.map((item) => {
            const isSelected = activeVideoId === item.id;
            const isCurrentlyPlaying = isPlaying[item.id] ?? false;

            return (
              <div
                key={item.id}
                className="relative shrink-0 w-[270px] sm:w-auto aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-md border border-[--border-default] group snap-center select-none"
              >
                {/* ── Poster Image or Active Video Element ── */}
                {isSelected ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[item.id] = el;
                    }}
                    src={item.videoSrc}
                    poster={item.posterSrc}
                    playsInline
                    loop
                    muted={isMuted}
                    onClick={() => handlePlayClick(item.id)}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.posterSrc}
                    alt={`${item.authorName}'s memorial canvas tribute`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    loading="lazy"
                  />
                )}

                {/* ── Top Header Overlay (TikTok/Reels Style) ── */}
                <div className="absolute top-0 inset-x-0 p-3.5 bg-gradient-to-b from-black/75 via-black/35 to-transparent pointer-events-none flex items-start justify-between z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-bold text-xs font-jakarta shadow-xs">
                      {item.petName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-white text-xs font-semibold font-jakarta drop-shadow-xs">
                          {item.authorName}
                        </span>
                        <CheckCircle2 size={12} className="text-emerald-400 fill-emerald-400/20" />
                      </div>
                      <span className="text-white/80 text-[10px] font-jakarta block leading-tight">
                        {item.location} • {item.breed}
                      </span>
                    </div>
                  </div>

                  {/* Sound Toggle (Only visible when active) */}
                  {isSelected && (
                    <button
                      type="button"
                      onClick={(e) => toggleMute(e, item.id)}
                      className="pointer-events-auto w-7 h-7 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-all cursor-pointer"
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    >
                      {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    </button>
                  )}
                </div>

                {/* ── Center Round Play Button ────────────────────────── */}
                <div
                  className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                  onClick={() => handlePlayClick(item.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={isCurrentlyPlaying ? `Pause ${item.petName}'s video` : `Play ${item.petName}'s video`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePlayClick(item.id);
                    }
                  }}
                >
                  <AnimatePresence>
                    {(!isSelected || !isCurrentlyPlaying) && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative flex items-center justify-center"
                      >
                        {/* Soft Outer Pulse Ring */}
                        <span className="absolute w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/25 animate-ping opacity-75 pointer-events-none" />

                        {/* Round Play Button Disc */}
                        <div className="relative w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-white/95 backdrop-blur-md text-[--text-primary] flex items-center justify-center shadow-xl border border-white/60 group-hover:bg-white transition-all">
                          <Play size={20} className="fill-[--text-primary] text-[--text-primary] translate-x-0.5" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Temporary Pause Overlay Icon */}
                  {isSelected && isCurrentlyPlaying && (
                    <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                      <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center">
                        <Pause size={18} />
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Bottom Overlay: Customer Quote & Product Badge ───── */}
                <div
                  className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10 flex flex-col justify-end"
                >
                  <span className="inline-block self-start text-[9.5px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 border border-amber-300/30 px-2 py-0.5 rounded-full font-jakarta mb-1.5 backdrop-blur-xs">
                    {item.productType}
                  </span>
                  <p className="text-white text-xs font-medium font-jakarta leading-snug line-clamp-2 drop-shadow-xs">
                    {item.quote}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15 text-[10px] text-white/70 font-jakarta">
                    <span>{item.petName}’s Tribute</span>
                    <span className="flex items-center gap-1 font-semibold text-white/90">
                      ❤️ {item.likesCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Mobile Scroll Indicator ───────────────────────────────── */}
        <div className="sm:hidden flex items-center justify-center gap-1.5 mt-2">
          {UGC_VIDEOS.map((item, idx) => (
            <span
              key={item.id}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all',
                activeVideoId === item.id ? 'bg-[--accent] w-4' : 'bg-[#D1D5DB]'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
