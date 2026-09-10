'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PRODUCTS } from '@/lib/products-data';
import { formatPrice, cn } from '@/lib/utils';

// Display only the 3 hero products in the featured section
const FEATURED_SLUGS = ['museum-canvas', 'framed-print', 'memorial-crewneck'];

// Inline SVG placeholders per product (warm art deco style)
function ProductIllustration({ slug }: { slug: string }) {
  if (slug === 'museum-canvas' || slug === 'framed-print') {
    const hasFrame = slug === 'framed-print';
    return (
      <svg viewBox="0 0 240 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="240" height="280" fill="#F5F1EB" />
        {hasFrame && <rect x="8" y="8" width="224" height="264" rx="4" fill="none" stroke="#8B6F47" strokeWidth="12" />}
        <rect x={hasFrame ? 30 : 20} y={hasFrame ? 30 : 20} width={hasFrame ? 180 : 200} height={hasFrame ? 220 : 240} rx="2" fill="#FAF8F5" />
        {/* Silhouette */}
        <ellipse cx="120" cy="108" rx="34" ry="38" fill="#D4B896" opacity="0.6" />
        <ellipse cx="96" cy="92" rx="12" ry="14" fill="#B88A58" opacity="0.5" />
        <ellipse cx="144" cy="92" rx="12" ry="14" fill="#B88A58" opacity="0.5" />
        <ellipse cx="120" cy="100" rx="28" ry="22" fill="#C9A87B" opacity="0.5" />
        {/* Name */}
        <rect x="70" y="160" width="100" height="6" rx="3" fill="#B88A58" opacity="0.4" />
        <rect x="90" y="174" width="60" height="4" rx="2" fill="#736E65" opacity="0.3" />
        {/* Divider */}
        <line x1="95" y1="185" x2="145" y2="185" stroke="#B88A58" strokeWidth="1" opacity="0.4" />
        {/* Quote */}
        <rect x="55" y="195" width="130" height="3" rx="1.5" fill="#736E65" opacity="0.2" />
        <rect x="65" y="204" width="110" height="3" rx="1.5" fill="#736E65" opacity="0.15" />
      </svg>
    );
  }
  // Crewneck silhouette
  return (
    <svg viewBox="0 0 240 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="240" height="280" fill="#EDE8DF" />
      {/* Crewneck shape */}
      <path d="M60 60 Q80 50 120 48 Q160 50 180 60 L195 90 L175 95 L175 230 L65 230 L65 95 L45 90 Z" fill="#D4B896" />
      {/* Collar */}
      <path d="M100 48 Q120 58 140 48" stroke="#C9A87B" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Art print on chest */}
      <ellipse cx="120" cy="140" rx="28" ry="32" fill="#FAF8F5" opacity="0.7" />
      <ellipse cx="120" cy="132" rx="16" ry="18" fill="#B88A58" opacity="0.5" />
      <ellipse cx="110" cy="126" rx="6" ry="7" fill="#8B6F47" opacity="0.4" />
      <ellipse cx="130" cy="126" rx="6" ry="7" fill="#8B6F47" opacity="0.4" />
      <rect x="106" y="155" width="28" height="3" rx="1.5" fill="#736E65" opacity="0.3" />
    </svg>
  );
}

export function FeaturedCollection() {
  const featured = PRODUCTS.filter((p) => FEATURED_SLUGS.includes(p.slug));

  return (
    <section
      className="py-16 sm:py-24 bg-background"
      aria-labelledby="featured-collection-heading"
    >
      <div className="section-container">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-accent font-jakarta mb-3">
            Our Collection
          </p>
          <h2
            id="featured-collection-heading"
            className="font-fraunces text-3xl sm:text-4xl text-foreground font-light italic"
          >
            Explore Our Memorial Keepsakes
          </h2>
          <p className="mt-3 text-muted font-jakarta text-sm sm:text-base max-w-md mx-auto">
            Each piece is made to order — crafted with the care your dog's memory deserves.
          </p>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 280, damping: 28 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
              className="group"
            >
              <div className={cn(
                'rounded-[16px] overflow-hidden border border-border bg-surface',
                'shadow-card hover:shadow-floating transition-shadow duration-300',
              )}>
                {/* Illustration */}
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-subtle">
                  <ProductIllustration slug={product.slug} />
                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full font-jakarta">
                    {product.badge}
                  </span>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-accent font-jakarta mb-1">
                    {product.category === 'wall-art' ? 'Wall Art' : 'Memorial Apparel'}
                  </p>
                  <h3 className="font-fraunces text-xl text-foreground font-normal leading-tight mb-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted font-jakarta mb-4">
                    {product.subtitle}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted font-jakarta">
                      From{' '}
                      <span className="text-foreground font-semibold text-base">
                        {formatPrice(product.basePrice)}
                      </span>
                    </p>
                    <Link
                      href={`/product/${product.slug}`}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border border-accent',
                        'px-4 py-1.5 text-xs font-semibold text-accent font-jakarta',
                        'hover:bg-accent hover:text-white transition-all duration-200',
                      )}
                    >
                      Personalize
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-jakarta text-sm font-semibold text-muted hover:text-accent transition-colors"
          >
            View the full collection
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
