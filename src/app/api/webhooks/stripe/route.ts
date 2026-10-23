import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

/**
 * Stripe Webhook Handler
 *
 * Listens for verified Stripe payment events and automatically
 * creates fulfillment drafts in Printify for the store owner.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn(
      '[stripe-webhook] ⚠️ STRIPE_WEBHOOK_SECRET is not configured. Webhooks are inactive until a webhook endpoint is created in Stripe Dashboard.'
    );
    return NextResponse.json(
      {
        received: false,
        error:
          'Webhook secret is not configured. Please add STRIPE_WEBHOOK_SECRET in environment variables.',
      },
      { status: 503 }
    );
  }

  if (!sig) {
    console.error('[stripe-webhook] Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
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
          '| Currency:',
          session.currency,
          '| Customer:',
          session.customer_details?.email
        );

        // Extract shipping details from Stripe checkout session
        const sessionAny = session as unknown as {
          collected_information?: {
            shipping_details?: { name?: string; address?: Stripe.Address };
          };
          shipping_details?: { name?: string; address?: Stripe.Address };
        };
        const shippingDetails =
          sessionAny.collected_information?.shipping_details ||
          sessionAny.shipping_details;
        const addr = shippingDetails?.address || session.customer_details?.address;

        if (addr) {
          const recipientName =
            shippingDetails?.name ||
            session.customer_details?.name ||
            'Valued Customer';
          const nameParts = recipientName.trim().split(' ');
          const firstName = nameParts[0] || 'Valued';
          const lastName = nameParts.slice(1).join(' ') || 'Customer';

          try {
            const { createPrintifyOrder } = await import('@/lib/printify');
            const canvasSize =
              (session.metadata?.canvas_size as string) || '12x16';
            const hasOrderBump = session.metadata?.has_order_bump === 'true';

            const printifyItems: Array<{
              productType:
                | 'museum-canvas'
                | 'framed-print'
                | 'apparel'
                | 'ceramic-mug'
                | 'keepsake-keyring';
              size: string;
              quantity: number;
              printFileUrl?: string;
            }> = [
              {
                productType: 'museum-canvas',
                size: canvasSize,
                quantity: 1,
                printFileUrl: session.metadata?.print_file_url,
              },
            ];

            // If customer added the mug order bump
            if (hasOrderBump) {
              printifyItems.push({
                productType: 'ceramic-mug',
                size: '11oz',
                quantity: 1,
                printFileUrl: session.metadata?.print_file_url,
              });
            }

            // Create fulfillment order in Printify (saved as Draft for review)
            await createPrintifyOrder({
              externalId: session.id,
              shippingAddress: {
                first_name: firstName,
                last_name: lastName,
                email: session.customer_details?.email || '',
                phone: session.customer_details?.phone || '',
                country: addr.country || 'US',
                region: addr.state || '',
                address1: addr.line1 || '',
                address2: addr.line2 || '',
                city: addr.city || '',
                zip: addr.postal_code || '',
              },
              items: printifyItems,
              autoSubmit: false, // Draft mode: allows owner to verify before charging fulfillment cost
            });

            console.info(
              '[stripe-webhook] ✅ Printify order draft created successfully for session:',
              session.id
            );
          } catch (printifyErr) {
            console.error(
              '[stripe-webhook] ⚠️ Printify order draft creation failed:',
              printifyErr
            );
          }
        }
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.info('[stripe-webhook] Session expired:', session.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.warn(
          '[stripe-webhook] ❌ Payment failed:',
          intent.id,
          '| Reason:',
          intent.last_payment_error?.message
        );
        break;
      }

      default:
        break;
    }
  } catch (handlerError) {
    console.error(
      '[stripe-webhook] Handler error for event',
      event.type,
      ':',
      handlerError
    );
    return NextResponse.json({
      received: true,
      warning: 'Handler encountered an error but event was acknowledged',
    });
  }

  return NextResponse.json({ received: true });
}
