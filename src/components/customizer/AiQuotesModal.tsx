'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check, RefreshCw, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AiQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: string[];
  petName: string;
  breedName?: string;
  onSelectQuote: (quote: string) => void;
  onRegenerate: () => Promise<void>;
  isRegenerating: boolean;
}

export function AiQuotesModal({
  isOpen,
  onClose,
  quotes,
  petName,
  breedName,
  onSelectQuote,
  onRegenerate,
  isRegenerating,
}: AiQuotesModalProps) {
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  const displayName = petName.trim() || 'Your Dog';

  const handleCardClick = (quote: string) => {
    setSelectedQuote(quote);
    onSelectQuote(quote);
    setTimeout(() => {
      onClose();
      setSelectedQuote(null);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="ai-quotes-title">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/45 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-[540px] max-h-[90vh] overflow-y-auto bg-[#FFFDF9] rounded-2xl border border-[#EBE6DE] shadow-2xl p-5 sm:p-7 z-10 custom-scrollbar"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[--text-secondary] hover:text-[--text-primary] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B88A58]/10 text-[#B88A58] text-xs font-semibold font-jakarta mb-2.5">
              <Sparkles size={13} className="text-[#B88A58]" />
              <span>AI Memorial Tribute Writer</span>
            </div>
            <h3 id="ai-quotes-title" className="font-fraunces text-2xl sm:text-3xl font-normal text-[--text-primary] leading-tight">
              Words Worthy of <span className="italic text-[#B88A58]">{displayName}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[--text-secondary] font-jakarta mt-1.5 max-w-[420px] mx-auto leading-relaxed">
              {breedName ? `Tailored for your beloved ${breedName}. ` : ''}
              Click any inscription below to instantly apply it to your canvas preview.
            </p>
          </div>

          {/* Quotes List (3 Cards) */}
          <div className="space-y-3 mb-5" role="list">
            {quotes.map((quoteText, idx) => {
              const isSelected = selectedQuote === quoteText;
              return (
                <motion.div
                  key={`${quoteText}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => handleCardClick(quoteText)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(quoteText);
                    }
                  }}
                  className={cn(
                    'group relative p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 text-left select-none outline-none focus-visible:ring-2 focus-visible:ring-[#B88A58]',
                    isSelected
                      ? 'border-2 border-[#B88A58] bg-[#FAF7F0] shadow-sm'
                      : 'border-[#EBE6DE] bg-white hover:border-[#B88A58] hover:bg-[#FAF8F5]/60 hover:shadow-xs'
                  )}
                >
                  <div className="shrink-0 text-[#B88A58]/70 group-hover:text-[#B88A58] transition-colors self-start mt-0.5">
                    <Quote size={18} className="rotate-180" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-fraunces italic text-sm sm:text-[15px] text-[--text-primary] leading-relaxed">
                      &ldquo;{quoteText}&rdquo;
                    </p>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-jakarta transition-all',
                        isSelected
                          ? 'bg-[#B88A58] text-white shadow-xs'
                          : 'bg-[#FAF8F5] text-[--text-secondary] border border-[#EBE6DE] group-hover:bg-[#B88A58] group-hover:text-white group-hover:border-transparent'
                      )}
                    >
                      {isSelected ? (
                        <>
                          <Check size={13} strokeWidth={2.5} />
                          <span>Applied</span>
                        </>
                      ) : (
                        <span>Use Quote</span>
                      )}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-[#EBE6DE]">
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className={cn(
                'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#B88A58]/40 bg-[#B88A58]/10 hover:bg-[#B88A58]/18 text-[#B88A58] font-jakarta font-semibold text-xs sm:text-sm transition-all cursor-pointer',
                isRegenerating && 'opacity-60 cursor-wait'
              )}
            >
              <RefreshCw size={14} className={cn(isRegenerating && 'animate-spin')} />
              <span>{isRegenerating ? 'Generating 3 New Quotes...' : 'Generate 3 More'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-medium font-jakarta text-[--text-secondary] hover:text-[--text-primary] transition-colors cursor-pointer text-center"
            >
              Keep Current Quote
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
