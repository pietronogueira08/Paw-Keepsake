'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useCartStore } from '@/store/useCartStore';
import { APPAREL_COLORS, APPAREL_SIZES } from '@/lib/products-data';
import { getTopBreeds } from '@/lib/breeds-data';
import { generateId, formatPrice, cn } from '@/lib/utils';
import type { Product, ApparelSize, ApparelColor, CartItem, Breed } from '@/types/ecommerce';
import { FaqAccordion } from '@/components/sections/FaqAccordion';

const TOP_BREEDS = getTopBreeds(8);

interface Props {
  product: Product;
}

export function ApparelPdp({ product }: Props) {
  const addItem  = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [petName,   setPetName]   = useState('');
  const [dateRange, setDateRange] = useState('');
  const [size,      setSize]      = useState<ApparelSize | null>(null);
  const [color,     setColor]     = useState<ApparelColor>('sand');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  function handleAddToCart() {
    if (!size) { toast.error('Please select a size.'); return; }
    if (!selectedBreed) { toast.error("Please select your dog's breed."); return; }
    if (!petName.trim()) { toast.error("Please enter your pet's name."); return; }

    setAdding(true);
    const item: CartItem = {
      id: generateId(),
      productTitle: product.title,
      productType: product.slug as 'memorial-crewneck' | 'memorial-tshirt',
      breed: selectedBreed,
      petName: petName.trim(),
      dateRange: dateRange.trim(),
      quote: '',
      size,
      frameStyle: null,
      color,
      quantity: 1,
      unitPrice: product.basePrice,
    };
    addItem(item);
    toast.success(`${petName || 'Memorial'} ${product.title} added to your bag 🐾`);
    openCart();
    setTimeout(() => setAdding(false), 600);
  }

  return (
    <>
      <section className="w-full bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── Left: Illustration ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="sticky top-24"
          >
            <div
              className="aspect-square rounded-[20px] overflow-hidden flex items-center justify-center border border-border"
              style={{ backgroundColor: APPAREL_COLORS[color]?.hex ?? '#D4B896' }}
            >
              <svg viewBox="0 0 300 300" fill="none" className="w-3/4 opacity-90">
                <path d="M65 65 Q85 52 150 50 Q215 52 235 65 L255 105 L220 112 L220 265 L80 265 L80 112 L45 105 Z" fill="white" opacity="0.25" />
                <path d="M120 50 Q150 65 180 50" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.5" />
                <ellipse cx="150" cy="165" rx="38" ry="42" fill="white" opacity="0.2" />
                <ellipse cx="150" cy="155" rx="24" ry="26" fill="#B88A58" opacity="0.7" />
                <ellipse cx="135" cy="147" rx="10" ry="12" fill="#8B6F47" opacity="0.6" />
                <ellipse cx="165" cy="147" rx="10" ry="12" fill="#8B6F47" opacity="0.6" />
                {petName && (
                  <text x="150" y="200" textAnchor="middle" fill="white" fontSize="10" fontFamily="serif" opacity="0.7">
                    {petName.slice(0, 14)}
                  </text>
                )}
              </svg>
            </div>

            {/* Color swatches */}
            <div className="flex items-center gap-3 mt-4 justify-center">
              {(Object.entries(APPAREL_COLORS) as [ApparelColor, { label: string; hex: string }][]).map(
                ([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    title={val.label}
                    onClick={() => setColor(key)}
                    className={cn(
                      'w-7 h-7 rounded-full border-2 transition-all duration-150',
                      color === key ? 'border-accent scale-110' : 'border-border hover:border-accent/50',
                    )}
                    style={{ backgroundColor: val.hex }}
                    aria-label={val.label}
                    aria-pressed={color === key}
                  />
                ),
              )}
            </div>
            <p className="text-center text-xs text-muted font-jakarta mt-1.5">
              {APPAREL_COLORS[color]?.label}
            </p>
          </motion.div>

          {/* ── Right: Customizer ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 28 }}
            className="flex flex-col gap-6"
          >
            <div>
              <span className="inline-block bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full font-jakarta mb-3">
                {product.badge}
              </span>
              <h1 className="font-fraunces text-3xl sm:text-4xl text-foreground font-light italic mb-1">
                {product.title}
              </h1>
              <p className="text-muted font-jakarta text-sm mb-3">{product.subtitle}</p>
              <p className="font-jakarta">
                <span className="text-2xl font-bold text-foreground">{formatPrice(product.basePrice)}</span>
                <span className="text-muted text-sm ml-1">per piece</span>
              </p>
            </div>

            {/* Breed selector */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted font-jakarta mb-2">
                1 · Select Breed
              </p>
              <div className="grid grid-cols-4 gap-2">
                {TOP_BREEDS.map((breed) => {
                  const isSelected = selectedBreed?.id === breed.id;
                  return (
                    <motion.button
                      key={breed.id}
                      type="button"
                      onClick={() => setSelectedBreed(breed)}
                      whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 450, damping: 18 } }}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-card p-2 border text-center transition-all duration-150',
                        isSelected
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-accent/40 bg-surface',
                      )}
                      style={isSelected ? { boxShadow: '0 0 0 3px rgba(184,138,88,0.2)' } : undefined}
                      aria-pressed={isSelected}
                      aria-label={breed.name}
                    >
                      <svg viewBox="0 0 80 80" className="w-8 h-8 shrink-0" fill="none">
                        <path d={breed.svgPath} fill={isSelected ? '#B88A58' : '#736E65'} opacity={isSelected ? 1 : 0.5} />
                      </svg>
                      <span className="text-[9px] font-jakarta font-medium text-muted leading-tight line-clamp-2">
                        {breed.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Pet details */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted font-jakarta mb-2">
                2 · Personalize
              </p>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Pet's name (e.g. Biscuit)"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  maxLength={30}
                  className="w-full h-12 px-4 rounded-xl border border-[#EBE6DE] bg-white text-sm font-jakarta text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#B88A58]/20 focus:border-[#B88A58] transition-all"
                />
                <input
                  type="text"
                  placeholder="Years of life (e.g. 2012 – 2024)"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  maxLength={30}
                  className="w-full h-12 px-4 rounded-xl border border-[#EBE6DE] bg-white text-sm font-jakarta text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#B88A58]/20 focus:border-[#B88A58] transition-all"
                />
              </div>
            </div>

            {/* Size selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted font-jakarta">
                  3 · Size
                </p>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-xs text-accent font-jakarta underline underline-offset-2 hover:text-accent-hover transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {APPAREL_SIZES.map((s) => {
                  const isSelected = size === s;
                  return (
                    <motion.button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      whileTap={{ scale: 0.94 }}
                      className={cn(
                        'w-10 h-10 rounded-card border text-xs font-semibold font-jakarta transition-all duration-150',
                        isSelected
                          ? 'border-accent bg-accent text-white'
                          : 'border-border bg-surface text-foreground hover:border-accent/40',
                      )}
                      style={isSelected ? { boxShadow: '0 0 0 3px rgba(184,138,88,0.2)' } : undefined}
                      aria-pressed={isSelected}
                      aria-label={`Size ${s}`}
                    >
                      {s}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Add to cart */}
            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={adding}
              whileTap={{ scale: 0.97, transition: { type: 'spring', stiffness: 450, damping: 18 } }}
              className={cn(
                'w-full rounded-full py-4 text-sm font-semibold text-white font-jakarta',
                'transition-all duration-150',
                adding ? 'bg-trust cursor-wait' : 'bg-accent hover:bg-[#A37747] active:scale-[0.98]',
              )}
            >
              {adding ? 'Added to Bag ✓' : `Add to Bag — ${formatPrice(product.basePrice)}`}
            </motion.button>

            {/* Features */}
            <ul className="flex flex-col gap-2 pt-2 border-t border-border">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm font-jakarta text-muted">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="#879788" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Size Guide modal */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSizeGuideOpen(false)}
          >
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-surface rounded-[20px] border border-border p-6 max-w-sm w-full shadow-floating"
            >
              <button
                onClick={() => setSizeGuideOpen(false)}
                className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
                aria-label="Close size guide"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                </svg>
              </button>
              <h2 className="font-fraunces text-xl text-foreground mb-4">Size Guide</h2>
              <table className="w-full text-sm font-jakarta text-muted border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-foreground font-semibold">Size</th>
                    <th className="text-left py-2 pr-4">Chest (in)</th>
                    <th className="text-left py-2">Length (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { s: 'S',   chest: '18–20', length: '27' },
                    { s: 'M',   chest: '20–22', length: '28' },
                    { s: 'L',   chest: '22–24', length: '29' },
                    { s: 'XL',  chest: '24–26', length: '30' },
                    { s: '2XL', chest: '26–28', length: '31' },
                    { s: '3XL', chest: '28–30', length: '32' },
                  ].map((row) => (
                    <tr key={row.s} className="border-b border-border/50 last:border-0">
                      <td className="py-2 pr-4 font-semibold text-foreground">{row.s}</td>
                      <td className="py-2 pr-4">{row.chest}</td>
                      <td className="py-2">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-muted">
                Measurements are of the garment. We recommend sizing up for an oversized fit.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FaqAccordion />
    </>
  );
}
