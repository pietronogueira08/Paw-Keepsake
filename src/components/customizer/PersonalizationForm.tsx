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
    <div className="flex flex-col gap-6">
      {/* Pet Name */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#736E65] mb-2 block" htmlFor="petName">
          Pet's Name
        </label>
        <input
          id="petName"
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          placeholder="Cooper"
          maxLength={30}
          className="w-full h-12 px-4 rounded-xl border border-[#EBE6DE] bg-white text-sm font-jakarta text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#B88A58]/20 focus:border-[#B88A58] transition-all"
          aria-label="Pet's name"
        />
      </div>

      {/* Date Range */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#736E65] mb-2 block" htmlFor="dateRange">
          Years or Dates
        </label>
        <input
          id="dateRange"
          type="text"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          placeholder="2014 — 2025"
          maxLength={40}
          className="w-full h-12 px-4 rounded-xl border border-[#EBE6DE] bg-white text-sm font-jakarta text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-[#B88A58]/20 focus:border-[#B88A58] transition-all"
          aria-label="Pet's years or dates"
        />
      </div>

      {/* Memorial Quote */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[#736E65] mb-2 block">
          Memorial Tribute
        </label>

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
                  'text-left rounded-xl border px-4 py-3 transition-all duration-150 relative',
                  selectedQuoteId === quote.id
                    ? 'border-[#B88A58] bg-[#B88A58]/5 ring-2 ring-[#B88A58]/20'
                    : 'border-[#EBE6DE] bg-white hover:border-[#B88A58]/40',
                )}
                aria-pressed={selectedQuoteId === quote.id}
              >
                {selectedQuoteId === quote.id && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#B88A58] flex items-center justify-center"
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
              className="flex items-center gap-1 text-xs text-[#B88A58] hover:text-[#A37747] font-jakarta transition-colors mt-1"
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
              'text-left rounded-xl border px-4 py-3 transition-all duration-150 mt-1',
              selectedQuoteId === 'custom'
                ? 'border-[#B88A58] bg-[#B88A58]/5 ring-2 ring-[#B88A58]/20'
                : 'border-dashed border-[#EBE6DE] bg-white hover:border-[#B88A58]/40',
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
                className="mt-1"
              >
                <textarea
                  value={customQuote}
                  onChange={(e) => setQuote('custom', e.target.value)}
                  placeholder="Write a personal tribute for your beloved companion…"
                  maxLength={120}
                  rows={3}
                  className="w-full p-4 rounded-xl border border-[#EBE6DE] bg-white text-sm font-fraunces italic text-foreground placeholder:text-muted/60 resize-none focus:outline-none focus:ring-2 focus:ring-[#B88A58]/20 focus:border-[#B88A58] transition-all"
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
