'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ProgressProps {
  /** Fill percentage from 0 to 100. */
  value: number;
  /** Accessible / visible label (e.g. "Add $12 more for free shipping"). */
  label?: string;
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

// ─── Component ───────────────────────────────────────────────────────────────
export function Progress({ value, label, className }: ProgressProps) {
  const clamped = clamp(value, 0, 100);
  const isComplete = clamped >= 100;

  return (
    <div className={cn('w-full space-y-2', className)}>
      {/* Label row */}
      {label && (
        <div className="flex items-center justify-between gap-2">
          <p className="font-jakarta text-xs text-muted">
            {isComplete ? (
              <span className="font-semibold text-trust">
                🎉 Free shipping unlocked!
              </span>
            ) : (
              label
            )}
          </p>
          <span
            className={cn(
              'font-jakarta text-xs font-semibold tabular-nums',
              isComplete ? 'text-trust' : 'text-accent',
            )}
          >
            {Math.round(clamped)}%
          </span>
        </div>
      )}

      {/* Track */}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className="relative h-2 w-full overflow-hidden rounded-full bg-surface-subtle"
      >
        {/* Fill */}
        <motion.div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            isComplete
              ? 'bg-trust'
              : 'bg-gradient-to-r from-accent to-accent-hover',
          )}
          initial={false}
          animate={{ width: `${clamped}%` }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 28,
            mass: 0.9,
          }}
        />

        {/* Shimmer overlay while incomplete */}
        {!isComplete && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s ease-in-out infinite',
              width: `${clamped}%`,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
