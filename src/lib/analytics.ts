/**
 * analytics.ts — Isomorphic analytics event bus.
 * Dispatches to Google Analytics 4 (if configured) or internal log.
 * Meta Pixel & CAPI completely removed.
 */

import type { AnalyticsEventName, AnalyticsEventProperties } from '@/types/ecommerce';

// Browser type augmentation
declare global {
  interface Window {
    gtag?: (command: 'event' | 'config' | 'set', eventName: string, params?: Record<string, unknown>) => void;
  }
}

/** Check if user has explicit tracking consent (defaults to granted unless opted out) */
export function hasTrackingConsent(): boolean {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('paw_tracking_consent');
  return consent !== 'false' && consent !== 'declined';
}

/** Fire an analytics event on GA4 if available. */
export function trackEvent(
  name: AnalyticsEventName,
  properties: AnalyticsEventProperties = {},
  _options?: { eventID?: string }
): void {
  if (typeof window === 'undefined') return;

  // Check consent preferences
  if (!hasTrackingConsent()) return;

  // Google Analytics 4 Dispatch
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, properties as Record<string, unknown>);
  }
}

/** Tracks a virtual page-view. Call inside useEffect after route changes. */
export function pageView(url: string): void {
  if (typeof window === 'undefined') return;
  if (!hasTrackingConsent()) return;
  if (typeof window.gtag === 'function') {
    const mid = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
    if (mid) window.gtag('config', mid, { page_path: url });
  }
}

export function trackViewContent(properties: AnalyticsEventProperties = {}): void {
  trackEvent('ViewContent', properties);
}

export function trackCustomizeProduct(properties: AnalyticsEventProperties = {}): void {
  trackEvent('CustomizeProduct', properties);
}

export function trackAddToCart(properties: AnalyticsEventProperties = {}): void {
  trackEvent('AddToCart', properties);
}

export function trackInitiateCheckout(properties: AnalyticsEventProperties = {}): void {
  trackEvent('InitiateCheckout', properties);
}

export function trackPurchase(
  properties: AnalyticsEventProperties = {},
  options?: { eventID?: string }
): void {
  trackEvent('Purchase', properties, options);
}

export function trackSaveDraft(properties: AnalyticsEventProperties = {}): void {
  trackEvent('SaveDraft', properties);
}
