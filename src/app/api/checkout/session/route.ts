import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('id') || searchParams.get('sessionId');

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return NextResponse.json(
        { error: 'Invalid or missing checkout session ID' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      id: session.id,
      amountTotal: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency?.toUpperCase() || 'USD',
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email || null,
      petName: session.metadata?.pet_name || null,
      canvasSize: session.metadata?.canvas_size || null,
    });
  } catch (error) {
    console.error('[API checkout/session] Error retrieving session:', error);
    const message = error instanceof Error ? error.message : 'Failed to retrieve session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
