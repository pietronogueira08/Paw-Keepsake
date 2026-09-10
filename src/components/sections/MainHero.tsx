'use client';

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
                className="w-full sm:w-auto px-8 h-14 rounded-lg bg-[--accent] hover:bg-[--accent-hover] text-white font-jakarta font-semibold text-base transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-[--accent]/20"
              >
                Design Your Canvas
                <ArrowRight size={18} />
              </button>
              <p className="text-sm font-jakarta text-[--text-secondary]">
                Takes less than 2 minutes
              </p>
            </motion.div>
          </div>

          {/* Image Placeholder */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-full aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden bg-[#EBE6DE] border border-white/50 shadow-2xl flex items-center justify-center"
          >
            {/* Inner placeholder content until real image is added */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4A96A]/20 to-transparent" />
            
            <div className="text-center p-8 relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-[--accent]/40 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
              <p className="font-jakarta text-[--text-secondary] text-sm uppercase tracking-widest font-bold">
                Hero Image Placeholder
              </p>
              <p className="font-fraunces text-xl text-[--text-primary] mt-2 italic">
                (Dog Canvas in American Living Room)
              </p>
            </div>
            
            {/* Subtle decorative frame */}
            <div className="absolute inset-4 border border-[--accent]/10 rounded-xl pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
