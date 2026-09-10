'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn, springs } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual style of the button. Defaults to 'primary'. */
  variant?: ButtonVariant;
  /** Size of the button. Defaults to 'md'. */
  size?: ButtonSize;
  /** When true, shows a spinner and disables interaction. */
  isLoading?: boolean;
  /** Icon rendered to the left of the label. */
  leftIcon?: React.ReactNode;
  /** Icon rendered to the right of the label. */
  rightIcon?: React.ReactNode;
  /** Stretches the button to fill its container. */
  fullWidth?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// ─── Variant / size maps ─────────────────────────────────────────────────────
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent',
  secondary:
    'border border-border bg-surface text-foreground hover:bg-surface-subtle focus-visible:ring-border',
  ghost:
    'bg-transparent text-muted hover:bg-surface-subtle focus-visible:ring-border',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  xl: 'h-14 px-8 text-lg gap-2.5',
};

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className,
      disabled,
      ...rest
    },
    ref,
  ) {
    const isDisabled = disabled || isLoading;

    const spinnerSize: Record<ButtonSize, string> = {
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-5 w-5',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={springs.tap}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(
          // Base
          'relative inline-flex items-center justify-center rounded-lg font-jakarta font-medium',
          'select-none outline-none transition-colors duration-150',
          'focus-visible:ring-2 focus-visible:ring-offset-2',
          // State
          isDisabled && 'cursor-not-allowed opacity-60',
          // Variant + size
          variantClasses[variant],
          sizeClasses[size],
          // Width
          fullWidth && 'w-full',
          className,
        )}
        {...(rest as React.ComponentProps<typeof motion.button>)}
      >
        {isLoading ? (
          <>
            <Spinner className={spinnerSize[size]} />
            {children && <span>{children}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
