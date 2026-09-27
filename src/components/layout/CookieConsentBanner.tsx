'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { setTrackingConsent } from '@/lib/analytics';

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existingConsent = localStorage.getItem('paw_tracking_consent');
    if (!existingConsent) {
      // Small delay before showing so it doesn't jarringly block the initial render
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted || !isOpen) return null;

  const handleAccept = () => {
    setTrackingConsent(true);
    setIsOpen(false);
  };

  const handleDecline = () => {
    setTrackingConsent(false);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          role="region"
          aria-label="Privacy and Cookie Notice"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-border shadow-2xl text-foreground"
          style={{ boxShadow: '0 12px 36px -4px rgba(36,36,36,0.18)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-trust/15 text-trust flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={18} strokeWidth={2.2} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-jakarta">
                Your Privacy Is Protected
              </h3>
              <p className="text-xs text-muted font-jakarta mt-1 leading-relaxed">
                We never sell, rent, or trade your personal information or pet memories. We only use essential functional cookies for your cart and customizer, and anonymous metrics to improve your experience.
              </p>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-3.5 py-1.5 rounded-full bg-[#B88A58] hover:bg-[#A67A49] text-white text-xs font-semibold font-jakarta transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={handleDecline}
                  className="px-3 py-1.5 rounded-full bg-surface-subtle hover:bg-neutral-200 text-[#4A453E] text-xs font-medium font-jakarta transition-all border border-border cursor-pointer active:scale-95"
                >
                  Essential Only
                </button>
                <Link
                  href="/privacy"
                  prefetch={false}
                  className="text-[11px] text-muted hover:text-accent font-jakarta underline underline-offset-2 ml-auto"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
