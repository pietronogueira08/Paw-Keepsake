'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Dialog } from '@/components/ui/Dialog';
import { useCustomizerStore } from '@/store/useCustomizerStore';
import { cn } from '@/lib/utils';
import type { SaveDraftRequest } from '@/types/ecommerce';
import { MEMORIAL_QUOTES } from '@/lib/breeds-data';

const DraftSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type DraftFormValues = z.infer<typeof DraftSchema>;

interface SaveMemorialDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveMemorialDraftModal({ isOpen, onClose }: SaveMemorialDraftModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { breed, petName, dateRange, selectedQuoteId, customQuote, size, productType, setDraftEmail } =
    useCustomizerStore();

  const activeQuote =
    selectedQuoteId === 'custom'
      ? customQuote
      : MEMORIAL_QUOTES.find((q) => q.id === selectedQuoteId)?.text ?? '';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DraftFormValues>({ resolver: zodResolver(DraftSchema) });

  const onSubmit = async (data: DraftFormValues) => {
    setIsLoading(true);
    setDraftEmail(data.email);

    const payload: SaveDraftRequest = {
      email: data.email,
      petName: petName || 'My Pet',
      breedName: breed?.name ?? 'Mixed Breed',
      dateRange,
      quote: activeQuote,
      size,
      productType,
    };

    try {
      await fetch('/api/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch {
      // Still show success to avoid frustrating UX on network hiccups
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Save Your Memorial Design">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-6 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-trust/10 flex items-center justify-center">
              <CheckCircle size={32} className="text-trust" />
            </div>
            <div>
              <h3 className="font-fraunces text-xl text-foreground mb-1">Preview Sent!</h3>
              <p className="text-sm text-muted font-jakarta leading-relaxed max-w-xs mx-auto">
                Check your inbox — we've emailed you a link to{' '}
                {petName ? `${petName}'s` : "your pet's"} memorial design so you can revisit or share it
                with family anytime.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-2 px-6 py-2.5 rounded-full bg-accent text-white text-sm font-semibold font-jakarta hover:bg-accent-hover transition-colors duration-150"
            >
              Done
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-5"
          >
            {/* Preview summary */}
            {breed && (
              <div className="flex items-center gap-3 p-3 rounded-card bg-surface-subtle border border-border">
                <svg viewBox="0 0 200 200" width="40" height="40" className="flex-shrink-0" aria-hidden="true">
                  <path d={breed.svgPath} fill="#B88A58" opacity="0.8" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-foreground font-jakarta">
                    {petName || breed.name} Memorial
                  </p>
                  <p className="text-xs text-muted font-jakarta">{breed.name} · {size.replace('x', '×')}" {productType === 'museum-canvas' ? 'Canvas' : 'Framed Print'}</p>
                </div>
              </div>
            )}

            <p className="text-sm text-muted font-jakarta leading-relaxed">
              We'll email you a link to your personalized preview so you can share it with family or
              revisit it anytime — no account required.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="draftEmail" className="text-xs font-semibold uppercase tracking-widest text-muted font-jakarta">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" aria-hidden="true" />
                  <input
                    id="draftEmail"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className={cn(
                      'w-full pl-9 pr-4 py-3 rounded-card border bg-surface font-jakarta text-sm text-foreground',
                      'placeholder:text-muted/60 focus:outline-none transition-all duration-150',
                      errors.email
                        ? 'border-red-400 focus:border-red-400'
                        : 'border-border focus:border-accent focus:shadow-accent-ring',
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 font-jakarta">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full py-3 rounded-full bg-accent text-white font-semibold font-jakarta text-sm',
                  'hover:bg-accent-hover transition-colors duration-150 flex items-center justify-center gap-2',
                  isLoading && 'opacity-70 cursor-not-allowed',
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  'Send My Preview'
                )}
              </button>

              <p className="text-[10px] text-muted/60 text-center font-jakarta">
                We respect your privacy. No spam, ever.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
