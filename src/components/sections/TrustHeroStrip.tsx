/**
 * TrustHeroStrip — Server Component
 *
 * Full-width trust/notification bar with:
 *   - Dark top marquee strip (mobile) / centered static text (desktop)
 *   - Light icon strip with 4 trust signals below
 */

// ─── Icons ────────────────────────────────────────────────────────────────────

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="1" y="7" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 10h4l3 4v3h-7V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="5.5" cy="18.5" r="2" fill="currentColor" />
      <circle cx="16.5" cy="18.5" r="2" fill="currentColor" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M11 2L3 5.5v5c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10v-5L11 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 11l2.5 2.5L14.5 8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M11 2l2.75 5.57 6.15.89-4.45 4.33 1.05 6.12L11 16l-5.5 2.91 1.05-6.12L2.1 8.46l6.15-.89L11 2z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 6v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MARQUEE_TEXT =
  'Free Insured Shipping Across the USA on Orders $50+  •  100% Lifetime Memory Guarantee  •  Printed & Assembled in the USA  •  4-6 Day Delivery';

const TRUST_ICONS = [
  {
    id: 'shipping',
    icon: TruckIcon,
    label: 'Free USA Shipping $50+',
  },
  {
    id: 'guarantee',
    icon: ShieldCheckIcon,
    label: 'Lifetime Memory Guarantee',
  },
  {
    id: 'rating',
    icon: StarIcon,
    label: '4.9★ From 1,400+ Families',
  },
  {
    id: 'delivery',
    icon: ClockIcon,
    label: '4-6 Day Delivery',
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function TrustHeroStrip() {
  return (
    <div role="banner" aria-label="Trust and shipping information">
      {/* ── Dark marquee / static strip ── */}
      <div className="bg-foreground text-white overflow-hidden">
        {/* Desktop: centered static text */}
        <p className="hidden md:block text-center py-2.5 text-xs font-medium font-jakarta tracking-wide px-4">
          {MARQUEE_TEXT}
        </p>

        {/* Mobile: CSS marquee */}
        <div className="md:hidden flex py-2.5 overflow-hidden" aria-hidden="true">
          <div className="flex min-w-full shrink-0 animate-marquee whitespace-nowrap gap-8">
            <span className="text-xs font-medium font-jakarta tracking-wide">{MARQUEE_TEXT}</span>
            <span className="text-xs font-medium font-jakarta tracking-wide">{MARQUEE_TEXT}</span>
          </div>
        </div>

        {/* Visible text for screen readers on mobile */}
        <p className="md:hidden sr-only">{MARQUEE_TEXT}</p>
      </div>

      {/* ── Light trust icon strip ── */}
      <div className="bg-surface-subtle border-b border-border py-2.5 px-4">
        <ul className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
          {TRUST_ICONS.map(({ id, icon: Icon, label }) => (
            <li
              key={id}
              className="flex items-center gap-1.5 text-trust"
            >
              <Icon className="flex-shrink-0" />
              <span className="text-[11px] sm:text-xs font-medium font-jakarta text-muted whitespace-nowrap">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}