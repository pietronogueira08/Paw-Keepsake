import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[stripe-webhook] Missing signature or webhook secret');
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.info(
          '[stripe-webhook] ✅ Order completed:',
          session.id,
          '| Amount:',
          session.amount_total,
          '| Customer:',
          session.customer_details?.email,
        );

        // TODO: Trigger print dispatch to fulfillment partner
        // await triggerPrintDispatch(session);

        // TODO: Send order confirmation email via Resend
        // await sendOrderConfirmationEmail(session);

        // TODO: Fire server-side Meta CAPI Purchase event
        // await fireMetaCAPIPurchase(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.info('[stripe-webhook] Session expired:', session.id);
        // TODO: Send abandoned cart recovery email
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.warn('[stripe-webhook] ❌ Payment failed:', intent.id, '|', intent.last_payment_error?.message);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.info('[stripe-webhook] 🔄 Refund processed:', charge.id, '| Amount:', charge.amount_refunded);
        // TODO: Cancel print job if within 1 hour of order
        // TODO: Send refund confirmation email
        break;
      }

      default:
        // Silently acknowledge events we don't handle
        break;
    }
  } catch (handlerError) {
    console.error('[stripe-webhook] Handler error for event', event.type, ':', handlerError);
    // Return 200 to prevent Stripe from retrying — log the error internally
    return NextResponse.json({ received: true, warning: 'Handler failed but acknowledged' });
  }

  return NextResponse.json({ received: true });
}
