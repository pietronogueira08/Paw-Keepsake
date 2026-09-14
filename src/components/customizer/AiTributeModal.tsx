'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Heart, Check, RefreshCw, Feather, Quote } from 'lucide-react';
import { toast } from 'sonner';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { cn } from '@/lib/utils';

interface AiTributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteApplied?: (quote: string) => void;
}

const TONES = [
  { id: 'heartfelt', label: 'Heartfelt & Comforting', icon: Heart },
  { id: 'poetic', label: 'Poetic & Lyrical', icon: Feather },
  { id: 'short', label: 'Short & Timeless', icon: Quote },
] as const;

const QUICK_MEMORIES = [
  'Ball & stick chaser',
  'Loved the beach & water',
  'Gentle guardian',
  'Always by my side',
  'Cuddle champion',
  'Sunbeam sleeper',
  'Loyal shadow',
  'Sweet gentle soul',
];

export function AiTributeModal({ isOpen, onClose, onQuoteApplied }: AiTributeModalProps) {
  const { petName, breed, setQuote } = useCustomizerStore();
  const [selectedTone, setSelectedTone] = useState<'heartfelt' | 'poetic' | 'short'>('heartfelt');
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [customMemory, setCustomMemory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuotes, setGeneratedQuotes] = useState<string[]>([]);
  const [appliedQuote, setAppliedQuote] = useState<string | null>(null);

  const displayName = petName.trim() || 'Your Dog';
  const breedName = breed?.name || '';

  const toggleMemory = (mem: string) => {
    setSelectedMemories((prev) =>
      prev.includes(mem) ? prev.filter((m) => m !== mem) : [...prev, mem]
    );
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setAppliedQuote(null);

    const memoryParts = [...selectedMemories];
    if (customMemory.trim()) {
      memoryParts.push(customMemory.trim());
    }

    try {
      const res = await fetch('/api/ai/generate-tribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petName: displayName,
          breed: breedName || undefined,
          memory: memoryParts.length > 0 ? memoryParts.join(', ') : undefined,
          tone: selectedTone,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate quotes');
      }

      const data = await res.json();
      if (Array.isArray(data.quotes) && data.quotes.length > 0) {
        setGeneratedQuotes(data.quotes);
      } else {
        toast.error('Could not generate quotes. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Connection issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuote = (quoteText: string) => {
    setAppliedQuote(quoteText);
    setQuote(quoteText);
    onQuoteApplied?.(quoteText);
    toast.success('Memorial tribute applied to your canvas! 🐾');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-tribute-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-[#FFFDF9] rounded-2xl border border-[#EBE6DE] shadow-2xl p-5 sm:p-7 z-10 custom-scrollbar"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[--text-secondary] hover:text-[--text-primary] hover:bg-[#F5F1EB] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B88A58]/10 text-[#B88A58] text-xs font-semibold font-jakarta mb-2">
              <Sparkles size={13} className="text-[#B88A58]" />
              <span>AI Memorial Tribute Writer</span>
            </div>
            <h3 id="ai-tribute-title" className="font-fraunces text-2xl sm:text-3xl font-normal text-[--text-primary] leading-tight">
              Words Worthy of <span className="italic text-[#B88A58]">{displayName}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[--text-secondary] font-jakarta mt-1.5 max-w-[440px] mx-auto leading-relaxed">
              {breedName ? `Tailored for your beloved ${breedName}. ` : ''}
              Choose a tone and select a trait or memory below to craft personalized inscriptions for your memorial canvas.
            </p>
          </div>

          {/* Quiz Step 1: Tone Selector */}
          <div className="mb-4">
            <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-[--text-primary] block font-jakarta mb-2">
              1. Inspiration Tone
            </label>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Inspiration Tone">
              {TONES.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedTone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedTone(t.id)}
                    className={cn(
                      'flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-jakarta transition-all cursor-pointer text-center outline-none focus-visible:ring-2 focus-visible:ring-[#B88A58]',
                      isSelected
                        ? 'border-2 border-[#B88A58] bg-[#FAF7F0] text-[--text-primary] font-semibold shadow-xs'
                        : 'border-[#EBE6DE] bg-white text-[--text-secondary] hover:border-[#B88A58]/60 hover:text-[--text-primary]'
                    )}
                  >
                    <Icon size={16} className={cn('mb-1', isSelected ? 'text-[#B88A58]' : 'text-[--text-secondary]')} />
                    <span className="leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiz Step 2: Special Memories & Traits */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-[--text-primary] block font-jakarta">
                2. Special Traits & Memories (Select any)
              </label>
              {selectedMemories.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedMemories([])}
                  className="text-[10px] text-[--text-secondary] hover:text-[#B88A58] font-jakarta underline cursor-pointer"
                >
                  Clear ({selectedMemories.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Dog personality traits">
              {QUICK_MEMORIES.map((mem) => {
                const isChecked = selectedMemories.includes(mem);
                return (
                  <button
                    key={mem}
                    type="button"
                    onClick={() => toggleMemory(mem)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-jakarta transition-all cursor-pointer border select-none outline-none focus-visible:ring-2 focus-visible:ring-[#B88A58]',
                      isChecked
                        ? 'bg-[#B88A58] text-white border-[#B88A58] font-medium shadow-xs'
                        : 'bg-white text-[--text-secondary] border-[#EBE6DE] hover:border-[#B88A58]/60 hover:text-[--text-primary]'
                    )}
                  >
                    {isChecked && <Check size={12} className="inline mr-1 stroke-[3]" />}
                    {mem}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiz Step 3: Custom Memory Input */}
          <div className="mb-5">
            <label htmlFor="custom-memory-input" className="text-[11px] font-bold uppercase tracking-[0.06em] text-[--text-primary] block font-jakarta mb-1.5">
              3. Share a unique detail or memory (Optional)
            </label>
            <input
              id="custom-memory-input"
              type="text"
              placeholder={`e.g. Loved chasing frisbees at sunset, sleeping by the fireplace...`}
              value={customMemory}
              onChange={(e) => setCustomMemory(e.target.value)}
              maxLength={150}
              className="w-full h-10 px-3.5 rounded-xl border border-[#EBE6DE] bg-white text-xs sm:text-sm font-jakarta text-[--text-primary] placeholder:text-[--text-secondary]/60 outline-none focus:border-[#B88A58] focus-visible:ring-2 focus-visible:ring-[#B88A58]/25"
            />
          </div>

          {/* Generate Action Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className={cn(
              'w-full h-11 sm:h-12 rounded-xl bg-[#B88A58] hover:bg-[#A37747] text-white font-jakarta font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#B88A58] focus-visible:ring-offset-2',
              isLoading && 'opacity-70 cursor-wait'
            )}
          >
            {isLoading ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Crafting Memorial Tributes with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>{generatedQuotes.length > 0 ? '✨ Regenerate Inscriptions with Traits' : '✨ Generate Memorial Inscriptions'}</span>
              </>
            )}
          </button>

          {/* Generated Results Section */}
          <AnimatePresence>
            {generatedQuotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-5 border-t border-[#EBE6DE] space-y-3 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[--text-primary] font-jakarta">
                    Personalized Inscriptions for {displayName}
                  </span>
                  <span className="text-[11px] text-[--text-secondary] font-jakarta">
                    Click to apply to canvas
                  </span>
                </div>

                <div className="space-y-2.5" role="list">
                  {generatedQuotes.map((quoteText, idx) => {
                    const isApplied = appliedQuote === quoteText;
                    return (
                      <motion.div
                        key={`${quoteText}-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        onClick={() => handleSelectQuote(quoteText)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectQuote(quoteText);
                          }
                        }}
                        className={cn(
                          'group relative p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3.5 text-left select-none outline-none focus-visible:ring-2 focus-visible:ring-[#B88A58]',
                          isApplied
                            ? 'border-2 border-[#B88A58] bg-[#FAF7F0] shadow-xs'
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
                              isApplied
                                ? 'bg-[#B88A58] text-white shadow-xs'
                                : 'bg-[#FAF8F5] text-[--text-secondary] border border-[#EBE6DE] group-hover:bg-[#B88A58] group-hover:text-white group-hover:border-transparent'
                            )}
                          >
                            {isApplied ? (
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

                {/* Footer in results */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B88A58] hover:text-[#A37747] font-jakarta cursor-pointer"
                  >
                    <RefreshCw size={12} className={cn(isLoading && 'animate-spin')} />
                    <span>Generate 3 More</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-[--text-secondary] hover:text-[--text-primary] font-jakarta cursor-pointer"
                  >
                    Keep Current Quote
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
