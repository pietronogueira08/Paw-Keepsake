'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/types/ecommerce';
import { formatPrice } from '@/lib/utils';
import { FaqAccordion } from '@/components/sections/FaqAccordion';

interface Props {
  product: Product;
}

export function WallArtPdp({ product }: Props) {
  return (
    <>
      {/* Hero */}
      <section className="w-full bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="aspect-square rounded-[20px] bg-surface-subtle border border-border overflow-hidden flex items-center justify-center"
          >
            <svg viewBox="0 0 400 400" fill="none" className="w-3/4">
              {product.slug === 'framed-print' && (
                <rect x="15" y="15" width="370" height="370" rx="6" fill="none" stroke="#8B6F47" strokeWidth="20" />
              )}
              <rect x={product.slug === 'framed-print' ? 50 : 30} y={product.slug === 'framed-print' ? 50 : 30}
                    width={product.slug === 'framed-print' ? 300 : 340} height={product.slug === 'framed-print' ? 300 : 340}
                    rx="4" fill="#FAF8F5" />
              <ellipse cx="200" cy="160" rx="60" ry="68" fill="#D4B896" opacity="0.6" />
              <ellipse cx="168" cy="140" rx="20" ry="24" fill="#B88A58" opacity="0.5" />
              <ellipse cx="232" cy="140" rx="20" ry="24" fill="#B88A58" opacity="0.5" />
              <ellipse cx="200" cy="152" rx="50" ry="40" fill="#C9A87B" opacity="0.5" />
              <rect x="130" y="252" width="140" height="8" rx="4" fill="#B88A58" opacity="0.4" />
              <rect x="155" y="268" width="90" height="6" rx="3" fill="#736E65" opacity="0.3" />
              <line x1="155" y1="282" x2="245" y2="282" stroke="#B88A58" strokeWidth="1.5" opacity="0.4" />
              <rect x="110" y="295" width="180" height="5" rx="2.5" fill="#736E65" opacity="0.2" />
              <rect x="120" y="308" width="160" height="5" rx="2.5" fill="#736E65" opacity="0.15" />
            </svg>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 28 }}
          >
            <span className="inline-block bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full font-jakarta mb-4">
              {product.badge}
            </span>

            <h1 className="font-fraunces text-3xl sm:text-4xl text-foreground font-light italic mb-2">
              {product.title}
            </h1>
            <p className="text-muted font-jakarta text-sm sm:text-base mb-4">{product.subtitle}</p>

            <p className="text-sm font-jakarta text-foreground mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <p className="font-jakarta text-muted text-sm mb-6">
              Starting from{' '}
              <span className="text-2xl font-bold text-foreground">{formatPrice(product.basePrice)}</span>
              <span className="text-muted ml-1 text-xs">· size &amp; options selected at personalization</span>
            </p>

            {/* Features */}
            <ul className="flex flex-col gap-2 mb-8">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm font-jakarta text-muted">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="#879788" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/#hero-customizer"
                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white font-jakarta hover:bg-[#A37747] active:scale-[0.98] transition-all duration-150"
              >
                Start Personalizing
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-foreground font-jakarta hover:border-accent hover:text-accent transition-all duration-150"
              >
                Browse All
              </Link>
            </div>

            {/* Trust note */}
            <p className="mt-4 text-xs text-trust font-jakarta flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.2l-3.7 2.1.7-4.1-3-2.9 4.2-.7z" fill="#879788" />
              </svg>
              100% Lifetime Memory Guarantee · Free insured shipping on $50+
            </p>
          </motion.div>
          </div>
        </div>
      </section>

      <FaqAccordion />
    </>
  );
}
