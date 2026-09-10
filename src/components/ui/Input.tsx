'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground font-jakarta"
          >
            {label}
            {props.required && (
              <span className="ml-0.5 text-accent" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-surface px-3.5 py-2.5',
            'text-sm text-foreground placeholder:text-muted font-jakarta',
            'outline-none ring-0 transition-colors duration-150',
            'border-border focus:border-accent focus:ring-2 focus:ring-accent/20',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-200',
            props.disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          {...props}
        />

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-muted font-jakarta">
            {hint}
          </p>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-red-500 font-jakarta"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
