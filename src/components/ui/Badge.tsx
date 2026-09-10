import * as React from 'react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────
export type BadgeVariant = 'accent' | 'trust' | 'muted' | 'popular';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style of the badge. Defaults to 'accent'. */
  variant?: BadgeVariant;
  /** Optional icon rendered to the left of the label. */
  leftIcon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

// ─── Variant map ─────────────────────────────────────────────────────────────
const variantClasses: Record<BadgeVariant, string> = {
  accent:  'bg-accent/10 text-accent',
  trust:   'bg-trust/10 text-trust',
  muted:   'bg-surface-subtle text-muted',
  popular: 'bg-accent text-white',
};

// ─── Component ───────────────────────────────────────────────────────────────
export function Badge({
  variant = 'accent',
  leftIcon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5',
        'font-jakarta text-xs font-semibold leading-none',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {leftIcon && (
        <span className="shrink-0 leading-none" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children}
    </span>
  );
}
