import { NextRequest, NextResponse } from 'next/server';
import { getStripeForSession } from '@/lib/stripe';

export const runtime = 'nodejs';

/**
 * Validates Stripe Checkout session on the server by querying the Stripe API.
 * Returns order details (status, pet name, amount) for the order confirmation screen.
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

    const stripeClient = getStripeForSession(sessionId);
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);

    const isPaid = session.payment_status === 'paid';
    const amountInCurrency =
      typeof session.amount_total === 'number' ? session.amount_total / 100 : 0;
    const currency = (session.currency || 'usd').toUpperCase();

    return NextResponse.json({
      id: session.id,
      isPaid,
      paymentStatus: session.payment_status,
      amountTotal: amountInCurrency,
      currency,
      customerEmail: session.customer_details?.email || null,
      petName: session.metadata?.pet_name || null,
      canvasSize: session.metadata?.canvas_size || null,
      hasOrderBump: session.metadata?.has_order_bump === 'true',
    });
  } catch (error) {
    console.error('[API checkout/session] Stripe verification error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to verify session with Stripe';
    return NextResponse.json({ error: message, isPaid: false }, { status: 500 });
  }
}
