'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MainHero() {
  const scrollToCustomizer = () => {
    const el = document.getElementById('hero-customizer-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full bg-[--bg-page] overflow-hidden pt-12 pb-16 lg:pt-24 lg:pb-32">
      {/* Background ambient gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[--accent] opacity-5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#EBE6DE] opacity-40 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div className="flex flex-col items-start max-w-2xl">
            {/* Social Proof Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[--border-default] shadow-sm mb-6"
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="var(--accent)" stroke="var(--accent)" />
                ))}
              </div>
              <span className="text-[11px] font-bold font-jakarta text-[--text-primary] tracking-wide uppercase">
                1,400+ 5-Star Reviews
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-fraunces text-4xl sm:text-5xl lg:text-6xl text-[--text-primary] leading-[1.1] mb-6"
            >
              Immortalize Your Best Friend in <span className="italic text-[--accent]">Museum-Grade Art</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-[--text-secondary] font-jakarta leading-relaxed mb-8 max-w-xl"
            >
              Turn their memory into a breathtaking watercolor masterpiece. Handcrafted in the USA, guaranteed to last a lifetime, and designed to bring comfort to your home.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={scrollToCustomizer}
                className="w-full sm:w-auto px-8 h-14 rounded-lg bg-white hover:bg-[#FAF8F5] text-black border-2 border-black font-jakarta font-bold text-base transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm cursor-pointer"
              >
                <span className="text-black font-bold">Design Your Canvas</span>
                <ArrowRight size={18} className="text-black stroke-[2.5]" />
              </button>
              <p className="text-sm font-jakarta text-[--text-secondary]">
                Takes less than 2 minutes
              </p>
            </motion.div>
          </div>

          {/* Hero Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#EBE6DE] border border-white/60 shadow-2xl group"
          >
            <Image
              src="/images/hero-dog-canvas.webp"
              alt="Custom watercolor dog memorial canvas art in an American living room"
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 640px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            
            {/* Ambient luxury vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5 pointer-events-none" />

            {/* Editorial Glass Badge overlay */}
            <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 backdrop-blur-md bg-white/85 border border-white/60 rounded-xl px-3.5 py-2 shadow-lg flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[--accent] animate-pulse" />
              <div>
                <p className="text-[12px] font-semibold text-[--text-primary] font-jakarta leading-none">
                  18×24&quot; Gallery Canvas
                </p>
                <p className="text-[10px] text-[--text-secondary] font-jakarta mt-0.5">
                  Museum-Grade Oak Frame
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
