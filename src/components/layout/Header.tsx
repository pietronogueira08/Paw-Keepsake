'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

// ─── Nav links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Custom Canvas',      href: '/' },
  { label: 'Shop All',           href: '/shop' },
  { label: 'Memorial Apparel',   href: '/product/memorial-crewneck' },
  { label: 'Reviews',            href: '/#reviews' },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <motion.line
        x1="3" y1="6" x2="21" y2="6"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
        animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
        style={{ originX: '50%', originY: '50%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      />
      <motion.line
        x1="3" y1="12" x2="21" y2="12"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.line
        x1="3" y1="18" x2="21" y2="18"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
        animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
        style={{ originX: '50%', originY: '50%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      />
    </svg>
  );
}

// ─── Cart Badge ───────────────────────────────────────────────────────────────

function CartBadge({ count }: { count: number }) {
  return (
    <AnimatePresence mode="popLayout">
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 18 }}
          className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white font-jakarta leading-none"
          aria-label={`${count} items in cart`}
        >
          {count > 9 ? '9+' : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

export function Header() {
  const openCart    = useCartStore((s) => s.openCart);
  const itemCount   = useCartStore((s) => s.itemCount);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const [mobileMessageIndex, setMobileMessageIndex] = useState(0);
  const MOBILE_MESSAGES = [
    'Free Insured US Shipping on Orders $50+',
    'Lifetime Memory Guarantee',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMobileMessageIndex((i) => (i + 1) % MOBILE_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [MOBILE_MESSAGES.length]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change / escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-40 w-full transition-shadow duration-300',
        scrolled ? 'shadow-card backdrop-blur-md bg-background/95' : 'bg-background',
      )}
    >
      {/* ── Utility top bar ── */}
      <div className="flex h-10 items-center justify-center bg-[#2B241D] px-4 overflow-hidden relative">
        {/* Desktop text */}
        <p className="hidden sm:block text-xs font-medium text-[#FAF8F5] font-jakarta tracking-wide">
          Free Insured US Shipping on Orders $50+ <span className="mx-2 opacity-50">•</span> Lifetime Memory Guarantee
        </p>
        
        {/* Mobile text (rotative) */}
        <div className="block sm:hidden relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.p
              key={mobileMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-[#FAF8F5] font-jakarta tracking-wide whitespace-nowrap"
            >
              {MOBILE_MESSAGES[mobileMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-[60px]"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-fraunces text-xl font-light italic text-foreground hover:text-accent transition-colors shrink-0"
          aria-label="Paw & Keepsake — Home"
        >
          Paw & Keepsake
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative px-3.5 py-2 rounded-full text-sm font-jakarta font-medium text-muted hover:text-foreground hover:bg-surface-subtle transition-all duration-150"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Cart button */}
          <button
            type="button"
            onClick={openCart}
            className="relative p-2 rounded-full text-foreground hover:text-accent hover:bg-surface-subtle transition-colors"
            aria-label="Open shopping cart"
          >
            <CartIcon />
            <CartBadge count={itemCount} />
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-full text-foreground hover:bg-surface-subtle transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <MenuIcon isOpen={mobileOpen} />
          </button>
        </div>
      </nav>

      {/* ── Mobile nav ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <ul className="flex flex-col py-3 px-4" role="list">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 28 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center py-3 text-base font-jakarta font-medium text-foreground border-b border-border/50 last:border-0 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
