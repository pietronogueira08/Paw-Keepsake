'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCTS } from '@/lib/products-data';
import { formatPrice, cn } from '@/lib/utils';
import type { Product } from '@/types/ecommerce';

type CategoryFilter = 'all' | 'wall-art' | 'apparel';

const FILTER_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all',      label: 'All Keepsakes' },
  { id: 'wall-art', label: 'Wall Art'       },
  { id: 'apparel',  label: 'Apparel'        },
];

type SortKey = 'popular' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'popular',    label: 'Popularity'       },
  { id: 'price-asc',  label: 'Price: Low → High' },
  { id: 'price-desc', label: 'Price: High → Low' },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 280, damping: 28 }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
      className="group"
    >
      <div className="rounded-[16px] overflow-hidden border border-border bg-surface shadow-card hover:shadow-floating transition-shadow duration-300">
        {/* Illustration placeholder */}
        <div className="relative aspect-[4/3] bg-surface-subtle flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 200 150" className="w-2/3 opacity-30" fill="none">
            <rect x="20" y="15" width="160" height="120" rx="8" fill="#B88A58" />
            <ellipse cx="100" cy="65" rx="28" ry="32" fill="#FAF8F5" />
            <ellipse cx="100" cy="57" rx="18" ry="20" fill="#B88A58" opacity="0.6" />
            <rect x="70" y="96" width="60" height="4" rx="2" fill="#FAF8F5" opacity="0.7" />
          </svg>
          <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full font-jakarta">
            {product.badge}
          </span>
          <span className="absolute top-3 right-3 text-[10px] font-jakarta font-medium text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
            {product.category === 'wall-art' ? 'Wall Art' : 'Apparel'}
          </span>
        </div>

        <div className="p-5">
          <h3 className="font-fraunces text-lg text-foreground font-normal leading-tight">
            {product.title}
          </h3>
          <p className="text-sm text-muted font-jakarta mt-1 mb-4 line-clamp-2">
            {product.subtitle}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted font-jakarta">
              From <span className="text-foreground font-semibold text-base">{formatPrice(product.basePrice)}</span>
            </p>
            <Link
              href={`/product/${product.slug}`}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5',
                'text-xs font-semibold text-white font-jakarta',
                'hover:bg-accent-hover transition-colors duration-150',
              )}
            >
              Personalize
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('popular');

  const filtered = PRODUCTS
    .filter((p) => activeFilter === 'all' || p.category === activeFilter)
    .sort((a, b) => {
      if (sortKey === 'price-asc')  return a.basePrice - b.basePrice;
      if (sortKey === 'price-desc') return b.basePrice - a.basePrice;
      return 0; // popularity = catalog order
    });

  return (
    <>
      {/* Hero header */}
      <div className="bg-surface-subtle border-b border-border py-12 sm:py-16">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent font-jakarta mb-3">
              Memorial Keepsakes
            </p>
            <h1 className="font-fraunces text-4xl sm:text-5xl text-foreground font-light italic mb-4">
              Shop All
            </h1>
            <p className="text-muted font-jakarta text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Every piece is made to order — personalized with your dog's breed, name, and the years
              they filled your life with love.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="section-container py-10 sm:py-14">
        {/* Filters + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          {/* Category filter tabs */}
          <div className="flex gap-1 p-1 bg-surface-subtle rounded-full border border-border w-fit">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    'relative rounded-full px-4 py-1.5 text-xs font-semibold font-jakarta transition-all duration-150',
                    isActive ? 'text-white' : 'text-muted hover:text-foreground',
                  )}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <motion.div
                      layoutId="shopFilterPill"
                      className="absolute inset-0 bg-foreground rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label htmlFor="shop-sort" className="text-xs text-muted font-jakarta whitespace-nowrap">Sort by</label>
            <select
              id="shop-sort"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="text-xs font-jakarta text-foreground bg-surface border border-border rounded-full px-3 py-1.5 focus:outline-none focus:border-accent transition-colors"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted font-jakarta">
            No products found in this category.
          </div>
        )}
      </main>
    </>
  );
}
