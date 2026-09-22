'use client';

import { useState, useEffect } from 'react';

export type CtaVariant = 'create-portrait' | 'add-to-cart';
export type TributeButtonVariant = 'visible' | 'hidden';

export interface AbTestConfig {
  ctaVariant: CtaVariant;
  tributeVariant: TributeButtonVariant;
}

const DEFAULT_CONFIG: AbTestConfig = {
  ctaVariant: 'create-portrait',
  tributeVariant: 'visible',
};

/**
 * Intelligent client-side A/B testing hook.
 * Persists assigned variants in localStorage so each user has a consistent experience across sessions.
 */
export function useAbTest(): AbTestConfig {
  const [config, setConfig] = useState<AbTestConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let savedCta = localStorage.getItem('paw_ab_cta') as CtaVariant | null;
    let savedTribute = localStorage.getItem('paw_ab_tribute') as TributeButtonVariant | null;

    if (!savedCta || (savedCta !== 'create-portrait' && savedCta !== 'add-to-cart')) {
      savedCta = Math.random() < 0.5 ? 'create-portrait' : 'add-to-cart';
      try {
        localStorage.setItem('paw_ab_cta', savedCta);
      } catch {}
    }

    if (!savedTribute || (savedTribute !== 'visible' && savedTribute !== 'hidden')) {
      savedTribute = Math.random() < 0.5 ? 'visible' : 'hidden';
      try {
        localStorage.setItem('paw_ab_tribute', savedTribute);
      } catch {}
    }

    setConfig({
      ctaVariant: savedCta,
      tributeVariant: savedTribute,
    });
  }, []);

  return config;
}
