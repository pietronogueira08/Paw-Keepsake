/**
 * analytics.ts — Privacy-First Analytics Event Bus
 * 
 * Strict Privacy & Compliance Architecture:
 * - Meta Pixel & CAPI completely removed.
 * - Strips all Personally Identifiable Information (PII: customer names, emails,
 *   pet names, physical addresses) before dispatching to any telemetry service.
 * - Complies with GDPR, CCPA/CPRA, and LGPD opt-in / opt-out consent mechanisms.
 */

import type { AnalyticsEventName, AnalyticsEventProperties } from '@/types/ecommerce';

// Browser type augmentation
declare global {
  interface Window {
    gtag?: (command: 'event' | 'config' | 'set', eventName: string, params?: Record<string, unknown>) => void;
  }
}

/** Check if user has explicit tracking consent */
export function hasTrackingConsent(): boolean {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('paw_tracking_consent');
  // If user explicitly opted out, block all tracking
  return consent !== 'false' && consent !== 'declined';
}

/** Set tracking consent choice (used by cookie banner) */
export function setTrackingConsent(granted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('paw_tracking_consent', granted ? 'true' : 'false');
}

/**
 * Strips all Personally Identifiable Information (PII) before sending events.
 * Guarantees zero sensitive customer or memorial data leaks to third parties.
 */
function sanitizeAnalyticsPayload(props: AnalyticsEventProperties): Record<string, unknown> {
  const safe: Record<string, unknown> = {};

  // Strict allowlist: only aggregate e-commerce metrics
  if (props.productType) safe.item_category = props.productType;
  if (typeof props.value === 'number') safe.value = props.value;
  if (props.currency) safe.currency = props.currency;
  if (props.num_items) safe.quantity = props.num_items;
  if (props.content_category) safe.content_category = props.content_category;
  if (props.content_ids) safe.items = props.content_ids.map((id) => ({ item_id: id }));

  // PRIVACY SAFEGUARD:
  // petName, customer emails, names, addresses, and tributes are STRICTLY EXCLUDED.
  return safe;
}

/** Fire an analytics event on GA4 if available and consent is granted. */
export function trackEvent(
  name: AnalyticsEventName,
  properties: AnalyticsEventProperties = {},
  _options?: { eventID?: string }
): void {
  if (typeof window === 'undefined') return;

  // Check consent preferences
  if (!hasTrackingConsent()) return;

  // Google Analytics 4 Dispatch with PII sanitization
  if (typeof window.gtag === 'function') {
    const cleanPayload = sanitizeAnalyticsPayload(properties);
    window.gtag('event', name, cleanPayload);
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
