'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle2 } from 'lucide-react';
import { useCustomizerStore } from '@/store/useCustomizerStore';

interface SaveMemorialDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveMemorialDraftModal({ isOpen, onClose }: SaveMemorialDraftModalProps) {
  const store = useCustomizerStore();
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !store.breed) return;

    setSaving(true);
    try {
      const payload = {
        email,
        customizerState: {
          breedId: store.breed.id,
          petName: store.petName,
          dateRange: store.dateRange,
          selectedPackage: store.selectedPackage,
        },
      };

      await fetch('/api/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#2B241D]/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8"
            role="dialog"
            aria-labelledby="draft-modal-title"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-[--text-secondary] hover:bg-[--bg-page] transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center text-center py-6">
                <CheckCircle2 size={48} className="text-[--success] mb-4" />
                <h3 className="font-fraunces text-2xl text-[--text-primary] mb-2">Saved to your inbox</h3>
                <p className="text-[--text-secondary] font-jakarta">
                  We've sent the preview link to <span className="font-medium text-[--text-primary]">{email}</span>.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 w-full h-12 bg-[--bg-page] text-[--text-primary] border border-[--border-default] rounded-lg font-jakarta font-semibold hover:bg-white transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-center mb-4 text-[--accent]">
                  <Mail size={32} strokeWidth={1.5} />
                </div>
                <h2 id="draft-modal-title" className="font-fraunces text-2xl text-[--text-primary] text-center mb-2">
                  Save your preview
                </h2>
                <p className="text-[--text-secondary] font-jakarta text-center text-sm mb-6">
                  Not ready to order? Enter your email to save a link to this design.
                </p>

                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full h-12 px-4 rounded-lg border border-[--border-default] bg-white text-base font-jakarta text-[--text-primary] placeholder:text-[--text-secondary]/60 focus-visible:ring-2 focus-visible:ring-[--accent]/30 focus:border-[--accent] outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={saving || !email}
                    className="w-full h-12 bg-[--accent] text-white rounded-lg font-jakarta font-semibold hover:bg-[--accent-hover] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {saving ? 'Saving...' : 'Send Preview Link'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
