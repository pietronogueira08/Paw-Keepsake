import { NextRequest, NextResponse } from 'next/server';
import { invalidateInventoryCache, getPrintifyInventory } from '@/lib/printify';

export const runtime = 'nodejs';

/**
 * Webhook handler for Printify events (e.g. product:updated, order:shipment:created)
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await req.text();
    console.info('[printify-webhook] Event received:', rawBody.slice(0, 200));

    // When product or stock changes in Printify, invalidate local cache immediately
    invalidateInventoryCache();
    // Warm up the cache asynchronously
    getPrintifyInventory(true).catch((err) =>
      console.warn('[printify-webhook] Background cache warm up failed:', err)
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[printify-webhook] Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
