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
        content_name: properties.petName
          ? `${properties.petName}'s Memorial Portrait`
          : 'Custom Dog Memorial Art',
        content_category: 'Pet Memorials',
        content_type: 'product',
        value: properties.value ?? 68,
        currency: properties.currency || 'USD',
        ...base,
      };

    case 'AddToCart':
      return {
        content_name: properties.petName
          ? `${properties.petName}'s Memorial`
          : properties.productType || 'Custom Memorial Artwork',
        content_type: 'product',
        value: properties.value,
        currency: properties.currency || 'USD',
        ...base,
      };

    case 'InitiateCheckout':
      return {
        value: properties.value,
        currency: properties.currency || 'USD',
        num_items: properties.items?.length || 1,
        ...base,
      };

    case 'Purchase':
      return {
        value: properties.value,
        currency: properties.currency || 'USD',
        content_type: 'product',
        transaction_id: properties.transactionId,
        ...base,
      };

    default:
      return base;
  }
}

/** Fire an analytics event on both Meta Pixel and GA4. */
export function trackEvent(name: AnalyticsEventName, properties: AnalyticsEventProperties = {}): void {
  if (typeof window === 'undefined') {
    _serverSideCapiStub(name, properties);
    return;
  }

  // Meta (Facebook) Pixel Dispatch
  if (typeof window.fbq === 'function') {
    const metaPayload = buildMetaPayload(name, properties);

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
      window.fbq('track', name, metaPayload);
    } else {
      window.fbq('trackCustom', name, metaPayload);
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

export function trackPurchase(properties: AnalyticsEventProperties = {}): void {
  trackEvent('Purchase', properties);
}

export function trackSaveDraft(properties: AnalyticsEventProperties = {}): void {
  trackEvent('SaveDraft', properties);
}

/** @private Stub for server-side Meta Conversions API — replace with real CAPI call */
function _serverSideCapiStub(_name: AnalyticsEventName, _props: AnalyticsEventProperties): void {
  // TODO: Fire Meta CAPI via server action for server-side events
}
