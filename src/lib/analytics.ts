/**
 * analytics.ts — Isomorphic analytics event bus.
 * Client: fires Meta Pixel (window.fbq) and Google Analytics 4 (window.gtag)
 * Server: stubs only — real server-side events go through Meta CAPI
 */

import type { AnalyticsEventName, AnalyticsEventProperties } from '@/types/ecommerce';

// Browser type augmentation
declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
    gtag?: (command: 'event' | 'config' | 'set', eventName: string, params?: Record<string, unknown>) => void;
  }
}

/** Check if user has explicit tracking consent (defaults to granted unless opted out) */
export function hasTrackingConsent(): boolean {
  if (typeof window === 'undefined') return false;
  const consent = localStorage.getItem('paw_tracking_consent');
  return consent !== 'false' && consent !== 'declined';
}

/**
 * Format e-commerce payloads specifically for Meta Pixel standards.
 */
function buildMetaPayload(name: AnalyticsEventName, properties: AnalyticsEventProperties): Record<string, unknown> {
  const base: Record<string, unknown> = {
    ...properties,
  };

  switch (name) {
    case 'ViewContent':
      return {
        content_name:
          properties.content_name ||
          (properties.petName
            ? `${properties.petName}'s Memorial Portrait`
            : 'Custom Dog Memorial Art'),
        content_category: properties.content_category || 'Pet Memorials',
        content_type: 'product',
        content_ids: properties.content_ids || [properties.productType || 'museum-canvas'],
        value: typeof properties.value === 'number' ? properties.value : 68,
        currency: properties.currency || 'USD',
        ...base,
      };

    case 'AddToCart':
      return {
        content_name:
          properties.content_name ||
          (properties.petName
            ? `${properties.petName}'s Memorial`
            : properties.productType || 'Custom Memorial Artwork'),
        content_type: 'product',
        content_ids: properties.content_ids || [properties.productType || 'museum-canvas'],
        value: properties.value,
        currency: properties.currency || 'USD',
        ...base,
      };

    case 'InitiateCheckout':
      return {
        value: properties.value,
        currency: properties.currency || 'USD',
        content_type: 'product',
        num_items: properties.items?.length || properties.num_items || 1,
        content_ids:
          properties.content_ids ||
          properties.items?.map((i) => i.id) || ['museum-canvas'],
        ...base,
      };

    case 'Purchase':
      return {
        value: properties.value,
        currency: properties.currency || 'USD',
        content_type: 'product',
        content_ids: properties.content_ids || ['museum-canvas'],
        num_items: properties.num_items || properties.items?.length || 1,
        ...base,
      };

    default:
      return base;
  }
}

/** Fire an analytics event on both Meta Pixel and GA4. */
export function trackEvent(
  name: AnalyticsEventName,
  properties: AnalyticsEventProperties = {},
  options?: { eventID?: string }
): void {
  if (typeof window === 'undefined') {
    _serverSideCapiStub(name, properties);
    return;
  }

  // Check consent preferences
  if (!hasTrackingConsent()) {
    return;
  }

  // Meta (Facebook) Pixel Dispatch
  if (typeof window.fbq === 'function') {
    const metaPayload = buildMetaPayload(name, properties);
    const eventId = options?.eventID || properties.eventID;
    const metaOptions = eventId ? { eventID: eventId } : undefined;

    // Meta Standard Events vs Custom Events
    const isStandardMetaEvent = [
      'PageView',
      'ViewContent',
      'AddToCart',
      'InitiateCheckout',
      'Purchase',
      'Lead',
      'CompleteRegistration',
    ].includes(name);

    if (isStandardMetaEvent) {
      if (metaOptions) {
        window.fbq('track', name, metaPayload, metaOptions);
      } else {
        window.fbq('track', name, metaPayload);
      }
    } else {
      if (metaOptions) {
        window.fbq('trackCustom', name, metaPayload, metaOptions);
      } else {
        window.fbq('trackCustom', name, metaPayload);
      }
    }
  }

  // Google Analytics 4 Dispatch
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, properties as Record<string, unknown>);
  }
}

/** Tracks a virtual page-view. Call inside useEffect after route changes. */
export function pageView(url: string): void {
  if (typeof window === 'undefined') return;
  if (!hasTrackingConsent()) return;
  if (typeof window.fbq === 'function') window.fbq('track', 'PageView');
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

/** @private Stub for server-side Meta Conversions API — ready for META_CAPI_ACCESS_TOKEN */
function _serverSideCapiStub(_name: AnalyticsEventName, _props: AnalyticsEventProperties): void {
  // Server-side CAPI is invoked when META_CAPI_ACCESS_TOKEN is configured in environment
}
