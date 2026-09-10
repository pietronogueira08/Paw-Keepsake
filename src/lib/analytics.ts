/**
 * analytics.ts — Isomorphic analytics event bus.
 * Client: fires Meta Pixel (window.fbq) and Google Analytics 4 (window.gtag)
 * Server: stubs only — real server-side events go through Meta CAPI
 */

import type { AnalyticsEventName, AnalyticsEventProperties } from '@/types/ecommerce';

// Browser type augmentation
declare global {
  interface Window {
    fbq?: (action: string, eventName: string, params?: Record<string, unknown>) => void;
    gtag?: (command: 'event' | 'config' | 'set', eventName: string, params?: Record<string, unknown>) => void;
  }
}

/** Fire an analytics event on both Meta Pixel and GA4. */
export function trackEvent(name: AnalyticsEventName, properties: AnalyticsEventProperties): void {
  if (typeof window === 'undefined') {
    _serverSideCapiStub(name, properties);
    return;
  }
  if (typeof window.fbq === 'function') {
    window.fbq('track', name, properties as Record<string, unknown>);
  }
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, properties as Record<string, unknown>);
  }
}

/** Tracks a virtual page-view. Call inside useEffect after route changes. */
export function pageView(url: string): void {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
  if (typeof window.gtag === 'function') {
    const mid = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    if (mid) window.gtag('config', mid, { page_path: url });
  }
}

export function trackViewContent(properties: AnalyticsEventProperties): void {
  trackEvent('ViewContent', properties);
}

export function trackCustomizeProduct(properties: AnalyticsEventProperties): void {
  trackEvent('CustomizeProduct', properties);
}

export function trackAddToCart(properties: AnalyticsEventProperties): void {
  trackEvent('AddToCart', properties);
}

export function trackInitiateCheckout(properties: AnalyticsEventProperties): void {
  trackEvent('InitiateCheckout', properties);
}

export function trackPurchase(properties: AnalyticsEventProperties): void {
  trackEvent('Purchase', properties);
}

export function trackSaveDraft(properties: AnalyticsEventProperties): void {
  trackEvent('SaveDraft', properties);
}

/** @private Stub for server-side Meta Conversions API — replace with real CAPI call */
function _serverSideCapiStub(_name: AnalyticsEventName, _props: AnalyticsEventProperties): void {
  // TODO: Fire Meta CAPI via server action for server-side events
}
