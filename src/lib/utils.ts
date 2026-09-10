import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names, resolving conflicts intelligently. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Free shipping threshold in dollars */
export const FREE_SHIPPING_THRESHOLD = 50;

/** Format a price in dollars to a USD display string, e.g. "$68" or "$89.99" */
export function formatPrice(dollars: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);
}

/** Format a price in dollars with cents, e.g. "$68.00" */
export function formatPriceFull(dollars: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(dollars);
}

/** Generate a random UUID (client-safe) */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Debounce a function */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Spring physics presets for framer-motion */
export const springs = {
  ui: { type: 'spring' as const, stiffness: 260, damping: 28, mass: 0.9 },
  tap: { type: 'spring' as const, stiffness: 450, damping: 18 },
  drawer: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 1 },
} as const;
