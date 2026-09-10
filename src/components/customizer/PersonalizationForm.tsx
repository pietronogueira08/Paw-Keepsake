'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { MEMORIAL_QUOTES } from '@/lib/breeds-data';
import { cn } from '@/lib/utils';

export function PersonalizationForm() {
  const {
    petName, setPetName,
    dateRange, setDateRange,
    selectedQuoteId, customQuote, setQuote,
  } = useCustomizerStore();

  const [showAllQuotes, setShowAllQuotes] = useState(false);
  const visibleQuotes = showAllQuotes ? MEMORIAL_QUOTES : MEMORIAL_QUOTES.slice(0, 3);

  return (
    <div className="flex flex-col gap-5">
      {/* Pet Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted font-jakarta" htmlFor="petName">
          Pet's Name
        </label>
        <input
          id="petName"
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="Cooper"
          maxLength={30}
          className={cn(
            'w-full px-4 py-3 rounded-card border border-border bg-surface',
            'text-sm font-jakarta text-foreground placeholder:text-muted/60',
            'focus:outline-none focus:border-accent focus:shadow-accent-ring transition-all duration-150',
          )}
          aria-label="Pet's name"
        />
      </div>

      {/* Date Range */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted font-jakarta" htmlFor="dateRange">
          Years or Dates
        </label>
        <input
          id="dateRange"
          type="text"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          placeholder="2014 — 2025"
          maxLength={40}
          className={cn(
            'w-full px-4 py-3 rounded-card border border-border bg-surface',
            'text-sm font-jakarta text-foreground placeholder:text-muted/60',
            'focus:outline-none focus:border-accent focus:shadow-accent-ring transition-all duration-150',
          )}
          aria-label="Pet's years or dates"
        />
      </div>

      {/* Memorial Quote */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted font-jakarta">
          Memorial Tribute
        </p>

        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {visibleQuotes.map((quote) => (
              <motion.button
                key={quote.id}
                type="button"
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                onClick={() => setQuote(quote.id)}
                className={cn(
                  'text-left rounded-card border px-4 py-3 transition-all duration-150 relative',
                  selectedQuoteId === quote.id
                    ? 'border-accent bg-accent/5 shadow-accent-ring'
                    : 'border-border bg-surface hover:border-accent/40',
                )}
                aria-pressed={selectedQuoteId === quote.id}
              >
                {selectedQuoteId === quote.id && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center"
                  >
                    <Check size={10} strokeWidth={3} className="text-white" />
                  </motion.span>
                )}
                <p className="text-xs italic font-fraunces text-foreground leading-relaxed pr-5">
                  "{quote.text}"
                </p>
                {quote.author && (
                  <p className="text-[10px] text-muted mt-1 font-jakarta">— {quote.author}</p>
                )}
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Show more quotes toggle */}
          {!showAllQuotes && (
            <button
              type="button"
              onClick={() => setShowAllQuotes(true)}
              className="flex items-center gap-1 text-xs text-accent hover:text-accent-hover font-jakarta transition-colors mt-1"
            >
              <ChevronDown size={13} aria-hidden="true" />
              Show more tributes
            </button>
          )}

          {/* Custom quote option */}
          <motion.button
            type="button"
            layout
            onClick={() => setQuote('custom')}
            className={cn(
              'text-left rounded-card border px-4 py-3 transition-all duration-150',
              selectedQuoteId === 'custom'
                ? 'border-accent bg-accent/5 shadow-accent-ring'
                : 'border-dashed border-border bg-surface hover:border-accent/40',
            )}
            aria-pressed={selectedQuoteId === 'custom'}
          >
            <p className="text-xs text-muted font-jakarta italic">Write your own tribute…</p>
          </motion.button>

          {/* Custom quote textarea */}
          <AnimatePresence>
            {selectedQuoteId === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  value={customQuote}
                  onChange={(e) => setQuote('custom', e.target.value)}
                  placeholder="Write a personal tribute for your beloved companion…"
                  maxLength={120}
                  rows={3}
                  className={cn(
                    'w-full px-4 py-3 rounded-card border border-accent/40 bg-surface',
                    'text-sm font-fraunces italic text-foreground placeholder:text-muted/60 resize-none',
                    'focus:outline-none focus:border-accent focus:shadow-accent-ring transition-all duration-150',
                  )}
                  aria-label="Custom memorial tribute"
                />
                <p className="text-[10px] text-muted/60 text-right font-jakarta mt-1">
                  {customQuote.length}/120 characters
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
