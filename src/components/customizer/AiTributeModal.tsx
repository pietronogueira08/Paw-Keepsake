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
];

export function AiTributeModal({ isOpen, onClose }: AiTributeModalProps) {
  const { petName, breed, setQuote } = useCustomizerStore();
  const [selectedTone, setSelectedTone] = useState<'heartfelt' | 'poetic' | 'short'>('heartfelt');
  const [selectedMemories, setSelectedMemories] = useState<string[]>([]);
  const [customMemory, setCustomMemory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuotes, setGeneratedQuotes] = useState<string[]>([]);
  const [appliedQuote, setAppliedQuote] = useState<string | null>(null);

  const displayName = petName.trim() || 'your dog';

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
          petName: petName.trim() || 'My Dog',
          breed: breed?.name,
          memory: memoryParts.join(', '),
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
    toast.success('Memorial tribute applied to your canvas! 🐾');
    setTimeout(() => {
      onClose();
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="relative w-full max-w-[540px] max-h-[90vh] overflow-y-auto bg-[#FFFDF9] rounded-2xl border border-[#EBE6DE] shadow-2xl p-5 sm:p-7 z-10"
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
              <span>Gemini AI Tribute Writer</span>
            </div>
            <h3 className="font-fraunces text-xl sm:text-2xl font-medium text-[--text-primary]">
              Words Worthy of {displayName}
            </h3>
            <p className="text-xs sm:text-sm text-[--text-secondary] font-jakarta mt-1 max-w-[420px] mx-auto">
              Select a tone and share a memory. Our AI will craft personalized, poetic inscriptions for your memorial canvas.
            </p>
          </div>

          {/* Tone Selector */}
          <div className="mb-4">
            <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-[--text-primary] block font-jakarta mb-2">
              Inspiration Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedTone === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTone(t.id)}
                    className={cn(
                      'flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-jakarta transition-all cursor-pointer text-center',
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

          {/* Quick Memory Tags */}
          <div className="mb-4">
            <label className="text-[11px] font-bold uppercase tracking-[0.06em] text-[--text-primary] block font-jakarta mb-2">
              Special Memories & Traits (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_MEMORIES.map((mem) => {
                const isChecked = selectedMemories.includes(mem);
                return (
                  <button
                    key={mem}
                    type="button"
                    onClick={() => toggleMemory(mem)}
                    className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-jakarta transition-all cursor-pointer border',
                      isChecked
                        ? 'bg-[#B88A58] text-white border-[#B88A58] font-medium shadow-xs'
                        : 'bg-white text-[--text-secondary] border-[#EBE6DE] hover:border-[#B88A58]/60 hover:text-[--text-primary]'
                    )}
                  >
                    {isChecked && <Check size={11} className="inline mr-1 stroke-[3]" />}
                    {mem}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Memory Input */}
          <div className="mb-5">
            <input
              type="text"
              placeholder={`Share a small memory of ${displayName} (e.g. loved sleeping by the fire)...`}
              value={customMemory}
              onChange={(e) => setCustomMemory(e.target.value)}
              maxLength={150}
              className="w-full h-10 px-3.5 rounded-xl border border-[#EBE6DE] bg-white text-xs sm:text-sm font-jakarta text-[--text-primary] placeholder:text-[--text-secondary]/60 outline-none focus:border-[#B88A58] focus-visible:ring-2 focus-visible:ring-[#B88A58]/25"
            />
          </div>

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className={cn(
              'w-full h-11 rounded-xl bg-[#B88A58] hover:bg-[#A37747] text-white font-jakarta font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer',
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
                <span>{generatedQuotes.length > 0 ? 'Generate More Ideas' : 'Generate Memorial Inscriptions'}</span>
              </>
            )}
          </button>

          {/* Generated Results */}
          <AnimatePresence>
            {generatedQuotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 pt-4 border-t border-[#EBE6DE] space-y-2.5 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[--text-primary] font-jakarta">
                    Personalized Tributes for {displayName}
                  </span>
                  <span className="text-[11px] text-[--text-secondary] font-jakarta">
                    Click to apply to canvas
                  </span>
                </div>

                {generatedQuotes.map((quoteText, idx) => {
                  const isApplied = appliedQuote === quoteText;
                  return (
                    <motion.div
                      key={quoteText}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      onClick={() => handleSelectQuote(quoteText)}
                      className={cn(
                        'group p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left relative overflow-hidden',
                        isApplied
                          ? 'border-2 border-[#B88A58] bg-[#FAF7F0] shadow-xs'
                          : 'border-[#EBE6DE] bg-white hover:border-[#B88A58] hover:shadow-xs'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-fraunces italic text-xs sm:text-sm text-[--text-primary] leading-relaxed">
                          &ldquo;{quoteText}&rdquo;
                        </p>
                      </div>
                      <div className="shrink-0">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold font-jakarta transition-all',
                            isApplied
                              ? 'bg-[#B88A58] text-white'
                              : 'bg-[#FAF8F5] text-[--text-secondary] group-hover:bg-[#B88A58] group-hover:text-white'
                          )}
                        >
                          {isApplied ? (
                            <>
                              <Check size={12} strokeWidth={2.5} />
                              <span>Applied</span>
                            </>
                          ) : (
                            <span>Use This</span>
                          )}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
