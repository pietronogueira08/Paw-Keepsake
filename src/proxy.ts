/**
 * Paw & Keepsake — Geo-Detection Proxy
 *
 * In Next.js 16, middleware.ts has been renamed to proxy.ts.
 * The function export must be named `proxy`.
 *
 * Detects visitor country via the `x-vercel-ip-country` header
 * (injected by Vercel's Edge Network on every request).
 * Sets a `pk-country` cookie so Server Components and API routes
 * can read the locale without accessing headers directly.
 *
 * Testing locally: add header `x-vercel-ip-country: GB` via a browser
 * extension or pass it manually in Postman / curl.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Countries we treat as UK locale */
const UK_COUNTRIES = new Set(['GB']);

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Vercel injects this header automatically on their Edge Network.
  // Locally it won't be present — defaults to US (en-US).
  const vercelCountry = request.headers.get('x-vercel-ip-country');

  // If the visitor already has a manually-overridden locale cookie, respect it.
  const existingOverride = request.cookies.get('pk-locale-override')?.value;
  if (existingOverride === 'en-GB' || existingOverride === 'en-US') {
    // Pass the override downstream as a request header for Server Components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pk-locale', existingOverride);
    requestHeaders.set('x-pk-country', existingOverride === 'en-GB' ? 'GB' : 'US');
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const country = vercelCountry ?? 'US';
  const locale = UK_COUNTRIES.has(country) ? 'en-GB' : 'en-US';

  // Set the country as a request header so Server Components can read it
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pk-locale', locale);
  requestHeaders.set('x-pk-country', country);

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  // Also persist in a cookie (accessible to client-side code)
  res.cookies.set('pk-locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    httpOnly: false, // Client-readable for price display
  });

  res.cookies.set('pk-country', country, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    httpOnly: false,
  });

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon, images, icons, public assets
     * - API routes (they read the cookie directly)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
