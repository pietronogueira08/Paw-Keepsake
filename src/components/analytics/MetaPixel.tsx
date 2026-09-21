'use client';

import { useEffect, useRef, Suspense } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { hasTrackingConsent } from '@/lib/analytics';

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1543383894501429';

/**
 * Tracks route changes in Next.js App Router (Single Page Application transitions).
 * - Fires standard 'PageView' only on REAL route/query changes.
 * - Prevents duplicate triggers from component re-renders or StrictMode double mounts.
 * - Respects user tracking consent preferences.
 */
function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const lastTrackedUrl = useRef<string>('');

  useEffect(() => {
    const search = searchParams?.toString();
    const currentUrl = search ? `${pathname}?${search}` : pathname;

    // Respect consent if user has declined tracking
    if (!hasTrackingConsent()) {
      return;
    }

    // Skip the initial mount because the inline base script already tracks the initial PageView
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastTrackedUrl.current = currentUrl;
      return;
    }

    // Guard against component re-renders that do not change the URL
    if (currentUrl === lastTrackedUrl.current) {
      return;
    }

    lastTrackedUrl.current = currentUrl;

    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Intelligent Meta (Facebook) Pixel integration.
 * - Loads asynchronously without blocking page render (strategy="afterInteractive").
 * - Single initialization guard.
 * - Fires standard 'PageView' on initial load.
 * - Tracks SPA route transitions automatically.
 * - Includes <noscript> fallback.
 */
export function MetaPixel() {
  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <MetaPixelRouteTracker />
      </Suspense>
    </>
  );
}
