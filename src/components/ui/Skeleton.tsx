import * as React from 'react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────
export type SkeletonVariant = 'line' | 'circle' | 'rect';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Skeleton shape preset.
   * - 'line'   — short horizontal bar (good for text rows)
   * - 'circle' — fully rounded element (avatar / icon)
   * - 'rect'   — rounded rectangle (card / image placeholder)
   * Defaults to 'rect'.
   */
  variant?: SkeletonVariant;
  /**
   * Explicit width (e.g. '120px', '50%').
   * When omitted the component fills its container.
   */
  width?: string;
  /**
   * Explicit height (e.g. '48px').
   * When omitted a sensible default is applied per variant.
   */
  height?: string;
  /** Force fully rounded corners regardless of variant. */
  rounded?: boolean;
  className?: string;
}

// ─── Variant defaults ─────────────────────────────────────────────────────────
const variantDefaults: Record<SkeletonVariant, string> = {
  line:   'h-4 w-full rounded-md',
  circle: 'h-10 w-10 rounded-full',
  rect:   'h-32 w-full rounded-lg',
};

// ─── Component ───────────────────────────────────────────────────────────────
/**
 * Skeleton loading placeholder.
 *
 * Requires the following keyframe + utility in globals.css:
 *
 * ```css
 * @keyframes shimmer {
 *   0%   { background-position: -200% 0; }
 *   100% { background-position:  200% 0; }
 * }
 *
 * .animate-shimmer {
 *   background: linear-gradient(
 *     90deg,
 *     #EBE6DE66 25%,
 *     #ffffff    50%,
 *     #EBE6DE66 75%
 *   );
 *   background-size: 200% 100%;
 *   animation: shimmer 1.6s ease-in-out infinite;
 * }
 * ```
 */
export function Skeleton({
  variant = 'rect',
  width,
  height,
  rounded,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const forceRounded = rounded === true || variant === 'circle';

  return (
    <div
      role="status"
      aria-label="Loading…"
      aria-busy="true"
      style={{
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        ...style,
      }}
      className={cn(
        'animate-shimmer shrink-0',
        variantDefaults[variant],
        forceRounded && 'rounded-full',
        className,
      )}
      {...rest}
    >
      {/* Hidden text for screen readers */}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
