'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, springs } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface DrawerProps {
  /** Controls whether the drawer is visible. */
  isOpen: boolean;
  /** Called when the user requests the drawer to close. */
  onClose: () => void;
  /** Text displayed in the drawer header. Also used for aria-labelledby. */
  title: string;
  /** Drawer body content. */
  children: React.ReactNode;
  /** Width of the drawer panel. Defaults to '420px'. */
  width?: string;
  /** Additional classes applied to the drawer panel. */
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

// ─── Drawer content ───────────────────────────────────────────────────────────
function DrawerContent({
  isOpen,
  onClose,
  title,
  children,
  width = '420px',
  className,
}: DrawerProps) {
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

    focusable[0]?.focus();

    function trapFocus(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === focusable[0]) {
          e.preventDefault();
          focusable[focusable.length - 1]?.focus();
        }
      } else {
        if (document.activeElement === focusable[focusable.length - 1]) {
          e.preventDefault();
          focusable[0]?.focus();
        }
      }
    }

    document.addEventListener('keydown', trapFocus);
    return () => document.removeEventListener('keydown', trapFocus);
  }, [isOpen]);

  // Prevent body scroll
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
        <div className="fixed inset-0 z-50 flex justify-end">
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 1 }}
            style={{ width }}
            className={cn(
              'relative z-10 flex h-full max-w-full flex-col bg-surface shadow-2xl',
              className,
            )}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
              <h2
                id={titleId}
                className="font-fraunces text-xl font-semibold text-foreground"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close drawer"
                className={cn(
                  'rounded-lg p-1 text-muted',
                  'transition-colors hover:bg-surface-subtle hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                )}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 font-jakarta text-sm text-foreground">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Portal wrapper ───────────────────────────────────────────────────────────
export function Drawer(props: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(<DrawerContent {...props} />, document.body);
}
