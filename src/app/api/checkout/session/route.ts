import { NextRequest, NextResponse } from 'next/server';
import { getStripeForSession } from '@/lib/stripe';

export const runtime = 'nodejs';

/**
 * Validates Stripe Checkout session strictly on the server by querying the Stripe API.
 * Ensures the order is confirmed as PAID by Stripe before any Purchase event is dispatched.
 * Note: This endpoint is completely stateless and read-only; it does not mark or assume
 * tracking has happened, leaving client-side dispatch confirmation to the browser Pixel.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('id') || searchParams.get('sessionId');

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return NextResponse.json(
        { error: 'Invalid or missing checkout session ID', isPaid: false },
        { status: 400 }
      );
    }

    // Retrieve verified session details directly from Stripe API
    const stripeClient = getStripeForSession(sessionId);
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);

    // Strict validation: Must be 'paid'
    const isPaid = session.payment_status === 'paid';
    if (!isPaid) {
      return NextResponse.json(
        {
          error: 'Order payment is not completed or verified',
          isPaid: false,
          paymentStatus: session.payment_status,
        },
        { status: 400 }
      );
    }

    // Convert Stripe cents integer to USD dollars
    const amountInDollars =
      typeof session.amount_total === 'number' ? session.amount_total / 100 : 0;
    const currency = (session.currency || 'usd').toUpperCase();

    // Standard product content identifiers
    const contentIds = [
      session.metadata?.product_type || 'museum-canvas',
      session.metadata?.canvas_size || '12x16',
    ].filter(Boolean);

    return NextResponse.json({
      id: session.id,
      isPaid: true,
      paymentStatus: session.payment_status,
      amountTotal: amountInDollars,
      currency,
      customerEmail: session.customer_details?.email || null,
      petName: session.metadata?.pet_name || null,
      canvasSize: session.metadata?.canvas_size || null,
      contentIds,
      // Deterministic event_id for Meta Pixel & CAPI deduplication
      eventId: `purchase_${session.id}`,
    });
  } catch (error) {
    console.error('[API checkout/session] Stripe verification error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to verify session with Stripe';
    return NextResponse.json({ error: message, isPaid: false }, { status: 500 });
  }
}
