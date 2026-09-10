'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, springs } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface DialogProps {
  /** Controls whether the dialog is visible. */
  isOpen: boolean;
  /** Called when the user requests the dialog to close. */
  onClose: () => void;
  /** Text displayed in the dialog header. Also used for aria-labelledby. */
  title: string;
  /** Dialog body content. */
  children: React.ReactNode;
  /** Additional classes applied to the dialog panel. */
  className?: string;
}

// ─── Close icon ──────────────────────────────────────────────────────────────
function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Dialog content (rendered inside the portal) ─────────────────────────────
function DialogContent({ isOpen, onClose, title, children, className }: DialogProps) {
  const titleId = React.useId();
  const panelRef = React.useRef<HTMLDivElement>(null);

  // ESC key
  React.useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Focus trap
  React.useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusableSelectors =
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(focusableSelectors),
    );

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Move focus into the dialog
    first?.focus();

    function trapFocus(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener('keydown', trapFocus);
    return () => document.removeEventListener('keydown', trapFocus);
  }, [isOpen]);

  // Prevent body scroll while open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.9 }}
            className={cn(
              'relative z-10 w-full max-w-lg rounded-2xl bg-surface p-6 shadow-xl',
              className,
            )}
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <h2
                id={titleId}
                className="font-fraunces text-xl font-semibold text-foreground"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className={cn(
                  'mt-0.5 shrink-0 rounded-lg p-1 text-muted',
                  'transition-colors hover:bg-surface-subtle hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                )}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Body */}
            <div className="font-jakarta text-sm text-foreground">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Portal wrapper ───────────────────────────────────────────────────────────
export function Dialog(props: DialogProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(<DialogContent {...props} />, document.body);
}
